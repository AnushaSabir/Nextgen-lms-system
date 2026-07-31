'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, Send, ArrowRight, HelpCircle, ChevronDown, CheckCircle, BadgeQuestionMark } from 'lucide-react';

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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const categories: FAQCategory[] = [
    {
      id: 'general',
      name: 'General FAQ',
      questions: [
        { q: 'What is NextGen-LMS LMS?', a: 'NextGen-LMS LMS is Pakistan\'s first skill-to-earn platform. It provides high-quality practical training directly connected to a live freelance marketplace, allowing you to learn from verified experts, complete assessments, and start earning immediately.' },
        { q: 'Is NextGen-LMS LMS free to join?', a: 'Yes, it is completely free to create an account on NextGen-LMS. You only pay for individual premium courses you choose to enroll in, or if you are part of a subscribed partner institution, your access is covered by your school, college, or university.' },
        { q: 'Are the certificates verified?', a: 'Absolutely. Every certificate is backed by your actual test scores and trainer reviews, and automatically appears as a verified badge on your live NextGen-LMS freelance marketplace profile, making you instantly credible to global clients.' },
        { q: 'How is NextGen-LMS different from other platforms?', a: 'Unlike other online platforms that just offer video lectures, NextGen-LMS LMS features a progressive module unlocking system, manual grading of practical assignments by expert trainers, and a direct pipeline to active client contracts on the freelance marketplace.' }
      ]
    },
    {
      id: 'learners',
      name: 'For Learners FAQ',
      questions: [
        { q: 'Who can join NextGen-LMS LMS?', a: 'Anyone can join — school students, college students, university students, and individual self-taught learners. NextGen-LMS LMS is open to all who want to build high-paying digital skills.' },
        { q: 'Do I need to pay to enroll in a course?', a: 'Individual learners pay per course. Institutional students (school, college, university) are enrolled by their institution under a subscription plan and do not need to pay individually.' },
        { q: 'What happens if I fail a test?', a: 'If you fail, you must re-watch the video before attempting the test again. Your next attempt will feature a completely different set of questions — not the same test repeated.' },
        { q: 'Can I skip a video and go to the next one?', a: 'No. NextGen-LMS LMS uses a progressive unlocking system. You must pass the assessment for each video before the next one becomes available.' },
        { q: 'What do I get after completing a course?', a: 'You receive an official NextGen-LMS LMS Certificate and a verified badge on your marketplace profile. You can then immediately start freelancing on NextGen-LMS.' },
      ]
    },
    {
      id: 'trainers',
      name: 'For Trainers FAQ',
      questions: [
        { q: 'Who can become a trainer?', a: 'Both individual professionals and training institutes can apply. You must submit your portfolio, experience, and reason for joining. The NextGen-LMS team will review your application.' },
        { q: 'What video quality is required for my course?', a: 'All course videos must be HD quality, recorded using professional equipment (DSLR or iPhone), in a clean professional environment, with clear audio.' },
        { q: 'How do I get paid?', a: 'Trainers receive 70% of all revenue generated from their courses. NextGen-LMS retains 30% for platform operations.' },
        { q: 'Can I teach at more than one level?', a: 'Yes. If you are qualified to teach at multiple levels (school, college, university), you can create courses for each level.' },
      ]
    },
    {
      id: 'institutions',
      name: 'For Institutions FAQ',
      questions: [
        { q: 'How does the institutional subscription work?', a: 'Your institution pays a monthly per-student fee based on your student level. NextGen-LMS provides a dedicated portal where you assign courses, manage students, and receive progress reports.' },
        { q: 'Can I get a discount for a longer commitment?', a: 'Yes. NextGen-LMS offers significant discounts for 6-month (25% off) and 1-year (40% off) packages. These packages are available directly from your institutional dashboard.' },
        { q: 'How are progress reports delivered?', a: 'Trainers generate reports directly in the system with one click. Reports are automatically branded with the NextGen-LMS logo and your institution\'s logo, then delivered to your portal inbox and email.' },
        { q: 'Can parents see their child\'s progress?', a: 'Yes. The institution head can forward reports to parents after reviewing them.' },
      ]
    }
  ];

  const currentCategory = categories.find(c => c.id === activeTab) || categories[0];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setOpenIndex(null); // Close open answers when changing tabs
  };

  return (
    <div className="pt-24 md:pt-40 pb-20 px-4 sm:px-6 bg-[#c8e6c9] min-h-screen">
      <div className="container mx-auto max-w-5xl">
        
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-24 space-y-4 md:space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primaryBlue/20 bg-primaryBlue/10 text-primaryBlue text-xs font-black uppercase tracking-widest shadow-sm">
            <HelpCircle className="w-3.5 h-3.5 animate-bounce" /> Support Center
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0f3d1a] leading-tight tracking-tight text-3d">
            Got <span className="text-primaryBlue text-3d-orange">Questions?</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-[#1a6b2e] font-medium max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about NextGen-LMS LMS. Explore answers sorted by categories.
          </p>
        </div>

        {/* Categories Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-12 p-2 rounded-2xl sm:rounded-3xl glass-card border border-lightBorder max-w-3xl mx-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleTabChange(category.id)}
              className={`px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-300 ${
                activeTab === category.id
                  ? 'bg-primaryBlue text-[#0f3d1a] shadow-lg shadow-primaryBlue/25 scale-[1.02]'
                  : 'text-mediumGrayTitle hover:text-[#0f3d1a] hover:bg-[#1a6b2e]/5'
              }`}
            >
              {category.name.replace(' FAQ', '')}
            </button>
          ))}
        </div>

        {/* Dynamic Accordion list */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {currentCategory.questions.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`theme-card p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border transition-all duration-500 relative overflow-hidden group ${
                  isOpen 
                    ? 'border-primaryBlue/40 bg-cardBgActive/20 shadow-[0_15px_30px_rgba(240,89,31,0.06)]' 
                    : 'border-lightBorder hover:border-orangeBorderActive/30 hover:bg-cardBgActive/10'
                }`}
              >
                {/* Visual hover splash */}
                <div className="absolute inset-0 bg-gradient-to-br from-primaryBlue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <button
                  onClick={() => handleToggle(index)}
                  className="w-full flex items-center justify-between text-left focus:outline-none"
                >
                  <div className="flex items-center gap-4 sm:gap-6 pr-4">
                    <span className={`w-8 h-8 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isOpen 
                        ? 'bg-primaryBlue text-[#0f3d1a] rotate-[360deg] shadow-md shadow-primaryBlue/25' 
                        : 'bg-[#1a6b2e]/5 text-primaryBlue group-hover:bg-primaryBlue/10'
                    }`}>
                      <BadgeQuestionMark className="w-4 h-4" />
                    </span>
                    <h3 className={`text-base sm:text-lg md:text-xl font-bold transition-colors duration-300 pr-2 ${
                      isOpen ? 'text-primaryBlue' : 'text-[#0f3d1a] group-hover:text-primaryBlue'
                    }`}>
                      {item.q}
                    </h3>
                  </div>
                  <ChevronDown className={`w-5 h-5 sm:w-6 sm:h-6 text-mediumGrayTitle group-hover:text-[#0f3d1a] transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-primaryBlue' : ''
                  }`} />
                </button>

                {/* Expanded smooth accordion content */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100 mt-4 sm:mt-6' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pl-4 sm:pl-12 border-l border-primaryBlue/20 py-2">
                      <p className="text-sm sm:text-base text-bodyGrayText leading-relaxed font-medium">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 sm:mt-24 md:mt-32 p-5 sm:p-12 md:p-20 rounded-2xl sm:rounded-[3.5rem] bg-cardBg border border-lightBorder text-center space-y-8 sm:space-y-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 secondary-glow opacity-10" />
          </div>
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0f3d1a] tracking-tight text-3d">
              Still have <span className="text-primaryBlue text-3d-orange">Questions?</span>
            </h2>
            <p className="text-sm sm:text-base text-[#1a6b2e] font-semibold">We're here to help you get started on your journey.</p>
          </div>
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-center gap-5 sm:gap-8 md:gap-16 lg:gap-24">
            <div className="flex items-center gap-4 sm:gap-6 text-left w-full md:w-auto justify-start">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-[1.5rem] bg-primaryBlue/10 border border-primaryBlue/20 flex items-center justify-center text-primaryBlue">
                <Mail className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div>
                <div className="text-[10px] text-darkGrayNumber font-black uppercase tracking-widest mb-0.5 sm:mb-1">Email Us</div>
                <a href="mailto:info@nextgen-lms.co" className="text-base sm:text-xl font-black text-[#0f3d1a] hover:text-primaryBlue transition-colors break-all">info@nextgen-lms.co</a>
              </div>
            </div>
            <div className="flex items-center gap-4 sm:gap-6 text-left w-full md:w-auto justify-start">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-[1.5rem] bg-primaryBlue/10 border border-primaryBlue/20 flex items-center justify-center text-primaryBlue">
                <Phone className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div>
                <div className="text-[10px] text-darkGrayNumber font-black uppercase tracking-widest mb-0.5 sm:mb-1">Call Us</div>
                <a href="tel:+923411228760" className="text-base sm:text-xl font-black text-[#0f3d1a] hover:text-primaryBlue transition-colors">+92 341 1228760</a>
              </div>
            </div>
          </div>
          <div className="pt-6 sm:pt-10">
            <Link
              href="/contact"
              className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 bg-primaryBlue hover:bg-opacity-90 text-[#0f3d1a] font-black text-sm sm:text-base rounded-xl shadow-lg shadow-primaryBlue/20 transition-all hover:scale-105 active:scale-95"
            >
              <span>Send a Message</span>
              <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
