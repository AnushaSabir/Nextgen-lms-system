'use client';

import { useEffect, useState } from 'react';
import {
  CheckCircle2, Clock, FileText, Loader2, ThumbsDown, ThumbsUp,
  TrendingUp, XCircle,
} from 'lucide-react';
import { Card, CardTitle } from '@/components/ui/Card';
import { PageHeader } from '../components/TrainerShared';
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

const DECISION_STYLES: Record<string, string> = {
  pass:    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  fail:    'bg-red-500/10    text-red-400    border-red-500/20',
  improve: 'bg-amber-500/10  text-amber-400  border-amber-500/20',
  pending: 'bg-gray-700/50   text-[#1a6b2e]   border-gray-700',
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
    setSubmissions(data as unknown as Submission[]);
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
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      <PageHeader
        title="Student Submissions"
        caption="Review homework and written assignments from your enrolled learners."
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: submissions.length, color: 'border-gray-700 bg-gray-800/50' },
          { label: 'Pending', value: pending.length,   color: 'border-amber-500/20 bg-amber-500/5' },
          { label: 'Passed',  value: submissions.filter(s => s.decision === 'pass').length,    color: 'border-emerald-500/20 bg-emerald-500/5' },
          { label: 'Failed',  value: submissions.filter(s => s.decision === 'fail').length,    color: 'border-red-500/20 bg-red-500/5' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-xl border p-4 text-center ${color}`}>
            <div className="text-2xl font-bold text-[#0f3d1a]">{value}</div>
            <div className="text-xs text-[#1a6b2e] mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {submissions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-700 p-16 text-center bg-gray-800/20">
          <FileText className="mx-auto h-12 w-12 text-[#7dab52] mb-4" />
          <h3 className="text-lg font-semibold text-[#0f3d1a]">No submissions yet</h3>
          <p className="mt-2 text-sm text-[#1a6b2e]">
            Learner submissions will appear here once your courses have enrolled students.
          </p>
        </div>
      ) : (
        <>
          {/* Pending section */}
          {pending.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4" /> Pending Review ({pending.length})
              </h2>
              <div className="space-y-4">
                {pending.map((sub) => (
                  <SubmissionCard
                    key={sub.id}
                    sub={sub}
                    reviewingId={reviewingId}
                    onReview={handleReview}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Reviewed section */}
          {reviewed.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#7dab52] mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Reviewed ({reviewed.length})
              </h2>
              <div className="space-y-4">
                {reviewed.map((sub) => (
                  <SubmissionCard
                    key={sub.id}
                    sub={sub}
                    reviewingId={reviewingId}
                    onReview={handleReview}
                  />
                ))}
              </div>
            </div>
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
    <Card className="border-gray-700/50 bg-gray-800/40 p-5 hover:bg-gray-800/70 transition-all">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${DECISION_STYLES[sub.decision]}`}>
              {DECISION_LABELS[sub.decision]}
            </span>
            <span className="text-xs text-[#7dab52]">{formatDate(sub.submittedAt)}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <h3 className="text-base font-bold text-[#0f3d1a] truncate">{sub.learnerName}</h3>
            <span className="hidden sm:block text-gray-600">·</span>
            <span className="text-sm text-[#1a6b2e] truncate">{sub.learnerEmail}</span>
          </div>

          <div className="mt-1.5 flex items-center gap-3 text-xs text-[#7dab52] flex-wrap">
            <span className="flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" /> {sub.courseTitle}
            </span>
            <span className="text-gray-700">›</span>
            <span>{sub.videoTitle}</span>
          </div>

          {/* Content preview */}
          {sub.textAnswer && (
            <p className="mt-3 text-sm text-[#1a6b2e] bg-gray-900/50 rounded-lg p-3 border border-gray-700 line-clamp-3">
              {sub.textAnswer}
            </p>
          )}
          {sub.fileUrl && (
            <a
              href={sub.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-orange-300"
            >
              <FileText className="h-3.5 w-3.5" /> View Attached File
            </a>
          )}
          {sub.trainerRemarks && !isPending && (
            <p className="mt-2 text-xs text-[#7dab52] italic">Remark: {sub.trainerRemarks}</p>
          )}
        </div>

        {/* Action buttons */}
        {isPending && (
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => onReview(sub.id, 'pass')}
              disabled={isReviewing}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-sm font-semibold px-4 py-2.5 border border-emerald-500/20 transition-colors disabled:opacity-50"
            >
              {isReviewing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ThumbsUp className="h-4 w-4" />}
              Pass
            </button>
            <button
              onClick={() => onReview(sub.id, 'improve')}
              disabled={isReviewing}
              className="flex items-center gap-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-sm font-semibold px-4 py-2.5 border border-amber-500/20 transition-colors disabled:opacity-50"
            >
              {isReviewing ? <Loader2 className="h-4 w-4 animate-spin" /> : <TrendingUp className="h-4 w-4" />}
              Improve
            </button>
            <button
              onClick={() => onReview(sub.id, 'fail')}
              disabled={isReviewing}
              className="flex items-center gap-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-semibold px-4 py-2.5 border border-red-500/20 transition-colors disabled:opacity-50"
            >
              {isReviewing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ThumbsDown className="h-4 w-4" />}
              Fail
            </button>
          </div>
        )}
        {!isPending && (
          <div className={`flex items-center gap-2 shrink-0 px-4 py-2.5 rounded-lg border ${DECISION_STYLES[sub.decision]}`}>
            {sub.decision === 'pass' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            <span className="text-sm font-semibold">{DECISION_LABELS[sub.decision]}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
