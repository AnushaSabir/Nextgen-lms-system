'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { coursesApi, submissionsApi, trainerApi } from '@/lib/api';
import type { Course, ReviewDecision } from '@/types/domain';
import {
  BookOpen,
  Users,
  AlertCircle,
  Wallet,
  Plus,
  Video,
  MessageSquare,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  GraduationCap,
} from 'lucide-react';
import {
  PageHeader,
  StatCard,
  Card,
  SectionHeader,
  Badge,
  EmptyState,
  Loading,
} from '@/components/trainer/ui';

const STATUS_TONE: Record<string, 'success' | 'warn' | 'danger' | 'info'> = {
  approved: 'success',
  pending_review: 'warn',
  draft: 'info',
  rejected: 'danger',
};

export function TrainerDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [courses, setCourses] = useState<Course[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [earnings, setEarnings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const loaded = useRef(false);

  async function load() {
    const [c, s, a, e] = await Promise.allSettled([
      coursesApi.list(),
      submissionsApi.trainerList(),
      trainerApi.analytics(),
      trainerApi.earnings(),
    ]);
    if (c.status === 'fulfilled') setCourses(c.value as Course[]);
    if (s.status === 'fulfilled') setSubmissions(s.value);
    if (a.status === 'fulfilled') setAnalytics(a.value);
    if (e.status === 'fulfilled') setEarnings(e.value);
    setLoading(false);
  }

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    load();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  async function review(id: string, decision: ReviewDecision) {
    await submissionsApi.review(
      id,
      decision,
      decision === 'fail' ? 'Re-watch the lesson and retry with a different set.' : 'Reviewed by trainer.',
    );
    setToast(`Submission marked as ${decision}.`);
    await load();
  }

  const pending = submissions.filter((s) => !s.reviewed);
  const totalCourses = analytics?.totalCourses ?? courses.length;
  const totalStudents = analytics?.totalStudents ?? 0;
  const totalEarnings = earnings?.total ?? analytics?.totalEarnings ?? 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Trainer Studio" title="Dashboard" subtitle="Loading your workspace…" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="gt-skeleton h-32 rounded-[20px]" />
          ))}
        </div>
        <Card className="p-2">
          <Loading label="Fetching courses and submissions…" />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {toast && (
        <div className="gt-rise fixed right-6 top-20 z-50 flex items-center gap-2.5 rounded-2xl border border-[var(--gt-success)]/30 bg-[var(--gt-panel)] px-4 py-3 text-sm text-[var(--gt-success)] shadow-2xl">
          <CheckCircle2 className="h-4 w-4" />
          {toast}
        </div>
      )}

      <PageHeader
        eyebrow="Trainer Studio"
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'Trainer'}`}
        subtitle="Here's what's happening across your courses, students, and earnings today."
        actions={
          <Link href="/trainer/create-course" className="gt-btn gt-btn--primary">
            <Plus className="h-4 w-4" /> New Course
          </Link>
        }
      />

      {/* Stats */}
      <div className="gt-stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={BookOpen} tone="info" label="Total Courses" value={totalCourses} hint={`${analytics?.activeCourses ?? 0} published`} />
        <StatCard icon={Users} tone="accent" label="Active Students" value={totalStudents} hint="Enrolled across courses" />
        <StatCard icon={AlertCircle} tone="warn" label="Awaiting Review" value={pending.length} hint={`${submissions.length} total submissions`} />
        <StatCard icon={Wallet} tone="success" label="Earnings (PKR)" value={totalEarnings} hint={`${earnings?.trainerSharePercent ?? 70}% revenue share`} />
      </div>

      {/* Quick actions */}
      <div className="gt-stagger grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Add a Lesson', href: '/trainer/courses', icon: Video },
          { label: 'Retry Sets', href: '/trainer/assessments/retry', icon: RotateCcw },
          { label: 'Message Students', href: '/trainer/chat', icon: MessageSquare },
          { label: 'Schedule Q&A', href: '/trainer/meetings', icon: GraduationCap },
        ].map((a) => {
          const Icon = a.icon;
          return (
            <Link key={a.label} href={a.href}>
              <Card hover className="flex items-center gap-3 p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--gt-border-2)] bg-[var(--gt-surface-2)] text-[var(--gt-accent)]">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold text-[var(--gt-text)]">{a.label}</span>
                <ArrowRight className="ml-auto h-4 w-4 text-[var(--gt-text-3)]" />
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        {/* Recent courses */}
        <Card className="p-6">
          <SectionHeader
            icon={BookOpen}
            tone="info"
            title="My Courses"
            caption="Manage drafts, submissions, and live content."
            actions={
              <Link href="/trainer/courses" className="gt-btn gt-btn--ghost gt-btn--sm">
                View all
              </Link>
            }
          />
          {courses.length ? (
            <div className="space-y-2.5">
              {courses.slice(0, 5).map((course) => {
                const status = (course as any).status || 'draft';
                return (
                  <Link
                    key={course.id}
                    href={`/trainer/courses/${course.id}`}
                    className="gt-card gt-card--hover flex items-center gap-4 p-3.5"
                  >
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--gt-border-2)] bg-[var(--gt-surface-2)] text-[var(--gt-accent)]">
                      <BookOpen className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[var(--gt-text)]">{course.title}</p>
                      <p className="mt-0.5 text-xs capitalize text-[var(--gt-text-3)]">
                        {course.level} · {(course as any).videoCount ?? course.videos?.length ?? 0} lessons
                      </p>
                    </div>
                    <Badge tone={STATUS_TONE[status] ?? 'info'} dot>
                      {String(status).replace('_', ' ')}
                    </Badge>
                  </Link>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={Sparkles}
              title="No courses yet"
              detail="Create your first course to start teaching on GrapeTask."
              action={
                <Link href="/trainer/create-course" className="gt-btn gt-btn--primary gt-btn--sm">
                  <Plus className="h-4 w-4" /> Create course
                </Link>
              }
            />
          )}
        </Card>

        {/* Pending submissions */}
        <Card className="p-6">
          <SectionHeader
            icon={AlertCircle}
            tone="warn"
            title="Awaiting Review"
            caption="Grade homework as pass, fail, or improve."
            actions={
              pending.length ? (
                <Badge tone="warn" dot>
                  {pending.length} pending
                </Badge>
              ) : undefined
            }
          />
          {pending.length ? (
            <div className="space-y-2.5">
              {pending.slice(0, 4).map((s) => {
                const name = s.enrollment?.learner?.name ?? 'Learner';
                return (
                  <div key={s.id} className="gt-card p-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--gt-accent)] to-[#ff8a4c] text-xs font-bold text-white">
                        {name[0]?.toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[var(--gt-text)]">{name}</p>
                        <p className="truncate text-xs text-[var(--gt-text-3)]">{s.video?.title ?? 'Homework'}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => review(s.id, 'pass' as ReviewDecision)} className="gt-btn gt-btn--sm flex-1" style={{ background: 'rgba(52,211,153,0.14)', color: 'var(--gt-success)', border: '1px solid rgba(52,211,153,0.3)' }}>
                        <ThumbsUp className="h-3.5 w-3.5" /> Pass
                      </button>
                      <button onClick={() => review(s.id, 'improve' as ReviewDecision)} className="gt-btn gt-btn--ghost gt-btn--sm flex-1">
                        Improve
                      </button>
                      <button onClick={() => review(s.id, 'fail' as ReviewDecision)} className="gt-btn gt-btn--sm flex-1" style={{ background: 'rgba(251,113,133,0.12)', color: 'var(--gt-danger)', border: '1px solid rgba(251,113,133,0.28)' }}>
                        <ThumbsDown className="h-3.5 w-3.5" /> Fail
                      </button>
                    </div>
                  </div>
                );
              })}
              <Link href="/trainer/submissions" className="gt-btn gt-btn--ghost w-full">
                Review all submissions <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <EmptyState icon={CheckCircle2} title="All caught up" detail="No submissions waiting for your review." />
          )}
        </Card>
      </div>
    </div>
  );
}
