'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Search,
  BookOpen,
  Zap,
  CheckCircle2,
  Award,
  ArrowRight,
  Code,
  Users,
  ShieldCheck,
  PlayCircle,
  FileCheck,
} from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Choose Your Career Track',
      desc: 'Browse curated learning pathways across Full-Stack Web, Generative AI, Cloud Infrastructure, UI/UX Design, or Cybersecurity tailored to your experience level.',
      icon: <Search className="w-6 h-6 text-[#50BED9]" />,
    },
    {
      num: '02',
      title: 'Interactive HD Video & Code Sandboxes',
      desc: 'Watch high-definition lectures by verified industry architects with embedded code sandboxes, downloadable cheat sheets, and practical exercises.',
      icon: <PlayCircle className="w-6 h-6 text-[#33C6B6]" />,
    },
    {
      num: '03',
      title: 'Adaptive AI Knowledge Checkpoints',
      desc: 'Reinforce your understanding after each module with adaptive quizzes that dynamically adjust question difficulty based on your performance.',
      icon: <Zap className="w-6 h-6 text-[#159BD7]" />,
    },
    {
      num: '04',
      title: 'Build Production Capstone Projects',
      desc: 'Apply your knowledge by building realistic, portfolio-ready applications rather than simple toy exercises.',
      icon: <Code className="w-6 h-6 text-[#50BED9]" />,
    },
    {
      num: '05',
      title: 'Direct Instructor & Peer Code Reviews',
      desc: 'Submit your repository for detailed line-by-line feedback from expert trainers and participate in cohort discussion channels.',
      icon: <Users className="w-6 h-6 text-[#33C6B6]" />,
    },
    {
      num: '06',
      title: 'Claim Verified Digital Credential',
      desc: 'Earn a cryptographically verified certificate with instant LinkedIn sync and employer verification to boost your hiring outcomes.',
      icon: <Award className="w-6 h-6 text-[#159BD7]" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#323232] text-white pt-24 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-[#50BED9]/[0.08] via-[#159BD7]/[0.04] to-transparent rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-20">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#50BED9]/30 bg-[#151515] text-[#50BED9] text-xs font-black uppercase tracking-widest shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Structured Learning Process</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.15]">
            How NextGen LMS <br />
            <span className="bg-gradient-to-r from-[#50BED9] via-[#159BD7] to-[#33C6B6] bg-clip-text text-transparent">
              Transforms Your Skills
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#D0D3D6] max-w-2xl mx-auto font-medium leading-relaxed">
            A progressive, mastery-based system designed to guide you from foundational theory to production-ready enterprise execution.
          </p>

          <div className="flex justify-center pt-2">
            <Link
              href="/courses"
              className="px-8 py-4 bg-[#50BED9] hover:bg-[#159BD7] text-[#101010] hover:text-white font-black text-base rounded-2xl shadow-xl transition-all flex items-center gap-2"
            >
              <span>Explore All Courses</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* 6 Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-[#101010] border border-[#353638] hover:border-[#50BED9]/50 rounded-3xl p-8 flex flex-col justify-between space-y-6 shadow-xl hover:-translate-y-1.5 transition-all duration-300 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#151515] border border-[#353638] flex items-center justify-center shadow-md">
                    {step.icon}
                  </div>
                  <span className="text-2xl font-black text-[#50BED9]/30 group-hover:text-[#50BED9] transition-colors">
                    {step.num}
                  </span>
                </div>

                <h3 className="text-xl font-black text-white group-hover:text-[#50BED9] transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#D0D3D6] leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-[#33C6B6] pt-2 border-t border-[#353638]/60">
                <CheckCircle2 className="w-4 h-4" />
                <span>NextGen Milestone Step</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="bg-[#101010] border border-[#50BED9]/30 rounded-[2.5rem] p-10 sm:p-16 text-center space-y-6 shadow-2xl">
          <h2 className="text-3xl sm:text-5xl font-black text-white">Ready to Start Step 1?</h2>
          <p className="text-sm sm:text-base text-[#D0D3D6] max-w-xl mx-auto">
            Create your free learner account today and explore top-rated courses across software, AI, and design.
          </p>
          <div className="flex justify-center pt-2">
            <Link
              href="/login?mode=signup"
              className="px-10 py-4 bg-[#50BED9] hover:bg-[#159BD7] text-[#101010] hover:text-white font-black text-base rounded-2xl shadow-xl transition-all"
            >
              Get Started for Free
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
