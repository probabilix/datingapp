import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReactMarkdown from 'react-markdown';
import { themeData } from '../data/themeData';

const TermsPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const document = {
    title: 'Terms of Service',
    last_updated: 'January 27, 2026',
    content: `**Effective Date:** January 27, 2026  
**Last Updated:** January 27, 2026

These Terms of Service ("Terms") constitute a legally binding agreement between you ("you," "your," or "User") and Dating Advice.io ("Dating Advice.io," "we," "us," or "our"), operated by **WhereItsApp, Ltd**, governing your access to and use of our website, mobile application(s), and related services (collectively, the "Service").

**BY ACCESSING OR USING THE SERVICE, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS AND OUR PRIVACY POLICY. If you do not agree, do not use the Service.**

## 1. ELIGIBILITY AND AGE REQUIREMENTS

**1.1 Age Requirement.** You must be at least 18 years old (or the age of majority in your jurisdiction, whichever is higher) to use the Service.

**1.2 Representations.** By using the Service, you represent and warrant that:
*   you meet the age requirement;
*   you have the legal capacity to enter into these Terms; and
*   your use of the Service will comply with all applicable laws and regulations.

## 2. ENTERTAINMENT PURPOSES ONLY; NO PROFESSIONAL ADVICE

**2.1 Entertainment-Only Service.** Dating Advice.io provides AI-generated content solely for informational and entertainment purposes.

**2.2 No Professional Relationship.** The Service does not provide medical, psychological, therapeutic, legal, financial, or professional advice and does not create any professional-client relationship (including therapist-client, doctor-patient, or attorney-client).

**2.3 No Guarantees.** AI-generated outputs:
*   may be inaccurate, incomplete, misleading, or offensive;
*   are not tailored to your full circumstances;
*   are not a substitute for professional advice.

**2.4 Assumption of Risk.** You assume all risk and responsibility for:
*   your reliance on any AI-generated output; and
*   any actions you take (or do not take) based on outputs.

**2.5 High-Risk Decisions Prohibited.** You agree not to use the Service for high-stakes decisions that could result in harm, including medical, mental health, legal, or safety decisions.

## 3. SERVICE OVERVIEW; AI DISCLOSURES

**3.1 AI Nature of Service.** The Service uses automated systems and artificial intelligence to generate responses.

**3.2 No Human Review Guarantee.** Outputs may be generated without human review.

**3.3 Output Variability.** You understand AI-generated outputs may vary for similar prompts and are not guaranteed to be consistent.

**3.4 No Warranty of Accuracy.** We make no warranties regarding the accuracy, completeness, usefulness, safety, legality, or appropriateness of any output.

**3.5 User Responsibility.** You are solely responsible for evaluating outputs before using or acting on them.

## 4. ACCOUNT REGISTRATION AND SECURITY

**4.1 Account Creation.** You may be required to create an account.

**4.2 Accurate Information.** You agree to provide accurate and complete information and to keep it updated.

**4.3 Security.** You are responsible for:
*   maintaining the confidentiality of your login credentials;
*   all activity that occurs under your account.

**4.4 Unauthorized Use.** You must notify us immediately of any unauthorized use or security breach.

## 5. SUBSCRIPTIONS, BILLING, AND PAYMENTS

**IMPORTANT:** Subscription terms vary depending on whether you subscribe through the App Store, Google Play, or our website.

**5.1 Subscription Plans.** 

We may offer subscription-based access to some features ("Subscriptions"), which may include recurring billing (monthly, yearly, or other intervals).

**5.2 Billing Authorization.** 

By purchasing a Subscription, you authorize us (and our payment processors) to charge your payment method on a recurring basis until you cancel.

**5.3 Auto-Renewal.** 

Unless you cancel before the renewal date, your Subscription will automatically renew and you will be charged the renewal price plus applicable taxes.

**5.4 Cancellation.** 

You may cancel your Subscription at any time:
*   **App Store:** Cancel via your Apple ID subscription settings.
*   **Google Play:** Cancel via Google Play subscription settings.
*   **Website:** Cancel through your account settings or by contacting support at support@datingadvice.io.

Cancellation becomes effective at the end of your then-current billing period. You will continue to have access to Subscription features until that period ends.

**5.5 Refunds.** 

Except where required by law, all sales are final and non-refundable, including for partially used billing periods. 

However:
*   App Store and Google Play refunds are governed by Apple/Google refund policies.
*   If required by applicable consumer law (EU/UK), you may be entitled to a refund under certain conditions.

**5.6 Price Changes.** 

We may change Subscription pricing at any time. We will provide notice where required. If you do not agree to the price change, you must cancel before the new price takes effect.

**5.7 Taxes.** 

You are responsible for any applicable taxes, duties, or governmental fees.

**5.8 Free Trials (If Offered).** 

If we offer free trials:
*   you may be required to provide payment information;
*   the trial will automatically convert to a paid Subscription unless canceled before trial ends.

**5.9 Subscriptions Purchased via Platform Provider.**

If you purchase a Subscription via a Platform Provider (Apple App Store or Google Play):
*   payment will be charged to your Platform Provider account at confirmation of purchase;
*   Subscription automatically renews unless canceled at least 24 hours before the end of the current period;
*   your account will be charged for renewal within 24 hours prior to the end of the current period;
*   you can manage or cancel Subscriptions in your account settings;
*   any unused portion of a free trial (if offered) will be forfeited when you purchase a Subscription.

## 6. USER CONTENT; LICENSE; AI PROCESSING

**6.1 User Content Defined.** "User Content" includes any prompts, messages, text, files, or other content you submit.

**6.2 Ownership.** You retain ownership of your User Content, subject to the license granted below.

**6.3 License to Us.** By submitting User Content, you grant Dating Advice.io a worldwide, non-exclusive, royalty-free, fully paid, sublicensable, transferable license to:
*   host, store, reproduce, modify, process, analyze, and display User Content;
*   generate outputs based on User Content;
*   operate, improve, and provide the Service.

**6.4 AI Training and Improvement.** 

To the extent permitted by law and consistent with our Privacy Policy, we may use User Content to:
*   improve AI systems;
*   enhance safety and quality;
*   develop new features.

**6.5 User Responsibility for Content.** 

You represent and warrant that:
*   you have all rights to submit User Content;
*   you do not submit content that violates laws or infringes on others’ rights;
*   you will not submit personal information of others without permission.

## 7. ACCEPTABLE USE POLICY (PROHIBITED CONDUCT)

You agree you will not:

**7.1 Use the Service to:**
*   harass, bully, threaten, or stalk others;
*   promote violence, self-harm, or illegal activity;
*   generate or distribute hate speech or discriminatory content;
*   exploit minors or attempt to solicit minors;
*   impersonate any person or entity;
*   disseminate private or confidential information;
*   violate intellectual property rights;
*   create or distribute malware, spyware, or malicious code.

**7.2 Attempt to:**
*   reverse engineer, decompile, or extract the underlying models or source code;
*   bypass security features or access restricted parts of the Service;
*   scrape or harvest data from the Service without permission;
*   use automated bots to access or interact with the Service (except via approved APIs).

**7.3 Upload content that:**
*   is unlawful, defamatory, obscene, or invasive of privacy;
*   contains sexually explicit content involving minors (strictly prohibited);
*   violates third-party rights or is otherwise illegal.

**7.4 "No Explicit Content" Policy.**

You agree not to submit prompts containing explicit sexual content, pornography, erotic roleplay, or content intended for sexual gratification. The Service may block, remove, or restrict access to content that violates this rule, at our sole discretion.

**7.5 Prohibited Sexual Content and User Attempts.**

Users may attempt to submit or solicit explicit sexual content, even though it is prohibited. Dating Advice.io employs automated filters and enforcement mechanisms to detect and block prohibited content. WhereItsApp, Ltd is not responsible for user attempts to generate prohibited content and disclaims all liability related to:
*   user-submitted prohibited content,
*   attempts to bypass filters,
*   any outputs generated as a result of prohibited or malicious prompts.

You agree you will not submit prohibited sexual content and will not attempt to circumvent moderation safeguards.

**7.6 "User Tries Anyway" Liability Disclaimer.**

We disclaim all liability for content submitted by users in violation of these Terms. You agree to indemnify WhereItsApp, Ltd for any claims arising from your prohibited content submissions.

**7.7 Content Moderation Discretion.**

We may remove or block content for any reason at any time, including content that we believe violates these Terms or could create legal or reputational risk. We reserve the right to investigate violations and take any action we deem appropriate, including termination and reporting to authorities.

## 8. INTELLECTUAL PROPERTY RIGHTS

**8.1 Our IP.** The Service, including its software, design, branding, and content (excluding User Content), is owned by Dating Advice.io and protected by intellectual property laws.

**8.2 Limited License.** We grant you a limited, revocable, non-transferable, non-exclusive license to use the Service for personal, non-commercial purposes, subject to these Terms.

**8.3 Restrictions.** You may not copy, modify, distribute, sell, or lease any part of the Service without our prior written consent.

## 9. FEEDBACK

If you provide suggestions or feedback, you grant us a perpetual, worldwide license to use it without compensation or attribution.

## 10. THIRD-PARTY SERVICES

The Service may integrate with or link to third-party services. We are not responsible for third-party services or their content. Your use of third-party services is governed by their own terms.

## 11. DISCLAIMER OF WARRANTIES

TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE." WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING:
*   MERCHANTABILITY
*   FITNESS FOR A PARTICULAR PURPOSE
*   NON-INFRINGEMENT
*   ACCURACY OR RELIABILITY OF OUTPUTS
*   SECURITY OR AVAILABILITY

WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL COMPONENTS.

## 12. LIMITATION OF LIABILITY

TO THE MAXIMUM EXTENT PERMITTED BY LAW:

**12.1 No Indirect Damages.** We will not be liable for indirect, incidental, consequential, special, punitive, or exemplary damages, including:
*   emotional distress
*   relationship harm
*   reputational harm
*   lost profits
*   lost data
*   business interruption

**12.2 Cap on Liability.** Our total liability arising out of or relating to the Service will not exceed the greater of:
*   $100 USD, or
*   the total amount you paid to us in the six (6) months preceding the claim.

**12.3 AI Output Liability Exclusion.** We are not liable for any reliance on, use of, or inability to use AI-generated outputs.

Some jurisdictions do not allow limitations; in such cases, liability is limited to the maximum permitted by law.

## 13. INDEMNIFICATION

You agree to defend, indemnify, and hold harmless Dating Advice.io and its officers, directors, employees, contractors, and affiliates from any claims, damages, liabilities, and expenses arising from:
*   your use of the Service;
*   your User Content;
*   your violation of these Terms; or
*   your violation of any third-party rights or law.

## 14. TERMINATION

We may suspend or terminate your account at any time, with or without notice, for any reason, including violations of these Terms.

Upon termination:
*   your license to use the Service ends immediately;
*   you remain responsible for any fees owed;
*   sections intended to survive termination will survive (including arbitration, indemnification, disclaimers, limitations).

## 15. DISPUTE RESOLUTION; BINDING ARBITRATION; CLASS ACTION WAIVER

**PLEASE READ THIS SECTION CAREFULLY. IT AFFECTS YOUR LEGAL RIGHTS.**

**15.1 Informal Resolution First.**

Before filing a claim, you agree to contact us at support@datingadvice.io and attempt to resolve the dispute informally for at least 30 days.

**15.2 Binding Arbitration Agreement.**

Except for disputes in small claims court or certain IP-related disputes, you agree that any dispute arising from or related to these Terms or the Service will be resolved by binding arbitration, rather than in court.

**15.3 Arbitration Rules and Venue.**

Arbitration will be administered by the American Arbitration Association (AAA) under its Consumer Arbitration Rules (or similar rules), unless otherwise required by law.

Unless prohibited by law:
*   arbitration will take place in [Insert County, State], or may occur remotely.
*   the arbitrator will have authority to award the same damages as a court.

**15.4 Class Action Waiver.**

YOU AND DATING ADVICE.IO AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN AN INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY CLASS OR REPRESENTATIVE ACTION.

**15.5 Exceptions.**

Either party may:
*   bring individual claims in small claims court if eligible;
*   seek injunctive relief for intellectual property infringement or misuse.

**15.6 Opt-Out Right (Recommended for enforceability).**

You may opt out of arbitration within 30 days of first agreeing to these Terms by sending written notice to:
opt-out@datingadvice.io.
Your notice must include your name, account email, and a statement that you wish to opt out.

**15.7 Severability.**

If any portion of this arbitration provision is found unenforceable, the remainder will remain in effect, except that if the class action waiver is unenforceable, the entire arbitration clause may be void.

## 16. GOVERNING LAW

These Terms are governed by the laws of the State of [Insert State], without regard to conflict-of-law rules, except where prohibited by applicable law.

## 17. EU/UK CONSUMER RIGHTS NOTICE

If you are a consumer in the EU/UK, you may have mandatory rights under local consumer protection laws that cannot be waived. Nothing in these Terms limits those rights.

Where required, you may have a right to withdraw from a digital services purchase, unless:
*   you consent to immediate performance and acknowledge loss of withdrawal rights.

## 18. CALIFORNIA NOTICE

If you are a California resident, you may contact the Complaint Assistance Unit of the Division of Consumer Services of the California Department of Consumer Affairs.

Address: 1625 North Market Blvd., Suite N-112, Sacramento, CA 95834

Phone: (800) 952-5210 or (916) 445-1254

## 19. DMCA COPYRIGHT POLICY

We respect intellectual property rights and comply with the Digital Millennium Copyright Act (DMCA). If you believe content infringes your copyright, send a notice to:

**DMCA Agent:** Copyright Agent

**Email:** dmca@datingadvice.io

**Address:** WhereItsApp, Ltd, [Address Pending]

Your notice must include:
*   a signature (physical or electronic);
*   identification of copyrighted work;
*   identification of infringing material;
*   your contact info;
*   good faith statement;
*   statement under penalty of perjury.

We may remove content and terminate repeat infringers.

## 20. CHANGES TO THE SERVICE OR TERMS

We may modify or discontinue the Service at any time.

We may update these Terms, and we will notify you as required by law. Your continued use after the effective date constitutes acceptance.

## 21. CONTACT INFORMATION

**Dating Advice.io**
*   **Email:** support@datingadvice.io
*   **Mailing Address:** WhereItsApp, Ltd, [Address Pending]

## 22. PLATFORM TERMS

If you download the Service from Apple’s App Store or Google Play (each a "Platform Provider"), you acknowledge and agree that:
1.  These Terms are between you and WhereItsApp, Ltd only, not the Platform Provider.
2.  The Platform Provider has no obligation to provide maintenance or support for the Service.
3.  The Platform Provider is not responsible for any claims relating to the Service, including product liability claims, consumer protection claims, or IP infringement claims.
4.  You must comply with all applicable third-party terms of agreement when using the Service.
5.  The Platform Provider and its subsidiaries are third-party beneficiaries of these Terms and may enforce them against you.
`
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: themeData.colors.bgSoft }}>
      <Helmet>
        <title>{document.title} | DatingAdvice.io</title>
        <meta name="description" content="Read our Terms of Service to understand the rules and regulations for using the DatingAdvice.io platform." />
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

export default TermsPage;