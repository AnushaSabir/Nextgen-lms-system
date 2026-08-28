'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, Send, ArrowRight, HelpCircle, ChevronDown, CheckCircle2, Sparkles, MessageSquare } from 'lucide-react';

type FAQItem = {
  q: string;
  a: string;
};

type FAQCategory = {
  id: string;
  name: string;
  questions: FAQItem[];
};

export default function FAQPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories: FAQCategory[] = [
    {
      id: 'general',
      name: 'General FAQ',
      questions: [
        {
          q: 'What makes NextGen LMS different from other platforms?',
          a: 'NextGen LMS combines AI-powered adaptive assessments, real-world sandbox project evaluations, and direct instructor mentorship with tamper-proof blockchain-verified certifications.',
        },
        {
          q: 'Is NextGen LMS free to get started?',
          a: 'Yes! You can create a free learner account to explore course previews, participate in community discussions, and take introductory skill evaluations.',
        },
        {
          q: 'Are NextGen certificates recognized by employers?',
          a: 'Yes. Every certificate has a verifiable QR code and cryptographic ledger ID that allows recruiters and engineering managers to instantly verify your test scores, project repos, and coursework.',
        },
        {
          q: 'Can I access courses on mobile devices?',
          a: 'NextGen LMS is fully responsive and optimized for mobile, tablet, and desktop browsers with offline progress synchronization.',
        },
      ],
    },
    {
      id: 'learners',
      name: 'For Learners',
      questions: [
        {
          q: 'How does the adaptive AI quiz engine work?',
          a: 'After each module, our AI evaluates your conceptual grasp. If you excel, you receive advanced problem scenarios; if you need reinforcement, the system provides targeted review explanations.',
        },
        {
          q: 'What if I need help during a course?',
          a: 'Every course includes a dedicated Q&A discussion tab where course instructors and teaching assistants answer student questions daily.',
        },
        {
          q: 'Do course purchases include lifetime access?',
          a: 'Yes, once enrolled in a course, you receive lifetime access to all lectures, downloadable codebases, and future curriculum updates.',
        },
      ],
    },
    {
      id: 'institutions',
      name: 'For Institutions',
      questions: [
        {
          q: 'Can universities deploy NextGen LMS campus-wide?',
          a: 'Yes. We provide enterprise campus deployments with single sign-on (SSO/SAML), bulk student onboarding via CSV/SIS, and custom departmental admin portals.',
        },
        {
          q: 'Can faculty host private university-only courses?',
          a: 'Yes. Universities can create restricted internal modules accessible only to enrolled students, alongside access to our public catalog.',
        },
      ],
    },
  ];

  const currentCategory = categories.find((c) => c.id === activeTab) || categories[0];

  return (
    <div className="min-h-screen bg-[#323232] text-white pt-24 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-[#50BED9]/[0.08] via-[#159BD7]/[0.04] to-transparent rounded-full blur-[140px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#50BED9]/30 bg-[#151515] text-[#50BED9] text-xs font-black uppercase tracking-widest shadow-md">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Everything You Need <br />
            <span className="bg-gradient-to-r from-[#50BED9] via-[#159BD7] to-[#33C6B6] bg-clip-text text-transparent">
              to Know
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#D0D3D6] max-w-2xl mx-auto font-medium leading-relaxed">
            Find answers to common questions about courses, certifications, trainer applications, and enterprise university portals.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveTab(cat.id);
                setOpenIndex(0);
              }}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
                activeTab === cat.id
                  ? 'bg-[#50BED9] text-[#101010] shadow-[0_4px_16px_rgba(80,190,217,0.35)] scale-105'
                  : 'bg-[#151515] text-[#D0D3D6] hover:text-white hover:bg-[#353638] border border-[#353638]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {currentCategory.questions.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl sm:rounded-3xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-[#101010] border-[#50BED9]/50 shadow-xl'
                    : 'bg-[#101010]/80 border-[#353638] hover:border-[#50BED9]/30'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-white"
                >
                  <span className={isOpen ? 'text-[#50BED9]' : 'text-white'}>{item.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#50BED9] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-[#D0D3D6] leading-relaxed border-t border-[#353638]/50 animate-fadeIn">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        <div className="bg-[#101010] border border-[#50BED9]/30 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xl">
          <MessageSquare className="w-10 h-10 text-[#50BED9] mx-auto" />
          <h3 className="text-2xl font-black text-white">Still have questions?</h3>
          <p className="text-sm text-[#D0D3D6] max-w-md mx-auto">
            Our advisory and technical support team is available 24/7 to assist you.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#50BED9] hover:bg-[#159BD7] text-[#101010] hover:text-white font-black text-sm rounded-xl transition-all shadow-lg"
            >
              <span>Contact Support</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
