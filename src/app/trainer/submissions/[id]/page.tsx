'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, XCircle, RefreshCcw, FileText, Download } from 'lucide-react';
import { PageHeader, Card, SectionHeader, Badge, Loading, EmptyState } from '@/components/trainer/ui';
import { submissionsApi } from '@/lib/api';
import type { ReviewDecision } from '@/types/domain';

type TrainerSubmission = {
  id: string;
  textAnswer?: string;
  fileUrl?: string;
  reviewed?: boolean;
  reviewDecision?: ReviewDecision;
  reviewRemarks?: string;
  video?: { id: string; title: string };
  enrollment?: {
    learner?: { name?: string };
    course?: { title?: string };
  };
  createdAt?: string;
};

const DECISION_TONE: Record<string, 'success' | 'danger' | 'warn'> = {
  pass: 'success',
  fail: 'danger',
  improve: 'warn',
};

function BackLink() {
  return (
    <Link
      href="/trainer/submissions"
      className="inline-flex items-center gap-2 text-sm font-medium text-[var(--gt-text-2)] transition-colors hover:text-[var(--gt-text)]"
    >
      <ArrowLeft className="h-4 w-4" /> Back to Submissions
    </Link>
  );
}

export default function SubmissionDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState<TrainerSubmission | null>(null);
  const [decision, setDecision] = useState<ReviewDecision | null>(null);
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const list: TrainerSubmission[] = await submissionsApi.trainerList();
        const found = Array.isArray(list) ? list.find((s) => s.id === id) ?? null : null;
        if (!active) return;
        setSubmission(found);
        if (found?.reviewDecision) setDecision(found.reviewDecision);
        if (found?.reviewRemarks) setRemarks(found.reviewRemarks);
      } catch {
        if (active) setSubmission(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  async function handleSubmit() {
    if (!submission || !decision) {
      setError('Select a grade (Pass, Improve, or Fail) before submitting.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await submissionsApi.review(submission.id, decision, remarks);
      setSuccess(true);
      setSubmission((prev) =>
        prev ? { ...prev, reviewed: true, reviewDecision: decision, reviewRemarks: remarks } : prev,
      );
      setTimeout(() => router.push('/trainer/submissions'), 1200);
    } catch {
      setError('Could not submit the evaluation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <BackLink />
        <Card className="p-2">
          <Loading label="Loading submission…" />
        </Card>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="space-y-6">
        <BackLink />
        <Card className="p-6">
          <EmptyState
            icon={FileText}
            title="Submission not found"
            detail="This submission may have been removed or is no longer available."
          />
        </Card>
      </div>
    );
  }

  const learnerName = submission.enrollment?.learner?.name ?? 'Unknown Learner';
  const courseTitle = submission.enrollment?.course?.title;
  const videoTitle = submission.video?.title;
  const submittedAt = submission.createdAt ? new Date(submission.createdAt).toLocaleString() : null;
  const subtitleParts = [submittedAt ? `Submitted ${submittedAt}` : null, courseTitle, videoTitle].filter(Boolean);

  const gradeOptions: { key: ReviewDecision; label: string; icon: typeof CheckCircle2; tone: string }[] = [
    { key: 'pass', label: 'Pass', icon: CheckCircle2, tone: '#34d399' },
    { key: 'improve', label: 'Improve (Resubmit)', icon: RefreshCcw, tone: '#fbbf24' },
    { key: 'fail', label: 'Fail', icon: XCircle, tone: '#fb7185' },
  ];

  return (
    <div className="space-y-6">
      <BackLink />

      <PageHeader
        eyebrow="Submission Review"
        title={learnerName}
        subtitle={subtitleParts.join(' • ')}
        actions={
          submission.reviewed && submission.reviewDecision ? (
            <Badge tone={DECISION_TONE[submission.reviewDecision]} dot>
              {submission.reviewDecision}
            </Badge>
          ) : (
            <Badge tone="info" dot>Awaiting grade</Badge>
          )
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Submission Content */}
          <Card className="p-6">
            <SectionHeader icon={FileText} tone="accent" title="Student's Work" caption="Homework and written answer submitted for review." />

            <div className="space-y-6 leading-relaxed text-[var(--gt-text-2)]">
              {submission.textAnswer ? (
                <p className="whitespace-pre-wrap text-sm text-[var(--gt-text)]">{submission.textAnswer}</p>
              ) : (
                <p className="text-sm text-[var(--gt-text-3)]">No written answer provided.</p>
              )}

              {submission.fileUrl && (
                <a
                  href={submission.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex cursor-pointer items-center justify-between rounded-xl border border-[var(--gt-border)] bg-[var(--gt-bg-soft)] p-4 transition-colors hover:border-[var(--gt-border-2)]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-[var(--gt-border-2)] bg-[var(--gt-surface-2)] text-[var(--gt-info)]">
                      <FileText className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[var(--gt-text)]">Submitted attachment</p>
                      <p className="break-all text-xs text-[var(--gt-text-3)]">{submission.fileUrl}</p>
                    </div>
                  </div>
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-[var(--gt-border-2)] bg-[var(--gt-surface-2)] text-[var(--gt-text-3)] transition-colors group-hover:text-[var(--gt-text)]">
                    <Download className="h-4 w-4" />
                  </span>
                </a>
              )}

              {submission.reviewed && submission.reviewDecision && (
                <div className="rounded-xl border border-[var(--gt-border)] bg-[var(--gt-surface)] p-4">
                  <h4 className="mb-1 text-sm font-bold text-[var(--gt-text)]">Current status</h4>
                  <p className="text-sm capitalize text-[var(--gt-text-2)]">
                    {submission.reviewDecision}
                    {submission.reviewRemarks ? ` — ${submission.reviewRemarks}` : ''}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Grading Panel */}
        <div className="space-y-6">
          <Card className="p-6">
            <SectionHeader icon={CheckCircle2} tone="success" title="Grade Submission" caption="Pick a decision and add feedback." />

            <div className="mb-6 space-y-3">
              {gradeOptions.map(({ key, label, icon: Icon, tone }) => {
                const active = decision === key;
                return (
                  <button
                    key={key}
                    onClick={() => setDecision(key)}
                    className="flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all"
                    style={{
                      borderColor: active ? tone : 'var(--gt-border)',
                      background: active ? `${tone}1a` : 'var(--gt-surface)',
                    }}
                  >
                    <Icon className="h-5 w-5" style={{ color: active ? tone : 'var(--gt-text-3)' }} />
                    <span
                      className="text-sm font-bold"
                      style={{ color: active ? 'var(--gt-text)' : 'var(--gt-text-2)' }}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div>
              <label className="gt-label">Trainer Feedback</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="gt-input"
                placeholder="Write your feedback here..."
              />
            </div>

            {error && <p className="mt-4 text-sm text-[var(--gt-danger)]">{error}</p>}
            {success && <p className="mt-4 text-sm text-[var(--gt-success)]">Evaluation submitted. Redirecting…</p>}

            <button
              onClick={handleSubmit}
              disabled={submitting || success}
              className="gt-btn gt-btn--primary mt-6 w-full"
            >
              {submitting ? 'Submitting…' : 'Submit Evaluation'}
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}
