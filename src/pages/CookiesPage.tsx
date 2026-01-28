import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReactMarkdown from 'react-markdown';
import { themeData } from '../data/themeData';

const CookiesPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const document = {
    title: 'Cookie Policy',
    last_updated: 'January 27, 2026',
    content: `**Effective Date:** January 27, 2026  
**Last Updated:** January 27, 2026

This Cookie Policy explains how Dating Advice.io uses cookies and similar technologies ("Cookies") on our website and web-based components of the Service.

This Policy should be read together with our Privacy Policy.

## 1. WHAT ARE COOKIES?

Cookies are small text files stored on your device by websites to remember your preferences, enable functionality, and analyze usage. We may also use similar technologies such as pixels, web beacons, SDKs, and local storage.

## 2. WHAT TYPES OF COOKIES WE USE

**2.1 Strictly Necessary Cookies**

These cookies are required for core functions such as:
*   authentication
*   account login
*   security and fraud prevention
*   remembering session state

**Legal basis (EU/UK):** Legitimate Interests / Necessary for Contract

**2.2 Preference Cookies**

These cookies remember your settings, including:
*   language preferences
*   UI preferences

**Legal basis (EU/UK):** Consent (where required)

**2.3 Analytics Cookies**

We may use analytics cookies to understand how users interact with the Service (e.g., pages visited, session duration).

**Legal basis (EU/UK):** Consent (where required)

**2.4 Advertising / Marketing Cookies (If Applicable)**

We may use advertising cookies and similar tech to:
*   measure advertising effectiveness
*   deliver interest-based ads (where applicable)

**Legal basis (EU/UK):** Consent (required)

## 3. COOKIE CONSENT (EU/UK USERS)

If you are located in the EU/UK, we will present a cookie banner to:
*   allow acceptance of non-essential cookies
*   allow rejection of non-essential cookies
*   allow granular consent (e.g., analytics vs marketing)

You may withdraw consent at any time by adjusting cookie preferences settings in your browser or through our cookie settings tool (if available).

## 4. HOW TO MANAGE COOKIES

You may disable cookies via browser settings. **Note:** disabling strictly necessary cookies may cause parts of the Service not to function.

## 5. DO NOT TRACK

We do not respond to browser "Do Not Track" signals due to lack of a uniform standard.

## 6. UPDATES

We may update this Cookie Policy periodically. Continued use constitutes acceptance.

## 7. CONTACT

**Email:** support@datingadvice.io
`
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