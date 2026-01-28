import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { themeData } from '../data/themeData';
import { supabase } from '../lib/supabaseClient';
import { Check, Loader2, Twitter, Instagram, Facebook, Sparkles } from 'lucide-react';

interface SocialLink {
  icon_key: string;
  url: string;
  handle: string;
  platform: string;
}

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'invalid'>('idle');
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      const { data } = await supabase
        .from('social_links')
        .select('platform, handle, url, icon_key')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (data) setSocialLinks(data);
    };
    fetchSocialLinks();
  }, []);

  const getIcon = (iconKey: string) => {
    switch (iconKey) {
      case 'Twitter': return <Twitter size={16} />;
      case 'Instagram': return <Instagram size={16} />;
      case 'Facebook': return <Facebook size={16} />;
      default: return <Sparkles size={16} />;
    }
  };

  const handleSubscribe = async () => {
    if (!email) return;

    // Email Validation Regex
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      setStatus('invalid');
      return;
    }

    setStatus('loading');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || null;

      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email: email,
          user_id: userId
        });

      if (error) {
        if (error.code === '23505') { // Unique violation
          alert("You are already subscribed!");
          setStatus('idle');
        } else {
          throw error;
        }
      } else {
        setStatus('success');
        setEmail('');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <footer
      className="px-6 pt-16 pb-12 border-t border-gray-200/50"
      style={{ backgroundColor: themeData.colors.bgFooter }}
    >
      <div className="max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 md:gap-8 mb-16">

          {/* 1. Brand & Newsletter - Full width on mobile, 2 columns on desktop */}
          <div className="flex flex-col items-center md:items-start lg:col-span-2 text-center md:text-left">
            <Link to="/" className="flex items-center mb-6">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: themeData.colors.brand }}>♥</div>
              <span className="ml-3 text-xl font-bold" style={{ fontFamily: 'DM Serif Display', color: themeData.colors.textHeading }}>DatingAdvice</span>
            </Link>

            <p className="text-[13px] font-bold mb-3 uppercase tracking-wider opacity-40">Newsletter</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubscribe();
              }}
              className="relative w-full max-w-[320px] mb-6"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'invalid' || status === 'error') setStatus('idle');
                }}
                disabled={status === 'success' || status === 'loading'}
                placeholder={status === 'success' ? "Thanks for joining!" : "Your email"}
                className={`w-full pl-4 pr-[85px] py-3.5 rounded-xl text-sm border shadow-inner bg-white/70 focus:bg-white transition-all outline-none ${status === 'invalid' ? 'border-red-300 ring-2 ring-red-100' : 'border-none'}`}
              />
              <button
                type="submit"
                disabled={status === 'success' || status === 'loading'}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-5 rounded-lg text-white font-bold text-xs disabled:opacity-70 transition-all active:scale-95"
                style={{ backgroundColor: status === 'success' ? '#10B981' : themeData.colors.brand }}
              >
                {status === 'loading' ? <Loader2 className="animate-spin" size={14} /> : status === 'success' ? <Check size={14} /> : 'Join'}
              </button>
            </form>
            {status === 'invalid' && <p className="text-red-500 text-xs font-bold mb-4 -mt-4">Please enter a valid email address.</p>}

            <div className="flex gap-3">
              {socialLinks.map(social => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-black/5 shadow-sm hover:scale-110 transition-transform"
                >
                  <span style={{ color: themeData.colors.brand }}>{getIcon(social.icon_key)}</span>
                </a>
              ))}
            </div>
          </div>

          {/* TWO-GRID SYSTEM FOR MOBILE LINKS: Company, Resources, Legal */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:col-span-3 text-left">
            {/* 2. Company */}
            <div className="flex flex-col">
              <h4 className="font-bold mb-5 text-[14px] uppercase tracking-widest opacity-40">Company</h4>
              <ul className="flex flex-col gap-4 text-sm font-medium">
                <li><Link to="/about" className="hover:text-[#E94057]">About Us</Link></li>
                <li><Link to="/careers" className="hover:text-[#E94057]">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-[#E94057]">Contact Us</Link></li>
              </ul>
            </div>

            {/* 3. Resources */}
            <div className="flex flex-col">
              <h4 className="font-bold mb-5 text-[14px] uppercase tracking-widest opacity-40">Resources</h4>
              <ul className="flex flex-col gap-4 text-sm font-medium">
                <li><Link to="/blogs" className="hover:text-[#E94057]">Blogs</Link></li>
                <li><Link to="/success-stories" className="hover:text-[#E94057]">Success Stories</Link></li>
              </ul>
            </div>

            {/* 4. Legal */}
            <div className="flex flex-col">
              <h4 className="font-bold mb-5 text-[14px] uppercase tracking-widest opacity-40">Legal</h4>
              <ul className="flex flex-col gap-4 text-sm font-medium">
                <li><Link to="/privacy" className="hover:text-[#E94057]">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-[#E94057]">Terms of Use</Link></li>
                <li><Link to="/cookies" className="hover:text-[#E94057]">Cookies Policy</Link></li>
                <li><Link to="/refund-policy" className="hover:text-[#E94057]">Refund Policy</Link></li>
                <li><Link to="/community-guidelines" className="hover:text-[#E94057]">Community Guidelines</Link></li>
                <li><Link to="/arbitration-opt-out" className="hover:text-[#E94057]">Arbitration Opt-Out</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-black/5 text-center">
          <p className="text-[11px] opacity-50 uppercase tracking-[0.2em]">© 2026 DatingAdvice.io. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;