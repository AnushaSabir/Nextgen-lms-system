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
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <Link href="/dashboard/trainer/submissions" className="inline-flex items-center gap-2 text-[#64748b] hover:text-[#0f3d1a] mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Submissions
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[#0f3d1a] font-black text-xl shadow-lg">
            SK
          </div>
          <div>
            <h1 className="text-3xl font-black text-[#0f3d1a]">Sarah Khan</h1>
            <p className="text-[#1a6b2e]">Submitted 2 hours ago • Video 5: React Portfolio</p>
          </div>
        </div>
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
          <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-[#1e293b] rounded-3xl p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-[#0f3d1a] mb-6 flex items-center gap-2">
              <FileText className="text-[#d94d19]" /> Student's Work
            </h2>
            
            <div className="space-y-6 text-[#1a6b2e] leading-relaxed">
              <p>Here is my submission for the React Portfolio assignment. I have used Next.js, Tailwind CSS, and Framer Motion for the animations.</p>
              
              <div className="p-4 rounded-xl border border-[#1e293b] bg-[#c8e6c9] flex items-center justify-between group cursor-pointer hover:border-white/20 transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">ZIP</div>
                  <div>
                    <p className="text-sm font-bold text-[#0f3d1a]">portfolio-project_final.zip</p>
                    <p className="text-xs text-[#64748b]">24 MB</p>
                  </div>
                </div>
                <button className="text-[#64748b] group-hover:text-[#0f3d1a] p-2 bg-[#1e293b] rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h4 className="font-bold text-[#0f3d1a] mb-2">Live Link:</h4>
                <a href="#" className="text-blue-400 hover:underline">https://sarah-portfolio.vercel.app</a>
              </div>
            </div>
          </Card>
        </div>

        {/* Grading Panel */}
        <div className="space-y-6">
          <div className="bg-[#c8e6c9] border border-[#1e293b] rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1a6b2e]/5 rounded-bl-full pointer-events-none" />
            <h3 className="text-lg font-bold text-[#0f3d1a] mb-6">Grade Submission</h3>
            
            <div className="space-y-4 mb-8">
              <button className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-[#1e293b] hover:border-green-500 hover:bg-green-500/10 transition-all group">
                <CheckCircle2 className="w-6 h-6 text-[#64748b] group-hover:text-green-500" />
                <span className="font-bold text-[#1a6b2e] group-hover:text-[#0f3d1a]">Pass</span>
              </button>
              
              <button className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-[#1e293b] hover:border-yellow-500 hover:bg-yellow-500/10 transition-all group">
                <RefreshCcw className="w-6 h-6 text-[#64748b] group-hover:text-yellow-500" />
                <span className="font-bold text-[#1a6b2e] group-hover:text-[#0f3d1a]">Improve (Resubmit)</span>
              </button>

              <button className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-[#1e293b] hover:border-red-500 hover:bg-red-500/10 transition-all group">
                <XCircle className="w-6 h-6 text-[#64748b] group-hover:text-red-500" />
                <span className="font-bold text-[#1a6b2e] group-hover:text-[#0f3d1a]">Fail</span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#64748b] uppercase">Trainer Feedback</label>
              <textarea 
                className="w-full h-32 bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 text-sm text-[#0f3d1a] placeholder:text-[#475569] focus:outline-none focus:border-[#5E6F58] transition-all resize-none"
                placeholder="Write your feedback here..."
              />
            </div>

            <button className="w-full mt-6 bg-[#5E6F58] hover:bg-[#ea580c] text-[#0f3d1a] py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(240,89,31,0.3)] transition-all active:scale-95">
              Submit Evaluation
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}
