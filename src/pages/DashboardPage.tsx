import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabaseClient';
import { themeData } from '../data/themeData';
import { MessageSquare, Clock, ShieldCheck, Phone, Zap, Star, Activity, Sparkles } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DiscoveryForm from '../components/DiscoveryForm';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [usage, setUsage] = useState<any>(null);
  const [advisors, setAdvisors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      const [profileRes, usageRes, advisorsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', session.user.id).single(),
        supabase.from('user_usage').select('*').eq('user_id', session.user.id).single(),
        supabase.from('advisors').select('*').order('id', { ascending: true })
      ]);

      if (profileRes.data) {
        setProfile(profileRes.data);
        // CRITICAL: If analysis arrived, clear the local storage lock
        if (profileRes.data.persona_analysis && Object.keys(profileRes.data.persona_analysis).length > 0) {
          localStorage.removeItem('discovery_pending');
        }
      }
      if (usageRes.data) setUsage(usageRes.data);
      if (advisorsRes.data) setAdvisors(advisorsRes.data);
      setLoading(false);
    };
    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (!loading && profile) {
      const hasAnalysis = profile.persona_analysis && Object.keys(profile.persona_analysis).length > 0;
      const isPending = localStorage.getItem('discovery_pending') === 'true';

      // Only open discovery if they don't have an analysis AND haven't just submitted one
      if (!hasAnalysis && !isPending) {
        setIsDiscoveryOpen(true);
      }
    }
  }, [profile, loading]);

  const handleDivert = (agentId: string, mode: 'chat' | 'voice') => {
    navigate(`/consultation?agent=${agentId}&mode=${mode}`);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-[#E94057] rounded-full"></div>
        <p className="text-xs font-black uppercase tracking-widest opacity-20">Loading Intelligence...</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: themeData.colors.bgSoft }}>
      <Helmet><title>Dashboard | DatingAdvice.io</title></Helmet>

      <Header />

      <main className="flex-grow pt-24 pb-12 animate-in fade-in slide-in-from-top-4 duration-700">

        <section className="px-6 md:px-12 lg:px-24 mb-10">
          <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 text-white shadow-2xl"
            style={{ backgroundColor: themeData.colors.textHeading }}>

            <div className="absolute top-[-15%] right-[-10%] w-72 h-72 opacity-25 blur-[100px] animate-pulse"
              style={{ backgroundColor: themeData.colors.brand }}></div>
            <div className="absolute bottom-[-15%] left-[-10%] w-64 h-64 bg-blue-600 opacity-15 blur-[100px]"></div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[9px] font-black uppercase tracking-widest mb-6 border border-white/10">
                  <Activity size={10} className="text-green-400 animate-pulse" /> AI Analysis Active
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'DM Serif Display' }}>
                  Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}
                </h2>
                <p className="text-white/60 text-base leading-relaxed">
                  Your relationship growth is our priority. Let's find your perfect match in strategy today.
                </p>
              </div>

              {/* Updated Logic: Show 'Processing' if lock is active */}
              {localStorage.getItem('discovery_pending') === 'true' && !profile?.persona_analysis ? (
                <div className="px-8 py-4 bg-white/10 border border-white/20 rounded-2xl flex items-center gap-3 italic text-sm text-white/60">
                  <Clock size={16} className="animate-spin" /> Analyzing your persona...
                </div>
              ) : (
                <button
                  onClick={() => profile?.persona_analysis ? setShowAnalysis(!showAnalysis) : setIsDiscoveryOpen(true)}
                  className="px-8 py-4 bg-white font-bold rounded-2xl hover:scale-105 transition-all shadow-xl flex items-center gap-3"
                  style={{ color: themeData.colors.textHeading }}>
                  {profile?.persona_analysis ? 'View My Analysis' : 'Launch Analysis'} <Zap size={16} fill="currentColor" />
                </button>
              )}
            </div>

            {showAnalysis && profile?.persona_analysis && (
              <div className="relative z-10 mt-8 p-6 md:p-8 bg-white/10 backdrop-blur-lg rounded-[2.5rem] border border-white/10 animate-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="text-[#E94057]" size={20} />
                  <h4 className="text-xl font-bold">AI Persona Insight</h4>
                </div>
                <p className="text-white/80 leading-relaxed text-sm md:text-base mb-6">
                  {profile.persona_analysis.summary || "Your analysis is being processed..."}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] font-black uppercase opacity-40 w-full mb-1">Recommended Experts:</span>
                  {profile.persona_analysis.recommended_advisors?.map((name: string) => (
                    <span key={name} className="px-4 py-1.5 bg-[#E94057] rounded-full text-[11px] font-bold shadow-lg">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="px-6 md:px-12 lg:px-24 mb-12">
          <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-6 no-scrollbar pb-2 md:pb-0">
            <StatCard icon={<Clock size={22} />} title="Voice Time" value={`${usage?.voice_minutes_left || 0}m`} color="bg-blue-500" />
            <StatCard icon={<MessageSquare size={22} />} title="Chat Credits" value={`${usage?.messages_left || 0} left`} color="bg-purple-500" />
            <StatCard icon={<ShieldCheck size={22} />} title="Plan Level" value={usage?.plan_type || 'Free'} color={themeData.colors.brand} />
          </div>
        </section>

        <section className="px-6 md:px-12 lg:px-24">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold" style={{ fontFamily: 'DM Serif Display', color: themeData.colors.textHeading }}>Expert Advisors</h3>
            {/* REMOVED REFRESH BUTTON */}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {advisors.map((advisor) => (
              <div key={advisor.id} className="group bg-white rounded-[2rem] p-5 md:p-8 border border-gray-50 shadow-sm hover:shadow-md transition-all flex flex-col items-center">
                <div className="relative mb-5">
                  <img src={advisor.image_url} alt={advisor.name}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] md:rounded-[2rem] object-cover shadow-sm transition-transform group-hover:scale-105" />
                  {advisor.is_online && <div className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm" />}
                </div>

                <div className="flex items-center gap-1 text-yellow-500 text-[10px] mb-1 px-2 py-0.5 bg-yellow-50 rounded-full">
                  <Star size={10} fill="currentColor" /> {advisor.rating}
                </div>

                <h4 className="text-sm md:text-xl font-bold mb-0.5 text-center" style={{ fontFamily: 'DM Serif Display', color: themeData.colors.textHeading }}>{advisor.name}</h4>
                <p className="text-[9px] md:text-[11px] uppercase font-bold opacity-30 tracking-wide mb-6 text-center">{advisor.specialty}</p>

                <div className="flex gap-2 w-full mt-auto">
                  <button
                    onClick={() => handleDivert(advisor.id, 'chat')}
                    className="flex-1 h-10 md:h-12 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-inner cursor-pointer">
                    <MessageSquare size={16} />
                  </button>
                  <button
                    onClick={() => handleDivert(advisor.id, 'voice')}
                    className="flex-1 h-10 md:h-12 rounded-xl text-white flex items-center justify-center transition-all shadow-md hover:brightness-110 active:scale-95 cursor-pointer"
                    style={{ backgroundColor: themeData.colors.brand }}>
                    <Phone size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <DiscoveryForm
        isOpen={isDiscoveryOpen}
        onClose={() => setIsDiscoveryOpen(false)}
        userId={profile?.id}
      />

      <Footer />
    </div>
  );
};

const StatCard = ({ icon, title, value, color }: any) => {
  const isHex = color.startsWith('#');
  return (
    <div className="min-w-[240px] md:min-w-0 bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm flex items-center gap-4 group transition-all">
      <div className={`w-12 h-12 rounded-xl text-white flex items-center justify-center shadow-md transition-transform group-hover:rotate-6 ${!isHex ? color : ''}`} style={isHex ? { backgroundColor: color } : {}}>{icon}</div>
      <div>
        <p className="text-[9px] font-black uppercase opacity-20 tracking-widest mb-0.5" style={{ color: themeData.colors.textBody }}>{title}</p>
        <h3 className="text-xl font-bold" style={{ color: themeData.colors.textHeading }}>{value}</h3>
      </div>
    </div>
  );
};

export default DashboardPage;