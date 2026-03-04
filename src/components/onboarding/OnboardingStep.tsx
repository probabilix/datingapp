import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { themeData } from '../../data/themeData';

interface OnboardingStepProps {
    title: string;
    body: React.ReactNode;
    checkboxLabel: string;
    isChecked: boolean;
    onCheck: (checked: boolean) => void;
    onNext: () => void;
    isLoading?: boolean;
    buttonText?: string;
    icon?: React.ReactNode;
}

const OnboardingStep: React.FC<OnboardingStepProps> = ({
    title,
    body,
    checkboxLabel,
    isChecked,
    onCheck,
    onNext,
    isLoading = false,
    buttonText = "Continue",
    icon
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full"
        >
            <div className="flex-grow">
                {icon && (
                    <div className="mb-6 w-12 h-12 rounded-2xl shadow-sm flex items-center justify-center text-rose-500" style={{ backgroundColor: 'var(--color-input-solid)' }}>
                        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement, { size: 24 } as any) : icon}
                    </div>
                )}

                <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'DM Serif Display', color: 'var(--color-text-heading)' }}>
                    {title}
                </h2>

                <div className="space-y-4 text-[15px] leading-relaxed mb-8" style={{ color: 'var(--color-text-body)' }}>
                    {body}
                </div>
            </div>

            <div className="mt-auto pt-6" style={{ borderTop: '1px solid var(--color-border)' }}>
                <label className="flex items-start gap-4 cursor-pointer group p-3 -ml-3 rounded-2xl transition-all hover:bg-white/[0.02]" style={{ color: 'var(--color-text-body)' }}>
                    <div className="relative flex-shrink-0 mt-0.5">
                        <input
                            type="checkbox"
                            className="peer sr-only"
                            checked={isChecked}
                            onChange={(e) => onCheck(e.target.checked)}
                        />
                        <div className={`w-6 h-6 border-2 rounded-lg transition-all duration-300 flex items-center justify-center ${isChecked
                            ? 'bg-rose-500 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                            : 'border-white/10 group-hover:border-rose-400/40'}`}
                            style={!isChecked ? { backgroundColor: 'var(--color-input-solid)' } : {}}>
                            <Check size={16} className={`text-white transition-opacity duration-300 ${isChecked ? 'opacity-100' : 'opacity-0'}`} />
                        </div>
                    </div>
                    <span className="text-[14px] font-medium leading-tight select-none pt-0.5" style={{ color: 'var(--color-text-heading)' }}>
                        {checkboxLabel}
                    </span>
                </label>

                <button
                    onClick={onNext}
                    disabled={!isChecked || isLoading}
                    className="w-full mt-8 py-4.5 px-6 rounded-2xl text-white font-bold text-lg shadow-2xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed cursor-pointer"
                    style={{
                        backgroundColor: !isChecked && !isLoading ? 'var(--color-border)' : themeData.colors.brand,
                        boxShadow: isChecked ? '0 20px 40px -10px rgba(233, 64, 87, 0.4)' : 'none'
                    }}
                >
                    {isLoading ? 'Processing...' : buttonText}
                </button>
            </div>
        </motion.div>
    );
};

export default OnboardingStep;
