'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Award, BookOpen, CheckCircle2, ChevronRight, GraduationCap, Send, Upload, Video as VideoIcon } from 'lucide-react';
import { PageHeader, Card, SectionHeader, Badge, Loading, EmptyState } from '@/components/trainer/ui';
import { getCourse as apiGetCourse } from '@/services/trainerApi';
import { coursesApi } from '@/lib/api';

const VideoListScreen = dynamic(
  () => import('./VideoListScreen').then((mod) => mod.VideoListScreen),
  { ssr: false, loading: () => <div className="py-8 text-center text-[#7dab52] text-sm">Loading lessons...</div> }
);

type Course = any;

const STATUS_TONE: Record<string, 'success' | 'warn' | 'danger' | 'info'> = {
  approved: 'success',
  pending_review: 'warn',
  draft: 'info',
  rejected: 'danger',
};

export function CourseDetailsScreen({ courseId }: { courseId: string }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState('');

  async function submitForReview() {
    setSubmitting(true);
    try {
      const updated = await coursesApi.submitReview(courseId);
      setCourse((prev: Course) => ({ ...prev, status: updated?.status ?? 'pending_review' }));
      setNotice('Course submitted for admin review.');
    } catch {
      setNotice('Could not submit for review. Please try again.');
    } finally {
      setSubmitting(false);
      setTimeout(() => setNotice(''), 3000);
    }
  }

  useEffect(() => {
    let mounted = true;
    apiGetCourse(courseId)
      .then((res) => {
        if (mounted) setCourse(res.data ?? res);
      })
      .catch((err) => console.error('Failed to load course', err))
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [courseId]);

  if (loading) return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" /></div>;
  if (!course) return <div className="p-8 text-center text-[#1a6b2e]">Course not found.</div>;

  return (
    <div className="space-y-8 pb-8">
      <div className="flex items-center gap-2 text-sm text-[#1a6b2e] mb-4">
        <Link href="/trainer/courses" className="hover:text-[#0f3d1a] transition-colors">Courses</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-[#1a6b2e]">Course Details</span>
      </div>

      <Card className="relative overflow-hidden border-gray-700/50 bg-gray-900/80 p-8 shadow-2xl">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-sky-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <StatusBadge status={course.status ?? 'pending_review'} />
              <span className="rounded-md bg-gray-800 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-[#1a6b2e]">{course.category}</span>
            </div>

            <h1 className="text-3xl font-bold text-[#0f3d1a] sm:text-4xl">{course.title}</h1>
            <p className="mt-4 text-lg leading-relaxed text-[#1a6b2e]">{course.description}</p>

            <div className="mt-6 flex items-center gap-6 text-sm font-medium text-[#1a6b2e]">
              <div className="flex items-center gap-2"><GraduationCap className="h-5 w-5 text-sky-400" /> <span className="capitalize">{course.level}</span></div>
              <div className="flex items-center gap-2"><Award className="h-5 w-5 text-sky-400" /> PKR {Number(course.price || 0).toLocaleString()}</div>
              <div className="flex items-center gap-2"><VideoIcon className="h-5 w-5 text-sky-400" /> {course.videos?.length || 0} Lessons</div>
            </div>
          </div>

          <div className="flex flex-col gap-3 min-w-[200px]">
            <Link href={`/trainer/courses/${courseId}/videos/upload`} className="w-full">
              <Button size="lg" className="w-full shadow-lg shadow-sky-500/20"><Upload className="mr-2 h-4 w-4" /> Upload Content</Button>
            </Link>
            <Button size="lg" variant="ghost" className="w-full border border-gray-600 bg-gray-800 hover:bg-gray-700 hover:text-[#0f3d1a]">
              <Send className="mr-2 h-4 w-4" /> Submit for Review
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <SectionHeader icon={CheckCircle2} tone="info" title="Prerequisites" caption="What students need before starting" />
          <ul className="space-y-3">
            {(course.requirements ?? []).map((req: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-[#1a6b2e]">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#7dab52]" /> {req}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-6">
          <SectionHeader icon={Award} tone="success" title="Learning Outcomes" caption="What students will achieve" />
          <ul className="space-y-3">
            {(course.learningOutcomes ?? course.outcomes ?? []).map((out: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-[#1a6b2e]">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> {out}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold text-[#0f3d1a] mb-6 flex items-center gap-2"><VideoIcon className="h-5 w-5 text-sky-400" /> Curriculum &amp; Lessons</h2>
        <VideoListScreen courseId={courseId} embedded />
      </Card>
    </div>
  );
}
