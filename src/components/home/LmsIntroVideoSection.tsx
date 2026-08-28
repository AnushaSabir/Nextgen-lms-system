'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  ShieldCheck,
  Award,
  ArrowRight,
  Tv,
} from 'lucide-react';

export default function LmsIntroVideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-play on scroll into view using IntersectionObserver
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.muted = isMuted;
            video
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => {});
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      {
        threshold: 0.35,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [isMuted]);

  const togglePlay = () => {
    setHasInteracted(true);
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasInteracted(true);
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  return (
    <section
      ref={containerRef}
      className="py-16 sm:py-24 lg:py-28 px-4 sm:px-6 relative overflow-hidden bg-[#323232]"
    >
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[500px] bg-gradient-to-r from-[#50BED9]/10 via-[#159BD7]/10 to-[#33C6B6]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10 space-y-10 sm:space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#50BED9]/30 bg-[#151515] text-[#50BED9] text-xs font-black uppercase tracking-widest shadow-md">
            <Tv className="w-3.5 h-3.5" />
            <span>Platform Overview Video</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            See How NextGen LMS <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#50BED9] via-[#159BD7] to-[#33C6B6] bg-clip-text text-transparent">
              Powers Modern Learning
            </span>
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-[#D0D3D6] max-w-2xl mx-auto font-medium leading-relaxed">
            Watch the complete platform walkthrough to explore AI-adaptive quizzes, student analytics, institutional controls, and verifiable credentials.
          </p>
        </div>

        {/* Video Cinema Showcase Player */}
        <div className="relative rounded-2xl sm:rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden bg-[#101010] border-2 border-[#50BED9]/40 shadow-[0_25px_80px_rgba(0,0,0,0.8)]">
          <div
            className="relative aspect-video w-full overflow-hidden bg-[#151515] group cursor-pointer"
            onClick={togglePlay}
          >
            <video
              ref={videoRef}
              loop
              muted={isMuted}
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src="/videos/lms_intro.mp4" type="video/mp4" />
              <source src="/videos/lms_intro.mp4.mp4" type="video/mp4" />
              <source src="/videos/intro.mp4" type="video/mp4" />
              <source src="/videos/main_hero/new_hero.mp4.mp4" type="video/mp4" />
            </video>

            {/* Tap to Unmute Overlay Prompt on Mobile/Desktop */}
            {isMuted && isPlaying && !hasInteracted && (
              <button
                onClick={toggleMute}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 px-3.5 py-2 rounded-xl bg-black/75 border border-[#50BED9]/50 text-white text-xs font-bold flex items-center gap-2 backdrop-blur-md shadow-2xl hover:bg-[#50BED9] hover:text-[#101010] transition-all animate-bounce"
              >
                <VolumeX className="w-4 h-4 text-[#50BED9]" />
                <span>Tap for Sound</span>
              </button>
            )}

            {/* Large Play Icon when paused */}
            {!isPlaying && (
              <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] flex items-center justify-center transition-all">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-3xl bg-[#50BED9] text-[#101010] flex items-center justify-center shadow-[0_0_50px_rgba(80,190,217,0.6)] transform group-hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-current ml-1" />
                </div>
              </div>
            )}

            {/* Video Controls Bar */}
            <div
              className="absolute bottom-0 inset-x-0 p-3 sm:p-5 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex items-center justify-between z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={togglePlay}
                  className="p-2 sm:p-2.5 rounded-xl bg-[#50BED9] text-[#101010] hover:bg-[#159BD7] hover:text-white transition-colors shadow-md"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
                <button
                  onClick={toggleMute}
                  className="p-2 sm:p-2.5 rounded-xl bg-[#151515] border border-[#353638] text-white hover:text-[#50BED9] transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#50BED9]" />}
                </button>
                <span className="text-[11px] sm:text-xs font-bold text-white/90 hidden xs:inline truncate max-w-[140px] sm:max-w-none">
                  NextGen LMS Guided Tour
                </span>
              </div>

              <Link
                href="/courses"
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#50BED9]/20 border border-[#50BED9]/40 text-[#50BED9] hover:bg-[#50BED9] hover:text-[#101010] text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0"
              >
                <span>Browse Courses</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* 3 Key Takeaways Feature Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-2">
          {[
            {
              icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-[#50BED9]" />,
              title: 'Adaptive Learning Engines',
              desc: 'AI-assisted quizzes and automated lesson recaps ensure deep conceptual mastery.',
            },
            {
              icon: <Award className="w-5 h-5 sm:w-6 sm:h-6 text-[#33C6B6]" />,
              title: 'Cryptographic Credentials',
              desc: 'Tamper-proof digital certificates verifiable by top global employers.',
            },
            {
              icon: <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#159BD7]" />,
              title: 'Enterprise Campus Ready',
              desc: 'Robust admin portals, cohort performance analytics, and role-based permissions.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-[#101010] border border-[#353638] rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-2 shadow-lg flex items-start gap-4"
            >
              <div className="p-2.5 sm:p-3 rounded-2xl bg-[#151515] border border-[#353638] shrink-0">
                {item.icon}
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white mb-0.5">{item.title}</h4>
                <p className="text-xs text-[#D0D3D6] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
