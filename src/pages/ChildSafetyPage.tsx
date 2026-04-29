import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReactMarkdown from 'react-markdown';
import { themeData } from '../data/themeData';

const ChildSafetyPage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const document = {
        title: 'Child Safety Standards',
        last_updated: 'April 2026',
        content: `Dating Advice (com.datingadvicecoach.app), developed by Dating Advice LTD, is committed to maintaining a safe and secure platform for all users.

## 1. Our Commitment Against CSAE

Dating Advice strictly and explicitly prohibits any content, behavior, or activity that involves child sexual abuse and exploitation (CSAE) in any form. This includes but is not limited to:

*   Sexual content involving minors
*   Child grooming or exploitation of any kind
*   Sharing, distributing, or promoting child sexual abuse material (CSAM)
*   Any content or communication that endangers the safety and wellbeing of children

## 2. In-App Reporting Mechanism

Dating Advice provides users with an in-app mechanism to report any child safety concerns, inappropriate content, or suspicious behavior. Users can access this feature directly within the app at any time.

## 3. Child Safety Point of Contact

We have a designated point of contact who is ready and able to address child safety concerns, CSAM prevention practices, and compliance matters.

**Contact Email:**  
datingadviceapp@gmail.com

## 4. Legal Compliance

Dating Advice complies with all applicable child safety laws and regulations. Any identified CSAM is reported to the relevant regional and national authorities in accordance with legal requirements.

## 5. Enforcement

Any user found violating our child safety standards will be immediately removed from the platform and reported to the appropriate authorities.

---

**Dating Advice LTD**  
**App:** Dating Advice (com.datingadvicecoach.app)  
**Contact:** datingadviceapp@gmail.com  
**Website:** [https://datingadvice.io](https://datingadvice.io)
`
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: themeData.colors.bgSoft }}>
            <Helmet>
                <title>{document.title} | DatingAdvice.io</title>
                <meta name="description" content="Read our Child Safety Standards to understand our commitment to protecting minors on DatingAdvice.io." />
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

export default ChildSafetyPage;
