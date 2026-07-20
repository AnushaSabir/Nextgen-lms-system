'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ChevronRight, Clock, ListChecks, PlayCircle, Upload } from 'lucide-react';
import { PageHeader, Card, EmptyState, Loading } from '@/components/trainer/ui';
import { getCourse as apiGetCourse, getVideos as apiGetVideos } from '@/services/trainerApi';

type Course = any;
type Video = any;

export function VideoListScreen({ courseId, embedded = false }: { courseId: string; embedded?: boolean }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([apiGetCourse(courseId), apiGetVideos(courseId)])
      .then(([courseRes, videosRes]) => {
        if (!mounted) return;
        setCourse(courseRes.data ?? courseRes);
        setVideos(videosRes.data ?? videosRes);
      })
      .catch(err => console.error(err))
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [courseId]);

  if (loading) return <Loading label="Loading lessons…" />;

  const content =
    videos.length === 0 ? (
      <Card className="p-6">
        <EmptyState
          icon={PlayCircle}
          title="No lessons added yet"
          detail="Upload your first video to start building the curriculum."
          action={
            <Link href={`/trainer/courses/${courseId}/videos/upload`} className="gt-btn gt-btn--primary gt-btn--sm">
              <Upload className="h-4 w-4" /> Upload Lesson
            </Link>
          }
        />
      </Card>
    ) : (
      <div className="gt-stagger space-y-3">
        {videos.map((video) => (
          <div
            key={video.id}
            className="gt-card gt-card--hover group flex flex-col justify-between gap-4 p-5 md:flex-row md:items-center"
          >
            <div className="flex items-start gap-4">
              <span className="relative flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--gt-border-2)] bg-[var(--gt-surface-2)] text-[var(--gt-accent)] transition-colors group-hover:border-[var(--gt-accent)]/50">
                <PlayCircle className="h-8 w-8" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--gt-border-2)] bg-[var(--gt-surface-2)] text-xs font-bold text-[var(--gt-text-2)]">
                    {video.position || video.order || 1}
                  </span>
                  <h3 className="text-base font-bold text-[var(--gt-text)]">{video.title}</h3>
                </div>
                <p className="mt-1.5 line-clamp-2 text-sm text-[var(--gt-text-2)]">{video.description}</p>
                <div className="mt-2.5 flex items-center gap-4 text-xs font-medium text-[var(--gt-text-3)]">
                  <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {video.duration || '—'}</span>
                  <span className="flex items-center gap-1.5"><ListChecks className="h-3.5 w-3.5" /> Assessments</span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 border-t border-[var(--gt-border)] pt-4 md:border-0 md:pt-0">
              <Link href={`/trainer/courses/${courseId}/videos/${video.id}/mcqs`} className="gt-btn gt-btn--ghost gt-btn--sm">MCQs</Link>
              <Link href={`/trainer/courses/${courseId}/videos/${video.id}/quiz`} className="gt-btn gt-btn--ghost gt-btn--sm">Quiz</Link>
              <Link href={`/trainer/courses/${courseId}/videos/${video.id}/summary-task`} className="gt-btn gt-btn--ghost gt-btn--sm">Summary</Link>
            </div>
          </div>
        ))}
      </div>
    );

  if (embedded) return content;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--gt-text-3)]">
        <Link href={`/trainer/courses/${courseId}`} className="transition-colors hover:text-[var(--gt-text)]">Course Details</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-[var(--gt-text-2)]">Curriculum Content</span>
      </div>

      <PageHeader
        eyebrow="Trainer Workspace"
        title="Curriculum Manager"
        subtitle={`Organize lessons and assessments for ${course?.title || 'this course'}.`}
        actions={
          videos.length > 0 ? (
            <Link href={`/trainer/courses/${courseId}/videos/upload`} className="gt-btn gt-btn--primary">
              <Upload className="h-4 w-4" /> Add Lesson
            </Link>
          ) : undefined
        }
      />

      {content}
    </div>
  );
}

export default VideoListScreen;
