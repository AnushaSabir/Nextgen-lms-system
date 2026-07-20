'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Wallet, ShieldCheck, Banknote, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToastStore } from '@/store/toast-store';
import { trainerApi } from '@/lib/api';
import { PageHeader, StatCard, Card, SectionHeader, Badge, EmptyState, Loading, Skeleton } from '@/components/trainer/ui';

type WithdrawalMethod = { id: string; provider: string; accountTitle: string; accountNumber: string; isActive: boolean };
type WithdrawalRequest = { id: string; amount: number; status: string; createdAt: string; method?: { provider: string; accountTitle: string } };

const fmtPKR = (n: number) => `PKR ${Number(n || 0).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

type Tone = 'success' | 'danger' | 'warn';
const statusTone = (status: string): Tone => {
  const s = (status || '').toLowerCase();
  if (s === 'completed' || s === 'approved' || s === 'paid') return 'success';
  if (s === 'rejected' || s === 'failed' || s === 'cancelled') return 'danger';
  return 'warn';
};

export default function WithdrawalPage() {
  const router = useRouter();
  const { showToast } = useToastStore();

  const [amount, setAmount] = useState('');
  const [selectedMethodId, setSelectedMethodId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [availableBalance, setAvailableBalance] = useState(0);
  const [methods, setMethods] = useState<WithdrawalMethod[]>([]);
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [w, m] = await Promise.all([
        trainerApi.withdrawals().catch(() => ({ availableBalance: 0, requests: [] as WithdrawalRequest[] })),
        trainerApi.withdrawalMethods().catch(() => [] as WithdrawalMethod[]),
      ]);
      setAvailableBalance(w?.availableBalance ?? 0);
      setRequests(Array.isArray(w?.requests) ? w.requests : []);
      const list = Array.isArray(m) ? m : [];
      setMethods(list);
      setSelectedMethodId((prev) => prev || (list[0]?.id ?? ''));
    } catch {
      showToast('Failed to load withdrawal data', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    if (numAmount > availableBalance) {
      showToast('Amount exceeds available balance', 'error');
      return;
    }

    if (!selectedMethodId) {
      showToast('Please select a withdrawal method', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await trainerApi.requestWithdrawal({ methodId: selectedMethodId, amount: numAmount });
      showToast(`Withdrawal request for ${fmtPKR(numAmount)} submitted successfully!`, 'success');
      setAmount('');
      await loadData();
      router.push('/trainer/earnings');
    } catch {
      showToast('Failed to submit withdrawal request', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        title="Withdraw Funds"
        subtitle="Transfer your available balance to your preferred account."
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Left column — balance, form, history */}
        <div className="space-y-6">
          <StatCard
            icon={Wallet}
            tone="success"
            label="Available Balance"
            value={isLoading ? '—' : fmtPKR(availableBalance)}
            hint="Ready to withdraw"
          />

          {/* Request form */}
          <Card className="p-6">
            <SectionHeader icon={Banknote} tone="accent" title="Request a Withdrawal" caption="Choose an amount and destination method." />
            <form onSubmit={handleWithdrawal} className="space-y-6">
              {/* Amount */}
              <div>
                <label className="gt-label" htmlFor="withdraw-amount">Amount to Withdraw</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[var(--gt-text-3)]">PKR</span>
                  <input
                    id="withdraw-amount"
                    type="number"
                    min="1"
                    step="0.01"
                    max={availableBalance}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="gt-input gt-num"
                    style={{ paddingLeft: '3.25rem' }}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-[var(--gt-text-3)]">
                    Available: <strong className="text-[var(--gt-text)]">{fmtPKR(availableBalance)}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setAmount(availableBalance.toString())}
                    className="font-semibold text-[var(--gt-accent)] transition-colors hover:text-[var(--gt-accent-2)]"
                  >
                    Withdraw Max
                  </button>
                </div>
              </div>

              {/* Methods */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="gt-label">Select Method</label>
                  <Link href="/trainer/profile" className="text-xs font-semibold text-[var(--gt-accent-2)] transition-colors hover:text-[var(--gt-text)]">
                    Manage Methods
                  </Link>
                </div>

                {isLoading ? (
                  <div className="space-y-3">
                    {[0, 1].map((i) => (
                      <Skeleton key={i} className="h-[68px] rounded-[16px]" />
                    ))}
                  </div>
                ) : methods.length === 0 ? (
                  <div className="rounded-[16px] border border-[var(--gt-danger)]/25 bg-[var(--gt-danger)]/10 p-5 text-center">
                    <p className="mb-3 text-sm text-[var(--gt-danger)]">You haven&apos;t added any withdrawal methods.</p>
                    <Link href="/trainer/profile" className="gt-btn gt-btn--ghost gt-btn--sm">
                      <PlusCircle className="h-4 w-4" /> Add a Method
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {methods.map((m) => {
                      const active = selectedMethodId === m.id;
                      return (
                        <label
                          key={m.id}
                          className={`flex cursor-pointer items-center gap-4 rounded-[16px] border p-4 transition-all ${
                            active
                              ? 'border-[var(--gt-accent)] bg-[var(--gt-accent-soft)]'
                              : 'border-[var(--gt-border)] bg-[var(--gt-surface)] hover:border-[var(--gt-border-2)]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="withdrawalMethod"
                            value={m.id}
                            checked={active}
                            onChange={() => setSelectedMethodId(m.id)}
                            className="sr-only"
                          />
                          <span
                            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold uppercase ${
                              active ? 'bg-[var(--gt-accent)] text-white' : 'bg-[var(--gt-surface-2)] text-[var(--gt-text-3)]'
                            }`}
                          >
                            {m.provider.substring(0, 2)}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold capitalize text-[var(--gt-text)]">{m.provider}</p>
                            <p className="truncate text-xs text-[var(--gt-text-3)]">{m.accountTitle} &bull; {m.accountNumber}</p>
                          </div>
                          <span
                            className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                              active ? 'border-[var(--gt-accent)]' : 'border-[var(--gt-border-2)]'
                            }`}
                          >
                            {active && <span className="h-2.5 w-2.5 rounded-full bg-[var(--gt-accent)]" />}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isLoading || methods.length === 0}
                className="gt-btn gt-btn--primary w-full"
              >
                {isSubmitting ? 'Processing…' : (<><Banknote className="h-4 w-4" /> Submit Request</>)}
              </button>
            </form>
          </Card>

          {/* Recent requests */}
          <Card className="p-6">
            <SectionHeader icon={Wallet} tone="info" title="Recent Requests" caption="Track the status of your payouts." />
            {isLoading ? (
              <Loading label="Loading requests…" />
            ) : requests.length === 0 ? (
              <EmptyState icon={Wallet} title="No withdrawal requests yet" detail="Your submitted payouts will appear here." />
            ) : (
              <div className="space-y-2.5">
                {requests.map((r) => (
                  <div key={r.id} className="gt-card flex items-center justify-between gap-4 p-3.5">
                    <div className="min-w-0 flex-1">
                      <p className="gt-num text-sm font-semibold text-[var(--gt-text)]">{fmtPKR(r.amount)}</p>
                      <p className="truncate text-xs text-[var(--gt-text-3)]">
                        {r.method ? <span className="capitalize">{r.method.provider} &bull; {r.method.accountTitle}</span> : 'Withdrawal'}
                        {r.createdAt ? ` • ${new Date(r.createdAt).toLocaleDateString()}` : ''}
                      </p>
                    </div>
                    <Badge tone={statusTone(r.status)} dot>{r.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right column — info */}
        <div className="space-y-6">
          <Card className="p-6">
            <SectionHeader icon={ShieldCheck} tone="info" title="Secure Withdrawals" />
            <p className="text-sm leading-relaxed text-[var(--gt-text-2)]">
              Your earnings are safe with GrapeTask. Withdrawal requests are processed within <strong className="text-[var(--gt-text)]">24-48 hours</strong> during business days.
            </p>
            <ul className="mt-5 space-y-3">
              {[
                'Minimum withdrawal amount is PKR 50.00',
                'Make sure your account details match your profile name perfectly.',
                'No hidden fees. You get exactly what you earned.',
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-3 text-sm text-[var(--gt-text-2)]">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--gt-accent)]" />
                  {tip}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
