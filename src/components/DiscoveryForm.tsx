import React, { useState, useEffect } from 'react';
import { X, Sparkles, ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { API_BASE_URL } from '../config/api';

interface DiscoveryFormProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string | undefined;
    onSuccess?: () => void;
}

const DiscoveryForm: React.FC<DiscoveryFormProps> = ({ isOpen, onClose, userId, onSuccess }) => {
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentStep, setCurrentStep] = useState(1);
    const [answers, setAnswers] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Always restart from step 1 — works for first time and every refresh
            setCurrentStep(1);
            setAnswers({});
            setLoading(true);
            const fetchQuestions = async () => {
                const { data } = await supabase
                    .from('discovery_questions')
                    .select('*')
                    .order('step_number', { ascending: true });
                if (data) setQuestions(data);
                setLoading(false);
            };
            fetchQuestions();
        }
    }, [isOpen]);

    const currentQuestion = questions.find(q => q.step_number === currentStep);
    const totalSteps = questions.length;

    const [, setSelectedOption] = useState<string | null>(null);

    const handleOptionClick = (option: string) => {
        const category = currentQuestion?.category;
        setSelectedOption(option);
        setAnswers({ ...answers, [category]: option });

        // Add a slight delay so the user sees their selection before the step changes
        setTimeout(() => {
            if (currentStep < totalSteps) {
                setCurrentStep(prev => prev + 1);
                setSelectedOption(null); // Reset for next question
            }
        }, 400);
    };

    const handleSubmit = async () => {
        if (!userId) {
            console.error("No User ID found. User must be logged in.");
            return;
        }
        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/forms/discovery`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ userId, answers })
            });

            if (response.ok) {
                // --- ADDED THIS LINE TO LOCK THE FORM ---
                localStorage.setItem('discovery_pending', 'true');

                // Notify parent that submission happened
                if (onSuccess) onSuccess();
                onClose();
            } else {
                const errorText = await response.text();
                console.error("n8n Error Response:", errorText);
                alert("The AI analyst is currently busy. Please try again in a moment.");
            }
        } catch (error) {
            console.error("Network Error during n8n divert:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || loading) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-lg rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative border"
                style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text-heading)' }}>
                <button onClick={onClose} className="absolute top-6 right-6 p-2 opacity-30 hover:opacity-100 transition-opacity">
                    <X size={24} />
                </button>

                <div className="flex gap-2 mb-10">
                    {questions.map(q => (
                        <div key={q.id} className={`h-1.5 flex-1 rounded-full ${currentStep >= q.step_number ? 'bg-[#E94057]' : 'opacity-10'}`}
                            style={{ backgroundColor: currentStep >= q.step_number ? undefined : 'var(--color-text-body)' }} />
                    ))}
                </div>

                <div className="space-y-2 mb-8">
                    <span className="text-[10px] font-black uppercase text-[#E94057]">Step {currentStep} of {totalSteps}</span>
                    <h2 className="text-3xl font-bold leading-tight" style={{ fontFamily: 'DM Serif Display', color: 'var(--color-text-heading)' }}>
                        {currentQuestion?.question_text}
                    </h2>
                </div>

                <div className="space-y-3">
                    {currentQuestion?.options.map((opt: string) => (
                        <button
                            key={opt}
                            onClick={() => handleOptionClick(opt)}
                            className={`w-full p-5 text-left rounded-2xl border-2 transition-all font-bold text-sm flex justify-between items-center group
                                ${answers[currentQuestion.category] === opt ? 'border-[#E94057] shadow-lg' : 'border-transparent'}`}
                            style={{
                                backgroundColor: 'var(--color-input-solid)',
                                color: 'var(--color-text-body)'
                            }}
                        >
                            {opt} <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-all text-[#E94057]" />
                        </button>
                    ))}
                </div>

                <div className="mt-12 flex items-center justify-between">
                    <button onClick={onClose} className="text-xs font-black uppercase opacity-30 hover:opacity-100" style={{ color: 'var(--color-text-body)' }}>Skip</button>
                    {currentStep === totalSteps && answers[currentQuestion?.category] && (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-10 py-5 text-white rounded-[2rem] font-bold flex items-center gap-3 shadow-xl disabled:opacity-50 hover:brightness-110 transition-all"
                            style={{ backgroundColor: '#E94057' }}
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                            Analyze Profile
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DiscoveryForm;