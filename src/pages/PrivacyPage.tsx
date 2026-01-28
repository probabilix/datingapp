import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReactMarkdown from 'react-markdown';
import { themeData } from '../data/themeData';

const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const document = {
    title: 'Privacy Policy',
    last_updated: 'January 27, 2026',
    content: `**Effective Date:** January 27, 2026  
**Last Updated:** January 27, 2026

This Privacy Policy ("Policy") describes how Dating Advice.io ("Dating Advice.io," "we," "us," or "our") collects, uses, discloses, retains, and protects information when you access or use our website, mobile application, and related services (collectively, the "Service").

This Policy also explains your privacy rights and choices under applicable laws, including but not limited to:
*   The California Consumer Privacy Act as amended by the California Privacy Rights Act ("CCPA/CPRA"), and
*   The EU General Data Protection Regulation ("GDPR") and UK GDPR (and related UK Data Protection Act 2018).

By using the Service, you acknowledge that you have read and understood this Policy.

## 1. IMPORTANT NOTICE: ENTERTAINMENT PURPOSES ONLY (NO PROFESSIONAL ADVICE)

Dating Advice.io provides AI-generated content solely for informational and entertainment purposes. The Service is not designed or intended to provide medical, psychological, therapeutic, legal, financial, or other professional advice.

You acknowledge and agree that:
1.  All AI-generated outputs are inherently probabilistic, and may be inaccurate, incomplete, misleading, offensive, or unsuitable.
2.  The Service does not establish a professional-client relationship (including therapist-client, doctor-patient, attorney-client, or similar).
3.  You assume full responsibility for how you use any output.
4.  Dating Advice.io is not liable for any decisions, actions, or outcomes arising from your reliance on AI-generated content.

**If you are in crisis, experiencing distress, or at risk of harm to yourself or others, you should contact local emergency services or a qualified professional.**

## 2. DEFINITIONS

For purposes of this Policy:
*   **"Personal Information"** (or "Personal Data") means information that identifies, relates to, describes, is reasonably capable of being associated with, or could reasonably be linked to an individual or household.
*   **"Processing"** means any operation performed on Personal Information, including collection, storage, use, disclosure, or deletion.
*   **"Controller"** (GDPR/UK GDPR) means the party that determines the purposes and means of processing.
*   **"Processor"** means the party that processes data on behalf of a Controller.
*   **"Sensitive Personal Information"** may include data about sex life, sexual orientation, relationship issues, precise geolocation, or other information regulated by law.

## 3. INFORMATION WE COLLECT

We collect information in the following categories.

**3.1 Information You Provide Directly**

You may provide:

**A. Account Information**
*   Name, username, email address, password, and profile information.

**B. User Content / Input Data**
*   Prompts, messages, text you enter into the AI, and any details you choose to share about yourself or others.

**C. Communications**
*   Support inquiries, feedback, survey responses, and correspondence.

**D. Payment and Subscription Information**
*   If you purchase a subscription, payment is processed by third-party payment processors (e.g., Apple, Google, Stripe).
*   We may receive subscription metadata (transaction IDs, purchase dates, renewal status) but do not typically store full payment card information.

**Reminder:** Do not submit sensitive identifiers (government ID numbers, account numbers, passwords) or confidential third-party data. You are responsible for the content you submit.

**3.2 Information We Collect Automatically**

When you use the Service, we may automatically collect:
*   **Device Data:** device type, OS, browser, language, device identifiers.
*   **Usage Data:** pages and screens viewed, feature usage, time spent, navigation patterns.
*   **Log Data:** IP address, timestamps, app events, crash reports, referral URLs.
*   **Approximate Location:** based on IP address.
*   **Cookies and Similar Tech:** cookies, pixels, SDKs, local storage, and similar tracking technologies.

**3.3 Information We Collect from Third Parties**

We may collect information from:
*   **App Stores (Apple/Google):** subscription status and purchase events.
*   **Authentication Providers (Google/Apple login):** email, name, and profile image (as available).
*   **Analytics Providers** (e.g., performance and crash reporting).
*   **Advertising Partners (if applicable):** campaign performance and attribution data.

## 4. SENSITIVE PERSONAL INFORMATION (SPECIAL NOTE)

Due to the nature of dating and relationship discussions, you may voluntarily share potentially sensitive information, including information about:
*   romantic and sexual preferences
*   relationship history
*   emotional experiences
*   interpersonal conflict and communications
*   sexuality or sexual orientation
*   dating messages and screenshots (if allowed)

We do not require sensitive information to use the Service. If you choose to provide it:
*   You do so voluntarily, and
*   You acknowledge you are responsible for what you share, and
*   You grant us the rights described in this Policy to process it for Service operations.

**Do not submit:**
*   Social Security numbers, government IDs
*   financial account info
*   private keys
*   health or therapy records
*   any personal info about minors
*   personal info about other people without their consent

## 5. HOW WE USE INFORMATION

We use Personal Information for the following purposes:

**5.1 Provide and Maintain the Service**
*   create accounts
*   deliver AI-generated responses
*   provide personalization and continuity of chat sessions
*   process payments and subscriptions
*   provide customer support
*   authenticate users and maintain security

**5.2 Improve and Develop the Service**
*   analytics and usage trends
*   debugging and crash logging
*   performance monitoring
*   research and development
*   A/B testing and feature optimization

**5.3 Safety, Trust, and Compliance**
*   detect fraud, abuse, harassment, or unlawful activity
*   enforce our policies
*   protect rights, safety, and property
*   comply with legal obligations

**5.4 Marketing and Communications**
*   send transactional communications
*   send product updates
*   send promotional communications (where allowed, with opt-out rights)

**5.5 AI Training and Model Improvement (If Applicable)**

Where permitted by law and consistent with your choices, we may use User Content to:
*   improve quality and safety of AI output
*   develop and refine models or prompts
*   detect misuse and abuse patterns

We may use de-identified and aggregated data for any lawful purpose.

## 6. LEGAL BASES FOR PROCESSING (EU/UK)

If you are in the EU/UK, we process your Personal Data under one or more of the following legal bases:
*   **Contractual necessity** (to provide the Service)
*   **Consent** (for optional processing such as certain marketing or cookie tracking)
*   **Legitimate interests** (to improve the Service, prevent abuse, and secure systems)
*   **Legal obligation** (to comply with law)
*   **Vital interests** (rare circumstances involving safety)

Where we rely on legitimate interests, we balance those interests against your privacy rights.

## 7. DISCLOSURE OF INFORMATION

We may disclose Personal Information as follows:

**7.1 Service Providers**

We share information with vendors that perform services such as:
*   hosting and cloud infrastructure
*   customer support tools
*   payment processors
*   analytics and performance services
*   security monitoring and fraud prevention
*   marketing tools (if applicable)

These providers are obligated to protect Personal Information and use it only for authorized purposes.

**7.2 Affiliates**

We may share information with corporate affiliates for internal operational purposes.

**7.3 Business Transfers**

We may share information as part of:
*   merger
*   acquisition
*   sale of assets
*   financing
*   bankruptcy

**7.4 Legal, Compliance, and Safety**

We may disclose information if required by law or if we reasonably believe disclosure is necessary to:
*   comply with legal process
*   respond to lawful requests
*   protect rights and safety
*   prevent fraud or security incidents

**7.5 With Your Consent**

We may disclose information when you direct or authorize us to do so.

## 8. COOKIES, TRACKING, AND TARGETED ADVERTISING

We may use cookies, SDKs, pixels, and similar technologies to:
*   maintain authentication and preferences
*   measure performance and analytics
*   personalize features
*   deliver or measure advertising (if applicable)

**Your Choices**

You can control cookies in your browser settings. If you are in California, you may have the right to opt out of "sharing" for cross-context behavioral advertising. If in the EU/UK, you may have the right to consent or decline non-essential cookies.

## 9. DATA RETENTION

We retain Personal Information only as long as reasonably necessary to:
*   provide the Service
*   meet legal obligations
*   resolve disputes
*   enforce agreements
*   prevent fraud and abuse

We may retain aggregated or de-identified data indefinitely.

If you delete your account, we will delete or anonymize your Personal Information, subject to:
*   legal requirements
*   legitimate business purposes (e.g., fraud prevention, accounting records)

## 10. DATA SECURITY

We maintain reasonable administrative, technical, and physical safeguards designed to protect your data. However:

**No security system is impenetrable. We cannot guarantee security, and you use the Service at your own risk.**

## 11. INTERNATIONAL DATA TRANSFERS

Your information may be transferred and processed outside your jurisdiction, including in the United States.

If you are in the EU/UK, we will implement appropriate safeguards for transfers, such as:
*   Standard Contractual Clauses (SCCs)
*   UK International Data Transfer Addendum
*   other lawful mechanisms

## 12. YOUR RIGHTS AND CHOICES (GENERAL)

Depending on your jurisdiction, you may have rights to:
*   request access to your data
*   correct inaccuracies
*   request deletion
*   request portability
*   object to or restrict processing
*   withdraw consent
*   opt out of certain marketing communications

You may exercise rights by contacting: **support@datingadvice.io**

We may verify your identity prior to responding.

## 13. EU/UK RIGHTS (GDPR / UK GDPR)

If you are in the EU/UK, you have the right to:
*   Access your Personal Data
*   Rectify inaccurate data
*   Erase your data ("right to be forgotten")
*   Restrict processing
*   Data portability
*   Object to processing
*   Withdraw consent at any time
*   Lodge a complaint with a Data Protection Authority (DPA)

**EU/UK Representative and DPO**

If required, we will appoint an EU/UK representative or Data Protection Officer.

Contact: **support@datingadvice.io** (Subject: DPO)

## 14. CALIFORNIA RIGHTS (CCPA/CPRA)

**14.1 Categories of Personal Information We Collect**

Depending on usage, we may collect:
*   Identifiers (name, email, device ID)
*   Commercial information (subscription status)
*   Internet/network activity (usage analytics)
*   Geolocation (approximate)
*   Inferences (preference profiles)
*   Sensitive personal information (if voluntarily submitted in chats)

**14.2 Purposes of Collection**

We collect and use this information for:
*   providing the Service
*   security and fraud prevention
*   personalization
*   customer support
*   analytics and improvements
*   marketing (if applicable)

**14.3 "Sale" and "Sharing"**

We do not sell Personal Information for money.

However, under CPRA definitions, some advertising and analytics activities may be considered "sharing" for cross-context behavioral advertising.

You may opt-out of sharing by:
*   using in-app privacy controls (if available), or
*   contacting us at **support@datingadvice.io**

**14.4 Your Rights**

California residents may request:
*   Right to Know what we collect/disclose
*   Right to Delete
*   Right to Correct
*   Right to Opt-Out of sale/sharing
*   Right to Limit sensitive personal info use (as applicable)
*   Non-discrimination for exercising rights

**Submit requests:** **support@datingadvice.io**

We will verify your identity before fulfilling requests.

## 15. DO NOT TRACK SIGNALS

Some browsers transmit "Do Not Track" signals. Because there is no universally accepted standard, our Service may not respond to DNT signals.

## 16. CHILDREN’S PRIVACY

The Service is not intended for persons under 18. We do not knowingly collect Personal Information from minors. If you believe a minor has provided data, contact us and we will delete it.

## 17. THIRD-PARTY LINKS

Our Service may include links to third-party sites. We are not responsible for third-party privacy practices.

## 18. AI-SPECIFIC DISCLOSURES

**18.1 AI Output Risks**

AI-generated responses may be inaccurate, incomplete, or offensive. You agree:
*   you will not use outputs for high-stakes decisions
*   you will not use outputs to harass or harm others
*   you accept the outputs are "as-is," for entertainment only

**18.2 Monitoring & Abuse Prevention**

We may review or monitor content:
*   to enforce policies
*   detect abuse
*   comply with law
*   protect users and the Service

**18.3 De-Identification**

We may anonymize or de-identify data. Once de-identified, it may not be possible to re-identify or delete it.

## 19. DISCLAIMERS & LIMITATION OF LIABILITY (PRIVACY-RELATED)

To the fullest extent permitted by law:
*   The Service is provided "AS IS" and "AS AVAILABLE."
*   We disclaim all warranties regarding privacy, security, and uninterrupted Service availability.
*   We are not liable for unauthorized access, hacking, interception, loss, alteration, or misuse of data.
*   We are not responsible for emotional outcomes, relationship outcomes, or damages arising from reliance on AI outputs.

In some jurisdictions, limitations may not apply; in such cases, liability will be limited to the maximum extent permitted by law.

## 20. CHANGES TO THIS POLICY

We may update this Policy periodically. If we make material changes, we may notify you via:
*   in-app notification
*   email
*   posting an updated Policy with a new date

Your continued use after updates constitutes acceptance.

## 21. CONTACT INFORMATION

**Dating Advice.io**
*   **Email:** support@datingadvice.io
*   **Mailing Address:** WhereItsApp, Ltd, [Address Pending]
`
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: themeData.colors.bgSoft }}>
      <Helmet>
        <title>{document.title} | DatingAdvice.io</title>
        <meta name="description" content="Read our Privacy Policy to understand how we collect, use, and protect your information." />
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

export default PrivacyPage;