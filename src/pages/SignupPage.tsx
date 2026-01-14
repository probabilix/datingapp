import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import { themeData } from '../data/themeData';
import { signupLegalContent } from '../data/signupLegalContent';
import { supabase } from '../lib/supabaseClient';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', pwd: '', confirm: '' });
  const [error, setError] = useState('');

  const brandColor = themeData.colors.brand;
  const navyColor = themeData.colors.textHeading;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.pwd.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (formData.pwd !== formData.confirm) {
      setError("Passwords do not match.");
      return;
    }

    const { error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.pwd,
      options: {
        data: { full_name: formData.name }
      }
    });

    if (authError) {
      setError(authError.message);
    } else {
      // Trigger Welcome Email (Fire and forget)
      fetch('http://localhost:5000/api/notifications/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, name: formData.name })
      }).catch(err => console.error("Welcome email trigger failed", err));

      // Automatic login is enabled because you turned off email confirmation
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
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white relative">
      <Helmet><title>Create Account | DatingAdvice.io</title></Helmet>

      <div className="hidden md:flex flex-1 items-center justify-center p-12 shadow-2xl"
        style={{ background: 'linear-gradient(135deg, #FF9A9E 0%, #FAD0C4 50%, #F7F3EE 100%)' }}>
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 bg-white/40 backdrop-blur-xl rounded-[40px] shadow-2xl flex items-center justify-center mx-auto mb-10 border border-white/50">
            <span className="text-5xl" style={{ color: brandColor }}>♥</span>
          </div>
          <h2 className="text-5xl font-bold mb-6 leading-tight" style={{ fontFamily: 'DM Serif Display', color: navyColor }}>Start Your Love Journey</h2>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 sm:p-16">
        <div className="w-full max-w-md">
          <Link to="/" className="text-xs font-black opacity-30 hover:opacity-100 uppercase tracking-widest mb-10 inline-block">← Back to home</Link>
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'DM Serif Display', color: navyColor }}>Create account</h1>
          <p className="text-sm opacity-50 mb-8">Start your journey to better relationships</p>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-4 border-2 rounded-xl flex items-center justify-center gap-3 font-bold transition-all duration-300 group mb-8"
            style={{ borderColor: brandColor, color: brandColor }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = brandColor; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = brandColor; }}
          >
            <span className="bg-white text-[#E94057] w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-transform group-hover:scale-110">G</span>
            Continue with Google
          </button>

          <form className="space-y-4" onSubmit={handleSignup}>
            <input type="text" placeholder="Full Name" required className="w-full px-5 py-4 rounded-xl bg-gray-50 outline-none focus:ring-1 focus:ring-[#E94057]/20 transition-all text-[#12172D]"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <input type="email" placeholder="Email Address" required className="w-full px-5 py-4 rounded-xl bg-gray-50 outline-none focus:ring-1 focus:ring-[#E94057]/20 transition-all text-[#12172D]"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <div className="relative">
              <input type={showPwd ? "text" : "password"} placeholder="Password (Min. 8 chars)" required
                className="w-full px-5 py-4 rounded-xl bg-gray-50 outline-none focus:ring-1 focus:ring-[#E94057]/20 transition-all text-[#12172D]"
                onChange={(e) => setFormData({ ...formData, pwd: e.target.value })} />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest" style={{ color: brandColor }}>
                {showPwd ? "Hide" : "Show"}
              </button>
            </div>
            <input type="password" placeholder="Confirm Password" required className="w-full px-5 py-4 rounded-xl bg-gray-50 outline-none focus:ring-1 focus:ring-[#E94057]/20 transition-all text-[#12172D]"
              onChange={(e) => setFormData({ ...formData, confirm: e.target.value })} />

            {error && <p className="text-xs font-bold text-red-500 mt-1">{error}</p>}

            <div className="flex items-center gap-3 pt-2 group cursor-pointer" onClick={() => setAgreed(!agreed)}>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${agreed ? 'bg-[#E94057] border-[#E94057]' : 'border-gray-200'}`}>
                {agreed && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <label className="text-[10px] font-bold opacity-40 leading-snug cursor-pointer">
                I agree to the <button type="button" onClick={(e) => { e.stopPropagation(); setShowModal(true); }} className="underline hover:text-[#E94057]">Terms and Privacy Policy</button>
              </label>
            </div>

            <button disabled={!agreed} className={`w-full py-4 rounded-xl text-white font-bold mt-4 shadow-xl transition-all ${!agreed ? 'opacity-30 cursor-not-allowed' : 'hover:brightness-110 active:scale-95'}`} style={{ backgroundColor: brandColor }}>
              Create Account
            </button>
          </form>

          <p className="mt-10 text-center text-xs font-bold opacity-40">
            Already have an account? <Link to="/login" className="underline hover:opacity-100 transition-opacity" style={{ color: brandColor }}>Sign in</Link>
          </p>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-2xl font-bold" style={{ fontFamily: 'DM Serif Display', color: navyColor }}>{signupLegalContent.title}</h3>
              <button onClick={() => setShowModal(false)} className="text-xl opacity-20 hover:opacity-100 transition-opacity">✕</button>
            </div>
            <div className="p-8 overflow-y-auto text-sm leading-relaxed text-gray-500 bg-[#FCFAFA] prose prose-sm max-w-none">
              <ReactMarkdown>{signupLegalContent.content}</ReactMarkdown>
            </div>
            <div className="p-6 bg-white border-t border-gray-100">
              <button onClick={() => { setAgreed(true); setShowModal(false); }} className="w-full py-4 rounded-xl text-white font-bold transition-all hover:brightness-110" style={{ backgroundColor: brandColor }}>
                {signupLegalContent.acceptButton}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupPage;