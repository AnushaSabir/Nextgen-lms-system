'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { HelpCircle, ChevronDown } from 'lucide-react';

const FAQ_CATEGORIES = [
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

export default function FaqSection() {
  const [activeFaqTab, setActiveFaqTab] = useState('general');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const currentFaqCategory = FAQ_CATEGORIES.find(c => c.id === activeFaqTab) || FAQ_CATEGORIES[0];

  const handleFaqToggle = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleFaqTabChange = (tabId: string) => {
    setActiveFaqTab(tabId);
    setOpenFaqIndex(null);
  };

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#c8e6c9] relative overflow-hidden">
      <Image src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80" alt="FAQ Background" fill className="absolute inset-0 w-full h-full object-cover opacity-[0.05] pointer-events-none" sizes="100vw" />
      <div className="absolute inset-0 bg-[#c8e6c9]/95 z-0 pointer-events-none" />

      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="text-center mb-10 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primaryBlue/20 bg-primaryBlue/10 text-primaryBlue text-xs font-black uppercase tracking-widest shadow-sm">
            <HelpCircle className="w-3.5 h-3.5 animate-bounce" /> Support Center
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0f3d1a] tracking-tight text-3d">
            Got <span className="text-primaryBlue text-3d-orange">Questions?</span>
          </h2>
          <p className="text-base sm:text-lg text-[#1a6b2e] font-medium max-w-xl mx-auto">
            Everything you need to know about NextGen-LMS LMS. Explore answers sorted by categories.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-12 p-2 rounded-2xl sm:rounded-3xl glass-card border border-lightBorder max-w-3xl mx-auto backdrop-blur-xl">
          {FAQ_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => handleFaqTabChange(category.id)}
              className={`px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-300 ${activeFaqTab === category.id
                ? 'bg-primaryBlue text-[#0f3d1a] shadow-lg shadow-primaryBlue/25 scale-[1.02]'
                : 'text-mediumGrayTitle hover:text-[#0f3d1a] hover:bg-[#1a6b2e]/5'
                }`}
            >
              {category.name.replace(' FAQ', '')}
            </button>
          ))}
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          {currentFaqCategory.questions.map((item, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className={`theme-card p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border transition-all duration-500 relative overflow-hidden group backdrop-blur-xl ${isOpen
                  ? 'border-primaryBlue/40 bg-cardBgActive/20 shadow-[0_15px_30px_rgba(240,89,31,0.06)]'
                  : 'border-lightBorder hover:border-orangeBorderActive/30 hover:bg-cardBgActive/10'
                  }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primaryBlue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <button
                  onClick={() => handleFaqToggle(index)}
                  className="w-full flex items-center justify-between text-left focus:outline-none relative z-10"
                >
                  <div className="flex items-center gap-4 sm:gap-6 pr-4">
                    <span className={`w-8 h-8 rounded-lg sm:rounded-xl flex items-center justify-center text-sm flex-shrink-0 transition-all duration-300 ${isOpen
                      ? 'bg-primaryBlue text-[#0f3d1a] rotate-[360deg] shadow-md shadow-primaryBlue/25'
                      : 'bg-[#1a6b2e]/5 text-primaryBlue group-hover:bg-primaryBlue/10'
                      }`}>
                      <HelpCircle className="w-4 h-4" />
                    </span>
                    <h3 className={`text-base sm:text-lg md:text-xl font-bold transition-colors duration-300 pr-2 ${isOpen ? 'text-primaryBlue' : 'text-[#0f3d1a] group-hover:text-primaryBlue'
                      }`}>
                      {item.q}
                    </h3>
                  </div>
                  <ChevronDown className={`w-5 h-5 sm:w-6 sm:h-6 text-mediumGrayTitle group-hover:text-[#0f3d1a] transition-transform duration-300 ${isOpen ? 'rotate-180 text-primaryBlue' : ''
                    }`} />
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-4 sm:mt-6' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                    }`}
                >
                  <div className="overflow-hidden">
                    <div className="pl-4 sm:pl-14 border-l-2 border-primaryBlue/20 py-2 ml-1">
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
      </div>
    </section>
  );
}
