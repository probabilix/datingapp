import React from 'react';
import { Link } from 'react-router-dom';
import { themeData, socialLinksData } from '../data/themeData';

const Footer: React.FC = () => {
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
            <div className="relative w-full max-w-[320px] mb-6">
              <input 
                type="email" 
                placeholder="Your email" 
                className="w-full pl-4 pr-[85px] py-3.5 rounded-xl text-sm border-none shadow-inner bg-white/70 focus:bg-white transition-all outline-none" 
              />
              <button 
                className="absolute right-1.5 top-1.5 bottom-1.5 px-5 rounded-lg text-white font-bold text-xs" 
                style={{ backgroundColor: themeData.colors.brand }}
              >
                Join
              </button>
            </div>

            <div className="flex gap-3">
              {socialLinksData.map(social => (
                <a key={social.id} href={social.url} className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-black/5 shadow-sm hover:scale-110 transition-transform">
                  <span className="text-[14px] font-bold" style={{ color: themeData.colors.brand }}>{social.icon}</span>
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
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-black/5 text-center">
          <p className="text-[11px] opacity-30 uppercase tracking-[0.2em]">© 2025 DatingAdvice.io. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;