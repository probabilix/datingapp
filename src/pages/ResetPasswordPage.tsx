import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { themeData } from '../data/themeData';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [formData, setFormData] = useState({ pwd: '', confirm: '' });
  const [error, setError] = useState('');

  const brandColor = themeData.colors.brand;
  const navyColor = themeData.colors.textHeading;

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.pwd.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (formData.pwd !== formData.confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    // After successful update, divert to login
    alert("Password updated! Redirecting to login...");
    navigate('/login');
  };

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
              onChange={(e) => setFormData({...formData, pwd: e.target.value})}
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
            onChange={(e) => setFormData({...formData, confirm: e.target.value})}
          />

          {error && <p className="text-xs font-bold text-red-500">{error}</p>}
          
          <button className="w-full py-4 rounded-xl text-white font-bold shadow-lg transition-all active:scale-95" 
                  style={{ backgroundColor: brandColor }}>
            Update and Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;