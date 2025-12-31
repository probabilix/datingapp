import React, { useState } from 'react';
import { faqData } from '../data/faqData';
import { themeData } from '../data/themeData';

const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="relative px-6 py-16 md:py-24 flex flex-col items-center" style={{ backgroundColor: themeData.colors.bgSoft }}>
      
      {/* HEADER - Tight vertical spacing for mobile */}
      <div className="text-center mb-12 md:mb-16">
        <span 
          className="block text-[11px] font-bold tracking-[0.2em] uppercase mb-3" 
          style={{ color: themeData.colors.brand }}
        >
          Questions
        </span>
        <h2 
          className="text-[32px] md:text-[48px] leading-[1.1] mb-4 tracking-tight" 
          style={{ color: themeData.colors.textHeading, fontFamily: 'DM Serif Display', fontWeight: 400 }}
        >
          Frequently Asked Questions
        </h2>
        <p className="text-[15px] md:text-[17px] opacity-70 max-w-xl mx-auto leading-relaxed" style={{ color: themeData.colors.textBody }}>
          Everything you need to know about starting your journey with DatindAdvice.
        </p>
      </div>

      {/* ACCORDION LIST - Centered luxury width */}
      <div className="max-w-[800px] w-full flex flex-col gap-4">
        {faqData.map((item) => (
          <div 
            key={item.id}
            className="bg-white rounded-[24px] md:rounded-[32px] overflow-hidden border border-gray-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.03)] transition-all duration-300"
          >
            <button
              onClick={() => toggleFAQ(item.id)}
              className="w-full px-6 md:px-8 py-5 md:py-7 flex items-center justify-between text-left transition-colors hover:bg-gray-50/50"
            >
              <span 
                className="text-[16px] md:text-[19px] font-bold pr-4" 
                style={{ color: themeData.colors.textHeading, fontFamily: 'DM Serif Display' }}
              >
                {item.question}
              </span>
              
              {/* Saturated Icon Box */}
              <div 
                className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300"
                style={{ 
                  backgroundColor: openId === item.id ? themeData.colors.brand : '#FFF1F2',
                  transform: openId === item.id ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              >
                <span 
                  className="text-[12px] md:text-[14px] font-bold"
                  style={{ color: openId === item.id ? '#fff' : themeData.colors.brand }}
                >
                  {openId === item.id ? '−' : '+'}
                </span>
              </div>
            </button>

            {/* Answer with smooth transition */}
            <div 
              className={`px-6 md:px-8 transition-all duration-300 ease-in-out ${
                openId === item.id ? 'max-h-[300px] pb-6 md:pb-8 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
              }`}
            >
              <p 
                className="text-[14.5px] md:text-[15.5px] leading-[1.7] opacity-80" 
                style={{ color: themeData.colors.textBody }}
              >
                {item.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;