'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, MapPin, Stethoscope, Pill, DollarSign, Info } from 'lucide-react';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  source?: string;
  chips?: string[];
}

const QUICK_STARTS = [
  { icon: MapPin, label: 'Find plans in my area', prompt: 'I want to find Medicare Advantage plans in my area' },
  { icon: Stethoscope, label: 'Check my doctors', prompt: 'I want to check if my doctors are in-network' },
  { icon: Pill, label: 'Compare drug costs', prompt: 'Help me compare prescription drug coverage' },
  { icon: DollarSign, label: '$0 premium plans', prompt: 'Show me $0 premium Medicare Advantage plans' },
];

const INITIAL_MESSAGE: Message = {
  id: '1',
  role: 'assistant',
  content: "Hi! I'm your Medicare AI Advisor. I'll help you find the best Medicare Advantage plan for your needs. I use real CMS data and carrier information to give you accurate, transparent recommendations.\n\nWhat would you like to explore today?",
  source: 'System',
  chips: ['Find plans near me', 'Compare plan benefits', 'Check my medications', 'Understand Medicare basics'],
};

export function HeroChat() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: messages }),
      });
      const data = await res.json();
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || "I'm having trouble connecting right now. Please try again or call us at 1-800-555-0100.",
        source: data.source || 'AI Advisor',
        chips: data.chips,
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm here to help! To get started, could you share your ZIP code so I can find plans available in your area?",
        source: 'AI Advisor',
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <section className="relative py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Hero Text */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-navy-50 text-navy-700 px-3 py-1.5 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" /> 2026 Medicare Advantage Open Enrollment
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-navy-900 leading-tight">
              Your Medicare Plan,{' '}
              <span className="text-crimson-500">Guided by AI</span>
            </h1>
            <p className="text-lg text-navy-600 max-w-lg">
              Have a conversation with our AI advisor. It knows every plan in your area, checks your doctors, estimates your drug costs, and walks you through enrollment.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {QUICK_STARTS.map((qs) => (
                <button
                  key={qs.label}
                  onClick={() => sendMessage(qs.prompt)}
                  className="flex items-center gap-2 p-3 rounded-xl border border-navy-100 bg-white hover:bg-navy-50 hover:border-navy-200 transition text-left group"
                >
                  <qs.icon className="w-5 h-5 text-navy-400 group-hover:text-crimson-500 transition" />
                  <span className="text-sm font-medium text-navy-700">{qs.label}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4 text-xs text-navy-400">
              <span className="flex items-center gap-1"><Info className="w-3 h-3" /> Data from CMS.gov</span>
              <span>No cost to compare</span>
              <span>Licensed agents available</span>
            </div>
          </div>

          {/* Right: Chat Interface */}
          <div className="bg-white rounded-2xl shadow-xl border border-navy-100 overflow-hidden">
            <div className="bg-navy-800 px-5 py-3 flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-white font-semibold text-sm">Medicare AI Advisor</span>
                <span className="text-navy-300 text-xs block">Powered by CMS data + AI</span>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-soft" />
                <span className="text-green-300 text-xs">Online</span>
              </div>
            </div>

            <div className="h-[400px] overflow-y-auto chat-scroll p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                      msg.role === 'assistant' ? 'bg-navy-100' : 'bg-navy-800'
                    }`}>
                      {msg.role === 'assistant' ? <Bot className="w-3.5 h-3.5 text-navy-600" /> : <User className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div>
                      <div className={`chat-bubble ${msg.role === 'assistant' ? 'chat-bubble-ai' : 'chat-bubble-user'}`}>
                        <p className="text-sm whitespace-pre-line">{msg.content}</p>
                      </div>
                      {msg.source && (
                        <span className="source-badge mt-1">
                          <Info className="w-3 h-3" /> {msg.source}
                        </span>
                      )}
                      {msg.chips && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {msg.chips.map((chip) => (
                            <button
                              key={chip}
                              onClick={() => sendMessage(chip)}
                              className="text-xs px-3 py-1.5 rounded-full border border-navy-200 text-navy-600 hover:bg-navy-50 hover:border-navy-300 transition"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-navy-100 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-navy-600" />
                  </div>
                  <div className="chat-bubble chat-bubble-ai flex gap-1">
                    <div className="w-2 h-2 bg-navy-400 rounded-full typing-dot" />
                    <div className="w-2 h-2 bg-navy-400 rounded-full typing-dot" />
                    <div className="w-2 h-2 bg-navy-400 rounded-full typing-dot" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-navy-100 p-3">
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Medicare plans..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-navy-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-300 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="bg-navy-800 hover:bg-navy-900 disabled:bg-navy-300 text-white p-2.5 rounded-xl transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <p className="text-[10px] text-navy-400 mt-2 text-center">
                AI assistant. Not a licensed agent. <a href="tel:18005550100" className="text-crimson-500 hover:underline">1-800-555-0100</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
