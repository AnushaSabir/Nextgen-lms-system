'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { submissionsApi } from '@/lib/api';
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
  FileText,
  ListChecks,
  Clock,
  Search,
  ChevronRight,
  LogOut,
  GraduationCap,
  Activity
} from 'lucide-react';

export default function TrainerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    submissionsApi.trainerList()
      .then((subs: any[]) => {
        setPendingCount(subs.filter((s) => !s.reviewed).length);
      })
      .catch(() => {});
  }, []);

  const navItems = [
    { name: 'Dashboard', href: '/trainer/dashboard', icon: LayoutDashboard },
    { name: 'Profile', href: '/trainer/profile', icon: User },
    { name: 'My Courses', href: '/trainer/courses', icon: BookOpen },
    { name: 'Create Course', href: '/trainer/create-course', icon: Plus },
    { name: 'Videos List', href: '/trainer/courses?focus=videos', icon: Video },
    { name: 'MCQs Management', href: '/trainer/courses?focus=mcqs', icon: ListChecks },
    { name: 'Summary Task', href: '/trainer/courses?focus=summary', icon: FileText },
    { name: 'Assignments', href: '/trainer/assignments', icon: BookOpen },
    { name: 'Retry Qs', href: '/trainer/assessments/retry', icon: RotateCcw },
    { name: 'Submissions', href: '/trainer/submissions', icon: CheckSquare },
    { name: 'Chat', href: '/trainer/chat', icon: MessageSquare },
    { name: 'Live Q&A', href: '/trainer/meetings', icon: Video },
    { name: 'Student Analytics', href: '/trainer/analytics', icon: Activity },
    { name: 'Student Reports', href: '/trainer/reports/students', icon: FileBarChart },
    { name: 'Institution', href: '/trainer/reports/institution', icon: Building2 },
    { name: 'Earnings', href: '/trainer/earnings', icon: DollarSign },
    { name: 'Revenue', href: '/trainer/earnings/history', icon: History },
    { name: 'Notifications', href: '/trainer/notifications', icon: Bell },
    { name: 'Trainer Approvals', href: '/trainer/admin/trainers', icon: ShieldCheck },
    { name: 'Course Approvals', href: '/trainer/admin/courses', icon: Layers },
  ];

  // breadcrumb helper
  const getBreadcrumbs = () => {
    const parts = pathname.split('/').filter(Boolean);
    return parts.map((part) => {
      return part.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    });
  };
  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="flex h-screen bg-[#c8e6c9] text-[#0f3d1a] overflow-hidden font-sans p-4 gap-6">
      
      {/* CSS for complex blob animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blob1 {
          0% { transform: translate(0px, 0px) scale(1) translateZ(0); }
          33% { transform: translate(30px, -50px) scale(1.1) translateZ(0); }
          66% { transform: translate(-20px, 20px) scale(0.9) translateZ(0); }
          100% { transform: translate(0px, 0px) scale(1) translateZ(0); }
        }
        @keyframes blob2 {
          0% { transform: translate(0px, 0px) scale(1) translateZ(0); }
          33% { transform: translate(-30px, 50px) scale(1.1) translateZ(0); }
          66% { transform: translate(20px, -20px) scale(0.9) translateZ(0); }
          100% { transform: translate(0px, 0px) scale(1) translateZ(0); }
        }
        .animate-blob1 { animation: blob1 10s infinite alternate ease-in-out; will-change: transform; }
        .animate-blob2 { animation: blob2 12s infinite alternate ease-in-out; will-change: transform; }
      `}} />

      {/* Glow Effects (Animation Vibe: pin.it/10obDGXOZ) */}
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#5E6F58] opacity-[0.25] rounded-full blur-[120px] pointer-events-none animate-blob1" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600 opacity-[0.25] rounded-full blur-[120px] pointer-events-none animate-blob2" />
      <div className="fixed top-[40%] left-[30%] w-[40%] h-[40%] bg-blue-600 opacity-[0.15] rounded-full blur-[100px] pointer-events-none animate-blob1" style={{ animationDelay: '2s' }} />

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Floating Detached Sidebar (Pinterest Style: pin.it/5HKP49RwL) */}
      <aside className={`w-72 bg-[#0f172a]/60 backdrop-blur-3xl border border-[#1a6b2e]/20 rounded-[32px] flex flex-col relative z-50 shadow-[0_0_50px_rgba(26, 107, 46, 0.1)] overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'fixed inset-y-4 left-4 right-auto translate-x-0' : 'hidden md:flex translate-x-0'}`}>
        
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden absolute top-6 right-6 p-2 rounded-xl bg-[#1a6b2e]/5 text-[#0f3d1a] hover:bg-white/10 transition-colors z-50"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Animated Top Glow */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#5E6F58] to-transparent opacity-50" />
        
        <div className="p-8 pb-4">
          <h2 className="text-3xl font-black bg-gradient-to-r from-[#5E6F58] to-sky-400 bg-clip-text text-transparent drop-shadow-lg">NextGen-LMS</h2>
          <p className="text-[10px] text-[#1a6b2e] mt-2 tracking-[0.2em] uppercase font-bold">Trainer Module</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-2 px-4 space-y-1 hide-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/trainer/dashboard' && pathname.startsWith(item.href));
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group relative overflow-hidden border-l-2 ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#5E6F58]/15 to-transparent text-[#0f3d1a] border-l-[#5E6F58] shadow-[inset_10px_0_30px_rgba(240,89,31,0.05)]' 
                    : 'text-[#1a6b2e] hover:bg-gradient-to-r hover:from-[#5E6F58]/10 hover:to-transparent hover:text-[#0f3d1a] hover:border-l-[#5E6F58]/50 border-l-transparent'
                }`}
              >
                <div className="absolute inset-0 bg-[#1a6b2e]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Icon className={`w-5 h-5 transition-colors relative z-10 ${isActive ? 'text-[#d94d19]' : 'group-hover:text-[#d94d19]'}`} />
                <span className="font-bold text-sm tracking-wide relative z-10 flex-1">{item.name}</span>
                {item.name === 'Submissions' && pendingCount > 0 && (
                  <span className="relative z-10 px-2 py-0.5 text-[10px] font-bold bg-[#5E6F58] text-[#0f3d1a] rounded-md">
                    {pendingCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        
        {/* Dynamic User Profile Card & Logout */}
        <div className="p-6 border-t border-[#1a6b2e]/10 bg-[#c8e6c9]/30 mt-2 flex flex-col gap-3">
          <div className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-[#1a6b2e]/5 transition-colors cursor-pointer border border-transparent hover:border-[#1a6b2e]/20">
            <div className="relative flex-shrink-0">
              {user?.avatar ? (
                <img 
                  src={`http://localhost:8000${user.avatar}`} 
                  alt="Avatar" 
                  className="w-11 h-11 rounded-full object-cover border-2 border-sky-500/50 shadow-[0_0_15px_rgba(240,89,31,0.3)]"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 p-[2px] shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                  <div className="w-full h-full bg-[#c8e6c9] rounded-full flex items-center justify-center">
                    <span className="font-black text-sm text-[#0f3d1a]">{user?.name?.[0]?.toUpperCase() || 'T'}</span>
                  </div>
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0f172a]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-[#0f3d1a] truncate leading-snug">{user?.name || 'Trainer'}</p>
              <p className="text-[9px] text-[#d94d19] font-bold uppercase tracking-wider mt-0.5">
                {user?.verifiedBadge ? 'Verified Trainer' : 'Trainer'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              router.replace('/login');
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[#7dab52] hover:text-red-400 hover:bg-red-500/5 border border-transparent hover:border-red-500/20 transition-all duration-200 group text-xs font-bold uppercase tracking-wider"
          >
            <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area (Detached Layout with Sticky Top Header) */}
      <main className="flex-1 relative rounded-[32px] bg-[#c8e6c9] border border-[#1a6b2e]/10 shadow-2xl z-10 mt-16 md:mt-0 flex flex-col overflow-hidden h-full">
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-[#c8e6c9]/85 backdrop-blur-xl border-b border-[#1a6b2e]/10 flex items-center justify-between px-4 sm:px-6 lg:px-6 shadow-[0_2px_8px_rgba(26, 107, 46, 0.1)] flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-xl hover:bg-[#1a6b2e]/5 transition-all duration-200 active:scale-95"
            >
              <Menu className="w-5 h-5 text-[#1a6b2e]" />
            </button>
            <div className="flex items-center gap-1.5 text-xs text-[#7dab52] font-medium" suppressHydrationWarning>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb}>
                  {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-700" />}
                  <span suppressHydrationWarning className={idx === breadcrumbs.length - 1 ? 'text-[#1a6b2e] font-semibold' : 'text-gray-600'}>
                    {crumb}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-800/40 border border-gray-800/60">
              <Search className="w-4 h-4 text-gray-600" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm text-[#1a6b2e] placeholder-gray-600 outline-none w-32 focus:w-48 transition-all duration-300"
              />
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-[#7dab52] px-3 py-2 rounded-xl bg-gray-800/40 border border-gray-800/60" suppressHydrationWarning>
              <Clock className="w-3.5 h-3.5" />
              <span suppressHydrationWarning>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <button className="relative p-2 rounded-xl hover:bg-[#1a6b2e]/5 transition-all duration-200 active:scale-95">
              <Bell className="w-5 h-5 text-[#1a6b2e]" />
              {pendingCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#5E6F58] border-2 border-[#020617] shadow-[0_0_8px_rgba(240,89,31,0.6)] animate-[pulse-subtle_2s_ease-in-out_infinite]" />
              )}
            </button>
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#5E6F58]/20 to-sky-500/10 border border-[#5E6F58]/20 flex items-center justify-center flex-shrink-0 shadow-[0_4px_12px_-2px_rgba(240,89,31,0.2)] overflow-hidden">
              {user?.avatar ? (
                <img 
                  src={`http://localhost:8000${user.avatar}`} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sky-400 font-extrabold text-sm">{user?.name?.[0]?.toUpperCase() || 'T'}</span>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Page Content Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-6 space-y-6 w-full max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
