import React from 'react';
import { pricingData } from '../data/pricingData';
import { themeData } from '../data/themeData';

const PricingSection: React.FC = () => {
  return (
    <section
      id="pricing"
      className="relative px-6 py-16 md:py-20 flex flex-col items-center"
      style={{ backgroundColor: themeData.colors.bgSoft }}
    >
      {/* HEADER - Adjusted margins for mobile */}
      <div className="text-center mb-10 md:mb-14 max-w-2xl">
        <span
          className="block text-[11px] font-semibold tracking-[0.18em] uppercase mb-2"
          style={{ color: themeData.colors.brand }}
        >
          Pricing Plans
        </span>

        <h2
          className="text-[32px] md:text-[48px] leading-[1.05] mb-3"
          style={{
            fontFamily: 'DM Serif Display',
            fontWeight: 400,
            color: themeData.colors.textHeading
          }}
        >
          Choose Your Journey
        </h2>

        <p
          className="text-[15px] leading-[1.6] opacity-75 max-w-[90%] mx-auto"
          style={{ color: themeData.colors.textBody }}
        >
          Select the plan that fits your needs. All plans include our core AI advisory features.
        </p>
      </div>

      {/* PRICING GRID: Stacks on mobile, stretch for equal height */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-[1080px] w-full items-stretch">
        {pricingData.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-[32px] px-8 pt-9 pb-8 flex flex-col bg-white transition-all duration-300 ${
              plan.isPopular
                ? 'border-2 border-[#E94057] shadow-[0_35px_90px_-30px_rgba(233,64,87,0.22)] lg:-translate-y-4 z-10'
                : 'border border-[#EFEFEF] shadow-[0_16px_45px_-20px_rgba(0,0,0,0.05)]'
            }`}
          >
            {/* POPULAR BADGE */}
            {plan.isPopular && (
              <div
                className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest text-white shadow-md flex items-center gap-1"
                style={{ backgroundColor: themeData.colors.brand }}
              >
                ✨ MOST POPULAR
              </div>
            )}

            {/* TITLE & PRICE */}
            <div className="text-center mb-6">
              <h3
                className="text-[22px] mb-3"
                style={{
                  fontFamily: 'DM Serif Display',
                  color: themeData.colors.textHeading
                }}
              >
                {plan.name}
              </h3>

              <div className="flex items-center justify-center gap-1 mb-2">
                <span
                  className="text-[16px] font-semibold self-start mt-2"
                  style={{ fontFamily: 'Inter, system-ui', color: themeData.colors.textHeading }}
                >
                  $
                </span>

                <span
                  className="text-[48px] md:text-[56px] font-bold leading-none tracking-tight"
                  style={{
                    fontFamily: 'Inter, system-ui',
                    color: themeData.colors.textHeading
                  }}
                >
                  {plan.price}
                </span>

                <span
                  className="text-[13px] opacity-55 self-end mb-2"
                  style={{ fontFamily: 'Inter, system-ui' }}
                >
                  {plan.period}
                </span>
              </div>

              <p
                className="text-[13.5px] opacity-65 leading-snug"
                style={{ color: themeData.colors.textBody }}
              >
                {plan.description}
              </p>
            </div>

            {/* FEATURES */}
            <ul className="space-y-3 mb-7 flex-grow">
              {plan.features.map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-[14px] leading-[1.45]"
                  style={{ color: themeData.colors.textBody }}
                >
                  <div className="w-4.5 h-4.5 rounded-full bg-[#FFF1F2] flex items-center justify-center shrink-0 mt-0.5">
                    <span
                      className="text-[9px] font-bold"
                      style={{ color: themeData.colors.brand }}
                    >
                      ✓
                    </span>
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            {/* BUTTON */}
            <button
              className={`w-full py-3.5 rounded-[18px] text-[14.5px] font-semibold transition-all active:scale-95 ${
                plan.isPopular ? 'text-white' : 'bg-white border-2'
              }`}
              style={{
                backgroundColor: plan.isPopular ? themeData.colors.brand : 'transparent',
                borderColor: themeData.colors.brand,
                color: plan.isPopular ? '#fff' : themeData.colors.brand
              }}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PricingSection;