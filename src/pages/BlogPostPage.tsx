import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabaseClient';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { themeData } from '../data/themeData';
import { Loader2, ArrowLeft, Calendar, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BlogPost {
    id: string;
    slug: string;
    title: string;
    content: string;
    image_url: string;
    published_at: string;
    author: string;
}

const BlogPostPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            if (!slug) return;

            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .eq('slug', slug)
                .eq('is_published', true)
                .single();

            if (error || !data) {
                console.error('Error fetching blog post:', error);
                setError(true);
            } else {
                setPost(data);
            }
            setLoading(false);
        };

        fetchPost();
    }, [slug]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
                <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
                <p className="mb-8 opacity-60">The article you are looking for does not exist or has been removed.</p>
                <Link to="/blogs" className="px-6 py-3 bg-black text-white rounded-xl font-bold text-sm">Return to Blogs</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: themeData.colors.bgSoft }}>
            <Helmet>
                <title>{post.title} | DatingAdvice.io</title>
                <meta name="description" content={`Read ${post.title} on DatingAdvice.io`} />
            </Helmet>

            <Header />

            <main className="flex-grow pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-6">
                <article className="max-w-[800px] mx-auto bg-white rounded-[24px] md:rounded-[2.5rem] shadow-sm border border-black/5 overflow-hidden">
                    {/* Hero Image */}
                    <div className="h-[250px] md:h-[400px] w-full relative">
                        <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-6 md:p-12 text-white w-full">
                            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs md:text-sm font-bold uppercase tracking-widest opacity-90 mb-3 md:mb-4">
                                <span className="flex items-center gap-2"><Calendar size={12} className="md:w-[14px] md:h-[14px]" /> {formatDate(post.published_at)}</span>
                                <span className="flex items-center gap-2"><User size={12} className="md:w-[14px] md:h-[14px]" /> {post.author}</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight" style={{ fontFamily: 'DM Serif Display' }}>
                                {post.title}
                            </h1>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-16">
                        <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-pink-600 prose-img:rounded-2xl font-serif text-lg leading-relaxed">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {post.content}
                            </ReactMarkdown>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 md:p-12 border-t border-gray-100 flex justify-between items-center">
                        <Link to="/blogs" className="font-bold text-sm opacity-60 hover:opacity-100 flex items-center gap-2 transition-opacity">
                            <ArrowLeft size={16} /> Back to Blogs
                        </Link>
                    </div>
                </article>
            </main>
            <Footer />
        </div>
    );
};

export default BlogPostPage;
