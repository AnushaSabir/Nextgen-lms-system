'use client';

import { useEffect, useState } from 'react';
import {
  BookOpen, FileText, Calendar, Users, BarChart3,
  Upload, CheckCircle2, Clock, Star, TrendingUp,
  DollarSign, Award, MessageSquare, Video, Plus, Send, X, Eye,
  Sparkles, Bell, Edit3, Download, Search, AlertCircle, Activity,
} from 'lucide-react';

type TabType = 'overview' | 'courses' | 'submissions' | 'meetings' | 'students' | 'earnings';

const TRAINER = {
  name: 'Engr. Sarah Tariq',
  specialization: 'Full Stack & AI Engineering',
  rating: 4.9,
  totalStudents: 342,
  activeCourses: 6,
  completedCourses: 12,
  totalRevenue: 185400,
  monthRevenue: 24800,
  avatar: 'S',
};

const MY_COURSES = [
  { id: 1, title: 'Next.js 15 & React 19 Mastery', category: 'Web Dev', students: 128, progress: 78, revenue: 48200, rating: 4.9, status: 'active', thumbnail: 'WD', lectures: 42, duration: '38h', lastUpdated: '2 days ago' },
  { id: 2, title: 'AI & Machine Learning Fundamentals', category: 'AI & Data', students: 96, progress: 65, revenue: 36800, rating: 4.8, status: 'active', thumbnail: 'AI', lectures: 35, duration: '28h', lastUpdated: '5 days ago' },
  { id: 3, title: 'Cloud Architecture & DevOps CI/CD', category: 'Cloud', students: 74, progress: 50, revenue: 28100, rating: 4.7, status: 'active', thumbnail: 'CL', lectures: 28, duration: '22h', lastUpdated: '1 week ago' },
  { id: 4, title: 'UI/UX Design System Masterclass', category: 'Design', students: 44, progress: 30, revenue: 16800, rating: 4.6, status: 'draft', thumbnail: 'UX', lectures: 18, duration: '14h', lastUpdated: '3 days ago' },
];

const INITIAL_SUBMISSIONS = [
  { id: 1, student: 'Ali Hassan', course: 'Next.js 15 Mastery', task: 'Final Portfolio Project', submitted: '2 hrs ago', status: 'pending', score: null as number | null, avatar: 'A' },
  { id: 2, student: 'Sara Khan', course: 'AI & ML Fundamentals', task: 'Neural Network Assignment', submitted: '5 hrs ago', status: 'pending', score: null as number | null, avatar: 'S' },
  { id: 3, student: 'Usman Malik', course: 'Next.js 15 Mastery', task: 'API Integration Task', submitted: '1 day ago', status: 'graded', score: 92 as number | null, avatar: 'U' },
  { id: 4, student: 'Fatima Zahra', course: 'Cloud & DevOps', task: 'Docker Deployment Lab', submitted: '1 day ago', status: 'graded', score: 88 as number | null, avatar: 'F' },
  { id: 5, student: 'Bilal Ahmed', course: 'AI & ML Fundamentals', task: 'Data Preprocessing Quiz', submitted: '2 days ago', status: 'graded', score: 76 as number | null, avatar: 'B' },
  { id: 6, student: 'Zara Noor', course: 'UI/UX Design', task: 'Wireframe Design Task', submitted: '3 days ago', status: 'revision', score: 65 as number | null, avatar: 'Z' },
];

const MEETINGS = [
  { id: 1, title: '1-on-1 Mentorship — Ali Hassan', student: 'Ali Hassan', date: 'Today', time: '3:00 PM', duration: '45 min', type: 'video', status: 'upcoming', avatar: 'A' },
  { id: 2, title: 'Next.js Doubt Clearing Session', student: 'Group (8 students)', date: 'Today', time: '6:00 PM', duration: '90 min', type: 'group', status: 'upcoming', avatar: 'G' },
  { id: 3, title: 'AI Project Review — Sara Khan', student: 'Sara Khan', date: 'Tomorrow', time: '11:00 AM', duration: '30 min', type: 'video', status: 'scheduled', avatar: 'S' },
  { id: 4, title: 'Cloud Architecture Workshop', student: 'Group (12 students)', date: 'Aug 22', time: '4:00 PM', duration: '120 min', type: 'group', status: 'scheduled', avatar: 'G' },
  { id: 5, title: '1-on-1 Mentorship — Zara Noor', student: 'Zara Noor', date: 'Aug 23', time: '2:00 PM', duration: '45 min', type: 'video', status: 'scheduled', avatar: 'Z' },
];

const STUDENTS = [
  { id: 1, name: 'Ali Hassan', course: 'Next.js 15 Mastery', progress: 82, score: 91, status: 'excellent', avatar: 'A', lastActive: '2 hrs ago' },
  { id: 2, name: 'Sara Khan', course: 'AI & ML Fundamentals', progress: 68, score: 84, status: 'good', avatar: 'S', lastActive: '1 day ago' },
  { id: 3, name: 'Usman Malik', course: 'Next.js 15 Mastery', progress: 55, score: 76, status: 'average', avatar: 'U', lastActive: '3 hrs ago' },
  { id: 4, name: 'Fatima Zahra', course: 'Cloud & DevOps', progress: 90, score: 96, status: 'excellent', avatar: 'F', lastActive: '30 min ago' },
  { id: 5, name: 'Bilal Ahmed', course: 'AI & ML Fundamentals', progress: 40, score: 62, status: 'needs-help', avatar: 'B', lastActive: '2 days ago' },
  { id: 6, name: 'Zara Noor', course: 'UI/UX Design', progress: 35, score: 58, status: 'needs-help', avatar: 'Z', lastActive: '5 hrs ago' },
];

const EARNINGS_MONTHLY = [
  { month: 'Mar', amount: 12400 }, { month: 'Apr', amount: 15800 },
  { month: 'May', amount: 18200 }, { month: 'Jun', amount: 16900 },
  { month: 'Jul', amount: 21500 }, { month: 'Aug', amount: 24800 },
];

export function TrainerDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedSubmission, setSelectedSubmission] = useState<typeof INITIAL_SUBMISSIONS[0] | null>(null);
  const [gradeInput, setGradeInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [createCourseOpen, setCreateCourseOpen] = useState(false);
  const [announcementOpen, setAnnouncementOpen] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');
  const [searchStudents, setSearchStudents] = useState('');
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);

  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash;
      if (h === '#courses') setActiveTab('courses');
      else if (h === '#submissions') setActiveTab('submissions');
      else if (h === '#meetings') setActiveTab('meetings');
      else if (h === '#students') setActiveTab('students');
      else if (h === '#earnings') setActiveTab('earnings');
      else setActiveTab('overview');
    };
    onHash();
    window.addEventListener('hashchange', onHash);
    window.addEventListener('popstate', onHash);
    return () => {
      window.removeEventListener('hashchange', onHash);
      window.removeEventListener('popstate', onHash);
    };
  }, []);

  const handleGrade = () => {
    if (!selectedSubmission || !gradeInput) return;
    setSubmissions(prev => prev.map(s =>
      s.id === selectedSubmission.id ? { ...s, status: 'graded', score: parseInt(gradeInput) } : s
    ));
    setSelectedSubmission(null);
    setGradeInput('');
    setFeedbackInput('');
  };

  const maxEarning = Math.max(...EARNINGS_MONTHLY.map(e => e.amount));
  const filteredStudents = STUDENTS.filter(s =>
    s.name.toLowerCase().includes(searchStudents.toLowerCase()) ||
    s.course.toLowerCase().includes(searchStudents.toLowerCase())
  );

  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  const gradedCount = submissions.filter(s => s.status === 'graded').length;
  const revisionCount = submissions.filter(s => s.status === 'revision').length;

  return (
    <div className="space-y-6">

      {/* ===== OVERVIEW ===== */}
      {activeTab === 'overview' && (
        <>
          {/* Hero Banner */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#0f3d1a] via-[#1a6b2e] to-[#2d6a4f] p-6 lg:p-8 shadow-xl">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 w-40 h-40 rounded-full bg-white blur-3xl" />
              <div className="absolute bottom-4 left-8 w-24 h-24 rounded-full bg-[#c8e6c9] blur-2xl" />
            </div>
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#c8e6c9]/20 border border-[#c8e6c9]/30 flex items-center justify-center">
                    <span className="text-[#c8e6c9] font-black text-xl">{TRAINER.avatar}</span>
                  </div>
                  <div>
                    <p className="text-[#c8e6c9]/70 text-xs font-bold uppercase tracking-widest">Welcome back,</p>
                    <h2 className="text-white font-black text-xl">{TRAINER.name}</h2>
                  </div>
                </div>
                <p className="text-[#c8e6c9]/80 text-sm font-semibold">{TRAINER.specialization}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.floor(TRAINER.rating) ? 'text-amber-400 fill-amber-400' : 'text-white/30'}`} />
                  ))}
                  <span className="text-white font-black text-sm ml-1">{TRAINER.rating}</span>
                  <span className="text-[#c8e6c9]/60 text-xs ml-1">instructor rating</span>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setCreateCourseOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#0f3d1a] font-black text-sm shadow-lg hover:scale-105 transition-transform">
                  <Plus className="w-4 h-4" /> New Course
                </button>
                <button onClick={() => setAnnouncementOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#c8e6c9]/20 border border-[#c8e6c9]/30 text-white font-black text-sm hover:bg-[#c8e6c9]/30 transition-colors">
                  <Bell className="w-4 h-4" /> Announce
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Students', value: TRAINER.totalStudents, icon: Users, col: 'emerald', trend: '+12 this week', up: true },
              { label: 'Active Courses', value: TRAINER.activeCourses, icon: BookOpen, col: 'sky', trend: '2 in progress', up: true },
              { label: 'Pending Reviews', value: pendingCount, icon: FileText, col: 'amber', trend: 'Need attention', up: false },
              { label: 'This Month', value: 'PKR ' + (TRAINER.monthRevenue/1000).toFixed(0) + 'k', icon: DollarSign, col: 'violet', trend: '+18% vs last', up: true },
            ].map((stat) => {
              const Icon = stat.icon;
              const cls = { emerald: 'bg-emerald-50 border-emerald-200 text-emerald-600', sky: 'bg-sky-50 border-sky-200 text-sky-600', amber: 'bg-amber-50 border-amber-200 text-amber-600', violet: 'bg-violet-50 border-violet-200 text-violet-600' }[stat.col];
              return (
                <div key={stat.label} className="bg-white rounded-2xl p-5 border border-[#1a6b2e]/10 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`inline-flex p-2 rounded-xl border mb-3 ${cls}`}><Icon className="w-5 h-5" /></div>
                  <p className="text-2xl font-black text-[#0f3d1a]">{stat.value}</p>
                  <p className="text-xs font-bold text-[#1a6b2e]/70 mt-0.5">{stat.label}</p>
                  <div className={`flex items-center gap-1 mt-1.5 text-[11px] font-bold ${stat.up ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {stat.up ? <TrendingUp className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {stat.trend}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Performance + Schedule */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#1a6b2e]/10 shadow-sm">
              <h3 className="font-black text-[#0f3d1a] text-base mb-5 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#1a6b2e]" /> Teaching Performance Index
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                {[
                  { label: 'Avg Rating', value: 4.8, max: 5, color: '#10b981', suffix: '/5' },
                  { label: 'Completion Rate', value: 76, max: 100, color: '#50BED9', suffix: '%' },
                  { label: 'Response Rate', value: 94, max: 100, color: '#8b5cf6', suffix: '%' },
                  { label: 'On-Time Reviews', value: 88, max: 100, color: '#f59e0b', suffix: '%' },
                ].map((m) => {
                  const pct = (m.value / m.max) * 100;
                  const r = 38; const circ = 2 * Math.PI * r;
                  return (
                    <div key={m.label} className="flex flex-col items-center">
                      <div className="relative w-24 h-24">
                        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                          <circle cx="48" cy="48" r={r} fill="none" stroke="#e5e7eb" strokeWidth="8" />
                          <circle cx="48" cy="48" r={r} fill="none" stroke={m.color} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(pct/100)*circ} ${circ}`} />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-black text-[#0f3d1a]">{m.value}{m.suffix}</span>
                        </div>
                      </div>
                      <p className="text-[10px] font-bold text-[#1a6b2e]/80 text-center mt-1 leading-tight">{m.label}</p>
                      <div className="w-full bg-gray-100 rounded-full h-1 mt-1">
                        <div className="h-1 rounded-full" style={{ width: `${pct}%`, backgroundColor: m.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="bg-gradient-to-r from-[#c8e6c9] to-[#b2dfdb] rounded-xl p-4 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#0f3d1a] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#0f3d1a] font-black text-sm">AI Insight: Outstanding Performance!</p>
                  <p className="text-[#1a6b2e] text-xs font-semibold">Your Next.js course has 98% completion in last 30 days. Consider adding an advanced module to retain students!</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#1a6b2e]/10 shadow-sm">
              <h3 className="font-black text-[#0f3d1a] text-base mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#1a6b2e]" /> Today's Schedule
              </h3>
              <div className="space-y-3">
                {MEETINGS.filter(m => m.date === 'Today').map(meet => (
                  <div key={meet.id} className="flex items-start gap-3 p-3 rounded-xl bg-[#c8e6c9]/30 border border-[#1a6b2e]/10">
                    <div className="w-9 h-9 rounded-xl bg-[#0f3d1a] flex items-center justify-center text-white font-black text-sm shrink-0">{meet.avatar}</div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-[#0f3d1a] truncate">{meet.title}</p>
                      <p className="text-[10px] text-[#1a6b2e] font-semibold">{meet.time} · {meet.duration}</p>
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${meet.type === 'group' ? 'bg-sky-100 text-sky-700' : 'bg-violet-100 text-violet-700'}`}>
                        {meet.type === 'group' ? 'Group' : '1-on-1'}
                      </span>
                    </div>
                  </div>
                ))}
                <button onClick={() => { window.location.hash = 'meetings'; }} className="w-full py-2 rounded-xl border border-[#1a6b2e]/20 text-[#1a6b2e] text-xs font-bold hover:bg-[#c8e6c9]/30 transition-colors">
                  View All Meetings
                </button>
              </div>
            </div>
          </div>

          {/* Pending + Top Students */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#1a6b2e]/10 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-[#0f3d1a] text-base flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-500" /> Pending Reviews
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black">{pendingCount}</span>
                </h3>
                <button onClick={() => { window.location.hash = 'submissions'; }} className="text-xs font-bold text-[#1a6b2e] hover:underline">View All</button>
              </div>
              <div className="space-y-3">
                {submissions.filter(s => s.status === 'pending').slice(0,3).map(sub => (
                  <div key={sub.id} className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
                    <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white font-black text-sm shrink-0">{sub.avatar}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black text-[#0f3d1a]">{sub.student}</p>
                      <p className="text-[10px] text-[#1a6b2e] font-semibold truncate">{sub.task}</p>
                      <p className="text-[10px] text-amber-600 font-bold">{sub.submitted}</p>
                    </div>
                    <button onClick={() => setSelectedSubmission(sub)} className="px-3 py-1.5 rounded-lg bg-[#0f3d1a] text-white text-[10px] font-black hover:bg-[#1a6b2e] transition-colors">Grade</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#1a6b2e]/10 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-[#0f3d1a] text-base flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" /> Top Students
                </h3>
                <button onClick={() => { window.location.hash = 'students'; }} className="text-xs font-bold text-[#1a6b2e] hover:underline">View All</button>
              </div>
              <div className="space-y-3">
                {STUDENTS.filter(s => s.status === 'excellent').map((stu, i) => (
                  <div key={stu.id} className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-xl bg-[#0f3d1a] flex items-center justify-center text-white font-black text-sm">{stu.avatar}</div>
                      <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black text-white ${i===0?'bg-amber-400':'bg-gray-400'}`}>{i+1}</div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black text-[#0f3d1a]">{stu.name}</p>
                      <p className="text-[10px] text-[#1a6b2e] font-semibold truncate">{stu.course}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-emerald-600">{stu.score}%</p>
                      <p className="text-[10px] text-[#1a6b2e]/60">{stu.progress}% done</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ===== MY COURSES ===== */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#0f3d1a]">My Courses</h2>
              <p className="text-sm text-[#1a6b2e] font-semibold">{TRAINER.activeCourses} active · {TRAINER.completedCourses} completed</p>
            </div>
            <button onClick={() => setCreateCourseOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f3d1a] text-white font-black text-sm shadow hover:bg-[#1a6b2e] transition-colors">
              <Plus className="w-4 h-4" /> Create New Course
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {MY_COURSES.map(course => (
              <div key={course.id} className="bg-white rounded-2xl p-5 border border-[#1a6b2e]/10 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0f3d1a] to-[#1a6b2e] flex items-center justify-center text-white font-black text-lg shrink-0">{course.thumbnail}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-black text-[#0f3d1a] text-sm leading-tight">{course.title}</h3>
                      <span className={`shrink-0 text-[9px] font-black px-2 py-0.5 rounded-full ${course.status==='active'?'bg-emerald-100 text-emerald-700':'bg-amber-100 text-amber-700'}`}>{course.status.toUpperCase()}</span>
                    </div>
                    <p className="text-[10px] text-[#1a6b2e] font-semibold mt-0.5">{course.category} · {course.lectures} lectures · {course.duration}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-black text-[#0f3d1a]">{course.rating}</span>
                      <span className="text-[10px] text-[#1a6b2e]/60 ml-1">· {course.students} students</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-[#1a6b2e]">Avg Completion</span>
                    <span className="text-[10px] font-black text-[#0f3d1a]">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="h-2 rounded-full bg-gradient-to-r from-[#1a6b2e] to-emerald-400" style={{ width: `${course.progress}%` }} />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-[#1a6b2e]/60 font-semibold">Revenue</p>
                    <p className="text-base font-black text-[#0f3d1a]">PKR {course.revenue.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-xl bg-[#c8e6c9] text-[#0f3d1a] hover:bg-[#1a6b2e] hover:text-white transition-colors"><Edit3 className="w-4 h-4" /></button>
                    <button className="p-2 rounded-xl bg-[#c8e6c9] text-[#0f3d1a] hover:bg-[#1a6b2e] hover:text-white transition-colors"><Eye className="w-4 h-4" /></button>
                    <button className="p-2 rounded-xl bg-[#c8e6c9] text-[#0f3d1a] hover:bg-[#1a6b2e] hover:text-white transition-colors"><Upload className="w-4 h-4" /></button>
                  </div>
                </div>
                <p className="text-[9px] text-[#1a6b2e]/40 font-semibold mt-2">Last updated: {course.lastUpdated}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== SUBMISSIONS ===== */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-black text-[#0f3d1a]">Student Submissions</h2>
            <p className="text-sm text-[#1a6b2e] font-semibold">{pendingCount} pending · {gradedCount} graded · {revisionCount} revision</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Pending', count: pendingCount, cls: 'text-amber-500 border-amber-100', Icon: Clock },
              { label: 'Graded', count: gradedCount, cls: 'text-emerald-500 border-emerald-100', Icon: CheckCircle2 },
              { label: 'Revision', count: revisionCount, cls: 'text-red-500 border-red-100', Icon: AlertCircle },
            ].map(s => (
              <div key={s.label} className={`bg-white rounded-2xl p-4 border shadow-sm text-center ${s.cls.split(' ').filter(c=>c.startsWith('border')).join(' ')}`}>
                <s.Icon className={`w-6 h-6 mx-auto mb-2 ${s.cls.split(' ').filter(c=>c.startsWith('text')).join(' ')}`} />
                <p className="text-2xl font-black text-[#0f3d1a]">{s.count}</p>
                <p className="text-xs font-bold text-[#1a6b2e]/70">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-[#1a6b2e]/10 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#1a6b2e]/10"><h3 className="font-black text-[#0f3d1a]">All Submissions</h3></div>
            <div className="divide-y divide-[#1a6b2e]/5">
              {submissions.map(sub => (
                <div key={sub.id} className="p-4 flex items-center gap-4 hover:bg-[#c8e6c9]/20 transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 ${sub.status==='pending'?'bg-amber-500':sub.status==='graded'?'bg-emerald-600':'bg-red-500'}`}>{sub.avatar}</div>
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-[#0f3d1a] text-sm">{sub.student}</p>
                    <p className="text-xs text-[#1a6b2e] font-semibold truncate">{sub.task} · {sub.course}</p>
                    <p className="text-[10px] text-[#1a6b2e]/60 font-semibold">Submitted {sub.submitted}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {sub.status === 'graded' && sub.score !== null && (
                      <p className={`text-lg font-black ${sub.score>=80?'text-emerald-600':sub.score>=60?'text-amber-600':'text-red-500'}`}>{sub.score}%</p>
                    )}
                    {sub.status === 'revision' && sub.score !== null && (
                      <p className="text-sm font-black text-red-500">{sub.score}% (Revision)</p>
                    )}
                    {sub.status === 'pending' ? (
                      <button onClick={() => setSelectedSubmission(sub)} className="px-3 py-1.5 rounded-xl bg-[#0f3d1a] text-white text-xs font-black hover:bg-[#1a6b2e] transition-colors">Grade Now</button>
                    ) : (
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${sub.status==='graded'?'bg-emerald-100 text-emerald-700':'bg-red-100 text-red-700'}`}>{sub.status.toUpperCase()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== MEETINGS ===== */}
      {activeTab === 'meetings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#0f3d1a]">Meetings & Sessions</h2>
              <p className="text-sm text-[#1a6b2e] font-semibold">{MEETINGS.filter(m=>m.date==='Today').length} today · {MEETINGS.length} total</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f3d1a] text-white font-black text-sm shadow hover:bg-[#1a6b2e] transition-colors">
              <Plus className="w-4 h-4" /> Schedule Session
            </button>
          </div>
          <div className="space-y-5">
            {['Today','Tomorrow','Aug 22','Aug 23'].map(day => {
              const dayMeetings = MEETINGS.filter(m=>m.date===day);
              if (!dayMeetings.length) return null;
              return (
                <div key={day}>
                  <div className="flex items-center gap-3 mb-3">
                    <p className="text-xs font-black text-[#1a6b2e]/60 uppercase tracking-widest">{day}</p>
                    <div className="flex-1 h-px bg-[#1a6b2e]/10" />
                  </div>
                  <div className="space-y-3">
                    {dayMeetings.map(meet => (
                      <div key={meet.id} className="bg-white rounded-2xl p-5 border border-[#1a6b2e]/10 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#0f3d1a] flex items-center justify-center text-white font-black text-lg shrink-0">{meet.avatar}</div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-black text-[#0f3d1a] text-sm">{meet.title}</h3>
                          <p className="text-xs text-[#1a6b2e] font-semibold">{meet.student}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-[10px] font-black text-[#0f3d1a] bg-[#c8e6c9] px-2 py-0.5 rounded-full">{meet.time}</span>
                            <span className="text-[10px] font-semibold text-[#1a6b2e]/60">{meet.duration}</span>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${meet.type==='group'?'bg-sky-100 text-sky-700':'bg-violet-100 text-violet-700'}`}>
                              {meet.type==='group'?'Group Session':'1-on-1 Video'}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${meet.status==='upcoming'?'bg-emerald-100 text-emerald-700':'bg-blue-100 text-blue-700'}`}>{meet.status.toUpperCase()}</span>
                          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0f3d1a] text-white text-xs font-black hover:bg-[#1a6b2e] transition-colors">
                            <Video className="w-3 h-3" /> Join
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== STUDENTS ===== */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-black text-[#0f3d1a]">My Students</h2>
              <p className="text-sm text-[#1a6b2e] font-semibold">{TRAINER.totalStudents} total · {STUDENTS.filter(s=>s.status==='needs-help').length} need attention</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a6b2e]/50" />
              <input type="text" placeholder="Search students..." value={searchStudents} onChange={e=>setSearchStudents(e.target.value)} className="pl-9 pr-4 py-2 rounded-xl border border-[#1a6b2e]/20 bg-white text-sm text-[#0f3d1a] focus:outline-none focus:ring-2 focus:ring-[#1a6b2e]/30 font-semibold" />
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            {[
              { s: 'excellent', label: 'Excellent', cls: 'bg-emerald-100 text-emerald-700' },
              { s: 'good', label: 'Good', cls: 'bg-sky-100 text-sky-700' },
              { s: 'average', label: 'Average', cls: 'bg-amber-100 text-amber-700' },
              { s: 'needs-help', label: 'Needs Help', cls: 'bg-red-100 text-red-700' },
            ].map(st => (
              <span key={st.s} className={`text-xs font-black px-3 py-1 rounded-full ${st.cls}`}>{st.label}: {STUDENTS.filter(x=>x.status===st.s).length}</span>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredStudents.map(stu => {
              const cfgMap: Record<string,{col:string,label:string,bg:string,avt:string}> = {
                'excellent': { col:'text-emerald-600', label:'Excellent', bg:'bg-emerald-50 border-emerald-100', avt:'bg-emerald-600' },
                'good': { col:'text-sky-600', label:'Good', bg:'bg-sky-50 border-sky-100', avt:'bg-sky-600' },
                'average': { col:'text-amber-600', label:'Average', bg:'bg-amber-50 border-amber-100', avt:'bg-amber-500' },
                'needs-help': { col:'text-red-600', label:'Needs Help', bg:'bg-red-50 border-red-100', avt:'bg-red-500' },
              };
              const cfg = cfgMap[stu.status];
              return (
                <div key={stu.id} className={`bg-white rounded-2xl p-5 border ${cfg.bg} shadow-sm`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0 ${cfg.avt}`}>{stu.avatar}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-black text-[#0f3d1a] text-sm">{stu.name}</h3>
                          <p className="text-[10px] text-[#1a6b2e] font-semibold truncate">{stu.course}</p>
                          <p className="text-[9px] text-[#1a6b2e]/50 font-semibold">Last active: {stu.lastActive}</p>
                        </div>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.col}`}>{cfg.label}</span>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div>
                          <div className="flex items-center justify-between mb-1"><span className="text-[9px] font-bold text-[#1a6b2e]/60">Progress</span><span className="text-[9px] font-black text-[#0f3d1a]">{stu.progress}%</span></div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="h-1.5 rounded-full bg-gradient-to-r from-[#1a6b2e] to-emerald-400" style={{width:`${stu.progress}%`}} /></div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1"><span className="text-[9px] font-bold text-[#1a6b2e]/60">Score</span><span className={`text-[9px] font-black ${cfg.col}`}>{stu.score}%</span></div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="h-1.5 rounded-full" style={{width:`${stu.score}%`,backgroundColor:stu.score>=80?'#10b981':stu.score>=60?'#f59e0b':'#ef4444'}} /></div>
                        </div>
                      </div>
                      {stu.status === 'needs-help' && (
                        <button className="mt-2 w-full py-1.5 rounded-lg bg-red-500 text-white text-[10px] font-black hover:bg-red-600 transition-colors">Send Support Message</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== EARNINGS ===== */}
      {activeTab === 'earnings' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-black text-[#0f3d1a]">Earnings & Revenue</h2>
            <p className="text-sm text-[#1a6b2e] font-semibold">Lifetime earnings and monthly breakdown</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label:'Total Lifetime', value:`PKR ${(TRAINER.totalRevenue/1000).toFixed(0)}k`, Icon:DollarSign, cls:'bg-emerald-100 text-emerald-600', sub:'Since joining' },
              { label:'This Month', value:`PKR ${(TRAINER.monthRevenue/1000).toFixed(0)}k`, Icon:TrendingUp, cls:'bg-sky-100 text-sky-600', sub:'+18% vs last month' },
              { label:'Pending Payout', value:'PKR 8,200', Icon:Clock, cls:'bg-amber-100 text-amber-600', sub:'Processing in 3 days' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl p-6 border border-[#1a6b2e]/10 shadow-sm">
                <div className={`inline-flex p-3 rounded-2xl mb-4 ${s.cls}`}><s.Icon className="w-6 h-6" /></div>
                <p className="text-2xl font-black text-[#0f3d1a]">{s.value}</p>
                <p className="text-xs font-bold text-[#1a6b2e]/70 mt-0.5">{s.label}</p>
                <p className="text-[10px] font-semibold text-[#1a6b2e]/50 mt-1">{s.sub}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#1a6b2e]/10 shadow-sm">
            <h3 className="font-black text-[#0f3d1a] text-base mb-6 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-[#1a6b2e]" /> Monthly Revenue (Last 6 Months)</h3>
            <div className="flex items-end gap-3 h-48">
              {EARNINGS_MONTHLY.map(e => {
                const pct = (e.amount/maxEarning)*100;
                return (
                  <div key={e.month} className="flex-1 flex flex-col items-center gap-2">
                    <p className="text-[10px] font-black text-[#0f3d1a]">PKR {(e.amount/1000).toFixed(0)}k</p>
                    <div className="w-full relative" style={{height:`${(pct/100)*160}px`}}>
                      <div className="absolute inset-x-0 bottom-0 rounded-t-xl bg-gradient-to-t from-[#0f3d1a] to-[#1a6b2e] h-full" />
                    </div>
                    <p className="text-[10px] font-black text-[#1a6b2e]/60">{e.month}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#1a6b2e]/10 shadow-sm">
            <h3 className="font-black text-[#0f3d1a] text-base mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-[#1a6b2e]" /> Revenue by Course</h3>
            <div className="space-y-4">
              {MY_COURSES.filter(c=>c.status==='active').sort((a,b)=>b.revenue-a.revenue).map(course => {
                const maxRev = Math.max(...MY_COURSES.map(c=>c.revenue));
                const pct = (course.revenue/maxRev)*100;
                return (
                  <div key={course.id} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0f3d1a] to-[#1a6b2e] flex items-center justify-center text-white font-black text-xs shrink-0">{course.thumbnail}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-black text-[#0f3d1a] truncate pr-2">{course.title}</p>
                        <p className="text-xs font-black text-[#0f3d1a] shrink-0">PKR {course.revenue.toLocaleString()}</p>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2"><div className="h-2 rounded-full bg-gradient-to-r from-[#1a6b2e] to-emerald-400" style={{width:`${pct}%`}} /></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#1a6b2e]/20 text-[#1a6b2e] text-xs font-bold hover:bg-[#c8e6c9]/30 transition-colors">
              <Download className="w-4 h-4" /> Download Earnings Report (PDF)
            </button>
          </div>
        </div>
      )}

      {/* ===== GRADE MODAL ===== */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-[#1a6b2e]/10">
            <div className="p-5 border-b border-[#1a6b2e]/10 flex items-center justify-between">
              <h3 className="font-black text-[#0f3d1a] text-base">Grade Submission</h3>
              <button onClick={() => setSelectedSubmission(null)} className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-[#c8e6c9]/40 rounded-xl p-4">
                <p className="text-xs font-black text-[#0f3d1a]">{selectedSubmission.student}</p>
                <p className="text-sm font-bold text-[#1a6b2e]">{selectedSubmission.task}</p>
                <p className="text-xs text-[#1a6b2e]/60 font-semibold">{selectedSubmission.course} · Submitted {selectedSubmission.submitted}</p>
              </div>
              <div>
                <label className="text-xs font-black text-[#0f3d1a] block mb-2">Score (0-100)</label>
                <input type="number" min={0} max={100} placeholder="Enter score..." value={gradeInput} onChange={e=>setGradeInput(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[#1a6b2e]/20 bg-[#c8e6c9]/10 text-[#0f3d1a] font-black text-lg focus:outline-none focus:ring-2 focus:ring-[#1a6b2e]/30" />
              </div>
              <div>
                <label className="text-xs font-black text-[#0f3d1a] block mb-2">Feedback (optional)</label>
                <textarea rows={3} placeholder="Write feedback for the student..." value={feedbackInput} onChange={e=>setFeedbackInput(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[#1a6b2e]/20 bg-[#c8e6c9]/10 text-[#0f3d1a] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1a6b2e]/30 resize-none" />
              </div>
              <div className="flex gap-3">
                <button onClick={handleGrade} disabled={!gradeInput} className="flex-1 py-3 rounded-xl bg-[#0f3d1a] text-white font-black text-sm hover:bg-[#1a6b2e] transition-colors disabled:opacity-40">Submit Grade</button>
                <button onClick={() => { setSubmissions(prev=>prev.map(s=>s.id===selectedSubmission!.id?{...s,status:'revision'}:s)); setSelectedSubmission(null); }} className="px-4 py-3 rounded-xl border border-red-200 text-red-600 font-black text-sm hover:bg-red-50 transition-colors">Request Revision</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== CREATE COURSE MODAL ===== */}
      {createCourseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-[#1a6b2e]/10">
            <div className="p-5 border-b border-[#1a6b2e]/10 flex items-center justify-between">
              <h3 className="font-black text-[#0f3d1a] text-base">Create New Course</h3>
              <button onClick={() => setCreateCourseOpen(false)} className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-black text-[#0f3d1a] block mb-1.5">Course Title</label>
                <input type="text" placeholder="e.g. TypeScript Advanced Patterns" className="w-full px-4 py-2.5 rounded-xl border border-[#1a6b2e]/20 text-[#0f3d1a] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b2e]/30" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black text-[#0f3d1a] block mb-1.5">Category</label>
                  <select className="w-full px-3 py-2.5 rounded-xl border border-[#1a6b2e]/20 text-[#0f3d1a] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b2e]/30">
                    <option>Web Dev</option><option>AI and Data</option><option>Cloud and DevOps</option><option>UI/UX Design</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black text-[#0f3d1a] block mb-1.5">Level</label>
                  <select className="w-full px-3 py-2.5 rounded-xl border border-[#1a6b2e]/20 text-[#0f3d1a] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b2e]/30">
                    <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-black text-[#0f3d1a] block mb-1.5">Description</label>
                <textarea rows={3} placeholder="What will students learn?" className="w-full px-4 py-2.5 rounded-xl border border-[#1a6b2e]/20 text-[#0f3d1a] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b2e]/30 resize-none" />
              </div>
              <button onClick={() => setCreateCourseOpen(false)} className="w-full py-3 rounded-xl bg-[#0f3d1a] text-white font-black text-sm hover:bg-[#1a6b2e] transition-colors">Create and Start Building</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== ANNOUNCEMENT MODAL ===== */}
      {announcementOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-[#1a6b2e]/10">
            <div className="p-5 border-b border-[#1a6b2e]/10 flex items-center justify-between">
              <h3 className="font-black text-[#0f3d1a] text-base flex items-center gap-2"><Bell className="w-5 h-5 text-[#1a6b2e]" /> Post Announcement</h3>
              <button onClick={() => setAnnouncementOpen(false)} className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200"><X className="w-4 h-4 text-[#0f3d1a]" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-black text-[#0f3d1a] block mb-1.5">Send To</label>
                <select className="w-full px-3 py-2.5 rounded-xl border border-[#1a6b2e]/20 text-[#0f3d1a] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b2e]/30">
                  <option>All My Students (342)</option>
                  <option>Next.js Course Students (128)</option>
                  <option>AI/ML Course Students (96)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-[#0f3d1a] block mb-1.5">Message</label>
                <textarea rows={4} placeholder="Write your announcement..." value={announcementText} onChange={e=>setAnnouncementText(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-[#1a6b2e]/20 text-[#0f3d1a] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b2e]/30 resize-none" />
              </div>
              <button onClick={() => { setAnnouncementOpen(false); setAnnouncementText(''); }} className="w-full py-3 rounded-xl bg-[#0f3d1a] text-white font-black text-sm hover:bg-[#1a6b2e] transition-colors flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Send Announcement
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
