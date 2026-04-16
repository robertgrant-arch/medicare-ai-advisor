'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, MapPin, Stethoscope, Pill, DollarSign, Info, Phone, Shield, ChevronRight } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import ReactMarkdown from 'react-markdown';

const QUICK_STARTS = [
  { icon: MapPin, label: 'Find plans in my area', prompt: 'I want to find Medicare Advantage plans in my area', color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' },
  { icon: Stethoscope, label: 'Check my doctors', prompt: 'I want to check if my doctors are in-network', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
  { icon: Pill, label: 'Compare drug costs', prompt: 'Help me compare prescription drug coverage', color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100' },
  { icon: DollarSign, label: '$0 premium plans', prompt: 'Show me $0 premium Medicare Advantage plans', color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' },
];

export function HeroChat() {
  const { messages, isTyping, sendMessage, phase } = useChatStore();
  const [input, setInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showQuickStarts, setShowQuickStarts] = useState(true);

  useEffect(() => {
    // Scroll only the chat container, not the whole page
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setShowQuickStarts(false);
    await sendMessage(msg);
    inputRef.current?.focus();
  };

  const handleChipClick = (chip: string) => {
    handleSend(chip);
  };

  return (
    <section className="relative py-8 px-4 md:py-12">
      {/* Hero Title */}
      <div className="text-center mb-6 md:mb-8">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          AI-Powered Medicare Guidance
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
          Find Your Perfect<br />
          <span className="text-blue-600">Medicare Advantage Plan</span>
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Chat with our AI advisor to compare plans, check drug coverage, verify your doctors, and enroll — all in one conversation.
        </p>
      </div>

      {/* Chat Container */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Medicare AI Advisor</h3>
              <p className="text-blue-100 text-sm">Powered by Perplexity AI + CMS Data</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-blue-100 text-sm">Online</span>
            </div>
          </div>

          {/* Messages Area */}
          <div ref={chatContainerRef} className="h-[400px] md:h-[450px] overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'assistant' ? 'bg-blue-100' : 'bg-gray-200'
                }`}>
                  {msg.role === 'assistant' ? (
                    <Bot className="w-4 h-4 text-blue-600" />
                  ) : (
                    <User className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div className={`max-w-[80%] ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-2xl rounded-tr-md px-4 py-3'
                    : 'bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-gray-100'
                }`}>
                  <div className={`text-sm leading-relaxed ${msg.role === 'user' ? 'text-white' : 'text-gray-700'}`}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                  {msg.source && msg.role === 'assistant' && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        {msg.source}
                      </p>
                    </div>
                  )}
                  {msg.chips && msg.chips.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.chips.map((chip, i) => (
                        <button
                          key={i}
                          onClick={() => handleChipClick(chip)}
                          className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1.5 hover:bg-blue-100 transition-colors flex items-center gap-1"
                        >
                          <ChevronRight className="w-3 h-3" />
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Start Cards */}
          {showQuickStarts && messages.length <= 1 && (
            <div className="px-4 py-3 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-2">
              {QUICK_STARTS.map((qs, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(qs.prompt)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all ${qs.color}`}
                >
                  <qs.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{qs.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 border-t border-gray-100">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Medicare plans..."
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={isTyping || !input.trim()}
                className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex justify-between items-center mt-2 px-1">
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                AI assistant. Not a licensed agent.
              </p>
              <a href="tel:18005550199" className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                <Phone className="w-3 h-3" />
                1-800-555-0199
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
