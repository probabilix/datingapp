import React from 'react';
import { Check } from 'lucide-react';
import { themeData } from '../data/themeData';

interface PricingCardProps {
    name: string;
    price: number;
    period: string;
    features: string[];
    isPopular?: boolean;
    isCurrent?: boolean;
    onSelect: () => void;
    buttonText?: string;
    disabled?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ name, price, period, features, isPopular, isCurrent, onSelect, buttonText, disabled }) => (
    <div
        className={`relative p-10 rounded-[3rem] border-2 transition-all duration-500 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] flex flex-col ${isPopular ? 'border-[#E94057] scale-105 z-10 shadow-2xl' : 'border-transparent shadow-sm hover:border-white/[0.05]'}`}
        style={{ backgroundColor: 'var(--color-card-bg)' }}
    >
        {isPopular && (
            <>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#E94057] text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl z-20">Best Value</div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-1 bg-gradient-to-r from-transparent via-[#E94057]/50 to-transparent blur-sm" />
            </>
        )}
        <h4 className="text-2xl font-bold mb-4" style={{ color: themeData.colors.textHeading }}>{name}</h4>
        <div className="flex items-baseline gap-1 mb-8">
            <span className="text-4xl font-black" style={{ color: 'var(--color-text-heading)' }}>${price}</span>
            <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{period}</span>
        </div>
        <div className="space-y-4 mb-10 flex-grow">
            {features.map((f: string) => (
                <div key={f} className="flex items-start gap-3 text-sm font-medium leading-tight" style={{ color: 'var(--color-text-body)' }}>
                    <Check size={16} className="text-green-500 mt-0.5 shrink-0" /> {f}
                </div>
            ))}
        </div>
        <button
            disabled={isCurrent || disabled}
            onClick={onSelect}
            className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg ${(isCurrent || disabled) ? 'cursor-not-allowed shadow-none' : 'bg-[#E94057] text-white hover:brightness-110 cursor-pointer'}`}
            style={(isCurrent || disabled) ? { backgroundColor: 'var(--color-border)', color: 'var(--color-text-muted)' } : {}}
        >
            {isCurrent ? 'Your Current Plan' : (buttonText || `Get ${name}`)}
        </button>
    </div>
);

export default PricingCard;
