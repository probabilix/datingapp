import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReactMarkdown from 'react-markdown';
import { themeData } from '../data/themeData';

const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

  // Static content directly in the file
  const document = {
    title: 'Privacy Policy',
    last_updated: 'December 2025',
    content: `At DatingAdvice.io, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our AI-powered dating advice platform.

**1. Information We Collect**

We collect information you provide directly to us, including:
- **Account Information:** Email address and basic profile details.
- **Conversation Data:** Interactions with our AI advisors are processed to provide guidance. These conversations are end-to-end encrypted and stored securely.
- **Usage Data:** Information about how you use our website, including device type, browser, and access times.

**2. How We Use Your Information**

We use your data to:
- Provide, maintain, and improve our services.
- Personalize your experience with our AI advisors.
- Communicate with you about updates, security alerts, and support.

**3. AI and Data Processing**

Our service utilizes artificial intelligence. While we strive for accuracy, AI inputs are processed to generate responses. We do not use your personal conversation logs to train our public models without your explicit consent.

**4. Data Security**

We implement robust security measures, including encryption and secure server infrastructure, to protect your data from unauthorized access.

**5. Contact Us**

If you have questions about this policy, please contact us at support@datingadvice.io.`
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: themeData.colors.bgSoft }}>
      <Helmet>
        <title>{document.title} | DatingAdvice.io</title>
        <meta name="description" content="Your privacy is our priority. Read our privacy policy to understand how we collect, use, and protect your data." />
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
          <p className="text-sm opacity-50 mb-10">Last Updated: {document.last_updated}</p>
          <div className="prose prose-pink text-lg leading-relaxed opacity-80" style={{ color: themeData.colors.textBody }}>
            <ReactMarkdown>{document.content}</ReactMarkdown>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPage;