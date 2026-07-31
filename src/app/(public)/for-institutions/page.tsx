"use client";

import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  Building2,
  ShieldCheck,
  BarChart3,
  Users,
  Clock,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Play,
  Pause,
  BookOpen,
  Star,
  HelpCircle,
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

export default function ForInstitutionsPage() {
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

  const portalFeatures = [
    {
      title: "Student Management",
      desc: "Add, view, and organize students by grade or section. Manage licenses effortlessly.",
    },
    {
      title: "Course Assignment",
      desc: "Assign courses to classes or individual students based on their level and learning paths.",
    },
    {
      title: "Detailed Reports",
      desc: "Generate high-quality progress reports for individual students or classes with one click.",
    },
    {
      title: "Grading Review",
      desc: "View student test scores and check detailed grading reviews left by the course trainers.",
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
          <source
            src="/videos/Partner with NextGen-LMS LMS.mp4"
            type="video/mp4"
          />
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
          <div className="text-center mb-16 sm:mb-24 space-y-4 sm:space-y-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primaryBlue/20 bg-primaryBlue/10 text-primaryBlue text-xs font-bold uppercase tracking-widest shadow-sm hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-default">
              <Building2 className="w-3.5 h-3.5" /> Academic Partnerships
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0f3d1a] leading-tight tracking-tight text-3d">
              Partner with{" "}
              <span className="text-primaryBlue text-3d-orange">
                NextGen-LMS LMS
              </span>
            </h1>
            <p className="text-base sm:text-lg text-[#1a6b2e] font-medium max-w-2xl mx-auto leading-relaxed">
              Equip your students with professional digital skills. Bring
              structured, trainer-graded freelance training directly to your
              campus.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="mb-24">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0f3d1a] mb-12 sm:mb-16 text-center tracking-tight text-3d">
              Why Partner with{" "}
              <span className="text-primaryBlue text-3d-orange">
                NextGen-LMS LMS?
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-stretch">
              {[
                {
                  title: "Level-Based Courses",
                  desc: "Specialized content built specifically for school, college, and university students.",
                  icon: <GraduationCap className="w-6 h-6" />,
                },
                {
                  title: "Dedicated Portal",
                  desc: "A complete dashboard to manage students, assign courses, and track performance.",
                  icon: <Building2 className="w-6 h-6" />,
                },
                {
                  title: "Trainer Grading",
                  desc: "Expert trainers grade practical submissions, leaving detailed code and design feedback.",
                  icon: <ShieldCheck className="w-6 h-6" />,
                },
                {
                  title: "Direct Reports",
                  desc: "Instant progress reports delivered directly to your portal inbox with one click.",
                  icon: <BarChart3 className="w-6 h-6" />,
                },
              ].map((benefit) => (
                <div
                  key={benefit.title}
                  className="theme-card h-full p-6 sm:p-8 rounded-[2rem] flex flex-col items-start text-left relative overflow-hidden bg-gradient-to-b from-white/[0.03] to-white/[0.01] hover:from-primaryBlue/[0.08] hover:to-transparent border border-[#1a6b2e]/20 hover:border-primaryBlue/40 transition-all duration-500 shadow-xl hover:-translate-y-6 hover:scale-[1.02] hover:shadow-[0_30px_60px_-15px_rgba(240,89,31,0.4)] group"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-primaryBlue/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  <div className="w-14 h-14 mb-6 rounded-2xl bg-[#1a6b2e]/5 group-hover:bg-primaryBlue/10 text-[#0f3d1a]/80 group-hover:text-primaryBlue border border-[#1a6b2e]/20 group-hover:border-primaryBlue/30 flex items-center justify-center shadow-lg group-hover:shadow-[0_0_20px_rgba(240,89,31,0.2)] transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-6 group-hover:-translate-y-1 flex-shrink-0 z-10">
                    {benefit.icon}
                  </div>

                  <div className="flex-1 flex flex-col justify-start z-10 w-full text-left">
                    <h3 className="text-lg sm:text-xl font-bold text-[#0f3d1a] tracking-tight mb-3 group-hover:text-primaryBlue transition-colors duration-300">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-bodyGrayText group-hover:text-[#1a6b2e] font-medium leading-relaxed transition-colors duration-300">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How it Works */}
          <div className="mb-24 p-6 sm:p-12 md:p-20 rounded-[2.5rem] sm:rounded-[3.5rem] bg-[#c8e6c9] border border-lightBorder relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 secondary-glow opacity-10" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0f3d1a] mb-12 sm:mb-16 text-center tracking-tight text-3d">
              How the Partnership{" "}
              <span className="text-primaryBlue text-3d-orange">Works</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative items-stretch">
              {[
                {
                  step: "01",
                  title: "Select a Level Plan",
                  desc: "Choose a subscription plan matching your students' levels (School, College, or University).",
                },
                {
                  step: "02",
                  title: "Register Students",
                  desc: "Receive dedicated portal credentials. Add your student body and assign student licenses.",
                },
                {
                  step: "03",
                  title: "Receive Reports",
                  desc: "Students complete video lessons and pass assessments. Get verified reports on their progress.",
                },
              ].map((step, idx) => (
                <div
                  key={step.step}
                  className="theme-card h-full p-6 sm:p-8 rounded-[2rem] flex flex-col items-start text-left relative overflow-hidden bg-gradient-to-b from-white/[0.03] to-white/[0.01] hover:from-primaryBlue/[0.08] hover:to-transparent border border-[#1a6b2e]/20 hover:border-primaryBlue/40 transition-all duration-500 shadow-xl hover:-translate-y-6 hover:scale-[1.02] hover:shadow-[0_30px_60px_-15px_rgba(240,89,31,0.4)] group"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-primaryBlue/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  <div className="text-5xl sm:text-6xl font-black text-primaryBlue/20 group-hover:text-primaryBlue/40 tracking-tighter leading-none mb-6 transition-all duration-500 transform group-hover:scale-110 group-hover:-translate-y-2 z-10">
                    {step.step}
                  </div>

                  <div className="flex-1 flex flex-col justify-start z-10 w-full text-left">
                    <h3 className="text-xl font-bold text-[#0f3d1a] tracking-tight mb-3 group-hover:text-primaryBlue transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-sm text-bodyGrayText group-hover:text-[#1a6b2e] font-medium leading-relaxed transition-colors duration-300">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rollout Plan - REVAMPED SECTION */}
          <div className="mb-24 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
            {/* Left: Large Image & Text Overlay */}
            <div className="lg:col-span-7 relative rounded-[2rem] overflow-hidden border border-lightBorder shadow-xl min-h-[450px] sm:min-h-[550px] hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(240,89,31,0.3)] transition-all duration-500 group/main">
              <img
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80"
                alt="Classroom technology setup"
                className="absolute inset-0 w-full h-full object-cover group-hover/main:scale-110 transition-transform duration-700 z-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/70 to-[#020617]/20 z-10"></div>

              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 z-20 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primaryBlue/20 bg-primaryBlue/10 text-primaryBlue text-[10px] font-black uppercase tracking-widest backdrop-blur-md hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-default">
                  <Clock className="w-3.5 h-3.5" /> 30-Day Rollout
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#0f3d1a] tracking-tight drop-shadow-lg">
                  Launch without adding{" "}
                  <span className="text-primaryBlue">IT complexity</span>
                </h2>
                <p className="text-sm text-[#1a6b2e] font-medium leading-relaxed max-w-lg">
                  A guided onboarding flow helps administrators activate
                  students, assign courses, and start tracking progress quickly.
                </p>
              </div>
            </div>

            {/* Right: Stacked Timeline Cards */}
            <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-5">
              {[
                {
                  step: "01",
                  day: "Week 1",
                  title: "Setup",
                  desc: "Create the institution portal, import student lists, and allocate licenses.",
                },
                {
                  step: "02",
                  day: "Week 2",
                  title: "Assign",
                  desc: "Map courses to classes by level, skill goal, or department requirement.",
                },
                {
                  step: "03",
                  day: "Week 3+",
                  title: "Track",
                  desc: "Review completion, assessment scores, and trainer feedback in one place.",
                },
              ].map((item, i) => (
                <div
                  key={item.day}
                  className="theme-card p-4 sm:p-6 rounded-2xl bg-[#1a6b2e]/5 border border-[#1a6b2e]/20 hover:border-primaryBlue/40 hover:bg-white/[0.055] transition-all duration-500 hover:-translate-y-4 hover:scale-[1.01] hover:shadow-[0_25px_50px_-12px_rgba(240,89,31,0.3)] group flex items-start gap-4 sm:gap-5 flex-1"
                >
                  {/* Timeline Step Icon & Connector */}
                  <div className="flex flex-col items-center gap-2 pt-1">
                    <div className="w-10 h-10 rounded-xl bg-primaryBlue/10 border border-primaryBlue/20 text-primaryBlue flex items-center justify-center font-black text-base flex-shrink-0 group-hover:bg-primaryBlue group-hover:text-[#0f3d1a] group-hover:scale-110 group-hover:rotate-6 group-hover:-translate-y-1 transition-all duration-300 shadow-[0_0_15px_rgba(240,89,31,0)] group-hover:shadow-[0_0_15px_rgba(240,89,31,0.3)]">
                      {item.step}
                    </div>
                    {/* Connector Line */}
                    {i < 2 && (
                      <div className="w-px flex-1 bg-[#1a6b2e]/5 mt-2"></div>
                    )}
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 pb-4">
                    <div className="text-[10px] font-black uppercase tracking-widest text-primaryBlue/60 group-hover:text-primaryBlue mb-1 transition-colors duration-300">
                      {item.day}
                    </div>
                    <h3 className="text-lg font-black text-[#0f3d1a] tracking-tight mb-2 group-hover:text-primaryBlue transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-sm text-bodyGrayText group-hover:text-[#1a6b2e] font-medium leading-relaxed transition-colors duration-300">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Portal Features - Added Image */}
          <div className="mb-24 p-6 sm:p-12 md:p-20 rounded-[2.5rem] sm:rounded-[3.5rem] bg-[#c8e6c9] border border-lightBorder relative overflow-hidden shadow-2xl">
            <div className="absolute bottom-0 left-0 w-80 h-80 secondary-glow opacity-10" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-7 space-y-6 sm:space-y-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0f3d1a] leading-tight tracking-tight text-3d">
                  Your Institution{" "}
                  <span className="text-primaryBlue text-3d-orange">
                    Portal
                  </span>
                </h2>
                <p className="text-sm sm:text-base text-[#1a6b2e] font-medium leading-relaxed">
                  Every partner school, college, and university receives a
                  dedicated manager portal. No complicated IT setups required.
                  Manage licenses, assign classes, and pull report cards from
                  one clean interface.
                </p>

                {/* Image added above feature grid */}
                <div className="relative rounded-2xl overflow-hidden border border-[#1a6b2e]/10 group/img">
                  <img
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=80"
                    alt="Team collaborating on dashboard"
                    className="w-full h-[220px] object-cover group-hover/img:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-2 items-stretch">
                  {portalFeatures.map((feat) => (
                    <div
                      key={feat.title}
                      className="theme-card h-full p-5 sm:p-6 rounded-2xl flex flex-col items-start text-left relative overflow-hidden bg-gradient-to-b from-white/[0.03] to-white/[0.01] hover:from-primaryBlue/[0.08] hover:to-transparent border border-[#1a6b2e]/20 hover:border-primaryBlue/40 transition-all duration-500 shadow-md hover:-translate-y-4 hover:scale-[1.02] hover:shadow-[0_20px_40px_-10px_rgba(240,89,31,0.3)] group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-primaryBlue/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                      <div className="flex-1 flex flex-col justify-start z-10 w-full text-left">
                        <div className="flex items-center space-x-3 mb-2 sm:mb-3">
                          <div className="w-2.5 h-2.5 rounded-full bg-primaryBlue/50 group-hover:bg-primaryBlue group-hover:scale-150 group-hover:-translate-y-1 transition-all duration-300 flex-shrink-0 shadow-[0_0_8px_rgba(240,89,31,0)] group-hover:shadow-[0_0_8px_rgba(240,89,31,0.6)]" />
                          <h4 className="text-sm sm:text-base font-bold text-[#0f3d1a] tracking-tight group-hover:text-primaryBlue transition-colors duration-300">
                            {feat.title}
                          </h4>
                        </div>
                        <p className="text-xs sm:text-sm text-bodyGrayText group-hover:text-[#1a6b2e] leading-relaxed font-medium transition-colors duration-300 pl-5">
                          {feat.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Graphical Portal Widget Card */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden group">
                  {/* Premium Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#000000]" />

                  {/* Subtle Border - No hover effect */}
                  <div className="absolute inset-0 rounded-2xl border border-[#1a6b2e]/20" />

                  {/* Simple decorative dots */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-10 left-10 w-1 h-1 rounded-full bg-[#5E6F58]/30" />
                    <div className="absolute top-20 right-20 w-1 h-1 rounded-full bg-[#5E6F58]/30" />
                    <div className="absolute bottom-10 left-20 w-1 h-1 rounded-full bg-[#5E6F58]/30" />
                    <div className="absolute bottom-20 right-10 w-1 h-1 rounded-full bg-[#5E6F58]/30" />
                  </div>

                  {/* Content */}
                  <div className="relative p-6 sm:p-8">
                    {/* Header with Icon */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-[#5E6F58]/10 flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-[#d94d19]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold text-[#0f3d1a]">
                            Institution Overview
                          </h3>
                        </div>
                        <p className="text-sm text-[#1a6b2e] leading-relaxed pl-10">
                          Manage student access, monitor course participation,
                          and keep track of active learning plans
                        </p>
                      </div>
                    </div>

                    {/* Stats Card */}
                    <div className="rounded-xl bg-white/[0.02] border border-[#1a6b2e]/20 p-5 mb-4">
                      {/* Header Row */}
                      <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#1a6b2e]/20">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#5E6F58]" />
                          <span className="text-xs font-bold uppercase tracking-wider text-[#1a6b2e]">
                            Active Student Access
                          </span>
                        </div>
                        <span className="px-4 text-center py-1.5 bg-gradient-to-r from-[#5E6F58] to-sky-500 text-[#0f3d1a] text-xs font-bold rounded-full shadow-md">
                          250 Allocated
                        </span>
                      </div>

                      {/* Access Cards - Simple hover */}
                      <div className="space-y-3">
                        {[
                          {
                            name: "School Access",
                            count: 120,
                            percentage: 48,
                            icon: "🏫",
                          },
                          {
                            name: "College Access",
                            count: 85,
                            percentage: 34,
                            icon: "🎓",
                          },
                          {
                            name: "University Access",
                            count: 45,
                            percentage: 18,
                            icon: "📚",
                          },
                        ].map((item) => (
                          <div key={item.name} className="group/item">
                            <div className="p-3 rounded-xl transition-all duration-200">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <span className="text-lg">{item.icon}</span>
                                  <span className="text-sm font-medium text-[#1a6b2e]">
                                    {item.name}
                                  </span>
                                </div>
                                <span className="text-sm font-bold text-[#d94d19]">
                                  {item.count} Active
                                </span>
                              </div>

                              {/* Progress Bar */}
                              <div className="relative">
                                <div className="h-1.5 bg-[#1a6b2e]/5 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-[#5E6F58] to-sky-400 rounded-full"
                                    style={{ width: `${item.percentage}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Total Stats */}
                      <div className="mt-5 pt-3 border-t border-[#1a6b2e]/20">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[#7dab52]">
                            Total Active Students
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-[#0f3d1a]">
                              250
                            </span>
                            <span className="text-xs text-[#7dab52]">/ 500</span>
                          </div>
                        </div>
                        <div className="mt-2 h-1 bg-[#1a6b2e]/5 rounded-full overflow-hidden">
                          <div className="h-full w-[50%] bg-gradient-to-r from-[#5E6F58] to-sky-500 rounded-full" />
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-emerald-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        </div>
                        <span className="text-[10px] font-bold text-[#7dab52] uppercase tracking-widest">
                          Secured by NextGen-LMS LMS Guard
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Engagement Insights */}
          <div className="mb-24 p-6 sm:p-12 md:p-16 rounded-[2.5rem] sm:rounded-[3rem] bg-[#c8e6c9] border border-lightBorder relative overflow-hidden shadow-2xl">
            <div className="absolute bottom-0 left-0 w-80 h-80 secondary-glow opacity-10 pointer-events-none" />
            <div className="text-center mb-12 space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primaryBlue/20 bg-primaryBlue/10 text-primaryBlue text-xs font-black uppercase tracking-widest hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-default">
                <BarChart3 className="w-3.5 h-3.5" /> Academic Visibility
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0f3d1a] tracking-tight text-3d">
                Reports leaders can{" "}
                <span className="text-primaryBlue text-3d-orange">
                  act on
                </span>
              </h2>
              <p className="text-sm sm:text-base text-[#1a6b2e] font-medium max-w-2xl mx-auto leading-relaxed">
                Keep administrators, teachers, and parents aligned with progress
                signals that are easy to understand.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 relative z-10">
              {[
                {
                  value: "92%",
                  title: "Module completion",
                  desc: "See which classes are staying on schedule and where support is needed.",
                },
                {
                  value: "70%",
                  title: "Certificate progress",
                  desc: "Track learners moving from course completion to verified certification.",
                },
                {
                  value: "85%",
                  title: "Skill improvement",
                  desc: "Compare assessments over time to show measurable academic growth.",
                },
              ].map((metric) => (
                <div
                  key={metric.title}
                  className="theme-card p-6 sm:p-7 rounded-2xl bg-[#1a6b2e]/5 border border-[#1a6b2e]/20 hover:border-primaryBlue/35 hover:bg-white/[0.055] transition-all duration-500 hover:-translate-y-6 hover:scale-[1.02] hover:shadow-[0_30px_60px_-15px_rgba(240,89,31,0.4)] group"
                >
                  <div className="text-4xl sm:text-5xl font-black text-primaryBlue text-3d-orange mb-4 leading-none group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500">
                    {metric.value}
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-[#0f3d1a] tracking-tight mb-3">
                    {metric.title}
                  </h3>
                  <p className="text-sm text-bodyGrayText font-medium leading-relaxed">
                    {metric.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="p-6 sm:p-12 md:p-20 rounded-[2.5rem] sm:rounded-[3.5rem] bg-[#c8e6c9] border border-lightBorder relative overflow-hidden shadow-2xl mb-24">
            <div className="absolute top-0 right-0 w-80 h-80 secondary-glow opacity-10" />

            <div className="text-center mb-16 space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0f3d1a] tracking-tight text-3d">
                For Institutions{" "}
                <span className="text-primaryBlue text-3d-orange">plans</span>
              </h2>
              <p className="text-sm sm:text-base text-[#1a6b2e] font-medium max-w-xl mx-auto leading-relaxed">
                Connect your institution and provide premium digital tech skill
                courses to your student body.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {pricing.map((plan) => (
                <div key={plan.level} className="relative group">
                  <div className="pricing-card p-6 sm:p-8 rounded-[2.25rem] border border-[#1a6b2e]/20 flex flex-col items-center text-center space-y-5 bg-cardBg hover:bg-primaryBlue hover:border-primaryBlue hover:text-[#0f3d1a] transition-all duration-500 hover:-translate-y-6 hover:scale-[1.03] hover:shadow-[0_30px_60px_-15px_rgba(240,89,31,0.5)] relative overflow-hidden h-full">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-[#1a6b2e]/5 rounded-full blur-xl group-hover:bg-white/20 transition-all pointer-events-none" />

                    <h3 className="text-base sm:text-lg font-black text-[#0f3d1a] group-hover:text-[#0f3d1a] uppercase tracking-wider group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300">
                      {plan.level}
                    </h3>

                    <div className="flex flex-col items-center">
                      <div className="flex items-baseline justify-center">
                        <span className="font-sans text-sm sm:text-base font-semibold text-primaryBlue group-hover:text-[#0f3d1a] transition-colors mr-1">
                          PKR
                        </span>
                        <span className="text-3xl sm:text-4xl font-black text-[#0f3d1a] group-hover:text-[#0f3d1a] transition-colors">
                          {plan.price}
                        </span>
                      </div>
                      <span className="text-[10px] sm:text-[11px] text-darkGrayNumber group-hover:text-[#0f3d1a]/60 transition-colors font-black uppercase tracking-[0.18em] mt-2">
                        Per Student / Month
                      </span>
                    </div>

                    <p className="text-sm sm:text-base text-bodyGrayText group-hover:text-[#0f3d1a]/80 transition-colors leading-relaxed font-medium mx-auto max-w-sm">
                      {plan.desc}
                    </p>

                    <Link
                      href="/contact?type=institution"
                      className="w-full py-3 sm:py-3.5 bg-[#1a6b2e]/5 border border-[#1a6b2e]/20 rounded-2xl text-[#0f3d1a] font-bold hover:bg-white hover:text-primaryBlue group-hover:bg-white group-hover:text-primaryBlue transition-all duration-300 text-center text-xs sm:text-sm hover:-translate-y-1 hover:scale-110 active:scale-95 active:translate-y-0 hover:shadow-[0_10px_20px_rgba(255,255,255,0.2)]"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center space-y-8">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0f3d1a] text-3d">
              Ready to Partner with{" "}
              <span className="text-primaryBlue text-3d-orange">
                NextGen-LMS LMS?
              </span>
            </h2>
            <div className="flex justify-center">
              <Link
                href="/contact?type=institution"
                className="group inline-flex items-center space-x-2 px-6 py-3.5 sm:px-8 sm:py-4 bg-primaryBlue hover:bg-opacity-95 text-[#0f3d1a] font-black text-sm sm:text-base rounded-xl shadow-lg shadow-primaryBlue/20 transition-all duration-300 hover:-translate-y-1 hover:scale-110 active:scale-95 active:translate-y-0 hover:shadow-[0_15px_30px_-8px_rgba(240,89,31,0.4)]"
              >
                <span>Request Institution Demo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
