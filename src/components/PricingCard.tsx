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
}

const PricingCard: React.FC<PricingCardProps> = ({ name, price, period, features, isPopular, isCurrent, onSelect, buttonText }) => (
    <div className={`relative bg-white p-10 rounded-[3rem] border-2 transition-all hover:shadow-2xl flex flex-col ${isPopular ? 'border-[#E94057] scale-105 z-10' : 'border-transparent shadow-sm'}`}>
        {isPopular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#E94057] text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Best Value</div>}
        <h4 className="text-2xl font-bold mb-4" style={{ color: themeData.colors.textHeading }}>{name}</h4>
        <div className="flex items-baseline gap-1 mb-8">
            <span className="text-4xl font-black">${price}</span>
            <span className="text-gray-400 text-sm">{period}</span>
        </div>
        <div className="space-y-4 mb-10 flex-grow">
            {features.map((f: string) => (
                <div key={f} className="flex items-start gap-3 text-sm font-medium text-gray-600 leading-tight">
                    <Check size={16} className="text-green-500 mt-0.5 shrink-0" /> {f}
                </div>
            ))}
        </div>
        <button
            disabled={isCurrent}
            onClick={onSelect}
            className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg ${isCurrent ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#E94057] text-white hover:brightness-110 cursor-pointer'}`}
        >
            {isCurrent ? 'Your Current Plan' : (buttonText || `Get ${name}`)}
        </button>
    </div>
);

export default PricingCard;
