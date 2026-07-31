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
    <div className="p-4 sm:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f3d1a] mb-1 sm:mb-2">Practical Assignments</h1>
          <p className="text-sm sm:text-base text-[#1a6b2e]">Create and manage practical tasks for your students.</p>
        </div>
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#5E6F58] to-sky-500 hover:opacity-90 text-[#0f3d1a] px-6 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(240,89,31,0.3)] transition-all active:scale-95">
          <Plus className="w-5 h-5" /> New Assignment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="bg-white/[0.02] backdrop-blur-3xl border border-[#1a6b2e]/20 rounded-[32px] p-8 transition-all duration-700 transform-style-3d hover:-translate-y-2 hover:scale-[1.02] hover:border-sky-500/50 hover:shadow-[0_20px_60px_rgba(240,89,31,0.2)] group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#1a6b2e]/5 rounded-bl-full pointer-events-none group-hover:bg-[#5E6F58]/5 transition-colors" />
            
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-[#1e293b] rounded-xl text-[#d94d19]">
                <BookOpen className="w-6 h-6" />
              </div>
              <button className="text-[#64748b] hover:text-[#0f3d1a] p-2">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            
            <h3 className="text-xl font-bold text-[#0f3d1a] mb-1">{assignment.title}</h3>
            <p className="text-[#64748b] text-sm mb-6">{assignment.course}</p>
            
            <div className="flex items-center justify-between pt-4 border-t border-[#1e293b]">
              <div className="flex items-center gap-2 text-sm text-[#1a6b2e]">
                <Clock className="w-4 h-4" /> {assignment.due}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                assignment.status === 'Active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                assignment.status === 'Draft' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              }`}>
                {assignment.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
