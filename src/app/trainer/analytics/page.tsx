'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Clock, Search, Activity, AlertCircle, Files } from 'lucide-react';
import { PageHeader, StatCard, Card, SectionHeader, Badge, Loading } from '@/components/trainer/ui';
import { trainerApi } from '@/lib/api';

type Analytics = {
  totalCourses: number;
  activeCourses: number;
  totalStudents: number;
  totalSubmissions: number;
  pendingReviews: number;
  passRate: number;
  totalEarnings: number;
};

type Student = {
  id: string;
  name: string;
  email: string;
  course: string;
  courseId: string;
  status: string;
  progress: number;
  totalVideos: number;
  unlockedVideoPosition: number;
};

const STATUS_TONE: Record<string, 'success' | 'info' | 'danger'> = {
  completed: 'success',
  active: 'info',
  suspended: 'danger',
};

export default function TrainerAnalyticsPage() {
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalCourses: 0,
    activeCourses: 0,
    totalStudents: 0,
    totalSubmissions: 0,
    pendingReviews: 0,
    passRate: 0,
    totalEarnings: 0,
  });
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [a, s] = await Promise.all([
          trainerApi.analytics().catch(() => null),
          trainerApi.students().catch(() => []),
        ]);
        if (!active) return;
        if (a) setAnalytics(a);
        setStudents(Array.isArray(s) ? s : []);
      } catch {
        if (!active) return;
        setStudents([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Course options derived from real students
  const courseOptions = Array.from(
    new Map(students.map((s) => [s.courseId, s.course])).entries()
  ).filter(([id]) => id);

  const filteredStudents = students.filter((s) => {
    const matchCourse = selectedCourse === 'all' || s.courseId === selectedCourse;
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
    return matchCourse && matchSearch;
  });

  return (
    <div className="p-6 md:p-12 w-full h-full relative overflow-y-auto hide-scrollbar z-10 animate-in fade-in zoom-in-95 duration-1000">
      
      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0f3d1a] mb-2 tracking-tight">Student Analytics</h1>
          <p className="text-sm sm:text-base text-[#1a6b2e]">Track student progress, engagement, and drop-off rates.</p>
        </div>
        <div className="flex gap-3">
          <select 
            value={selectedCourse} 
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="bg-[#0f172a] border border-[#1e293b] text-[#0f3d1a] px-4 py-3 rounded-2xl focus:outline-none focus:border-blue-500 font-semibold"
          >
            <option value="all">All Courses</option>
            <option value="web">Advanced Web Dev</option>
            <option value="ui">UI/UX Masterclass</option>
            <option value="python">Python Basics</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white/[0.02] backdrop-blur-2xl border border-[#1a6b2e]/20 rounded-3xl p-6 hover:border-white/20 transition-all cursor-default transform-style-3d hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${stat.color}-500/10 border border-${stat.color}-500/20 text-${stat.color}-400`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-full ${stat.isUp ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {stat.trend}
              </span>
            </div>
            <h3 className="text-3xl font-black text-[#0f3d1a] mb-1">{stat.value}</h3>
            <p className="text-[#64748b] text-sm font-semibold">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Progress Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 mb-12">
        <div className="lg:col-span-2 bg-gradient-to-b from-[#0f172a] to-[#020617] border border-[#1a6b2e]/20 rounded-[40px] p-8 shadow-2xl">
          <h3 className="text-xl font-black text-[#0f3d1a] mb-8 flex items-center gap-3">
            <BarChart3 className="text-blue-400 w-6 h-6" /> Course Completion Funnel
          </h3>
          
          <div className="space-y-6">
            {[
              { label: 'Started Course (0-10%)', count: 1248, width: '100%', color: 'from-blue-600 to-cyan-500' },
              { label: 'Watched 25%', count: 980, width: '78%', color: 'from-blue-500 to-indigo-500' },
              { label: 'Watched 50%', count: 850, width: '68%', color: 'from-indigo-500 to-purple-500' },
              { label: 'Watched 75%', count: 620, width: '49%', color: 'from-purple-500 to-fuchsia-500' },
              { label: 'Completed (100%)', count: 410, width: '32%', color: 'from-green-500 to-emerald-400' },
            ].map((bar, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2 font-semibold">
                  <span className="text-[#1a6b2e]">{bar.label}</span>
                  <span className="text-[#0f3d1a]">{bar.count} Students</span>
                </div>
                <div className="w-full bg-gray-800/50 rounded-full h-4 overflow-hidden border border-[#1a6b2e]/10">
                  <div className={`h-full bg-gradient-to-r ${bar.color} rounded-full`} style={{ width: bar.width }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="bg-white/[0.02] backdrop-blur-2xl border border-[#1a6b2e]/20 rounded-[40px] p-8 shadow-2xl">
           <h3 className="text-xl font-black text-[#0f3d1a] mb-6">Drop-off Insights</h3>
           <p className="text-[#1a6b2e] text-sm mb-6">Most students drop off after the first 25% of the course. Consider adding a summary task or interactive quiz to keep them engaged.</p>
           
           <div className="p-5 bg-sky-500/10 border border-sky-500/20 rounded-2xl mb-4">
             <h4 className="text-sky-400 font-bold mb-1">Critical Point</h4>
             <p className="text-orange-300/80 text-sm">Module 2: Basics</p>
             <p className="text-xs text-sky-400/60 mt-2">14% drop-off rate</p>
           </div>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-[#0f172a]/50 backdrop-blur-2xl border border-[#1a6b2e]/20 rounded-[40px] p-8 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h3 className="text-2xl font-black text-[#0f3d1a]">Student Progress</h3>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#1a6b2e]" />
              <input type="text" placeholder="Search student..." className="w-full pl-10 pr-4 py-2.5 bg-[#c8e6c9] border border-[#1a6b2e]/20 rounded-xl text-sm text-[#0f3d1a] focus:outline-none focus:border-blue-500" />
            </div>
            <button className="p-2.5 bg-[#c8e6c9] border border-[#1a6b2e]/20 rounded-xl text-[#1a6b2e] hover:text-[#0f3d1a] transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="gt-scroll overflow-x-auto">
          <table className="gt-table">
            <thead>
              <tr className="border-b border-[#1a6b2e]/20">
                <th className="py-4 px-4 text-sm font-bold text-[#1a6b2e] uppercase tracking-wider">Student Name</th>
                <th className="py-4 px-4 text-sm font-bold text-[#1a6b2e] uppercase tracking-wider">Course</th>
                <th className="py-4 px-4 text-sm font-bold text-[#1a6b2e] uppercase tracking-wider">Progress</th>
                <th className="py-4 px-4 text-sm font-bold text-[#1a6b2e] uppercase tracking-wider">Status</th>
                <th className="py-4 px-4 text-sm font-bold text-[#1a6b2e] uppercase tracking-wider">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id} className="border-b border-[#1a6b2e]/10 hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4">
                    <p className="font-bold text-[#0f3d1a]">{student.name}</p>
                  </td>
                  <td className="py-4 px-4 text-sm text-[#1a6b2e]">{student.course}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-800 rounded-full h-2">
                        <div 
                          className={`h-full rounded-full ${student.progress === 100 ? 'bg-green-500' : student.progress > 50 ? 'bg-blue-500' : 'bg-sky-500'}`}
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-[#1a6b2e]">{student.progress}%</span>
                    </div>
                  </td>
                  <td>
                    <Badge tone={STATUS_TONE[student.status] ?? 'info'} dot>
                      {student.status ? student.status.charAt(0).toUpperCase() + student.status.slice(1) : '—'}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-sm text-[#7dab52]">{student.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
