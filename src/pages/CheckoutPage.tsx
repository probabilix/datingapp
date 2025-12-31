import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabaseClient';
import { themeData } from '../data/themeData';
import { pricingData } from '../data/pricingData';
import { couponData } from '../data/couponData';
import { ShieldCheck, Lock, CreditCard, ChevronLeft, Zap } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gateways, setGateways] = useState<any[]>([]);

  // Restored Coupon State and UI Logic
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');

  const planId = searchParams.get('plan');
  const purchaseItem = useMemo(() => {
    const plan = pricingData.find(p => p.id === planId);
    return plan ? { id: plan.id, name: plan.name, price: parseInt(plan.price) } : null;
  }, [planId]);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.from('payment_settings').select('*').eq('is_enabled', true);
      if (data) setGateways(data);
      setLoading(false);
    };
    init();
  }, []);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    const coupon = couponData.find(c => c.code === code && c.isEnabled);
    
    if (!coupon) { 
      setCouponError('INVALID CODE'); // Exact design behavior restored
      setAppliedCoupon(null); 
      return; 
    }
    
    setAppliedCoupon(coupon);
    setCouponError('');
  };

  const discount = appliedCoupon ? (appliedCoupon.type === 'percent' ? (purchaseItem!.price * appliedCoupon.value) / 100 : appliedCoupon.value) : 0;
  const finalPrice = Math.max(0, purchaseItem!.price - discount);

  // Modular payment calls for 3rd party redirects
  const handleRedirectPayment = async (gatewayId: string) => {
    setIsProcessing(true);
    const response = await fetch(`http://localhost:5000/api/payments/${gatewayId}/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: finalPrice, itemName: purchaseItem?.name })
    });
    const data = await response.json();
    if (data.url) window.location.href = data.url;
    setIsProcessing(false);
  };

  if (loading || !purchaseItem) return null;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: themeData.colors.bgSoft }}>
      <Header />
      <main className="flex-grow pt-28 pb-20 px-6 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* LEFT: Order Summary & Coupon System */}
          <div className="space-y-6">
            <button onClick={() => navigate('/billing')} className="flex items-center gap-2 text-sm font-bold opacity-40 hover:opacity-100 mb-4">
              <ChevronLeft size={16} /> Back to Plans
            </button>
            <h2 className="text-4xl font-bold mb-8" style={{ fontFamily: 'DM Serif Display' }}>Review Order</h2>
            
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm">
              <div className="flex items-center gap-6 mb-10">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center"><CreditCard className="text-[#E94057]" /></div>
                <div className="flex-1">
                  <h3 className="font-bold text-2xl">{purchaseItem.name} Plan</h3>
                  <p className="text-[10px] font-black uppercase text-gray-300">PCI-DSS Encrypted Asset</p>
                </div>
                <div className="font-black text-3xl">${purchaseItem.price}</div>
              </div>

              {/* Restored Coupon UI */}
              <div className="space-y-4">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input 
                    placeholder="COUPON CODE" 
                    className="flex-1 bg-gray-50 p-5 rounded-2xl outline-none font-bold text-xs uppercase" 
                    value={couponInput} 
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())} 
                  />
                  <button type="submit" className="bg-black text-white px-10 rounded-2xl font-bold text-xs">APPLY</button>
                </form>
                {couponError && <p className="text-red-500 text-[10px] font-bold uppercase px-2">{couponError}</p>}
                {appliedCoupon && <p className="text-green-600 text-[10px] font-bold uppercase px-2">COUPON APPLIED: {appliedCoupon.code}</p>}
              </div>
              
              <div className="pt-8 border-t mt-8 space-y-4">
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600 font-bold text-xs uppercase">
                    <span>Discount Applied</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                   <span className="font-bold text-gray-400 uppercase text-[10px]">Final Amount</span>
                   <span className="text-5xl font-black text-[#E94057]">${finalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50/50 p-6 rounded-3xl border border-green-100 flex items-center gap-4">
              <ShieldCheck className="text-green-600" />
              <p className="text-[10px] font-bold text-green-800 uppercase leading-tight">Your data is protected by 256-bit SSL encryption and processed via certified PCI-compliant gateways.</p>
            </div>
          </div>

          {/* RIGHT: Direct Card Payment + 3rd Party Options */}
          <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-gray-100">
            <h3 className="text-xl font-bold mb-8">Payment Method</h3>
            
            <div className="space-y-8">
              {/* Direct Stripe Form Area */}
              <div className="p-8 border-2 border-[#E94057]/10 rounded-[2.5rem] bg-pink-50/5">
                <div className="flex items-center gap-2 mb-6 font-bold text-xs uppercase text-[#E94057]">
                  <CreditCard size={16}/> Direct Card Payment
                </div>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase px-1">Card number</label>
                    <input placeholder="1234 1234 1234 1234" className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase px-1">Expiry</label>
                      <input placeholder="MM / YY" className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase px-1">CVC</label>
                      <input placeholder="123" className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium" />
                    </div>
                  </div>
                </div>
                <button 
                  disabled={isProcessing}
                  className="w-full py-6 bg-[#E94057] text-white font-black rounded-2xl mt-8 shadow-xl uppercase text-xs hover:brightness-110 active:scale-95 transition-all"
                >
                  Authorize ${finalPrice.toFixed(2)}
                </button>
              </div>

              {/* 3rd Party Redirect Buttons */}
              <div className="space-y-4">
                <div className="relative flex items-center justify-center py-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                  <span className="relative bg-white px-4 text-[10px] font-bold text-gray-300 uppercase tracking-widest">Or, use 3rd party provider</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleRedirectPayment('paypal')}
                    className="py-5 bg-[#003087] text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all text-xs"
                  >
                    PayPal
                  </button>
                  <button 
                    onClick={() => handleRedirectPayment('razorpay')}
                    className="py-5 bg-[#2B3481] text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition-all text-xs"
                  >
                    Razorpay
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;