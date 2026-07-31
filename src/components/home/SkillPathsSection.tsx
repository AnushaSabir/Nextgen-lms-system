import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bot, MonitorPlay, Film, BookOpen, FileText, TrendingUp, Award, MessageSquare, Smartphone, Cloud, ChevronRight, ArrowRight } from 'lucide-react';

const CATEGORIES = [
  {
    title: 'AI Learning Assistant',
    slug: 'ai-learning-assistant',
    tag: 'AI',
    description: 'Smart guidance',
    icon: <Bot className="w-5 h-5" />,
    glowColor: 'from-purple-500/10 to-pink-500/10',
    accentColor: 'text-purple-400 group-hover:text-purple-300',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&auto=format&fit=crop&q=80'
  },
  {
    title: 'Live Online Classes',
    slug: 'live-classes',
    tag: 'Live',
    description: 'Real-time sessions',
    icon: <MonitorPlay className="w-5 h-5" />,
    glowColor: 'from-amber-500/10 to-sky-500/10',
    accentColor: 'text-amber-400 group-hover:text-amber-300',
    image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&auto=format&fit=crop&q=80'
  },
  {
    title: 'Recorded Video Lessons',
    slug: 'recorded-lessons',
    tag: 'Video',
    description: 'Learn anytime',
    icon: <Film className="w-5 h-5" />,
    glowColor: 'from-red-500/10 to-orange-600/10',
    accentColor: 'text-red-400 group-hover:text-red-300',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&auto=format&fit=crop&q=80'
  },
  {
    title: 'Course Management',
    slug: 'course-management',
    tag: 'Manage',
    description: 'Organize courses',
    icon: <BookOpen className="w-5 h-5" />,
    glowColor: 'from-cyan-500/10 to-blue-500/10',
    accentColor: 'text-cyan-400 group-hover:text-cyan-300',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&auto=format&fit=crop&q=80'
  },
  {
    title: 'Assignments & Quizzes',
    slug: 'assignments-quizzes',
    tag: 'Assess',
    description: 'Test knowledge',
    icon: <FileText className="w-5 h-5" />,
    glowColor: 'from-teal-500/10 to-emerald-500/10',
    accentColor: 'text-teal-400 group-hover:text-teal-300',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80'
  },
  {
    title: 'Student Progress Tracking',
    slug: 'progress-tracking',
    tag: 'Track',
    description: 'Monitor growth',
    icon: <TrendingUp className="w-5 h-5" />,
    glowColor: 'from-primaryBlue/10 to-sky-500/10',
    accentColor: 'text-primaryBlue group-hover:text-orange-300',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=80'
  },
  {
    title: 'Certificates',
    slug: 'certificates',
    tag: 'Award',
    description: 'Earn recognition',
    icon: <Award className="w-5 h-5" />,
    glowColor: 'from-indigo-500/10 to-blue-600/10',
    accentColor: 'text-indigo-400 group-hover:text-indigo-300',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&auto=format&fit=crop&q=80'
  },
  {
    title: 'Discussion Forums',
    slug: 'discussion-forums',
    tag: 'Community',
    description: 'Engage with peers',
    icon: <MessageSquare className="w-5 h-5" />,
    glowColor: 'from-blue-500/10 to-violet-500/10',
    accentColor: 'text-blue-400 group-hover:text-blue-300',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&auto=format&fit=crop&q=80'
  },
  {
    title: 'Mobile-Friendly Design',
    slug: 'mobile-friendly',
    tag: 'Mobile',
    description: 'Learn on the go',
    icon: <Smartphone className="w-5 h-5" />,
    glowColor: 'from-pink-500/10 to-rose-500/10',
    accentColor: 'text-pink-400 group-hover:text-pink-300',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&auto=format&fit=crop&q=80'
  },
  {
    title: 'Secure Cloud Platform',
    slug: 'secure-cloud',
    tag: 'Secure',
    description: 'Safe and reliable',
    icon: <Cloud className="w-5 h-5" />,
    glowColor: 'from-emerald-500/10 to-green-500/10',
    accentColor: 'text-emerald-400 group-hover:text-emerald-300',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&auto=format&fit=crop&q=80'
  }
];

export default function SkillPathsSection() {
  return (
    <section id="explore" className="relative py-20 sm:py-28 lg:py-32 overflow-hidden bg-[#c8e6c9] border-y border-[rgba(255,255,255,0.04)] z-10">
      <div className="absolute inset-0 hero-grid opacity-[0.02] pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#5E6F58]/[0.03] to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 left-1/4 w-[500px] h-[300px] bg-gradient-to-t from-blue-500/[0.02] to-transparent rounded-full blur-[80px] pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 relative z-20">
        <div className="mx-auto max-w-4xl text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#5E6F58]/20 bg-[#5E6F58]/5 text-[#d94d19] text-xs font-black uppercase tracking-widest backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#5E6F58] animate-pulse" />
            Core Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f3d1a] tracking-tight text-3d leading-tight">
            NextGen LMS <span className="text-[#d94d19] text-3d-orange">Features</span>
          </h2>
          <p className="mx-auto lg:mx-0 max-w-3xl text-sm sm:text-base text-[#1a6b2e] font-medium leading-relaxed sm:leading-7">
            A comprehensive suite of tools and features designed to make your learning experience engaging, efficient, and truly transformative. Everything you need to learn smarter is right here.
          </p>
        </div>
      </div>

      {/* ── PREMIUM INTERACTIVE CAROUSEL ── */}
      <div className="relative w-full overflow-hidden py-6 sm:py-8 marquee-wrap">
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-48 lg:w-56 bg-gradient-to-r from-[#0f3d1a] via-[#0f3d1a]/80 to-transparent pointer-events-none z-20" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-48 lg:w-56 bg-gradient-to-l from-[#0f3d1a] via-[#0f3d1a]/80 to-transparent pointer-events-none z-20" />

        <div className="flex w-max">
          <div className="animate-marquee-premium flex gap-5 sm:gap-6 lg:gap-8 shrink-0 px-4 sm:px-6">
            {[...CATEGORIES, ...CATEGORIES, ...CATEGORIES].map((cat, idx) => (
              <Link
                key={idx}
                href={`/courses?category=${cat.slug}`}
                className="group relative flex items-center gap-3 sm:gap-5 p-3 sm:p-6 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-[#5E6F58]/30 transition-all duration-500 ease-out min-w-[240px] sm:min-w-[300px] lg:min-w-[320px] overflow-hidden shadow-[0_4px_20px_rgba(26,107,46,0.1)] hover:shadow-[0_20px_50px_rgba(240,89,31,0.15)] hover:-translate-y-2"
                style={{ transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                {cat.image && (
                  <>
                    <Image src={cat.image} alt={cat.title} fill className="absolute inset-0 w-full h-full object-cover opacity-[0.15] group-hover:opacity-[0.25] transition-opacity duration-700 rounded-2xl" sizes="320px" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0f3d1a]/95 to-[#0f3d1a]/80 group-hover:from-[#133937]/90 group-hover:to-[#133937]/70 transition-all duration-500 rounded-2xl z-10" />
                  </>
                )}
                
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.glowColor} opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl pointer-events-none z-0`} />
                
                <div className={`relative z-20 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/[0.05] border border-white/[0.1] ${cat.accentColor} group-hover:scale-110 group-hover:border-[#5E6F58]/30 transition-all duration-500 shadow-inner group-hover:shadow-[0_0_20px_rgba(240,89,31,0.2)]`}>
                  <div className="w-6 h-6 sm:w-7 sm:h-7">
                    {cat.icon}
                  </div>
                </div>

                <div className="relative z-20 flex flex-col flex-1 text-left min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#d94d19] group-hover:text-white transition-colors duration-300">
                    {cat.tag}
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-white group-hover:text-[#d94d19] transition-colors duration-300 mt-1 line-clamp-2">
                    {cat.title}
                  </h3>
                  <span className="text-xs sm:text-sm text-white/70 group-hover:text-white/90 transition-colors duration-300 font-medium mt-1.5 line-clamp-1">
                    {cat.description}
                  </span>
                </div>

                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-[#d94d19] z-20">
                  <ChevronRight className="w-5 h-5" />
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#5E6F58] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex justify-center">
          <Link 
            href="/courses" 
            className="group relative inline-flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-[#5E6F58] to-[#C6D6C0] text-[#0f3d1a] font-bold text-sm rounded-xl shadow-[0_8px_25px_rgba(240,89,31,0.25)] hover:shadow-[0_12px_35px_rgba(240,89,31,0.4)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
          >
            <div className="absolute inset-0 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
            <span className="relative z-10">Explore All Paths</span>
            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}
