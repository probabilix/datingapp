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
    <div className="fixed inset-0 z-[100] bg-white flex flex-col p-8 animate-in fade-in slide-in-from-right duration-300">
      <button onClick={onClose} className="self-end text-4xl text-gray-800 mb-8">
        ×
      </button>

      <nav className="flex flex-col gap-8 text-center">
        {navigationData.map((link) => (
          <a
            key={link.label}
            href={link.path}
            onClick={onClose}
            className="text-3xl font-bold text-gray-900"
            style={{ fontFamily: 'DM Serif Display' }}
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
                className="text-xl font-bold text-[#12172D] py-2 text-center"
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
