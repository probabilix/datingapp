import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { careersData } from '../data/careersData';
import { themeData } from '../data/themeData';

const CareersPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: themeData.colors.bgSoft }}>
      <Header />
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          <Link to="/" className="text-sm font-bold opacity-50 hover:opacity-100 mb-8 inline-block">← BACK TO HOME</Link>
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'DM Serif Display' }}>{careersData.title}</h1>
          <p className="text-xl opacity-70 mb-12">{careersData.intro}</p>

          <div className="grid gap-4">
            {careersData.openings.map(job => (
              <div key={job.id} className="bg-white p-8 rounded-[2rem] flex flex-col sm:flex-row justify-between items-center shadow-sm border border-black/5 hover:border-pink-100 transition-all">
                <div className="text-center sm:text-left mb-4 sm:mb-0">
                  <h3 className="text-xl font-bold">{job.title}</h3>
                  <p className="text-sm opacity-50">{job.type} • {job.location}</p>
                </div>
                <button className="px-8 py-3 rounded-xl text-white font-bold text-sm" style={{ backgroundColor: themeData.colors.brand }}>Apply Now</button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CareersPage;