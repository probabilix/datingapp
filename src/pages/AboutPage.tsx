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

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setCheckingAuth(false);
    };
    checkAuth();
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
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{aboutData.seo.title}</title>
        <meta name="description" content={aboutData.seo.description} />
        <meta name="keywords" content={aboutData.seo.keywords} />

        {/* Open Graph Tags for Social Sharing */}
        <meta property="og:title" content={aboutData.seo.title} />
        <meta property="og:description" content={aboutData.seo.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://datingadvice.io/about" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={aboutData.seo.title} />
        <meta name="twitter:description" content={aboutData.seo.description} />

        {/* Structured Data for Rich Snippets */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "DatingAdvice.io",
            "description": aboutData.mission.content,
            "url": "https://datingadvice.io",
            "logo": "https://datingadvice.io/logo.png",
            "sameAs": [],
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "Customer Service",
              "url": "https://datingadvice.io/contact"
            }
          })}
        </script>
      </Helmet>

      <Header />

      <main className="flex-grow pt-32 pb-20 px-6">
        {/* Hero Section */}
        <section className="max-w-[1100px] mx-auto mb-20">
          <Link to="/" className="text-xs font-black opacity-30 hover:opacity-100 uppercase tracking-widest mb-8 inline-block transition-opacity">
            ← Back
          </Link>
          <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ fontFamily: 'DM Serif Display', color: themeData.colors.textHeading }}>
            {aboutData.title}
          </h1>
          <p className="text-xl md:text-2xl font-medium opacity-60 max-w-3xl" style={{ color: themeData.colors.textBody }}>
            {aboutData.subtitle}
          </p>
        </section>

        {/* Stats Section */}
        <section className="max-w-[1100px] mx-auto mb-32">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {aboutData.stats.map((stat, idx) => (
              <div key={idx} className="bg-white rounded-[2rem] p-8 text-center shadow-lg border border-gray-100">
                <div className="text-4xl md:text-5xl font-black mb-2" style={{ color: themeData.colors.brand }}>
                  {stat.value}
                </div>
                <p className="text-xs md:text-sm font-bold uppercase tracking-wider opacity-60" style={{ color: themeData.colors.textBody }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission Section */}
        <section className="max-w-[1100px] mx-auto mb-32">
          <div className="bg-white rounded-[3rem] p-12 md:p-16 shadow-xl border border-gray-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${themeData.colors.brand}20` }}>
                <Target size={32} style={{ color: themeData.colors.brand }} />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'DM Serif Display', color: themeData.colors.textHeading }}>
                {aboutData.mission.heading}
              </h2>
            </div>
            <p className="text-lg md:text-xl leading-relaxed opacity-80" style={{ color: themeData.colors.textBody }}>
              {aboutData.mission.content}
            </p>
          </div>
        </section>

        {/* Vision Section */}
        <section className="max-w-[1100px] mx-auto mb-32">
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-[3rem] p-12 md:p-16 border border-pink-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white shadow-lg">
                <Eye size={32} style={{ color: themeData.colors.brand }} />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'DM Serif Display', color: themeData.colors.textHeading }}>
                {aboutData.vision.heading}
              </h2>
            </div>
            <p className="text-lg md:text-xl leading-relaxed opacity-80" style={{ color: themeData.colors.textBody }}>
              {aboutData.vision.content}
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="max-w-[1100px] mx-auto mb-32">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center" style={{ fontFamily: 'DM Serif Display', color: themeData.colors.textHeading }}>
            Our Core Values
          </h2>
          <p className="text-center text-lg opacity-60 mb-16 max-w-2xl mx-auto" style={{ color: themeData.colors.textBody }}>
            The principles that guide everything we do at DatingAdvice.io
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {aboutData.values.map((value, idx) => {
              const IconComponent = valueIcons[idx];
              return (
                <div key={idx} className="bg-white rounded-[2.5rem] p-10 shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: `${themeData.colors.brand}15` }}>
                    <IconComponent size={28} style={{ color: themeData.colors.brand }} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: themeData.colors.textHeading }}>
                    {value.title}
                  </h3>
                  <p className="text-base leading-relaxed opacity-70" style={{ color: themeData.colors.textBody }}>
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Team Expertise Section */}
        <section className="max-w-[1100px] mx-auto mb-32">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[3rem] p-12 md:p-16 border border-blue-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white shadow-lg">
                <Users size={32} style={{ color: themeData.colors.brand }} />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'DM Serif Display', color: themeData.colors.textHeading }}>
                {aboutData.team.heading}
              </h2>
            </div>
            <p className="text-lg md:text-xl leading-relaxed opacity-80" style={{ color: themeData.colors.textBody }}>
              {aboutData.team.content}
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-[1100px] mx-auto mb-20">
          <div className="rounded-[3rem] p-12 md:p-20 text-center shadow-2xl relative overflow-hidden" style={{ backgroundColor: themeData.colors.brand }}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mx-auto mb-8">
                <Sparkles size={40} className="text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white" style={{ fontFamily: 'DM Serif Display' }}>
                {aboutData.cta.heading}
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                {aboutData.cta.description}
              </p>
              <button
                onClick={handleCtaClick}
                disabled={checkingAuth}
                className="px-12 py-5 bg-white rounded-2xl font-bold text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-3 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ color: themeData.colors.brand }}
              >
                {aboutData.cta.buttonText} <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;