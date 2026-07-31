'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { dashboardForRole, roleForPath } from '@/lib/routes';
import { useAuthStore } from '@/store/auth-store';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, user, hydrate } = useAuthStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    hydrate();
    setReady(true);
  }, [hydrate]);

  useEffect(() => {
    if (!ready) return;
    const storedToken = token ?? window.localStorage.getItem('nextgen-lms_lms_token');
    let rawUser = user;

    if (!rawUser) {
      try {
        rawUser = JSON.parse(window.localStorage.getItem('nextgen-lms_lms_user') ?? 'null');
      } catch {
        window.localStorage.removeItem('nextgen-lms_lms_token');
        window.localStorage.removeItem('nextgen-lms_lms_user');
        rawUser = null;
      }
    }

    if (!storedToken || !rawUser) {
      // Auto-login for prototyping when direct linking
      window.localStorage.setItem('nextgen-lms_lms_token', 'dummy-token');
      window.localStorage.setItem('nextgen-lms_lms_user', JSON.stringify({ role: 'trainer', name: 'Test User' }));
      window.location.reload();
      return;
    }
    const requiredRole = roleForPath(pathname);
    if (requiredRole && rawUser.role !== requiredRole) {
      router.replace(dashboardForRole(rawUser.role));
    }
  }, [pathname, ready, router, token, user]);

  if (!ready) return <div className="min-h-screen bg-mainBg" />;
  return <>{children}</>;
}
