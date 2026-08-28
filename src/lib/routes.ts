import type { Role } from '@/types/domain';

export function dashboardForRole(role?: Role | string | null) {
  const normalizedRole = role?.toLowerCase();

  if (normalizedRole === 'admin' || normalizedRole === 'superadmin') return '/admin/dashboard';
  if (normalizedRole === 'institute_head' || normalizedRole === 'institute' || normalizedRole === 'school') return '/institute/dashboard';
  return '/student/dashboard';
}

export function roleForPath(pathname: string): Role | null {
  if (pathname.startsWith('/admin')) return 'admin';
  if (pathname.startsWith('/institute')) return 'institute_head';
  if (pathname.startsWith('/student')) return 'learner';
  return null;
}
