import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReactMarkdown from 'react-markdown';
import { themeData } from '../data/themeData';

const RefundPolicyPage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const document = {
        title: 'Refund & Cancellation Policy',
        last_updated: 'January 27, 2026',
        content: `**Effective Date:** January 27, 2026  
**Last Updated:** January 27, 2026

This Subscription Refund Policy and Cancellation Policy ("Policy") governs refunds, cancellations, billing issues, and subscription access related to paid subscriptions ("Subscriptions") offered by Dating Advice.io (the "Service"), operated by **WhereItsApp, Ltd** ("we," "us," or "our").

By purchasing a Subscription, you agree to this Policy, our Terms of Service, and our Privacy Policy.

## 1. SUBSCRIPTION PLANS AND AUTO-RENEWAL

Subscriptions may be offered on a recurring basis (e.g., monthly, yearly). Unless canceled, Subscriptions automatically renew at the end of each billing period.

By purchasing a Subscription, you authorize us (and/or the applicable app store or payment processor) to charge your payment method on a recurring basis until you cancel.

## 2. WHERE YOU PURCHASED MATTERS (APP STORE VS. DIRECT)

Your refund and cancellation options depend on where you purchased your Subscription:

**2.1 Apple App Store Purchases**

If you subscribed through Apple, your Subscription is managed by Apple and subject to Apple’s billing and refund policies.
*   You must cancel through your Apple ID subscription settings.
*   Refund requests must be submitted to Apple.
*   We cannot process Apple refunds directly.

**2.2 Google Play Purchases**

If you subscribed through Google Play, your Subscription is managed by Google and subject to Google’s billing and refund policies.
*   You must cancel through Google Play subscription settings.
*   Refund requests must be submitted to Google (except where Google allows developer-issued refunds).

**2.3 Direct Purchases (Website or Other Payment Processor)**

If you purchased directly from us (e.g., via Stripe or another processor), this Policy governs.

## 3. CANCELLATION POLICY

**3.1 How to Cancel**

You may cancel at any time:
*   **Apple App Store:** via Apple ID subscription settings
*   **Google Play:** via Google Play subscriptions
*   **Direct / Website:** through your account settings or by contacting support at support@datingadvice.io

**3.2 When Cancellation Takes Effect**

Cancellation becomes effective at the end of the current billing period. You will retain access to Subscription features until the end of that billing period.

**3.3 No Partial Period Refunds**

Except where required by law, we do not provide partial refunds or credits for unused time in a billing period.

## 4. REFUND POLICY

**4.1 General Rule: No Refunds**

Except as required by law or as expressly stated below, all payments are final and non-refundable, including:
*   subscription fees
*   taxes
*   partially-used billing periods
*   unused time following cancellation

**4.2 Exceptions (Direct Purchases Only)**

We may consider refunds for direct purchases in limited circumstances, such as:
*   duplicate charges
*   technical failure preventing access to paid features for an extended period
*   billing errors attributable to WhereItsApp, Ltd

Refund decisions are at our sole discretion except where prohibited by law.

**4.3 Chargebacks**

If you initiate a chargeback without contacting us first, we reserve the right to:
*   suspend or terminate your account
*   restrict future purchases
*   dispute chargebacks if we believe they are improper

**4.4 Fraudulent Activity**

No refunds will be issued for accounts that violate our Terms of Service, including attempts to abuse, exploit, or circumvent the Service, moderation rules, or usage limitations.

## 5. PRICE CHANGES

We may modify Subscription pricing at any time. If pricing changes:
*   We will provide notice as required by law.
*   If you do not agree, you must cancel before the new price takes effect.
*   Continued use after the price change takes effect constitutes acceptance.

## 6. FREE TRIALS (IF OFFERED)

If a free trial is offered, it will automatically convert into a paid Subscription unless canceled before the end of the trial period. If you fail to cancel before the trial ends, you authorize the charge.

## 7. EU/UK CONSUMER NOTICE (DIGITAL SERVICES)

If you are in the EU/UK and consumer protection law grants you a withdrawal right, you may lose that right if you:
*   consent to immediate performance of digital services, and
*   acknowledge that you lose your right of withdrawal once access begins.

We recommend ensuring your checkout flow includes required disclosures.

## 8. CONTACT

For billing issues related to direct purchases:
**Email:** support@datingadvice.io
`
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: themeData.colors.bgSoft }}>
            <Helmet>
                <title>{document.title} | DatingAdvice.io</title>
                <meta name="description" content="Read our Refund and Cancellation Policy to understand how billing and subscription cancellations work." />
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

export default RefundPolicyPage;
