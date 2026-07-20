'use client';

import React, { useEffect, useState } from 'react';
import { Bell, CheckSquare, MessageSquare, PlusCircle } from 'lucide-react';
import { trainerApi } from '@/lib/api';
import { PageHeader, Card, EmptyState, Loading } from '@/components/trainer/ui';

type Notification = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
};

function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diff = Date.now() - then;
  const sec = Math.round(diff / 1000);
  const min = Math.round(sec / 60);
  const hr = Math.round(min / 60);
  const day = Math.round(hr / 24);
  if (sec < 60) return 'Just now';
  if (min < 60) return `${min} minute${min === 1 ? '' : 's'} ago`;
  if (hr < 24) return `${hr} hour${hr === 1 ? '' : 's'} ago`;
  if (day < 7) return `${day} day${day === 1 ? '' : 's'} ago`;
  return new Date(iso).toLocaleDateString();
}

// Cycle icon styling per item to keep the existing visual variety.
const ICONS = [PlusCircle, CheckSquare, MessageSquare];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await trainerApi.notifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleMarkAll() {
    try {
      await trainerApi.markAllNotificationsRead();
      await load();
    } catch {
      // ignore
    }
  }

  async function handleMarkOne(id: string) {
    try {
      await trainerApi.markNotificationRead(id);
      await load();
    } catch {
      // ignore
    }
  }

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Trainer Studio"
        title="Notifications"
        subtitle="Stay updated with student activity."
        actions={
          notifications.length > 0 && unread > 0 ? (
            <button onClick={handleMarkAll} className="gt-btn gt-btn--ghost gt-btn--sm">
              Mark all as read
            </button>
          ) : undefined
        }
      />

      {loading ? (
        <Card className="p-2">
          <Loading label="Loading notifications…" />
        </Card>
      ) : notifications.length === 0 ? (
        <Card className="p-2">
          <EmptyState icon={Bell} title="No notifications yet" detail="You're all caught up." />
        </Card>
      ) : (
        <div className="gt-stagger space-y-2.5">
          {notifications.map((notif, index) => {
            const Icon = ICONS[index % ICONS.length];
            const unreadItem = !notif.read;
            return (
              <div
                key={notif.id}
                role={unreadItem ? 'button' : undefined}
                tabIndex={unreadItem ? 0 : undefined}
                aria-label={unreadItem ? `Mark "${notif.title}" as read` : undefined}
                onClick={() => unreadItem && handleMarkOne(notif.id)}
                onKeyDown={(e) => {
                  if (unreadItem && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    handleMarkOne(notif.id);
                  }
                }}
                className={`gt-card ${unreadItem ? 'gt-card--hover cursor-pointer' : ''} flex items-start gap-4 p-4`}
                style={unreadItem ? { background: 'var(--gt-accent-soft)', borderColor: 'rgba(240,89,31,0.24)' } : undefined}
              >
                <span
                  className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border ${
                    unreadItem
                      ? 'border-[var(--gt-accent)]/30 bg-[var(--gt-accent)]/15 text-[var(--gt-accent)]'
                      : 'border-[var(--gt-border-2)] bg-[var(--gt-surface-2)] text-[var(--gt-text-3)]'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--gt-text)]">
                    <span className="truncate">{notif.title}</span>
                    {unreadItem && <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[var(--gt-accent)]" />}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--gt-text-2)]">{notif.body}</p>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--gt-text-3)]">
                    {formatRelativeTime(notif.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
