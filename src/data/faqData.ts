export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = [
  {
    id: 1,
    question: "How does the AI advisor actually work?",
    answer: "Our AI advisors are trained on thousands of relationship coaching scenarios. They use advanced natural language processing to understand your unique situation and provide tailored advice that feels remarkably human."
  },
  {
    id: 2,
    question: "Is my data and conversation private?",
    answer: "Absolutely. We use end-to-end encryption for all chats and voice calls. Your personal data is never shared with third parties, and conversations are strictly between you and your AI advisor."
  },
  {
    id: 3,
    question: "Can I switch advisors at any time?",
    answer: "Yes! Depending on your plan, you can consult with any of our 12 specialists. If you feel a different personality or specialty fits your current mood better, you can switch instantly."
  },
  {
    id: 4,
    question: "Do I need a subscription for voice calls?",
    answer: "Voice calling is a Premium feature. While free users can access text-based chat with limited advisors, our Premium and VIP plans include real-time voice conversations."
  }
];