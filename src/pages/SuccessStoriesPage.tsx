import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { successStoriesPageData } from '../data/successStoriesPageData';
import { themeData } from '../data/themeData';

const SuccessStoriesPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: themeData.colors.bgSoft }}>
      <Header />
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          <Link to="/" className="text-sm font-bold opacity-50 hover:opacity-100 mb-8 inline-block">← BACK TO HOME</Link>
          <h1 className="text-5xl md:text-6xl font-bold mb-12" style={{ fontFamily: 'DM Serif Display' }}>Success Stories</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {successStoriesPageData.map((item) => (
              <div key={item.id} className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-black/5">
                <img src={item.image} alt={item.couple} className="w-full h-64 object-cover" />
                <div className="p-10">
                  <span className="text-[#E94057] font-bold text-xs uppercase tracking-widest">{item.duration}</span>
                  <h3 className="text-3xl font-bold mt-2 mb-4" style={{ fontFamily: 'DM Serif Display' }}>{item.couple}</h3>
                  <p className="text-lg opacity-70 italic">"{item.story}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SuccessStoriesPage;