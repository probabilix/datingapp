import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { privacyPolicyData } from '../data/legalData';
import { themeData } from '../data/themeData';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: themeData.colors.bgSoft }}>
      <Header />
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-[800px] mx-auto">
          <Link to="/" className="text-sm font-bold opacity-50 hover:opacity-100 mb-8 inline-block">← BACK TO HOME</Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'DM Serif Display' }}>{privacyPolicyData.title}</h1>
          <p className="text-sm opacity-50 mb-10">Last Updated: {privacyPolicyData.lastUpdated}</p>
          <div className="text-lg leading-relaxed opacity-80">{privacyPolicyData.content}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPage;