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
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Course Approvals"
        subtitle="Review course quality, structure, and assessments before publishing."
      />

      {loading ? (
        <Card className="p-2">
          <Loading label="Loading courses…" />
        </Card>
      ) : courses.length === 0 ? (
        <Card className="p-2">
          <EmptyState
            icon={Layers}
            title="No pending courses"
            detail="Submitted courses will appear here for review."
          />
        </Card>
      ) : (
        <div className="gt-stagger space-y-6">
          {courses.map((course) => {
            const videosCount = course.videos?.length ?? 0;
            const busy = processingId === course.id;
            const statusLabel = STATUS_LABELS[course.status] ?? course.status;

            const checklist = [
              {
                icon: PlayCircle,
                title: 'Video Quality (HD & Clear Audio)',
                detail: `Verify that all ${videosCount} videos are recorded in professional environments.`,
              },
              {
                icon: Layers,
                title: 'Course Structure',
                detail: 'Ensure logical flow and progressive unlock system is configured.',
              },
              {
                icon: FileCheck,
                title: 'Assessment Quality',
                detail: 'Verify all assignments, MCQs, and final exam completeness.',
              },
            ];

            return (
              <Card key={course.id} className="flex flex-col overflow-hidden md:flex-row">
                <div className="relative border-b border-[var(--gt-border)] p-6 md:w-1/3 md:border-b-0 md:border-r">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <Badge tone="info">{course.level}</Badge>
                    <Badge tone={STATUS_TONE[course.status] ?? 'info'} dot>{statusLabel}</Badge>
                  </div>
                  <h2 className="mb-1 text-xl font-bold text-[var(--gt-text)]">{course.title}</h2>
                  <p className="text-sm text-[var(--gt-text-3)]">By {course.trainer?.name ?? 'Unknown Trainer'}</p>

                  <div className="mt-6 flex gap-3">
                    <Button
                      onClick={() => handleReview(course.id, 'approved')}
                      disabled={busy}
                      className="flex-1"
                    >
                      <CheckCircle2 className="h-4 w-4" /> Publish
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleReview(course.id, 'rejected')}
                      disabled={busy}
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4" /> Reject
                    </Button>
                  </div>
                </div>

                <div className="p-6 md:w-2/3">
                  <h3 className="mb-5 text-[15px] font-bold text-[var(--gt-text)]">Approval Checklist</h3>

                  <div className="space-y-3">
                    {checklist.map(({ icon: Icon, title, detail }) => (
                      <label
                        key={title}
                        className="group flex cursor-pointer items-start gap-4 rounded-xl border border-[var(--gt-border)] bg-[var(--gt-surface)] p-4 transition-colors hover:border-[rgba(240,89,31,0.5)]"
                      >
                        <input type="checkbox" className="mt-1 h-4 w-4 accent-[var(--gt-accent)]" />
                        <div>
                          <h4 className="flex items-center gap-2 font-bold text-[var(--gt-text)]">
                            <Icon className="h-4 w-4 text-[var(--gt-text-3)] transition-colors group-hover:text-[var(--gt-accent)]" /> {title}
                          </h4>
                          <p className="mt-1 text-xs text-[var(--gt-text-2)]">{detail}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
