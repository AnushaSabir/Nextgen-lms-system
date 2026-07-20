'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { submissionsApi, trainerApi } from '@/lib/api';
import {
  BookOpen,
  RotateCcw,
  CheckSquare,
  MessageSquare,
  Video,
  FileBarChart,
  Building2,
  DollarSign,
  History,
  Bell,
  ShieldCheck,
  Layers,
  LayoutDashboard,
  Menu,
  X,
  User,
  Plus,
  Wallet,
  ClipboardList,
  Search,
  ChevronRight,
  LogOut,
  BadgeCheck,
} from 'lucide-react';

type NavItem = { name: string; href: string; icon: typeof BookOpen; badge?: 'pending' };
type NavGroup = { label: string; items: NavItem[] };

const NAV: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', href: '/trainer/dashboard', icon: LayoutDashboard },
      { name: 'Profile', href: '/trainer/profile', icon: User },
    ],
  },
  {
    label: 'Content',
    items: [
      { name: 'My Courses', href: '/trainer/courses', icon: BookOpen },
      { name: 'Create Course', href: '/trainer/create-course', icon: Plus },
      { name: 'Retry Sets', href: '/trainer/assessments/retry', icon: RotateCcw },
    ],
  },
  {
    label: 'Students',
    items: [
      { name: 'Submissions', href: '/trainer/submissions', icon: CheckSquare, badge: 'pending' },
      { name: 'Assignments', href: '/trainer/assignments', icon: ClipboardList },
      { name: 'Chat', href: '/trainer/chat', icon: MessageSquare },
      { name: 'Live Q&A', href: '/trainer/meetings', icon: Video },
      { name: 'Analytics', href: '/trainer/analytics', icon: FileBarChart },
      { name: 'Student Reports', href: '/trainer/reports/students', icon: FileBarChart },
      { name: 'Institution', href: '/trainer/reports/institution', icon: Building2 },
    ],
  },
  {
    label: 'Business',
    items: [
      { name: 'Earnings', href: '/trainer/earnings', icon: DollarSign },
      { name: 'Revenue', href: '/trainer/earnings/history', icon: History },
      { name: 'Withdrawals', href: '/trainer/withdrawal', icon: Wallet },
      { name: 'Notifications', href: '/trainer/notifications', icon: Bell },
    ],
  },
  {
    label: 'Admin',
    items: [
      { name: 'Trainer Approvals', href: '/trainer/admin/trainers', icon: ShieldCheck },
      { name: 'Course Approvals', href: '/trainer/admin/courses', icon: Layers },
    ],
  },
];

export default function TrainerDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  useEffect(() => {
    submissionsApi
      .trainerList()
      .then((subs: any[]) => setPendingCount(subs.filter((s) => !s.reviewed).length))
      .catch(() => {});
    trainerApi
      .notifications()
      .then((n) => setUnreadNotifs(n.filter((x) => !x.read).length))
      .catch(() => {});
  }, []);

  // Longest-match active route (so /trainer/earnings/history highlights only "Revenue", not "Earnings").
  const activeHref = NAV.flatMap((g) => g.items)
    .map((i) => i.href)
    .filter((href) => pathname === href || pathname.startsWith(href + '/'))
    .sort((a, b) => b.length - a.length)[0];
  const isActive = (href: string) => href === activeHref;

  // Breadcrumb: drop UUID-ish segments so course/video IDs don't spill into the header.
  const isId = (s: string) => /^[0-9a-f]{8}-[0-9a-f-]{10,}$/i.test(s) || /^\d+$/.test(s);
  const crumbs = pathname
    .split('/')
    .filter(Boolean)
    .filter((p) => !isId(p))
    .map((p) => p.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()));

  const Sidebar = (
    <aside className="gt-scroll flex h-full w-[264px] flex-col overflow-hidden rounded-[26px] border border-[var(--gt-border)] bg-[var(--gt-panel)]/80 backdrop-blur-2xl">
      <div className="flex items-center justify-between px-6 pb-3 pt-6">
        <div>
          <h2 className="text-[22px] font-black tracking-tight text-white">
            Grape<span className="text-[var(--gt-accent)]">Task</span>
          </h2>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--gt-text-3)]">
            Trainer Studio
          </p>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="rounded-xl bg-white/5 p-2 text-white md:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="gt-scroll flex-1 space-y-5 overflow-y-auto px-4 py-3">
        {NAV.map((group) => (
          <div key={group.label} className="space-y-1">
            <p className="gt-nav-group mb-2">{group.label}</p>
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  data-active={active}
                  className="gt-nav-item"
                >
                  <Icon className={`h-[18px] w-[18px] ${active ? 'text-[var(--gt-accent)]' : ''}`} />
                  <span className="flex-1">{item.name}</span>
                  {item.badge === 'pending' && pendingCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-md bg-[var(--gt-accent)] px-1.5 text-[10px] font-bold text-white">
                      {pendingCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-[var(--gt-border)] p-4">
        <div className="flex items-center gap-3 rounded-2xl border border-[var(--gt-border)] bg-[var(--gt-surface)] p-3">
          <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--gt-accent)] to-[#ff8a4c]">
            {user?.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <span className="text-sm font-black text-white">{user?.name?.[0]?.toUpperCase() || 'T'}</span>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[var(--gt-panel)] bg-[var(--gt-success)]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">{user?.name || 'Trainer'}</p>
            <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--gt-accent)]">
              {user?.verifiedBadge && <BadgeCheck className="h-3 w-3" />}
              {user?.verifiedBadge ? 'Verified' : 'Trainer'}
            </p>
          </div>
          <button
            onClick={() => {
              logout();
              router.replace('/login');
            }}
            className="rounded-lg p-2 text-[var(--gt-text-3)] transition-colors hover:bg-[var(--gt-danger)]/10 hover:text-[var(--gt-danger)]"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="relative flex h-screen gap-5 overflow-hidden bg-[var(--gt-bg)] p-4 text-white">
      <div className="gt-aurora" />

      {/* Desktop sidebar */}
      <div className="relative z-20 hidden md:block">{Sidebar}</div>

      {/* Mobile drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute inset-y-4 left-4 z-50">{Sidebar}</div>
        </div>
      )}

      {/* Main */}
      <main className="relative z-10 flex h-full flex-1 flex-col overflow-hidden rounded-[26px] border border-[var(--gt-border)] bg-[var(--gt-bg-soft)]/70">
        <header className="flex h-16 flex-shrink-0 items-center justify-between gap-3 border-b border-[var(--gt-border)] bg-[var(--gt-bg-soft)]/80 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="rounded-xl p-2 text-[var(--gt-text-2)] hover:bg-white/5 md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <nav className="flex min-w-0 max-w-[38vw] items-center gap-1.5 overflow-hidden text-xs" suppressHydrationWarning>
              {crumbs.map((c, i) => (
                <React.Fragment key={`${c}-${i}`}>
                  {i > 0 && <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-[var(--gt-text-3)]" />}
                  <span
                    className={`truncate ${
                      i === crumbs.length - 1
                        ? 'font-semibold text-[var(--gt-text)]'
                        : 'hidden text-[var(--gt-text-3)] sm:inline'
                    }`}
                  >
                    {c}
                  </span>
                </React.Fragment>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="hidden items-center gap-2 rounded-xl border border-[var(--gt-border)] bg-[var(--gt-surface)] px-3 py-2 lg:flex">
              <Search className="h-4 w-4 text-[var(--gt-text-3)]" />
              <input
                placeholder="Search…"
                className="w-28 bg-transparent text-sm text-[var(--gt-text-2)] outline-none transition-all focus:w-44"
              />
            </div>
            <button
              onClick={() => router.push('/trainer/notifications')}
              className="relative rounded-xl border border-[var(--gt-border)] bg-[var(--gt-surface)] p-2.5 text-[var(--gt-text-2)] transition-colors hover:text-[var(--gt-text)]"
              aria-label="Notifications"
            >
              <Bell className="h-[18px] w-[18px]" />
              {unreadNotifs > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--gt-accent)] ring-2 ring-[var(--gt-bg-soft)]" />
              )}
            </button>
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[var(--gt-accent)] to-[#ff8a4c] text-sm font-black text-white">
              {user?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatar} alt="" className="h-full w-full object-cover" />
              ) : (
                user?.name?.[0]?.toUpperCase() || 'T'
              )}
            </div>
          </div>
        </header>

        <div key={pathname} className="gt-page gt-scroll mx-auto w-full max-w-[1400px] flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
