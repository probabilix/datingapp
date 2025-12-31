import React from 'react';
import { themeData } from '../data/themeData';

const HeroSection: React.FC = () => {
  return (
    // Change the opening <section> tag to this:
      <section className="relative w-full h-auto flex flex-col items-center justify-start pt-42 pb-20 px-6 overflow-hidden">
      
      {/* 1. Background Ambient Glows - Darker and more saturated */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] rounded-full blur-[130px] opacity-50 bg-[#fde2e4]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[45%] h-[45%] rounded-full blur-[130px] opacity-40 bg-[#fff5eb]" />
      </div>

      {/* 2. Floating Icons - Fixed to Squircels (Rounded Squares) */}
      <div className="absolute top-[20%] left-[15%] animate-float hidden lg:block">
        <div className="w-16 h-16 bg-white rounded-[1.75rem] shadow-[0_15px_45px_rgba(0,0,0,0.06)] flex items-center justify-center border border-white/60 backdrop-blur-sm">
          <span className="text-red-400 text-2xl">❤️</span>
        </div>
      </div>
      <div className="absolute top-[28%] right-[15%] animate-float [animation-delay:2s] hidden lg:block">
        <div className="w-16 h-16 bg-white rounded-[1.75rem] shadow-[0_15px_45px_rgba(0,0,0,0.06)] flex items-center justify-center border border-white/60 backdrop-blur-sm">
          <span className="text-orange-300 text-2xl">💭</span>
        </div>
      </div>
      <div className="absolute bottom-[35%] left-[18%] animate-float [animation-delay:4s] hidden lg:block">
        <div className="w-14 h-14 bg-white rounded-[1.5rem] shadow-[0_10px_35px_rgba(0,0,0,0.06)] flex items-center justify-center border border-white/60 backdrop-blur-sm">
          <span className="text-yellow-400 text-xl">✨</span>
        </div>
      </div>

      {/* 3. Main Content Wrapper */}
      <div className="max-w-[1250px] w-full text-center z-10 flex flex-col items-center">
        
        {/* Badge - Exact Border and Fill */}
        <div 
          className="inline-flex items-center px-5 py-2 rounded-full text-[11px] font-bold tracking-[0.12em] mb-6 border border-[#fbc4c4] bg-[#fff0f0]"
          style={{ color: themeData.colors.brand }}
        >
          <span className="mr-2 text-xs">✨</span> AI-POWERED RELATIONSHIP GUIDANCE
        </div>

        {/* Heading - Tight Leading (1.02) and Letter Spacing */}
        <h1 
          className="text-5xl md:text-[74px] font-bold leading-[1.02] tracking-[+0.01em] mb-6"
          style={{ color: themeData.colors.textHeading }}
        >
          Find Your Path to <br />
          <span className="bg-gradient-to-r from-[#e94057] via-[#f27121] to-[#ffb347] bg-clip-text text-transparent inline-block pb-3">
            Lasting Love
          </span>
        </h1>

        {/* Paragraph - Spacing matches the heading width exactly */}
        <p 
          className="text-lg md:text-[20px] max-w-[660px] leading-[1.6] mb-6 text-[#5a5e73]" 
        >
          Get personalized dating advice from 12 expert AI advisors. Voice 
          conversations, instant chat support, and tailored guidance for your unique journey.
        </p>

        {/* Action Buttons - Squircel Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-8">
          <button 
            className="w-full sm:w-auto px-10 py-4.5 rounded-[1.2rem] text-white font-bold text-[17px] shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]" 
            style={{ backgroundColor: themeData.colors.brand }}
          >
            Start Your Journey →
          </button>
          
          <button 
            className="w-full sm:w-auto px-10 py-4.5 rounded-[1.2rem] border-2 font-bold text-[17px] bg-white/40 backdrop-blur-sm transition-all hover:bg-white" 
            style={{ borderColor: themeData.colors.brand, color: themeData.colors.brand }}
          >
            See How It Works
          </button>
        </div>

        {/* Social Proof - Grouped tightly together */}
        <div className="flex flex-row items-center justify-center gap-4">
          <div className="flex -space-x-3.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <img
                key={i}
                className="w-10 h-10 rounded-full border-[3px] border-white shadow-sm object-cover"
                src={`https://i.pravatar.cc/100?img=${i + 20}`}
                alt="user avatar"
              />
            ))}
          </div>
          <div className="text-left">
            <div className="flex text-yellow-400 text-xs mb-0.5">
              {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
            </div>
            <p className="text-[13px] font-semibold tracking-tight text-[#74798c]">
              <span className="text-black font-extrabold">10,000+</span> happy users
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;