'use client';

import React, { useEffect, useState } from 'react';
import { Layers, PlayCircle, FileCheck, CheckCircle2, XCircle } from 'lucide-react';
import { coursesApi } from '@/lib/api';
import type { Course } from '@/types/domain';
import { PageHeader, Card, Badge, EmptyState, Loading, Button } from '@/components/trainer/ui';

const STATUS_TONE: Record<string, 'success' | 'warn' | 'danger' | 'info'> = {
  pending_review: 'warn',
  approved: 'success',
  rejected: 'danger',
  draft: 'info',
};

const STATUS_LABELS: Record<string, string> = {
  pending_review: 'Pending Review',
  approved: 'Approved',
  rejected: 'Rejected',
  draft: 'Draft',
};

export default function CourseApprovalPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  async function load() {
    try {
      // Admin-only endpoint — a non-admin viewer gets a 403, which we treat as an empty list.
      const data = await coursesApi.adminList();
      setCourses(Array.isArray(data) ? data : []);
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleReview(id: string, status: 'approved' | 'rejected') {
    setProcessingId(id);
    try {
      await coursesApi.adminReview(
        id,
        status,
        status === 'rejected' ? 'Does not meet standards' : undefined,
      );
      await load();
    } catch {
      // Keep the UI responsive even if the request is rejected (e.g. 403).
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-black text-[#0f3d1a] mb-2 flex items-center gap-3">
            <Layers className="w-8 h-8 text-blue-400" /> Course Approvals
          </h1>
          <p className="text-[#1a6b2e]">Review course quality, structure, and assessments before publishing.</p>
        </div>
      </div>

      <div className="space-y-6">
        {pendingCourses.map((course) => (
          <div key={course.id} className="bg-[#0f172a]/80 backdrop-blur-md border border-[#1e293b] rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row">
            
            <div className="md:w-1/3 bg-[#c8e6c9] p-8 border-r border-[#1e293b] relative">
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {course.level}
                </span>
              </div>
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-[#0f3d1a] mb-2">{course.title}</h2>
                <p className="text-[#64748b] text-sm">By {course.trainer}</p>
              </div>
              
              <div className="mt-8 flex gap-3">
                <button className="flex-1 bg-green-500 hover:bg-green-600 text-[#0f3d1a] py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> Publish
                </button>
                <button className="flex-1 bg-[#1e293b] hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 text-[#1a6b2e] py-3 rounded-xl font-bold transition-all border border-[#334155] flex items-center justify-center gap-2">
                  <XCircle className="w-5 h-5" /> Reject
                </button>
              </div>
            </div>

            <div className="md:w-2/3 p-8">
              <h3 className="text-lg font-bold text-[#0f3d1a] mb-6">Approval Checklist</h3>
              
              <div className="space-y-4">
                <label className="flex items-start gap-4 p-4 rounded-2xl border border-[#1e293b] bg-white/[0.02] cursor-pointer group hover:border-blue-500/50 transition-colors">
                  <input type="checkbox" className="mt-1 w-5 h-5 rounded border-[#334155] text-blue-500 bg-[#0f172a] focus:ring-0 focus:ring-offset-0" />
                  <div>
                    <h4 className="font-bold text-[#0f3d1a] flex items-center gap-2"><PlayCircle className="w-4 h-4 text-[#64748b] group-hover:text-blue-400" /> Video Quality (HD & Clear Audio)</h4>
                    <p className="text-xs text-[#1a6b2e] mt-1">Verify that all {course.videos} videos are recorded in professional environments.</p>
                  </div>
                </label>
                
                <label className="flex items-start gap-4 p-4 rounded-2xl border border-[#1e293b] bg-white/[0.02] cursor-pointer group hover:border-blue-500/50 transition-colors">
                  <input type="checkbox" className="mt-1 w-5 h-5 rounded border-[#334155] text-blue-500 bg-[#0f172a] focus:ring-0 focus:ring-offset-0" />
                  <div>
                    <h4 className="font-bold text-[#0f3d1a] flex items-center gap-2"><Layers className="w-4 h-4 text-[#64748b] group-hover:text-blue-400" /> Course Structure</h4>
                    <p className="text-xs text-[#1a6b2e] mt-1">Ensure logical flow and progressive unlock system is configured.</p>
                  </div>
                </label>

                <label className="flex items-start gap-4 p-4 rounded-2xl border border-[#1e293b] bg-white/[0.02] cursor-pointer group hover:border-blue-500/50 transition-colors">
                  <input type="checkbox" className="mt-1 w-5 h-5 rounded border-[#334155] text-blue-500 bg-[#0f172a] focus:ring-0 focus:ring-offset-0" />
                  <div>
                    <h4 className="font-bold text-[#0f3d1a] flex items-center gap-2"><FileCheck className="w-4 h-4 text-[#64748b] group-hover:text-blue-400" /> Assessment Quality</h4>
                    <p className="text-xs text-[#1a6b2e] mt-1">Verify {course.assessments} assignments, MCQs, and final exam completeness.</p>
                  </div>
                </label>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
