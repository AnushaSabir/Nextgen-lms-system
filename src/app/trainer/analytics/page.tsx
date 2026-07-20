'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Clock, Search, Activity, AlertCircle, Files } from 'lucide-react';
import { PageHeader, StatCard, Card, SectionHeader, Badge, Loading } from '@/components/trainer/ui';
import { trainerApi } from '@/lib/api';

type Analytics = {
  totalCourses: number;
  activeCourses: number;
  totalStudents: number;
  totalSubmissions: number;
  pendingReviews: number;
  passRate: number;
  totalEarnings: number;
};

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

const STATUS_TONE: Record<string, 'success' | 'info' | 'danger'> = {
  completed: 'success',
  active: 'info',
  suspended: 'danger',
};

export default function TrainerAnalyticsPage() {
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalCourses: 0,
    activeCourses: 0,
    totalStudents: 0,
    totalSubmissions: 0,
    pendingReviews: 0,
    passRate: 0,
    totalEarnings: 0,
  });
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [a, s] = await Promise.all([
          trainerApi.analytics().catch(() => null),
          trainerApi.students().catch(() => []),
        ]);
        if (!active) return;
        if (a) setAnalytics(a);
        setStudents(Array.isArray(s) ? s : []);
      } catch {
        if (!active) return;
        setStudents([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Course options derived from real students
  const courseOptions = Array.from(
    new Map(students.map((s) => [s.courseId, s.course])).entries()
  ).filter(([id]) => id);

  const filteredStudents = students.filter((s) => {
    const matchCourse = selectedCourse === 'all' || s.courseId === selectedCourse;
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
    return matchCourse && matchSearch;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Trainer Studio"
        title="Student Analytics"
        subtitle="Track student progress, engagement, and drop-off rates."
        actions={
          <div className="w-full sm:w-56">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="gt-input"
            >
              <option value="all">All Courses</option>
              {courseOptions.map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>
        }
      />

      {/* Stats Grid */}
      <div className="gt-stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Users} tone="info" label="Total Students" value={analytics.totalStudents} hint={`${analytics.activeCourses} active courses`} />
        <StatCard icon={Activity} tone="success" label="Pass Rate" value={`${analytics.passRate}%`} hint="Of reviewed work" />
        <StatCard icon={AlertCircle} tone="warn" label="Pending Reviews" value={analytics.pendingReviews} hint="Awaiting grade" />
        <StatCard icon={Files} tone="accent" label="Total Submissions" value={analytics.totalSubmissions} hint={`${analytics.totalCourses} courses`} />
      </div>

      {/* Progress Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <SectionHeader icon={BarChart3} tone="info" title="Course Completion Funnel" caption="Where learners are across the course journey." />

          <div className="space-y-5">
            {(() => {
              const total = students.length;
              const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);
              const started = students.filter((s) => s.progress >= 0).length;
              const q25 = students.filter((s) => s.progress >= 25).length;
              const q50 = students.filter((s) => s.progress >= 50).length;
              const q75 = students.filter((s) => s.progress >= 75).length;
              const done = students.filter((s) => s.progress >= 100).length;
              return [
                { label: 'Started Course (0-10%)', count: started, width: `${pct(started)}%` },
                { label: 'Watched 25%', count: q25, width: `${pct(q25)}%` },
                { label: 'Watched 50%', count: q50, width: `${pct(q50)}%` },
                { label: 'Watched 75%', count: q75, width: `${pct(q75)}%` },
                { label: 'Completed (100%)', count: done, width: `${pct(done)}%` },
              ];
            })().map((bar, i) => (
              <div key={i}>
                <div className="mb-2 flex justify-between text-sm font-semibold">
                  <span className="text-[var(--gt-text-2)]">{bar.label}</span>
                  <span className="gt-num text-[var(--gt-text)]">{bar.count} Students</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full border border-[var(--gt-border)] bg-[var(--gt-surface-2)]">
                  <div
                    className="h-full rounded-full"
                    style={{ width: bar.width, background: 'linear-gradient(90deg, var(--gt-accent), var(--gt-accent-2))' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <SectionHeader icon={Activity} tone="accent" title="Drop-off Insights" caption="Engagement signals worth acting on." />
          <p className="mb-6 text-sm text-[var(--gt-text-2)]">
            Most students drop off after the first 25% of the course. Consider adding a summary task or interactive quiz to keep them engaged.
          </p>

          <div className="rounded-2xl border border-[rgba(240,89,31,0.28)] bg-[var(--gt-accent-soft)] p-5">
            <h4 className="mb-1 font-bold text-[var(--gt-accent-2)]">Pending Reviews</h4>
            <p className="text-sm text-[var(--gt-text-2)]">{analytics.pendingReviews} submissions awaiting grade</p>
            <p className="mt-2 text-xs text-[var(--gt-accent)]">{analytics.passRate}% pass rate</p>
          </div>
        </Card>
      </div>

      {/* Student List */}
      <Card className="p-6">
        <SectionHeader
          icon={Users}
          tone="accent"
          title="Student Progress"
          caption="Per-learner completion across your courses."
          actions={
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--gt-text-3)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search student..."
                className="gt-input"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          }
        />

        <div className="gt-scroll overflow-x-auto">
          <table className="gt-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Course</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5}>
                    <Loading label="Loading students…" />
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-[var(--gt-text-3)]">No students enrolled yet</td>
                </tr>
              ) : filteredStudents.map(student => (
                <tr key={student.id}>
                  <td>
                    <p className="font-semibold text-[var(--gt-text)]">{student.name}</p>
                    <p className="text-xs text-[var(--gt-text-3)]">{student.email}</p>
                  </td>
                  <td className="text-[var(--gt-text-2)]">{student.course}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-[var(--gt-surface-2)]">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${student.progress}%`,
                            background:
                              student.progress === 100 ? 'var(--gt-success)'
                              : student.progress > 50 ? 'var(--gt-info)'
                              : 'var(--gt-accent)',
                          }}
                        />
                      </div>
                      <span className="gt-num text-xs font-bold text-[var(--gt-text-2)]">{student.progress}%</span>
                    </div>
                  </td>
                  <td>
                    <Badge tone={STATUS_TONE[student.status] ?? 'info'} dot>
                      {student.status ? student.status.charAt(0).toUpperCase() + student.status.slice(1) : '—'}
                    </Badge>
                  </td>
                  <td className="text-[var(--gt-text-3)]">{student.unlockedVideoPosition}/{student.totalVideos} videos</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
