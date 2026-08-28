import React from 'react';
import Image from 'next/image';
import { LineChart, CheckCircle2, Users, BookOpen, Award, Star, TrendingUp, Sparkles, Zap, ShieldCheck } from 'lucide-react';

export default function LmsStatsSection() {
  const stats = [
    {
      val: '94.8%',
      title: 'Skill Mastery Rate',
      label: 'of learners achieve verified job-ready competency on their first attempt.',
      icon: <Sparkles className="w-5 h-5" />,
      tag: 'AI Benchmarked',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80',
    },
    {
      val: '500+',
      title: 'Industry Pathways',
      label: 'curated modern curricula spanning AI, Cloud, Full-Stack & Emerging Tech.',
      icon: <BookOpen className="w-5 h-5" />,
      tag: 'Active Tracks',
      image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&auto=format&fit=crop&q=80',
    },
    {
      val: '3.8x',
      title: 'Faster Career Growth',
      label: 'accelerated progress reported by certified graduates across top enterprises.',
      icon: <TrendingUp className="w-5 h-5" />,
      tag: 'Proven ROI',
      image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&auto=format&fit=crop&q=80',
    },
    {
      val: '99.4%',
      title: 'Enterprise Reliability',
      label: 'scalable uptime trusted by leading universities, academies and global teams.',
      icon: <ShieldCheck className="w-5 h-5" />,
      tag: 'Enterprise Ready',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden bg-[#323232]">
      {/* Ambient Cyber Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#50BED9]/[0.08] to-transparent rounded-full blur-[140px] pointer-events-none" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="p-6 sm:p-12 md:p-16 rounded-[2rem] sm:rounded-[3rem] border border-[#50BED9]/20 relative overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl bg-[#151515]/90">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#50BED9]/5 blur-3xl -mr-24 -mt-24 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#33C6B6]/5 blur-3xl -ml-24 -mb-24 pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-12 sm:mb-16 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#50BED9]/30 bg-[#50BED9]/10 text-[#50BED9] text-xs font-black uppercase tracking-widest mb-4 shadow-sm backdrop-blur-md">
              <LineChart className="w-3.5 h-3.5" /> Next-Gen Learning Intelligence
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              The NextGen LMS <span className="bg-gradient-to-r from-[#50BED9] via-[#159BD7] to-[#33C6B6] bg-clip-text text-transparent">Advantage</span>
            </h2>
            <p className="text-sm sm:text-base text-[#D0D3D6] max-w-2xl mx-auto font-medium leading-relaxed">
              Empowering students, instructors, and institutions with cutting-edge AI analytics, real-world projects, and industry-recognized certifications.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left items-stretch relative z-10">
            {stats.map((s, i) => (
              <div
                key={i}
                className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#353638] hover:border-[#50BED9]/50 hover:-translate-y-2 transition-all duration-500 flex flex-col h-full bg-[#101010] shadow-lg hover:shadow-[0_16px_40px_rgba(80,190,217,0.15)]"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-700 pointer-events-none"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-[#101010]/90 to-[#101010]/60 z-10" />
                
                <div className="relative z-20 p-6 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <div className="w-11 h-11 rounded-xl bg-[#353638] border border-[#50BED9]/30 text-[#50BED9] flex items-center justify-center group-hover:bg-[#50BED9] group-hover:text-[#101010] transition-colors duration-300 shadow-md">
                        {s.icon}
                      </div>
                      <div className="inline-flex items-center gap-1 rounded-full border border-[#33C6B6]/30 bg-[#33C6B6]/10 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#33C6B6]">
                        <CheckCircle2 className="w-2.5 h-2.5" /> {s.tag}
                      </div>
                    </div>
                    
                    <div className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2 leading-none bg-gradient-to-r from-white via-[#D0D3D6] to-[#50BED9] bg-clip-text text-transparent">
                      {s.val}
                    </div>
                    <h3 className="text-base font-black text-white tracking-tight mb-2 leading-snug">
                      {s.title}
                    </h3>
                  </div>

                  <p className="text-xs text-[#D0D3D6] font-medium leading-relaxed mt-2 border-t border-[#353638]/60 pt-3">
                    {s.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
