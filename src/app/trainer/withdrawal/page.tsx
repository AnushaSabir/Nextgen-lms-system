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
    <div className="p-6 md:p-12 w-full h-full relative overflow-y-auto hide-scrollbar z-10 animate-in fade-in zoom-in-95 duration-1000">
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-12">
        <div>
          <Link href="/trainer/earnings" className="inline-flex items-center text-sm font-semibold text-sky-400 hover:text-orange-300 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Earnings
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0f3d1a] mb-2 tracking-tight">Withdraw Funds</h1>
          <p className="text-[#1a6b2e]">Transfer your available balance to your preferred account.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Col - Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white/[0.02] backdrop-blur-2xl border border-[#1a6b2e]/20 rounded-[40px] p-8 md:p-10 shadow-2xl transition-all duration-700 transform-style-3d hover:border-white/20">
            <form onSubmit={handleWithdrawal} className="space-y-8">
              
              {/* Amount Input */}
              <div>
                <label className="block text-sm font-bold text-[#1a6b2e] uppercase tracking-wider mb-4">Amount to Withdraw</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <span className="text-3xl font-black text-[#1a6b2e]">$</span>
                  </div>
                  <input 
                    type="number" 
                    min="1"
                    step="0.01"
                    max={availableBalance}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 bg-[#c8e6c9]/50 border-2 border-[#1a6b2e]/20 rounded-3xl text-4xl font-black text-[#0f3d1a] placeholder-gray-600 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 transition-all"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="flex justify-between mt-3 text-sm">
                  <span className="text-[#7dab52]">Available: <strong className="text-[#0f3d1a]">${availableBalance.toFixed(2)}</strong></span>
                  <button type="button" onClick={() => setAmount(availableBalance.toString())} className="text-sky-400 hover:text-orange-300 font-bold">
                    Withdraw Max
                  </button>
                </div>
              </div>

              {/* Methods */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-bold text-[#1a6b2e] uppercase tracking-wider">Select Method</label>
                  <Link href="/trainer/profile" className="text-xs font-bold text-blue-400 hover:text-blue-300">
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
                    {methods.map(m => (
                      <label 
                        key={m.id} 
                        className={`flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all ${selectedMethodId === m.id ? 'border-sky-500 bg-sky-500/10' : 'border-[#1a6b2e]/20 bg-[#c8e6c9]/50 hover:border-white/20'}`}
                      >
                        <input 
                          type="radio" 
                          name="withdrawalMethod" 
                          value={m.id} 
                          checked={selectedMethodId === m.id}
                          onChange={() => setSelectedMethodId(m.id)}
                          className="sr-only"
                        />
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm uppercase mr-4 ${selectedMethodId === m.id ? 'bg-sky-500 text-[#0f3d1a]' : 'bg-gray-800 text-[#1a6b2e]'}`}>
                          {m.provider.substring(0, 2)}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-[#0f3d1a] capitalize">{m.provider}</p>
                          <p className="text-sm text-[#1a6b2e]">{m.accountTitle} &bull; {m.accountNumber}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethodId === m.id ? 'border-sky-500' : 'border-gray-600'}`}>
                          {selectedMethodId === m.id && <div className="w-3 h-3 rounded-full bg-sky-500" />}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <button 
                type="submit" 
                disabled={isSubmitting || methods.length === 0}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-600 to-sky-500 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-[#0f3d1a] px-6 py-5 rounded-3xl font-black shadow-[0_10px_40px_-10px_rgba(240,89,31,0.5)] transition-all active:scale-95 text-lg"
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

        {/* Right Col - Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-b from-[#0f172a] to-[#020617] border border-[#1a6b2e]/20 rounded-[40px] p-8 shadow-2xl">
            <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#0f3d1a] mb-4">Secure Withdrawals</h3>
            <p className="text-[#1a6b2e] leading-relaxed mb-6">
              Your earnings are safe with NextGen-LMS. Withdrawal requests are processed within <strong>24-48 hours</strong> during business days. 
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-[#1a6b2e]">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2" />
                Minimum withdrawal amount is $50.00
              </li>
              <li className="flex items-start gap-3 text-sm text-[#1a6b2e]">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2" />
                Make sure your account details match your profile name perfectly.
              </li>
              <li className="flex items-start gap-3 text-sm text-[#1a6b2e]">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2" />
                No hidden fees. You get exactly what you earned.
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
