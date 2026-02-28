import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabaseClient';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { aboutData } from '../data/aboutData';
import { themeData } from '../data/themeData';
import { Target, Eye, Heart, Users, TrendingUp, Award, Sparkles, ChevronRight } from 'lucide-react';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [siteStats, setSiteStats] = useState<{ label: string; value: string }[]>(aboutData.stats);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setCheckingAuth(false);
    };
    checkAuth();
  }, []);

  // Fetch stats from DB — admin can update these from the admin panel
  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from('site_stats')
        .select('stat_label, stat_value')
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) {
        setSiteStats(data.map(s => ({ label: s.stat_label, value: s.stat_value })));
      }
    };
    fetchStats();
  }, []);

  const handleCtaClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const valueIcons = [Target, Heart, Award, TrendingUp];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: themeData.colors.bgSoft }}>
      <Helmet>
        <title>{aboutData.seo.title}</title>
        <meta name="description" content={aboutData.seo.description} />
        <meta name="keywords" content={aboutData.seo.keywords} />
        <meta property="og:title" content={aboutData.seo.title} />
        <meta property="og:description" content={aboutData.seo.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://datingadvice.io/about" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={aboutData.seo.title} />
        <meta name="twitter:description" content={aboutData.seo.description} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "DatingAdvice.io",
            "description": aboutData.mission.content,
            "url": "https://datingadvice.io",
          })}
        </script>
      </Helmet>

      <Header />

      <main className="flex-grow pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-6">
        <div className="max-w-[1100px] mx-auto">

          {/* ── Hero ───────────────────────────────────────── */}
          <section className="mb-10 md:mb-16">
            <Link to="/" className="text-[10px] font-black opacity-30 hover:opacity-100 uppercase tracking-widest mb-6 inline-block transition-opacity">
              ← Back
            </Link>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 leading-tight"
              style={{ fontFamily: 'DM Serif Display', color: themeData.colors.textHeading }}>
              {aboutData.title}
            </h1>
            <p className="text-sm md:text-lg font-medium opacity-60 max-w-2xl leading-relaxed"
              style={{ color: themeData.colors.textBody }}>
              {aboutData.subtitle}
            </p>
          </section>

          {/* ── Stats ──────────────────────────────────────── */}
          <section className="mb-10 md:mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {siteStats.map((stat, idx) => (
                <div key={idx} className="rounded-2xl md:rounded-[2rem] p-4 md:p-8 text-center shadow-sm overflow-hidden" style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-border)' }}>
                  <div className="text-xl md:text-2xl font-black mb-1 whitespace-nowrap leading-tight"
                    style={{ color: themeData.colors.brand }}>
                    {stat.value}
                  </div>
                  <p className="text-[9px] md:text-[11px] font-bold uppercase tracking-wider opacity-60"
                    style={{ color: themeData.colors.textBody }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Mission ────────────────────────────────────── */}
          <section className="mb-6 md:mb-10">
            <div className="rounded-2xl md:rounded-[2.5rem] p-6 md:p-12 shadow-sm" style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-border)' }}>
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${themeData.colors.brand}20` }}>
                  <Target size={20} className="md:hidden" style={{ color: themeData.colors.brand }} />
                  <Target size={28} className="hidden md:block" style={{ color: themeData.colors.brand }} />
                </div>
                <h2 className="text-xl md:text-3xl font-bold"
                  style={{ fontFamily: 'DM Serif Display', color: themeData.colors.textHeading }}>
                  {aboutData.mission.heading}
                </h2>
              </div>
              <p className="text-sm md:text-base leading-relaxed opacity-75"
                style={{ color: themeData.colors.textBody }}>
                {aboutData.mission.content}
              </p>
            </div>
          </section>

          {/* ── Vision ─────────────────────────────────────── */}
          <section className="mb-6 md:mb-10">
            <div className="rounded-2xl md:rounded-[2.5rem] p-6 md:p-12" style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-border)' }}>
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shadow-md flex-shrink-0" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                  <Eye size={20} className="md:hidden" style={{ color: themeData.colors.brand }} />
                  <Eye size={28} className="hidden md:block" style={{ color: themeData.colors.brand }} />
                </div>
                <h2 className="text-xl md:text-3xl font-bold"
                  style={{ fontFamily: 'DM Serif Display', color: themeData.colors.textHeading }}>
                  {aboutData.vision.heading}
                </h2>
              </div>
              <p className="text-sm md:text-base leading-relaxed opacity-75"
                style={{ color: themeData.colors.textBody }}>
                {aboutData.vision.content}
              </p>
            </div>
          </section>

          {/* ── Values ─────────────────────────────────────── */}
          <section className="mb-6 md:mb-10">
            <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-3 text-center"
              style={{ fontFamily: 'DM Serif Display', color: themeData.colors.textHeading }}>
              Our Core Values
            </h2>
            <p className="text-center text-xs md:text-sm opacity-60 mb-6 md:mb-10 max-w-xl mx-auto leading-relaxed"
              style={{ color: themeData.colors.textBody }}>
              The principles that guide everything we do at DatingAdvice.io
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {aboutData.values.map((value, idx) => {
                const IconComponent = valueIcons[idx];
                return (
                  <div key={idx} className="rounded-2xl md:rounded-[2rem] p-5 md:p-8 shadow-sm" style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-border)' }}>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${themeData.colors.brand}15` }}>
                      <IconComponent size={20} style={{ color: themeData.colors.brand }} />
                    </div>
                    <h3 className="text-base md:text-xl font-bold mb-2"
                      style={{ color: themeData.colors.textHeading }}>
                      {value.title}
                    </h3>
                    <p className="text-xs md:text-sm leading-relaxed opacity-70"
                      style={{ color: themeData.colors.textBody }}>
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Team ───────────────────────────────────────── */}
          <section className="mb-6 md:mb-10">
            <div className="rounded-2xl md:rounded-[2.5rem] p-6 md:p-12" style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-border)' }}>
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shadow-md flex-shrink-0" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                  <Users size={20} className="md:hidden" style={{ color: themeData.colors.brand }} />
                  <Users size={28} className="hidden md:block" style={{ color: themeData.colors.brand }} />
                </div>
                <h2 className="text-xl md:text-3xl font-bold"
                  style={{ fontFamily: 'DM Serif Display', color: themeData.colors.textHeading }}>
                  {aboutData.team.heading}
                </h2>
              </div>
              <p className="text-sm md:text-base leading-relaxed opacity-75"
                style={{ color: themeData.colors.textBody }}>
                {aboutData.team.content}
              </p>
            </div>
          </section>

          {/* ── CTA ────────────────────────────────────────── */}
          <section>
            <div className="rounded-2xl md:rounded-[2.5rem] p-8 md:p-16 text-center shadow-xl relative overflow-hidden"
              style={{ backgroundColor: themeData.colors.brand }}>
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-6 left-6 w-20 h-20 bg-white rounded-full blur-2xl" />
                <div className="absolute bottom-6 right-6 w-28 h-28 bg-white rounded-full blur-2xl" />
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mx-auto mb-5 md:mb-6">
                  <Sparkles size={28} className="text-white" />
                </div>
                <h2 className="text-xl md:text-3xl font-bold mb-3 md:mb-4 text-white"
                  style={{ fontFamily: 'DM Serif Display' }}>
                  {aboutData.cta.heading}
                </h2>
                <p className="text-sm md:text-base text-white/85 mb-6 md:mb-8 max-w-xl mx-auto leading-relaxed">
                  {aboutData.cta.description}
                </p>
                <button
                  onClick={handleCtaClick}
                  disabled={checkingAuth}
                  className="px-8 md:px-12 py-3 md:py-4 bg-white rounded-xl font-bold text-sm md:text-base shadow-xl hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ color: themeData.colors.brand }}
                >
                  {aboutData.cta.buttonText} <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;