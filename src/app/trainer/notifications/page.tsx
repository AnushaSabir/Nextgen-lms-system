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
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-black text-[#0f3d1a] mb-2">Notifications</h1>
          <p className="text-[#1a6b2e]">Stay updated with student activity.</p>
        </div>
        <button className="text-sm font-bold text-[#d94d19] hover:text-[#ea580c]">
          Mark all as read
        </button>
      </div>

      <div className="bg-[#0f172a]/80 backdrop-blur-md border border-[#1e293b] rounded-[32px] overflow-hidden shadow-2xl">
        {notifications.map((notif, index) => {
          const Icon = notif.icon;
          return (
            <div key={notif.id} className={`p-6 flex items-start gap-5 hover:bg-white/[0.02] transition-colors ${index !== notifications.length - 1 ? 'border-b border-[#1e293b]' : ''}`}>
              <div className={`p-4 rounded-2xl ${notif.bg} border border-[#1a6b2e]/10`}>
                <Icon className={`w-6 h-6 ${notif.color}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[#0f3d1a] text-lg">{notif.title}</h3>
                <p className="text-[#1a6b2e] mt-1">{notif.desc}</p>
                <p className="text-xs text-[#64748b] mt-3 font-medium uppercase tracking-wider">{notif.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
