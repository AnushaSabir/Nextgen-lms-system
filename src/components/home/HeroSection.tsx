'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Award, Play, Pause, Star, Zap, Users, BookOpen, TrendingUp } from 'lucide-react';

const AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&auto=format&fit=crop',
];

const HERO_STATS = [
  { label: 'Learners', value: '50K+', icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { label: 'Courses', value: '1.2K+', icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { label: 'Satisfaction', value: '98%', icon: <Star className="w-4 h-4 sm:w-5 sm:h-5" /> },
  { label: 'Active Users', value: '4K+', icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5" /> },
];

const HERO_SLIDES = [
  {
    badge: "LEARN FROM THE BEST",
    highlight: "NextGen-LMS Platform",
    title: (
      <>
        Master High-Income <br className="hidden sm:block" />
        <span className="text-[#d94d19] drop-shadow-sm">Digital Skills.</span>
      </>
    ),
    desc: "Experience world-class courses taught by top industry experts. Master programming, AI, and design with structured assessments and real-world projects.",
    ctaText: "Explore Courses",
    ctaLink: "/courses",
    secCtaText: "Partner Institutes",
    secCtaLink: "/for-institutions",
    video: "/videos/main_hero/new_hero.mp4"
  },
  {
    badge: "GLOBAL STANDARDS",
    highlight: "Get Verified & Certified",
    title: (
      <>
        Earn Professional <br className="hidden sm:block" />
        <span className="text-[#d94d19] drop-shadow-sm">Verified Badges.</span>
      </>
    ),
    desc: "Every certificate you earn is verified by certified trainers and directly synced with your live freelance profile on NextGen-LMS, showing real proof of expertise.",
    ctaText: "How It Works",
    ctaLink: "/how-it-works",
    secCtaText: "Apply as Trainer",
    secCtaLink: "/for-trainers",
    video: "/videos/main_hero/new_hero.mp4"
  },
  {
    badge: "INSTANT INCOME FLOW",
    highlight: "Bridge the Gap to success",
    title: (
      <>
        Launch Your Tech <br className="hidden sm:block" />
        <span className="text-[#d94d19] drop-shadow-sm">Freelance Career.</span>
      </>
    ),
    desc: "NextGen-LMS connects certified students directly to global client contracts on our active freelance marketplace. Work, deliver, and get paid instantly.",
    ctaText: "Join Now",
    ctaLink: "/login?mode=signup",
    secCtaText: "Pricing Plans",
    secCtaLink: "/pricing",
    video: "/videos/main_hero/new_hero.mp4"
  }
];

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const t = setInterval(() => {
      setActiveSlide(s => (s + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const togglePlayPause = () => {
    const newIsPlaying = !isPlaying;
    setIsPlaying(newIsPlaying);
    videoRefs.current.forEach(video => {
      if (video) {
        if (newIsPlaying) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    });
  };

  return (
    <>
      <section className="relative min-h-[85vh] sm:min-h-[80vh] lg:min-h-screen flex items-start sm:items-center px-4 sm:px-6 pt-20 sm:pt-28 pb-4 sm:pb-20 overflow-hidden">
        {/* ── Full-bleed Video — NO overlays, shows 100% original ── */}
        <div className="absolute inset-0 overflow-hidden z-0">
          {HERO_SLIDES.map((slide, idx) => (
            <video
              key={idx}
              autoPlay
              muted
              loop
              playsInline
              preload={idx === 0 ? "auto" : "none"}
              ref={el => {
                videoRefs.current[idx] = el;
                if (el) {
                  el.muted = true;
                  el.defaultMuted = true;
                  if (isPlaying) el.play().catch(() => {});
                  else el.pause();
                }
              }}
              className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-1000 ${
                activeSlide === idx ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <source src={slide.video} type="video/mp4" />
            </video>
          ))}
          {/* Only a very subtle bottom vignette so stats bar is readable */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/40 to-transparent z-20 pointer-events-none" />
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className="absolute bottom-4 right-3 sm:bottom-10 sm:right-8 z-40 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-white/30 border border-white/40 backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 sm:w-5 sm:h-5" /> : <Play className="w-3.5 h-3.5 sm:w-5 sm:h-5 ml-0.5 sm:ml-1" />}
        </button>

        <div className="container mx-auto relative z-30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-12 lg:gap-16 items-center">
            {/* LEFT — Text */}
            <div className="lg:col-span-7 space-y-2.5 sm:space-y-8 text-left max-w-2xl py-4 sm:py-0">

              {/* Badge */}
              <div className="inline-flex flex-wrap items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-4 sm:py-2 rounded-full border border-white/40 bg-white/20 backdrop-blur-md text-xs sm:text-sm font-semibold text-white shadow-lg animate-fade-in">
                <span className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#1a6b2e] shadow-inner">
                  <Award className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                </span>
                <span className="uppercase tracking-widest text-[9px] sm:text-[10px] font-black text-white sm:mr-1 drop-shadow">
                  {HERO_SLIDES[activeSlide].badge}
                </span>
                <span className="text-white/70 hidden sm:inline">| {HERO_SLIDES[activeSlide].highlight}</span>
              </div>

              {/* Heading */}
              <h1 className="text-[1.85rem] sm:text-5xl md:text-6xl font-black leading-[1.06] sm:leading-[1.1] tracking-tight text-white drop-shadow-lg transition-all duration-700 max-w-none">
                {HERO_SLIDES[activeSlide].title}
              </h1>

              {/* Description */}
              <p className="text-xs sm:text-base md:text-lg text-white/80 leading-5 sm:leading-relaxed font-medium max-w-[32rem] drop-shadow">
                {HERO_SLIDES[activeSlide].desc}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 pt-0.5 sm:pt-2">
                <Link href={HERO_SLIDES[activeSlide].ctaLink}
                  className="group w-auto min-w-[180px] sm:min-w-0 flex items-center justify-center gap-1.5 sm:gap-2 px-4 py-1.5 sm:px-6 sm:py-2.5 bg-[#1a6b2e] hover:bg-[#0f3d1a] text-white font-black text-[11px] sm:text-sm rounded-lg sm:rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 active:scale-95 text-center">
                  <span>{HERO_SLIDES[activeSlide].ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link href={HERO_SLIDES[activeSlide].secCtaLink}
                  className="w-auto min-w-[180px] sm:min-w-0 flex items-center justify-center gap-1.5 sm:gap-2 px-4 py-1.5 sm:px-6 sm:py-2.5 rounded-lg sm:rounded-xl border border-white/50 bg-white/10 text-white font-semibold text-[11px] sm:text-sm backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:bg-white/20 active:scale-95 text-center">
                  <span>{HERO_SLIDES[activeSlide].secCtaText}</span>
                </Link>
              </div>

              {/* Avatars & Rating */}
              <div className="flex items-center gap-2.5 sm:gap-6 pt-0.5 sm:pt-4">
                <div className="flex -space-x-2.5 sm:-space-x-3">
                  {AVATARS.map((src, i) => (
                    <Image
                      key={i}
                      src={src}
                      alt="learner avatar"
                      width={40}
                      height={40}
                      className="w-7 h-7 sm:w-10 sm:h-10 rounded-full border-2 border-white/50 object-cover"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#1a6b2e] text-[#1a6b2e]" />)}</div>
                  <p className="text-[10px] sm:text-xs text-white/70 mt-0.5 font-semibold leading-snug">50,000+ learners trust NextGen-LMS</p>
                </div>
              </div>
            </div>

            {/* RIGHT — Floating Widget */}
            <div className="lg:col-span-5 hidden lg:flex items-center justify-center h-[520px] relative">
              <div className="absolute w-[380px] h-[380px] rounded-full border border-white/20 animate-spin-slow" />
              <div className="absolute w-[280px] h-[280px] rounded-full border border-white/10" style={{ animation: 'spin-slow 15s linear infinite reverse' }} />

              <div className="relative z-10 w-28 h-28 bg-[#1a6b2e]/90 backdrop-blur-xl rounded-3xl flex flex-col items-center justify-center border border-white/30 shadow-xl animate-float-slow hover:rotate-6 transition-transform">
                <Award className="w-8 h-8 text-white mb-1" />
                <span className="text-white font-black text-[9px] tracking-widest drop-shadow-sm">CERTIFIED</span>
              </div>

              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
                <div className="bg-white/80 backdrop-blur-md w-48 p-4 rounded-xl shadow-lg border border-white/50 transition-all hover:scale-105">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#1a6b2e]/20 rounded-lg flex items-center justify-center text-[#0f3d1a]">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[#0f3d1a] font-black text-base leading-none">87%</div>
                      <div className="text-[#1a6b2e] font-bold text-[10px] mt-0.5">Success Rate</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-md w-48 p-4 rounded-xl shadow-lg border border-white/50 transition-all hover:scale-105">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#a8c97a]/20 rounded-lg flex items-center justify-center text-[#0f3d1a]">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[#0f3d1a] font-black text-base leading-none">50K+</div>
                      <div className="text-[#1a6b2e] font-bold text-[10px] mt-0.5">Active Learners</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slide Dots */}
          <div className="flex items-center justify-start gap-2.5 sm:gap-3 mt-2 sm:mt-16">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`h-2 sm:h-2.5 rounded-full transition-all duration-500 ${activeSlide === idx
                  ? 'w-8 sm:w-10 bg-[#1a6b2e] shadow-md'
                  : 'w-2 sm:w-2.5 bg-white/40 hover:bg-white/70'
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Desktop Stats Bar */}
          <div className="hidden md:grid mt-24 grid-cols-4 gap-6 p-8 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30">
            {HERO_STATS.map((stat, i) => (
              <div key={i} className="text-center reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="flex justify-center mb-1.5 text-[#1a6b2e] drop-shadow">{stat.icon}</div>
                <div className="text-3xl font-black text-white mb-0.5 drop-shadow-md">{stat.value}</div>
                <div className="text-[10px] text-white/70 uppercase tracking-wider font-extrabold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Stats */}
      <section className="block md:hidden px-4 pb-8 bg-[#c8e6c9] relative z-30">
        <div className="grid grid-cols-2 gap-3 p-5 rounded-[2rem] bg-white shadow-md border border-[#1a6b2e]/20">
          {HERO_STATS.map((stat, i) => (
            <div key={i} className="bg-[#c8e6c9] border border-[#1a6b2e]/20 p-5 rounded-2xl text-center py-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-md">
              <div className="flex justify-center mb-3 text-[#1a6b2e]">{stat.icon}</div>
              <div className="text-xl font-black text-[#0f3d1a] leading-tight">{stat.value}</div>
              <div className="text-[9px] text-[#1a6b2e] uppercase tracking-wider font-extrabold mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
