import React from 'react'
import Link from 'next/link'
import { 
  BookOpen, Award, Users, Code, Bot, ShoppingBag, Cpu, 
  ArrowRight, Sparkles, ShieldCheck, Zap, CheckCircle2,
  ChevronRight, PlayCircle
} from 'lucide-react'
import { courses } from '@/data/courses'

const iconMap: Record<string, React.ElementType> = {
  Code, Bot, ShoppingBag, Cpu,
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#001229] selection:bg-[#FF6B00]/30 selection:text-white font-sans overflow-x-hidden">
      {/* Premium Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#001229]/90 supports-[backdrop-filter]:bg-[#001229]/70 supports-[backdrop-filter]:backdrop-blur-xl border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 md:h-28 flex items-center justify-between">
          <div className="flex items-center space-x-3 md:space-x-4 group cursor-pointer">
            {/* ENLARGED LOGO */}
            <div className="relative h-16 w-40 md:h-24 md:w-56 flex items-center justify-start transition-transform duration-300 group-hover:scale-105">
              <img 
                src="/logo.png" 
                alt="NextGen Logo" 
                className="max-h-full max-w-full object-contain" 
                style={{ filter: 'invert(1) hue-rotate(180deg) brightness(1.5) contrast(1.2)', mixBlendMode: 'screen' }} 
              />
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-10">
            <Link href="#programs" className="text-sm font-semibold text-gray-300 hover:text-[#FF6B00] transition-colors">Programs</Link>
            <Link href="#platform" className="text-sm font-semibold text-gray-300 hover:text-[#FF6B00] transition-colors">Platform</Link>
          </div>

          <div className="flex items-center space-x-4 md:space-x-6">
            <Link href="/login" className="hidden sm:block text-sm font-bold text-gray-300 hover:text-white transition-colors">
              Log in
            </Link>
            <Link href="/signup">
              <button className="bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] hover:from-[#E66000] hover:to-[#FF6B00] text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-bold text-sm transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,107,0,0.4)] hover:shadow-[0_0_30px_rgba(255,107,0,0.6)] transform hover:-translate-y-1">
                Get Started <ChevronRight size={18} />
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-20 md:pt-28">
        {/* Cinematic Premium Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center pt-10 pb-20 md:py-32 overflow-hidden">
          {/* Custom Background Image */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-in-out transform scale-100 hover:scale-105"
            style={{ backgroundImage: "url('/hero_campus_ai_text.png')" }}
          ></div>
          
          {/* Dark Elegant Overlay */}
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#001229]/80 via-[#001229]/60 to-[#001229]/90"></div>
          <div className="absolute inset-0 z-0 bg-black/30"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center flex flex-col items-center mt-10">
            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#001A3B]/80 backdrop-blur-md border border-[#002855] text-xs md:text-sm font-semibold text-[#FF6B00] mb-8 md:mb-10 shadow-[0_0_20px_rgba(0,40,85,0.6)]">
              <Sparkles size={16} />
              <span>Premium AI & Tech Academy</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tighter mb-6 md:mb-8 leading-[1.05] px-2 drop-shadow-2xl">
              Empowering the Future <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#FF8C00] to-[#FFAA00] drop-shadow-lg">
                with AI & Technology
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-3xl mb-10 md:mb-14 font-medium leading-relaxed px-4 drop-shadow-md">
              Learn cutting-edge AI, development, and digital skills at NextGen IT Institute.
            </p>
            
            <div className="flex flex-col w-full sm:w-auto sm:flex-row gap-4 md:gap-6 justify-center items-center px-6">
              <Link href="/signup" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-[#FF6B00] hover:bg-[#E66000] text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-extrabold text-base md:text-lg flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-[0_15px_35px_rgba(255,107,0,0.4)]">
                  Start Your Journey
                  <ArrowRight size={22} />
                </button>
              </Link>
              <Link href="#programs" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-[#001A3B]/60 backdrop-blur-md hover:bg-[#001A3B] text-white border-2 border-[#002855] hover:border-[#FF6B00]/50 px-8 md:px-10 py-4 md:py-5 rounded-full font-extrabold text-base md:text-lg flex items-center justify-center gap-3 transition-all">
                  <PlayCircle size={22} className="text-[#FF6B00]" />
                  Explore Programs
                </button>
              </Link>
            </div>
            
            {/* Premium Stats */}
            <div className="mt-20 md:mt-32 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-5xl px-4 relative z-20">
              {[
                { label: 'Active Students', value: '10,000+' },
                { label: 'Premium Courses', value: '50+' },
                { label: 'Success Rate', value: '98%' },
                { label: 'Industry Partners', value: '200+' },
              ].map((stat, i) => (
                <div key={i} className="bg-[#001A3B]/60 border border-[#002855]/80 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 hover:bg-[#002855]/90 hover:border-[#FF6B00]/40 transition-all duration-300 transform hover:-translate-y-1 shadow-2xl">
                  <div className="text-3xl md:text-5xl font-black text-white mb-2 drop-shadow-md">{stat.value}</div>
                  <div className="text-xs md:text-sm text-[#FF6B00] font-bold tracking-widest uppercase">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic Course Showcase */}
        <section id="programs" className="py-24 md:py-32 relative bg-[#000E1F]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-6 text-center md:text-left">
              <div className="max-w-2xl mx-auto md:mx-0">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Elite <span className="text-[#FF6B00]">Curriculum</span></h2>
                <p className="text-gray-400 text-lg md:text-xl">Master high-demand skills through structured paths curated by industry experts.</p>
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {courses.map((course) => {
                const IconComponent = iconMap[course.iconName] || BookOpen;
                return (
                  <div key={course.id} className="group relative bg-[#001229] rounded-3xl border border-[#002855] overflow-hidden hover:border-[#FF6B00]/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,26,59,0.8)] flex flex-col">
                    <div className={`h-40 md:h-48 bg-gradient-to-br from-[#001A3B] to-[#000E1F] relative flex items-center justify-center overflow-hidden border-b border-[#002855]`}>
                      <div className="absolute inset-0 bg-[#FF6B00]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <IconComponent className="text-[#FF6B00] w-16 h-16 md:w-20 md:h-20 drop-shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 relative z-10" strokeWidth={1.2} />
                    </div>
                    
                    <div className="p-6 md:p-8 relative z-10 flex flex-col flex-grow">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] md:text-xs font-black text-[#FF6B00] bg-[#FF6B00]/10 px-3 py-1.5 rounded-full uppercase tracking-widest">
                          {course.category}
                        </span>
                        <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                          <Zap size={14} className="text-[#FF6B00]" />
                          {course.duration}
                        </span>
                      </div>
                      
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-3 leading-snug group-hover:text-[#FF6B00] transition-colors">{course.title}</h3>
                      <p className="text-gray-400 text-sm mb-8 line-clamp-3 leading-relaxed flex-grow">
                        {course.description}
                      </p>
                      
                      <Link href={`/courses/${course.slug}`} className="mt-auto block">
                        <button className="w-full py-3.5 md:py-4 rounded-xl bg-[#001A3B] text-white font-bold text-sm hover:bg-[#FF6B00] hover:text-white transition-all duration-300 flex justify-center items-center gap-2 group/btn border border-[#002855] hover:border-[#FF6B00]">
                          Explore Course
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform" />
                        </button>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Premium Features Section */}
        <section id="platform" className="py-24 md:py-32 relative bg-[#001229]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16 md:mb-24">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6">The Ultimate Learning <span className="text-[#FF6B00]">Platform</span></h2>
              <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">Experience a frictionless learning environment built with state-of-the-art technology.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: ShieldCheck, title: "Enterprise-Grade LMS", desc: "A robust, secure learning management system designed for high performance.", color: "text-[#00A3FF]" },
                { icon: Award, title: "Interactive Assessments", desc: "Real-time grading, dynamic quizzes, and comprehensive analytical reports.", color: "text-[#FF6B00]" },
                { icon: Users, title: "Collaborative Ecosystem", desc: "Connect with peers, engage in discussions, and get instant support.", color: "text-[#00E5FF]" }
              ].map((feature, i) => (
                <div key={i} className="bg-[#001A3B]/40 border border-[#002855] p-8 md:p-12 rounded-3xl hover:bg-[#001A3B] hover:border-[#FF6B00]/30 transition-all duration-500 relative overflow-hidden group">
                  <div className={`w-16 h-16 rounded-2xl bg-[#001229] flex items-center justify-center mb-8 border border-[#002855] group-hover:scale-110 transition-transform duration-500 ${feature.color}`}>
                    <feature.icon className="w-8 h-8" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-400 text-base leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden bg-[#000E1F]">
          <div className="max-w-5xl mx-auto px-4 relative z-10">
            <div className="bg-gradient-to-br from-[#FF6B00] to-[#E66000] rounded-[2.5rem] p-10 md:p-24 text-center relative overflow-hidden shadow-[0_20px_50px_rgba(255,107,0,0.3)]">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 relative z-10 tracking-tight">Ready to accelerate your career?</h2>
              <p className="text-white/90 text-xl max-w-2xl mx-auto mb-12 relative z-10 font-medium">Join thousands of students who have transformed their professional lives through our immersive programs.</p>
              
              <div className="flex justify-center relative z-10">
                <Link href="/signup">
                  <button className="bg-[#001229] text-white hover:bg-[#001A3B] px-10 py-5 rounded-full font-black text-lg shadow-2xl hover:shadow-3xl transition-all transform hover:-translate-y-2 border border-[#002855]">
                    Create Your Free Account
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-[#002855] bg-[#000E1F] pt-16 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center group cursor-pointer">
              <div className="relative h-12 w-32 md:h-16 md:w-40 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <img src="/logo.png" alt="NextGen Logo" className="max-h-full max-w-full object-contain opacity-90 group-hover:opacity-100 transition-opacity" style={{ filter: 'invert(1) hue-rotate(180deg) brightness(1.5) contrast(1.2)', mixBlendMode: 'screen' }} />
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium">© 2026 NextGen IT Institute. All rights reserved.</p>
            <div className="flex gap-4">
              {['IG', 'TW', 'LI'].map((social) => (
                <span key={social} className="w-12 h-12 text-sm rounded-full bg-[#001A3B] flex items-center justify-center text-gray-400 hover:text-[#FF6B00] hover:bg-[#002855] transition-all cursor-pointer font-bold">
                  {social}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
