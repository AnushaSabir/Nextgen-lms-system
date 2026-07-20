'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';
import { trainerApi } from '@/lib/api';
import { PageHeader, Card, Badge, Loading, EmptyState } from '@/components/trainer/ui';

type HistoryRow = {
  id: string;
  course: string;
  learner: string;
  grossAmount: number;
  trainerShare: number;
  status: string;
  date: string | null;
};

export default function RevenueHistoryPage() {
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await trainerApi.earningsHistory();
        if (active) setHistory(res);
      } catch {
        if (active) setHistory([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const formatDate = (d: string | null) => {
    if (!d) return '—';
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) ? d : parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const isCleared = (status: string) => status === 'Cleared' || status === 'Completed';

  function exportCsv() {
    const header = ['Transaction ID', 'Course', 'Learner', 'Sale Price (PKR)', 'Your Share (PKR)', 'Status', 'Date'];
    const rows = history.map((r) => [
      r.id,
      r.course,
      r.learner,
      String(r.grossAmount ?? 0),
      String(r.trainerShare ?? 0),
      r.status,
      formatDate(r.date),
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grapetask-revenue-history.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <Link
        href="/trainer/earnings"
        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--gt-text-2)] transition-colors hover:text-[var(--gt-text)]"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Earnings
      </Link>

      <PageHeader
        eyebrow="Trainer Studio"
        title="Revenue History"
        subtitle="Detailed log of all transactions and sales."
        actions={
          <button className="gt-btn gt-btn--primary" onClick={exportCsv} disabled={history.length === 0}>
            <Download className="h-4 w-4" /> Export CSV
          </button>
        }
      />

      <Card className="gt-rise overflow-hidden p-0">
        {loading ? (
          <Loading label="Loading transactions…" />
        ) : history.length === 0 ? (
          <EmptyState icon={Download} title="No transactions yet" detail="Sales and payouts will show up here as students enroll." />
        ) : (
          <div className="overflow-x-auto">
            <table className="gt-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Date</th>
                  <th>Type / Details</th>
                  <th className="text-right">Amount (70%)</th>
                  <th className="text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td className="font-mono text-[var(--gt-text-2)]">{item.id}</td>
                    <td className="text-[var(--gt-text-2)]">{formatDate(item.date)}</td>
                    <td>
                      <p className="font-semibold text-[var(--gt-text)]">Course Sale</p>
                      <p className="mt-0.5 text-xs text-[var(--gt-text-3)]">
                        {item.course} &bull; {item.learner} (Sale Price: PKR {item.grossAmount.toLocaleString()})
                      </p>
                    </td>
                    <td className="gt-num text-right font-bold text-[var(--gt-success)]">
                      +PKR {item.trainerShare.toLocaleString()}
                    </td>
                    <td className="text-right">
                      <Badge tone={isCleared(item.status) ? 'success' : 'warn'} dot>
                        {item.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
