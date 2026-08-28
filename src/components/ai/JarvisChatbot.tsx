'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles, X, Send, Bot, User, CornerDownLeft,
  Maximize2, Minimize2, Trash2, Volume2, VolumeX,
  Code2, Lightbulb, HelpCircle, Check, Copy, ArrowRight
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  codeSnippet?: string;
  timestamp: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'ai',
    text: 'Assalam-o-Alaikum! I am JARVIS, your 24/7 AI Master Tutor on NextGen LMS. What would you like to learn or debug today?',
    timestamp: 'Just now'
  }
];

const SUGGESTIONS = [
  { label: 'Explain React Server Components', query: 'Explain React Server Components vs Client Components in simple terms.' },
  { label: 'Debug Next.js Hydration Error', query: 'Why does "Hydration failed because initial UI does not match" happen in Next.js 15?' },
  { label: 'AI Exam Prep Tips', query: 'Give me 3 important tips to pass the NextGen LMS Certification Exam.' },
  { label: 'Python Vector Embeddings', query: 'How do Vector Embeddings and Cosine Similarity work in Generative AI?' }
];

export function JarvisChatbot() {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputMessage.trim();
    if (!query) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    // Dynamic AI response generator
    setTimeout(() => {
      let aiReply = '';
      let codeSnippet: string | undefined = undefined;

      const lower = query.toLowerCase();
      if (lower.includes('server component') || lower.includes('rsc')) {
        aiReply = 'In Next.js (App Router), components are Server Components by default. They execute exclusively on the server, producing zero JavaScript bundle on the client. Use "use client" only when you need useState, useEffect, or event listeners!';
        codeSnippet = '// app/page.tsx (Server Component by default)\nexport default async function Page() {\n  const data = await fetchUserData(); // Direct DB/API call\n  return <div>{data.title}</div>;\n}';
      } else if (lower.includes('hydration')) {
        aiReply = 'Hydration mismatch happens when server-rendered HTML differs from the first client-rendered DOM. Common causes: using `window` or `Date.now()` directly in the initial render, or invalid HTML nesting (like putting a <div> inside a <p>).';
        codeSnippet = '// Fix with mounted state check:\nconst [mounted, setMounted] = useState(false);\nuseEffect(() => { setMounted(true); }, []);\nif (!mounted) return null;';
      } else if (lower.includes('exam') || lower.includes('pass') || lower.includes('test')) {
        aiReply = 'Here are 3 Key Tips for your NextGen AI Certification Exam:\n1. 🎯 Complete 100% video lectures to unlock the exam gatekeeper.\n2. ⏱️ Review the module code examples and practical tasks.\n3. 💡 Score >= 75% to instantly earn your Verified PDF Certificate and Public Profile Badge!';
      } else if (lower.includes('vector') || lower.includes('ai') || lower.includes('embedding')) {
        aiReply = 'Vector Embeddings convert words and concepts into high-dimensional numerical arrays (e.g. 1536 floats). Similar concepts sit close together in vector space, measured via Cosine Similarity!';
        codeSnippet = '// Cosine Similarity formula:\n// similarity = (A · B) / (||A|| * ||B||)\n// 1.0 = identical meaning, 0.0 = unrelated';
      } else {
        aiReply = `Great question! In our NextGen LMS curriculum, understanding "${query}" is a core concept. Let me break it down step-by-step for you: \n\n1. Always start from fundamental principles.\n2. Practice hands-on with our interactive code sandbox.\n3. Ask me anytime if you encounter a bug or syntax issue!`;
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReply,
        codeSnippet: codeSnippet,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 px-4 py-3.5 rounded-full bg-[#0f3d1a] hover:bg-[#1a6b2e] text-white shadow-2xl border-2 border-[#a8c97a]/40 transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Open JARVIS AI Chatbot"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-[#a8c97a] flex items-center justify-center text-white shadow-inner">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0f3d1a] animate-pulse" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-black leading-tight flex items-center gap-1">
              <span>JARVIS AI</span>
              <Sparkles className="w-3 h-3 text-[#a8c97a]" />
            </p>
            <span className="text-[10px] text-[#c8e6c9]/80 font-bold">24/7 AI Master Tutor</span>
          </div>
        </button>
      )}

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col bg-white shadow-2xl border-2 border-[#1a6b2e]/30 rounded-3xl overflow-hidden ${
            isExpanded
              ? 'inset-4 sm:inset-10 sm:max-w-4xl sm:mx-auto'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[95vw] sm:w-[420px] h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Top Header */}
          <div className="p-4 bg-gradient-to-r from-[#0f3d1a] via-[#1a6b2e] to-[#2d6a4f] text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white shadow-md">
                  <Bot className="w-6 h-6 text-[#c8e6c9]" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0f3d1a] animate-ping" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-white leading-tight">JARVIS AI Master Tutor</h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#c8e6c9]/20 border border-[#c8e6c9]/30 text-[9px] font-black text-[#c8e6c9]">
                    Neural 4.0
                  </span>
                </div>
                <p className="text-[10px] text-[#c8e6c9]/80 font-semibold">Instant Code & Concept Guidance</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`p-2 rounded-xl text-xs transition-colors ${
                  voiceEnabled ? 'bg-emerald-500/30 text-emerald-300' : 'text-white/60 hover:bg-white/10'
                }`}
                title={voiceEnabled ? 'Voice Mode Active' : 'Enable Voice'}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-xl text-white/60 hover:bg-white/10 text-xs transition-colors hidden sm:block"
                title={isExpanded ? 'Minimize' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setMessages(INITIAL_MESSAGES)}
                className="p-2 rounded-xl text-white/60 hover:bg-white/10 text-xs transition-colors"
                title="Clear Chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-white hover:bg-white/20 transition-colors ml-1"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#f8faf8]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-[#0f3d1a] text-white'
                      : 'bg-emerald-100 text-[#0f3d1a] border border-[#1a6b2e]/20'
                  }`}
                >
                  {msg.sender === 'user' ? (user?.name?.charAt(0).toUpperCase() || 'U') : '🤖'}
                </div>

                <div
                  className={`max-w-[82%] rounded-2xl p-3.5 text-xs shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-[#0f3d1a] text-white rounded-tr-none'
                      : 'bg-white text-[#0f3d1a] border border-[#1a6b2e]/15 rounded-tl-none font-medium'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                  {msg.codeSnippet && (
                    <div className="mt-2.5 rounded-xl bg-gray-900 text-emerald-400 p-3 font-mono text-[11px] relative overflow-x-auto">
                      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-gray-700 text-[10px] text-gray-400">
                        <span className="flex items-center gap-1 font-bold text-gray-300">
                          <Code2 className="w-3 h-3" /> Code Example
                        </span>
                        <button
                          onClick={() => handleCopy(msg.codeSnippet!, msg.id)}
                          className="flex items-center gap-1 text-gray-300 hover:text-white px-2 py-0.5 rounded bg-gray-800"
                        >
                          {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <code>{msg.codeSnippet}</code>
                    </div>
                  )}

                  <span className={`block text-[9px] mt-1.5 ${msg.sender === 'user' ? 'text-[#c8e6c9]/70 text-right' : 'text-gray-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs font-bold text-[#1a6b2e] bg-white p-3 rounded-2xl w-fit border border-[#1a6b2e]/15 shadow-sm">
                <Bot className="w-4 h-4 animate-spin text-[#0f3d1a]" />
                <span>JARVIS is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Strip */}
          <div className="p-2.5 bg-white border-t border-[#1a6b2e]/10 overflow-x-auto flex gap-2 no-scrollbar">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                onClick={() => handleSendMessage(s.query)}
                className="px-3 py-1.5 rounded-xl bg-[#c8e6c9]/30 hover:bg-[#c8e6c9]/70 border border-[#1a6b2e]/20 text-[10px] font-black text-[#0f3d1a] whitespace-nowrap transition-colors flex items-center gap-1 shrink-0"
              >
                <Lightbulb className="w-3 h-3 text-[#1a6b2e]" />
                <span>{s.label}</span>
              </button>
            ))}
          </div>

          {/* Bottom Input Area */}
          <div className="p-3 bg-white border-t border-[#1a6b2e]/15">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 bg-[#c8e6c9]/20 p-1.5 rounded-2xl border border-[#1a6b2e]/20 focus-within:border-[#1a6b2e] focus-within:ring-2 focus-within:ring-[#1a6b2e]/20 transition-all"
            >
              <input
                type="text"
                placeholder="Ask JARVIS anything (concept, bug, exam)..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-transparent px-3 py-2 text-xs text-[#0f3d1a] font-semibold focus:outline-none placeholder:text-[#1a6b2e]/50"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="p-2.5 rounded-xl bg-[#0f3d1a] hover:bg-[#1a6b2e] text-white disabled:opacity-40 transition-all shadow-md active:scale-95 shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
