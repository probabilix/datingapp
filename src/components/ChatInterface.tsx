import React, { useState, useEffect, useRef } from 'react';
import { themeData } from '../data/themeData';
import { Send, Phone, ChevronLeft, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const ChatInterface = ({ advisor, onClose }: any) => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: `Hello! I'm ${advisor.name}. I've been reviewing your profile and I'm ready to help you level up your dating game. What's on your mind?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Connect to n8n router based on your database configuration
      const response = await fetch('YOUR_N8N_ROUTER_URL', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          agentId: advisor.id,
          userId: (await supabase.auth.getUser()).data.user?.id,
          personaContext: advisor.specialty 
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.output }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "I'm having a quick connection issue. Let's try that again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white md:inset-auto md:right-10 md:bottom-10 md:w-[450px] md:h-[750px] md:rounded-[3.5rem] shadow-2xl overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-10">
      {/* Premium Header */}
      <div className="p-8 flex items-center justify-between border-b border-gray-50 bg-[#1A1A1A] text-white">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-opacity"><ChevronLeft /></button>
          <div className="relative">
            <img src={advisor.image_url} className="w-14 h-14 rounded-2xl object-cover border-2 border-white/10" alt="" />
            {advisor.is_online && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#1A1A1A] rounded-full" />}
          </div>
          <div>
            <h3 className="font-bold text-xl leading-none mb-1">{advisor.name}</h3>
            <div className="flex items-center gap-1.5">
              <Sparkles size={10} className="text-[#E94057]" />
              <span className="text-[9px] font-black uppercase tracking-widest text-white/40">{advisor.specialty}</span>
            </div>
          </div>
        </div>
        <button className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"><Phone size={20} /></button>
      </div>

      {/* Modern Bubbles */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#FAFAFA] no-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`max-w-[85%] p-6 rounded-[2.5rem] text-[15px] leading-relaxed shadow-sm ${
              m.role === 'user' ? 'bg-black text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-50'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white px-6 py-4 rounded-full border border-gray-50 flex gap-1.5 shadow-sm">
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Section */}
      <div className="p-8 bg-white">
        <div className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-[2.5rem] border border-gray-100 focus-within:border-black transition-all">
          <input 
            className="flex-1 bg-transparent px-5 py-3 outline-none text-sm font-medium"
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button onClick={handleSendMessage} className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl active:scale-95 transition-all" style={{ backgroundColor: themeData.colors.brand }}>
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;