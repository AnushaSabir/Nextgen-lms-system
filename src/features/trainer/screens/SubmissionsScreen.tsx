'use client';

import { useEffect, useState } from 'react';
import {
  CheckCircle2, Clock, FileText, Loader2, ThumbsDown, ThumbsUp,
  TrendingUp, XCircle, AlertCircle, Files, Award,
} from 'lucide-react';
import {
  PageHeader, StatCard, Card, SectionHeader, Badge, EmptyState, Loading,
} from '@/components/trainer/ui';
import { submissionsApi } from '@/lib/api';
import { useToastStore } from '@/store/toast-store';
import { getErrorMessage } from '@/utils/errorParser';

type Submission = {
  id: string;
  learnerName: string;
  learnerEmail: string;
  courseTitle: string;
  videoTitle: string;
  fileUrl?: string;
  textAnswer?: string;
  decision: 'pass' | 'fail' | 'improve' | 'pending';
  trainerRemarks?: string;
  submittedAt: string;
};

const DECISION_TONE: Record<string, 'success' | 'danger' | 'warn' | 'info'> = {
  pass: 'success',
  fail: 'danger',
  improve: 'warn',
  pending: 'info',
};

const DECISION_LABELS: Record<string, string> = {
  pass:    'Passed',
  fail:    'Failed',
  improve: 'Needs Improvement',
  pending: 'Pending Review',
};

function formatDate(dt: string) {
  try {
    return new Intl.DateTimeFormat('en-PK', { dateStyle: 'medium' }).format(new Date(dt));
  } catch { return dt; }
}

export function SubmissionsScreen() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const { showToast } = useToastStore();

  async function load() {
    const data = await submissionsApi.trainerList();
    // Normalize the backend shape ({ reviewed, reviewDecision, enrollment.learner, video }) → flat card shape.
    const mapped: Submission[] = (data as any[]).map((s) => ({
      id: s.id,
      learnerName: s.enrollment?.learner?.name ?? 'Learner',
      learnerEmail: '',
      courseTitle: s.enrollment?.course?.title ?? 'Course',
      videoTitle: s.video?.title ?? 'Homework',
      fileUrl: s.fileUrl ?? undefined,
      textAnswer: s.textAnswer ?? undefined,
      decision: s.reviewed ? (s.reviewDecision ?? 'improve') : 'pending',
      trainerRemarks: s.reviewRemarks ?? undefined,
      submittedAt: s.createdAt,
    }));
    setSubmissions(mapped);
  }

  useEffect(() => {
    load().catch(console.error).finally(() => setLoading(false));
  }, []);

  async function handleReview(id: string, decision: 'pass' | 'fail' | 'improve') {
    const remarks =
      decision === 'pass'    ? 'Well done! Your submission meets the requirements.' :
      decision === 'improve' ? 'Good effort, but please revisit the topic and resubmit.' :
                               'Submission does not meet the requirements. Please retry.';
    try {
      setReviewingId(id);
      await submissionsApi.review(id, decision as any, remarks);
      showToast(`Submission marked as "${DECISION_LABELS[decision]}".`, 'success');
      await load();
    } catch (err) {
      showToast(getErrorMessage(err, 'Review failed.'), 'error');
    } finally {
      setReviewingId(null);
    }
  }

  const pending  = submissions.filter((s) => s.decision === 'pending');
  const reviewed = submissions.filter((s) => s.decision !== 'pending');

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Trainer Studio"
          title="Student Submissions"
          subtitle="Loading learner homework and written assignments…"
        />
        <Card className="p-2">
          <Loading label="Fetching submissions…" />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Trainer Studio"
        title="Student Submissions"
        subtitle="Review homework and written assignments from your enrolled learners."
      />

      {/* Stats row */}
      <div className="gt-stagger grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={Files} tone="info" label="Total" value={submissions.length} hint="All submissions" />
        <StatCard icon={AlertCircle} tone="warn" label="Pending" value={pending.length} hint="Awaiting review" />
        <StatCard icon={Award} tone="success" label="Passed" value={submissions.filter(s => s.decision === 'pass').length} hint="Marked as pass" />
        <StatCard icon={XCircle} tone="danger" label="Failed" value={submissions.filter(s => s.decision === 'fail').length} hint="Marked as fail" />
      </div>

      {submissions.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            icon={FileText}
            title="No submissions yet"
            detail="Learner submissions will appear here once your courses have enrolled students."
          />
        </Card>
      ) : (
        <>
          {/* Pending section */}
          {pending.length > 0 && (
            <Card className="p-6">
              <SectionHeader
                icon={Clock}
                tone="warn"
                title="Pending Review"
                caption="Grade homework as pass, fail, or improve."
                actions={<Badge tone="warn" dot>{pending.length} pending</Badge>}
              />
              <div className="space-y-3">
                {pending.map((sub) => (
                  <SubmissionCard
                    key={sub.id}
                    sub={sub}
                    reviewingId={reviewingId}
                    onReview={handleReview}
                  />
                ))}
              </div>
            </Card>
          )}

          {/* Reviewed section */}
          {reviewed.length > 0 && (
            <Card className="p-6">
              <SectionHeader
                icon={CheckCircle2}
                tone="success"
                title="Reviewed"
                caption="Previously graded submissions."
                actions={<Badge tone="success" dot>{reviewed.length} reviewed</Badge>}
              />
              <div className="space-y-3">
                {reviewed.map((sub) => (
                  <SubmissionCard
                    key={sub.id}
                    sub={sub}
                    reviewingId={reviewingId}
                    onReview={handleReview}
                  />
                ))}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

function SubmissionCard({
  sub,
  reviewingId,
  onReview,
}: {
  sub: Submission;
  reviewingId: string | null;
  onReview: (id: string, decision: 'pass' | 'fail' | 'improve') => void;
}) {
  const isPending = sub.decision === 'pending';
  const isReviewing = reviewingId === sub.id;

  return (
    <div className="gt-card p-5">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge tone={DECISION_TONE[sub.decision]} dot>
              {DECISION_LABELS[sub.decision]}
            </Badge>
            <span className="text-xs text-[var(--gt-text-3)]">{formatDate(sub.submittedAt)}</span>
          </div>

          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
            <h3 className="truncate text-base font-bold text-[var(--gt-text)]">{sub.learnerName}</h3>
            {sub.learnerEmail && (
              <>
                <span className="hidden text-[var(--gt-text-3)] sm:block">·</span>
                <span className="truncate text-sm text-[var(--gt-text-2)]">{sub.learnerEmail}</span>
              </>
            )}
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-[var(--gt-text-3)]">
            <span className="flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" /> {sub.courseTitle}
            </span>
            <span className="text-[var(--gt-text-3)]">›</span>
            <span>{sub.videoTitle}</span>
          </div>

          {/* Content preview */}
          {sub.textAnswer && (
            <p className="mt-3 line-clamp-3 rounded-lg border border-[var(--gt-border)] bg-[var(--gt-bg-soft)] p-3 text-sm text-[var(--gt-text-2)]">
              {sub.textAnswer}
            </p>
          )}
          {sub.fileUrl && (
            <a
              href={sub.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-[var(--gt-accent)] hover:text-[var(--gt-accent-2)]"
            >
              <FileText className="h-3.5 w-3.5" /> View Attached File
            </a>
          )}
          {sub.trainerRemarks && !isPending && (
            <p className="mt-2 text-xs italic text-[var(--gt-text-3)]">Remark: {sub.trainerRemarks}</p>
          )}
        </div>

        {/* Action buttons */}
        {isPending && (
          <div className="flex shrink-0 gap-2">
            <button
              onClick={() => onReview(sub.id, 'pass')}
              disabled={isReviewing}
              className="gt-btn gt-btn--sm"
              style={{ background: 'rgba(52,211,153,0.14)', color: 'var(--gt-success)', border: '1px solid rgba(52,211,153,0.3)' }}
            >
              {isReviewing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ThumbsUp className="h-4 w-4" />}
              Pass
            </button>
            <button
              onClick={() => onReview(sub.id, 'improve')}
              disabled={isReviewing}
              className="gt-btn gt-btn--ghost gt-btn--sm"
            >
              {isReviewing ? <Loader2 className="h-4 w-4 animate-spin" /> : <TrendingUp className="h-4 w-4" />}
              Improve
            </button>
            <button
              onClick={() => onReview(sub.id, 'fail')}
              disabled={isReviewing}
              className="gt-btn gt-btn--sm"
              style={{ background: 'rgba(251,113,133,0.12)', color: 'var(--gt-danger)', border: '1px solid rgba(251,113,133,0.28)' }}
            >
              {isReviewing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ThumbsDown className="h-4 w-4" />}
              Fail
            </button>
          </div>
        )}
        {!isPending && (
          <div className="shrink-0">
            <Badge tone={DECISION_TONE[sub.decision]}>
              {sub.decision === 'pass'
                ? <CheckCircle2 className="h-4 w-4" />
                : sub.decision === 'improve'
                ? <TrendingUp className="h-4 w-4" />
                : <XCircle className="h-4 w-4" />}
              {DECISION_LABELS[sub.decision]}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}
