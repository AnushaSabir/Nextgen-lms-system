'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Star,
  Users,
  ArrowRight,
  CheckCircle2,
  Filter,
  BookOpen,
  Sparkles,
  TrendingUp,
  Clock,
  ShieldCheck,
  Zap,
  Code,
  Palette,
  Megaphone,
  Bot,
  Layers,
  Award,
  ChevronRight,
  Play,
  X,
  GraduationCap,
  SlidersHorizontal,
  Video,
} from 'lucide-react';

const COURSES_DATA = [
  {
    id: 1,
    title: 'Python for Data Science, Analytics & Machine Learning',
    category: 'AI & Data',
    level: 'Beginner to Pro',
    faculty: 'NextGen AI Faculty',
    facultyTitle: 'Lead Python & Data Specialist',
    students: '6.2k',
    rating: 4.9,
    reviews: 2150,
    duration: '52 Hours',
    lectures: 184,
    badge: 'Featured Video',
    hasVideoIntro: true,
    videoSrc: '/videos/python_intro.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80',
    description: 'Complete Python mastery from syntax fundamentals to Pandas, NumPy, Scikit-Learn, data visualization, and applied Machine Learning models.',
    highlights: ['Includes Python Video Masterclass', '18 Real-World Data Projects', 'Automated Code Sandbox Grading', 'Verified Industry Certificate'],
  },
  {
    id: 2,
    title: 'Next.js 15 & React 19 Full-Stack Enterprise Mastery',
    category: 'Development',
    level: 'Intermediate',
    faculty: 'NextGen Engineering',
    facultyTitle: 'Full-Stack Software Architect',
    students: '4.4k',
    rating: 4.9,
    reviews: 1420,
    duration: '48 Hours',
    lectures: 142,
    badge: 'Bestseller',
    hasVideoIntro: false,
    videoSrc: '',
    thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&auto=format&fit=crop&q=80',
    description: 'Build production-scale modern web applications with Server Actions, App Router, TypeScript, and Tailwind CSS.',
    highlights: ['Full SaaS Project Included', 'CI/CD & Cloud Deployment', 'Verified Industry Certificate'],
  },
  {
    id: 3,
    title: 'Applied Generative AI & Large Language Models (LLMs)',
    category: 'AI & Data',
    level: 'Advanced',
    faculty: 'NextGen Research Labs',
    facultyTitle: 'AI Research Lead',
    students: '5.1k',
    rating: 4.9,
    reviews: 1650,
    duration: '56 Hours',
    lectures: 168,
    badge: 'Trending',
    hasVideoIntro: false,
    videoSrc: '',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&auto=format&fit=crop&q=80',
    description: 'Master RAG pipelines, LangChain, fine-tuning Llama & OpenAI models, vector databases, and autonomous AI agents.',
    highlights: ['Hands-on Agentic Workflows', 'Vector DB Architecture', 'Live Model Fine-tuning'],
  },
  {
    id: 4,
    title: 'Graphic Design Mastery — Photoshop, Illustrator & Figma',
    category: 'Design',
    level: 'All Levels',
    faculty: 'NextGen Design Studio',
    facultyTitle: 'Principal Product Designer',
    students: '2.1k',
    rating: 4.8,
    reviews: 640,
    duration: '36 Hours',
    lectures: 98,
    badge: 'Popular',
    hasVideoIntro: false,
    videoSrc: '',
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&auto=format&fit=crop&q=80',
    description: 'Create stunning graphics, logos, brand identities, and print materials using industry-standard Adobe tools and Figma.',
    highlights: ['Real Brand Design Projects', 'Logo & Identity Design', 'Print & Digital Media'],
  },
  {
    id: 5,
    title: 'Digital Marketing & Social Media Growth Masterclass',
    category: 'Marketing',
    level: 'All Levels',
    faculty: 'NextGen Growth Team',
    facultyTitle: 'Digital Marketing Strategist',
    students: '3.2k',
    rating: 4.8,
    reviews: 980,
    duration: '40 Hours',
    lectures: 120,
    badge: 'Hot',
    hasVideoIntro: false,
    videoSrc: '',
    thumbnail: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&auto=format&fit=crop&q=80',
    description: 'Master SEO, Google Ads, Facebook Ads, email marketing, and data-driven growth strategies that drive real business results.',
    highlights: ['Live Ad Campaign Setup', 'SEO & Content Strategy', 'Analytics & ROI Tracking'],
  },
  {
    id: 6,
    title: 'Data Science with Python, Power BI & Tableau',
    category: 'AI & Data',
    level: 'Intermediate',
    faculty: 'NextGen Data Analytics',
    facultyTitle: 'Senior Data Scientist',
    students: '2.8k',
    rating: 4.8,
    reviews: 820,
    duration: '44 Hours',
    lectures: 130,
    badge: 'New',
    hasVideoIntro: false,
    videoSrc: '',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    description: 'Transform raw datasets into compelling insights using Python, Pandas, Power BI dashboards, and predictive modeling.',
    highlights: ['Real Business Datasets', 'Power BI & Tableau Dashboards', 'Predictive Analytics'],
  },
  {
    id: 7,
    title: 'Cloud Architecture & DevOps CI/CD Masterclass',
    category: 'Cloud',
    level: 'Intermediate',
    faculty: 'NextGen Cloud Ops',
    facultyTitle: 'Cloud Solutions Architect',
    students: '2.3k',
    rating: 4.8,
    reviews: 690,
    duration: '42 Hours',
    lectures: 110,
    badge: 'In Demand',
    hasVideoIntro: false,
    videoSrc: '',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    description: 'Deploy Kubernetes clusters, automate Docker pipelines with GitHub Actions, and architect secure AWS infrastructure.',
    highlights: ['Kubernetes & Docker in Depth', 'AWS Infrastructure as Code', 'Zero-Downtime Releases'],
  },
  {
    id: 8,
    title: 'Cybersecurity Analyst & Threat Intelligence Bootcamp',
    category: 'Security',
    level: 'Intermediate',
    faculty: 'NextGen Security Team',
    facultyTitle: 'Certified Security Specialist',
    students: '1.9k',
    rating: 4.8,
    reviews: 510,
    duration: '38 Hours',
    lectures: 105,
    badge: 'Expert',
    hasVideoIntro: false,
    videoSrc: '',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
    description: 'Network penetration testing, vulnerability assessment, SIEM tools, SOC analyst workflows, and cryptography.',
    highlights: ['Live Virtual Sandbox Labs', 'SOC Analyst Blue Team Drills', 'CompTIA Security+ Aligned'],
  },
  {
    id: 9,
    title: 'UI/UX Design Systems & High-Fidelity Prototyping',
    category: 'Design',
    level: 'All Levels',
    faculty: 'NextGen UX Lab',
    facultyTitle: 'UX Research & Design Lead',
    students: '1.7k',
    rating: 4.7,
    reviews: 480,
    duration: '32 Hours',
    lectures: 88,
    badge: 'Creative',
    hasVideoIntro: false,
    videoSrc: '',
    thumbnail: 'https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=600&auto=format&fit=crop&q=80',
    description: 'Design world-class SaaS interfaces in Figma, build design tokens, auto-layout systems, and micro-interactions.',
    highlights: ['Complete Design System', 'Figma to Code Workflow', 'User Research Methodologies'],
  },
  {
    id: 10,
    title: 'Mobile App Development with React Native & Expo',
    category: 'Development',
    level: 'Intermediate',
    faculty: 'NextGen Mobile Team',
    facultyTitle: 'Senior Mobile Engineer',
    students: '1.4k',
    rating: 4.7,
    reviews: 390,
    duration: '38 Hours',
    lectures: 102,
    badge: 'New',
    hasVideoIntro: false,
    videoSrc: '',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80',
    description: 'Build cross-platform iOS & Android apps with React Native, Expo, and Supabase — from prototype to App Store.',
    highlights: ['iOS & Android Deployment', 'Supabase Backend Integration', 'Push Notifications & Auth'],
  },
];

const CATEGORIES = [
  { id: 'All', label: 'All Courses', icon: Sparkles },
  { id: 'AI & Data', label: 'Python & AI', icon: Bot },
  { id: 'Development', label: 'Web & Mobile', icon: Code },
  { id: 'Design', label: 'Design', icon: Palette },
  { id: 'Marketing', label: 'Marketing', icon: Megaphone },
  { id: 'Cloud', label: 'Cloud & DevOps', icon: Layers },
  { id: 'Security', label: 'Cybersecurity', icon: ShieldCheck },
];


const LEVELS = ['All Levels', 'Beginner', 'Beginner to Pro', 'Intermediate', 'Advanced'];

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest'>('popular');
  const [selectedCourseModal, setSelectedCourseModal] = useState<typeof COURSES_DATA[0] | null>(null);

  const filteredCourses = COURSES_DATA.filter((course) => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All Levels' || course.level === selectedLevel;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.faculty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLevel && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'popular') return parseInt(b.students) - parseInt(a.students);
    return b.id - a.id;
  });

  return (
    <div className="min-h-screen bg-[#323232] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-[#50BED9]/[0.07] via-[#159BD7]/[0.04] to-transparent rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* Hero Banner Header */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#50BED9]/30 bg-[#151515] text-[#50BED9] text-xs font-black uppercase tracking-widest shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NextGen Course Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Master In-Demand <br />
            <span className="bg-gradient-to-r from-[#50BED9] via-[#159BD7] to-[#33C6B6] bg-clip-text text-transparent">
              Python, AI & Engineering
            </span>
          </h1>
          <p className="text-sm sm:text-base text-[#D0D3D6] max-w-2xl mx-auto font-medium leading-relaxed">
            Hands-on curricula with HD video lectures, adaptive AI quizzes, and verified certification on completion.
          </p>

          {/* Live Search Bar */}
          <div className="relative max-w-2xl mx-auto pt-2">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-[#50BED9]" />
              <input
                type="text"
                placeholder="Search Python, Data Science, Next.js, AI, DevOps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#151515] border border-[#353638] focus:border-[#50BED9] rounded-2xl py-4 pl-12 pr-12 text-white placeholder-[#D0D3D6]/50 text-sm sm:text-base font-semibold shadow-xl focus:outline-none focus:ring-2 focus:ring-[#50BED9]/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 p-1 rounded-lg bg-[#353638] text-[#D0D3D6] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Skill Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs">
              <span className="text-[#D0D3D6]/60 font-bold">Popular:</span>
              {['Python', 'Machine Learning', 'Next.js', 'Generative AI', 'UI/UX', 'Cloud'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="px-2.5 py-1 rounded-lg bg-[#151515] border border-[#353638] text-[#D0D3D6] hover:text-[#50BED9] hover:border-[#50BED9]/40 font-semibold transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-[#151515] border border-[#353638] rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl space-y-4">
          
          {/* Categories Horizontal Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-[#50BED9] text-[#101010] shadow-[0_4px_16px_rgba(80,190,217,0.35)] scale-105'
                      : 'bg-[#101010] text-[#D0D3D6] hover:text-white hover:bg-[#353638] border border-[#353638]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Secondary Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#353638]/70">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#D0D3D6]/70 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#50BED9]" /> Level:
              </span>
              {LEVELS.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedLevel === lvl
                      ? 'bg-[#353638] text-[#50BED9] border border-[#50BED9]/40'
                      : 'text-[#D0D3D6]/70 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#D0D3D6]/70">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#101010] border border-[#353638] text-white text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#50BED9]"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Recently Updated</option>
              </select>
              <span className="text-xs font-black text-[#50BED9] px-2.5 py-1 rounded-lg bg-[#353638]/60">
                {filteredCourses.length} Courses
              </span>
            </div>
          </div>
        </div>

        {/* Courses Cards Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredCourses.map((course, idx) => (
              <div
                key={course.id}
                className={`group flex flex-col justify-between bg-[#101010] border rounded-3xl overflow-hidden shadow-xl hover:-translate-y-1.5 transition-all duration-300 ${
                  course.hasVideoIntro
                    ? 'border-[#50BED9]/80 shadow-[0_0_30px_rgba(80,190,217,0.2)]'
                    : 'border-[#353638] hover:border-[#50BED9]/60'
                }`}
              >
                {/* Thumbnail Header */}
                <div className="relative h-52 w-full overflow-hidden bg-[#151515]">
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-[#101010]/30 to-transparent" />
                  
                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                      {/* Number badge */}
                      <span className="w-8 h-8 rounded-xl bg-[#50BED9] text-[#101010] font-black text-[11px] flex items-center justify-center shadow-lg">
                        #{String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#101010]/80 text-[#50BED9] border border-[#50BED9]/30 shadow-md flex items-center gap-1 backdrop-blur-md">
                        {course.hasVideoIntro && <Video className="w-3 h-3" />}
                        {course.badge}
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#151515]/90 border border-white/10 text-white backdrop-blur-md">
                      {course.level}
                    </span>
                  </div>

                  {/* Play Overlay Preview Button */}
                  <button
                    onClick={() => setSelectedCourseModal(course)}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-[#50BED9] text-[#101010] flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                  </button>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-[#D0D3D6]">
                      <span className="font-bold text-[#50BED9] uppercase tracking-wider text-[11px]">
                        {course.category}
                      </span>
                      <div className="flex items-center gap-1 font-black text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{course.rating}</span>
                        <span className="text-[#D0D3D6]/50 font-normal">({course.reviews})</span>
                      </div>
                    </div>

                    <h3 className="font-black text-lg text-white group-hover:text-[#50BED9] transition-colors leading-snug line-clamp-2">
                      {course.title}
                    </h3>

                    <p className="text-xs text-[#D0D3D6] line-clamp-2 leading-relaxed font-medium">
                      {course.description}
                    </p>
                  </div>

                  {/* Faculty & Stats Strip */}
                  <div className="pt-3 border-t border-[#353638] space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#D0D3D6]">
                      <span className="text-white font-bold">{course.faculty}</span>
                      <span className="flex items-center gap-1 text-[#50BED9]">
                        <Users className="w-3.5 h-3.5" /> {course.students} Learners
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#D0D3D6]/70">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#33C6B6]" /> {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-[#159BD7]" /> {course.lectures} Lectures
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setSelectedCourseModal(course)}
                      className="flex-1 py-3 px-3 rounded-xl bg-[#151515] border border-[#353638] hover:border-[#50BED9] text-white hover:text-[#50BED9] font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{course.hasVideoIntro ? 'Watch Intro Video' : 'Preview Course'}</span>
                    </button>
                    <Link
                      href={`/login?mode=signup&course=${course.id}`}
                      className="py-3 px-4 rounded-xl bg-[#50BED9] hover:bg-[#159BD7] text-[#101010] hover:text-white font-black text-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Enroll</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#151515] border border-[#353638] rounded-3xl p-8 space-y-4">
            <BookOpen className="w-12 h-12 text-[#50BED9] mx-auto opacity-60" />
            <h3 className="text-xl font-bold text-white">No courses match your search</h3>
            <p className="text-sm text-[#D0D3D6]">Try clearing filters or searching for different keywords.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedLevel('All Levels');
              }}
              className="px-6 py-2.5 rounded-xl bg-[#50BED9] text-[#101010] font-bold text-sm hover:bg-[#159BD7] hover:text-white transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Certificate Feature Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#101010] border border-[#50BED9]/30 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#50BED9]/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#353638] text-[#50BED9] text-xs font-black uppercase">
                <Award className="w-4 h-4" /> NextGen Verified Credential
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                Earn Globally Recognized <br />
                <span className="text-[#50BED9]">Python & AI Certifications</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#D0D3D6] leading-relaxed font-medium">
                Every completed course includes a cryptographically verified certificate with instant LinkedIn integration and employer credential verification.
              </p>
            </div>
            <Link
              href="/certification"
              className="px-8 py-4 rounded-2xl bg-[#50BED9] hover:bg-[#159BD7] text-[#101010] hover:text-white font-black text-sm transition-all shadow-lg hover:scale-105 shrink-0 flex items-center gap-2"
            >
              <span>Learn About Certificates</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>

      {/* Course Video & Quick Preview Modal */}
      {selectedCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#101010] border border-[#50BED9]/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedCourseModal(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-[#151515] border border-[#353638] text-[#D0D3D6] hover:text-white hover:bg-[#353638] transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video Player or Header Preview */}
            <div className="space-y-3">
              {selectedCourseModal.hasVideoIntro ? (
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-[#50BED9]/30 shadow-lg flex items-center justify-center">
                  <video
                    autoPlay
                    controls
                    playsInline
                    className="w-full h-full object-contain bg-black"
                  >
                    <source src="/videos/python_intro.mp4" type="video/mp4" />
                    <source src="/videos/python_intro.mp4.mp4" type="video/mp4" />
                    <source src="/videos/python.mp4" type="video/mp4" />
                    <source src="/videos/main_hero/new_hero.mp4.mp4" type="video/mp4" />
                  </video>
                </div>
              ) : (
                <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-[#151515]">
                  <Image
                    src={selectedCourseModal.thumbnail}
                    alt={selectedCourseModal.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="space-y-1 pt-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#50BED9]/20 text-[#50BED9] border border-[#50BED9]/30">
                  {selectedCourseModal.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {selectedCourseModal.title}
                </h3>
                <p className="text-xs text-[#50BED9] font-bold">
                  Instructor: {selectedCourseModal.faculty} ({selectedCourseModal.facultyTitle})
                </p>
              </div>
            </div>

            <p className="text-sm text-[#D0D3D6] leading-relaxed">
              {selectedCourseModal.description}
            </p>

            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-white">Course Highlights</h4>
              <div className="space-y-1.5">
                {selectedCourseModal.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-semibold text-[#D0D3D6]">
                    <CheckCircle2 className="w-4 h-4 text-[#33C6B6] shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Link
                href={`/login?mode=signup&course=${selectedCourseModal.id}`}
                className="flex-1 py-3.5 rounded-xl bg-[#50BED9] hover:bg-[#159BD7] text-[#101010] hover:text-white font-black text-sm text-center shadow-lg transition-all"
              >
                Enroll in this Course
              </Link>
              <button
                onClick={() => setSelectedCourseModal(null)}
                className="px-5 py-3.5 rounded-xl bg-[#151515] border border-[#353638] text-white font-bold text-sm hover:bg-[#353638] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
