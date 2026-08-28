'use client';

import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Briefcase,
  Users2,
  Trophy,
  ArrowRight,
  Target,
  Rocket,
  Globe2,
  Sparkles,
  ShieldCheck,
  Zap,
  Bot,
  Layers,
} from 'lucide-react';

export default function AboutPage() {
  const pillars = [
    {
      title: 'AI-Native Learning Design',
      desc: 'Adaptive learning engines that assess each student’s knowledge gaps in real-time, tailoring assignments and video recommendations dynamically.',
      icon: <Bot className="w-8 h-8 text-[#50BED9]" />,
    },
    {
      title: 'Real-World Sandbox Engineering',
      desc: 'Learn through production codebases, real architectural problems, and practical capstones reviewed by principal industry engineers.',
      icon: <Layers className="w-8 h-8 text-[#33C6B6]" />,
    },
    {
      title: 'Institutional Grade Security',
      desc: 'Enterprise-ready infrastructure featuring SOC2 compliant data integrity, role-based controls, and cryptographically verified credentials.',
      icon: <ShieldCheck className="w-8 h-8 text-[#159BD7]" />,
    },
    {
      title: 'Global Career Acceleration',
      desc: 'A direct bridge between ambitious learners and top global technology companies seeking verified high-impact talent.',
      icon: <Rocket className="w-8 h-8 text-[#50BED9]" />,
    },
  ];

  const milestones = [
    { num: '50k+', label: 'Active Global Learners' },
    { num: '500+', label: 'Curated Tech Pathways' },
    { num: '120+', label: 'University & Enterprise Partners' },
    { num: '94.8%', label: 'Verified Career Placement Rate' },
  ];

  return (
    <div className="min-h-screen bg-[#323232] text-white pt-24 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-[#50BED9]/[0.08] via-[#159BD7]/[0.04] to-transparent rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-20">
        
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#50BED9]/30 bg-[#151515] text-[#50BED9] text-xs font-black uppercase tracking-widest shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>About NextGen LMS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.12]">
            Architecting the Future of <br />
            <span className="bg-gradient-to-r from-[#50BED9] via-[#159BD7] to-[#33C6B6] bg-clip-text text-transparent">
              Intelligent Learning
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#D0D3D6] max-w-2xl mx-auto font-medium leading-relaxed">
            NextGen LMS was created with a clear mission: to replace outdated, passive online video playlists with an interactive, AI-driven education ecosystem that prepares individuals for real high-impact tech careers.
          </p>
        </div>

        {/* Numbers Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {milestones.map((m, idx) => (
            <div key={idx} className="bg-[#101010] border border-[#353638] rounded-3xl p-6 text-center space-y-1 shadow-xl">
              <div className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-[#50BED9] to-[#33C6B6] bg-clip-text text-transparent">
                {m.num}
              </div>
              <p className="text-xs sm:text-sm text-[#D0D3D6] font-semibold">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#101010] border border-[#353638] hover:border-[#50BED9]/40 rounded-3xl p-8 sm:p-12 space-y-4 shadow-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#353638] text-[#50BED9] text-xs font-black uppercase">
              <Target className="w-4 h-4" /> Our Vision
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">Democratizing World-Class Tech Mastery</h3>
            <p className="text-sm text-[#D0D3D6] leading-relaxed">
              We envision a world where any motivated individual, regardless of geography or financial background, can access the same cutting-edge AI curricula, elite mentorship, and career opportunities as graduates of top global research universities.
            </p>
          </div>

          <div className="bg-[#101010] border border-[#353638] hover:border-[#33C6B6]/40 rounded-3xl p-8 sm:p-12 space-y-4 shadow-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#353638] text-[#33C6B6] text-xs font-black uppercase">
              <Rocket className="w-4 h-4" /> Our Mission
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">Applied, Verified, Outcome-Driven Education</h3>
            <p className="text-sm text-[#D0D3D6] leading-relaxed">
              To build software that empowers educators to teach more effectively with AI-assisted grading, enables institutions to manage student success seamlessly, and gives learners verified proof of their technical capabilities.
            </p>
          </div>
        </div>

        {/* 4 Pillars */}
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black text-white">Our Core Innovations</h2>
            <p className="text-sm text-[#D0D3D6]">The foundational principles that set NextGen LMS apart from traditional learning platforms.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {pillars.map((p, idx) => (
              <div key={idx} className="bg-[#101010] border border-[#353638] rounded-3xl p-8 space-y-4 shadow-xl flex items-start gap-5">
                <div className="p-3 rounded-2xl bg-[#151515] border border-[#353638] shrink-0 shadow-md">
                  {p.icon}
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-white">{p.title}</h4>
                  <p className="text-xs sm:text-sm text-[#D0D3D6] leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-[#101010] border border-[#50BED9]/30 rounded-[2.5rem] p-10 sm:p-16 text-center space-y-6 shadow-2xl">
          <h2 className="text-3xl sm:text-5xl font-black text-white">Be Part of the NextGen Movement</h2>
          <p className="text-sm sm:text-base text-[#D0D3D6] max-w-xl mx-auto">
            Whether you want to learn, teach, or deploy NextGen across your university campus, we welcome you to our global community.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/courses"
              className="w-full sm:w-auto px-8 py-4 bg-[#50BED9] hover:bg-[#159BD7] text-[#101010] hover:text-white font-black text-base rounded-2xl shadow-xl transition-all"
            >
              Explore Course Catalog
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 bg-[#151515] border border-[#353638] text-white font-bold text-base rounded-2xl hover:bg-[#353638] transition-all"
            >
              Contact Our Team
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
