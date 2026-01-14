import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { themeData } from '../data/themeData';

const ForgotPasswordPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      <Helmet><title>Reset Password | DatingAdvice.io</title></Helmet>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-16">
        <div className="w-full max-w-md">
          <Link to="/login" className="text-xs font-bold opacity-30 hover:opacity-100 uppercase tracking-widest mb-10 inline-block transition-opacity">← Back to login</Link>

          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-2 text-[#12172D]" style={{ fontFamily: 'DM Serif Display' }}>Reset password</h1>
            <p className="text-sm text-[#5A5E73] opacity-60">Enter your email to receive a secure reset link</p>
          </div>

          {!submitted ? (
            <form className="space-y-6" onSubmit={async (e) => {
              e.preventDefault();
              if (isLoading) return; // Prevent double-submit
              setIsLoading(true);
              try {
                const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: (e.target as any)[0].value })
                });
                if (response.ok) setSubmitted(true);
                else {
                  const data = await response.json();
                  alert(data.error || "Failed to send email. Please try again.");
                }
              } catch (err) {
                console.error(err);
                alert("Server error. Please check connection.");
              } finally {
                setIsLoading(false);
              }
            }}>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                disabled={isLoading}
                className="w-full px-5 py-4 rounded-xl bg-[#F9F9F9] outline-none focus:ring-1 focus:ring-[#E94057]/20 transition-all text-[#12172D] disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl text-white font-bold shadow-lg transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                style={{ backgroundColor: themeData.colors.brand }}
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          ) : (
            <div className="p-8 bg-[#FDEFF2]/30 rounded-3xl border border-[#FDEFF2] text-center">
              <p className="text-[#E94057] font-bold text-lg mb-2">Check your inbox!</p>
              <p className="text-sm text-[#5A5E73] opacity-70">If an account exists, you will receive reset instructions shortly.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 text-xs font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
              >
                Try a different email
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Decorative Side */}
      <div className="hidden md:flex flex-1 items-center justify-center p-12" style={{ background: 'linear-gradient(135deg, #FDEFF2 0%, #F7F3EE 100%)' }}>
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 bg-white/60 backdrop-blur-md rounded-[40px] shadow-xl flex items-center justify-center mx-auto mb-10">
            <span className="text-4xl" style={{ color: themeData.colors.brand }}>♥</span>
          </div>
          <h2 className="text-4xl font-bold mb-6 leading-tight text-[#12172D]" style={{ fontFamily: 'DM Serif Display' }}>Security First</h2>
          <p className="text-sm text-[#5A5E73] opacity-60 leading-relaxed">We take your privacy seriously. Follow the secure link in your email to safely reset your account password.</p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;