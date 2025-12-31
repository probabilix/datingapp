import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabaseClient';
import { themeData } from '../data/themeData';
import { pricingData } from '../data/pricingData'; 
import { Check, Plus, CreditCard, ChevronRight, History } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BillingPage: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'plans' | 'addons'>('plans');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/login'); return; }
      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (data) setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, [navigate]);

  // Handler for Plan Selection
  const handlePlanSelect = (planId: string) => {
    navigate(`/checkout?plan=${planId}`);
  };

  // Handler for Add-on Selection
  const handleAddonSelect = (minutes: string) => {
    navigate(`/checkout?addon=${minutes}`);
  };

  if (loading) return null;

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: themeData.colors.bgSoft }}>
      <Helmet><title>Billing & Plans | DatingAdvice.io</title></Helmet>
      <Header />

      <main className="flex-grow pt-28 pb-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          
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
                <button className="px-8 py-4 rounded-2xl bg-[#12172D] text-white font-bold hover:scale-105 transition-all shadow-lg flex items-center gap-2">
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
                className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'plans' ? 'bg-white shadow-md text-[#12172D]' : 'text-gray-400'}`}>
                Subscription Plans
              </button>
              <button 
                onClick={() => setActiveTab('addons')}
                className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'addons' ? 'bg-white shadow-md text-[#12172D]' : 'text-gray-400'}`}>
                Add-on Credits
              </button>
            </div>
          </div>

          {/* DYNAMIC LISTING */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'plans' ? (
              pricingData.map((plan) => (
                <PricingCard 
                  key={plan.id}
                  {...plan}
                  isCurrent={profile?.plan_type?.toLowerCase() === plan.name.toLowerCase()}
                  onSelect={() => handlePlanSelect(plan.id)}
                />
              ))
            ) : (
              <>
                <AddonCard minutes="15" price="10" title="Quick Support" onSelect={() => handleAddonSelect('15')} />
                <AddonCard minutes="40" price="25" title="Relationship Deep-Dive" isFeatured={true} onSelect={() => handleAddonSelect('40')} />
                <AddonCard minutes="100" price="50" title="Pro Elite Access" onSelect={() => handleAddonSelect('100')} />
              </>
            )}
          </div>

          {/* TRANSACTION HISTORY */}
          <section className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold" style={{ fontFamily: 'DM Serif Display' }}>Order History</h3>
              <button className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
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
      <Footer />
    </div>
  );
};

const PricingCard = ({ name, price, period, features, isPopular, isCurrent, onSelect }: any) => (
  <div className={`relative bg-white p-10 rounded-[3rem] border-2 transition-all hover:shadow-2xl flex flex-col ${isPopular ? 'border-[#E94057] scale-105 z-10' : 'border-transparent shadow-sm'}`}>
    {isPopular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#E94057] text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Best Value</div>}
    <h4 className="text-2xl font-bold mb-4" style={{ color: themeData.colors.textHeading }}>{name}</h4>
    <div className="flex items-baseline gap-1 mb-8">
      <span className="text-4xl font-black">${price}</span>
      <span className="text-gray-400 text-sm">{period}</span>
    </div>
    <div className="space-y-4 mb-10 flex-grow">
      {features.map((f: string) => (
        <div key={f} className="flex items-start gap-3 text-sm font-medium text-gray-600 leading-tight">
          <Check size={16} className="text-green-500 mt-0.5 shrink-0" /> {f}
        </div>
      ))}
    </div>
    <button 
      disabled={isCurrent}
      onClick={onSelect}
      className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg ${isCurrent ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#E94057] text-white hover:brightness-110'}`}
    >
      {isCurrent ? 'Your Current Plan' : `Get ${name}`}
    </button>
  </div>
);

const AddonCard = ({ minutes, price, title, isFeatured, onSelect }: any) => (
  <div className={`bg-white p-10 rounded-[3rem] border-2 transition-all hover:shadow-xl flex flex-col items-center text-center ${isFeatured ? 'border-[#E94057]' : 'border-transparent shadow-sm'}`}>
    <div className="w-14 h-14 rounded-2xl bg-pink-50 text-[#E94057] flex items-center justify-center mb-6"><Plus size={28} /></div>
    <h4 className="text-xl font-bold mb-1">{title}</h4>
    <p className="text-3xl font-black mb-4">{minutes}m</p>
    <div className="text-sm font-bold text-gray-400 mb-8">${price} One-time</div>
    <button 
      onClick={onSelect}
      className="w-full py-4 rounded-2xl border-2 border-gray-100 font-bold hover:border-[#E94057] hover:text-[#E94057] transition-all"
    >
      Purchase Credits
    </button>
  </div>
);

export default BillingPage;