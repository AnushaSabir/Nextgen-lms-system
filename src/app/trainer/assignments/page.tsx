'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, BookOpen, Clock, MoreVertical, ThumbsUp, ThumbsDown, TrendingUp } from 'lucide-react';
import { PageHeader, Card, Badge, EmptyState, Loading } from '@/components/trainer/ui';
import { submissionsApi } from '@/lib/api';
import type { ReviewDecision } from '@/types/domain';

type Submission = {
  id: string;
  textAnswer?: string;
  fileUrl?: string;
  reviewed: boolean;
  reviewDecision?: ReviewDecision | null;
  video?: { id: string; title: string } | null;
  enrollment?: { learner?: { name?: string } | null; course?: { title?: string } | null } | null;
  createdAt?: string;
};

const DECISION_TONE: Record<string, 'success' | 'danger' | 'warn' | 'info'> = {
  pass: 'success',
  fail: 'danger',
  improve: 'info',
};

function formatRelativeTime(iso?: string): string {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diff = Date.now() - then;
  const sec = Math.round(diff / 1000);
  const min = Math.round(sec / 60);
  const hr = Math.round(min / 60);
  const day = Math.round(hr / 24);
  if (sec < 60) return 'Just now';
  if (min < 60) return `${min}m ago`;
  if (hr < 24) return `${hr}h ago`;
  if (day < 7) return `${day}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function PracticalAssignmentsPage() {
  const [assignments, setAssignments] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await submissionsApi.trainerList();
      setAssignments(Array.isArray(data) ? data : []);
    } catch {
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleReview(id: string, decision: ReviewDecision) {
    setReviewingId(id);
    try {
      await submissionsApi.review(id, decision);
      await load();
    } catch {
      // Leave the list as-is on failure; user can retry.
    } finally {
      setReviewingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Trainer Studio"
        title="Practical Assignments"
        subtitle="Review homework submitted by your students."
        actions={
          <button className="gt-btn gt-btn--primary">
            <Plus className="h-4 w-4" /> New Assignment
          </button>
        }
      />

      {loading ? (
        <Card className="p-2">
          <Loading label="Loading submissions…" />
        </Card>
      ) : assignments.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            icon={BookOpen}
            title="No submissions yet"
            detail="Homework submitted by your students will appear here for review."
          />
        </Card>
      ) : (
        <div className="gt-stagger grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {assignments.map((assignment) => {
            const learnerName = assignment.enrollment?.learner?.name ?? 'Unknown learner';
            const courseTitle = assignment.enrollment?.course?.title ?? 'Course';
            const videoTitle = assignment.video?.title ?? 'Homework';
            const statusLabel = assignment.reviewed
              ? (assignment.reviewDecision
                  ? assignment.reviewDecision.charAt(0).toUpperCase() + assignment.reviewDecision.slice(1)
                  : 'Reviewed')
              : 'Pending';
            const statusTone = !assignment.reviewed
              ? 'warn'
              : (assignment.reviewDecision && DECISION_TONE[assignment.reviewDecision]) || 'info';

            return (
              <Card key={assignment.id} hover className="flex flex-col p-6">
                <div className="mb-4 flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--gt-border-2)] bg-[var(--gt-surface-2)] text-[var(--gt-accent)]">
                    <BookOpen className="h-5 w-5" />
                  </span>
                  <Link
                    href={`/trainer/submissions/${assignment.id}`}
                    className="p-2 text-[var(--gt-text-3)] transition-colors hover:text-[var(--gt-text)]"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </Link>
                </div>

                <h3 className="text-lg font-bold text-[var(--gt-text)]">{videoTitle}</h3>
                <p className="mt-0.5 text-sm text-[var(--gt-text-3)]">{courseTitle}</p>
                <p className="mt-1 text-sm text-[var(--gt-text-2)]">by {learnerName}</p>

                {assignment.textAnswer ? (
                  <p className="mt-4 line-clamp-2 text-sm text-[var(--gt-text-2)]">{assignment.textAnswer}</p>
                ) : assignment.fileUrl ? (
                  <a
                    href={assignment.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-sm text-[var(--gt-accent)] hover:text-[var(--gt-accent-2)]"
                  >
                    View attachment
                  </a>
                ) : null}

                <div className="mt-auto flex items-center justify-between border-t border-[var(--gt-border)] pt-4">
                  <div className="flex items-center gap-2 text-sm text-[var(--gt-text-2)]">
                    <Clock className="h-4 w-4" /> {formatRelativeTime(assignment.createdAt)}
                  </div>
                  <Badge tone={statusTone} dot>{statusLabel}</Badge>
                </div>

                {!assignment.reviewed && (
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => handleReview(assignment.id, 'pass')}
                      disabled={reviewingId === assignment.id}
                      className="gt-btn gt-btn--sm flex-1"
                      style={{ background: 'rgba(52,211,153,0.14)', color: 'var(--gt-success)', border: '1px solid rgba(52,211,153,0.3)' }}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" /> Pass
                    </button>
                    <button
                      onClick={() => handleReview(assignment.id, 'improve')}
                      disabled={reviewingId === assignment.id}
                      className="gt-btn gt-btn--ghost gt-btn--sm flex-1"
                    >
                      <TrendingUp className="h-3.5 w-3.5" /> Improve
                    </button>
                    <button
                      onClick={() => handleReview(assignment.id, 'fail')}
                      disabled={reviewingId === assignment.id}
                      className="gt-btn gt-btn--sm flex-1"
                      style={{ background: 'rgba(251,113,133,0.12)', color: 'var(--gt-danger)', border: '1px solid rgba(251,113,133,0.28)' }}
                    >
                      <ThumbsDown className="h-3.5 w-3.5" /> Fail
                    </button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
