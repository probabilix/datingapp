import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { themeData, navigationData } from '../data/themeData';
import MobileMenu from './MobileMenu';
import { supabase } from '../lib/supabaseClient';
import { useTheme } from '../hooks/useTheme';
import { Logo } from './Logo';

const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [session, setSession] = useState<any>(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const { isDark, toggleTheme } = useTheme();

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
        try {
            await supabase.auth.signOut();
            setSession(null);
            navigate('/');
        } catch (err) {
            console.error("Logout Error:", err);
            navigate('/');
        }
    };

    return (
        <>
            <nav
                className="fixed top-0 left-0 w-full z-50 transition-all duration-300 h-20"
                style={{
                    backgroundColor:
                        isScrolled ? 'var(--color-nav-bg)' : 'transparent',
                    backdropFilter: isScrolled ? 'blur(20px)' : 'none',
                    borderBottom:
                        isScrolled
                            ? '1px solid var(--color-border-soft)'
                            : '1px solid transparent',
                }}
            >
                <div className="h-full max-w-full mx-auto px-6 md:px-10 flex items-center justify-between">

                    {/* LOGO */}
                    <Link
                        to="/"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="flex items-center hover:opacity-80 transition-opacity"
                    >
                        <Logo className="h-14 w-14 object-contain" />
                        <span
                            className="-ml-1 text-2xl font-bold tracking-tight"
                            style={{ fontFamily: 'DM Serif Display', color: 'var(--color-text-heading)' }}
                        >
                            DatingAdvice
                        </span>
                    </Link>

                    {/* DESKTOP CENTER */}
                    <div className="hidden md:flex items-center gap-10">
                        {isDashboard ? (
                            <p className="text-sm font-semibold italic" style={{ color: 'var(--color-text-body)' }}>
                                "Consistency turns potential into success."
                            </p>
                        ) : (
                            navigationData.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.path}
                                    className="text-[15px] font-medium transition-all hover:text-[#E94057]"
                                    style={{ color: 'var(--color-text-body)' }}
                                >
                                    {link.label}
                                </a>
                            ))
                        )}
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex items-center gap-3">

                        {/* THEME TOGGLE BUTTON — visible always, desktop + mobile */}
                        <button
                            onClick={toggleTheme}
                            className="theme-toggle w-9 h-9 rounded-full flex items-center justify-center text-lg border transition-all"
                            style={{
                                backgroundColor: 'var(--color-card-bg)',
                                borderColor: 'var(--color-border)',
                                color: 'var(--color-text-heading)',
                            }}
                            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                            title={isDark ? 'Light Mode' : 'Dark Mode'}
                        >
                            {isDark ? '☀️' : '🌙'}
                        </button>

                        {!session ? (
                            <>
                                <Link
                                    to="/login"
                                    className="hidden md:block text-[15px] font-semibold"
                                    style={{ color: 'var(--color-text-heading)' }}
                                >
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
                                    className="md:hidden text-3xl"
                                    style={{ color: 'var(--color-text-heading)' }}
                                >
                                    ☰
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-4 relative">
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
                                        className="w-10 h-10 rounded-full border-2 p-0.5 hover:border-[#E94057] transition-all overflow-hidden shadow-sm"
                                        style={{ borderColor: 'var(--color-border)' }}
                                    >
                                        <img
                                            src={
                                                session.user.user_metadata.avatar_url ||
                                                `https://ui-avatars.com/api/?name=${session.user.email}&background=FDEFF2&color=E94057&bold=true`
                                            }
                                            alt="User"
                                            referrerPolicy="no-referrer"
                                            className="w-full h-full rounded-full"
                                        />
                                    </button>

                                    {showProfileMenu && (
                                        <div
                                            className="absolute top-14 right-0 w-48 rounded-2xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 duration-200"
                                            style={{
                                                backgroundColor: 'var(--color-card-bg)',
                                                border: '1px solid var(--color-border)',
                                            }}
                                        >
                                            <div
                                                className="px-4 py-3 mb-1 text-[11px] font-bold truncate opacity-40"
                                                style={{ borderBottom: '1px solid var(--color-border)' }}
                                            >
                                                {session.user.email}
                                            </div>
                                            <Link
                                                to="/dashboard"
                                                onClick={() => setShowProfileMenu(false)}
                                                className="block px-4 py-2.5 text-sm font-bold transition-colors"
                                                style={{ color: 'var(--color-text-heading)' }}
                                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-card-hover)')}
                                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                                            >
                                                Dashboard
                                            </Link>
                                            <Link
                                                to="/billing"
                                                onClick={() => setShowProfileMenu(false)}
                                                className="block px-4 py-2.5 text-sm font-bold transition-colors"
                                                style={{ color: 'var(--color-text-heading)' }}
                                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-card-hover)')}
                                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                                            >
                                                Billing
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-500 transition-colors"
                                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)')}
                                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                                            >
                                                Log Out
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {!isDashboard && (
                                    <button
                                        onClick={() => setIsMobileMenuOpen(true)}
                                        className="md:hidden text-3xl"
                                        style={{ color: 'var(--color-text-heading)' }}
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