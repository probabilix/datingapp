import React from 'react';
import { stepsData } from '../data/stepsData';
import { themeData } from '../data/themeData';

const ProcessSection: React.FC = () => {
  return (
    <section
      id="how-it-works"
      className="relative px-6 py-16 md:py-32 overflow-hidden"
      style={{ backgroundColor: themeData.colors.bgSoft }}
    >
      {/* Container limited for luxury look */}
      <div className="max-w-[1000px] mx-auto">
        
        {/* HEADER - Adjusted text sizes for mobile */}
        <div className="text-center mb-12 md:mb-16">
          <span
            className="block text-[11px] md:text-[12px] font-bold tracking-[0.2em] uppercase mb-3 md:mb-4"
            style={{ color: themeData.colors.brand }}
          >
            Simple Process
          </span>

          <h2
            className="text-[32px] md:text-[54px] leading-[1.1] mb-4 tracking-[-0.01em]"
            style={{
              color: themeData.colors.textHeading,
              fontFamily: 'DM Serif Display',
              fontWeight: 400
            }}
          >
            How DatingAdvice Works
          </h2>

          <p
            className="text-[16px] md:text-[18px] leading-[1.4] md:leading-[1.2] max-w-[750px] mx-auto font-light"
            style={{ color: themeData.colors.textBody }}
          >
            Getting expert dating advice has never been easier. Follow these simple
            steps to start your journey to better relationships.
          </p>
        </div>

        {/* 2. STEPS GRID */}
        <div className="relative">
          
          {/* THE THIN RED LINE - Hidden on mobile/tablet, visible only on large screens */}
          <div 
            className="hidden lg:block absolute top-[70px] left-[5%] right-[5%] h-[3px] opacity-80" 
            style={{ backgroundColor: themeData.colors.brand }}
          />

          {/* GRID: 1 col on mobile, 2 on tablet, 4 on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-8">
            {stepsData.map((step) => (
              <div key={step.id} className="relative">
                
                {/* STEP NUMBER PIN - Adjusted position for smaller screens */}
                <div
                  className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-white text-[13px] font-bold z-20"
                  style={{ 
                    backgroundColor: themeData.colors.brand,
                    boxShadow: `0 10px 20px -5px ${themeData.colors.brand}80` 
                  }}
                >
                  {step.id}
                </div>

                {/* THE CARD */}
                <div className="bg-white rounded-[15px] px-8 py-8 md:pt-4 md:pb-4 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04)] border border-white h-full flex flex-col items-start transition-transform hover:-translate-y-1">
                  
                  {/* ICON BOX */}
                  <div
                    className="w-[60px] h-[60px] rounded-[18px] flex items-center justify-center mb-4 shadow-sm"
                    style={{ backgroundColor: step.bgColor }}
                  >
                    <span className="text-[24px]">{step.icon}</span>
                  </div>

                  <h3
                    className="text-[20px] leading-[1.3] mb-2 tracking-tight"
                    style={{
                      color: themeData.colors.textHeading,
                      fontFamily: 'DM Serif Display',
                    }}
                  >
                    {step.title}
                  </h3>

                  <p
                    className="text-[14.5px] leading-[1.8] font-normal"
                    style={{ color: themeData.colors.textBody, opacity: 0.85 }}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;