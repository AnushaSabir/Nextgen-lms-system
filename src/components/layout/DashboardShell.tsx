'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useAuthStore } from '@/store/auth-store';
import {
  Menu,
  X,
  LayoutDashboard,
  BookOpen,
  CheckCircle2,
  Trophy,
  Users,
  Settings,
  LogOut,
  Sparkles,
  Bell,
  GraduationCap,
  Calendar,
  FileText,
  Video,
  BarChart3,
  ShieldCheck,
  Building2,
  MessageSquare,
  DollarSign,
  Award,
  ScanLine
} from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navByArea: Record<string, NavItem[]> = {
  Admin: [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Video & Course Studio', href: '/admin/dashboard#studio', icon: Video },
    { label: 'Courses Catalog', href: '/admin/dashboard#courses', icon: BookOpen },
    { label: 'Schools & Colleges', href: '/admin/dashboard#institutes', icon: Building2 },
    { label: 'Users & Roles', href: '/admin/dashboard#users', icon: Users },
    { label: 'Financials', href: '/admin/dashboard#finance', icon: DollarSign },
    { label: 'Analytics', href: '/admin/dashboard#analytics', icon: BarChart3 },
    { label: 'QR Attendance', href: '/admin/dashboard#attendance', icon: ScanLine },
    { label: 'JARVIS AI Engine', href: '/admin/dashboard#jarvis', icon: Sparkles },
  ],
  Student: [
    { label: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
    { label: 'My Courses', href: '/student/dashboard#courses', icon: BookOpen },
    { label: 'Social Profile & Badges', href: '/student/dashboard#profile', icon: Award },
    { label: 'JARVIS AI Teacher', href: '/student/dashboard#jarvis', icon: Sparkles },
    { label: 'AI Exams & Testing', href: '/student/dashboard#testing', icon: CheckCircle2 },
    { label: 'Certificates', href: '/student/dashboard#certificates', icon: Trophy },
  ],
  Institute: [
    { label: 'Dashboard', href: '/institute/dashboard', icon: LayoutDashboard },
    { label: 'Students', href: '/institute/dashboard#students', icon: Users },
    { label: 'Batches & Groups', href: '/institute/dashboard#groups', icon: Building2 },
    { label: 'Reports', href: '/institute/dashboard#reports', icon: FileText },
    { label: 'Exams & Attendance', href: '/institute/dashboard#exams', icon: CheckCircle2 },
    { label: 'JARVIS School AI', href: '/institute/dashboard#jarvis', icon: Sparkles },
  ],
};

export function DashboardShell({ area, children }: { area: keyof typeof navByArea; children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState('');

  useEffect(() => {
    const updateHash = () => {
      setCurrentHash(typeof window !== 'undefined' ? window.location.hash : '');
    };
    updateHash();
    window.addEventListener('hashchange', updateHash);
    window.addEventListener('popstate', updateHash);
    return () => {
      window.removeEventListener('hashchange', updateHash);
      window.removeEventListener('popstate', updateHash);
    };
  }, []);

  const closeMobileNav = useCallback(() => {
    setMobileNavOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    router.replace('/login');
  }, [logout, router]);

  const items = navByArea[area] || [];

  const checkIsActive = (href: string) => {
    if (href.includes('#')) {
      const [path, hash] = href.split('#');
      return pathname === path && currentHash.toLowerCase() === `#${hash.toLowerCase()}`;
    }
    return pathname === href && (!currentHash || currentHash === '#dashboard' || currentHash === '#overview');
  };

  const handleNavClick = (href: string) => {
    closeMobileNav();
    if (href.includes('#')) {
      const [path, hash] = href.split('#');
      if (pathname === path) {
        window.location.hash = hash;
        setCurrentHash(`#${hash}`);
        window.dispatchEvent(new Event('hashchange'));
      }
    } else {
      if (pathname === href && currentHash) {
        if (window.history.pushState) {
          window.history.pushState(null, '', pathname);
          setCurrentHash('');
          window.dispatchEvent(new Event('hashchange'));
        } else {
          window.location.hash = '';
          setCurrentHash('');
        }
      }
    }
  };

  return (
    <div className="min-h-screen text-white flex flex-col font-sans" style={{ background: '#323232' }}>
      <div className="flex min-h-screen relative z-10">
        {/* Desktop Sidebar */}
        <aside
          className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 sticky top-0 h-screen justify-between z-30"
          style={{
            background: '#151515',
            borderRight: '1px solid rgba(255,255,255,0.07)',
            boxShadow: '4px 0 20px rgba(0,0,0,0.3)'
          }}
        >
          <div>
            <div className="p-4 lg:p-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <Link href="/" className="flex items-center gap-3 group w-full">
                <div className="relative h-12 w-48 flex items-center transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src="/logo.png"
                    alt="NEXTGEN Studio"
                    fill
                    sizes="200px"
                    priority
                    className="object-contain object-left filter drop-shadow-md"
                  />
                </div>
                <span
                  className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ml-auto shrink-0"
                  style={{
                    background: '#50BED9',
                    color: '#fff',
                    boxShadow: '0 0 10px rgba(14,165,233,0.4)'
                  }}
                >
                  {area}
                </span>
              </Link>
            </div>

            <div className="p-3 lg:p-4 space-y-1">
              <p className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Navigation</p>
              <nav className="space-y-1.5">
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = checkIsActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => handleNavClick(item.href)}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 group relative"
                      style={{
                        background: isActive ? '#353638' : 'transparent',
                        color: isActive ? '#ffffff' : '#D0D3D6',
                        border: isActive ? '1px solid rgba(56,189,248,0.25)' : '1px solid transparent',
                        boxShadow: 'none',
                      }}
                      onMouseEnter={e => {
                        if (!isActive) {
                          (e.currentTarget as HTMLElement).style.background = '#101010';
                          (e.currentTarget as HTMLElement).style.color = '#ffffff';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isActive) {
                          (e.currentTarget as HTMLElement).style.background = 'transparent';
                          (e.currentTarget as HTMLElement).style.color = '#D0D3D6';
                        }
                      }}
                    >
                      {isActive && (
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full"
                          style={{ height: '60%', background: '#50BED9', boxShadow: '0 0 8px rgba(56,189,248,0.7)' }}
                        />
                      )}
                      <div
                        className="p-1.5 rounded-lg transition-colors"
                        style={{
                          background: isActive ? 'rgba(56,189,248,0.12)' : 'transparent',
                          color: isActive ? '#50BED9' : '#D0D3D6'
                        }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{item.label}</span>
                      {isActive && (
                        <div
                          className="ml-auto w-1.5 h-1.5 rounded-full"
                          style={{ background: '#50BED9', boxShadow: '0 0 6px #50BED9' }}
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="p-4 space-y-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: '#181a1f' }}>
            <div className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: '#353638', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm"
                style={{
                  background: 'linear-gradient(135deg, #50BED9, #50BED9)',
                  boxShadow: '0 2px 10px rgba(14,165,233,0.3)'
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : area.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black text-white truncate">{user?.name || area}</p>
                <p className="text-[10px] font-semibold truncate text-slate-400">{user?.email || `${area.toLowerCase()}@nextgen.edu`}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold rounded-xl transition-all duration-200"
              style={{ color: '#fca5a5', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.2)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)';
              }}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeMobileNav} />
            <aside
              className="absolute left-0 top-0 bottom-0 w-72 shadow-2xl flex flex-col justify-between z-10 p-5"
              style={{ background: '#151515', borderRight: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div>
                <div className="flex items-center justify-between pb-4 mb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="relative h-11 w-44 flex items-center">
                    <Image src="/logo.png" alt="NEXTGEN Studio" fill sizes="180px" className="object-contain object-left filter drop-shadow-md" />
                  </div>
                  <button onClick={closeMobileNav} className="p-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.08)', color: '#ffffff' }}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-1.5">
                  {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = checkIsActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => handleNavClick(item.href)}
                        className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-all"
                        style={{
                          background: isActive ? '#50BED9' : '#353638',
                          color: isActive ? '#ffffff' : '#D0D3D6',
                          border: isActive ? '1px solid #50BED9' : '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        <Icon className="w-4 h-4" style={{ color: isActive ? '#ffffff' : '#D0D3D6' }} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl"
                style={{ color: '#fca5a5', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </aside>
          </div>
        )}

        {/* Main Content Area */}
        <main className="min-w-0 flex-1 flex flex-col" style={{ background: '#323232' }}>
          <header
            className="sticky top-0 z-20 px-4 lg:px-8 py-3.5 flex items-center justify-between"
            style={{
              background: '#151515',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileNavOpen(true)}
                className="md:hidden p-2 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff' }}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full animate-pulse"
                  style={{ background: '#50BED9', boxShadow: '0 0 8px #50BED9' }}
                />
                <h1 className="text-base md:text-lg font-black tracking-tight text-white">{area} Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
                style={{
                  color: '#ffffff',
                  background: '#353638',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#50BED9]" />
                <span>Home</span>
              </Link>
              <div className="flex items-center gap-2 pl-2" style={{ borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-xs"
                  style={{
                    background: 'linear-gradient(135deg, #50BED9, #50BED9)',
                    boxShadow: '0 2px 10px rgba(14,165,233,0.3)'
                  }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : area.charAt(0)}
                </div>
                <span className="text-xs font-extrabold hidden md:inline truncate max-w-[120px] text-white">
                  {user?.name || area}
                </span>
              </div>
            </div>
          </header>
          <div className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
