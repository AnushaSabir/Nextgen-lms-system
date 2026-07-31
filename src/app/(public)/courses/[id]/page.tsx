'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Star, Users, CheckCircle2, Clock,
  PlayCircle, FileText, Award, Smartphone, Globe, Shield
} from 'lucide-react';
import { coursesApi } from '@/services/api';

const TRENDING_FALLBACKS = [
  { id: 1, title: 'Advanced Web Development', level: 'University', trainer: 'Ikram Tech', students: '2.4k', thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80', description: 'Master modern web development from frontend to backend. Includes React, Node.js, and advanced styling.' },
  { id: 2, title: 'Graphic Design Mastery', level: 'College', trainer: 'Qavi Arts', students: '1.8k', thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&auto=format&fit=crop&q=80', description: 'Learn the principles of design, color theory, and master industry-standard tools like Photoshop and Illustrator.' },
  { id: 3, title: 'Digital Marketing Pro', level: 'Individual', trainer: 'Market Experts', students: '3.1k', thumbnail: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=1200&auto=format&fit=crop&q=80', description: 'Comprehensive digital marketing course covering SEO, SEM, social media strategies, and content marketing.' },
  { id: 4, title: 'AI for Beginners', level: 'School', trainer: 'Future Academy', students: '900', thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&auto=format&fit=crop&q=80', description: 'An introduction to Artificial Intelligence and Machine Learning concepts tailored for beginners.' },
];

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        // Try fetching from API first if we have a real backend
        const courseId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
        const data = await coursesApi.getById(courseId);
        setCourse(data);
      } catch (err) {
        // Fallback to local trending data for demo purposes
        const courseId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
        const fallback = TRENDING_FALLBACKS.find(c => c.id.toString() === courseId);
        if (fallback) {
          setCourse({
            ...fallback,
            rating: 4.8,
            modules: 12,
            duration: '8 weeks',
            price: '200 PKR'
          });
        }
      }
      setLoading(false);
    };

    if (params.id) {
      fetchCourse();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="w-12 h-12 border-4 border-primaryBlue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 px-4 space-y-6 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#0f3d1a]">Course Not Found</h1>
        <p className="text-bodyGrayText text-base sm:text-lg max-w-md text-center leading-relaxed">We couldn't find the course you were looking for. It may have been removed or the link is broken.</p>
        <button onClick={() => router.push('/courses')} className="px-8 py-4 bg-primaryBlue text-[#0f3d1a] font-bold rounded-2xl hover:scale-105 transition-transform shadow-lg shadow-primaryBlue/20">
          Browse All Courses
        </button>
      </div>
    );
  }

  return (
    <div className="pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 min-h-screen">
      <div className="container mx-auto max-w-7xl">

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-bodyGrayText hover:text-[#0f3d1a] transition-colors font-bold mb-8"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to courses
        </button>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-12 sm:mb-16">
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orangeBorderActive bg-primaryBlue/10 text-xs font-black text-primaryBlue uppercase tracking-widest">
              {course.level} Level
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0f3d1a] leading-tight tracking-tight">
              {course.title}
            </h1>

            <p className="text-base sm:text-lg text-bodyGrayText leading-relaxed max-w-2xl">
              {course.description || "Master the essential skills needed for a successful career. This comprehensive course takes you from fundamentals to advanced techniques, with hands-on projects and expert guidance."}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-mediumGrayTitle">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primaryBlue fill-primaryBlue" />
                <span className="text-[#0f3d1a]">{course.rating || '4.8'}</span>
                <span>(340 reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primaryBlue" />
                <span className="text-[#0f3d1a]">{course.students || '1.2k'}</span>
                <span>Enrolled</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primaryBlue" />
                <span className="text-[#0f3d1a]">English, Urdu</span>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2 sm:pt-4">
              <div className="w-12 h-12 rounded-full orange-gradient p-[2px]">
                <div className="w-full h-full rounded-full bg-mainBg flex items-center justify-center overflow-hidden">
                  <div className="text-lg font-black text-primaryBlue">{course.trainer?.charAt(0) || 'V'}</div>
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-darkGrayNumber uppercase tracking-widest">Created by</div>
                <div className="text-base font-black text-[#0f3d1a] flex items-center gap-1.5">
                  {course.trainer || 'Verified Trainer'}
                  <CheckCircle2 className="w-4 h-4 text-primaryBlue" />
                </div>
              </div>
            </div>
          </div>

          {/* Floating Sidebar Card */}
          <div className="lg:col-span-1">
            <div className="theme-card card-3d p-5 sm:p-6 rounded-2xl sm:rounded-[2.5rem] lg:sticky lg:top-32">
              <div className="aspect-video bg-[rgba(255,255,255,0.04)] rounded-2xl relative overflow-hidden mb-6 group cursor-pointer">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <PlayCircle className="w-16 h-16 text-[#0f3d1a]" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform shadow-2xl">
                    <PlayCircle className="w-8 h-8 text-[#0f3d1a] ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-0 w-full text-center text-xs font-bold text-[#0f3d1a] tracking-widest">
                  Preview Course
                </div>
              </div>

              <div className="space-y-6">
                <div className="text-4xl font-black text-[#0f3d1a]">
                  {course.price || 'Free'}
                </div>

                <button className="w-full py-4 sm:py-5 bg-primaryBlue text-[#0f3d1a] font-black text-base sm:text-lg rounded-2xl shadow-xl shadow-[rgba(240,89,31,0.25)] hover:bg-[#d94d19] hover:scale-105 active:scale-95 transition-all">
                  Enroll Now
                </button>
                <button className="w-full py-4 bg-[rgba(255,255,255,0.03)] text-[#0f3d1a] font-bold text-sm rounded-2xl border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.08)] transition-all">
                  Add to Wishlist
                </button>

                <div className="pt-6 border-t border-[rgba(255,255,255,0.06)] space-y-4">
                  <div className="text-sm font-bold text-[#0f3d1a] mb-2">This course includes:</div>
                  {[
                    { icon: <PlayCircle className="w-4 h-4" />, text: `${course.duration || '24 hours'} on-demand video` },
                    { icon: <FileText className="w-4 h-4" />, text: `${course.modules || '15'} downloadable resources` },
                    { icon: <Smartphone className="w-4 h-4" />, text: 'Access on mobile and TV' },
                    { icon: <Shield className="w-4 h-4" />, text: 'Full lifetime access' },
                    { icon: <Award className="w-4 h-4" />, text: 'NextGen-LMS LMS Certificate of completion' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-bodyGrayText font-medium">
                      <span className="text-primaryBlue">{item.icon}</span>
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Details Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-8 sm:space-y-12">

            {/* What you'll learn */}
            <div className="p-5 sm:p-10 rounded-2xl sm:rounded-[2.5rem] bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]">
              <h2 className="text-xl sm:text-2xl font-black text-[#0f3d1a] mb-6 sm:mb-8">What you'll learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Master the core concepts from scratch to advanced level',
                  'Build real-world projects to add to your portfolio',
                  'Learn industry best practices and standards',
                  'Prepare for professional certification and interviews',
                  'Gain practical experience with hands-on assignments',
                  'Understand how to deploy and scale your solutions'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primaryBlue shrink-0 mt-0.5" />
                    <span className="text-bodyGrayText text-sm font-medium leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Content Placeholder */}
            <div>
              <h2 className="text-2xl font-black text-[#0f3d1a] mb-6">Course Content</h2>
              <div className="space-y-4">
                {[
                  { title: 'Introduction & Fundamentals', lectures: 5, time: '45 mins' },
                  { title: 'Core Concepts & Theory', lectures: 8, time: '1 hr 20 mins' },
                  { title: 'Practical Implementation', lectures: 12, time: '2 hrs 15 mins' },
                  { title: 'Advanced Techniques', lectures: 7, time: '1 hr 40 mins' },
                  { title: 'Final Project & Certification', lectures: 3, time: '50 mins' },
                ].map((module, i) => (
                  <div key={i} className="p-4 sm:p-6 rounded-2xl glass-card border border-[rgba(255,255,255,0.05)] hover:border-[rgba(240,89,31,0.2)] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[rgba(240,89,31,0.1)] flex items-center justify-center text-primaryBlue font-black text-sm group-hover:bg-primaryBlue group-hover:text-[#0f3d1a] transition-colors">
                        {i + 1}
                      </div>
                      <div className="font-bold text-[#0f3d1a] text-base sm:text-lg leading-snug">{module.title}</div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm text-bodyGrayText font-medium">
                      <span className="flex items-center gap-1.5"><FileText className="w-4 h-4" /> {module.lectures} lectures</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {module.time}</span>
                    </div>
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
