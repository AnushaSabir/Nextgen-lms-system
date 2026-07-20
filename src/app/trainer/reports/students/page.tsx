'use client';

import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Users, Target } from 'lucide-react';
import { trainerApi } from '@/lib/api';
import {
  PageHeader,
  StatCard,
  Card,
  SectionHeader,
  Badge,
  EmptyState,
  Loading,
} from '@/components/trainer/ui';

type Student = {
  id: string;
  name: string;
  email: string;
  course: string;
  courseId: string;
  status: string;
  progress: number;
  totalVideos: number;
  unlockedVideoPosition: number;
};

export default function StudentReportsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const data = await trainerApi.students();
        if (active) setStudents(Array.isArray(data) ? data : []);
      } catch {
        if (active) setStudents([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Derived KPIs from the real student array.
  const totalStudents = students.length;
  const avgCompletion = totalStudents
    ? Math.round(students.reduce((sum, s) => sum + (s.progress || 0), 0) / totalStudents)
    : 0;
  const completedCount = students.filter((s) => (s.progress || 0) >= 100).length;
  const atRiskCount = students.filter((s) => (s.progress || 0) < 30).length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Reports"
        title="Student Reports"
        subtitle="Track progress and identify students who need help."
      />

      <div className="gt-stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Users} tone="info" label="Total Students" value={totalStudents} hint="Enrolled across courses" />
        <StatCard icon={Target} tone="success" label="Average Completion" value={`${avgCompletion}%`} hint="Mean progress" />
        <StatCard icon={TrendingUp} tone="warn" label="Completed" value={completedCount} hint="100% progress" />
        <StatCard icon={BarChart3} tone="danger" label="At Risk Students" value={atRiskCount} hint="Below 30% progress" />
      </div>

      <Card className="p-6">
        <SectionHeader
          icon={BarChart3}
          tone="accent"
          title="Performance Overview"
          caption="Per-student progress across enrolled courses."
        />
        {loading ? (
          <Loading label="Loading students…" />
        ) : students.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No students yet"
            detail="Enrolled students will appear here as they join your courses."
          />
        ) : (
          <div className="space-y-2.5">
            {students.map((student) => (
              <div
                key={student.id}
                className="gt-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 sm:w-1/4">
                  <h4 className="truncate font-semibold text-[var(--gt-text)]">{student.name}</h4>
                  <p className="truncate text-xs text-[var(--gt-text-3)]">{student.email}</p>
                </div>

                <div className="flex-1 sm:px-4">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="truncate text-xs text-[var(--gt-text-2)]">{student.course}</span>
                    <span className="gt-num text-xs font-bold text-[var(--gt-text)]">{student.progress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--gt-surface-2)]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[var(--gt-accent)] to-[var(--gt-accent-2)] transition-all"
                      style={{ width: `${student.progress}%` }}
                    />
                  </div>
                </div>

                <div className="sm:w-1/5 sm:text-right">
                  <Badge tone={student.progress >= 100 ? 'success' : student.progress < 30 ? 'danger' : 'info'} dot>
                    {student.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
