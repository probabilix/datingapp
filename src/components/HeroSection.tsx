import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { themeData } from '../data/themeData';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const handleStartJourney = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const handleHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full h-auto flex flex-col items-center justify-start pt-42 pb-20 px-6 overflow-hidden">

      {/* 1. Background Ambient Glows & Grid */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Subtle grid pattern for dark mode only */}
        <div
          className="absolute inset-0 hidden dark:block"
          style={{
            backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)'
          }}
        />

        <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-60 dark:opacity-[0.15]" style={{ backgroundColor: 'var(--color-glow-1)' }} />
        <div className="absolute bottom-[10%] right-[-5%] w-[45%] h-[45%] rounded-full blur-[120px] opacity-50 dark:opacity-[0.15]" style={{ backgroundColor: 'var(--color-glow-2)' }} />
        <div className="absolute top-0 left-[50%] -translate-x-1/2 w-[70%] h-[40%] rounded-full blur-[140px] opacity-0 dark:opacity-[0.12]" style={{ backgroundColor: 'var(--color-glow-1)' }} />
      </div>

      {/* 2. Floating Icons */}
      <div className="absolute top-[20%] left-[15%] animate-float hidden lg:block">
        <div className="w-16 h-16 rounded-[1.75rem] shadow-[0_15px_45px_rgba(0,0,0,0.06)] flex items-center justify-center border backdrop-blur-sm" style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border-soft)' }}>
          <span className="text-red-400 text-2xl">❤️</span>
        </div>
      </div>
      <div className="absolute top-[28%] right-[15%] animate-float [animation-delay:2s] hidden lg:block">
        <div className="w-16 h-16 rounded-[1.75rem] shadow-[0_15px_45px_rgba(0,0,0,0.06)] flex items-center justify-center border backdrop-blur-sm" style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border-soft)' }}>
          <span className="text-orange-300 text-2xl">💭</span>
        </div>
      </div>
      <div className="absolute bottom-[35%] left-[18%] animate-float [animation-delay:4s] hidden lg:block">
        <div className="w-14 h-14 rounded-[1.5rem] shadow-[0_10px_35px_rgba(0,0,0,0.06)] flex items-center justify-center border backdrop-blur-sm" style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border-soft)' }}>
          <span className="text-yellow-400 text-xl">✨</span>
        </div>
      </div>

      {/* 3. Main Content Wrapper */}
      <div className="max-w-[1250px] w-full text-center z-10 flex flex-col items-center">

        {/* Badge */}
        <div
          className="inline-flex items-center px-5 py-2 rounded-full text-[11px] font-bold tracking-[0.12em] mb-6 border"
          style={{
            color: themeData.colors.brand,
            backgroundColor: 'var(--color-badge-bg)',
            borderColor: 'var(--color-badge-border)',
          }}
        >
          <span className="mr-2 text-xs">✨</span> AI-POWERED RELATIONSHIP GUIDANCE
        </div>

        {/* Heading */}
        <h1
          className="text-5xl md:text-[74px] font-bold leading-[1.02] tracking-[+0.01em] mb-6"
          style={{ color: themeData.colors.textHeading }}
        >
          Find Your Path to <br />
          <span className="bg-gradient-to-r from-[#e94057] via-[#f27121] to-[#ffb347] bg-clip-text text-transparent inline-block pb-3">
            Lasting Love
          </span>
        </h1>

        {/* Paragraph */}
        <p
          className="text-lg md:text-[20px] max-w-[660px] leading-[1.6] mb-6"
          style={{ color: themeData.colors.textBody }}
        >
          Get personalized dating advice from 12 expert AI advisors. Voice
          conversations, instant chat support, and tailored guidance for your unique journey.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-8">
          <button
            onClick={handleStartJourney}
            className="w-full sm:w-auto px-10 py-4.5 rounded-[1.2rem] text-white font-bold text-[17px] shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            style={{ backgroundColor: themeData.colors.brand }}
          >
            Start Your Journey →
          </button>

          <button
            onClick={handleHowItWorks}
            className="w-full sm:w-auto px-10 py-4.5 rounded-[1.2rem] border-2 font-bold text-[17px] backdrop-blur-sm transition-all hover:opacity-80 cursor-pointer"
            style={{
              borderColor: themeData.colors.brand,
              color: themeData.colors.brand,
              backgroundColor: 'var(--color-card-bg)',
            }}
          >
            See How It Works
          </button>
        </div>

        {/* Social Proof */}
        <div className="flex flex-row items-center justify-center gap-4">
          <div className="flex -space-x-3.5">
            {[21, 32, 23, 24, 25].map((imgId, index) => (
              <img
                key={index}
                className="w-10 h-10 rounded-full border-[3px] shadow-sm object-cover"
                style={{ borderColor: 'var(--color-card-bg)' }}
                src={`https://i.pravatar.cc/100?img=${imgId}`}
                alt="user avatar"
              />
            ))}
          </div>
          <div className="text-left">
            <div className="flex text-yellow-400 text-xs mb-0.5">
              {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
            </div>
            <p className="text-[13px] font-semibold tracking-tight" style={{ color: 'var(--color-text-body)' }}>
              <span className="font-extrabold" style={{ color: 'var(--color-text-heading)' }}>10,000+</span> happy users
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;