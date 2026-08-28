'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  GraduationCap,
  Building2,
  User,
  CheckCircle2,
  Award,
  Sparkles,
  Zap,
  ArrowRight,
  Code,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react';

export default function ForLearnersPage() {
  const pathways = [
    {
      title: 'Foundational Tech Explorers',
      level: 'Beginner Friendly',
      desc: 'Step-by-step introductions to programming logic, frontend fundamentals, and design principles with zero jargon.',
      icon: <BookOpen className="w-8 h-8 text-[#50BED9]" />,
    },
    {
      title: 'College & University Students',
      level: 'Intermediate Accelerator',
      desc: 'Applied full-stack development, cloud deployment, and machine learning curricula to complement academic degrees with real industry skills.',
      icon: <GraduationCap className="w-8 h-8 text-[#33C6B6]" />,
    },
    {
      title: 'Career Switchers & Professionals',
      level: 'Advanced Mastery',
      desc: 'Deep-dive into Generative AI architecture, DevOps automation, and scalable backend design for engineers leveling up to senior roles.',
      icon: <Building2 className="w-8 h-8 text-[#159BD7]" />,
    },
    {
      title: 'Independent Lifelong Learners',
      level: 'Flexible & Self-Paced',
      desc: 'Learn on your schedule with lifetime access, interactive quizzes, community Discord channels, and verified credentials.',
      icon: <User className="w-8 h-8 text-[#50BED9]" />,
    },
  ];

  const benefits = [
    'Interactive video lectures designed by verified principal architects',
    'Real-time adaptive AI quizzes to test your understanding after every lesson',
    'Production-grade capstone projects for your GitHub portfolio and resume',
    'Direct access to instructor Q&A channels and weekly cohort live rooms',
    'Verified digital certificates with instant LinkedIn one-click addition',
    'Full lifetime access to course materials, source code, and community updates',
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
            <span>Built for Modern Learners</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Supercharge Your Skills, <br />
            <span className="bg-gradient-to-r from-[#50BED9] via-[#159BD7] to-[#33C6B6] bg-clip-text text-transparent">
              Build Your Tech Career
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#D0D3D6] max-w-2xl mx-auto font-medium leading-relaxed">
            Gain mastery in modern software engineering, AI, and design through structured project-based learning and direct instructor mentorship.
          </p>

          <div className="flex justify-center pt-2">
            <Link
              href="/courses"
              className="px-8 py-4 bg-[#50BED9] hover:bg-[#159BD7] text-[#101010] hover:text-white font-black text-base rounded-2xl shadow-xl transition-all flex items-center gap-2"
            >
              <span>Explore Course Pathways</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* 4 Pathway Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pathways.map((p, idx) => (
            <div
              key={idx}
              className="bg-[#101010] border border-[#353638] hover:border-[#50BED9]/50 rounded-3xl p-8 sm:p-10 space-y-5 shadow-xl hover:-translate-y-1.5 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-[#151515] border border-[#353638] shadow-md">
                  {p.icon}
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#353638] text-[#50BED9]">
                  {p.level}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white group-hover:text-[#50BED9] transition-colors">
                  {p.title}
                </h3>
                <p className="text-sm text-[#D0D3D6] leading-relaxed">
                  {p.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-[#353638]/60 flex items-center text-xs font-bold text-[#33C6B6] gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified NextGen Curriculum Track</span>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Checklist */}
        <div className="bg-[#101010] border border-[#50BED9]/30 rounded-[2.5rem] p-8 sm:p-14 shadow-2xl space-y-8">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#353638] text-[#33C6B6] text-xs font-black uppercase">
              <Zap className="w-4 h-4" /> The NextGen Advantage
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">Why Learn on NextGen LMS?</h2>
            <p className="text-sm text-[#D0D3D6]">Designed from the ground up to turn abstract theory into tangible career-defining capabilities.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((b, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-[#151515] border border-[#353638]">
                <CheckCircle2 className="w-5 h-5 text-[#33C6B6] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-semibold text-[#D0D3D6]">{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center bg-gradient-to-r from-[#151515] via-[#101010] to-[#151515] border border-[#50BED9]/30 rounded-[2.5rem] p-10 sm:p-16 space-y-6 shadow-2xl">
          <h2 className="text-3xl sm:text-5xl font-black text-white">Your Tech Career Starts Here</h2>
          <p className="text-sm sm:text-base text-[#D0D3D6] max-w-xl mx-auto">
            Join thousands of active students and professionals mastering modern skills with NextGen LMS.
          </p>
          <Link
            href="/login?mode=signup"
            className="inline-flex items-center gap-2 px-10 py-4 bg-[#50BED9] hover:bg-[#159BD7] text-[#101010] hover:text-white font-black text-base rounded-2xl shadow-xl transition-all"
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
