import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { themeData } from '../data/themeData';
import { supabase } from '../lib/supabaseClient';
import { ChevronRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';

const AdvisorsSection: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [advisors, setAdvisors] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

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

  if (advisors.length === 0) return null;

  return (
    <section
      id="advisors"
      className="py-24 px-6 flex flex-col items-center"
      style={{ backgroundColor: 'var(--color-bg-soft)' }}
    >
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="text-left">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-sm border mb-6"
            style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}
          >
            <Sparkles size={14} style={{ color: themeData.colors.brand }} />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-70" style={{ color: 'var(--color-text-body)' }}>AI Love Intelligence</span>
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
                className="absolute p-10 rounded-[3.5rem] shadow-2xl flex flex-col items-center transition-all duration-1000 ease-in-out"
                style={{
                  backgroundColor: 'var(--color-card-bg)',
                  border: '1px solid var(--color-border-soft)',
                  width: '360px',
                  transform: `
                    translateX(${offset * 70 - 70}px) 
                    translateY(${offset * 55 - 55}px) 
                    rotate(${offset * 12 - 12}deg)
                    scale(${1 - offset * 0.15})
                  `,
                  boxShadow: offset === 0 ? '0 40px 100px -20px rgba(0,0,0,0.6)' : '0 10px 30px rgba(0,0,0,0.2)',
                  opacity: 1 - offset * 0.3,
                  zIndex: 30 - offset,
                  filter: offset === 0 ? 'none' : 'blur(2px)'
                }}
              >
                <div className="relative mb-8">
                  <img src={advisor.image_url} alt={advisor.name} className="w-36 h-36 rounded-[2.5rem] object-cover shadow-xl" />
                  {advisor.is_online && <div className="absolute -bottom-2 -right-2 bg-green-500 w-7 h-7 border-4 rounded-full" style={{ borderColor: 'var(--color-card-bg)' }}></div>}
                </div>

                <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: 'DM Serif Display', color: themeData.colors.textHeading }}>{advisor.name}</h3>
                <p className="text-[11px] font-black uppercase opacity-30 tracking-widest text-center mb-6" style={{ color: 'var(--color-text-body)' }}>{advisor.specialty}</p>

                <div className="flex gap-1 text-yellow-500 mb-2">
                  {[...Array(5)].map((_, i) => <Zap key={i} size={14} fill="currentColor" />)}
                </div>
              </div>
            );
          })}

          <div
            className="absolute bottom-10 right-0 md:-right-8 backdrop-blur-xl px-8 py-5 rounded-3xl shadow-2xl z-50 flex items-center gap-4 animate-bounce"
            style={{
              backgroundColor: 'var(--color-card-bg)',
              border: '1px solid var(--color-border)',
              opacity: 0.95,
            }}
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: themeData.colors.brand }}>
              <ShieldCheck size={24} />
            </div>
            <p className="text-sm font-bold" style={{ color: 'var(--color-text-heading)', opacity: 0.8 }}>+ 9 Specialized Experts</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvisorsSection;