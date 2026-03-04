import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { themeData } from '../data/themeData';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(null);
  const [faqData, setFaqData] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFAQs = async () => {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        console.error("Error fetching FAQs:", error);
      }

      if (data && data.length > 0) {
        setFaqData(data);
        setOpenId(data[0].id); // Open first one by default
      }
      setLoading(false);
    };

    fetchFAQs();
  }, []);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section
      id="faq"
      className="relative px-6 py-16 md:py-24 flex flex-col items-center"
      style={{ backgroundColor: 'var(--color-bg-soft)' }}
    >

      {/* HEADER */}
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
        <p className="text-[15px] md:text-[17px] opacity-80 max-w-xl mx-auto leading-relaxed" style={{ color: themeData.colors.textBody }}>
          Everything you need to know about starting your journey with DatingAdvice.
        </p>
      </div>

      {/* ACCORDION LIST */}
      <div className="max-w-[800px] w-full flex flex-col gap-4">
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="w-8 h-8 rounded-full border-2 border-t-[#E94057] border-gray-200 animate-spin"></div>
          </div>
        ) : faqData.map((item) => (
          <div
            key={item.id}
            className={`rounded-[24px] md:rounded-[32px] overflow-hidden transition-all duration-500 relative ${openId === item.id ? 'shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] border-[#E94057]/20' : 'shadow-none border-transparent hover:border-white/[0.05]'}`}
            style={{
              backgroundColor: 'var(--color-card-bg)',
              border: item.id === openId ? undefined : '1px solid var(--color-border)',
            }}
          >
            {openId === item.id && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-[#E94057]/40 to-transparent" />}
            <button
              onClick={() => toggleFAQ(item.id)}
              className="w-full px-6 md:px-8 py-5 md:py-7 flex items-center justify-between text-left transition-colors"
              style={{}}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-card-hover)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <span
                className="text-[16px] md:text-[19px] font-bold pr-4"
                style={{ color: themeData.colors.textHeading, fontFamily: 'DM Serif Display' }}
              >
                {item.question}
              </span>

              {/* Icon Box */}
              <div
                className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300"
                style={{
                  backgroundColor: openId === item.id ? themeData.colors.brand : 'var(--color-faq-closed)',
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

            {/* Answer */}
            <div
              className={`px-6 md:px-8 transition-all duration-300 ease-in-out ${openId === item.id ? 'max-h-[300px] pb-6 md:pb-8 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                }`}
            >
              <p
                className="text-[14.5px] md:text-[15.5px] leading-[1.7]"
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