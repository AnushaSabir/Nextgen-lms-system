import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Users, Play, ArrowRight, Code, Terminal, Brain, Palette, TrendingUp, Database } from 'lucide-react';

const TRENDING = [
  { id: 1, title: 'Web Development', description: 'Master HTML, CSS, JavaScript, React, Next.js, and modern web technologies.', level: 'All Levels', Icon: Code, students: '2.4k', thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&auto=format&fit=crop&q=80' },
  { id: 2, title: 'Python Programming', description: 'Learn Python from beginner to advanced with real-world projects.', level: 'All Levels', Icon: Terminal, students: '1.8k', thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format&fit=crop&q=80' },
  { id: 3, title: 'Artificial Intelligence', description: 'Explore AI, Machine Learning, Prompt Engineering, and Generative AI.', level: 'All Levels', Icon: Brain, students: '3.1k', thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80' },
  { id: 4, title: 'Graphic Design', description: 'Master Canva, Adobe Photoshop, Illustrator, and modern design principles.', level: 'All Levels', Icon: Palette, students: '900', thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&auto=format&fit=crop&q=80' },
  { id: 5, title: 'Digital Marketing', description: 'Learn SEO, Social Media Marketing, Facebook Ads, and Google Ads.', level: 'All Levels', Icon: TrendingUp, students: '1.2k', thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80' },
  { id: 6, title: 'Data Science', description: 'Analyze data, create visualizations, and build predictive models.', level: 'All Levels', Icon: Database, students: '1.5k', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80' },
];

export default function TrendingCoursesSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#c8e6c9]">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 sm:mb-16 reveal">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0f3d1a] tracking-tight mb-3 text-3d">
            Popular <span className="text-primaryBlue text-3d-orange">Courses</span>
          </h2>
          <p className="text-base sm:text-lg text-[#1a6b2e] max-w-xl mx-auto">Handpicked by our experts — the courses everyone is enrolling in right now.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {TRENDING.map((course, i) => (
            <Link
              href={`/courses/${course.id}`}
              key={course.id}
              className="theme-card card-3d rounded-[2rem] group reveal block overflow-hidden border border-[#1a6b2e]/10 hover:border-primaryBlue/30 bg-white/[0.02] hover:bg-[#1a6b2e]/5 transition-all duration-500 shadow-lg hover:shadow-[0_20px_45px_rgba(26, 107, 46, 0.1)]"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="aspect-video relative overflow-hidden rounded-t-[2rem]">
                <Image src={course.thumbnail} alt={course.title} fill className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 25vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500" />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full glass-card text-[9px] font-black text-[#0f3d1a] uppercase border border-[rgba(240,89,31,0.2)] z-10 backdrop-blur-md">{course.level}</div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/30 backdrop-blur-[2px] z-20">
                  <div className="px-5 py-2.5 bg-[#5E6F58] text-[#0f3d1a] text-xs font-black rounded-full shadow-lg shadow-primaryBlue/30 transform scale-90 group-hover:scale-100 transition-transform duration-300">View Course</div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center z-10 group-hover:opacity-0 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-[#1a6b2e]/20 shadow-lg">
                    <Play className="w-5 h-5 text-[#0f3d1a] ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="p-5 sm:p-6 space-y-2 text-left flex flex-col h-full justify-between">
                <div>
                  <h4 className="text-base sm:text-lg font-black text-[#0f3d1a] group-hover:text-[#0f3d1a] transition-colors line-clamp-1 tracking-tight leading-snug">{course.title}</h4>
                  <p className="text-sm text-[#1a6b2e]/80 line-clamp-2 mt-1">{course.description}</p>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center text-xs text-[#1a6b2e] font-medium pt-3 border-t border-[#1a6b2e]/10 mt-auto">
                  <span className="flex items-center gap-1.5"><course.Icon className="w-3.5 h-3.5 text-[#0f3d1a]" />{course.level}</span>
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-primaryBlue/50" />{course.students} Learners</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10 reveal">
          <Link href="/courses" className="inline-flex items-center gap-1.5 text-[#0f3d1a] font-black hover:underline underline-offset-8 text-sm sm:text-base">
            <span>Explore all courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
