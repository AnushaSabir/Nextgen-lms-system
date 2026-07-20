'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { RotateCcw, AlertCircle, CheckCircle2, Plus, Loader2 } from 'lucide-react';
import { coursesApi, trainerApi } from '@/lib/api';
import type { Course, VideoLesson } from '@/types/domain';
import {
  PageHeader,
  Card,
  SectionHeader,
  Badge,
  EmptyState,
  Loading,
} from '@/components/trainer/ui';

type AssessmentSet = {
  id: string;
  title: string;
  version: number;
  active: boolean;
  label: string;
  counts: { mcq: number; quiz: number; summary: number };
};

export default function RetryQuestionsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [setsByVideo, setSetsByVideo] = useState<Record<string, AssessmentSet[]>>({});
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingSets, setLoadingSets] = useState(false);
  const [creatingVideoId, setCreatingVideoId] = useState<string | null>(null);

  // 1. Fetch the trainer's courses on mount; default to the first one.
  useEffect(() => {
    let active = true;
    (async () => {
      setLoadingCourses(true);
      try {
        const data = await coursesApi.list();
        const list = Array.isArray(data) ? data : [];
        if (!active) return;
        setCourses(list);
        setSelectedCourseId((prev) => prev || list[0]?.id || '');
      } catch {
        if (active) setCourses([]);
      } finally {
        if (active) setLoadingCourses(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const videos: VideoLesson[] = selectedCourse?.videos ?? [];

  // Fetch (or refetch) the assessment sets for a single video.
  const fetchSetsForVideo = useCallback(async (videoId: string) => {
    try {
      const sets = await trainerApi.assessmentSets(videoId);
      setSetsByVideo((prev) => ({ ...prev, [videoId]: Array.isArray(sets) ? sets : [] }));
    } catch {
      setSetsByVideo((prev) => ({ ...prev, [videoId]: [] }));
    }
  }, []);

  // 2. When the selected course changes, load sets for each of its videos.
  useEffect(() => {
    if (!selectedCourseId) return;
    const course = courses.find((c) => c.id === selectedCourseId);
    const courseVideos = course?.videos ?? [];
    let active = true;
    (async () => {
      setLoadingSets(true);
      try {
        const results = await Promise.all(
          courseVideos.map(async (v) => {
            try {
              const sets = await trainerApi.assessmentSets(v.id);
              return [v.id, Array.isArray(sets) ? sets : []] as const;
            } catch {
              return [v.id, [] as AssessmentSet[]] as const;
            }
          }),
        );
        if (active) setSetsByVideo(Object.fromEntries(results));
      } finally {
        if (active) setLoadingSets(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [selectedCourseId, courses]);

  // 3. Create the next backup set for a video, then refetch just that video.
  const createBackupSet = async (videoId: string) => {
    setCreatingVideoId(videoId);
    try {
      await trainerApi.createAssessmentSet(videoId);
      await fetchSetsForVideo(videoId);
    } catch {
      // Safe fallback — leave existing sets untouched on failure.
    } finally {
      setCreatingVideoId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Assessments"
        title="Retry Question Sets"
        subtitle="Manage alternative assessment sets for students who fail initial attempts."
        actions={
          <div className="flex items-center gap-2.5">
            <label className="gt-label mb-0">Course</label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              disabled={loadingCourses || courses.length === 0}
              className="gt-input appearance-none min-w-[220px] disabled:opacity-60"
            >
              {courses.length === 0 ? (
                <option value="">{loadingCourses ? 'Loading…' : 'No courses'}</option>
              ) : (
                courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))
              )}
            </select>
          </div>
        }
      />

      {/* Why multiple sets? */}
      <Card className="p-5">
        <div className="flex items-center gap-4">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[rgba(251,191,36,0.28)] bg-[rgba(251,191,36,0.1)] text-[var(--gt-warn)]">
            <AlertCircle className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-[15px] font-bold text-[var(--gt-text)]">Why multiple sets?</h3>
            <p className="text-sm text-[var(--gt-text-2)]">To prevent cheating, students who retry an assessment must receive a different set of questions.</p>
          </div>
        </div>
      </Card>

      {loadingCourses ? (
        <Card className="p-2">
          <Loading label="Loading courses…" />
        </Card>
      ) : courses.length === 0 ? (
        <Card className="p-2">
          <EmptyState
            icon={RotateCcw}
            title="No courses yet"
            detail="Create a course and add videos to manage retry sets."
          />
        </Card>
      ) : videos.length === 0 ? (
        <Card className="p-2">
          <EmptyState
            icon={RotateCcw}
            title="No videos in this course"
            detail="Add video lessons to this course to create their assessment sets."
          />
        </Card>
      ) : (
        <div className="gt-stagger space-y-4">
          {videos.map((video) => {
            const sets = setsByVideo[video.id];
            const isCreating = creatingVideoId === video.id;
            return (
              <Card key={video.id} className="overflow-hidden">
                {/* Video header */}
                <div className="flex flex-col justify-between gap-4 border-b border-[var(--gt-border)] bg-[var(--gt-surface)] p-5 sm:flex-row sm:items-center">
                  <div className="min-w-0">
                    <h4 className="truncate text-base font-bold text-[var(--gt-text)]">
                      Video {video.position}: {video.title}
                    </h4>
                    <p className="text-sm text-[var(--gt-text-3)]">
                      {sets === undefined
                        ? 'Loading sets…'
                        : `${sets.length} set${sets.length === 1 ? '' : 's'} · ${
                            sets.length > 1 ? 'backup available' : 'no backup yet'
                          }`}
                    </p>
                  </div>
                  <button
                    onClick={() => createBackupSet(video.id)}
                    disabled={isCreating}
                    className="gt-btn gt-btn--primary gt-btn--sm flex-shrink-0"
                  >
                    {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    {isCreating ? 'Creating…' : 'Create Backup Set'}
                  </button>
                </div>

                {/* Assessment sets */}
                <div className="space-y-3 p-4">
                  {sets === undefined ? (
                    <div className="py-6 text-center text-sm font-medium text-[var(--gt-text-3)]">
                      {loadingSets ? 'Loading assessment sets…' : ''}
                    </div>
                  ) : sets.length === 0 ? (
                    <div className="py-6 text-center text-sm font-medium text-[var(--gt-text-3)]">
                      No assessment sets yet. Create a backup set to get started.
                    </div>
                  ) : (
                    sets.map((set) => (
                      <div
                        key={set.id}
                        className="gt-card gt-card--hover flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--gt-border-2)] bg-[var(--gt-surface-2)] text-[var(--gt-accent)]">
                            <RotateCcw className="h-5 w-5" />
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge tone="accent">{set.label}</Badge>
                              {set.active && <CheckCircle2 className="h-4 w-4 text-[var(--gt-success)]" />}
                            </div>
                            <p className="mt-1 text-sm text-[var(--gt-text-3)]">
                              {set.active ? 'Active' : 'Inactive'} · v{set.version}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-6">
                          <div className="text-center">
                            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--gt-text-3)]">MCQs</p>
                            <p className="gt-num text-lg font-extrabold text-[var(--gt-text)]">{set.counts?.mcq ?? 0}</p>
                          </div>
                          <div className="text-center">
                            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--gt-text-3)]">Quizzes</p>
                            <p className="gt-num text-lg font-extrabold text-[var(--gt-text)]">{set.counts?.quiz ?? 0}</p>
                          </div>
                          <div className="text-center">
                            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--gt-text-3)]">Summaries</p>
                            <p className="gt-num text-lg font-extrabold text-[var(--gt-text)]">{set.counts?.summary ?? 0}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/trainer/courses/${selectedCourseId}/videos/${video.id}/mcqs`}
                              className="gt-btn gt-btn--ghost gt-btn--sm"
                            >
                              MCQs
                            </Link>
                            <Link
                              href={`/trainer/courses/${selectedCourseId}/videos/${video.id}/quiz`}
                              className="gt-btn gt-btn--ghost gt-btn--sm"
                            >
                              Quiz
                            </Link>
                            <Link
                              href={`/trainer/courses/${selectedCourseId}/videos/${video.id}/summary-task`}
                              className="gt-btn gt-btn--ghost gt-btn--sm"
                            >
                              Summary
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
