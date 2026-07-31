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
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-[#0f3d1a] mb-2">Retry Question Sets</h1>
        <p className="text-[#1a6b2e]">Manage alternative assessment sets for students who fail initial attempts.</p>
      </div>

      {/* Why multiple sets? */}
      <Card className="p-5">
        <div className="flex items-center gap-4">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[rgba(251,191,36,0.28)] bg-[rgba(251,191,36,0.1)] text-[var(--gt-warn)]">
            <AlertCircle className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-bold text-[#0f3d1a]">Why multiple sets?</h3>
            <p className="text-sm text-[#1a6b2e]">To prevent cheating, students who retry an assessment must receive a different set of questions.</p>
          </div>
        </div>
      </Card>

        <div className="p-6">
          <div className="space-y-4">
            {retrySets.map((set) => (
              <div key={set.id} className="flex items-center justify-between p-5 rounded-2xl border border-[#1e293b] hover:bg-[#1e293b]/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                    <RotateCcw className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#0f3d1a]">{set.module}</h4>
                    <p className="text-sm text-[#64748b]">{set.course}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-xs text-[#64748b] uppercase font-bold mb-1">Failed</p>
                    <p className={`text-lg font-black ${set.failedStudents > 0 ? 'text-red-400' : 'text-green-400'}`}>{set.failedStudents}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-[#64748b] uppercase font-bold mb-1">Alt Sets</p>
                    <p className="text-lg font-black text-[#0f3d1a] flex items-center gap-1 justify-center">
                      {set.setsAvailable} {set.setsAvailable >= 2 && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                    </p>
                  </div>
                  <button className="bg-[#1e293b] hover:bg-white hover:text-black text-[#0f3d1a] px-5 py-2.5 rounded-xl font-bold transition-all border border-[#334155] shadow-lg">
                    Manage Sets
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
