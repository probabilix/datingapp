import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import OnboardingWizard from '../components/onboarding/OnboardingWizard';

const OnboardingPage: React.FC = () => {

    // Prevent back button from escaping onboarding (poor man's route guard)
    useEffect(() => {
        const handlePopState = () => {
            history.pushState(null, '', window.location.pathname);
        };
        history.pushState(null, '', window.location.pathname);
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    return (
        <>
            <Helmet>
                <title>Welcome | DatingAdvice.io</title>
            </Helmet>
            <OnboardingWizard />
        </>
    );
};

export default OnboardingPage;
