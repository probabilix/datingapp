import React from 'react';
import { themeData } from '../data/themeData';

const testimonials = [
  {
    name: "Sarah J.",
    role: "Found Love",
    text: "The AI advisors gave me the confidence to be myself. I've been with my partner for 6 months now thanks to the conversation starters!",
    image: "https://i.pravatar.cc/100?img=32"
  },
  {
    name: "Mark T.",
    role: "Better Communication",
    text: "I used to struggle with first dates. The practice voice calls helped me stay calm and actually enjoy the process.",
    image: "https://i.pravatar.cc/100?img=12"
  },
  {
    name: "Jessica W.",
    role: "Profile Boosted",
    text: "The profile audit was a game changer. I went from zero matches to meaningful conversations in just one week.",
    image: "https://i.pravatar.cc/100?img=44"
  }
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="px-6 py-16 md:py-24 flex flex-col items-center" style={{ backgroundColor: 'var(--color-bg-soft)' }}>
      <div className="text-center mb-12 md:mb-16 relative z-10">
        <span className="block text-[11px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: themeData.colors.brand }}>Success Stories</span>
        <h2 className="text-[32px] md:text-[48px] leading-[1.1] mb-4" style={{ fontFamily: 'DM Serif Display', fontWeight: 400, color: themeData.colors.textHeading }}>What Our Users Say</h2>
      </div>

      <div className="absolute inset-0 -z-10 overflow-hidden opacity-[0.08] pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-[#E94057] blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] right-[10%] w-[25%] h-[25%] bg-blue-600 blur-[100px] rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-[1100px] w-full">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="p-10 rounded-[2.5rem] flex flex-col relative z-20 border transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] cursor-default"
            style={{
              backgroundColor: 'var(--color-card-bg)',
              borderColor: 'var(--color-border-soft)',
            }}
          >
            <div className="flex text-yellow-400 text-sm mb-6">★★★★★</div>
            <p className="text-[15px] leading-relaxed mb-8 opacity-80 italic" style={{ color: themeData.colors.textBody }}>"{t.text}"</p>
            <div className="flex items-center gap-4 mt-auto">
              <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <h4 className="font-bold text-[16px]" style={{ color: themeData.colors.textHeading }}>{t.name}</h4>
                <p className="text-[12px] opacity-60 uppercase tracking-wider" style={{ color: 'var(--color-text-body)' }}>{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;