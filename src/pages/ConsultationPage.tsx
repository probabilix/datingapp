import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { themeData } from "../data/themeData";
import Vapi from "@vapi-ai/web";
import {
  MessageSquare, Phone, ChevronLeft, Sparkles, Send,
  MicOff, Volume2, AlertCircle, Clock
} from "lucide-react";
import Header from "../components/Header";
import { motion, AnimatePresence } from "framer-motion";

// Professional Credit Modal
const CreditExhaustedModal: React.FC<{ onClose: () => void; type: 'chat' | 'voice' }> = ({ onClose, type }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl relative text-center"
    >
      <div className="mx-auto w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 text-red-500">
        <AlertCircle size={40} />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        {type === 'chat' ? 'Message Limit Reached' : 'Talk Time Over'}
      </h3>
      <p className="text-gray-500 mb-8 leading-relaxed text-sm">
        {type === 'chat'
          ? "You've used all your available messages. Please top up your credits to continue chatting."
          : "Your consultation minutes have run out. Please top up your credits to continue this session."}
      </p>
      <button
        onClick={() => window.location.href = '/billing'}
        className="w-full py-4 bg-[#E94057] text-white rounded-2xl font-bold shadow-lg shadow-red-200 hover:brightness-110 transition-all mb-4"
      >
        Top Up Now
      </button>
      <button onClick={onClose} className="text-gray-400 text-xs font-black uppercase tracking-widest hover:text-gray-600">
        Close & End Session
      </button>
    </motion.div>
  </motion.div>
);

const ConsultationPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [advisors, setAdvisors] = useState<any[]>([]);
  const [selectedAdvisor, setSelectedAdvisor] = useState<any>(null);
  const [mode, setMode] = useState<"chat" | "voice">(searchParams.get("mode") as any || "chat");
  const [loading, setLoading] = useState(true);

  const [n8nConfig, setN8nConfig] = useState<{ apiKey: string } | null>(null);
  const [usage, setUsage] = useState<any>(null);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [modalType, setModalType] = useState<'chat' | 'voice'>('voice');

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Voice State
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");

  const vapiRef = useRef<Vapi | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const callTimerIntervalRef = useRef<any>(null);
  const billingTimeoutRef = useRef<any>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 1. DATA FETCHING & VAPI PRE-WARM
  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return navigate('/login');

      const [advisorsRes, n8nKeyRes, vapiKeyRes, usageRes] = await Promise.all([
        supabase.from("advisors").select("*").order("id"),
        supabase.from("system_settings").select("*").eq("key_name", "N8N_API_KEY").single(),
        supabase.from("system_settings").select("*").eq("key_name", "VAPI_PUBLIC_KEY").single(),
        supabase.from("user_usage").select("*").eq("user_id", session.user.id).single()
      ]);

      if (!isMounted) return;

      setAdvisors(advisorsRes.data || []);
      setUsage(usageRes.data || null);
      if (n8nKeyRes.data) setN8nConfig({ apiKey: n8nKeyRes.data.key_value });

      if (vapiKeyRes.data?.key_value && !vapiRef.current) {
        vapiRef.current = new Vapi(vapiKeyRes.data.key_value);
        setupVapiListeners();
      }

      const agentId = searchParams.get("agent");
      const currentAdvisor = advisorsRes.data?.find((a: any) => a.id === agentId) || advisorsRes.data?.[0] || null;
      setSelectedAdvisor(currentAdvisor);

      setLoading(false);
    })();

    return () => { isMounted = false; };
  }, []);

  // Sync selectedAdvisor when URL changes
  useEffect(() => {
    if (advisors.length > 0) {
      const agentId = searchParams.get("agent");
      const currentAdvisor = advisors.find((a: any) => a.id === agentId) || advisors[0];
      setSelectedAdvisor(currentAdvisor);
    }
  }, [searchParams, advisors]);

  const setupVapiListeners = () => {
    if (!vapiRef.current) return;

    vapiRef.current.on("call-start", () => {
      setIsCallActive(true);
      setConnectionStatus("connected");
      setCallDuration(0);
      callTimerIntervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    });

    const handleCallEnd = async () => {
      setIsCallActive(false);
      setConnectionStatus("disconnected");
      if (callTimerIntervalRef.current) clearInterval(callTimerIntervalRef.current);
      if (billingTimeoutRef.current) clearTimeout(billingTimeoutRef.current);

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: updatedUsage } = await supabase.from("user_usage").select("*").eq("user_id", session.user.id).single();
        setUsage(updatedUsage);
      }
    };

    vapiRef.current.on("call-end", handleCallEnd);
    vapiRef.current.on("error", (err) => {
      console.error("Vapi Error:", err);
      handleCallEnd();
      vapiRef.current?.stop();
    });
  };

  // 🔹 VOICE CALL HANDLER (Optimized Connection Speed)
  const handleVoiceCall = async () => {
    if (isCallActive || connectionStatus === "connecting") {
      vapiRef.current?.stop();
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !selectedAdvisor?.vapi_assistant_id || !vapiRef.current) return;

    // Sub-second Pre-check
    const { data: freshUsage } = await supabase.from("user_usage").select("voice_minutes_left").eq("user_id", session.user.id).single();
    const currentMinutes = freshUsage?.voice_minutes_left ?? 0;

    if (currentMinutes <= 0.1) {
      setModalType('voice');
      setShowBillingModal(true);
      return;
    }

    setConnectionStatus("connecting");
    const maxDurationSeconds = Math.floor(currentMinutes * 60);

    try {
      // Immediate execution
      vapiRef.current.start(selectedAdvisor.vapi_assistant_id, {
        variableValues: { user_id: session.user.id },
        maxDurationSeconds: maxDurationSeconds
      });

      if (billingTimeoutRef.current) clearTimeout(billingTimeoutRef.current);
      billingTimeoutRef.current = setTimeout(() => {
        vapiRef.current?.stop();
        setModalType('voice');
        setShowBillingModal(true);
      }, (maxDurationSeconds * 1000) + 1000);

    } catch (err) {
      setConnectionStatus("disconnected");
    }
  };

  // 2. FETCH PREVIOUS CHATS
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!selectedAdvisor) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data, error } = await supabase
        .from("chat_history")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("advisor_id", selectedAdvisor.id)
        .gt("created_at", twentyFourHoursAgo)
        .order("created_at", { ascending: true });

      if (error) return;
      setMessages(data || []);
    };
    fetchChatHistory();
  }, [selectedAdvisor]);

  // SCROLL LOGIC - Updated with 'mode' to fix Voice-to-Chat scroll
  useEffect(() => {
    if (mode === "chat") {
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages, isTyping, mode]);

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedAdvisor || isTyping) return;
    const totalCredits = (usage?.messages_left || 0) + (usage?.custom_messages_balance || 0);
    if (totalCredits <= 0) {
      setModalType('chat');
      setShowBillingModal(true);
      return;
    }
    const text = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setIsTyping(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(selectedAdvisor.n8n_webhook_path, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-N8N-API-KEY": n8nConfig?.apiKey || "" },
        body: JSON.stringify({
          message: text,
          agentId: selectedAdvisor?.id,
          userId: session?.user?.id,
          advisorName: selectedAdvisor?.name
        }),
      });
      const aiResponse = await res.json();
      setMessages((prev) => [...prev, { role: "ai", content: aiResponse?.output || "..." }]);
      setIsTyping(false); // Stop typing immediately after message is received

      const { data: updatedUsage } = await supabase.from("user_usage").select("*").eq("user_id", session?.user?.id).single();
      setUsage(updatedUsage);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "ai", content: "⚠️ Connection error." }]);
      setIsTyping(false);
    }
    // finally block removed as we handle state explicitly above for better timing
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold opacity-20 italic">Entering Consultation...</div>;

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: themeData.colors.bgSoft }}>
      <Header />
      <AnimatePresence>
        {showBillingModal && <CreditExhaustedModal type={modalType} onClose={() => setShowBillingModal(false)} />}
      </AnimatePresence>

      <main className={`flex-grow pt-20 md:pt-28 pb-4 px-4 md:px-8 max-w-[1600px] mx-auto flex gap-6 w-full h-full relative ${isMobile ? 'flex-col' : 'flex-row'}`}>
        {!isMobile && (
          <aside className="w-72 flex flex-col space-y-4">
            <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-[10px] font-black uppercase opacity-30 hover:opacity-100 mb-4 transition-all cursor-pointer">
              <ChevronLeft size={14} /> Back to Dashboard
            </button>
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
              {advisors.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => setSearchParams({ agent: agent.id, mode })}
                  className={`w-full p-4 rounded-[2rem] flex items-center gap-4 transition-all border-2 cursor-pointer ${selectedAdvisor?.id === agent.id ? "bg-white border-black shadow-xl" : "bg-white/40 border-transparent opacity-60"}`}
                >
                  <img src={agent.image_url} className="w-12 h-12 rounded-2xl object-cover" alt="" />
                  <div className="text-left">
                    <p className="font-bold text-sm leading-tight">{agent.name}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-40">{agent.specialty}</p>
                  </div>
                </button>
              ))}
            </div>
          </aside>
        )}

        <section className="flex-1 bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl border flex flex-col overflow-hidden h-full relative">
          <header className="p-5 md:p-8 flex items-center justify-between bg-[#1A1A1A] text-white">
            <div className="flex items-center gap-4">
              {isMobile && <button onClick={() => navigate("/dashboard")} className="p-2 bg-white/10 rounded-xl"><ChevronLeft size={20} /></button>}
              <div className="relative">
                <img src={selectedAdvisor?.image_url} className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl object-cover" alt="" />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-[#1A1A1A] rounded-full ${isCallActive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
              </div>
              <div className="hidden xs:block">
                <h3 className="font-bold text-base md:text-xl leading-none mb-1">{selectedAdvisor?.name}</h3>
                <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-40 flex items-center gap-1">
                  <Sparkles size={10} className="text-[#E94057]" /> {selectedAdvisor?.specialty}
                </p>
              </div>
            </div>
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
              {["chat", "voice"].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m as any)}
                  className={`px-4 md:px-6 py-2.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase flex items-center gap-2 transition-all cursor-pointer ${mode === m ? "bg-[#E94057] text-white" : "text-white/40"}`}
                >
                  {m === "chat" ? <MessageSquare size={14} /> : <Phone size={14} />}
                  <span className="hidden sm:inline">{m}</span>
                </button>
              ))}
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 md:p-12 bg-[#FBFCFE] no-scrollbar relative">
            {mode === "chat" ? (
              <div className="space-y-6 max-w-4xl mx-auto">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="max-w-[85%] p-6 bg-white border border-gray-100 rounded-[2.5rem] rounded-tl-none text-sm leading-relaxed shadow-sm">
                    Hey! I'm {selectedAdvisor?.name}. I've got your records open. What's the latest update in your dating world?
                  </div>
                </motion.div>
                {messages.map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <p className={`max-w-[85%] p-6 rounded-[2.5rem] text-[15px] font-medium leading-relaxed shadow-sm ${m.role === "user" ? "bg-black text-white rounded-tr-none" : "bg-white border rounded-tl-none text-gray-800"}`}>{m.content}</p>
                  </motion.div>
                ))}
                {isTyping && <div className="flex justify-start animate-pulse"><div className="bg-white px-5 py-3 rounded-full border border-gray-100 flex gap-1"><div className="w-1.5 h-1.5 bg-gray-400 rounded-full" /><div className="w-1.5 h-1.5 bg-gray-400 rounded-full" /></div></div>}
                <div ref={scrollRef} />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center space-y-12 py-10">
                <div className="relative group">
                  {isCallActive && (
                    <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -inset-8 bg-[#E94057] rounded-full opacity-20" />
                  )}
                  <img src={selectedAdvisor?.image_url} className={`w-48 h-48 md:w-64 md:h-64 rounded-[4rem] md:rounded-[6rem] object-cover border-8 border-white shadow-2xl z-10 relative transition-all duration-700 ${isCallActive ? "scale-105" : "grayscale opacity-50"}`} alt="" />
                </div>
                <div className="text-center space-y-2">
                  <h4 className="text-3xl font-bold">{connectionStatus === "connected" ? "Live Call" : connectionStatus === "connecting" ? "Connecting..." : "Voice Ready"}</h4>
                  {connectionStatus === "connected" ? (
                    <div className="flex items-center justify-center gap-2 text-[#E94057] font-black uppercase tracking-widest text-lg">
                      <Clock size={16} /> <span>{formatTime(callDuration)}</span>
                    </div>
                  ) : (
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">{usage?.voice_minutes_left?.toFixed(1)} Mins Available</p>
                  )}
                </div>
                <div className="flex items-center gap-8">
                  <button className="w-14 h-14 rounded-full bg-gray-100 text-gray-300 flex items-center justify-center"><MicOff size={22} /></button>
                  <button
                    onClick={handleVoiceCall}
                    disabled={connectionStatus === "connecting"}
                    className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 cursor-pointer ${isCallActive ? "bg-red-500 rotate-[135deg]" : connectionStatus === "connecting" ? "bg-gray-300 animate-pulse cursor-wait" : "bg-green-500 hover:scale-105"}`}
                  >
                    <Phone size={36} className="text-white fill-current" />
                  </button>
                  <button className="w-14 h-14 rounded-full bg-gray-100 text-gray-300 flex items-center justify-center"><Volume2 size={22} /></button>
                </div>
              </div>
            )}
          </div>

          {mode === "chat" && (
            <footer className="p-6 md:p-10 bg-white">
              <div className="max-w-4xl mx-auto flex items-center gap-3 bg-gray-50 p-2 rounded-[2.5rem] border border-gray-100 focus-within:border-black transition-all">
                <input
                  className={`flex-1 bg-transparent px-6 py-4 outline-none text-sm font-medium`}
                  placeholder={isTyping ? "Advisor is thinking..." : `Consult with ${selectedAdvisor?.name}...`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !isTyping && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isTyping}
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all ${isTyping ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#E94057] hover:brightness-110 active:scale-95 cursor-pointer'}`}
                >
                  {isTyping ? <Clock size={20} className="animate-spin text-white" /> : <Send size={20} className="text-white" />}
                </button>
              </div>
            </footer>
          )}
        </section>
      </main>
    </div>
  );
};

export default ConsultationPage;