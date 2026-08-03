"use client";

import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  Award,
  Users,
  ShieldCheck,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Video,
  Camera,
  Sparkles,
  HelpCircle,
  Rocket,
  Briefcase,
  MonitorPlay,
  Layers,
  ClipboardCheck,
  Mic,
  PenTool,
  MessageSquare,
  Radio,
  Play,
  Pause,
} from "lucide-react";

export default function ForTrainersPage() {
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

  const requirements = [
    {
      title: "Portfolio Submission",
      desc: "Provide links to your professional work, designs, or Github code repositories.",
      icon: Briefcase,
    },
    {
      title: "Video Quality",
      desc: "Course videos must be HD 1080p recorded with clear audio and in a clean environment.",
      icon: MonitorPlay,
    },
    {
      title: "Structured Content",
      desc: "Courses must follow a level-based curriculum (School, College, or University).",
      icon: Layers,
    },
    {
      title: "Assessments",
      desc: "Include test questions (MCQs, practical assignments) after every course video lesson.",
      icon: ClipboardCheck,
    },
  ];

  const standards = [
    {
      title: "Professional Equipment",
      desc: "Use DSLR or high-quality smartphones to record lectures. Audio must be crisp.",
      icon: Mic,
    },
    {
      title: "Manual Grading",
      desc: "Be prepared to manually grade students' practical code or design submissions.",
      icon: PenTool,
    },
    {
      title: "Interactive Chat",
      desc: "Answer student questions inside your course's built-in chat window weekly.",
      icon: MessageSquare,
    },
    {
      title: "Live Q&As",
      desc: "Host weekly live masterclasses or Q&A video sessions for your premium learners.",
      icon: Radio,
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
          <source src="/videos/Teach on NextGen-LMS LMS.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/25 via-[#020617]/55 to-[#020617] z-20" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#020617]/60 via-transparent to-[#5E6F58]/15 mix-blend-screen opacity-60 z-20" />
        <div className="absolute top-0 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#d94d19]/10 blur-[100px] sm:blur-[150px] rounded-full z-20" />
      </div>

      {/* Play/Pause Button - Moves strictly UP */}
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d94d19]/20 bg-[#d94d19]/10 text-[#0f3d1a] text-xs font-bold uppercase tracking-widest shadow-sm hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-default">
              <Sparkles className="w-3.5 h-3.5" /> Join Our Team
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0f3d1a] leading-tight tracking-tight text-3d">
              Teach on{" "}
              <span className="text-[#0f3d1a] text-3d-orange">
                NextGen-LMS LMS
              </span>
            </h1>
            <p className="text-base sm:text-lg text-[#1a6b2e] font-medium max-w-2xl mx-auto leading-relaxed">
              Share your expertise, train the next generation of digital
              professionals, and build a rewarding residual income stream.
            </p>
          </div>

          {/* Who can become a trainer - Added Image */}
          <div className="mb-24 p-6 sm:p-12 md:p-20 rounded-[2.5rem] sm:rounded-[3.5rem] bg-[#c8e6c9] border border-lightBorder relative overflow-hidden shadow-2xl hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(240,89,31,0.3)] transition-all duration-500">
            <div className="absolute top-0 right-0 w-80 h-80 secondary-glow opacity-10" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-7 space-y-6 sm:space-y-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0f3d1a] leading-tight tracking-tight text-3d">
                  Who Can Become a{" "}
                  <span className="text-[#0f3d1a] text-3d-orange">
                    Trainer?
                  </span>
                </h2>
                <p className="text-sm sm:text-base text-[#1a6b2e] font-medium leading-relaxed">
                  We look for passionate professionals with real industry
                  experience. If you love code, design, content creation, or
                  business, we invite you to apply.
                </p>
                <div className="space-y-4 pt-2">
                  {[
                    "Individual expert freelancers with verified portfolios",
                    "Established offline computer training institutes looking to go online",
                    "Software development houses offering practical internship tracks",
                  ].map((text, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 sm:gap-4 group/list hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#d94d19]/10 flex items-center justify-center text-[#0f3d1a] border border-[#d94d19]/20 flex-shrink-0 group-hover/list:scale-110 group-hover/list:rotate-6 group-hover/list:-translate-y-1 transition-all duration-300">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <p className="text-sm sm:text-base text-[#1a6b2e] font-semibold leading-relaxed">
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image Side */}
              <div className="lg:col-span-5 flex flex-col space-y-6">
                <div className="relative rounded-[2rem] overflow-hidden border border-lightBorder group">
                  <img
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format&fit=crop&q=80"
                    alt="Freelancer working from home"
                    className="w-full h-[350px] object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>

                  {/* Floating Card over Image */}
                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 p-3 sm:p-4 rounded-2xl bg-[#c8e6c9]/80 backdrop-blur-md border border-[#1a6b2e]/20 flex items-center gap-3 sm:gap-4 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(240,89,31,0.3)] transition-all duration-300 group/card">
                    <div className="w-10 h-10 rounded-xl bg-[#d94d19]/10 border border-[#d94d19]/20 text-[#0f3d1a] flex items-center justify-center flex-shrink-0 group-hover/card:scale-110 group-hover/card:rotate-6 transition-all duration-300">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-[#0f3d1a] tracking-tight">
                        Record from Home & Office
                      </h3>
                      <p className="text-xs text-bodyGrayText font-medium leading-relaxed">
                        Complete structural & recording support.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Requirements */}
          <div className="mb-24 relative">
            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#5E6F58]/5 via-transparent to-transparent rounded-[2.5rem] sm:rounded-[3.5rem] blur-3xl" />

            <div className="relative p-6 sm:p-12 md:p-16 rounded-[2.5rem] sm:rounded-[3.5rem] bg-gradient-to-br from-[#020617] to-[#0a0f1a] border border-[#1a6b2e]/20 shadow-2xl overflow-hidden group/main hover:shadow-[0_30px_60px_-20px_rgba(240,89,31,0.15)] transition-all duration-700">
              {/* Animated background blobs */}
              <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#5E6F58]/10 rounded-full blur-3xl animate-pulse" />
              <div
                className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#5E6F58]/5 rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: "2s" }}
              />

              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#5E6F58]/50 to-transparent group-hover:via-[#5E6F58]/80 transition-all duration-700" />

              {/* Header with icon */}
              <div className="text-center mb-14">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5E6F58]/10 border border-[#5E6F58]/20 mb-6 hover:scale-105 transition-transform duration-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#5E6F58] animate-pulse" />
                  <span className="text-[10px] font-black text-[#0f3d1a] uppercase tracking-widest">
                    Become a Trainer
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0f3d1a] tracking-tight">
                  Trainer Registration <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5E6F58] to-[#d94d19]">
                    Requirements
                  </span>
                </h2>

                <p className="text-sm text-[#1a6b2e] mt-4 max-w-md mx-auto">
                  Join our elite community of certified trainers
                </p>
              </div>

              {/* Requirements Grid - Modern Design */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: "Professional Experience",
                    desc: "Minimum 3 years of industry experience in your field with proven track record",
                    metric: "3+ Years",
                    icon: "💼",
                  },
                  {
                    title: "Teaching Certification",
                    desc: "Valid teaching certification or training credentials from recognized institutions",
                    metric: "Verified",
                    icon: "🎓",
                  },
                  {
                    title: "Portfolio Review",
                    desc: "Submit your portfolio showcasing previous work, projects, or publications",
                    metric: "Required",
                    icon: "📁",
                  },
                  {
                    title: "Tech Proficiency",
                    desc: "Expertise in LMS platforms, video recording, and digital teaching tools",
                    metric: "Advanced",
                    icon: "⚡",
                  },
                ].map((req, idx) => (
                  <div
                    key={idx}
                    className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-[#1a6b2e]/20 hover:border-[#5E6F58]/40 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl overflow-hidden"
                  >
                    {/* Hover gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#5E6F58]/0 via-[#5E6F58]/0 to-transparent group-hover:from-[#5E6F58]/10 group-hover:via-[#5E6F58]/5 transition-all duration-700" />

                    {/* Top bar indicator */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5E6F58]/0 via-[#5E6F58]/0 to-[#5E6F58]/0 group-hover:from-[#5E6F58]/40 group-hover:via-[#5E6F58]/60 group-hover:to-[#5E6F58]/40 transition-all duration-500" />

                    {/* Icon and Number */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-xl bg-[#5E6F58]/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] group-hover:from-[#5E6F58]/20 group-hover:to-[#5E6F58]/5 border border-[#1a6b2e]/20 group-hover:border-[#5E6F58]/40 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6">
                          <span className="text-2xl">{req.icon}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-black text-[#0f3d1a]/5 group-hover:text-[#0f3d1a]/20 transition-all duration-300">
                          {String(idx + 1).padStart(2, "0")}
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-[#0f3d1a] mb-2 group-hover:text-[#0f3d1a] transition-colors duration-300">
                      {req.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-[#1a6b2e] leading-relaxed mb-4">
                      {req.desc}
                    </p>

                    {/* Metric Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.02] border border-[#1a6b2e]/10 group-hover:border-[#5E6F58]/30 transition-all duration-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#5E6F58] group-hover:scale-150 transition-all duration-300" />
                      <span className="text-[10px] font-bold text-[#0f3d1a] uppercase tracking-wider">
                        {req.metric}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom CTA */}
              <div className="text-center mt-12 pt-6">
                <button className="group inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#5E6F58] to-[#d94d19] rounded-xl text-[#0f3d1a] font-bold text-sm uppercase tracking-wide transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#5E6F58]/30">
                  <span>Apply Now</span>
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#5E6F58]/30 to-transparent group-hover:via-[#5E6F58]/60 transition-all duration-700" />
            </div>
          </div>

          {/* Course Creation Standards */}
          <div className="mb-24 relative">
            {/* Main Container */}
            <div className="relative rounded-3xl overflow-hidden">
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0a0f1a] to-[#020617]" />

              {/* Left decorative large number */}
              <div className="absolute top-10 left-10 text-8xl font-black text-[#0f3d1a]/5 select-none">
                QS
              </div>

              <div className="relative p-8 sm:p-12">
                {/* Header with icon row */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#5E6F58] flex items-center justify-center shadow-lg shadow-[#5E6F58]/25 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                        <svg
                          className="w-5 h-5 text-[#0f3d1a]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <span className="text-xs font-bold text-[#0f3d1a] uppercase tracking-wider">
                        Quality Assurance
                      </span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-black text-[#0f3d1a] leading-tight text-3d">
                      Course Creation <br />
                      <span className="text-[#0f3d1a] text-3d-orange">
                        Standards
                      </span>
                    </h2>
                  </div>

                  <div className="hidden lg:block w-32 h-px bg-gradient-to-r from-[#5E6F58]/30 to-transparent" />
                </div>

                {/* Cards Grid with Only 3D Animations */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {standards.map((std, idx) => {
                    const Icon = std.icon;
                    return (
                      <div
                        key={std.title}
                        className="group relative cursor-pointer transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02]"
                        style={{ transitionDelay: `${idx * 100}ms` }}
                      >
                        {/* Card Content - No color changes on hover */}
                        <div className="relative p-6 rounded-2xl bg-white/[0.02] border border-[#1a6b2e]/10">
                          {/* Step Number Line */}
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-px h-8 bg-gradient-to-b from-[#5E6F58] to-transparent transition-all duration-300 group-hover:h-10" />
                            <span className="text-xs font-mono font-bold text-[#0f3d1a]/60 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-0.5">
                              STEP {String(idx + 1).padStart(2, "0")}
                            </span>
                          </div>

                          {/* Icon with 3D rotation only - No color change */}
                          <div className="mb-5">
                            <div className="relative">
                              <div className="absolute inset-0 rounded-xl bg-[#5E6F58]/20 blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
                              <div className="relative w-12 h-12 rounded-xl bg-[#5E6F58]/10 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6 group-hover:-translate-y-1">
                                <Icon className="w-5 h-5 text-[#0f3d1a] transition-all duration-300" />
                              </div>
                            </div>
                          </div>

                          {/* Title - No color change, only 3D movement */}
                          <h3 className="text-lg font-bold text-[#0f3d1a] mb-2 transition-all duration-300 group-hover:translate-x-1">
                            {std.title}
                          </h3>

                          {/* Description - No color change */}
                          <p className="text-sm text-[#1a6b2e] leading-relaxed">
                            {std.desc}
                          </p>

                          {/* Learn More Link - Only appears on hover */}
                          <div className="mt-5 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-2">
                            <span className="text-xs text-[#0f3d1a] font-medium">
                              Learn more
                            </span>
                            <svg
                              className="w-3 h-3 text-[#0f3d1a] transition-transform duration-300 group-hover:translate-x-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
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

                        {/* Connecting dot with pulse animation */}
                        {idx < standards.length - 1 && (
                          <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 w-4">
                            <div className="w-2 h-2 rounded-full bg-[#5E6F58]/30 transition-all duration-300 group-hover:scale-150 group-hover:animate-pulse" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Stats Bar - Only 3D animations, no color changes */}
                <div className="mt-12 pt-8 border-t border-[#1a6b2e]/10">
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 group/stat">
                        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center transition-all duration-300 group-hover/stat:scale-110 group-hover/stat:-translate-y-1">
                          <svg
                            className="w-4 h-4 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className="text-xs text-[#1a6b2e]">
                          100% Verified Standards
                        </span>
                      </div>
                      <div className="w-px h-4 bg-white/10" />
                      <div className="flex items-center gap-2 group/stat">
                        <div className="w-8 h-8 rounded-full bg-[#d94d19]/10 flex items-center justify-center transition-all duration-300 group-hover/stat:scale-110 group-hover/stat:-translate-y-1">
                          <svg
                            className="w-4 h-4 text-[#0f3d1a]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <span className="text-xs text-[#1a6b2e]">
                          Quality Checked
                        </span>
                      </div>
                    </div>

                    <div className="text-right group/stat">
                      <div className="text-2xl font-black text-[#0f3d1a] transition-all duration-300 group-hover/stat:scale-110 group-hover/stat:-translate-y-1">
                        500+
                      </div>
                      <div className="text-[10px] text-[#1a6b2e] uppercase tracking-wider">
                        Courses Published
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom right decorative */}
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#5E6F58]/5 rounded-tl-full transition-all duration-500 group-hover:scale-110" />
            </div>
          </div>


          {/* Trainer Launch Roadmap */}
          <div className="mb-24 relative">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#5E6F58]/5 via-transparent to-transparent rounded-[2.5rem] sm:rounded-[3rem] blur-3xl" />

            <div className="relative p-6 sm:p-12 md:p-16 rounded-[2.5rem] sm:rounded-[3rem] bg-gradient-to-br from-[#020617] to-[#0a0f1a] border border-[#1a6b2e]/20 shadow-2xl overflow-hidden group/main hover:shadow-[0_30px_60px_-20px_rgba(240,89,31,0.15)] transition-all duration-700">
              {/* Animated decorative elements */}
              <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#5E6F58]/10 rounded-full blur-3xl animate-pulse" />
              <div
                className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#5E6F58]/5 rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: "2s" }}
              />

              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#5E6F58]/50 to-transparent group-hover:via-[#5E6F58]/80 transition-all duration-700" />

              {/* Header Section */}
              <div className="text-center mb-16 space-y-5 relative z-10">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#5E6F58]/10 border border-[#5E6F58]/20 hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-default">
                  <Rocket className="w-4 h-4 text-[#0f3d1a]" />
                  <span className="text-xs font-black text-[#0f3d1a] uppercase tracking-widest">
                    Launch Roadmap
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0f3d1a] tracking-tight">
                  From expert to{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5E6F58] to-[#d94d19]">
                    published trainer
                  </span>
                </h2>

                <p className="text-base text-[#1a6b2e] font-medium max-w-2xl mx-auto leading-relaxed">
                  A simple review process helps you package your knowledge into
                  a polished course learners can trust.
                </p>
              </div>

              {/* Steps - Modern Design */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-[#5E6F58]/0 via-[#5E6F58]/30 to-[#5E6F58]/0" />

                {[
                  {
                    step: "01",
                    title: "Apply & Verify",
                    desc: "Submit your profile, portfolio, and preferred teaching category for review.",
                  },
                  {
                    step: "02",
                    title: "Plan the Curriculum",
                    desc: "Map lessons, assessments, and milestones with LMS-friendly structure.",
                  },
                  {
                    step: "03",
                    title: "Publish & Support",
                    desc: "Go live, answer learner questions, and keep improving your course outcomes.",
                  },
                ].map((item, idx) => (
                  <div key={item.step} className="relative group">
                    {/* Step Circle - Clean, no icon badge */}
                    <div className="relative mb-6 flex justify-center">
                      <div className="relative">
                        {/* Pulsing background */}
                        <div className="absolute inset-0 rounded-full bg-[#5E6F58]/20 blur-xl group-hover:blur-2xl transition-all duration-500" />

                        {/* Main Circle - Clean without icon badge */}
                        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#5E6F58] to-[#d94d19] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500">
                          <span className="text-2xl font-black text-[#0f3d1a] tracking-wider">
                            {item.step}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-[#0f3d1a] mb-3 group-hover:text-[#0f3d1a] transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-sm text-[#1a6b2e] group-hover:text-[#1a6b2e] leading-relaxed transition-colors duration-300">
                        {item.desc}
                      </p>
                    </div>

                    {/* Progress arrow indicator */}
                    {idx < 2 && (
                      <div className="hidden md:block absolute -right-4 top-10 w-8 h-8">
                        <div className="text-2xl text-[#0f3d1a]/30 group-hover:text-[#0f3d1a]/50 transition-all duration-300 group-hover:translate-x-1">
                          →
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* Bottom CTA */}
              <div className="text-center mt-12 pt-8 border-t border-[#1a6b2e]/10">
                <button className="group inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#5E6F58] to-[#d94d19] rounded-xl text-[#0f3d1a] font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#5E6F58]/25">
                  <span>Start Your Journey</span>
                  <Rocket className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </button>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#5E6F58]/30 to-transparent group-hover:via-[#5E6F58]/60 transition-all duration-700" />
            </div>
          </div>

          {/* Trainer Support Toolkit - Added Image */}
          <div className="mb-24 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
  {/* Left side - Image Card with Modern Design */}
  <div className="lg:col-span-5 rounded-2xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
    {/* Image Section - Larger and Clearer */}
    <div className="relative group/img overflow-hidden">
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

      {/* Heading overlay on image */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#d94d19]/20 backdrop-blur-sm border border-[#d94d19]/30 mb-3">
          <HelpCircle className="w-3.5 h-3.5 text-[#0f3d1a]" />
          <span className="text-[#0f3d1a] text-[10px] font-black uppercase tracking-widest">
            Support Toolkit
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Tools that keep trainers{" "}
          <span className="text-[#0f3d1a]">consistent</span>
        </h2>
        <p className="text-sm text-white/80 font-medium leading-relaxed">
          Trainers get workflows for feedback, student questions,
          lesson updates, and performance tracking.
        </p>
      </div>

      {/* Larger, clearer image */}
      <img
        src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&auto=format&fit=crop&q=90"
        alt="Team collaborating on dashboard"
        className="w-full h-[320px] sm:h-[380px] object-cover object-center group-hover/img:scale-110 transition-transform duration-700"
      />
    </div>

    {/* Bottom gradient accent */}
    <div className="h-1 bg-gradient-to-r from-[#d94d19] via-[#d94d19] to-[#d94d19]" />
  </div>

  {/* Right side - Tools Cards */}
  <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
    {[
      {
        title: "Feedback Templates",
        desc: "Reusable grading notes help students understand exactly what to improve.",
        icon: PenTool,
      },
      {
        title: "Live Session Planner",
        desc: "Schedule Q&A themes, class demos, and weekly learner checkpoints.",
        icon: Radio,
      },
      {
        title: "Student Question Queue",
        desc: "Keep course discussions organized so support feels fast and professional.",
        icon: MessageSquare,
      },
      {
        title: "Content Refresh Prompts",
        desc: "Spot lessons that need updates as tools, software, and standards change.",
        icon: ClipboardCheck,
      },
    ].map((tool) => {
      const Icon = tool.icon;
      return (
        <div
          key={tool.title}
          className="group p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-gray-800 hover:border-[#d94d19]/50 hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
        >
          <div className="w-11 h-11 rounded-xl bg-[#d94d19]/10 border border-[#d94d19]/25 text-[#0f3d1a] flex items-center justify-center mb-4 group-hover:bg-[#d94d19] group-hover:text-[#0f3d1a] group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mb-2">
            {tool.title}
          </h3>
          <p className="text-sm text-white/80 font-medium leading-relaxed">
            {tool.desc}
          </p>
        </div>
      );
    })}
  </div>
</div>

          {/* Revenue Model Section */}
          <div className="mb-24 relative">
            {/* Revenue Model Card */}
            <div className="relative p-6 sm:p-12 md:p-20 rounded-[2.5rem] sm:rounded-[3.5rem] bg-gradient-to-br from-[#020617] to-[#0a0f1a] border border-[#1a6b2e]/20 shadow-2xl overflow-hidden group/main hover:shadow-[0_30px_60px_-20px_rgba(240,89,31,0.15)] transition-all duration-700 text-center">
              {/* Animated background elements */}
              <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#5E6F58]/10 rounded-full blur-3xl animate-pulse" />
              <div
                className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#5E6F58]/5 rounded-full blur-3xl animate-pulse"
                style={{ animationDelay: "2s" }}
              />

              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#5E6F58]/50 to-transparent group-hover:via-[#5E6F58]/80 transition-all duration-700" />

              {/* Header Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5E6F58]/10 border border-[#5E6F58]/20 mb-6 hover:scale-105 transition-transform duration-300">
                <div className="w-1.5 h-1.5 rounded-full bg-[#5E6F58] animate-pulse" />
                <span className="text-[10px] font-black text-[#0f3d1a] uppercase tracking-widest">
                  Fair Compensation
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0f3d1a] tracking-tight mb-4">
                Revenue{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5E6F58] to-[#d94d19]">
                  Model
                </span>
              </h2>

              <p className="text-sm sm:text-base text-[#1a6b2e] font-medium max-w-2xl mx-auto leading-relaxed mb-12">
                We believe in compensating trainers fairly for their work. Our
                residual split allows you to keep the vast majority of course
                license sales.
              </p>

              {/* Revenue Split - Modern Design */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                {/* Trainer Split - 70% */}
                <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-[#5E6F58]/10 to-[#5E6F58]/5 border border-[#5E6F58]/30 hover:border-[#5E6F58]/60 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-[#5E6F58]/20 overflow-hidden">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#5E6F58]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  {/* Percentage Ring */}
                  <div className="relative mb-6 flex justify-center">
                    <div className="relative w-36 h-36">
                      {/* Animated ring */}
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="72"
                          cy="72"
                          r="64"
                          fill="none"
                          stroke="rgba(240,89,31,0.1)"
                          strokeWidth="8"
                        />
                        <circle
                          cx="72"
                          cy="72"
                          r="64"
                          fill="none"
                          stroke="url(#gradient)"
                          strokeWidth="8"
                          strokeDasharray="402"
                          strokeDashoffset="120"
                          className="group-hover:stroke-dashoffset-80 transition-all duration-1000"
                        />
                      </svg>
                      <defs>
                        <linearGradient
                          id="gradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#5E6F58" />
                          <stop offset="100%" stopColor="#5E6F58" />
                        </linearGradient>
                      </defs>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-black text-[#0f3d1a] group-hover:scale-110 transition-transform duration-500">
                          70%
                        </span>
                        <span className="text-[10px] text-[#0f3d1a]/50">Split</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#0f3d1a] mb-2 group-hover:text-[#0f3d1a] transition-colors duration-300">
                    Trainer Split
                  </h3>
                  <p className="text-sm text-[#1a6b2e] leading-relaxed">
                    You receive 70% of all course revenues generated from your
                    premium student licenses and courses.
                  </p>

                  {/* Bottom indicator */}
                  <div className="mt-6 pt-4 border-t border-[#5E6F58]/20">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#5E6F58] animate-pulse" />
                      <span className="text-[10px] font-bold text-[#0f3d1a] uppercase">
                        Highest in Industry
                      </span>
                    </div>
                  </div>
                </div>

                {/* Platform Split - 30% */}
                <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-[#1a6b2e]/20 hover:border-white/30 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl overflow-hidden">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  {/* Percentage Ring */}
                  <div className="relative mb-6 flex justify-center">
                    <div className="relative w-36 h-36">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="72"
                          cy="72"
                          r="64"
                          fill="none"
                          stroke="rgba(255,255,255,0.05)"
                          strokeWidth="8"
                        />
                        <circle
                          cx="72"
                          cy="72"
                          r="64"
                          fill="none"
                          stroke="rgba(255,255,255,0.3)"
                          strokeWidth="8"
                          strokeDasharray="402"
                          strokeDashoffset="281"
                          className="group-hover:stroke-dashoffset-240 transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-black text-[#0f3d1a]/70 group-hover:text-[#0f3d1a] group-hover:scale-110 transition-all duration-500">
                          30%
                        </span>
                        <span className="text-[10px] text-[#0f3d1a]/30">Split</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#0f3d1a] mb-2">
                    Platform Operations
                  </h3>
                  <p className="text-sm text-[#1a6b2e] leading-relaxed">
                    NextGen-LMS retains 30% to run marketing, secure payments,
                    host content, and maintain platforms.
                  </p>

                  {/* Bottom indicator */}
                  <div className="mt-6 pt-4 border-t border-[#1a6b2e]/20">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-white/40" />
                      <span className="text-[10px] font-bold text-[#0f3d1a]/40 uppercase">
                        Includes everything
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#5E6F58]/30 to-transparent group-hover:via-[#5E6F58]/60 transition-all duration-700" />
            </div>

            {/* CTA Section - Modern Design */}
            <div className="text-center mt-16 relative">
              {/* Decorative elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#5E6F58]/5 rounded-full blur-3xl" />

              <div className="relative">
                {/* Small badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5E6F58]/10 border border-[#5E6F58]/20 mb-6">
                  <Rocket className="w-3.5 h-3.5 text-[#0f3d1a]" />
                  <span className="text-[10px] font-black text-[#0f3d1a] uppercase tracking-widest">
                    Limited Slots Available
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0f3d1a] tracking-tight mb-6">
                  Ready to Share Your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5E6F58] to-[#d94d19]">
                    Knowledge?
                  </span>
                </h2>

                <p className="text-sm text-[#1a6b2e] max-w-md mx-auto mb-8">
                  Join 500+ trainers already earning on NextGen-LMS LMS
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link
                    href="/contact?type=trainer"
                    className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#5E6F58] to-[#d94d19] text-[#0f3d1a] font-bold text-sm rounded-xl shadow-lg shadow-[#5E6F58]/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#5E6F58]/40"
                  >
                    <span>Apply as Trainer</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>

                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-2 px-8 py-4 bg-[#1a6b2e]/5 border border-[#1a6b2e]/20 text-[#0f3d1a] font-bold text-sm rounded-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:border-white/20"
                  >
                    <span>Learn More</span>
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>

                {/* Social Proof */}
                {/* Social Proof */}
                <div className="flex items-center justify-center gap-8 mt-8 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-[#5E6F58]/20 border-2 border-[#020617] flex items-center justify-center"
                        >
                          <span className="text-[10px] font-bold text-[#0f3d1a]">
                            T{i}
                          </span>
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-[#1a6b2e]">
                      500+ Active Trainers
                    </span>
                  </div>
                  <div className="w-px h-4 bg-white/10" />
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg
                        key={i}
                        className="w-3 h-3 fill-yellow-400 text-yellow-400"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                    ))}
                    <span className="text-xs text-[#1a6b2e] ml-1">
                      4.9 Rating
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
