'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, Activity, CreditCard, Clock, BookOpen, Wallet, Download } from 'lucide-react';
import Link from 'next/link';
import { trainerApi } from '@/lib/api';
import { PageHeader, StatCard, Card, SectionHeader, EmptyState, Loading } from '@/components/trainer/ui';

type EarningsData = {
  total: number;
  cleared: number;
  pending: number;
  trainerSharePercent: number;
  platformSharePercent: number;
  perCourse: Array<{ course: string; students: number; gross: number; earned: number }>;
};

export default function EarningsDashboardPage() {
  const [data, setData] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await trainerApi.earnings();
        if (active) setData(res);
      } catch {
        if (active) setData({ total: 0, cleared: 0, pending: 0, trainerSharePercent: 70, platformSharePercent: 30, perCourse: [] });
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const total = data?.total ?? 0;
  const cleared = data?.cleared ?? 0;
  const pending = data?.pending ?? 0;
  const perCourse = data?.perCourse ?? [];

  const exportCsv = () => {
    const header = 'Course,Students,Gross (PKR),Earned (PKR)';
    const rows = perCourse.map((c) => `"${c.course}",${c.students},${c.gross},${c.earned}`);
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'earnings-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Trainer Studio"
        title="Earnings & Revenue"
        subtitle="Track your financial progress and withdraw your available balance."
        actions={
          <>
            <button onClick={exportCsv} className="gt-btn gt-btn--ghost">
              <Download className="h-4 w-4" /> Export Report
            </button>
            <Link href="/trainer/withdrawal" className="gt-btn gt-btn--primary">
              <CreditCard className="h-4 w-4" /> Withdraw Funds
            </Link>
          </>
        }
      />

      {/* Big totals */}
      <div className="gt-stagger grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={Wallet}
          tone="success"
          label="Available Balance"
          value={loading ? '—' : `PKR ${cleared.toLocaleString()}`}
          hint="Cleared & ready to withdraw"
        />
        <StatCard
          icon={TrendingUp}
          tone="accent"
          label="Total Earned"
          value={loading ? '—' : `PKR ${total.toLocaleString()}`}
          hint={`${data?.trainerSharePercent ?? 70}% trainer share`}
        />
        <StatCard
          icon={Clock}
          tone="warn"
          label="Pending Clearance"
          value={loading ? '—' : `PKR ${pending.toLocaleString()}`}
          hint="Clears soon"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* Revenue by course */}
        <Card className="p-6">
          <SectionHeader
            icon={Activity}
            tone="accent"
            title="Revenue by Course"
            caption="Earnings breakdown across your published courses."
          />
          {loading ? (
            <Loading label="Loading revenue…" />
          ) : perCourse.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No course revenue yet"
              detail="Revenue appears here once students enroll in and complete your courses."
            />
          ) : (
            <div className="gt-stagger space-y-2.5">
              {perCourse.map((course, i) => (
                <div key={i} className="gt-card gt-card--hover flex items-center justify-between gap-4 p-3.5">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--gt-border-2)] bg-[var(--gt-surface-2)] text-[var(--gt-accent)]">
                      <BookOpen className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--gt-text)]">{course.course}</p>
                      <p className="mt-0.5 text-xs text-[var(--gt-text-3)]">{course.students} students</p>
                    </div>
                  </div>
                  <p className="gt-num flex-shrink-0 text-sm font-bold text-[var(--gt-success)]">
                    +PKR {course.earned.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Transactions pointer */}
        <Card className="p-6">
          <SectionHeader
            icon={CreditCard}
            tone="info"
            title="Recent Transactions"
            caption="Every sale and payout, in detail."
            actions={
              <Link href="/trainer/earnings/history" className="gt-btn gt-btn--ghost gt-btn--sm">
                View all
              </Link>
            }
          />
          <EmptyState
            icon={CreditCard}
            title="Full transaction log"
            detail="Open your revenue history to see every course sale and withdrawal with dates and status."
            action={
              <Link href="/trainer/earnings/history" className="gt-btn gt-btn--primary gt-btn--sm">
                View revenue history
              </Link>
            }
          />
        </Card>
      </div>
    </div>
  );
}
