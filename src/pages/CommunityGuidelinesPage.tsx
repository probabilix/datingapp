import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReactMarkdown from 'react-markdown';
import { themeData } from '../data/themeData';

const CommunityGuidelinesPage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const document = {
        title: 'Community Guidelines',
        last_updated: 'January 27, 2026',
        content: `**Effective Date:** January 27, 2026  
**Last Updated:** January 27, 2026

Dating Advice.io is an AI-powered advice and entertainment platform for dating and relationship guidance. These Community Guidelines ("Guidelines") describe what is and is not allowed on the Service. By using the Service, you agree to comply with these Guidelines and our Terms of Service.

We reserve the right to remove content, restrict access, and suspend or terminate accounts for violations.

## 1. CORE PRINCIPLES

We aim to maintain a respectful, safe, and lawful environment. Users must not use the Service to:
*   harm themselves or others
*   harass, bully, or discriminate
*   promote illegal activity
*   exploit or endanger minors
*   generate or distribute prohibited sexual content
*   invade privacy or share non-consensual private data

## 2. PROHIBITED CONTENT AND BEHAVIOR

**2.1 Explicit Sexual Content (Not Allowed)**

We do not allow explicit sexual content in prompts, outputs, or user-submitted content, including but not limited to:
*   pornography or graphic sexual content
*   sexual content involving minors (strictly prohibited; will be reported)
*   explicit sexual acts, explicit roleplay, or explicit fetish content
*   content intended for sexual gratification
*   solicitations for sex or sexual services

If users attempt to generate explicit sexual content, we may:
*   block content in real-time
*   warn the user
*   suspend or terminate the account
*   report to appropriate authorities where legally required

**Prohibited Sexual Content and User Attempts**

Users may attempt to submit or solicit explicit sexual content, even though it is prohibited. Dating Advice.io employs automated filters and enforcement mechanisms to detect and block prohibited content.
WhereItsApp, Ltd is not responsible for user attempts to generate prohibited content and disclaims all liability related to:
*   user-submitted prohibited content,
*   attempts to bypass filters,
*   any outputs generated as a result of prohibited or malicious prompts.

You agree you will not submit prohibited sexual content and will not attempt to circumvent moderation safeguards.

**2.2 Harassment, Hate, and Discrimination**

Prohibited content includes:
*   hate speech
*   slurs, dehumanization, or discriminatory harassment
*   threats of violence
*   targeted harassment or stalking
*   content encouraging discrimination or segregation

**2.3 Violence and Harm**

Prohibited content includes:
*   encouragement or glorification of violence
*   instructions for harm
*   credible threats
*   self-harm encouragement or suicide assistance content

**If you are experiencing a crisis, contact local emergency services.**

**2.4 Illegal Activity**

You may not use the Service to:
*   plan or facilitate crime
*   solicit illegal services
*   evade law enforcement
*   engage in fraud or identity theft

**2.5 Privacy Violations**

Prohibited content includes:
*   personal data (phone numbers, addresses, SSNs) of you or others
*   non-consensual sharing of personal or private information
*   doxxing or blackmail
*   uploading private messages of others without permission (if upload exists)

**2.6 Impersonation and Misrepresentation**

You may not impersonate others or misrepresent identity for malicious purposes.

## 3. ENFORCEMENT AND MODERATION

We may enforce these Guidelines by:
*   blocking, filtering, or removing content
*   issuing warnings
*   suspending or terminating accounts
*   limiting features
*   reporting severe violations as required by law

Moderation may be automated and/or human-assisted. We do not guarantee that all prohibited content will be caught.

## 4. REPORTING CONTENT

To report abusive content or policy violations, contact:
**support@datingadvice.io**

## 5. DISCLAIMER

The Service may produce outputs that are inaccurate, inappropriate, or offensive. Outputs do not represent the views of WhereItsApp, Ltd. You are responsible for your use of the Service.
`
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: themeData.colors.bgSoft }}>
            <Helmet>
                <title>{document.title} | DatingAdvice.io</title>
                <meta name="description" content="Read our Community Guidelines to understand what is allowed on DatingAdvice.io." />
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

export default CommunityGuidelinesPage;
