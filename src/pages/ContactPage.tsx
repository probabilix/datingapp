import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Send, Loader2, CheckCircle, ArrowLeft, Instagram, Sparkles, Twitter, Facebook } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { themeData } from '../data/themeData';
import { supabase } from '../lib/supabaseClient';
import { API_BASE_URL } from '../config/api';

interface ContactDetails {
  title: string;
  email: string;
  office_address: string;
}

interface SocialLink {
  platform: string;
  handle: string;
  url: string;
  icon_key: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'duplicate'>('idle');
  const [lastSubmitted, setLastSubmitted] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [contactInfo, setContactInfo] = useState<ContactDetails | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    const fetchContactData = async () => {
      // Fetch Contact Details
      const { data: contactDetailsData } = await supabase
        .from('contact_details')
        .select('title, email, office_address')
        .single();

      if (contactDetailsData) {
        setContactInfo({
          title: contactDetailsData.title,
          email: contactDetailsData.email,
          office_address: contactDetailsData.office_address // handle mismatched column name from DB if necessary, but we defined it as office_address
        });
      }

      // Fetch Social Links
      const { data: socialData } = await supabase
        .from('social_links')
        .select('platform, handle, url, icon_key')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (socialData) {
        setSocialLinks(socialData);
      }
    };


    fetchContactData();
  }, []);

  const getIcon = (iconKey: string) => {
    switch (iconKey) {
      case 'Twitter': return <Twitter size={20} />;
      case 'Instagram': return <Instagram size={20} />;
      case 'Facebook': return <Facebook size={20} />;
      default: return <Sparkles size={20} />;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setStatus('idle');

    // strict validation to match database constraints
    const cleanName = formData.name.trim();
    const cleanMessage = formData.message.trim();

    if (cleanName.length < 2) {
      setValidationError("Name must be at least 2 characters long.");
      return;
    }

    // Regex matching the Supabase constraint exactly: ^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setValidationError("Please enter a valid email address (e.g. name@domain.com).");
      return;
    }

    if (cleanMessage.length === 0) {
      setValidationError("Please enter a message.");
      return;
    }

    const submissionData = {
      ...formData,
      name: cleanName,
      message: cleanMessage
    };

    // Prevent duplicate submissions
    const currentPayload = JSON.stringify(submissionData);
    if (currentPayload === lastSubmitted) {
      setStatus('duplicate');
      return;
    }

    setLoading(true);
    try {
      // Get current user session if available
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || null; // Send null for Guest to let DB generate UUID

      const response = await fetch(`${API_BASE_URL}/api/forms/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...submissionData,
          userId,
        }),
      });

      if (response.ok) {
        setStatus('success');
        setLastSubmitted(currentPayload);
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };



  // Explicit handlers to avoid type inference issues
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, name: e.target.value }));
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, email: e.target.value }));
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, message: e.target.value }));

  // Loading state for initial data fetch
  if (!contactInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-soft)' }}>
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: themeData.colors.bgSoft }}>
      <Helmet>
        <title>{contactInfo.title} | DatingAdvice.io</title>
        <meta name="description" content="Get in touch with the DatingAdvice.io team. We're here to help with your relationship journey." />
      </Helmet>

      <Header />

      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          <Link
            to="/"
            className="text-xs font-black opacity-30 hover:opacity-100 uppercase tracking-widest mb-8 inline-flex items-center gap-2 transition-opacity"
          >
            <ArrowLeft size={12} /> Back
          </Link>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h1 className="text-5xl font-bold mb-6" style={{ fontFamily: 'DM Serif Display', color: themeData.colors.textHeading }}>
                {contactInfo.title}
              </h1>
              <p className="text-lg opacity-70 mb-8" style={{ color: themeData.colors.textBody }}>
                Reach out to us at <span className="font-bold underline">{contactInfo.email}</span> or fill out the form.
              </p>

              <div className="space-y-6 opacity-80 mt-12">
                <div className="p-6 rounded-2xl shadow-sm" style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-border)' }}>
                  <p className="text-sm uppercase font-bold opacity-50 mb-1">Office</p>
                  <p className="font-medium">{contactInfo.office_address}</p>
                </div>
                {socialLinks.length > 0 && (
                  <div className="p-6 rounded-2xl shadow-sm" style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-border)' }}>
                    <p className="text-sm uppercase font-bold opacity-50 mb-4">Connect With Us</p>
                    <div className="space-y-4">
                      {socialLinks.map((link) => (
                        <a
                          key={link.platform}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 font-medium hover:opacity-70 transition-opacity"
                        >
                          <span className="p-2 rounded-full" style={{ backgroundColor: 'var(--color-input-solid)' }}>
                            {getIcon(link.icon_key)}
                          </span>
                          <span>{link.handle || link.platform}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 md:p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden" style={{ backgroundColor: 'var(--color-card-bg)', border: '1px solid var(--color-border)' }}>
              {status === 'success' ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-8 text-center animate-in fade-in duration-300" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                  <p className="opacity-60 mb-8">We'll get back to you as soon as possible.</p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="px-8 py-3 bg-gray-100 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
                  >
                    Send Another
                  </button>
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {validationError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    {validationError}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold opacity-70 mb-2 ml-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder="John Doe"
                    className="w-full p-4 rounded-xl outline-none focus:ring-2 focus:ring-pink-100 transition-all"
                    style={{ backgroundColor: 'var(--color-input-solid)', color: 'var(--color-text-heading)', border: '1px solid var(--color-border)' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold opacity-70 mb-2 ml-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleEmailChange}
                    placeholder="john@example.com"
                    className="w-full p-4 rounded-xl outline-none focus:ring-2 focus:ring-pink-100 transition-all"
                    style={{ backgroundColor: 'var(--color-input-solid)', color: 'var(--color-text-heading)', border: '1px solid var(--color-border)' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold opacity-70 mb-2 ml-1">Message</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={handleMessageChange}
                    placeholder="How can we help you today?"
                    className="w-full p-4 rounded-xl h-40 outline-none focus:ring-2 focus:ring-pink-100 transition-all resize-none"
                    style={{ backgroundColor: 'var(--color-input-solid)', color: 'var(--color-text-heading)', border: '1px solid var(--color-border)' }}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 rounded-xl text-white font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
                    style={{ backgroundColor: themeData.colors.brand }}
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                  {status === 'error' && (
                    <p className="text-red-500 text-sm text-center mt-4 font-medium">
                      Something went wrong. Please try again.
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;