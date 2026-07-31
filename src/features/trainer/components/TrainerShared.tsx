'use client';

import { CheckCircle2 } from 'lucide-react';

export function PageHeader({ title, caption }: { title: string; caption: string }) {
  return (
    <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
          <p className="text-xs font-semibold uppercase tracking-widest text-sky-400">Trainer Workspace</p>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[#0f3d1a] sm:text-4xl">{title}</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-[#1a6b2e]">{caption}</p>
      </div>
    </div>
  );
}

export function InfoList({ items }: { items: string[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-1">
      {items.map((item) => (
        <div key={item} className="group flex items-start gap-3 rounded-xl border border-gray-700/50 bg-gray-800/40 p-3.5 transition-all duration-300 hover:border-sky-500/30 hover:bg-gray-800/80">
          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-sky-400 transition-transform group-hover:scale-110" />
          <span className="text-sm text-[#1a6b2e] leading-snug">{item}</span>
        </div>
      ))}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles =
    status === 'approved'
      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
      : status === 'pending_review'
        ? 'border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.1)]'
        : 'border-gray-600/50 bg-gray-800/50 text-[#1a6b2e]';

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${styles}`}>
      {status.replace('_', ' ')}
    </span>
  );
}
