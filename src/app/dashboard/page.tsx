'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { dashboardForRole } from '@/lib/routes';
import { useAuthStore } from '@/store/auth-store';

export default function DashboardRedirectPage() {
  const router = useRouter();
  const { hydrate, user } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    let rawUser = user;
    const token = window.localStorage.getItem('nextgen-lms_lms_token');

    if (!rawUser) {
      try {
        rawUser = JSON.parse(window.localStorage.getItem('nextgen-lms_lms_user') ?? 'null');
      } catch {
        rawUser = null;
      }
    }

    if (!token || !rawUser) {
      router.replace('/login');
      return;
    }

    router.replace(dashboardForRole(rawUser.role));
  }, [router, user]);

  return <div className="min-h-screen bg-mainBg" />;
}
