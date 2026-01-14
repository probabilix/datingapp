import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { supabase } from './lib/supabaseClient';

// Component Imports
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AdvisorsSection from './components/AdvisorsSection';
import ProcessSection from './components/ProcessSection';
import PricingSection from './components/PricingSection';
import TestimonialsSection from './components/TestimonialsSection';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';

// Page Imports
import AboutPage from './pages/AboutPage';
import BlogsPage from './pages/BlogsPage';
import BlogPostPage from './pages/BlogPostPage';
import SuccessStoriesPage from './pages/SuccessStoriesPage';
import CareersPage from './pages/CareersPage';
import ContactPage from './pages/ContactPage';
import CookiesPage from './pages/CookiesPage';
import PrivacyPage from './pages/PrivacyPage';

import TermsPage from './pages/termsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import BillingPage from './pages/BillingPage';
import CheckoutPage from './pages/CheckoutPage';
import ConsultationPage from './pages/ConsultationPage';

import { themeData } from './data/themeData';

// Helper: Protected Route Guard
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
  }, []);

  if (loading) return null;
  return session ? <>{children}</> : <Navigate to="/login" replace />;
};

const PageScrollReset = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScrollTransition = () => {
      if (window.scrollY > 400) setShowButton(true);
      else setShowButton(false);
    };
    window.addEventListener('scroll', handleScrollTransition);

    // Removed conflicting hash clearing to allow Supabase to handle the session extraction

    return () => window.removeEventListener('scroll', handleScrollTransition);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <HelmetProvider>
      <Router>
        <PageScrollReset />
        <div className="min-h-screen antialiased overflow-x-hidden relative" style={{ backgroundColor: themeData.colors.bgSoft }}>
          <Routes>
            <Route path="/" element={
              <>
                <Header />
                <main className="flex flex-col">
                  <HeroSection />
                  <AdvisorsSection />
                  <ProcessSection />
                  <PricingSection />
                  <TestimonialsSection />
                  <FAQSection />
                </main>
                <Footer />
              </>
            } />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/billing" element={<ProtectedRoute><BillingPage /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/consultation" element={<ProtectedRoute><ConsultationPage /></ProtectedRoute>} />

            <Route path="/about" element={<AboutPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/success-stories" element={<SuccessStoriesPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />

            <Route path="/terms" element={<TermsPage />} />
          </Routes>

          {showButton && (
            <button
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 z-[60] w-12 h-12 rounded-full shadow-2xl flex items-center justify-center text-white transition-transform hover:scale-110"
              style={{ backgroundColor: themeData.colors.brand }}
              aria-label="Scroll to top"
            >
              <span className="text-xl">↑</span>
            </button>
          )}
        </div>
      </Router>
    </HelmetProvider>
  );
};

export default App;