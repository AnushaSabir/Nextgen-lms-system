import React from 'react';
import Image from 'next/image';
import { LineChart, CheckCircle2, Users, BookOpen, Award, Star } from 'lucide-react';

export default function LmsStatsSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden bg-navy-900">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#5E6F58]/[0.04] to-transparent rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="p-5 sm:p-12 md:p-16 rounded-[2rem] sm:rounded-[3rem] border border-orange-500/30 relative overflow-hidden shadow-[0_24px_80px_rgba(26, 107, 46, 0.1)] backdrop-blur-xl bg-navy-900/50">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 opacity-10 -mr-24 -mt-24 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 opacity-[0.04] blur-3xl -ml-24 -mb-24 pointer-events-none" />

          <div className="text-center mb-10 sm:mb-12 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-500 text-xs font-black uppercase tracking-widest mb-4 shadow-sm">
              <LineChart className="w-3.5 h-3.5" /> Industry Insights
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0f3d1a] mb-3 tracking-tight">
              NextGen LMS Is <span className="text-orange-500">Growing Fast</span>
            </h2>
            <p className="text-sm sm:text-base text-[#1a6b2e] max-w-2xl mx-auto font-medium leading-relaxed">
              Thousands of learners, educators and institutions trust NextGen LMS to power their growth every single day.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-left items-stretch relative z-10">
            {[
              {
                val: '10,000+',
                title: 'Active Students',
                label: 'learners across the globe using NextGen LMS to build real, in-demand skills.',
                icon: <Users className="w-5 h-5" />,
                image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80'
              },
              {
                val: '500+',
                title: 'Expert-Led Courses',
                label: 'industry-specific courses designed to take you from zero to job-ready, fast.',
                icon: <BookOpen className="w-5 h-5" />,
                image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&auto=format&fit=crop&q=80'
              },
              {
                val: '100+',
                title: 'Verified Instructors',
                label: 'industry professionals who bring real-world experience and proven expertise.',
                icon: <Award className="w-5 h-5" />,
                image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&auto=format&fit=crop&q=80'
              },
              {
                val: '98%',
                title: 'Satisfaction Rate',
                label: 'of our graduates say NextGen LMS genuinely helped them advance their career.',
                icon: <Star className="w-5 h-5" />,
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80'
              },
            ].map((s, i) => (
              <div
                key={i}
                className="group relative rounded-3xl overflow-hidden border border-orange-500/30 hover:-translate-y-2 transition-all duration-500 flex flex-col h-full shadow-[0_12px_34px_rgba(26, 107, 46, 0.1)] hover:shadow-[0_22px_55px_rgba(26, 107, 46, 0.1)]"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <Image src={s.image} alt={s.title} fill className="absolute inset-0 w-full h-full object-cover opacity-[0.4] group-hover:opacity-[0.5] group-hover:scale-105 transition-all duration-700" sizes="(max-width: 768px) 100vw, 25vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/95 to-navy-900/80 z-10 group-hover:via-navy-900/90 transition-all duration-500" />
                
                <div className="relative z-20 p-5 sm:p-6 flex flex-col h-full">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-500 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-[#0f3d1a] transition-colors duration-300">
                      {s.icon}
                    </div>
                    <div className="inline-flex items-center gap-1 rounded-full border border-orange-500/20 bg-orange-500/10 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-orange-500">
                      <CheckCircle2 className="w-2 h-2" /> Verified
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="text-3xl sm:text-4xl font-black tracking-tight text-orange-500 mb-2 leading-none">{s.val}</div>
                    <h3 className="text-base sm:text-lg font-black text-[#0f3d1a] tracking-tight mb-2 leading-snug">{s.title}</h3>
                    <p className="text-xs sm:text-sm text-[#1a6b2e] font-medium leading-relaxed">
                      <span className="text-orange-500 font-bold">{s.val}</span> {s.label}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
