import React from 'react';
import { Logo } from './Logo';
import { themeData } from '../data/themeData';

interface PageLoaderProps {
    text?: string;
    fullScreen?: boolean;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ text, fullScreen = true }) => {
    return (
        <div
            className={`flex flex-col items-center justify-center gap-6 ${fullScreen ? 'min-h-screen w-full fixed inset-0 z-[100]' : 'min-h-[60vh] w-full'}`}
            style={{ backgroundColor: 'var(--color-page-bg, #FAFAFA)' }}
        >
            <div className="relative flex items-center justify-center">
                {/* Subtle glowing ring behind the logo */}
                <div
                    className="absolute inset-0 rounded-full animate-ping opacity-20"
                    style={{ backgroundColor: themeData.colors.brand, transform: 'scale(1.5)' }}
                />

                {/* Pulsing Logo */}
                <Logo className="h-20 w-auto object-contain animate-pulse relative z-10 drop-shadow-2xl hover:scale-105 transition-transform" />
            </div>

            {text && (
                <p
                    className="text-sm font-medium tracking-wide animate-pulse"
                    style={{ color: 'var(--color-text-body)' }}
                >
                    {text}
                </p>
            )}
        </div>
    );
};
