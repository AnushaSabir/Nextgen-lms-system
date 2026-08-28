'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { HelpCircle, ChevronDown } from 'lucide-react';

const FAQ_CATEGORIES = [
  {
    id: 'general',
    name: 'General FAQ',
    questions: [
      { q: 'Is NextGen LMS suitable for beginners?', a: 'Yes. Our courses are designed for learners of all skill levels.' },
      { q: 'Can I learn on mobile?', a: 'Absolutely. The platform works seamlessly across desktop, tablet, and mobile devices.' },
      { q: 'Will I receive a certificate?', a: 'Yes. Certificates are awarded after successfully completing eligible courses.' },
      { q: 'Can instructors create their own courses?', a: 'Yes. Educators can easily build, manage, and publish their courses.' }
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
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#070b1a] relative overflow-hidden">
      <Image src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80" alt="FAQ Background" fill className="absolute inset-0 w-full h-full object-cover opacity-[0.05] pointer-events-none" sizes="100vw" />
      <div className="absolute inset-0 bg-[#070b1a]/95 z-0 pointer-events-none" />

      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="text-center mb-10 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primaryBlue/20 bg-primaryBlue/10 text-primaryBlue text-xs font-black uppercase tracking-widest shadow-sm">
            <HelpCircle className="w-3.5 h-3.5 animate-bounce" /> Support Center
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight text-3d">
            Got <span className="text-primaryBlue text-3d-orange">Questions?</span>
          </h2>
          <p className="text-base sm:text-lg text-[#50BED9] font-medium max-w-xl mx-auto">
            Everything you need to know about NextGen-LMS LMS. Explore answers sorted by categories.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-12 p-2 rounded-2xl sm:rounded-3xl glass-card border border-lightBorder max-w-3xl mx-auto backdrop-blur-xl">
          {FAQ_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => handleFaqTabChange(category.id)}
              className={`px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-300 ${activeFaqTab === category.id
                ? 'bg-primaryBlue text-white shadow-lg shadow-primaryBlue/25 scale-[1.02]'
                : 'text-mediumGrayTitle hover:text-white hover:bg-[#50BED9]/5'
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
                className={`bg-[#101010] p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border transition-all duration-500 relative overflow-hidden group backdrop-blur-xl ${isOpen
                  ? 'border-[#50BED9]/50 shadow-[0_15px_30px_rgba(80,190,217,0.15)]'
                  : 'border-[#353638] hover:border-[#50BED9]/30 hover:bg-[#151515]'
                  }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primaryBlue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <button
                  onClick={() => handleFaqToggle(index)}
                  className="w-full flex items-center justify-between text-left focus:outline-none relative z-10"
                >
                  <div className="flex items-center gap-4 sm:gap-6 pr-4">
                    <span className={`w-8 h-8 rounded-lg sm:rounded-xl flex items-center justify-center text-sm flex-shrink-0 transition-all duration-300 ${isOpen
                      ? 'bg-primaryBlue text-white rotate-[360deg] shadow-md shadow-primaryBlue/25'
                      : 'bg-[#50BED9]/5 text-primaryBlue group-hover:bg-primaryBlue/10'
                      }`}>
                      <HelpCircle className="w-4 h-4" />
                    </span>
                    <h3 className={`text-base sm:text-lg md:text-xl font-bold transition-colors duration-300 pr-2 ${isOpen ? 'text-primaryBlue' : 'text-white group-hover:text-primaryBlue'
                      }`}>
                      {item.q}
                    </h3>
                  </div>
                  <ChevronDown className={`w-5 h-5 sm:w-6 sm:h-6 text-mediumGrayTitle group-hover:text-white transition-transform duration-300 ${isOpen ? 'rotate-180 text-primaryBlue' : ''
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
