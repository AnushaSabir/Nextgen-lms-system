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
  { ssr: false, loading: () => <div className="py-8 text-center text-sm text-[var(--gt-text-3)]">Loading lessons...</div> }
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

  if (loading) return <Loading label="Loading course…" />;
  if (!course) {
    return (
      <EmptyState
        icon={BookOpen}
        title="Course not found"
        detail="We couldn't find this course. It may have been removed."
        action={<Link href="/trainer/courses" className="gt-btn gt-btn--primary gt-btn--sm">Back to courses</Link>}
      />
    );
  }

  const status = course.status ?? 'pending_review';

  return (
    <div className="space-y-6">
      {notice && (
        <div className="gt-rise fixed right-6 top-20 z-50 flex items-center gap-2.5 rounded-2xl border border-[var(--gt-accent)]/30 bg-[var(--gt-panel)] px-4 py-3 text-sm text-[var(--gt-accent-2)] shadow-2xl">
          <CheckCircle2 className="h-4 w-4" /> {notice}
        </div>
      )}
      {/* Breadcrumb */}
      <div className="gt-rise flex items-center gap-2 text-sm text-[var(--gt-text-3)]">
        <Link href="/trainer/courses" className="transition-colors hover:text-[var(--gt-text)]">Courses</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-[var(--gt-text-2)]">Course Details</span>
      </div>

      <PageHeader
        eyebrow="Trainer Workspace"
        title={course.title}
        subtitle={course.description}
        actions={
          <>
            <Link href={`/trainer/courses/${courseId}/videos/upload`} className="gt-btn gt-btn--primary">
              <Upload className="h-4 w-4" /> Upload Content
            </Link>
            <button
              className="gt-btn gt-btn--ghost"
              onClick={submitForReview}
              disabled={submitting || course.status === 'pending_review'}
            >
              <Send className="h-4 w-4" />
              {course.status === 'pending_review' ? 'In Review' : submitting ? 'Submitting…' : 'Submit for Review'}
            </button>
          </>
        }
      />

      {/* Meta summary */}
      <Card className="p-6">
        <div className="flex flex-wrap items-center gap-4">
          <Badge tone={STATUS_TONE[status] ?? 'warn'} dot>
            {String(status).replace('_', ' ')}
          </Badge>
          <Badge tone="info">{course.category}</Badge>
          <span className="flex items-center gap-2 text-sm font-medium text-[var(--gt-text-2)]">
            <GraduationCap className="h-4 w-4 text-[var(--gt-accent)]" />
            <span className="capitalize">{course.level}</span>
          </span>
          <span className="flex items-center gap-2 text-sm font-medium text-[var(--gt-text-2)]">
            <Award className="h-4 w-4 text-[var(--gt-accent)]" /> PKR {Number(course.price || 0).toLocaleString()}
          </span>
          <span className="flex items-center gap-2 text-sm font-medium text-[var(--gt-text-2)]">
            <VideoIcon className="h-4 w-4 text-[var(--gt-accent)]" /> {course.videos?.length || 0} Lessons
          </span>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <SectionHeader icon={CheckCircle2} tone="info" title="Prerequisites" caption="What students need before starting" />
          <ul className="space-y-3">
            {(course.requirements ?? []).map((req: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[var(--gt-text-2)]">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gt-text-3)]" /> {req}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-6">
          <SectionHeader icon={Award} tone="success" title="Learning Outcomes" caption="What students will achieve" />
          <ul className="space-y-3">
            {(course.learningOutcomes ?? course.outcomes ?? []).map((out: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[var(--gt-text-2)]">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gt-success)]" /> {out}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-6">
        <SectionHeader icon={VideoIcon} tone="accent" title="Curriculum & Lessons" caption="Manage your course lessons and content." />
        <VideoListScreen courseId={courseId} embedded />
      </Card>
    </div>
  );
}
