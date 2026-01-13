import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabaseClient';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { themeData } from '../data/themeData';
import { Loader2, MapPin, Heart, Quote } from 'lucide-react';

interface SuccessStory {
  id: string;
  names: string;
  location: string;
  image_url: string;
  quote: string;
  story: string;
  duration: string;
  is_featured: boolean;
}

const SuccessStoriesPage: React.FC = () => {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      const { data, error } = await supabase
        .from('success_stories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching success stories:', error);
      } else {
        setStories(data || []);
      }
      setLoading(false);
    };

    fetchStories();
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: themeData.colors.bgSoft }}>
      <Helmet>
        <title>Success Stories | DatingAdvice.io</title>
        <meta name="description" content="Real stories from couples who found love through our advice and coaching. See how tailored guidance leads to lasting connections." />
      </Helmet>

      <Header />

      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          <Link
            to="/"
            className="text-sm font-bold opacity-50 hover:opacity-100 mb-8 inline-block transition-opacity"
          >
            ← Back
          </Link>

          <div className="text-center mb-16 md:mb-24">
            <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ fontFamily: 'DM Serif Display', color: themeData.colors.textHeading }}>
              Love Stories
            </h1>
            <p className="text-xl md:text-2xl opacity-70 max-w-2xl mx-auto" style={{ color: themeData.colors.textBody }}>
              Real people. Real connections. Real results.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
          ) : (
            <div className="flex flex-col gap-24 md:gap-32">
              {stories.map((story, index) => (
                <div
                  key={story.id}
                  className={`flex flex-col md:flex-row gap-8 md:gap-16 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Image Section */}
                  <div className="w-full md:w-1/2">
                    <div className="relative aspect-[4/5] md:aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-xl">
                      <img
                        src={story.image_url}
                        alt={story.names}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 to-transparent text-white">
                        <div className="flex items-center gap-2 mb-2 font-bold opacity-90">
                          <MapPin size={16} /> {story.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm bg-white/20 backdrop-blur-md px-3 py-1 rounded-full w-fit">
                          <Heart size={12} fill="currentColor" /> {story.duration}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Text Section */}
                  <div className="w-full md:w-1/2">
                    <Quote size={48} className="opacity-20 mb-6" style={{ color: themeData.colors.brand }} />
                    <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: 'DM Serif Display', color: themeData.colors.textHeading }}>
                      {story.names}
                    </h2>
                    <blockquote className="text-xl md:text-2xl font-medium leading-relaxed mb-8 italic" style={{ color: themeData.colors.textHeading }}>
                      "{story.quote}"
                    </blockquote>
                    <p className="text-lg opacity-70 leading-relaxed mb-8" style={{ color: themeData.colors.textBody }}>
                      {story.story}
                    </p>
                    <div className="w-16 h-1 rounded-full opacity-20" style={{ backgroundColor: themeData.colors.brand }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SuccessStoriesPage;