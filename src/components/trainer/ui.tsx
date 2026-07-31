'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';

/* ── Count-up hook (respects reduced motion) ─────────────────────────────── */
export function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  const raf = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }
    const start = performance.now();
    const from = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [target, duration]);
  return value;
}

/* ── Page header ─────────────────────────────────────────────────────────── */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="gt-rise flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <span className="gt-eyebrow mb-3">{eyebrow}</span>}
        <h1 className="gt-title mt-2">{title}</h1>
        {subtitle && <p className="gt-subtitle mt-2 max-w-2xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-shrink-0 items-center gap-2.5">{actions}</div>}
    </div>
  );
}

/* ── Card / Panel ────────────────────────────────────────────────────────── */
export function Card({
  children,
  className = '',
  hover = false,
  as: Tag = 'div',
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  as?: React.ElementType;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag className={`gt-card ${hover ? 'gt-card--hover' : ''} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

/* ── Stat card ───────────────────────────────────────────────────────────── */
type Tone = 'accent' | 'success' | 'warn' | 'danger' | 'info';
const toneColor: Record<Tone, string> = {
  accent: '#f0591f',
  success: '#34d399',
  warn: '#fbbf24',
  danger: '#fb7185',
  info: '#38bdf8',
};

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = 'accent',
  countUp = true,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  hint?: React.ReactNode;
  tone?: Tone;
  countUp?: boolean;
}) {
  const numeric = typeof value === 'number';
  const animated = useCountUp(numeric ? (value as number) : 0);
  const shown = numeric ? (countUp ? animated : value) : value;
  const c = toneColor[tone];
  return (
    <Card hover className="group overflow-hidden p-5">
      <div className="flex items-start justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--gt-text-3)]">{label}</p>
        <span
          className="flex h-9 w-9 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
          style={{ background: `${c}1f`, border: `1px solid ${c}3a`, color: c }}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="gt-num mt-4 text-[2rem] font-extrabold leading-none text-[var(--gt-text)]">{shown}</p>
      {hint && <p className="mt-2 text-xs text-[var(--gt-text-2)]">{hint}</p>}
      <span
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-40 blur-2xl transition-opacity duration-500 group-hover:opacity-70"
        style={{ background: `radial-gradient(circle, ${c}40, transparent 70%)` }}
      />
    </Card>
  );
}

/* ── Section header (inside cards) ───────────────────────────────────────── */
export function SectionHeader({
  icon: Icon,
  title,
  caption,
  actions,
  tone = 'accent',
}: {
  icon?: LucideIcon;
  title: string;
  caption?: string;
  actions?: React.ReactNode;
  tone?: Tone;
}) {
  const c = toneColor[tone];
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        {Icon && (
          <span
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
            style={{ background: `${c}1f`, border: `1px solid ${c}3a`, color: c }}
          >
            <Icon className="h-[18px] w-[18px]" />
          </span>
        )}
        <div>
          <h2 className="text-[15px] font-bold tracking-tight text-[var(--gt-text)]">{title}</h2>
          {caption && <p className="mt-0.5 text-[13px] text-[var(--gt-text-2)]">{caption}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

/* ── Badge ───────────────────────────────────────────────────────────────── */
export function Badge({
  children,
  tone,
  dot = false,
}: {
  children: React.ReactNode;
  tone?: Tone;
  dot?: boolean;
}) {
  return (
    <span className={`gt-badge ${tone ? `gt-badge--${tone}` : ''}`}>
      {dot && <span className="dot" />}
      {children}
    </span>
  );
}

/* ── Empty state ─────────────────────────────────────────────────────────── */
export function EmptyState({
  icon: Icon,
  title,
  detail,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  detail?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      {Icon && (
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--gt-border-2)] bg-[var(--gt-surface-2)] text-[var(--gt-text-3)]">
          <Icon className="h-5 w-5" />
        </span>
      )}
      <p className="text-[15px] font-semibold text-[var(--gt-text)]">{title}</p>
      {detail && <p className="max-w-sm text-sm text-[var(--gt-text-2)]">{detail}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

/* ── Skeleton ────────────────────────────────────────────────────────────── */
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`gt-skeleton ${className}`} />;
}

export function Loading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 px-6 py-14 text-sm text-[var(--gt-text-2)]">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--gt-border-2)] border-t-[var(--gt-accent)]" />
      {label}
    </div>
  );
}

/* ── Buttons (class helpers for non-kit call sites) ──────────────────────── */
export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: {
  variant?: 'primary' | 'ghost';
  size?: 'sm' | 'md';
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`gt-btn gt-btn--${variant} ${size === 'sm' ? 'gt-btn--sm' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
