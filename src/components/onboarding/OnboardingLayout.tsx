import React from 'react';
import { themeData } from '../../data/themeData';
import { motion } from 'framer-motion';

interface OnboardingLayoutProps {
    children: React.ReactNode;
    currentStep: number;
    totalSteps: number;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({ children, currentStep, totalSteps }) => {
    const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden"
            style={{ backgroundColor: themeData.colors.bgSoft }}
        >
            {/* Lavish Atmospheric Glows */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#E94057]/10 blur-[130px] rounded-full dark:opacity-40" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full dark:opacity-30" />
            </div>

            <div className="w-full max-w-md backdrop-blur-2xl rounded-[2.5rem] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col max-h-[90vh] border" style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border-soft)' }}>
                {/* Progress Bar */}
                <div className="h-1.5 w-full" style={{ backgroundColor: 'var(--color-border)' }}>
                    <motion.div
                        className="h-full rounded-r-full"
                        style={{ backgroundColor: themeData.colors.brand }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                </div>

                {/* Content Container */}
                <div className="p-8 md:p-10 flex flex-col h-full overflow-y-auto custom-scrollbar">
                    <div className="flex justify-between items-center mb-6 text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--color-text-muted)' }}>
                        <span>Step {currentStep + 1} of {totalSteps}</span>
                        <span>Welcome Tutorial</span>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
};

export default OnboardingLayout;
