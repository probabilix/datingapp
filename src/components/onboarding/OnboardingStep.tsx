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
                <label className="flex items-start gap-3 cursor-pointer group p-2 -ml-2 rounded-lg transition-colors" style={{ color: 'var(--color-text-body)' }}>
                    <div className="relative flex-shrink-0 mt-0.5">
                        <input
                            type="checkbox"
                            className="peer sr-only"
                            checked={isChecked}
                            onChange={(e) => onCheck(e.target.checked)}
                        />
                        <div className={`w-5 h-5 border-2 rounded transition-all duration-200 ${isChecked
                            ? 'bg-rose-500 border-rose-500'
                            : 'border-rose-300/40 group-hover:border-rose-400'}`}
                            style={!isChecked ? { backgroundColor: 'var(--color-input-solid)' } : {}}>
                            <Check size={14} className={`text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity ${isChecked ? 'opacity-100' : 'opacity-0'}`} />
                        </div>
                    </div>
                    <span className="text-sm font-medium select-none" style={{ color: 'var(--color-text-heading)' }}>
                        {checkboxLabel}
                    </span>
                </label>

                <button
                    onClick={onNext}
                    disabled={!isChecked || isLoading}
                    className="w-full mt-6 py-3.5 px-6 rounded-xl text-white font-bold shadow-lg shadow-rose-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:shadow-none disabled:bg-gray-400"
                    style={{ backgroundColor: !isChecked && !isLoading ? '#9CA3AF' : themeData.colors.brand }}
                >
                    {isLoading ? 'Processing...' : buttonText}
                </button>
            </div>
        </motion.div>
    );
};

export default OnboardingStep;
