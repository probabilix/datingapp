import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { themeData } from '../data/themeData';
import { supabase } from '../lib/supabaseClient';
import { Briefcase, MapPin, ArrowRight, Loader2 } from 'lucide-react';

interface Job {
  id: number;
  title: string;
  type: string;
  location: string;
  apply_link: string;
}

const CareersPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data, error } = await supabase
          .from('careers')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setJobs(data || []);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: themeData.colors.bgSoft }}>
      <Helmet>
        <title>Careers | DatingAdvice.io</title>
        <meta name="description" content="Join our team at DatingAdvice.io and help build the future of AI-powered relationship intelligence." />
      </Helmet>

      <Header />

      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          {/* Back Button */}
          <Link
            to="/"
            className="text-xs font-black opacity-30 hover:opacity-100 uppercase tracking-widest mb-8 inline-flex items-center gap-2 transition-opacity"
          >
            ← Back
          </Link>

          {/* Hero Section */}
          <div className="mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'DM Serif Display', color: themeData.colors.textHeading }}>
              Join the Team
            </h1>
            <p className="text-xl opacity-70 max-w-2xl" style={{ color: themeData.colors.textBody }}>
              Help us build the future of relationship intelligence. We're looking for passionate individuals to join our mission.
            </p>
          </div>

          {/* Job Listings */}
          <div className="grid gap-6">
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin opacity-20" size={40} />
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20 opacity-50 bg-white rounded-[2rem] border border-gray-100">
                <p className="text-lg font-medium">No open positions at the moment.</p>
                <p className="text-sm">Check back soon!</p>
              </div>
            ) : (
              jobs.map(job => (
                <div key={job.id} className="bg-white p-8 rounded-[2rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm border border-transparent hover:border-gray-200 hover:shadow-md transition-all group">
                  <div>
                    <h3 className="text-2xl font-bold mb-3" style={{ color: themeData.colors.textHeading }}>{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm font-medium opacity-60">
                      <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg">
                        <Briefcase size={14} /> {job.type}
                      </span>
                      <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg">
                        <MapPin size={14} /> {job.location}
                      </span>
                    </div>
                  </div>

                  <a
                    href={job.apply_link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 rounded-xl text-white font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 group-hover:gap-3"
                    style={{ backgroundColor: themeData.colors.brand }}
                  >
                    Apply Now <ArrowRight size={16} />
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CareersPage;