import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { themeData, navigationData } from '../data/themeData';
import MobileMenu from './MobileMenu';
import { supabase } from '../lib/supabaseClient';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === '/dashboard';

  useEffect(() => {
    // Remove access token from URL (OAuth cleanup)
    if (window.location.hash.includes('access_token')) {
      window.history.replaceState(null, '', window.location.pathname);
    }

    // Sync session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );

    // Scroll effect
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);

    // Close profile menu on outside click
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleOutsideClick);
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowProfileMenu(false);
    navigate('/');
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-50 transition-all duration-300 h-20"
        style={{
          backgroundColor:
            isScrolled || isDashboard ? 'rgba(255,255,255,0.95)' : 'transparent',
          backdropFilter: isScrolled || isDashboard ? 'blur(10px)' : 'none',
          borderBottom:
            isScrolled || isDashboard
              ? `1px solid ${themeData.colors.border}`
              : 'transparent',
        }}
      >
        <div className="h-full max-w-full mx-auto px-6 md:px-10 flex items-center justify-between">

          {/* LOGO */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl shadow-lg"
              style={{ backgroundColor: themeData.colors.brand }}
            >
              ♥
            </div>
            <span
              className="ml-3 text-2xl font-bold tracking-tight text-[#12172D]"
              style={{ fontFamily: 'DM Serif Display' }}
            >
              DatingAdvice
            </span>
          </Link>

          {/* DESKTOP CENTER */}
          <div className="hidden md:flex items-center gap-10">
            {isDashboard ? (
              <p className="text-sm font-semibold text-[#5A5E73] italic">
                “Consistency turns potential into success.”
              </p>
            ) : (
              navigationData.map((link) => (
                <a
                  key={link.label}
                  href={link.path}
                  className="text-[15px] font-medium text-[#5A5E73] hover:text-[#E94057] transition-all"
                >
                  {link.label}
                </a>
              ))
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">
            {!session ? (
              <>
                <Link to="/login" className="hidden md:block text-[15px] font-semibold text-[#12172D]">
                  Sign In
                </Link>
                <Link to="/signup">
                  <button
                    className="hidden md:block px-6 py-2.5 rounded-xl text-white font-bold shadow-md hover:brightness-110 active:scale-95 transition-all"
                    style={{ backgroundColor: themeData.colors.brand }}
                  >
                    Get Started
                  </button>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="md:hidden text-3xl text-[#12172D]"
                >
                  ☰
                </button>
              </>
            ) : (
              <div className="flex items-center gap-6 relative">
                {!isDashboard && (
                  <Link
                    to="/dashboard"
                    className="hidden md:block px-5 py-2 rounded-xl text-white text-xs font-black uppercase tracking-widest shadow-md hover:brightness-110 transition-all"
                    style={{ backgroundColor: themeData.colors.brand }}
                  >
                    Go to App
                  </Link>
                )}

                {/* PROFILE */}
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="w-10 h-10 rounded-full border-2 border-gray-100 p-0.5 hover:border-[#E94057] transition-all overflow-hidden shadow-sm"
                  >
                    <img
                      src={
                        session.user.user_metadata.avatar_url ||
                        `https://ui-avatars.com/api/?name=${session.user.email}&background=FDEFF2&color=E94057&bold=true`
                      }
                      alt="User"
                      className="w-full h-full rounded-full"
                    />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute top-14 right-0 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-gray-50 mb-1 text-[11px] font-bold truncate opacity-40">
                        {session.user.email}
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setShowProfileMenu(false)}
                        className="block px-4 py-2.5 text-sm font-bold hover:bg-gray-50"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/billing"
                        onClick={() => setShowProfileMenu(false)}
                        className="block px-4 py-2.5 text-sm font-bold hover:bg-gray-50"
                      >
                        Billing
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50"
                      >
                        Log Out
                      </button>
                    </div>
                  )}
                </div>

                {!isDashboard && (
                  <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="md:hidden text-3xl text-[#12172D]"
                  >
                    ☰
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {!isDashboard && (
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Header;
