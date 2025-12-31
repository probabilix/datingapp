import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { aboutData } from '../data/aboutData';
import { themeData } from '../data/themeData';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: themeData.colors.bgSoft }}>
      <Header />
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          <Link to="/" className="text-sm font-bold opacity-50 hover:opacity-100 mb-8 inline-block">← BACK TO HOME</Link>
          <h1 className="text-5xl md:text-6xl font-bold mb-8" style={{ fontFamily: 'DM Serif Display' }}>{aboutData.title}</h1>
          <div className="prose prose-lg opacity-80 leading-relaxed" style={{ color: themeData.colors.textBody }}>
            {aboutData.content}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;