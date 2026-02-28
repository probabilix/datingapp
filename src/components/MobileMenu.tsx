import React, { useEffect, useState } from 'react';
import { navigationData, themeData } from '../data/themeData';
import { supabase } from '../lib/supabaseClient';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col p-8 animate-in fade-in slide-in-from-right duration-300"
      style={{ backgroundColor: 'var(--color-mobile-menu-bg)' }}
    >
      <button
        onClick={onClose}
        className="self-end text-4xl mb-8 transition-colors"
        style={{ color: 'var(--color-text-heading)' }}
      >
        ×
      </button>

      <nav className="flex flex-col gap-8 text-center">
        {navigationData.map((link) => (
          <a
            key={link.label}
            href={link.path}
            onClick={onClose}
            className="text-3xl font-bold"
            style={{ fontFamily: 'DM Serif Display', color: 'var(--color-text-heading)' }}
          >
            {link.label}
          </a>
        ))}

        <div className="flex flex-col gap-4 mt-10">
          {!session ? (
            <>
              <a
                href="/login"
                onClick={onClose}
                className="text-xl font-bold py-2 text-center"
                style={{ color: 'var(--color-text-heading)' }}
              >
                Sign In
              </a>
              <a href="/signup" onClick={onClose}>
                <button
                  className="w-full py-4 rounded-2xl text-white font-bold text-xl shadow-lg"
                  style={{ backgroundColor: themeData.colors.brand }}
                >
                  Get Started
                </button>
              </a>
            </>
          ) : (
            <a href="/dashboard" onClick={onClose}>
              <button
                className="w-full py-4 rounded-2xl text-white font-bold text-xl shadow-lg"
                style={{ backgroundColor: themeData.colors.brand }}
              >
                Go to Dashboard
              </button>
            </a>
          )}
        </div>
      </nav>
    </div>
  );
};

export default MobileMenu;
