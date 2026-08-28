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
    const storedToken = token ?? (typeof window !== 'undefined' ? window.localStorage.getItem('nextgen-lms_lms_token') : null);
    let rawUser = user;

    if (!rawUser && typeof window !== 'undefined') {
      try {
        rawUser = JSON.parse(window.localStorage.getItem('nextgen-lms_lms_user') ?? 'null');
      } catch {
        rawUser = null;
      }
    }

    const requiredRole = roleForPath(pathname);

    // Auto-create role matching current route if no session exists (for direct linking & demo)
    if (!storedToken || !rawUser) {
      const defaultRole = requiredRole || (pathname.startsWith('/admin') ? 'admin' : pathname.startsWith('/institute') ? 'institute_head' : 'learner');
      const defaultName = defaultRole === 'admin' ? 'Master Admin' : defaultRole === 'institute_head' ? 'Beaconhouse Admin' : 'Ali Hassan';
      const mockUser = { id: 'demo-user', role: defaultRole, name: defaultName, email: `${defaultRole}@nextgen.lms` };
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('nextgen-lms_lms_token', 'demo-token');
        window.localStorage.setItem('nextgen-lms_lms_user', JSON.stringify(mockUser));
      }
      return;
    }

    // If navigating directly to a specific role dashboard, auto-switch role in localStorage so user isn't kicked out
    if (requiredRole && rawUser.role !== requiredRole) {
      const updatedUser = { ...rawUser, role: requiredRole };
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('nextgen-lms_lms_user', JSON.stringify(updatedUser));
      }
    }
  }, [pathname, ready, router, token, user]);

  if (!ready) return <div className="min-h-screen bg-[#c8e6c9]" />;
  return <>{children}</>;
}
