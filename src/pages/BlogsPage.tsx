import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabaseClient';
import { themeData } from '../data/themeData';
import { Loader2, Calendar, User } from 'lucide-react';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image_url: string;
  published_at: string;
  author: string;
}

const BlogsPage: React.FC = () => {
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('id, slug, title, excerpt, image_url, published_at, author')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Error fetching blogs:', error);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: themeData.colors.bgSoft }}>
      <Helmet>
        <title>Relationship Insights | DatingAdvice.io</title>
        <meta name="description" content="Expert relationship advice, dating tips, and insights into the future of AI-powered connections. Read our latest articles." />
      </Helmet>
      <Header />
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          <Link
            to="/"
            className="text-sm font-bold opacity-50 hover:opacity-100 mb-8 inline-block"
          >
            ← Back
          </Link>

          <div className="text-center mb-10 md:mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4" style={{ fontFamily: 'DM Serif Display' }}>Relationship Insights</h1>
            <p className="text-xl opacity-70">Expert advice and the latest trends in AI-powered dating.</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              {posts.map((post) => (
                <Link to={`/blog/${post.slug}`} key={post.id} className="bg-white rounded-[24px] md:rounded-[32px] overflow-hidden shadow-sm border border-black/5 flex flex-col group hover:shadow-md transition-all duration-300">
                  <div className="h-48 md:h-56 overflow-hidden">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 md:p-8 flex flex-col flex-grow">
                    <div className="flex justify-between items-center mb-4 text-xs font-bold opacity-40 uppercase tracking-widest">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(post.published_at)}</span>
                      <span className="flex items-center gap-1"><User size={12} /> {post.author}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 leading-tight group-hover:text-pink-500 transition-colors" style={{ fontFamily: 'DM Serif Display' }}>{post.title}</h3>
                    <p className="text-[15px] opacity-70 leading-relaxed mb-6 line-clamp-3">{post.excerpt}</p>
                    <span className="mt-auto self-start font-bold text-sm flex items-center gap-2" style={{ color: themeData.colors.brand }}>
                      Read Article <span className="text-lg">→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogsPage;