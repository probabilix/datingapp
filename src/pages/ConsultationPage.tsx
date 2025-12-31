import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { themeData } from "../data/themeData";
import Vapi from "@vapi-ai/web"; 
import {
  MessageSquare, Phone, ChevronLeft, Sparkles, Send,
  Mic, MicOff, Volume2, VolumeX, PhoneOff, User, Menu, X
} from "lucide-react";
import Header from "../components/Header";

const ConsultationPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [advisors, setAdvisors] = useState<any[]>([]);
  const [selectedAdvisor, setSelectedAdvisor] = useState<any>(null);
  const [mode, setMode] = useState<"chat" | "voice">(searchParams.get("mode") as any || "chat");
  const [loading, setLoading] = useState(true);
  
  const [n8nConfig, setN8nConfig] = useState<{ apiKey: string } | null>(null);
  const [usage, setUsage] = useState<any>(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  
  // 🔹 Persist Vapi instance across re-renders
  const vapiRef = useRef<Vapi | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 1. FETCH ADVISORS, USAGE, AND SYSTEM KEYS (VAPI + N8N)
  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return navigate('/login');

      // Fetch dynamic keys from system_settings
      const [advisorsRes, n8nKeyRes, vapiKeyRes, usageRes] = await Promise.all([
        supabase.from("advisors").select("*").order("id"),
        supabase.from("system_settings").select("*").eq("key_name", "N8N_API_KEY").single(),
        supabase.from("system_settings").select("*").eq("key_name", "VAPI_PUBLIC_KEY").single(),
        supabase.from("user_usage").select("*").eq("user_id", session.user.id).single()
      ]);

      setAdvisors(advisorsRes.data || []);
      setUsage(usageRes.data || null);
      
      if (n8nKeyRes.data) {
        setN8nConfig({ apiKey: n8nKeyRes.data.key_value });
      }

      // 🔹 INITIALIZE VAPI (Only once using Public Key from DB)
      if (vapiKeyRes.data?.key_value && !vapiRef.current) {
        vapiRef.current = new Vapi(vapiKeyRes.data.key_value);
        
        vapiRef.current.on("call-start", () => setIsCallActive(true));
        vapiRef.current.on("call-end", () => setIsCallActive(false));
        vapiRef.current.on("error", (err) => {
          console.error("Vapi Error:", err);
          setIsCallActive(false);
        });
      }

      const agentId = searchParams.get("agent");
      const currentAdvisor = advisorsRes.data?.find((a: any) => a.id === agentId) || advisorsRes.data?.[0] || null;
      setSelectedAdvisor(currentAdvisor);
      
      setLoading(false);
    })();
  }, [searchParams, navigate]);

  // 🔹 VOICE CALL HANDLER (Updated with Billing & Safety Logic)
  const handleVoiceCall = async () => {
    if (isCallActive) {
      vapiRef.current?.stop();
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    
    // Safety check for dynamic advisor ID and initialized SDK
    if (!session || !selectedAdvisor?.vapi_assistant_id || !vapiRef.current) return;

    // 1. PRE-CALL BILLING CHECK
    const currentMinutes = usage?.voice_minutes_left || 0;
    if (currentMinutes <= 0) {
      alert("🚫 You have 0 voice minutes left. Please top up to start a call.");
      return;
    }

    // 2. CALCULATE MAX DURATION (Seconds)
    const maxDurationSeconds = Math.floor(currentMinutes * 60);

    // 🔹 Pass Assistant ID and config with maxDurationSeconds
    vapiRef.current.start(selectedAdvisor.vapi_assistant_id, {
      variableValues: {
        user_id: session.user.id // Handshake for n8n memory workflow
      },
      maxDurationSeconds: maxDurationSeconds // Auto-cut when balance hits zero
    });
  };

  // 2. FETCH PREVIOUS CHATS (ISOLATED BY ADVISOR + 24 HOUR WINDOW)
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

      if (error) {
        console.error("Chat fetch error:", error);
        return;
      }

      setMessages(data || []);
    };

    fetchChatHistory();
  }, [selectedAdvisor]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedAdvisor) return;

    const totalCredits = (usage?.messages_left || 0) + (usage?.custom_messages_balance || 0);
    if (totalCredits <= 0) {
      setMessages((prev) => [...prev, { role: "ai", content: "🚫 Out of credits! Please top up in your dashboard." }]);
      return;
    }
    
    const webhookUrl = selectedAdvisor.n8n_webhook_path;
    if (!webhookUrl || !webhookUrl.startsWith("http")) {
      setMessages((prev) => [...prev, { role: "ai", content: "⚠️ This advisor backend is not yet live." }]);
      return;
    }

    const text = input.trim();
    setInput("");
    
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setIsTyping(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id;
      if (!currentUserId) throw new Error("Auth failed");

      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-N8N-API-KEY": n8nConfig?.apiKey || "" 
        },
        body: JSON.stringify({ 
          message: text, 
          agentId: selectedAdvisor?.id, 
          userId: currentUserId, 
          advisorName: selectedAdvisor?.name 
        }),
      });

      const aiResponse = await res.json();
      
      if (aiResponse.status === "out_of_credits") {
         setMessages((prev) => [...prev, { role: "ai", content: aiResponse.output }]);
         return;
      }

      setMessages((prev) => [...prev, { role: "ai", content: aiResponse?.output || "Sparkling with ideas... ✨" }]);

      const { data: updatedUsage } = await supabase.from("user_usage").select("*").eq("user_id", currentUserId).single();
      setUsage(updatedUsage);

    } catch (err) {
      console.error("Webhook Error:", err);
      setMessages((prev) => [...prev, { role: "ai", content: "⚠️ Connection hiccup. Try again!" }]);
    } finally { setIsTyping(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold opacity-20 italic">Entering Consultation...</div>;

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: themeData.colors.bgSoft }}>
      <Header />

      <main className={`flex-grow pt-20 md:pt-28 pb-4 px-4 md:px-8 max-w-[1600px] mx-auto flex gap-6 w-full h-full relative ${isMobile ? 'flex-col' : 'flex-row'}`}>
        
        {!isMobile && (
          <aside className="w-72 flex flex-col space-y-4">
            <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-[10px] font-black uppercase opacity-30 hover:opacity-100 mb-4 transition-all">
              <ChevronLeft size={14} /> Back to Dashboard
            </button>
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
              {advisors.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => setSearchParams({ agent: agent.id, mode })}
                  className={`w-full p-4 rounded-[2rem] flex items-center gap-4 transition-all border-2 ${
                    selectedAdvisor?.id === agent.id ? "bg-white border-black shadow-xl" : "bg-white/40 border-transparent opacity-60"
                  }`}
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
              {isMobile && (
                <button onClick={() => navigate("/dashboard")} className="p-2 bg-white/10 rounded-xl">
                  <ChevronLeft size={20} />
                </button>
              )}
              <div className="relative">
                <img src={selectedAdvisor?.image_url} className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl object-cover" alt="" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#1A1A1A] rounded-full" />
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
                  className={`px-4 md:px-6 py-2.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase flex items-center gap-2 transition-all ${
                    mode === m ? "bg-[#E94057] text-white" : "text-white/40"
                  }`}
                >
                  {m === "chat" ? <MessageSquare size={14} /> : <Phone size={14} />}
                  <span className="hidden sm:inline">{m}</span>
                </button>
              ))}
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 md:p-12 bg-[#FBFCFE] no-scrollbar">
            {mode === "chat" ? (
              <div className="space-y-6 max-w-4xl mx-auto">
                <div className="flex justify-start">
                  <div className="max-w-[85%] p-6 bg-white border border-gray-100 rounded-[2.5rem] rounded-tl-none text-sm leading-relaxed shadow-sm">
                    Hey! I'm {selectedAdvisor?.name}. I've got your records open. What's the latest update in your dating world?
                  </div>
                </div>
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2`}>
                    <p className={`max-w-[85%] p-6 rounded-[2.5rem] text-[15px] font-medium leading-relaxed shadow-sm ${
                        m.role === "user" ? "bg-black text-white rounded-tr-none" : "bg-white border rounded-tl-none text-gray-800"
                    }`}>{m.content}</p>
                  </div>
                ))}
                {isTyping && <div className="flex justify-start"><div className="bg-white px-5 py-3 rounded-full border border-gray-100 flex gap-2 shadow-sm animate-pulse"><div className="w-1.5 h-1.5 bg-gray-400 rounded-full" /><div className="w-1.5 h-1.5 bg-gray-400 rounded-full" /></div></div>}
                <div ref={scrollRef} />
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center space-y-12 py-10">
                <div className="relative">
                  {isCallActive && <div className="absolute -inset-8 bg-[#E94057] rounded-full animate-ping opacity-10" />}
                  <img src={selectedAdvisor?.image_url} className={`w-48 h-48 md:w-64 md:h-64 rounded-[4rem] md:rounded-[6rem] object-cover border-8 border-white shadow-2xl relative z-10 transition-all duration-700 ${isCallActive ? "scale-105" : "grayscale opacity-40"}`} alt="" />
                </div>
                <div className="text-center">
                  <h4 className="text-3xl font-bold mb-2">{isCallActive ? "Live Call" : "Voice Ready"}</h4>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">{isCallActive ? "Encrypted Stream Active" : `Minutes Left: ${usage?.voice_minutes_left?.toFixed(2)}`}</p>
                </div>
                <div className="flex items-center gap-8">
                   <button className="w-14 h-14 rounded-full bg-gray-100 text-gray-300 flex items-center justify-center"><MicOff size={22} /></button>
                   <button onClick={handleVoiceCall} className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 ${isCallActive ? "bg-red-500 rotate-[135deg]" : "bg-green-500"}`}><Phone size={36} className="text-white fill-current" /></button>
                   <button className="w-14 h-14 rounded-full bg-gray-100 text-gray-300 flex items-center justify-center"><Volume2 size={22} /></button>
                </div>
              </div>
            )}
          </div>

          {mode === "chat" && (
            <footer className="p-6 md:p-10 bg-white">
              <div className="max-w-4xl mx-auto flex items-center gap-3 bg-gray-50 p-2 rounded-[2.5rem] border border-gray-100 focus-within:border-black transition-all">
                <input
                  className="flex-1 bg-transparent px-6 py-4 outline-none text-sm font-medium"
                  placeholder={`Consult with ${selectedAdvisor?.name}...`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button onClick={handleSendMessage} className="w-14 h-14 rounded-full bg-[#E94057] text-white flex items-center justify-center shadow-xl hover:brightness-110 active:scale-95">
                  <Send size={20} />
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