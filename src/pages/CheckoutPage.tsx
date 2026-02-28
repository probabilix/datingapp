import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { themeData } from '../data/themeData';
import { ShieldCheck, CreditCard, ChevronLeft } from 'lucide-react';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [dbCoupons, setDbCoupons] = useState<any[]>([]);
  const [purchaseItem, setPurchaseItem] = useState<any>(null);

  // Restored Coupon State and UI Logic
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');

  const planId = searchParams.get('plan');
  const isCustom = searchParams.get('custom');
  const customAmount = searchParams.get('amount');
  const customType = searchParams.get('type');
  const customCredits = searchParams.get('credits');

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success'; show: boolean }>({ message: '', type: 'error', show: false });

  const showToast = (message: string, type: 'error' | 'success' = 'error') => {
    setToast({ message, type, show: true });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
  };

  useEffect(() => {
    // Edge Case: Handle 'Free' Plan Selection
    if (planId === 'Free') {
      navigate('/dashboard');
      return;
    }

    const init = async () => {
      // Fetch settings & coupons concurrently
      const [, couponsRes, plansRes] = await Promise.all([
        supabase.from('payment_settings').select('*').eq('is_enabled', true),
        supabase.from('coupons').select('*').eq('is_enabled', true),
        planId ? supabase.from('plan_settings').select('*').eq('plan_name', planId).single() : Promise.resolve({ data: null })
      ]);

      if (couponsRes.data) setDbCoupons(couponsRes.data);

      if (isCustom && customAmount) {
        setPurchaseItem({
          id: 'custom-topup',
          name: customType === 'voice' ? 'Voice Credits Top-up' : 'Chat Credits Top-up',
          price: parseFloat(customAmount),
          credits: customCredits, // Pass this through to metadata later if needed
          type: customType
        });
      } else if (plansRes.data) {
        setPurchaseItem({
          id: plansRes.data.plan_name,
          name: `${plansRes.data.plan_name} Plan`,
          price: plansRes.data.price_usd
        });
      }

      setLoading(false);
    };
    init();
  }, [planId, isCustom, customAmount, customType, customCredits]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    // Validate against DB coupons
    const coupon = dbCoupons.find(c => c.code === code);

    if (!coupon) {
      setCouponError('INVALID CODE'); // Exact design behavior restored
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon(coupon);
    setCouponError('');
  };

  const discount = appliedCoupon && purchaseItem
    ? (appliedCoupon.type === 'percent' ? (purchaseItem.price * appliedCoupon.value) / 100 : appliedCoupon.value)
    : 0;

  const finalPrice = purchaseItem ? Math.max(0, purchaseItem.price - discount) : 0;


  const handleStripePayment = async () => {
    setIsProcessing(true);
    setCouponError(''); // Clear any previous errors

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/login'); return; }

      // 1. Prepare Payload
      const payload: any = {
        userId: session.user.id,
        type: isCustom ? 'credit' : 'plan',
        couponCode: appliedCoupon ? appliedCoupon.code : undefined // Send Coupon Code
      };

      if (isCustom) {
        payload.amount = parseFloat(customAmount || '0');
        payload.credits = parseInt(customCredits || '0');
        payload.creditType = customType; // 'voice' or 'chat'
      } else {
        payload.planName = planId;
      }

      // 2. Call Backend
      const response = await fetch(`${API_BASE_URL}/api/payments/stripe/create-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment initialization failed');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }

    } catch (err: any) {
      console.error("Payment Error:", err);
      // If error is about plan upgrade, show toast and redirect
      if (err.message.includes('Upgrade')) {
        showToast("Custom credits are only available for Pro and Elite members. Redirecting to billing...", 'error');
        setTimeout(() => navigate('/billing'), 3000);
      } else {
        showToast(`Payment Error: ${err.message}`, 'error');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: themeData.colors.bgSoft }}>
        <div className="animate-spin text-[#E94057]">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </div>
      </div>
    );
  }

  if (!purchaseItem) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: themeData.colors.bgSoft }}>
        <h2 className="text-xl font-bold text-gray-400">Item Not Found</h2>
        <button onClick={() => navigate('/billing')} className="px-6 py-3 bg-black text-white rounded-xl font-bold text-sm cursor-pointer">Return to Billing</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: themeData.colors.bgSoft }}>
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-5 right-5 z-50 px-6 py-4 rounded-xl shadow-2xl animate-in slide-in-from-top-5 duration-300 ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
          <div className="flex items-center gap-3">
            {toast.type === 'error' ? (
              <div className="bg-white/20 p-1 rounded-full"><ShieldCheck size={16} /></div>
            ) : (
              <div className="bg-white/20 p-1 rounded-full"><ShieldCheck size={16} /></div>
            )}
            <p className="font-bold text-sm">{toast.message}</p>
          </div>
        </div>
      )}

      <main className="flex-grow pt-10 pb-20 px-6 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* LEFT: Order Summary & Coupon System */}
          <div className="space-y-6">
            <button onClick={() => navigate('/billing')} className="flex items-center gap-2 text-sm font-bold opacity-40 hover:opacity-100 mb-4 cursor-pointer">
              <ChevronLeft size={16} /> Back to Plans
            </button>
            <h2 className="text-4xl font-bold mb-8" style={{ fontFamily: 'DM Serif Display' }}>Review Order</h2>

            <div className="p-6 md:p-10 rounded-[2.5rem] shadow-sm" style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-border)' }}>
              <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-input-solid)' }}><CreditCard className="text-[#E94057]" /></div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl md:text-2xl">{purchaseItem.name}</h3>
                  <p className="text-[10px] font-black uppercase text-gray-300">
                    {purchaseItem.credits ? `${purchaseItem.credits} ${purchaseItem.type === 'voice' ? 'Minutes' : 'Credits'}` : 'PCI-DSS Encrypted Asset'}
                  </p>
                </div>
                <div className="font-black text-3xl md:text-3xl">${purchaseItem.price}</div>
              </div>

              {/* Restored Coupon UI */}
              <div className="space-y-4">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    placeholder="COUPON CODE"
                    className="flex-1 p-4 md:p-5 rounded-2xl outline-none font-bold text-xs uppercase w-full"
                    style={{ backgroundColor: 'var(--color-input-solid)', color: 'var(--color-text-heading)', border: '1px solid var(--color-border)' }}
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  />
                  <button type="submit" className="text-white px-6 md:px-10 rounded-2xl font-bold text-xs cursor-pointer" style={{ backgroundColor: '#E94057' }}>APPLY</button>
                </form>
                {couponError && <p className="text-red-500 text-[10px] font-bold uppercase px-2">{couponError}</p>}
                {appliedCoupon && <p className="text-green-600 text-[10px] font-bold uppercase px-2">COUPON APPLIED: {appliedCoupon.code}</p>}
              </div>

              <div className="pt-8 border-t mt-8 space-y-4" style={{ borderColor: 'var(--color-border)' }}>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600 font-bold text-xs uppercase">
                    <span>Discount Applied</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-400 uppercase text-[10px]">Final Amount</span>
                  <span className="text-4xl md:text-5xl font-black text-[#E94057]">${finalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl flex items-center gap-4" style={{ backgroundColor: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <ShieldCheck className="text-green-500 shrink-0" />
              <p className="text-[10px] font-bold uppercase leading-tight" style={{ color: 'var(--color-text-body)' }}>Your data is protected by 256-bit SSL encryption and processed via certified PCI-compliant gateways.</p>
            </div>
          </div>

          {/* RIGHT: Direct Card Payment + 3rd Party Options */}
          <div className="p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl" style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-border)' }}>
            <h3 className="text-xl font-bold mb-8">Payment Method</h3>

            <div className="space-y-8">
              {/* Direct Stripe Form Area */}
              <div className="p-8 border-2 border-[#E94057]/10 rounded-[2.5rem] bg-pink-50/5">
                <div className="flex items-center gap-2 mb-6 font-bold text-xs uppercase text-[#E94057]">
                  <ShieldCheck size={16} /> Secure Payment
                </div>

                <div className="text-center py-6 space-y-4">
                  <div className="flex justify-center gap-4 text-gray-400 mb-4">
                    {/* Visa/Mastercard Icons or placeholders */}
                    <div className="w-10 h-6 rounded" style={{ backgroundColor: 'var(--color-input-solid)' }}></div>
                    <div className="w-10 h-6 rounded" style={{ backgroundColor: 'var(--color-input-solid)' }}></div>
                    <div className="w-10 h-6 rounded" style={{ backgroundColor: 'var(--color-input-solid)' }}></div>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">
                    You will be redirected to Stripe's secure checkout page to complete your purchase.
                  </p>
                </div>

                <button
                  disabled={isProcessing}
                  onClick={handleStripePayment}
                  className="w-full py-6 bg-[#E94057] text-white font-black rounded-2xl mt-4 shadow-xl uppercase text-xs hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  {isProcessing ? 'Processing...' : `Pay ${finalPrice.toFixed(2)} with Stripe`}
                </button>

                <div className="mt-4 text-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">No card details are stored on our servers</p>
                </div>
              </div>

              {/* 3rd Party Redirect Buttons */}
              {/* 3rd Party Redirects Removed as per request */}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;