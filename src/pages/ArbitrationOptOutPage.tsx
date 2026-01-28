import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReactMarkdown from 'react-markdown';
import { themeData } from '../data/themeData';

const ArbitrationOptOutPage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const document = {
        title: 'Arbitration Opt-Out',
        last_updated: 'January 27, 2026',
        content: `**Effective Date:** January 27, 2026

## Arbitration Opt-Out Instructions

If you do not want to be bound by the arbitration agreement and class action waiver in our Terms of Service, you may opt out within 30 days of the date you first accept the Terms.

**To opt out, send an email to:** opt-out@datingadvice.io

**Subject line:** "Arbitration Opt-Out"

**Include:**
1.  Full name
2.  Account email used for Dating Advice.io
3.  Date you first accepted the Terms (approximate is fine)
4.  Statement: "I wish to opt out of the arbitration and class action waiver provisions."

If you opt out, disputes will be resolved in court as permitted by law, and the remainder of the Terms will remain in effect.

## Arbitration Opt-Out Form

*   **Name:** ____________________
*   **Account Email:** ____________________
*   **Date of Acceptance (approx.):** ____________________
*   **Statement:** "I wish to opt out of the arbitration and class action waiver provisions."

*(Submission must be received within 30 days.)*
`
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: themeData.colors.bgSoft }}>
            <Helmet>
                <title>{document.title} | DatingAdvice.io</title>
                <meta name="description" content="Instructions on how to opt-out of the arbitration agreement." />
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
                    <div className="prose prose-pink text-lg leading-relaxed space-y-6 opacity-80" style={{ color: themeData.colors.textBody }}>
                        <ReactMarkdown>{document.content}</ReactMarkdown>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ArbitrationOptOutPage;
