import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { getCourseBySlug } from '@/data/courses';
import { BookOpen, Clock, Users, ArrowLeft, CheckCircle2, Award } from 'lucide-react';
import { enrollCourse } from './actions';

type CoursePageProps = {
  params: Promise<{ slug: string }>;
};

// Next.js 15+ compatible approach for dynamic params
export default async function CoursePage(props: CoursePageProps) {
  const { slug } = await props.params;
  const course = getCourseBySlug(slug);

  if (!course) {
    notFound();
  }


  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Course Header Banner */}
      <div className={`bg-gradient-to-r ${course.imageColor} text-white pt-24 pb-32 px-4 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <Link href="/#courses" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Link>
          <div className="flex gap-2 mb-4">
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              {course.category}
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              {course.level}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 max-w-4xl leading-tight">
            {course.title}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            {course.description}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column: Syllabus & Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
              <h2 className="text-2xl font-bold text-secondary mb-6">What you&apos;ll learn</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {course.syllabus.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-secondary">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
              <h2 className="text-2xl font-bold text-secondary mb-6">Course Syllabus</h2>
              <div className="space-y-6">
                {course.syllabus.map((item, index) => (
                  <div key={index} className="flex">
                    <div className="mr-6 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      {index !== course.syllabus.length - 1 && (
                        <div className="w-0.5 h-full bg-border mt-2"></div>
                      )}
                    </div>
                    <div className="pb-6">
                      <h3 className="text-lg font-bold text-secondary">{item.title}</h3>
                      <p className="text-muted-foreground mt-2">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Enrollment Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-premium border border-border p-6 sticky top-24">
              <div className="text-3xl font-extrabold text-secondary mb-6">
                {course.price === 'Free' ? 'Free' : `$${course.price}`}
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center text-muted-foreground">
                  <Clock className="w-5 h-5 mr-3 text-primary" />
                  <span className="font-medium">Duration: {course.duration}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <BookOpen className="w-5 h-5 mr-3 text-primary" />
                  <span className="font-medium">Lessons: {course.lessons}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Award className="w-5 h-5 mr-3 text-primary" />
                  <span className="font-medium">Level: {course.level}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Users className="w-5 h-5 mr-3 text-primary" />
                  <span className="font-medium">Instructor: {course.instructor}</span>
                </div>
              </div>

              <form action={enrollCourse}>
                <input type="hidden" name="courseId" value={course.id} />
                <Button type="submit" size="lg" className="w-full text-lg shadow-md">
                  Enroll Now
                </Button>
              </form>
              <p className="text-xs text-center text-muted-foreground mt-4">
                30-Day Money-Back Guarantee
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
