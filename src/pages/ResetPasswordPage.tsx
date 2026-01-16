import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { themeData } from '../data/themeData';
import { supabase } from '../lib/supabaseClient';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [formData, setFormData] = useState({ pwd: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // State to track if we allow the user to reset password
  const [canReset, setCanReset] = useState(false);

  useEffect(() => {
    // 1. CLEAN LINK STRATEGY: Check for 'token' in URL (from our direct email link)
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');
    const type = searchParams.get('type');

    if (token && type) {
      console.log("[ResetPwd] Detected Clean Link Token. Verifying...");
      // Explicitly cast type to EmailOtpType to satisfy TS
      const otpType = type as import('@supabase/supabase-js').EmailOtpType; // 'recovery'

      supabase.auth.verifyOtp({ token, type: otpType, email: undefined }).then(({ data, error }) => {
        if (!error && data.session) {
          console.log("[ResetPwd] Manual Verification Success");
          setCanReset(true);
          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          console.error("[ResetPwd] Verification Failed:", error);
          setError("Invalid or expired link. Please request a new one.");
        }
      });
    }

    // 2. Check if we already have a session (Standard Flow)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setCanReset(true);
      }
    });

    // 2. Listen for auth changes. 
    // When the user clicks the recovery link, Supabase processes the hash fragment 
    // and fires a SIGNED_IN or PASSWORD_RECOVERY event.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setCanReset(true);
      } else if (event === 'SIGNED_OUT') {
        setCanReset(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canReset) {
      setError("Session expired or invalid. Please request a new reset link.");
      return;
    }

    if (formData.pwd.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (formData.pwd !== formData.confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password: formData.pwd });
      if (error) throw error;

      alert("Password updated successfully! Redirecting to login...");
      await supabase.auth.signOut(); // Clean up session
      navigate('/login');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  const brandColor = themeData.colors.brand;
  const navyColor = themeData.colors.textHeading;

  if (!canReset) {
    // If not authenticated yet, we check if there is an error in the hash
    // or if we are just waiting for the auth event to fire (which happens very quickly).
    // To avoid flashing "Invalid Link" immediately, we can check if there's a hash.
    const hasHash = window.location.hash.length > 0;

    // If there is a hash like #error=..., show error.
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const errorDescription = hashParams.get('error_description');

    if (errorDescription) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-white">
          <div className="text-center max-w-lg">
            <h1 className="text-2xl font-bold mb-4 text-red-500">Link Expired or Invalid</h1>
            <p className="mb-6 text-gray-600">{errorDescription.replace(/\+/g, ' ')}</p>
            <button onClick={() => navigate('/forgot-password')} className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors">
              Request New Link
            </button>
          </div>
        </div>
      );
    }

    // If there is a hash but no error, we are likely processing the token. Show spinner.
    if (hasHash) {
      return (
        <div className="min-h-screen flex items-center justify-center flex-col gap-4">
          <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Verifying link...</p>
        </div>
      );
    }

    // If no hash and no session, then the user just navigated here directly.
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-white">
        <div className="text-center max-w-lg">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Password Reset</h1>
          <p className="mb-6 text-gray-600">Please click the link sent to your email to reset your password.</p>
          <button onClick={() => navigate('/forgot-password')} className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors">
            Request Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white">
      <Helmet><title>Set New Password | DatingAdvice.io</title></Helmet>
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 bg-[#FDEFF2] rounded-2xl flex items-center justify-center mx-auto mb-8">
          <span className="text-2xl" style={{ color: brandColor }}>♥</span>
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'DM Serif Display', color: navyColor }}>New Password</h1>
        <p className="text-sm opacity-50 mb-10">Choose a strong password to secure your account</p>

        <form className="space-y-4 text-left" onSubmit={handleUpdate}>
          <div className="relative">
            <input
              type={showPwd ? "text" : "password"}
              placeholder="New Password"
              required
              className="w-full px-5 py-4 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#E94057]/20 transition-all"
              onChange={(e) => setFormData({ ...formData, pwd: e.target.value })}
            />
            <button type="button" onClick={() => setShowPwd(!showPwd)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest"
              style={{ color: brandColor }}>
              {showPwd ? "Hide" : "Show"}
            </button>
          </div>

          <input
            type="password"
            placeholder="Confirm New Password"
            required
            className="w-full px-5 py-4 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#E94057]/20 transition-all"
            onChange={(e) => setFormData({ ...formData, confirm: e.target.value })}
          />

          {error && <p className="text-xs font-bold text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl text-white font-bold shadow-lg transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            style={{ backgroundColor: brandColor }}>
            {loading ? "Updating..." : "Update and Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;