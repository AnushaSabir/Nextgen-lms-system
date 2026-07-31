'use client';

import React from 'react';
import { useAuthStore } from '@/store/auth-store';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Users, 
  BookOpen, 
  DollarSign, 
  Activity,
  MoreHorizontal,
  Clock,
  Calendar,
  Play,
  TrendingUp,
  Star
} from 'lucide-react';
import Image from 'next/image';

export function TrainerDashboardOverview() {
  const { user } = useAuthStore();

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 font-sans bg-[#050505] min-h-screen text-[#0f3d1a]">
      
      {/* Premium 3D Hero Banner */}
      <div className="relative w-full h-[320px] rounded-[2rem] overflow-hidden group">
        {/* Background 3D Abstract Image */}
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
            alt="3D Abstract Background"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          {/* Overlay Gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-between p-8 sm:p-10">
          {/* Top Bar inside banner */}
          <div className="flex justify-between items-start">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
                <span className="text-xs font-semibold text-[#0f3d1a] tracking-wide">LIVE DASHBOARD</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0f3d1a] mb-2 drop-shadow-lg">
                Welcome back, {user?.name || 'Trainer'}
              </h1>
              <p className="text-[#1a6b2e] text-lg max-w-lg drop-shadow-md">
                Your courses are trending! You have <span className="text-[#CCFF00] font-bold">12 new students</span> this week.
              </p>
            </div>
            
            {/* Quick action button */}
            <button className="hidden sm:flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-lg hover:bg-white/20 border border-white/20 text-[#0f3d1a] font-bold rounded-2xl transition-all shadow-xl">
              <Calendar className="w-5 h-5" />
              <span>Export Report</span>
            </button>
          </div>

          {/* Floating Glassmorphism Stats inside Banner */}
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <GlassStat title="Earnings" value="$4,250" trend="+12.5%" />
            <GlassStat title="Students" value="1,248" trend="+5.2%" />
            <GlassStat title="Completion" value="68%" trend="-2.1%" isNegative />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Charts and Performance */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Modern Chart Card */}
          <div className="bg-[#101010] border border-[#1a6b2e]/10 rounded-[2rem] p-8 relative overflow-hidden">
            {/* Glow effect */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#CCFF00]/5 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <h2 className="text-xl font-bold text-[#0f3d1a] mb-1">Revenue Overview</h2>
                <p className="text-sm text-[#7dab52]">Track your course sales across the week</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-[#1a6b2e]/5 rounded-xl text-sm font-medium text-[#0f3d1a] border border-[#1a6b2e]/20 hover:bg-white/10 transition">Weekly</button>
                <button className="px-4 py-2 text-sm font-medium text-[#7dab52] hover:text-[#0f3d1a] transition">Monthly</button>
              </div>
            </div>

            {/* Dummy Chart Visualization */}
            <div className="h-64 w-full relative flex items-end justify-between gap-3 z-10">
              {/* Bars (Mock Data) */}
              {[40, 60, 45, 80, 55, 95, 75].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end items-center group cursor-pointer h-full pb-8">
                  <div className="w-full max-w-[48px] relative flex justify-center h-full items-end">
                    {/* Hover tooltip */}
                    <div className="absolute -top-12 bg-white text-black text-xs font-bold px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-xl transform translate-y-2 group-hover:translate-y-0">
                      ${(height * 50).toFixed(0)}
                    </div>
                    {/* Bar */}
                    <div 
                      className="w-full bg-gradient-to-t from-[#CCFF00]/20 to-[#CCFF00] rounded-2xl opacity-70 group-hover:opacity-100 transition-all duration-300 relative overflow-hidden"
                      style={{ height: `${height}%` }}
                    >
                      {/* Inner highlight */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-[#1a6b2e]/50" />
                    </div>
                  </div>
                  <span className="text-xs text-[#7dab52] mt-4 font-medium uppercase tracking-wider">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Left: Featured Courses / Activity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* 3D Illustration Card for a specific Course */}
            <div className="bg-gradient-to-br from-[#1c1c1c] to-[#0a0a0a] border border-[#1a6b2e]/10 rounded-[2rem] p-6 relative overflow-hidden group cursor-pointer hover:border-[#CCFF00]/50 transition-colors">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                 {/* Using a 3D-like object image */}
                <Image 
                  src="https://images.unsplash.com/photo-1634128221889-82ed6efebfc3?q=80&w=600&auto=format&fit=crop" 
                  alt="3D element" 
                  fill
                  className="object-cover rounded-full mix-blend-screen filter drop-shadow-2xl" 
                />
              </div>
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#0f3d1a] mb-4 border border-[#1a6b2e]/20">
                  <Star className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-[#0f3d1a] mb-2">UI/UX Masterclass</h3>
                <p className="text-sm text-[#1a6b2e] mb-6 max-w-[80%]">Top performing course this month.</p>
                <div className="flex items-center gap-2 text-[#CCFF00] font-semibold text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>+24% Sales</span>
                </div>
              </div>
            </div>

            {/* Engagement Card */}
            <div className="bg-[#101010] border border-[#1a6b2e]/10 rounded-[2rem] p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#0f3d1a] mb-1">Student Engagement</h3>
                <p className="text-sm text-[#7dab52]">Average completion rate</p>
              </div>
              <div className="flex items-end gap-4 mt-8">
                <span className="text-5xl font-black text-[#0f3d1a]">84<span className="text-2xl text-[#7dab52]">%</span></span>
                <span className="text-sm text-[#CCFF00] font-medium flex items-center gap-1 mb-2">
                  <ArrowUpRight className="w-4 h-4" /> 4% up
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Session & Activity */}
        <div className="space-y-8">
          
          {/* Live Action Hero Card */}
          <div className="relative bg-[#CCFF00] rounded-[2rem] p-8 text-black overflow-hidden group">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:bg-white/40 transition-colors duration-500" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/10 rounded-full mb-6">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Starts in 15m</span>
              </div>
              <h3 className="text-3xl font-extrabold leading-tight mb-4">Live Q&A<br/>Session</h3>
              <p className="text-black/70 font-medium mb-8">Discuss UI trends with your top tier students.</p>
              
              <button className="w-full py-4 bg-black text-[#0f3d1a] font-bold rounded-2xl hover:bg-gray-900 transition-all hover:scale-[1.02] active:scale-95 shadow-2xl flex items-center justify-center gap-2">
                <Play className="w-5 h-5 fill-white" />
                Join Studio
              </button>
            </div>
          </div>

          {/* Recent Activity List with Image Avatars */}
          <div className="bg-[#101010] border border-[#1a6b2e]/10 rounded-[2rem] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#0f3d1a]">Recent Submissions</h2>
              <button className="text-[#7dab52] hover:text-[#0f3d1a] transition">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-5">
              {[
                { name: 'Sarah Jenkins', task: 'Web Animation Project', time: '2m ago', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
                { name: 'Michael Chen', task: 'Dashboard UI', time: '1h ago', img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop' },
                { name: 'Emma Wilson', task: 'Mobile App Design', time: '3h ago', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                  <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-[#1a6b2e]/20 group-hover:border-[#CCFF00]/50 transition-colors">
                    <Image src={item.img} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-[#0f3d1a] group-hover:text-[#CCFF00] transition-colors">{item.name}</h4>
                    <p className="text-xs text-[#7dab52] truncate max-w-[150px]">{item.task}</p>
                  </div>
                  <span className="text-[11px] font-medium text-gray-600 bg-[#1a6b2e]/5 px-2 py-1 rounded-lg">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-8 py-3 bg-[#1a6b2e]/5 rounded-xl text-sm font-bold text-[#0f3d1a] hover:bg-white/10 transition-colors border border-[#1a6b2e]/10">
              View All 24 Submissions
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// Reusable Glassmorphism Stat Component
function GlassStat({ title, value, trend, isNegative }: any) {
  return (
    <div className="min-w-[160px] p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl flex-shrink-0">
      <h3 className="text-[#1a6b2e] text-xs font-medium uppercase tracking-wider mb-2">{title}</h3>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-[#0f3d1a]">{value}</span>
        <span className={`text-xs font-bold flex items-center ${isNegative ? 'text-red-400' : 'text-[#CCFF00]'}`}>
          {isNegative ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
          {trend}
        </span>
      </div>
    </div>
  );
}
