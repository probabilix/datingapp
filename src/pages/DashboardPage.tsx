import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/api';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabaseClient';
import { themeData } from '../data/themeData';
import { MessageSquare, Clock, ShieldCheck, Phone, Zap, Star, Activity, Sparkles, Lock, RotateCcw } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DiscoveryForm from '../components/DiscoveryForm';


const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [usage, setUsage] = useState<any>(null);
  const [advisors, setAdvisors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);



  // Ref to prevent double-firing of welcome email in StrictMode
  const welcomeEmailTriggered = React.useRef(false);
  const isFirstVisitRef = React.useRef<boolean | null>(null);
  const analysisBaselineRef = React.useRef<any>(null);
  const refreshTimeoutRef = React.useRef<any>(null);

  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleRefreshAnalysis = () => {
    analysisBaselineRef.current = profile?.persona_analysis ?? null;
    setShowAnalysis(false);
    setIsDiscoveryOpen(true);
  };

  const startSafetyTimeout = () => {
    // Safety fallback: If n8n completely fails and neither realtime nor polling catches it
    // within 60 seconds, force the UI to resolve so the user isn't stuck forever.
    if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
    refreshTimeoutRef.current = setTimeout(async () => {
      // Check if we are STILL pending after 60 seconds
      if (localStorage.getItem('discovery_pending') === 'true') {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data: latest } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (latest) {
          setProfile(latest);
          // If we actually have an analysis, show it. Otherwise, unfortunately, n8n failed.
          if (latest.persona_analysis && Object.keys(latest.persona_analysis).length > 0) {
            setShowAnalysis(true);
          }
        }

        analysisBaselineRef.current = null;
        localStorage.removeItem('discovery_pending');
        setIsAnalyzing(false);
      }
    }, 60000);
  };

  // Called when DiscoveryForm submits successfully
  const handleFormSuccess = () => {
    setIsAnalyzing(true);
    startSafetyTimeout();
  };

  useEffect(() => {
    // Sync initial state from storage, BUT prioritize profile data if it loads later
    const pending = localStorage.getItem('discovery_pending') === 'true';
    setIsAnalyzing(pending);
    if (pending) {
      startSafetyTimeout();
    }
  }, []);

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

        // Capture once: true = first ever visit, false = returning user
        if (isFirstVisitRef.current === null) {
          isFirstVisitRef.current = profileRes.data.welcome_email_sent === false;
        }

        // --- WELCOME EMAIL CHECK ---
        // If flag is false (new user or legacy), trigger email via backend
        if (profileRes.data.welcome_email_sent === false && !welcomeEmailTriggered.current) {
          welcomeEmailTriggered.current = true; // Lock immediately

          // Don't await, let it fail silently or succeed in background
          fetch(`${API_BASE_URL}/api/notifications/welcome`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: session.user.email,
              name: profileRes.data.full_name || session.user.user_metadata.full_name,
              userId: session.user.id
            })
          }).then(() => {
            // Update local state so we don't try again if the user navigates around (SPA)
            setProfile((prev: any) => ({ ...prev, welcome_email_sent: true }));
          }).catch(err => {
            console.error("[Dashboard] Welcome email trigger failed", err);
            // We DO NOT reset the lock here. If it failed, let's retry on next full page reload, 
            // not spam the API on every react render.
          });
        }

        // CRITICAL: If analysis arrived, clear the local storage lock immediately
        if (profileRes.data.persona_analysis && Object.keys(profileRes.data.persona_analysis).length > 0) {
          localStorage.removeItem('discovery_pending');
          setIsAnalyzing(false);
        } else if (!localStorage.getItem('discovery_pending')) {
          // New user with no analysis and no pending analysis — auto-open the discovery form
          // Small delay so the dashboard has time to render first
          setTimeout(() => setIsDiscoveryOpen(true), 600);
        }
      }
      if (usageRes.data) {
        setUsage(usageRes.data);
      }
      if (advisorsRes.data) setAdvisors(advisorsRes.data);
      setLoading(false);
    };

    fetchData();

    // Setup realtime after initial fetch
    let profileChannel: any;
    let usageChannel: any;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return;

      // --- PROFILE SYNC (plan level + analysis) ---
      profileChannel = supabase
        .channel(`profile-sync-${session.user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${session.user.id}`
          },
          (payload) => {
            setProfile(payload.new);

            // Handle persona analysis arrival
            const baseline = analysisBaselineRef.current;
            const isGenuinelyNew = payload.new.persona_analysis &&
              Object.keys(payload.new.persona_analysis).length > 0 &&
              JSON.stringify(payload.new.persona_analysis) !== JSON.stringify(baseline);

            if (isGenuinelyNew) {
              analysisBaselineRef.current = null;
              localStorage.removeItem('discovery_pending');
              setIsAnalyzing(false);
              setShowAnalysis(true);
            }
          }
        )
        .subscribe();

      // --- USAGE SYNC (voice mins, chat credits, plan) ---
      usageChannel = supabase
        .channel(`usage-sync-${session.user.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_usage',
            filter: `user_id=eq.${session.user.id}`
          },
          (payload) => {
            if (payload.new) setUsage(payload.new);
          }
        )
        .subscribe();
    });

    return () => {
      if (profileChannel) supabase.removeChannel(profileChannel);
      if (usageChannel) supabase.removeChannel(usageChannel);
      if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
    };
  }, [navigate]);

  // --- DEDICATED POLLING EFFECT ---
  // Runs a recursive poll whenever isAnalyzing=true.
  // Lives in its own useEffect so React state setters are never stale.
  useEffect(() => {
    if (!isAnalyzing) return;

    let stopped = false;

    const poll = async () => {
      if (stopped) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || stopped) return;

      const { data: newProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (stopped) return;

      const baseline = analysisBaselineRef.current;
      const isGenuinelyNew =
        newProfile?.persona_analysis &&
        Object.keys(newProfile.persona_analysis).length > 0 &&
        JSON.stringify(newProfile.persona_analysis) !== JSON.stringify(baseline);

      if (isGenuinelyNew) {
        analysisBaselineRef.current = null;
        setProfile(newProfile);
        localStorage.removeItem('discovery_pending');
        setIsAnalyzing(false);  // this stops the next poll via effect cleanup
        setShowAnalysis(true);
      } else if (!stopped) {
        setTimeout(poll, 5000);
      }
    };

    const timer = setTimeout(poll, 5000); // first poll after 5s
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [isAnalyzing]);

  const handleDivert = (agentId: string, mode: 'chat' | 'voice') => {
    navigate(`/consultation?agent=${agentId}&mode=${mode}`);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-page-bg)' }}>
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-[#E94057] rounded-full"></div>
        <p className="text-xs font-black uppercase tracking-widest opacity-20">Loading Intelligence...</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen relative" style={{ backgroundColor: themeData.colors.bgSoft }}>
      <Helmet><title>Dashboard | DatingAdvice.io</title></Helmet>

      {/* Main Content */}
      <div className="flex flex-col min-h-screen transition-all duration-500">
        <Header />

        <main className="flex-grow pt-24 pb-12 animate-in fade-in slide-in-from-top-4 duration-700">

          <section className="px-6 md:px-12 lg:px-24 mb-10">
            <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 text-white shadow-2xl"
              style={{ backgroundColor: 'var(--color-hero-bg)' }}>

              <div className="absolute top-[-15%] right-[-10%] w-72 h-72 opacity-20 blur-[100px] animate-pulse"
                style={{ backgroundColor: themeData.colors.brand }}></div>
              <div className="absolute bottom-[-15%] left-[-10%] w-64 h-64 bg-blue-600 opacity-15 blur-[100px]"></div>

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[9px] font-black uppercase tracking-widest mb-6 border border-white/10">
                    <Activity size={10} className="text-green-400 animate-pulse" /> AI Analysis Active
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'DM Serif Display' }}>
                    {isFirstVisitRef.current
                      ? `Let's go, ${profile?.full_name?.split(' ')[0] || 'there'}.`
                      : `Welcome back, ${profile?.full_name?.split(' ')[0] || 'User'}.`
                    }
                  </h2>
                  <p className="text-white/60 text-base leading-relaxed">
                    Your relationship growth is our priority. Let's find your perfect match in strategy today.
                  </p>
                </div>

                {/* Updated Logic: Use State instead of localStorage direct read */}
                {/* Updated Logic: Single Source of Truth - If analysis exists, SHOW IT. Else if waiting, show loader. */}
                {/* Updated Logic: Single Source of Truth - If analysis exists, SHOW IT. Else if waiting, show loader. */}
                {/* Show analyzing spinner any time isAnalyzing is true — first time OR refresh */}
                {isAnalyzing ? (
                  <div className="px-8 py-4 bg-white/10 border border-white/20 rounded-2xl flex items-center gap-3 italic text-sm text-white/60">
                    <Clock size={16} className="animate-spin" /> Analyzing your persona...
                  </div>
                ) : (
                  <button
                    onClick={() => profile?.persona_analysis ? setShowAnalysis(!showAnalysis) : setIsDiscoveryOpen(true)}
                    className="px-8 py-4 rounded-2xl font-bold shadow-xl flex items-center gap-3 transition-all hover:brightness-110 active:scale-95"
                    style={{ backgroundColor: themeData.colors.brand, color: '#FFFFFF' }}>
                    {profile?.persona_analysis ? 'View My Analysis' : 'Launch Analysis'} <Zap size={16} fill="currentColor" />
                  </button>
                )}
              </div>

              {showAnalysis && profile?.persona_analysis && (
                <div className="relative z-10 mt-8 p-6 md:p-8 bg-white/10 backdrop-blur-lg rounded-[2.5rem] border border-white/10 animate-in slide-in-from-top-4 duration-500">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <Sparkles className="text-[#E94057]" size={20} />
                      <h4 className="text-xl font-bold">AI Persona Insight</h4>
                    </div>
                    <button
                      onClick={handleRefreshAnalysis}
                      title="Re-analyse with updated answers"
                      className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white/90 transition-colors cursor-pointer"
                    >
                      <RotateCcw size={13} />
                      Refresh
                    </button>
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
            <div className="flex overflow-x-auto md:overflow-visible md:grid md:grid-cols-3 gap-6 no-scrollbar pb-4">
              <Link to="/billing" className="block min-w-[240px] md:min-w-0">
                <StatCard icon={<Clock size={22} />} title="Voice Time" value={`${usage?.voice_minutes_left || 0}m`} color="bg-blue-500" />
              </Link>
              <Link to="/billing" className="block min-w-[240px] md:min-w-0">
                <StatCard icon={<MessageSquare size={22} />} title="Chat Credits" value={`${Number(usage?.messages_left || 0).toFixed(2)} left`} color="bg-purple-500" />
              </Link>
              <Link to="/billing" className="block min-w-[240px] md:min-w-0">
                <StatCard icon={<ShieldCheck size={22} />} title="Plan Level" value={usage?.plan_type || 'Free'} color={themeData.colors.brand} />
              </Link>
            </div>
          </section>

          <section className="px-6 md:px-12 lg:px-24">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold" style={{ fontFamily: 'DM Serif Display', color: themeData.colors.textHeading }}>Expert Advisors</h3>
              {/* REMOVED REFRESH BUTTON */}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {advisors.map((advisor, index) => {
                const isFreeUser = !usage?.plan_type || usage?.plan_type === 'Free';
                const isLocked = isFreeUser && index >= 4;

                const handleAdvisorClick = (type: 'chat' | 'voice') => {
                  if (isLocked) {
                    navigate('/billing');
                  } else {
                    handleDivert(advisor.id, type);
                  }
                };

                return (
                  <div
                    key={advisor.id}
                    className={`group rounded-[2.5rem] p-6 md:p-8 shadow-sm transition-all flex flex-col items-center relative border overflow-hidden ${isLocked
                      ? 'cursor-pointer animate-breathing-glow'
                      : 'hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:border-[#E94057]/20'
                      }`}
                    style={{
                      backgroundColor: 'var(--color-card-bg)',
                      borderColor: 'var(--color-border-soft)'
                    }}
                    onClick={isLocked ? () => navigate('/billing') : undefined}
                  >
                    {/* Photo */}
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-[#E94057]/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <img src={advisor.image_url} alt={advisor.name}
                        className={`w-24 h-24 md:w-28 md:h-28 rounded-[2rem] md:rounded-[2.5rem] object-cover shadow-2xl relative z-10 transition-transform duration-500 ${!isLocked ? 'group-hover:scale-105 group-hover:rotate-1' : 'opacity-[0.85]'}`} />

                      {/* Online status indicator */}
                      {advisor.is_online && !isLocked && (
                        <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 rounded-full shadow-lg z-20 animate-pulse" style={{ borderColor: 'var(--color-card-bg)' }} />
                      )}

                      {/* Lock badge on photo — only for locked */}
                      {isLocked && (
                        <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center shadow-xl border-2 border-white/10 backdrop-blur-md z-20 animate-breathing-glow" style={{ backgroundColor: themeData.colors.brand }}>
                          <Lock size={12} className="text-white" />
                        </div>
                      )}
                    </div>

                    {/* Rating */}
                    <div className={`flex items-center gap-1 text-yellow-500 text-[10px] mb-1 px-2 py-0.5 rounded-full ${isLocked ? 'opacity-[0.8]' : ''}`} style={{ backgroundColor: 'rgba(255, 193, 7, 0.18)' }}>
                      <Star size={10} fill="currentColor" /> {advisor.rating}
                    </div>

                    {/* Name */}
                    <h4 className={`text-sm md:text-xl font-bold mb-0.5 text-center ${isLocked ? 'opacity-[0.85]' : ''}`} style={{ fontFamily: 'DM Serif Display', color: themeData.colors.textHeading }}>{advisor.name}</h4>

                    {/* Specialty */}
                    <p className={`text-[9px] md:text-[11px] uppercase font-bold tracking-wide mb-6 text-center ${isLocked ? 'opacity-50' : 'opacity-80'}`}>{advisor.specialty}</p>

                    {/* Action area — upgrade CTA for locked, buttons for unlocked */}
                    {isLocked ? (
                      <div className="w-full mt-auto">
                        <div
                          className="w-full h-10 md:h-12 rounded-xl flex items-center justify-center gap-1.5"
                          style={{ backgroundColor: themeData.colors.brand }}
                        >
                          <Lock size={11} className="text-white" />
                          {/* Short on mobile, full on desktop */}
                          <span className="md:hidden text-[10px] text-white font-black uppercase tracking-wider">Upgrade</span>
                          <span className="hidden md:block text-[10px] text-white font-black uppercase tracking-widest">Upgrade to Unlock</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2 w-full mt-auto">
                        <button
                          onClick={() => handleAdvisorClick('chat')}
                          className="flex-1 h-10 md:h-12 rounded-xl flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-inner cursor-pointer"
                          style={{ backgroundColor: 'var(--color-input-solid)', color: 'var(--color-text-body)' }}>
                          <MessageSquare size={16} />
                        </button>
                        <button
                          onClick={() => handleAdvisorClick('voice')}
                          className="flex-1 h-10 md:h-12 rounded-xl text-white flex items-center justify-center transition-all shadow-md hover:brightness-110 active:scale-95 cursor-pointer"
                          style={{ backgroundColor: themeData.colors.brand }}>
                          <Phone size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </main>

        <DiscoveryForm
          isOpen={isDiscoveryOpen}
          onClose={() => setIsDiscoveryOpen(false)}
          userId={profile?.id}
          onSuccess={handleFormSuccess}
        />

        <Footer />
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }: any) => {
  const isHex = color.startsWith('#');
  return (
    <div className="w-full rounded-[2.5rem] border p-7 flex items-center gap-5 group transition-all cursor-pointer hover:shadow-xl hover:translate-y-[-2px] active:scale-[0.98]"
      style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border-soft)' }}>
      <div className={`w-14 h-14 rounded-2xl text-white flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 ${!isHex ? color : ''}`}
        style={isHex ? { backgroundColor: color, boxShadow: `0 12px 24px -8px ${color}66` } : {}}>{icon}</div>
      <div>
        <p className="text-[10px] font-black uppercase opacity-80 tracking-[0.15em] mb-1.5" style={{ color: themeData.colors.textBody }}>{title}</p>
        <h3 className="text-2xl font-bold tracking-tight" style={{ color: themeData.colors.textHeading }}>{value}</h3>
      </div>
    </div>
  );
};

export default DashboardPage;