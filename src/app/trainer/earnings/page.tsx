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
    <div className="p-6 md:p-12 w-full h-full relative overflow-y-auto hide-scrollbar z-10 animate-in fade-in zoom-in-95 duration-1000">
      
      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0f3d1a] mb-2 tracking-tight">Earnings & Revenue</h1>
          <p className="text-sm sm:text-base text-[#1a6b2e]">Track your financial progress and withdraw funds.</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#0f172a] border border-[#1e293b] hover:bg-[#1e293b] text-[#0f3d1a] px-5 py-3 rounded-2xl transition-colors font-bold text-sm" onClick={() => alert('Exporting report as CSV...')}>
            <Download className="w-4 h-4" /> Export Report
          </button>
          <Link href="/trainer/withdrawal" className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-[#5E6F58] to-sky-500 hover:opacity-90 text-[#0f3d1a] px-6 py-3 rounded-2xl font-bold shadow-[0_0_20px_rgba(240,89,31,0.3)] transition-all active:scale-95 text-sm">
            <CreditCard className="w-4 h-4" /> Withdraw Funds
          </Link>
        </div>
      </div>

      {/* Hero Stats Card - Massive Typography (Pinterest Inspiration) */}
      <div className="w-full rounded-[40px] md:rounded-[60px] bg-[#ffffff]/[0.02] backdrop-blur-3xl border border-[#1a6b2e]/20 p-8 md:p-16 mb-12 relative overflow-hidden shadow-[0_30px_100px_rgba(26, 107, 46, 0.1)] group transform-style-3d hover:-translate-y-2 hover:border-white/20 transition-all duration-700">
        {/* Inner Glows */}
        <div className="absolute top-[-50%] left-[-20%] w-[70%] h-[200%] bg-gradient-to-br from-purple-600/20 to-transparent blur-[100px] pointer-events-none group-hover:opacity-100 opacity-50 transition-opacity duration-1000" />
        <div className="absolute bottom-[-50%] right-[-20%] w-[70%] h-[200%] bg-gradient-to-tl from-[#5E6F58]/20 to-transparent blur-[100px] pointer-events-none group-hover:opacity-100 opacity-50 transition-opacity duration-1000" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#1a6b2e]/5 border border-[#1a6b2e]/20 mb-8 backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[#1a6b2e] font-bold text-sm tracking-widest uppercase">Available Balance</span>
            </div>
            
            <div className="flex items-start gap-2 sm:gap-4 mb-8">
              <span className="text-xl sm:text-3xl md:text-5xl font-black text-[#0f3d1a]/50 mt-1 sm:mt-2">$</span>
              <h1 className="text-4xl sm:text-6xl md:text-[80px] leading-none font-black text-[#0f3d1a] tracking-tighter drop-shadow-2xl">
                4,250<span className="text-xl sm:text-3xl md:text-5xl text-[#0f3d1a]/30">.00</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-4 py-2 rounded-2xl border border-green-400/20">
                <TrendingUp className="w-5 h-5" />
                <span className="font-bold text-sm">+24.5% this month</span>
              </div>
              <p className="text-[#64748b] text-sm font-medium">vs last month ($3,410.00)</p>
            </div>
          </div>
          
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-[#c8e6c9]/40 backdrop-blur-xl border border-[#1a6b2e]/20 rounded-[32px] p-8 shadow-inner transform-style-3d hover:scale-[1.02] transition-transform duration-500">
              <div className="flex justify-between items-center mb-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
                  <Star className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-purple-400 font-bold text-sm bg-purple-500/10 px-3 py-1 rounded-full">All Time</span>
              </div>
              <p className="text-[#1a6b2e] text-sm font-bold uppercase tracking-widest mb-1">Total Earned</p>
              <h3 className="text-2xl sm:text-4xl font-black text-[#0f3d1a]">$12,450.50</h3>
            </div>

            <div className="bg-[#c8e6c9]/40 backdrop-blur-xl border border-[#1a6b2e]/20 rounded-[32px] p-8 shadow-inner transform-style-3d hover:scale-[1.02] transition-transform duration-500">
              <div className="flex justify-between items-center mb-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/20 flex items-center justify-center border border-sky-500/30">
                  <Clock className="w-6 h-6 text-sky-400" />
                </div>
                <span className="text-sky-400 font-bold text-sm bg-sky-500/10 px-3 py-1 rounded-full">Clears soon</span>
              </div>
              <p className="text-[#1a6b2e] text-sm font-bold uppercase tracking-widest mb-1">Pending Clearance</p>
              <h3 className="text-2xl sm:text-4xl font-black text-[#0f3d1a]">$320.00</h3>
            </div>
          </div>
          
        </div>
      </div>

      {/* Analytics & Transactions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        
        {/* Top Courses */}
        <div className="bg-white/[0.02] backdrop-blur-2xl border border-[#1a6b2e]/20 rounded-[40px] p-8 md:p-10 shadow-2xl transition-all duration-700 transform-style-3d hover:-translate-y-2 hover:border-white/20">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black text-[#0f3d1a] flex items-center gap-3">
              <Activity className="text-[#d94d19] w-8 h-8" /> Revenue by Course
            </h3>
          </div>
          
          <div className="space-y-4">
            {[
              { name: 'Advanced Web Dev', sales: 24, rev: 340.50, color: 'from-[#5E6F58] to-sky-400' },
              { name: 'UI/UX Masterclass', sales: 18, rev: 250.00, color: 'from-purple-500 to-indigo-500' },
              { name: 'Python Basics', sales: 12, rev: 120.00, color: 'from-blue-500 to-cyan-500' }
            ].map((course, i) => (
              <div key={i} className="group flex items-center justify-between p-5 bg-[#c8e6c9]/50 rounded-[24px] border border-[#1a6b2e]/10 hover:border-white/20 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <BookOpen className="w-5 h-5 text-[#0f3d1a]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0f3d1a] text-lg">{course.name}</h4>
                    <p className="text-sm text-[#64748b]">{course.sales} new sales</p>
                  </div>
                  <p className="gt-num flex-shrink-0 text-sm font-bold text-[var(--gt-success)]">
                    +PKR {course.earned.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <h4 className="font-black text-[#0f3d1a] text-xl">+${course.rev.toFixed(2)}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white/[0.02] backdrop-blur-2xl border border-[#1a6b2e]/20 rounded-[40px] p-8 md:p-10 shadow-2xl transition-all duration-700 transform-style-3d hover:-translate-y-2 hover:border-white/20">
          <h3 className="text-2xl font-black text-[#0f3d1a] mb-8 flex items-center gap-3">
            <CreditCard className="text-purple-400 w-8 h-8" /> Recent Transactions
          </h3>
          
          <div className="space-y-4">
            <div className="group flex items-center justify-between p-5 bg-[#c8e6c9]/50 rounded-[24px] border border-[#1a6b2e]/10 hover:border-white/20 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/20 group-hover:scale-110 transition-transform">
                  <ArrowDownRight className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#0f3d1a]">Withdrawal to Bank</h4>
                  <p className="text-sm text-[#64748b]">Today, 10:00 AM</p>
                </div>
              </div>
              <h4 className="font-black text-[#0f3d1a] text-xl">-$1,000.00</h4>
            </div>

            <div className="group flex items-center justify-between p-5 bg-[#c8e6c9]/50 rounded-[24px] border border-[#1a6b2e]/10 hover:border-white/20 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400 border border-green-500/20 group-hover:scale-110 transition-transform">
                  <ArrowUpRight className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#0f3d1a]">Student: Ali Ahmed</h4>
                  <p className="text-sm text-[#64748b]">Advanced Web Dev &bull; Watched 100% &bull; Yesterday</p>
                </div>
              </div>
              <div className="text-right">
                <h4 className="font-black text-green-400 text-xl">+$35.00</h4>
                <p className="text-xs text-green-500/60 font-bold">Full Revenue</p>
              </div>
            </div>
            
            <div className="group flex items-center justify-between p-5 bg-[#c8e6c9]/50 rounded-[24px] border border-[#1a6b2e]/10 hover:border-white/20 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400 border border-green-500/20 group-hover:scale-110 transition-transform">
                  <ArrowUpRight className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#0f3d1a]">Student: Sara Khan</h4>
                  <p className="text-sm text-[#64748b]">UI/UX Masterclass &bull; Watched 50% &bull; Oct 12</p>
                </div>
              </div>
              <div className="text-right">
                <h4 className="font-black text-green-400 text-xl">+$17.50</h4>
                <p className="text-xs text-green-500/60 font-bold">Partial Revenue</p>
              </div>
            </div>
            
            <div className="group flex items-center justify-between p-5 bg-[#c8e6c9]/50 rounded-[24px] border border-[#1a6b2e]/10 hover:border-white/20 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400 border border-green-500/20 group-hover:scale-110 transition-transform">
                  <ArrowUpRight className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#0f3d1a]">Student: Usman Tariq</h4>
                  <p className="text-sm text-[#64748b]">Python Basics &bull; Watched 25% &bull; Oct 10</p>
                </div>
              </div>
              <div className="text-right">
                <h4 className="font-black text-green-400 text-xl">+$8.75</h4>
                <p className="text-xs text-green-500/60 font-bold">Partial Revenue</p>
              </div>
            </div>
          </div>
        </div>

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
