'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { BookOpen, Plus, Video as VideoIcon } from 'lucide-react';
import { PageHeader, Card, Badge, EmptyState, Skeleton } from '@/components/trainer/ui';
import { useTrainerData } from '../hooks/useTrainerData';

const STATUS_TONE: Record<string, 'success' | 'warn' | 'danger' | 'info'> = {
  approved: 'success',
  pending_review: 'warn',
  draft: 'info',
  rejected: 'danger',
};

export function MyCoursesScreen() {
  const { courses, loading } = useTrainerData();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!loading && courses.length > 0) {
      const focus = searchParams.get('focus');
      if (focus === 'videos' || focus === 'mcqs' || focus === 'summary') {
        router.push(`/trainer/courses/${courses[0].id}/videos`);
      }
    }
  }, [loading, courses, searchParams, router]);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Trainer Workspace" title="My Courses" subtitle="Loading your courses…" />
        <div className="grid gap-5 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-[20px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Trainer Workspace"
        title="My Courses"
        subtitle="Comprehensive management for drafts, approval submissions, and live course monitoring."
        actions={
          <Link href="/trainer/create-course" className="gt-btn gt-btn--primary">
            <Plus className="h-4 w-4" /> New Course
          </Link>
        }
      />

      {courses.length ? (
        <div className="gt-stagger grid gap-5 lg:grid-cols-2">
          {courses.map((course) => {
            const status = course.status || 'draft';
            return (
              <Card key={course.id} hover className="flex flex-col p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--gt-accent)]">
                        {course.category}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-[var(--gt-text-3)]" />
                      <span className="text-xs capitalize text-[var(--gt-text-2)]">{course.level}</span>
                    </div>
                    <h3 className="truncate text-lg font-bold text-[var(--gt-text)]">{course.title}</h3>
                  </div>
                  <Badge tone={STATUS_TONE[status] ?? 'info'} dot>
                    {String(status).replace('_', ' ')}
                  </Badge>
                </div>

                <p className="mt-4 line-clamp-2 flex-grow text-sm leading-relaxed text-[var(--gt-text-2)]">
                  {course.description}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[var(--gt-border)] pt-4">
                  <Link href={`/trainer/courses/${course.id}`} className="gt-btn gt-btn--ghost gt-btn--sm flex-1">
                    Overview
                  </Link>
                  <Link href={`/trainer/courses/${course.id}/videos`} className="gt-btn gt-btn--primary gt-btn--sm flex-1">
                    <VideoIcon className="h-3.5 w-3.5" /> Content
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-2">
          <EmptyState
            icon={BookOpen}
            title="No courses yet"
            detail="You haven't created any courses yet. Start building your curriculum today."
            action={
              <Link href="/trainer/create-course" className="gt-btn gt-btn--primary gt-btn--sm">
                <Plus className="h-4 w-4" /> Create first course
              </Link>
            }
          />
        </Card>
      )}
    </div>
  );
}
