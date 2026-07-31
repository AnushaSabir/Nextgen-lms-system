import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Monitor, Palette, LineChart, Video, Megaphone, Camera, ArrowRight } from 'lucide-react';

const CAREERS = [
  { name: 'Web Developer', icon: <Monitor className="w-8 h-8" />, image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&auto=format&fit=crop&q=80' },
  { name: 'Graphic Designer', icon: <Palette className="w-8 h-8" />, image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&auto=format&fit=crop&q=80' },
  { name: 'Data Analyst', icon: <LineChart className="w-8 h-8" />, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80' },
  { name: 'Video Editor', icon: <Video className="w-8 h-8" />, image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&auto=format&fit=crop&q=80' },
  { name: 'Digital Marketer', icon: <Megaphone className="w-8 h-8" />, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop&q=80' },
  { name: 'Content Creator', icon: <Camera className="w-8 h-8" />, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80' },
];

export default function ExploreCareersSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#c8e6c9] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#5E6F58]/[0.03] to-transparent rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12 sm:mb-16 reveal">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0f3d1a] tracking-tight mb-3 text-3d">
            Explore <span className="text-primaryBlue text-3d-orange">Careers</span>
          </h2>
          <p className="text-base sm:text-lg text-[#1a6b2e] max-w-xl mx-auto">Discover the skills and technologies behind in-demand professional roles.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {CAREERS.map((career, i) => (
            <Link
              key={career.name}
              href="/courses"
              className="theme-card card-3d rounded-[1.5rem] sm:rounded-[2rem] text-center group flex flex-col items-center justify-center space-y-3 sm:space-y-4 min-h-[160px] reveal overflow-hidden relative hover:-translate-y-2.5 hover:scale-105 hover:shadow-[0_20px_50px_rgba(240,89,31,0.12)] transition-all duration-500 border border-[#1a6b2e]/10 hover:border-primaryBlue/30"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <Image src={career.image} alt={career.name} fill className="absolute inset-0 w-full h-full object-cover opacity-[1] group-hover:opacity-[1] group-hover:scale-110 transition-all duration-700" sizes="(max-width: 768px) 50vw, 16vw" />
              
              <div className="absolute inset-0 z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/90 to-[#020617]/70 translate-y-0 group-hover:-translate-y-full transition-transform duration-500 ease-out" />
              </div>
              
              <div className="relative z-20 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[#5E6F58]/10 border border-[#5E6F58]/20 flex items-center justify-center text-[#d94d19] group-hover:bg-[#5E6F58] group-hover:text-[#0f3d1a] transition-colors duration-500 shadow-inner group-hover:shadow-[0_0_20px_rgba(240,89,31,0.3)]">
                {career.icon}
              </div>
              <div className="relative z-20 text-xs sm:text-sm font-black text-[#0f3d1a] group-hover:text-[#d94d19] transition-colors leading-snug">{career.name}</div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12 sm:mt-16 reveal flex justify-center">
          <Link 
            href="/courses" 
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-[#5E6F58]/10 hover:bg-[#5E6F58] text-[#d94d19] hover:text-[#0f3d1a] font-black text-sm sm:text-base rounded-2xl border border-[#5E6F58]/30 hover:border-[#5E6F58] transition-all duration-500 overflow-hidden shadow-[0_0_20px_rgba(240,89,31,0.15)] hover:shadow-[0_15px_40px_rgba(240,89,31,0.4)] hover:-translate-y-1.5"
          >
            <div className="absolute inset-0 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
            <span className="relative z-10">Explore All Careers</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}
