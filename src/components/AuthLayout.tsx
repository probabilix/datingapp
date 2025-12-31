import React from 'react';
import { Link } from 'react-router-dom';
import { themeData } from '../data/themeData';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="w-full max-w-md relative">
      <Link to="/" className="absolute -top-12 left-0 text-sm font-bold opacity-40 hover:opacity-100 flex items-center gap-2 transition-opacity">
        ← BACK TO HOME
      </Link>

      <div className="mb-10 text-left">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-lg font-bold" style={{ backgroundColor: themeData.colors.brand }}>♥</div>
          <span className="text-xl font-bold tracking-tight" style={{ fontFamily: 'DM Serif Display' }}>DatingAdvice</span>
        </div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'DM Serif Display' }}>{title}</h1>
        <p className="text-sm opacity-60 mt-1">{subtitle}</p>
      </div>
      {children}
    </div>
  );
};

export default AuthLayout;