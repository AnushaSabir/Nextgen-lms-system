"use client";
import { useState } from "react";
import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  Star,
  Shield,
  HelpCircle,
  BadgeQuestionMark,
  Clock,
  DollarSign,
  Building2,
  UserCheck,
  Play,
  Pause,
  Award,
  User,
  Zap,
  TrendingUp,
  Users,
  Lightbulb,
  Rocket,
  School,
  BookOpen,
  GraduationCap,
  Target,
  Briefcase,
  Medal,
} from "lucide-react";

const pricing = [
  { level: "School Students", price: "200", desc: "Beginner-friendly content" },
  {
    level: "College Students",
    price: "300",
    desc: "Intermediate practical content",
  },
  {
    level: "University Students",
    price: "500",
    desc: "Advanced professional content",
  },
];

export default function PricingPage() {
  const [isPlaying, setIsPlaying] = React.useState(true);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  const togglePlayPause = () => {
    const newIsPlaying = !isPlaying;
    setIsPlaying(newIsPlaying);
    if (videoRef.current) {
      if (newIsPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  };

  const individualPlans = [
    {
      level: "Starter Course",
      price: "Flexible Access",
      desc: "Self-paced course access with practical milestones and verified badge outcomes.",
      icon: Lightbulb,
      features: [
        "Choose skill-based modules and pay only for the clear learning paths you follow",
        "Practical tasks reviewed by certified trainers",
        "Verified badge attached to learner profile on completion",
        "Freelance-ready portfolio exercises and practical case studies",
        "Active community support with peer collaboration",
      ],
      cta: "Browse Courses",
      href: "/courses",
      badge: "Flexible",
    },
    {
      level: "Premium Path",
      price: "Guided Certification",
      desc: "Trainer-backed growth track with live review, coaching, and career preparation.",
      icon: Medal,
      features: [
        "Priority access to new professional course modules",
        "One-on-one trainer feedback on projects and submissions",
        "Weekly live coaching sessions and milestone reviews",
        "Verified certification badge synced to the freelancer profile",
        "Dedicated portfolio support and freelance-ready preparation",
      ],
      cta: "Join Now",
      href: "/register",
      badge: "Recommended",
      popular: true,
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#c8e6c9] text-[#0f3d1a]">
      {/* ── HERO VIDEO BACKGROUND ── */}
      <div className="absolute top-0 inset-x-0 h-[500px] sm:h-[600px] pointer-events-none overflow-hidden z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          ref={(el) => {
            videoRef.current = el;
            if (el) {
              el.muted = true;
              el.defaultMuted = true;
              if (isPlaying) {
                el.play().catch(() => {});
              } else {
                el.pause();
              }
            }
          }}
          className="absolute inset-0 w-full h-full object-cover opacity-75 sm:opacity-85 z-10"
        >
          <source src="/videos/Flexible Pricing Plans.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/25 via-[#020617]/55 to-[#020617] z-20" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#020617]/60 via-transparent to-[#5E6F58]/15 mix-blend-screen opacity-60 z-20" />
        <div className="absolute top-0 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primaryBlue/10 blur-[100px] sm:blur-[150px] rounded-full z-20" />
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={togglePlayPause}
        className="absolute top-[400px] sm:top-[450px] right-4 sm:right-8 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md flex items-center justify-center text-[#0f3d1a] transition-all duration-300 hover:scale-125 hover:-translate-y-2 shadow-lg hover:shadow-[0_15px_30px_rgba(240,89,31,0.3)]"
        aria-label={isPlaying ? "Pause video" : "Play video"}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5" />
        ) : (
          <Play className="w-5 h-5 ml-1" />
        )}
      </button>

      <div className="pt-28 sm:pt-40 pb-20 px-4 sm:px-6 relative z-30">
        <div className="container mx-auto max-w-6xl">
          {/* Header Info */}
          <div className="text-center mb-16 sm:mb-24 space-y-4 sm:space-y-6 max-w-4xl mx-auto px-2 sm:px-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primaryBlue/20 bg-primaryBlue/10 text-primaryBlue text-xs font-bold uppercase tracking-widest shadow-sm hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-default">
              <Clock className="w-3.5 h-3.5" /> Affordable Excellence
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0f3d1a] leading-tight tracking-tight text-3d break-words">
              Flexible{" "}
              <span className="text-primaryBlue text-3d-orange">
                Pricing Plans
              </span>
            </h1>
            <p className="text-base sm:text-lg text-[#1a6b2e] font-medium max-w-xl mx-auto leading-relaxed break-words">
              Find the perfect plan to master digital skills and connect
              directly to high-paying freelance contracts.
            </p>
          </div>

          {/* Plan Guidance - PERFECT SYMMETRICAL LAYOUT */}
          <div className="mb-24 space-y-24">
            {/* Hero Section - Split Layout Redesigned */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-2 sm:px-4 items-stretch">
              {/* Left Card - Modern Interactive Hub */}
              <div className="relative group">
                {/* Animated gradient border */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primaryBlue/50 to-primaryBlue/10 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-700" />

                <div className="relative p-7 sm:p-8 rounded-[2.5rem] bg-gradient-to-br from-cardBg to-cardBg/95 border border-lightBorder shadow-2xl hover:-translate-y-4 hover:scale-[1.02] transition-all duration-500 h-full flex flex-col overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-primaryBlue/10 to-transparent rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-primaryBlue/5 to-transparent rounded-full blur-2xl" />

                  <div className="relative z-10 flex-1 flex flex-col">
                    {/* Badge with animation */}
                    <div className="relative inline-block w-fit mb-6">
                      <div className="absolute inset-0 bg-primaryBlue/20 rounded-full blur-md animate-pulse" />
                      <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primaryBlue/30 bg-gradient-to-r from-primaryBlue/20 to-primaryBlue/5 text-primaryBlue text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all duration-300 cursor-default">
                        <UserCheck className="w-3.5 h-3.5" /> Learner Pathways
                      </div>
                    </div>

                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0f3d1a] tracking-tight leading-tight mb-4">
                      A cleaner learning experience for{" "}
                      <span className="bg-gradient-to-r from-primaryBlue to-primaryBlue/70 bg-clip-text text-transparent">
                        learners, trainers, and institutions
                      </span>
                    </h2>

                    <p className="text-sm text-[#1a6b2e] font-medium leading-relaxed mb-8">
                      NextGen-LMS LMS is built for modern skill development:
                      flexible course access, trainer-led review, and verified
                      certificates that prepare learners for real freelance
                      work.
                    </p>

                    {/* Feature Grid - Modern Cards */}
                    <div className="grid grid-cols-1 gap-4 mb-8">
                      {[
                        {
                          title: "Flexible course access",
                          desc: "Choose the exact skill path you need, pay only for relevant modules, and learn at your own pace.",
                          icon: User,
                          color: "from-[#d94d19]/20 to-cyan-500/20",
                        },
                        {
                          title: "Trainer-led review",
                          desc: "Get structured task assessments, practical feedback, and certified trainer support for each milestone.",
                          icon: Rocket,
                          color: "from-[#d94d19]/20 to-red-500/20",
                        },
                        {
                          title: "Institution-ready scale",
                          desc: "Support schools, colleges, and universities with seat management, group onboarding, and shared reporting.",
                          icon: Users,
                          color: "from-purple-500/20 to-pink-500/20",
                        },
                      ].map((item, idx) => {
                        const IconComponent = item.icon;
                        return (
                          <div key={idx} className="group/item relative">
                            <div className="absolute inset-0 bg-gradient-to-r ${item.color} rounded-2xl blur opacity-0 group-hover/item:opacity-100 transition duration-500" />
                            <div className="relative flex gap-4 rounded-2xl bg-[#1a6b2e]/5 backdrop-blur-sm border border-[#1a6b2e]/20 p-4 hover:border-primaryBlue/40 transition-all duration-300 hover:-translate-y-1">
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primaryBlue/20 to-primaryBlue/5 text-primaryBlue border border-primaryBlue/30 group-hover/item:scale-110 group-hover/item:rotate-12 transition-all duration-300 flex-shrink-0">
                                <IconComponent className="w-6 h-6" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-sm font-bold text-[#0f3d1a] mb-1">
                                  {item.title}
                                </h3>
                                <p className="text-xs text-[#1a6b2e] leading-relaxed">
                                  {item.desc}
                                </p>
                              </div>
                              {/* Interactive arrow */}
                              <div className="opacity-0 group-hover/item:opacity-100 transition-all duration-300 transform translate-x-2 group-hover/item:translate-x-0">
                                <svg
                                  className="w-5 h-5 text-primaryBlue"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Modern Image Showcase */}
                  <div className="relative mt-4 rounded-2xl overflow-hidden border border-[#1a6b2e]/20">
  <div className="absolute inset-0 bg-gradient-to-t from-cardBg via-cardBg/50 to-transparent z-10" />
  <img
    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80"
    alt="Trainer mentoring student"
    className="w-full h-full object-cover transition-transform duration-700 aspect-[16/9]"
  />
  {/* Always visible overlay - no hover needed */}
  <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20">
    <h3 className="text-[#0f3d1a] font-bold text-xl tracking-tight">
      Record from Home & Office
    </h3>
    <p className="text-[#0f3d1a]/80 text-sm">
      Complete tutorial & receiving support
    </p>
  </div>
</div>
                  </div>
                </div>
              </div>

              {/* Right Card - Modern Feature Showcase */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-l from-primaryBlue/50 to-primaryBlue/10 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-700" />

                <div className="relative p-7 sm:p-8 rounded-[2.5rem] bg-gradient-to-br from-[#0b1223] to-[#0b1223]/90 border border-lightBorder shadow-2xl hover:-translate-y-4 hover:scale-[1.02] transition-all duration-500 h-full flex flex-col">
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 2px 2px, rgba(240,89,31,0.3) 1px, transparent 1px)",
                        backgroundSize: "30px 30px",
                      }}
                    />
                  </div>

                  <div className="relative z-10 flex-1 flex flex-col">
                    {/* Modern header with step indicator */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="relative">
                        <div className="text-primaryBlue text-[10px] font-black tracking-[0.2em] uppercase">
                          What makes NextGen-LMS different
                        </div>
                        <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-primaryBlue/50 rounded-full" />
                      </div>
                      <div className="text-4xl font-black text-primaryBlue/10">
                        02
                      </div>
                    </div>

                    {/* Interactive feature list */}
                    <div className="space-y-5 flex-1">
                      {[
                        {
                          title: "Clear outcome tracks",
                          desc: "Each pathway is aligned to skills, certification, and freelance readiness rather than vague plan labels.",
                          metric: "100%",
                        },
                        {
                          title: "Verified badge delivery",
                          desc: "Certificates and badges appear directly on learner profiles and are accepted by hiring partners.",
                          metric: "10k+",
                        },
                        {
                          title: "Practical trainer support",
                          desc: "Live coach review, project guidance, and community feedback keep learners moving forward.",
                          metric: "24/7",
                        },
                      ].map((item, idx) => (
                        <div key={idx} className="group/item relative">
                          <div className="flex gap-4 p-4 rounded-xl hover:bg-[#1a6b2e]/5 transition-all duration-300 hover:-translate-x-1">
                            <div className="relative">
                              <div className="absolute inset-0 bg-primaryBlue/20 rounded-2xl blur-md opacity-0 group-hover/item:opacity-100 transition-opacity" />
                              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 text-primaryBlue group-hover/item:scale-110 group-hover/item:rotate-6 transition-all duration-300">
                                <CheckCircle2 className="w-6 h-6" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="text-base font-bold text-[#0f3d1a]">
                                  {item.title}
                                </h3>
                                <span className="text-xs font-black text-primaryBlue/60">
                                  {item.metric}
                                </span>
                              </div>
                              <p className="text-sm text-[#1a6b2e] leading-relaxed">
                                {item.desc}
                              </p>
                              {/* Progress indicator */}
                              <div className="mt-2 h-0.5 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-primaryBlue to-primaryBlue/60 rounded-full w-0 group-hover/item:w-full transition-all duration-1000" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Modern image card with stats */}
                    <div className="relative mt-6 rounded-2xl overflow-hidden border border-[#1a6b2e]/20">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b1223] via-[#0b1223]/40 to-transparent z-10" />
                      <img
                        src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80"
                        alt="Team support and consulting"
                        className="w-full h-full object-cover transition-transform duration-700 aspect-[16/9]"
                      />
                      {/* Floating stats card - always visible, no hover needed */}
                      <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-xl p-3 border border-white/20 z-20">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-[#0f3d1a] font-bold text-sm">
                              Trainer Support & Consulting
                            </h3>
                            <p className="text-[#0f3d1a]/70 text-xs">
                              Expert guidance every step
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-primaryBlue font-black text-lg">
                              98%
                            </div>
                            <div className="text-[#0f3d1a]/60 text-[10px]">
                              success rate
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Individual Plans Section - Modern Redesign */}

            <div className="max-w-6xl mx-auto px-4">
              {/* Section header - Clean & Modern */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primaryBlue/10 border border-primaryBlue/20 text-primaryBlue text-xs font-black uppercase tracking-wider mb-4">
                  <span className="w-1.5 h-1.5 bg-primaryBlue rounded-full" />
                  Pricing Plans
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-[#0f3d1a]">
                  Choose your{" "}
                  <span className="text-primaryBlue">learning journey</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {individualPlans.map((plan, index) => {
                  const IconComponent = plan.icon;
                  return (
                    <div
                      key={plan.level}
                      className={`relative ${plan.popular ? "md:scale-105" : ""}`}
                    >
                      {/* Simple glow for popular plan - no animation */}
                      {plan.popular && (
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primaryBlue to-primaryBlue/50 rounded-[2rem] blur-xl opacity-50" />
                      )}

                      <div
                        className={`relative theme-card p-6 sm:p-8 rounded-[2rem] flex flex-col justify-between ${
                          plan.popular
                            ? "bg-gradient-to-br from-cardBgActive/30 to-cardBg border-2 border-primaryBlue/40 shadow-xl"
                            : "bg-cardBg border border-lightBorder hover:border-primaryBlue/30"
                        } transition-all duration-300 hover:-translate-y-2`}
                      >
                        {/* Simple ribbon for popular */}
                        {plan.popular && (
                          <div className="absolute top-6 right-6 z-20">
                            <div className="px-4 py-1.5 rounded-full bg-primaryBlue text-[#0f3d1a] text-[10px] font-black uppercase tracking-widest shadow-md">
                              {plan.badge}
                            </div>
                          </div>
                        )}

                        {/* Subtle background pattern */}
                        <div className="absolute inset-0 opacity-3 pointer-events-none">
                          <div
                            className="absolute inset-0"
                            style={{
                              backgroundImage:
                                "radial-gradient(circle at 1px 1px, rgba(240,89,31,0.3) 1px, transparent 1px)",
                              backgroundSize: "20px 20px",
                            }}
                          />
                        </div>

                        <div className="relative space-y-6">
                          {/* Header with icon - Simple hover */}
                          <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-primaryBlue/15 border border-primaryBlue/25 text-primaryBlue flex items-center justify-center transition-all duration-300 hover:scale-105 hover:bg-primaryBlue/25">
                              <IconComponent className="w-7 h-7" />
                            </div>
                            <div className="flex-grow">
                              <h3 className="text-2xl font-black text-[#0f3d1a]">
                                {plan.level}
                              </h3>
                              <p className="text-sm text-bodyGrayText font-medium mt-1">
                                {plan.desc}
                              </p>
                            </div>
                          </div>

                          {/* Price with simple underline */}
                          <div>
                            <div className="text-3xl sm:text-4xl font-black text-[#0f3d1a]">
                              {plan.price}
                            </div>
                            <div className="mt-2 w-12 h-0.5 bg-primaryBlue/40 rounded-full" />
                          </div>

                          {/* Features - Clean and simple */}
                          <div className="space-y-3 pt-2">
                            {plan.features.map((feature, idx) => (
                              <div
                                key={idx}
                                className="flex items-start space-x-3 transition-all duration-200 hover:translate-x-1"
                              >
                                <div className="w-5 h-5 rounded-full bg-primaryBlue/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <CheckCircle2 className="w-3 h-3 text-primaryBlue" />
                                </div>
                                <span className="text-sm text-bodyGrayText font-medium leading-relaxed">
                                  {feature}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Simple CTA Button */}
                        <div className="pt-8 mt-4">
                          <Link
                            href={plan.href}
                            className={`w-full py-3.5 rounded-xl font-black text-sm text-center block transition-all duration-300 ${
                              plan.popular
                                ? "bg-primaryBlue text-[#0f3d1a] shadow-md hover:shadow-lg hover:bg-primaryBlue/90"
                                : "bg-[#1a6b2e]/5 border border-white/20 text-[#0f3d1a] hover:bg-white/10"
                            }`}
                          >
                            {plan.cta}
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Included Value */}

          <div className="mb-24 p-6 sm:p-12 md:p-16 rounded-[2.5rem] sm:rounded-[3rem] bg-[#c8e6c9] border border-lightBorder relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primaryBlue/10 via-transparent to-transparent" />

            <div className="text-center mb-14 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primaryBlue/20 bg-primaryBlue/10 backdrop-blur-sm text-primaryBlue text-xs font-black uppercase">
                <Shield className="w-3.5 h-3.5" /> Premium Features
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-[#0f3d1a] leading-tight">
                The <span className="text-primaryBlue">learning proof</span>
                <br />
                advantage
              </h2>
            </div>

            {/* 3D Hover Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 perspective-1000">
              {[
                {
                  title: "Structured Lessons",
                  desc: "Video modules, assessments, and guided progression",
                  icon: BookOpen,
                  delay: "0s",
                },
                {
                  title: "Verified Certificates",
                  desc: "Certificates tied to LMS activity",
                  icon: Award,
                  delay: "0.1s",
                },
                {
                  title: "Progress Visibility",
                  desc: "Track lessons and outcomes",
                  icon: TrendingUp,
                  delay: "0.2s",
                },
              ].map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className="group preserve-3d"
                    style={{ animationDelay: item.delay }}
                  >
                    <div className="relative transform-gpu transition-all duration-700 group-hover:rotate-y-10 group-hover:scale-105">
                      {/* Glass morphism card */}
                      <div className="relative backdrop-blur-xl bg-white/[0.02] rounded-2xl p-8 border border-[#1a6b2e]/20 shadow-xl overflow-hidden">
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                        <div className="space-y-5">
                          {/* Icon with ring */}
                          <div className="relative">
                            <div className="absolute inset-0 bg-primaryBlue/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primaryBlue to-primaryBlue/40 flex items-center justify-center shadow-lg">
                              <IconComponent className="w-8 h-8 text-[#0f3d1a]" />
                            </div>
                          </div>

                          {/* Content */}
                          <div>
                            <h3 className="text-xl font-black text-[#0f3d1a] mb-3">
                              {item.title}
                            </h3>
                            <p className="text-sm text-[#1a6b2e] leading-relaxed">
                              {item.desc}
                            </p>
                          </div>

                          {/* Interactive element */}
                          <div className="pt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                            <div className="flex items-center gap-2 text-primaryBlue text-sm font-medium">
                              <span>Explore feature</span>
                              <svg
                                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Institutional Subscription Section */}
          <div className="mb-24 p-6 sm:p-12 md:p-20 rounded-[2.5rem] sm:rounded-[3.5rem] bg-[#c8e6c9] border border-lightBorder relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 secondary-glow opacity-10" />

            <div className="text-center mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primaryBlue/20 bg-primaryBlue/10 text-primaryBlue text-xs font-bold uppercase tracking-widest shadow-sm hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-default">
                <Building2 className="w-3.5 h-3.5" /> Institutional Access
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0f3d1a] tracking-tight text-3d px-4 break-words">
                For Institutions{" "}
                <span className="text-primaryBlue text-3d-orange">Plans</span>
              </h2>
              <p className="text-sm sm:text-base text-[#1a6b2e] font-medium max-w-xl mx-auto leading-relaxed px-4">
                Connect your school, college, or university to NextGen-LMS LMS.
                Train all your students on professional freelance standards.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-5xl mx-auto px-4 sm:px-6">
              {[
                {
                  level: "School Students",
                  price: "200",
                  desc: "Beginner-friendly content",
                  icon: School,
                },
                {
                  level: "College Students",
                  price: "300",
                  desc: "Intermediate practical content",
                  icon: BookOpen,
                },
                {
                  level: "University Students",
                  price: "500",
                  desc: "Advanced professional content",
                  icon: GraduationCap,
                },
              ].map((plan) => {
                const IconComponent = plan.icon;
                return (
                  <div key={plan.level} className="relative group">
                    <div className="pricing-card p-4 sm:p-5 rounded-2xl border border-[#1a6b2e]/20 flex flex-col items-center text-center space-y-3 bg-cardBg hover:bg-primaryBlue hover:border-primaryBlue hover:text-[#0f3d1a] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(240,89,31,0.3)] relative overflow-hidden h-full">
                      {/* Background Effect - Subtle */}
                      <div className="absolute top-0 right-0 w-16 h-16 bg-[#1a6b2e]/5 rounded-full blur-xl group-hover:bg-white/20 transition-all pointer-events-none" />

                      {/* Icon - Smaller */}
                      <div className="w-12 h-12 rounded-xl bg-primaryBlue/10 border border-primaryBlue/25 text-primaryBlue flex items-center justify-center group-hover:bg-white group-hover:text-primaryBlue group-hover:scale-105 transition-all duration-300 relative z-10 flex-shrink-0">
                        <IconComponent className="w-5 h-5" />
                      </div>

                      {/* Title */}
                      <h3 className="text-sm sm:text-base font-black text-[#0f3d1a] group-hover:text-[#0f3d1a] uppercase tracking-wider relative z-10 break-words">
                        {plan.level}
                      </h3>

                      {/* Price */}
                      <div className="flex flex-col items-center relative z-10">
                        <div className="flex items-baseline justify-center gap-0.5">
                          <span className="font-sans text-xs font-semibold text-primaryBlue group-hover:text-[#0f3d1a] transition-colors">
                            PKR
                          </span>
                          <span className="text-2xl sm:text-3xl font-black text-[#0f3d1a] group-hover:text-[#0f3d1a] transition-colors">
                            {plan.price}
                          </span>
                        </div>
                        <span className="text-[9px] sm:text-[10px] text-darkGrayNumber group-hover:text-[#0f3d1a]/60 transition-colors font-black uppercase tracking-wider mt-1">
                          Per Student / Month
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-bodyGrayText group-hover:text-[#0f3d1a]/80 transition-colors leading-relaxed font-medium relative z-10 px-2">
                        {plan.desc}
                      </p>

                      {/* Button - Smaller */}
                      <Link
                        href="/contact?type=institution"
                        className="w-full py-2.5 sm:py-3 bg-[#1a6b2e]/5 border border-[#1a6b2e]/20 rounded-xl text-[#0f3d1a] font-semibold hover:bg-white hover:text-primaryBlue group-hover:bg-white group-hover:text-primaryBlue transition-all duration-300 text-center text-xs relative z-10 hover:-translate-y-0.5"
                      >
                        Get Started
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Long Term Packages - FIXED LAYOUT NO EXTRA SPACE */}
          <div className="p-6 sm:p-10 md:p-16 lg:p-20 rounded-[2.5rem] sm:rounded-[3.5rem] bg-[#c8e6c9] border border-lightBorder relative overflow-hidden shadow-2xl mb-24">
            <div className="absolute bottom-0 left-0 w-80 h-80 secondary-glow opacity-10" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative z-10">
              {/* Left – Heading, description & Image */}
              <div className="lg:col-span-5 space-y-5 sm:space-y-6 px-2 sm:px-4 lg:sticky lg:top-24">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primaryBlue/20 bg-primaryBlue/10 text-primaryBlue text-xs font-bold uppercase tracking-widest shadow-sm hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-default w-fit">
                  <Star className="w-3.5 h-3.5" /> Long-Term Savings
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#0f3d1a] leading-tight tracking-tight text-3d break-words">
                  Discounted packages for lasting LMS adoption
                </h2>

                <p className="text-sm text-[#1a6b2e] font-medium leading-relaxed max-w-lg">
                  The longer you commit, the more you save. Designed for
                  institutions and training partners who plan ahead and scale
                  learning over time.
                </p>

                <div className="hidden lg:flex items-center gap-3 text-xs text-[#71717a] font-medium group cursor-default">
                  <Award className="w-4 h-4 text-primaryBlue group-hover:scale-125 group-hover:-translate-y-1 transition-all duration-300" />
                  <span>
                    Up to{" "}
                    <span className="text-primaryBlue font-bold text-sm">
                      40%
                    </span>{" "}
                    savings on 3-year plans
                  </span>
                </div>

                {/* Perfectly sized image to match right column height */}
                <div className="relative mt-4 rounded-2xl overflow-hidden border border-[#1a6b2e]/10 group/img aspect-[4/3]">
                  <img
                    src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80"
                    alt="Strategic planning and growth"
                    className="absolute inset-0 w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/30 to-transparent"></div>
                </div>
              </div>

              {/* Right – Cards grid */}
              <div className="lg:col-span-7 px-2 sm:px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {[
                    {
                      term: "3 Months",
                      discount: 15,
                      highlight: "Kickstart with short-term savings",
                      barWidth: "w-[38%]",
                    },
                    {
                      term: "6 Months",
                      discount: 20,
                      highlight: "Solid value for semester planning",
                      accent: true,
                      barWidth: "w-1/2",
                    },
                    {
                      term: "1 Year",
                      discount: 25,
                      highlight: "Best fit for annual academic cycles",
                      barWidth: "w-[63%]",
                    },
                    {
                      term: "2 Years",
                      discount: 30,
                      highlight: "Smart savings for multi-year strategy",
                      barWidth: "w-3/4",
                    },
                    {
                      term: "3 Years",
                      discount: 40,
                      highlight: "Maximum value & long-term growth",
                      best: true,
                      barWidth: "w-full",
                    },
                  ].map((plan) => (
                    <div
                      key={plan.term}
                      className={`
                        group relative rounded-2xl border p-4 sm:p-5
                        transition-all duration-500 hover:-translate-y-4 hover:scale-[1.02] hover:shadow-[0_25px_50px_-12px_rgba(240,89,31,0.3)]
                        sm:col-span-1
                        ${
                          plan.best
                            ? "sm:col-span-2 border-primaryBlue/40 bg-gradient-to-br from-primaryBlue/15 via-[#0b1223]/95 to-[#0b1223]/95"
                            : plan.accent
                              ? "border-primaryBlue/25 bg-gradient-to-br from-primaryBlue/8 via-[#0b1223]/90 to-[#0b1223]/90"
                              : "border-white/[0.07] bg-[#0b1223]/80 hover:border-white/15"
                        }
                      `}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`
                            w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border
                            ${
                              plan.best
                                ? "bg-primaryBlue/20 border-primaryBlue/30 text-primaryBlue"
                                : "bg-[#1a6b2e]/5 border-white/[0.08] text-[#1a6b2e] group-hover:text-primaryBlue group-hover:bg-primaryBlue/10 group-hover:border-primaryBlue/20 transition-colors"
                            }
                            group-hover:scale-110 group-hover:rotate-6 group-hover:-translate-y-1 transition-all duration-300
                          `}
                          >
                            <Clock className="w-4 h-4" />
                          </div>
                          <p className="text-sm sm:text-base font-bold text-[#0f3d1a]">
                            {plan.term}
                          </p>
                        </div>

                        <div
                          className={`
                          flex items-center gap-1.5 rounded-full px-3 py-1 text-xs sm:text-sm font-bold flex-shrink-0
                          ${
                            plan.best
                              ? "bg-primaryBlue text-[#020617] shadow-lg shadow-primaryBlue/25 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300"
                              : "bg-primaryBlue/10 text-primaryBlue border border-primaryBlue/20 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300"
                          }
                        `}
                        >
                          {plan.best && <Zap className="w-3.5 h-3.5" />}
                          {plan.discount}% Off
                        </div>
                      </div>

                      <p
                        className={`
                        mt-3 text-xs sm:text-sm leading-relaxed sm:pl-12
                        ${plan.best ? "text-[#1a6b2e] font-medium" : "text-[#71717a]"}
                      `}
                      >
                        {plan.highlight}
                      </p>

                      <div className="mt-3 sm:pl-12">
                        <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                          <div
                            className={`
                              h-full rounded-full transition-all duration-700
                              ${plan.barWidth}
                              ${
                                plan.best
                                  ? "bg-gradient-to-r from-primaryBlue to-[#d94d19]"
                                  : "bg-primaryBlue/40"
                              }
                            `}
                          />
                        </div>
                      </div>

                      {plan.best && (
                        <div className="absolute -top-px right-6">
                          <div className="bg-primaryBlue text-[#020617] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-b-lg shadow-lg shadow-primaryBlue/20 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300">
                            Best Value
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing FAQ Section */}
          <div className="max-w-4xl mx-auto px-2 sm:px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-black text-[#0f3d1a] mb-3 text-3d break-words">
                Frequently Asked{" "}
                <span className="text-primaryBlue text-3d-orange">
                  Questions
                </span>
              </h2>
              <p className="text-sm sm:text-base text-[#1a6b2e] font-medium">
                Simple answers to common questions about NextGen-LMS
                subscriptions.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-5">
              {[
                {
                  q: "Is there a setup fee or hidden charges?",
                  a: "No setup fees whatsoever. You only pay the listed per-student price for the level of your institution, or the pay-per-course rate if you are an individual learner. No hidden platform maintenance costs.",
                },
                {
                  q: "Can individual students get institutional pricing?",
                  a: "No, institutional pricing is exclusively for partner academic schools, colleges, and universities subscribing their students as a bulk group. Individual students can pay per course or join the premium track.",
                },
                {
                  q: "How does the billing cycles work?",
                  a: "Institutional subscriptions are billed monthly in advance based on the active seat allocation. You can upgrade or add more student seats at any time during your billing period.",
                },
              ].map((faq, i) => {
                const [isOpen, setIsOpen] = useState(false);

                return (
                  <div
                    key={i}
                    className="p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] glass-card border border-[rgba(255,255,255,0.06)] hover:border-[rgba(240,89,31,0.2)] transition-all duration-300 group"
                  >
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className="w-full text-left cursor-pointer"
                    >
                      <h3 className="text-base sm:text-lg font-bold text-[#0f3d1a] mb-2 flex items-start gap-3 flex-shrink-0 break-words">
                        <span className="w-6 h-6 rounded-lg bg-[rgba(240,89,31,0.1)] flex items-center justify-center text-primaryBlue flex-shrink-0 group-hover:bg-[#5E6F58] group-hover:text-[#0f3d1a] transition-all duration-300">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </span>
                        {faq.q}
                      </h3>
                    </button>
                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"}`}
                    >
                      <p className="text-sm sm:text-base text-bodyGrayText leading-relaxed pl-9 font-medium break-words">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
