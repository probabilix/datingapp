import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { themeData } from '../data/themeData';
import { supabase } from '../lib/supabaseClient'; // Import the client

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
        redirectTo: 'http://localhost:5173/dashboard',
      },
    });
    if (googleError) setError(googleError.message);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      <Helmet><title>Login | DatingAdvice.io</title></Helmet>

      <div className="flex-1 flex items-center justify-center p-8 sm:p-16">
        <div className="w-full max-w-md">
          <Link to="/" className="text-xs font-black opacity-30 hover:opacity-100 uppercase tracking-widest mb-10 inline-block transition-opacity">← Back to home</Link>
          
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
            <span className="bg-white text-[#E94057] w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-transform group-hover:scale-110">G</span> 
            Continue with Google
          </button>

          <form className="space-y-4" onSubmit={handleLogin}>
            <input 
              type="email" 
              placeholder="Email Address" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#E94057]/20 transition-all text-[#12172D]" 
            />
            
            <div className="relative">
              <input 
                type={showPwd ? "text" : "password"} 
                placeholder="Password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#E94057]/20 transition-all text-[#12172D]" 
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest" style={{ color: brandColor }}>
                {showPwd ? "Hide" : "Show"}
              </button>
            </div>
            
            {error && <p className="text-xs font-bold text-red-500 mt-1">{error}</p>}

            <div className="text-right">
              <Link to="/forgot-password" className="text-xs font-bold opacity-40 hover:opacity-100" style={{ color: brandColor }}>Forgot Password?</Link>
            </div>

            <button type="submit" className="w-full py-4 rounded-xl text-white font-bold mt-4 shadow-xl active:scale-95 transition-all hover:brightness-110" style={{ backgroundColor: brandColor }}>Sign In</button>
          </form>

          <p className="mt-10 text-center text-xs font-bold opacity-40">
            Don't have an account? <Link to="/signup" className="underline" style={{ color: brandColor }}>Sign up</Link>
          </p>
        </div>
      </div>

      <div className="hidden md:flex flex-1 items-center justify-center p-12 order-last shadow-2xl" 
           style={{ background: 'linear-gradient(135deg, #FF9A9E 0%, #FAD0C4 50%, #F7F3EE 100%)' }}>
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 bg-white/40 backdrop-blur-xl rounded-[40px] shadow-2xl flex items-center justify-center mx-auto mb-10 border border-white/50">
             <span className="text-5xl" style={{ color: brandColor }}>♥</span>
          </div>
          <h2 className="text-5xl font-bold mb-6 leading-tight" style={{ fontFamily: 'DM Serif Display', color: navyColor }}>Your Journey to Love Continues</h2>
          <p className="text-md font-medium opacity-60 leading-relaxed" style={{ color: navyColor }}>Connect with your AI advisors and get personalized guidance for your relationship goals.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;