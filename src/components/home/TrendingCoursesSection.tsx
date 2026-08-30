import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Users, Play, ArrowRight, Code, Terminal, Brain, Palette, TrendingUp, Database, ShieldCheck, Sparkles, Globe, Smartphone, Video } from 'lucide-react';

const TRENDING = [
  {
    id: 1, num: '01',
    title: 'Python Programming',
    description: 'Learn Python from basics to advanced — data structures, OOP, automation, and real-world projects.',
    level: 'All Levels', Icon: Terminal, students: '6.2k',
    badge: '🐍',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 2, num: '02',
    title: 'Web Development',
    description: 'Master HTML, CSS, JavaScript, React 19, Next.js 15 and ship production-grade full-stack apps.',
    level: 'Beginner to Pro', Icon: Code, students: '4.4k',
    badge: '🌐',
    thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 3, num: '03',
    title: 'Artificial Intelligence',
    description: 'Explore Machine Learning, Generative AI, LangChain, RAG pipelines, and autonomous AI agents.',
    level: 'Intermediate', Icon: Brain, students: '5.1k',
    badge: '🤖',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 4, num: '04',
    title: 'Graphic Design',
    description: 'Create stunning visuals with Adobe Photoshop, Illustrator, Figma, and modern design principles.',
    level: 'All Levels', Icon: Palette, students: '2.1k',
    badge: '🎨',
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 5, num: '05',
    title: 'Digital Marketing',
    description: 'Master SEO, Google Ads, Facebook Ads, email campaigns, and data-driven growth strategies.',
    level: 'All Levels', Icon: TrendingUp, students: '3.2k',
    badge: '📈',
    thumbnail: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 6, num: '06',
    title: 'Data Science',
    description: 'Analyze datasets, build ML models, and create compelling dashboards using Python and Power BI.',
    level: 'Intermediate', Icon: Database, students: '2.8k',
    badge: '📊',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 7, num: '07',
    title: 'Cybersecurity',
    description: 'Penetration testing, ethical hacking, vulnerability assessments, and SIEM security operations.',
    level: 'Intermediate', Icon: ShieldCheck, students: '1.9k',
    badge: '🔐',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 8, num: '08',
    title: 'Prompt Engineering',
    description: 'Master advanced prompt frameworks, ChatGPT, Claude, Midjourney, and AI workflow automations.',
    level: 'All Levels', Icon: Sparkles, students: '3.8k',
    badge: '⚡',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 9, num: '09',
    title: 'Cloud & DevOps',
    description: 'AWS, Docker, Kubernetes, CI/CD pipelines, Terraform, and enterprise cloud architecture.',
    level: 'Intermediate', Icon: Globe, students: '2.3k',
    badge: '☁️',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 10, num: '10',
    title: 'Mobile App Development',
    description: 'Build cross-platform iOS & Android apps using React Native, Expo, and Supabase backends.',
    level: 'Intermediate', Icon: Smartphone, students: '1.7k',
    badge: '📱',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80',
  },
];

export default function TrendingCoursesSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#101010]">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 sm:mb-16 reveal">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#50BED9]/30 bg-[#151515] text-[#50BED9] text-xs font-black uppercase tracking-widest shadow-md mb-4">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Most Popular Courses</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            Top <span className="bg-gradient-to-r from-[#50BED9] via-[#159BD7] to-[#33C6B6] bg-clip-text text-transparent">10 Courses</span>
          </h2>
          <p className="text-sm sm:text-base text-[#D0D3D6] max-w-xl mx-auto font-medium">
            Handpicked by our experts — the courses everyone is enrolling in right now.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 sm:gap-6">
          {TRENDING.map((course, i) => (
            <Link
              href={`/courses/${course.id}`}
              key={course.id}
              className="bg-[#1a1a1a] border border-[#353638] hover:border-[#50BED9]/60 rounded-3xl group reveal block overflow-hidden transition-all duration-300 hover:-translate-y-1.5 shadow-lg hover:shadow-[0_20px_45px_rgba(80,190,217,0.12)] flex flex-col"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {/* Thumbnail */}
              <div className="aspect-video relative overflow-hidden rounded-t-3xl">
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-70" />

                {/* Number Badge */}
                <div className="absolute top-3 left-3 z-10 w-8 h-8 rounded-xl bg-[#50BED9] flex items-center justify-center shadow-lg">
                  <span className="text-[10px] font-black text-[#101010]">{course.num}</span>
                </div>

                {/* Emoji Badge */}
                <div className="absolute top-3 right-3 z-10 text-2xl leading-none" title={course.title}>
                  {course.badge}
                </div>

                {/* Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/30 backdrop-blur-[2px] z-20">
                  <div className="px-4 py-2 bg-[#50BED9] text-[#101010] text-xs font-black rounded-2xl shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300 flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 fill-current" />
                    View Course
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h4 className="text-sm sm:text-base font-black text-white group-hover:text-[#50BED9] transition-colors line-clamp-1 tracking-tight">
                    {course.title}
                  </h4>
                  <p className="text-xs text-[#D0D3D6]/80 line-clamp-2 leading-relaxed">{course.description}</p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#D0D3D6]/60 font-medium pt-3 border-t border-[#353638]/60">
                  <span className="flex items-center gap-1">
                    <course.Icon className="w-3 h-3 text-[#50BED9]" />
                    {course.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-[#33C6B6]" />
                    {course.students}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10 reveal">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#50BED9] hover:bg-[#159BD7] text-[#101010] hover:text-white font-black text-sm rounded-2xl shadow-lg transition-all"
          >
            <span>Explore All Courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
