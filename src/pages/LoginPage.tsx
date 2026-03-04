import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { themeData } from '../data/themeData';
import { supabase } from '../lib/supabaseClient'; // Import the client
import { Logo } from '../components/Logo';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const brandColor = themeData.colors.brand;
  const navyColor = themeData.colors.textHeading;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
    } else {
      navigate('/dashboard');
    }
  };

  const handleGoogleLogin = async () => {
    const { error: googleError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (googleError) setError(googleError.message);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row" style={{ backgroundColor: 'var(--color-page-bg)' }}>
      <Helmet><title>Login | DatingAdvice.io</title></Helmet>

      <div className="flex-1 flex items-center justify-center p-8 sm:p-16">
        <div className="w-full max-w-md">
          <Link to="/" className="text-xs font-black opacity-50 hover:opacity-100 uppercase tracking-widest mb-10 inline-block transition-opacity" style={{ color: 'var(--color-text-muted)' }}>← Back to home</Link>

          <div className="mb-10 text-left">
            <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'DM Serif Display', color: navyColor }}>Welcome back</h1>
            <p className="text-sm opacity-50" style={{ color: themeData.colors.textBody }}>Sign in to continue your journey</p>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full py-4 border-2 rounded-xl flex items-center justify-center gap-3 font-bold transition-all duration-300 group mb-8"
            style={{ borderColor: brandColor, color: brandColor }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = brandColor;
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = brandColor;
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" className="transition-transform group-hover:scale-110 flex-shrink-0">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <form className="space-y-4" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-xl outline-none focus:ring-2 focus:ring-[#E94057]/20 transition-all"
              style={{ backgroundColor: 'var(--color-input-solid)', color: 'var(--color-text-heading)', border: '1px solid var(--color-border)' }}
            />

            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-xl outline-none focus:ring-2 focus:ring-[#E94057]/20 transition-all"
                style={{ backgroundColor: 'var(--color-input-solid)', color: 'var(--color-text-heading)', border: '1px solid var(--color-border)' }}
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest" style={{ color: brandColor }}>
                {showPwd ? "Hide" : "Show"}
              </button>
            </div>

            {error && <p className="text-xs font-bold text-red-500 mt-1">{error}</p>}

            <div className="text-right">
              <Link to="/forgot-password" className="text-xs font-bold opacity-70 hover:opacity-100" style={{ color: brandColor }}>Forgot Password?</Link>
            </div>

            <button type="submit" className="w-full py-4 rounded-xl text-white font-bold mt-4 shadow-xl active:scale-95 transition-all hover:brightness-110" style={{ backgroundColor: brandColor }}>Sign In</button>
          </form>

          <p className="mt-10 text-center text-xs font-bold" style={{ color: 'var(--color-text-body)' }}>
            Don't have an account? <Link to="/signup" className="underline font-black" style={{ color: brandColor }}>Sign up</Link>
          </p>
        </div>
      </div>

      <div className="hidden md:flex flex-1 items-center justify-center p-12 order-last shadow-2xl auth-side-panel relative overflow-hidden bg-[#0d0d0f]">
        {/* Decorative background elements for "Rich" feel */}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#E94057]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[100px] rounded-full" />

        <div className="text-center max-w-sm relative z-10">
          <div className="w-28 h-28 bg-white/40 dark:bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] shadow-2xl flex items-center justify-center mx-auto mb-10 border border-white/50 dark:border-white/[0.05] transition-all hover:scale-105 duration-500">
            <Logo className="h-16 w-16 object-contain drop-shadow-2xl dark:drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]" />
          </div>
          <h2 className="text-5xl font-bold mb-6 leading-tight tracking-tight" style={{ fontFamily: 'DM Serif Display', color: 'var(--color-text-heading)' }}>Your Journey to Love Continues</h2>
          <p className="text-lg font-medium opacity-50 leading-relaxed" style={{ color: 'var(--color-text-body)' }}>Connect with your AI advisors and get personalized guidance for your relationship goals.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;