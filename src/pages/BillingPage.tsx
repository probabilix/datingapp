import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabaseClient';
import { themeData } from '../data/themeData';
// import { pricingData } from '../data/pricingData';
import { CreditCard, ChevronRight, History, ChevronLeft } from 'lucide-react';
import PricingCard from '../components/PricingCard';

const BillingPage: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'plans' | 'addons'>('plans');

  const [plans, setPlans] = useState<any[]>([]);
  const [creditRates, setCreditRates] = useState<any>({});
  const [customAmount, setCustomAmount] = useState(10);
  const [customType, setCustomType] = useState<'voice' | 'chat'>('voice');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    const loadAllData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { navigate('/login'); return; }

        // 1. Fetch Profile
        const profilePromise = supabase.from('profiles').select('*').eq('id', session.user.id).single();

        // 2. Fetch Plans & Rates
        const plansPromise = supabase.from('plan_settings').select('*').order('price_usd');
        const ratesPromise = supabase.from('credit_rates').select('*');

        const [profileRes, plansRes, ratesRes] = await Promise.all([profilePromise, plansPromise, ratesPromise]);

        if (profileRes.data) setProfile(profileRes.data);

        if (plansRes.error) console.error("Error plans:", plansRes.error);
        if (plansRes.data) setPlans(plansRes.data);

        if (ratesRes.data) {
          const rates = ratesRes.data.reduce((acc: any, curr: any) => ({
            ...acc,
            [curr.rate_id]: curr.units_per_dollar
          }), {});
          setCreditRates(rates);
        }
      } catch (e) {
        console.error("Critical Load Error:", e);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [navigate]);

  // Handler for Plan Selection
  const handlePlanSelect = (planName: string) => {
    navigate(`/checkout?plan=${planName}`);
  };

  const handleCustomTopUp = () => {
    navigate(`/checkout?custom=true&type=${customType}&amount=${customAmount}&credits=${customCredits}`);
  };

  const customCredits = React.useMemo(() => {
    const rate = customType === 'voice' ? (creditRates['voice_per_dollar'] || 2) : (creditRates['chat_per_dollar'] || 400);
    return Math.floor(customAmount * rate);
  }, [customAmount, customType, creditRates]);


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

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: themeData.colors.bgSoft }}>
      <Helmet><title>Billing & Plans | DatingAdvice.io</title></Helmet>

      <main className="flex-grow pt-10 pb-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-sm font-bold opacity-40 hover:opacity-100 mb-6 transition-opacity cursor-pointer"
          >
            <ChevronLeft size={16} /> Back to Dashboard
          </button>

          {/* CURRENT STATUS GRID */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="md:col-span-2 bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <span className="text-[10px] font-black uppercase opacity-30 tracking-[0.2em]">Current Status</span>
                <h2 className="text-4xl font-bold mt-1" style={{ color: themeData.colors.textHeading, fontFamily: 'DM Serif Display' }}>
                  {profile?.plan_type || 'Trial'} Plan
                </h2>
                <p className="text-gray-400 mt-2">Active subscription for {profile?.email}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button className="px-8 py-4 rounded-2xl bg-[#12172D] text-white font-bold hover:scale-105 transition-all shadow-lg flex items-center gap-2 cursor-pointer">
                  Manage Billing <CreditCard size={18} />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm text-center flex flex-col justify-center">
              <span className="text-[10px] font-black uppercase opacity-30 tracking-[0.2em] mb-2">Available Time</span>
              <div className="text-4xl font-black text-[#E94057] mb-1">{profile?.talk_time_minutes || 0}m</div>
              <p className="text-xs font-bold text-gray-300 uppercase tracking-tighter">Voice Minutes Left</p>
            </div>
          </section>

          {/* TAB TOGGLE */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100/50 p-1.5 rounded-2xl flex gap-2">
              <button
                onClick={() => setActiveTab('plans')}
                className={`px-8 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${activeTab === 'plans' ? 'bg-white shadow-md text-[#12172D]' : 'text-gray-400'}`}>
                Subscription Plans
              </button>
              <button
                onClick={() => setActiveTab('addons')}
                className={`px-8 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${activeTab === 'addons' ? 'bg-white shadow-md text-[#12172D]' : 'text-gray-400'}`}>
                Add-on Credits
              </button>
            </div>
          </div>

          {/* DYNAMIC LISTING */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'plans' ? (
              plans.length > 0 ? (
                plans.map((plan) => (
                  <PricingCard
                    key={plan.plan_name}
                    name={plan.plan_name}
                    price={plan.price_usd}
                    period="/month"
                    features={plan.features || []}
                    isPopular={plan.plan_name === 'Elite'}
                    isCurrent={profile?.plan_type?.toLowerCase() === plan.plan_name.toLowerCase()}
                    onSelect={() => handlePlanSelect(plan.plan_name)}
                    buttonText={plan.button_text}
                  />
                ))
              ) : (
                <div className="col-span-1 md:col-span-3 text-center py-12 bg-white rounded-[2rem]">
                  <h3 className="text-xl font-bold text-gray-400">No Plans Available</h3>
                  <p className="text-xs text-red-400 mt-2 font-mono">DB Error or Emtpy Table (Check RLS Policies)</p>
                </div>
              )
            ) : (
              <div className="md:col-span-3">
                <div className="bg-white p-10 rounded-[3rem] border-2 border-transparent shadow-sm flex flex-col items-center text-center max-w-2xl mx-auto">
                  <h3 className="text-2xl font-bold mb-6">Custom Top-Up</h3>

                  <div className="flex gap-4 mb-8 bg-gray-50 p-2 rounded-2xl">
                    <button
                      onClick={() => setCustomType('voice')}
                      className={`px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${customType === 'voice' ? 'bg-white shadow-md text-[#E94057]' : 'text-gray-400'}`}
                    >
                      Voice Credits
                    </button>
                    <button
                      onClick={() => setCustomType('chat')}
                      className={`px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${customType === 'chat' ? 'bg-white shadow-md text-[#E94057]' : 'text-gray-400'}`}
                    >
                      Chat Messages
                    </button>
                  </div>

                  <div className="w-full max-w-md space-y-6">
                    <div className="relative">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block text-left">Amount (USD)</label>
                      <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl font-black text-gray-300">$</span>
                        <input
                          type="number"
                          min="1"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(Math.max(1, parseInt(e.target.value) || 0))}
                          className="w-full pl-12 pr-6 py-5 bg-gray-50 rounded-2xl text-2xl font-black outline-none focus:ring-2 ring-pink-100 transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-4 text-gray-300">
                      <div className="h-px bg-gray-100 flex-1"></div>
                      <span className="text-xs font-bold uppercase">You Get</span>
                      <div className="h-px bg-gray-100 flex-1"></div>
                    </div>

                    <div className="text-center">
                      <div className="text-5xl font-black text-[#E94057] mb-2 animate-in zoom-in duration-300 key={customAmount}">
                        {customCredits}
                      </div>
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                        {customType === 'voice' ? 'Voice Minutes' : 'Chat Messages'}
                      </p>
                    </div>

                    <button
                      onClick={handleCustomTopUp}
                      className="w-full py-5 bg-[#12172D] text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Proceed to Checkout <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* TRANSACTION HISTORY */}
          <section className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold" style={{ fontFamily: 'DM Serif Display' }}>Order History</h3>
              <button className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2 cursor-pointer">
                View History <History size={14} />
              </button>
            </div>
            <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50 text-[10px] uppercase tracking-widest text-gray-400">
                    <th className="px-10 py-6">Order Details</th>
                    <th className="px-10 py-6">Status</th>
                    <th className="px-10 py-6 text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium">
                  <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-10 py-6 font-bold text-[#12172D]">Initial Trial Access</td>
                    <td className="px-10 py-6"><span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase">Fulfilled</span></td>
                    <td className="px-10 py-6 text-right font-black">$0.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default BillingPage;