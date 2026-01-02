
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { themeData } from '../data/themeData';
import PricingCard from './PricingCard';

const PricingSection: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    const fetchPlans = async () => {
      const { data } = await supabase.from('plan_settings').select('*').order('price_usd');
      if (data) setPlans(data);
    };
    fetchPlans();
  }, []);

  const handlePlanSelect = async (planName: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      navigate(`/checkout?plan=${planName}`);
    } else {
      navigate('/login');
    }
  };

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
        {plans.map((plan) => (
          <PricingCard
            key={plan.plan_name}
            name={plan.plan_name}
            price={plan.price_usd}
            period="/month"
            features={plan.features || []}
            isPopular={plan.plan_name === 'Elite'}
            onSelect={() => handlePlanSelect(plan.plan_name)}
            buttonText={plan.button_text}
          />
        ))}
      </div>
    </section>
  );
};

export default PricingSection;