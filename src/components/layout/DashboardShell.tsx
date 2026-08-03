'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth-store';
import { Menu, X } from 'lucide-react';
import { useState, useCallback } from 'react';

interface NavItem {
  label: string;
  href: string;
}

const navByArea: Record<string, NavItem[]> = {
  Admin: [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Courses', href: '/admin/dashboard#courses' },
    { label: 'Users', href: '/admin/dashboard#users' },
    { label: 'Analytics', href: '/admin/dashboard#analytics' },
  ],
  Trainer: [
    { label: 'Dashboard', href: '/trainer/dashboard' },
    { label: 'Profile', href: '/trainer/profile' },
    { label: 'My Courses', href: '/trainer/courses' },
    { label: 'Create Course', href: '/trainer/create-course' },
    { label: 'Submissions', href: '/trainer/submissions' },
    { label: 'Meetings', href: '/trainer/meetings' },
  ],
  Student: [
    { label: 'Dashboard', href: '/student/dashboard' },
    { label: 'Courses', href: '/student/dashboard#courses' },
    { label: 'Testing', href: '/student/dashboard#testing' },
    { label: 'Certificates', href: '/student/dashboard#certificates' },
  ],
  Institute: [
    { label: 'Dashboard', href: '/institute/dashboard' },
    { label: 'Students', href: '/institute/dashboard#students' },
    { label: 'Groups', href: '/institute/dashboard#groups' },
    { label: 'Reports', href: '/institute/dashboard#reports' },
  ],
};

export function DashboardShell({ area, children }: { area: keyof typeof navByArea; children: ReactNode }) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const closeMobileNav = useCallback(() => {
    setMobileNavOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    router.replace('/login');
  }, [logout, router]);

  return (
    <div className="min-h-screen bg-mainBg text-[#0f3d1a]">
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 lg:w-72 border-r border-lightBorder bg-cardBg md:block shrink-0">
          <div className="border-b border-lightBorder p-4 lg:p-6">
            <p className="text-base lg:text-lg font-semibold text-[#0f3d1a]">NextGen-LMS LMS</p>
            <p className="mt-1 text-xs lg:text-sm text-[#1a6b2e]">{area} Portal</p>
          </div>
          <nav className="space-y-1 p-3 lg:p-4">
            {navByArea[area].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg border border-lightBorder bg-cardBg px-3 lg:px-4 py-2.5 lg:py-3 text-sm text-mediumGrayTitle hover:border-orangeBorderActive hover:bg-cardBgActive hover:text-[#d94d19] active:scale-[0.98] active:bg-cardBgActive transition-all duration-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              style={{ animation: 'fadeIn 0.15s ease-out' }}
              onClick={closeMobileNav}
            />
            <aside 
              className="absolute left-0 top-0 bottom-0 w-72 bg-cardBg border-r border-lightBorder shadow-2xl"
              style={{ animation: 'slideInLeft 0.2s ease-out' }}
            >
              <div className="border-b border-lightBorder p-4 flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-[#0f3d1a]">NextGen-LMS LMS</p>
                  <p className="text-xs text-[#1a6b2e]">{area} Portal</p>
                </div>
                <button 
                  onClick={closeMobileNav}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-100"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-[#0f3d1a]" />
                </button>
              </div>
              <nav className="space-y-1 p-3">
                {navByArea[area].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileNav}
                    className="block rounded-lg border border-lightBorder bg-cardBg px-3 py-2.5 text-sm text-mediumGrayTitle hover:border-orangeBorderActive hover:bg-cardBgActive hover:text-[#d94d19] active:scale-[0.98] active:bg-cardBgActive transition-all duration-100"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </aside>
          </div>
        )}

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-10 border-b border-lightBorder bg-cardBg">
            <div className="flex min-h-14 md:min-h-16 flex-wrap items-center justify-between gap-2 md:gap-3 px-3 md:px-6 py-2 md:py-3">
              <div className="flex items-center gap-3">
                {/* Mobile Menu Button */}
                <button 
                  onClick={() => setMobileNavOpen(true)}
                  className="md:hidden p-2 -ml-1 hover:bg-white/10 active:bg-white/15 rounded-lg transition-colors duration-100"
                  aria-label="Open menu"
                >
                  <Menu className="w-5 h-5 text-[#0f3d1a]" />
                </button>
                <div className="flex items-center gap-3">
                  {user?.avatar && (
                    <img 
                      src={`http://localhost:8000${user.avatar}`} 
                      alt="Avatar" 
                      className="w-10 h-10 rounded-full object-cover border-2 border-sky-500/50"
                    />
                  )}
                  <div>
                    <p className="text-xs md:text-sm text-[#1a6b2e] truncate max-w-[150px] md:max-w-none">{user?.name || user?.email}</p>
                    <h1 className="text-lg md:text-xl font-semibold text-[#0f3d1a]">{area} Dashboard</h1>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </header>
          <div className="p-3 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
