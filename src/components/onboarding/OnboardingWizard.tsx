import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import OnboardingLayout from './OnboardingLayout';
import OnboardingStep from './OnboardingStep';
import { ShieldAlert, HeartHandshake, ScrollText, Lock, Globe, MessageCircleWarning } from 'lucide-react';

interface OnboardingWizardProps {
    onComplete?: () => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [isChecked, setIsChecked] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Define the screens as data
    const screens = [
        {
            id: 'welcome',
            title: 'Welcome to Dating Advice.io',
            icon: <HeartHandshake size={24} />,
            body: (
                <>
                    <p>
                        Dating Advice.io uses advanced <strong>Artificial Intelligence</strong> to generate dating and relationship advice.
                    </p>
                    <div className="bg-amber-50 rounded-lg p-3 text-sm text-amber-800 border border-amber-100 my-2">
                        <strong>Disclaimer:</strong> This service is for informational and entertainment purposes only.
                    </div>
                    <p>
                        AI responses may be inaccurate, incomplete, or inappropriate. Do not rely on this app for professional advice (medical, psychological, legal, financial, or emergency decisions).
                    </p>
                </>
            ),
            checkboxLabel: 'I understand Dating Advice.io provides AI-generated entertainment content and is not professional advice.',
            buttonText: 'Continue'
        },
        {
            id: 'limitations',
            title: 'AI Isn\'t Perfect',
            icon: <MessageCircleWarning size={24} />,
            body: (
                <>
                    <p>This service uses automated systems. AI outputs:</p>
                    <ul className="list-disc pl-5 space-y-1 mt-2 mb-3 marker:text-rose-400">
                        <li>Can be wrong, misleading, or offensive</li>
                        <li>May not reflect real-world outcomes</li>
                        <li>May vary for similar prompts</li>
                    </ul>
                    <p>You are responsible for how you use advice and for your decisions and actions.</p>
                </>
            ),
            checkboxLabel: 'I understand I am responsible for my decisions and will use AI responses at my own risk.',
            buttonText: 'I Understand'
        },
        {
            id: 'content_rules',
            title: 'Content Rules',
            icon: <ShieldAlert size={24} />,
            body: (
                <>
                    <p className="font-semibold text-rose-600">Strictly No Explicit Content</p>
                    <p>Do not submit:</p>
                    <ul className="list-disc pl-5 space-y-1 mt-2 mb-3 marker:text-gray-400 text-sm">
                        <li>Pornography or graphic sexual content</li>
                        <li>Erotic roleplay or explicit sexual acts</li>
                        <li>Any sexual content involving minors (will be reported)</li>
                    </ul>
                    <p className="text-xs text-gray-400">Violations may result in immediate account termination.</p>
                </>
            ),
            checkboxLabel: 'I agree not to submit explicit sexual content or attempt to bypass content filters.',
            buttonText: 'I Agree'
        },
        {
            id: 'privacy',
            title: 'Privacy & Processing',
            icon: <Lock size={24} />,
            body: (
                <>
                    <p>To provide this Service, we must process your prompts and messages.</p>
                    <p className="mt-2">We use data to:</p>
                    <ul className="list-disc pl-5 space-y-1 mt-2 marker:text-rose-400">
                        <li>Operate and secure the Service</li>
                        <li>Improve quality and safety</li>
                        <li>Enforce policies</li>
                    </ul>
                    <p className="text-xs text-gray-400 mt-4">
                        See our <a href="/privacy" target="_blank" className="underline hover:text-rose-500">Privacy Policy</a> for full details.
                    </p>
                </>
            ),
            checkboxLabel: 'I acknowledge the Privacy Policy and consent to processing of my prompts/messages.',
            buttonText: 'Continue'
        },
        // Optional Subscription Screen - Keeping it generic but distinct
        {
            id: 'subscription',
            title: 'Subscription Terms',
            icon: <ScrollText size={24} />,
            body: (
                <>
                    <p>Transparency is key. If you choose to subscribe:</p>
                    <ul className="list-disc pl-5 space-y-1 mt-2 mb-3 marker:text-rose-400">
                        <li>Subscriptions <strong>automatically renew</strong> unless canceled.</li>
                        <li>You can cancel anytime in your account settings (or Apple/Google settings).</li>
                        <li>No refunds for partial periods.</li>
                    </ul>
                    <p className="text-xs text-gray-400">
                        See <a href="/refund-policy" target="_blank" className="underline hover:text-rose-500">Refund Policy</a>.
                    </p>
                </>
            ),
            checkboxLabel: 'I understand subscriptions auto-renew and I can cancel anytime.',
            buttonText: 'Continue'
        },
        {
            id: 'arbitration',
            title: 'Legal Terms',
            icon: <ScrollText size={24} />,
            body: (
                <>
                    <p>By using the app, you agree to our Terms of Service.</p>
                    <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg mt-3 text-sm">
                        <p><strong>Arbitration Agreement:</strong> Most disputes will be resolved by binding arbitration, not in court. You waive the right to class actions.</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                        You may <a href="/arbitration-opt-out" target="_blank" className="underline hover:text-rose-500">opt out</a> within 30 days.
                    </p>
                </>
            ),
            checkboxLabel: 'I acknowledge the Arbitration Agreement & Class Action Waiver in the Terms.',
            buttonText: 'Continue'
        },
        // Optional EU Screen - Showing to everyone for safety/simplicity or skipping if we had geo-detection
        {
            id: 'international',
            title: 'Data Transfer',
            icon: <Globe size={24} />,
            body: (
                <>
                    <p>Our servers are based in the United States.</p>
                    <p className="mt-2">By using the service, you acknowledge your data will be transferred to and processed in the U.S. under appropriate safeguards.</p>
                    <p className="text-xs text-gray-400 mt-4">
                        EU/UK users can exercise GDPR rights by contacting support.
                    </p>
                </>
            ),
            checkboxLabel: 'I acknowledge international data processing and have reviewed my rights.',
            buttonText: 'Finish Setup'
        }
    ];

    const handleNext = async () => {
        if (currentStep < screens.length - 1) {
            // Move to next step
            setIsChecked(false); // Reset checkbox for next screen
            setCurrentStep(prev => prev + 1);
        } else {
            // Final step - Submit to DB
            await completeOnboarding();
        }
    };

    const completeOnboarding = async () => {
        try {
            setIsSubmitting(true);
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                console.error("No session found during onboarding completion");
                navigate('/login');
                return;
            }

            const { error } = await supabase
                .from('profiles')
                .update({ onboarding_completed_at: new Date().toISOString() })
                .eq('id', session.user.id);

            if (error) throw error;

            // Success
            if (onComplete) {
                onComplete();
            } else {
                // Fallback for direct page access
                window.location.href = '/dashboard';
            }

        } catch (err) {
            console.error("Error completing onboarding:", err);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const currentScreen = screens[currentStep];

    return (
        <OnboardingLayout currentStep={currentStep} totalSteps={screens.length}>
            <OnboardingStep
                key={currentScreen.id} // Key ensures animation plays on step change
                title={currentScreen.title}
                body={currentScreen.body}
                checkboxLabel={currentScreen.checkboxLabel}
                buttonText={currentScreen.buttonText}
                icon={currentScreen.icon}
                isChecked={isChecked}
                onCheck={setIsChecked}
                onNext={handleNext}
                isLoading={isSubmitting}
            />
        </OnboardingLayout>
    );
};

export default OnboardingWizard;
