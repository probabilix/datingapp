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
            {/* Background Blobs for specific aesthetic */}
            <div
                className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
                style={{ backgroundColor: '#FFD1DC' }}
            />
            <div
                className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"
                style={{ backgroundColor: '#E2E8F0' }}
            />

            <div className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 relative overflow-hidden flex flex-col max-h-[90vh]">
                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-gray-100/50">
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
                    <div className="flex justify-between items-center mb-6 opacity-40 text-xs font-bold tracking-widest uppercase">
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
