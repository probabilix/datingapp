import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { blogsData } from '../data/blogsData';
import { themeData } from '../data/themeData';

const BlogsPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: themeData.colors.bgSoft }}>
      <Header />
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          <Link to="/" className="text-sm font-bold opacity-50 hover:opacity-100 mb-8 inline-block">← BACK TO HOME</Link>
          
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'DM Serif Display' }}>{blogsData.title}</h1>
            <p className="text-xl opacity-70">{blogsData.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {blogsData.posts.map((post) => (
              <div key={post.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-black/5 flex flex-col">
                <img src={post.image} alt={post.title} className="w-full h-56 object-cover" />
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex justify-between items-center mb-4 text-xs font-bold opacity-40 uppercase tracking-widest">
                    <span>{post.date}</span>
                    <span>By {post.author}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 leading-tight" style={{ fontFamily: 'DM Serif Display' }}>{post.title}</h3>
                  <p className="text-[15px] opacity-70 leading-relaxed mb-6">{post.excerpt}</p>
                  <button className="mt-auto self-start font-bold text-sm" style={{ color: themeData.colors.brand }}>Read Article →</button>
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

export default BlogsPage;