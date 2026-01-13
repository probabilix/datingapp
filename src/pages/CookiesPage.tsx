import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReactMarkdown from 'react-markdown';
import { themeData } from '../data/themeData';

const CookiesPage: React.FC = () => {
  const navigate = useNavigate();

  // Static content directly in the file
  const document = {
    title: 'Cookies Policy',
    last_updated: 'December 2025',
    content: `This Cookies Policy explains how DatingAdvice.io uses cookies and similar technologies.

**1. What Are Cookies?**

Cookies are small text files stored on your device that help us remember your preferences and improve your experience.

**2. How We Use Cookies**

- **Essential Cookies:** Necessary for the website to function (e.g., authentication).
- **Analytics Cookies:** Help us understand how visitors interact with our site so we can improve it.
- **Preference Cookies:** Remember your settings and choices.

**3. Managing Cookies**

You can control or delete cookies through your browser settings. However, disabling cookies may affect the functionality of our service.`
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: themeData.colors.bgSoft }}>
      <Helmet>
        <title>{document.title} | DatingAdvice.io</title>
        <meta name="description" content="Learn about how we use cookies and similar technologies to improve your experience on DatingAdvice.io." />
      </Helmet>
      <Header />
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-[800px] mx-auto">
          <button
            onClick={() => {
              navigate('/');
              window.scrollTo(0, 0);
            }}
            className="text-sm font-bold opacity-50 hover:opacity-100 mb-8 inline-block transition-opacity cursor-pointer"
          >
            ← BACK TO HOME
          </button>

          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'DM Serif Display' }}>{document.title}</h1>
          <p className="text-sm opacity-50 mb-10 uppercase tracking-widest font-semibold">Last Updated: {document.last_updated}</p>
          <div className="prose prose-pink text-lg leading-relaxed space-y-6 opacity-80" style={{ color: themeData.colors.textBody }}>
            <ReactMarkdown>{document.content}</ReactMarkdown>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CookiesPage;