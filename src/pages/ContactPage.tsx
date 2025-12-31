import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { contactData } from '../data/contactData';
import { themeData } from '../data/themeData';

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: themeData.colors.bgSoft }}>
      <Header />
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          <Link to="/" className="text-sm font-bold opacity-50 hover:opacity-100 mb-8 inline-block">← BACK TO HOME</Link>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h1 className="text-5xl font-bold mb-6" style={{ fontFamily: 'DM Serif Display' }}>{contactData.title}</h1>
              <p className="text-lg opacity-70 mb-8">Reach out to us at <span className="font-bold underline">{contactData.email}</span></p>
              <div className="space-y-4 opacity-80">
                <p><strong>Office:</strong> {contactData.office}</p>
                <p><strong>Social:</strong> {contactData.socials.instagram}</p>
              </div>
            </div>

            <form className="bg-white p-8 rounded-[2rem] shadow-sm flex flex-col gap-4 border border-black/5">
              <input type="text" placeholder="Your Name" className="p-4 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-pink-100 transition-all" />
              <input type="email" placeholder="Email Address" className="p-4 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-pink-100 transition-all" />
              <textarea placeholder="How can we help?" className="p-4 rounded-xl bg-gray-50 h-32 outline-none focus:ring-2 focus:ring-pink-100 transition-all" />
              <button className="py-4 rounded-xl text-white font-bold transition-transform active:scale-95" style={{ backgroundColor: themeData.colors.brand }}>Send Message</button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;