import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { themeData } from '../data/themeData'; 
import { supabase } from '../lib/supabaseClient';
import { ChevronRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';

const AdvisorsSection: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [advisors, setAdvisors] = useState<any[]>([]); // Data from Database

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    // FETCH FROM DATABASE: Replaces local advisorsData
    const fetchAdvisors = async () => {
      const { data } = await supabase
        .from('advisors')
        .select('*')
        .order('created_at', { ascending: true });
      if (data) setAdvisors(data);
    };
    fetchAdvisors();

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCTA = () => {
    isLoggedIn ? navigate('/dashboard') : navigate('/login');
  };

  if (advisors.length === 0) return null; // Wait for DB load

  return (
    <section 
      id="advisors" 
      className="py-24 px-6 flex flex-col items-center" 
      style={{ backgroundColor: themeData.colors.bgSoft }}
    >
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-gray-100 mb-6">
            <Sparkles size={14} style={{ color: themeData.colors.brand }} />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-70">AI Love Intelligence</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-8" style={{ color: themeData.colors.textHeading, fontFamily: 'DM Serif Display' }}>
            Meet Your New <br /> <span style={{ color: themeData.colors.brand }}>Personal Dating Coach</span>
          </h2>
          
          <p className="text-xl opacity-60 leading-relaxed mb-10 max-w-lg" style={{ color: themeData.colors.textBody }}>
            Gain exclusive access to specialized AI experts trained in modern relationship dynamics. Join 10,000+ members receiving personalized guidance.
          </p>

          <button 
            onClick={handleCTA}
            className="group px-10 py-5 rounded-2xl text-white font-bold text-lg shadow-2xl hover:brightness-110 transition-all active:scale-95 flex items-center gap-3"
            style={{ backgroundColor: themeData.colors.brand }}
          >
            {isLoggedIn ? 'Enter Dashboard' : 'Unlock Your Advisors'}
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="relative h-[650px] w-full flex items-center justify-center">
          {[0, 1, 2].map((offset) => {
            const index = (activeIndex + offset) % advisors.length;
            const advisor = advisors[index];
            
            return (
              <div 
                key={advisor.id}
                className="absolute bg-white p-10 rounded-[3.5rem] shadow-2xl border border-gray-100 flex flex-col items-center transition-all duration-1000 ease-in-out"
                style={{
                  width: '360px',
                  transform: `
                    translateX(${offset * 60 - 60}px) 
                    translateY(${offset * 50 - 50}px) 
                    rotate(${offset * 10 - 10}deg)
                    scale(${1 - offset * 0.12})
                  `,
                  opacity: 1 - offset * 0.25,
                  zIndex: 30 - offset,
                  filter: offset === 0 ? 'none' : 'blur(1.5px)'
                }}
              >
                <div className="relative mb-8">
                  {/* image_url from database */}
                  <img src={advisor.image_url} alt={advisor.name} className="w-36 h-36 rounded-[2.5rem] object-cover shadow-xl" />
                  {advisor.is_online && <div className="absolute -bottom-2 -right-2 bg-green-500 w-7 h-7 border-4 border-white rounded-full"></div>}
                </div>
                
                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: 'DM Serif Display', color: themeData.colors.textHeading }}>{advisor.name}</h3>
                <p className="text-[11px] font-black uppercase opacity-30 tracking-widest text-center mb-6">{advisor.specialty}</p>
                
                <div className="flex gap-1 text-yellow-500 mb-2">
                   {[...Array(5)].map((_, i) => <Zap key={i} size={14} fill="currentColor" />)}
                </div>
              </div>
            );
          })}

          <div className="absolute bottom-10 right-0 md:-right-8 bg-white/90 backdrop-blur-xl px-8 py-5 rounded-3xl border border-white shadow-2xl z-50 flex items-center gap-4 animate-bounce">
            <div className="w-12 h-12 bg-[#E94057] rounded-full flex items-center justify-center text-white shadow-lg">
              <ShieldCheck size={24} />
            </div>
            <p className="text-sm font-bold opacity-80">+ 9 Specialized Experts</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvisorsSection;