import React, { useState, useEffect } from 'react';
import { X, Sparkles, ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

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

  const handleOptionClick = (option: string) => {
    const category = currentQuestion?.category;
    setAnswers({ ...answers, [category]: option });
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSubmit = async () => {
    if (!userId) {
      console.error("No User ID found. User must be logged in.");
      return;
    }
    setIsSubmitting(true);

    try {
      const { data: setting, error: dbError } = await supabase
        .from('system_settings')
        .select('key_value')
        .eq('key_name', 'N8N_DISCOVERY_WEBHOOK')
        .maybeSingle();

      if (dbError || !setting?.key_value) {
        console.error("Failed to find Webhook in DB:", dbError?.message || "Key Missing");
        alert("Configuration Error: Please contact support.");
        return;
      }

      const response = await fetch(setting.key_value, {
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-300 hover:text-black">
          <X size={24} />
        </button>

        <div className="flex gap-2 mb-10">
          {questions.map(q => (
            <div key={q.id} className={`h-1.5 flex-1 rounded-full ${currentStep >= q.step_number ? 'bg-[#E94057]' : 'bg-gray-100'}`} />
          ))}
        </div>

        <div className="space-y-2 mb-8">
          <span className="text-[10px] font-black uppercase text-[#E94057]">Step {currentStep} of {totalSteps}</span>
          <h2 className="text-3xl font-bold leading-tight" style={{ fontFamily: 'DM Serif Display' }}>
            {currentQuestion?.question_text}
          </h2>
        </div>

        <div className="space-y-3">
          {currentQuestion?.options.map((opt: string) => (
            <button
              key={opt}
              onClick={() => handleOptionClick(opt)}
              className={`w-full p-5 text-left rounded-2xl border-2 transition-all font-bold text-sm flex justify-between items-center group
                ${answers[currentQuestion.category] === opt ? 'border-black bg-gray-50' : 'border-gray-50 hover:border-gray-200'}`}
            >
              {opt} <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-all" />
            </button>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-between">
          <button onClick={onClose} className="text-xs font-black uppercase opacity-30 hover:opacity-100">Skip</button>
          {currentStep === totalSteps && answers[currentQuestion?.category] && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-10 py-5 bg-black text-white rounded-[2rem] font-bold flex items-center gap-3 shadow-xl disabled:opacity-50"
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