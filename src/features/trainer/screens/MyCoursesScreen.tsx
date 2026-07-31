'use client';

import { PageHeader } from '../components/TrainerShared';
import { CoursesTable } from '../components/CoursesTable';
import { useTrainerData } from '../hooks/useTrainerData';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

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

  if (loading) return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" /></div>;

  return (
    <div className="space-y-8 pb-8">
      <PageHeader title="My Courses" caption="Comprehensive management for drafts, approval submissions, and live course monitoring." />
      <CoursesTable courses={courses} />
    </div>
  );
}
