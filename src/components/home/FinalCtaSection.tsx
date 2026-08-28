import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Star, Trophy, Users, CheckCircle2 } from 'lucide-react';

export default function FinalCtaSection() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden bg-[#323232]">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[500px] bg-gradient-to-r from-[#50BED9]/10 via-[#159BD7]/10 to-[#33C6B6]/10 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="p-8 sm:p-14 md:p-20 rounded-[2.5rem] sm:rounded-[3.5rem] bg-[#101010] border border-[#50BED9]/25 relative overflow-hidden text-center shadow-[0_30px_100px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
          
          {/* Subtle Grid Accent */}
          <div className="absolute inset-0 bg-[radial-gradient(#50BED9_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#50BED9]/10 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#33C6B6]/10 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
            
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#50BED9]/30 bg-[#353638]/80 text-[#50BED9] text-xs font-black uppercase tracking-widest shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-[#50BED9]" />
              <span>AI-Powered Skill Acceleration</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-[1.15] tracking-tight">
              Ready to Supercharge Your <br />
              <span className="bg-gradient-to-r from-[#50BED9] via-[#159BD7] to-[#33C6B6] bg-clip-text text-transparent">
                Learning Journey?
              </span>
            </h2>

            {/* Subtext */}
            <p className="text-sm sm:text-base md:text-lg text-[#D0D3D6] max-w-2xl mx-auto font-medium leading-relaxed">
              Join thousands of driven students, industry trainers, and leading institutions utilizing NextGen LMS for adaptive skill mastery and career breakthroughs.
            </p>

            {/* Feature Badges Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 max-w-xl mx-auto">
              {[
                { icon: <Zap className="w-4 h-4 text-[#50BED9]" />, text: 'Adaptive AI Quizzes' },
                { icon: <Trophy className="w-4 h-4 text-[#33C6B6]" />, text: 'Verified Certificates' },
                { icon: <Users className="w-4 h-4 text-[#159BD7]" />, text: '1-on-1 Mentorship' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#151515] border border-[#353638] text-xs font-bold text-[#D0D3D6]">
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/login?mode=signup"
                className="group w-full sm:w-auto px-8 py-4 bg-[#50BED9] hover:bg-[#159BD7] text-[#101010] hover:text-white font-black text-sm sm:text-base rounded-2xl shadow-[0_10px_30px_rgba(80,190,217,0.35)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Get Started for Free</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/courses"
                className="w-full sm:w-auto px-8 py-4 bg-[#151515] border border-[#353638] hover:border-[#50BED9]/50 text-white font-bold text-sm sm:text-base rounded-2xl hover:bg-[#353638] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <span>Browse All Courses</span>
              </Link>
            </div>

            {/* Bottom Trust Indicators */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-[11px] font-semibold text-[#D0D3D6]/70">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#33C6B6]" /> Instant Access
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#33C6B6]" /> No Credit Card Required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#33C6B6]" /> 4.9/5 Rating (10k+ Reviews)
              </span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
