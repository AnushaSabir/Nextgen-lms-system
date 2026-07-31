import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function FinalCtaSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
      <Image src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80" alt="CTA Background" fill className="absolute inset-0 w-full h-full object-cover opacity-[0.1] pointer-events-none" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f3d1a] via-[#0f3d1a]/98 to-[#0f3d1a] z-0 pointer-events-none" />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] orange-gradient rounded-full opacity-5 blur-[100px] sm:blur-[120px] pointer-events-none z-0" />
      
      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="p-5 sm:p-12 md:p-20 rounded-[2rem] sm:rounded-[3rem] bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] relative overflow-hidden text-center reveal shadow-2xl backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(240,89,31,0.08)] to-transparent pointer-events-none" />
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#5E6F58]/5 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/5 blur-3xl rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />

          <div className="relative z-10 space-y-6 sm:space-y-8">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#c8e6c9] leading-tight tracking-tight text-3d">
              Ready to Build a Career<br />
              <span className="text-[#d94d19] text-3d-orange">You're Proud Of?</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-[#c8e6c9]/80 max-w-xl mx-auto font-medium leading-relaxed">
              Join thousands of ambitious learners and passionate educators who chose NextGen LMS to unlock their full potential. Your journey starts with a single click.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4">
              <Link href="/login?mode=signup" className="group w-full sm:w-auto px-5 py-2.5 sm:px-8 sm:py-4 bg-[#d94d19] text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-[rgba(240,89,31,0.3)] hover:bg-[#c24213] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
                <span>Start Learning Today</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/courses" className="w-full sm:w-auto px-5 py-2.5 sm:px-8 sm:py-4 bg-white/10 text-white font-semibold text-sm sm:text-base rounded-xl border border-white/20 hover:bg-white/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center">
                Browse Courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
