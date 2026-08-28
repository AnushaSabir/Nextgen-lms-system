'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Star,
  Users,
  CheckCircle2,
  Clock,
  PlayCircle,
  FileText,
  Award,
  Smartphone,
  Globe,
  ShieldCheck,
  Zap,
  BookOpen,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { coursesApi } from '@/services/api';

const COURSES_DATA = [
  {
    id: 1,
    title: 'Next.js 15 & React 19 Full-Stack Enterprise Mastery',
    category: 'Development',
    level: 'Intermediate',
    trainer: 'Engr. Sarah Tariq',
    students: '3.4k',
    rating: 4.9,
    reviews: 840,
    duration: '48 Hours',
    lectures: 142,
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80',
    description: 'Master modern full-stack development with Server Actions, Next.js 15 App Router, React 19, TypeScript, PostgreSQL, and Tailwind CSS. Includes production deployment and CI/CD pipelines.',
  },
  {
    id: 2,
    title: 'Applied Generative AI & Large Language Models (LLMs)',
    category: 'AI & Data',
    level: 'Advanced',
    trainer: 'Dr. Kirill Eremenko',
    students: '4.8k',
    rating: 4.9,
    reviews: 1250,
    duration: '56 Hours',
    lectures: 168,
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&auto=format&fit=crop&q=80',
    description: 'Learn to design, fine-tune, and deploy modern generative AI applications, vector databases, RAG systems, and multi-agent workflows using LangChain and open-source models.',
  },
  {
    id: 3,
    title: 'UI/UX Design Systems & High-Fidelity Prototyping',
    category: 'Design',
    level: 'All Levels',
    trainer: 'Alex Chen',
    students: '2.1k',
    rating: 4.8,
    reviews: 620,
    duration: '36 Hours',
    lectures: 94,
    thumbnail: 'https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=1200&auto=format&fit=crop&q=80',
    description: 'Comprehensive UI/UX course covering advanced Figma auto-layout, atomic design systems, interactive component prototyping, and user testing methodologies.',
  },
];

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      const courseId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '1';
      try {
        const data = await coursesApi.getById(courseId);
        if (data) setCourse(data);
        else {
          const fallback = COURSES_DATA.find((c) => c.id.toString() === courseId) || COURSES_DATA[0];
          setCourse(fallback);
        }
      } catch (err) {
        const fallback = COURSES_DATA.find((c) => c.id.toString() === courseId) || COURSES_DATA[0];
        setCourse(fallback);
      }
      setLoading(false);
    };

    if (params.id) {
      fetchCourse();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#323232] flex items-center justify-center pt-24">
        <div className="w-12 h-12 border-4 border-[#50BED9] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#323232] text-white flex flex-col items-center justify-center pt-24 px-4 space-y-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-black text-white">Course Not Found</h1>
        <p className="text-[#D0D3D6] text-base max-w-md">We could not find the course you were looking for.</p>
        <button
          onClick={() => router.push('/courses')}
          className="px-8 py-4 bg-[#50BED9] text-[#101010] font-black rounded-2xl hover:bg-[#159BD7] hover:text-white transition-all shadow-lg"
        >
          Browse All Courses
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#323232] text-white pt-24 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-[#D0D3D6] hover:text-[#50BED9] transition-colors font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to all courses</span>
        </button>

        {/* Main Hero Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#50BED9]/20 text-[#50BED9] border border-[#50BED9]/40">
                {course.level || 'All Levels'}
              </span>
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#151515] border border-[#353638] text-[#D0D3D6]">
                {course.category || 'Professional Track'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
              {course.title}
            </h1>

            <p className="text-base sm:text-lg text-[#D0D3D6] leading-relaxed">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-[#D0D3D6] pt-2 border-y border-[#353638] py-4">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-white">{course.rating || 4.9}</span>
                <span className="text-[#D0D3D6]/60">({course.reviews || 840} reviews)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#50BED9]" />
                <span>{course.students || '2.4k'} Enrolled Students</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#33C6B6]" />
                <span>{course.duration || '40 Hours'} Content</span>
              </div>
            </div>

            {/* What you'll learn */}
            <div className="bg-[#101010] border border-[#353638] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#50BED9]" /> What You Will Master
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  'Architect enterprise-grade scalable applications',
                  'Write clean, typed, modular, and maintainable code',
                  'Implement robust automated tests and CI/CD pipelines',
                  'Deploy production workloads to cloud environments',
                  'Earn a verified credential recognized by top recruiters',
                  'Access lifetime course updates and mentor Q&A',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#D0D3D6] font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#33C6B6] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Enrollment Card */}
          <div className="space-y-6">
            <div className="bg-[#101010] border border-[#50BED9]/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl sticky top-28">
              <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-[#151515]">
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#50BED9] text-[#101010] flex items-center justify-center shadow-xl">
                    <PlayCircle className="w-7 h-7 fill-current" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Link
                  href={`/login?mode=signup&course=${course.id}`}
                  className="w-full py-4 rounded-2xl bg-[#50BED9] hover:bg-[#159BD7] text-[#101010] hover:text-white font-black text-base text-center shadow-[0_8px_25px_rgba(80,190,217,0.35)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>Enroll in Course</span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <p className="text-center text-[11px] text-[#D0D3D6]/70 font-semibold">
                  30-Day Full Access Guarantee · Instant Activation
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-[#353638]">
                <h4 className="text-xs font-black uppercase tracking-wider text-white">This Course Includes:</h4>
                {[
                  { icon: <PlayCircle className="w-4 h-4 text-[#50BED9]" />, text: 'On-demand high-definition video lectures' },
                  { icon: <FileText className="w-4 h-4 text-[#33C6B6]" />, text: 'Downloadable exercises & source code' },
                  { icon: <Award className="w-4 h-4 text-[#159BD7]" />, text: 'Verified Certificate of Completion' },
                  { icon: <Smartphone className="w-4 h-4 text-[#50BED9]" />, text: 'Access on Mobile, Tablet, and Desktop' },
                  { icon: <Globe className="w-4 h-4 text-[#33C6B6]" />, text: 'Full lifetime access & community discord' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs font-semibold text-[#D0D3D6]">
                    {item.icon}
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
