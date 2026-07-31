'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Field, SelectInput, TextArea, TextInput } from '@/components/ui/Field';
import { coursesApi, meetingsApi, submissionsApi } from '@/lib/api';
import type { Course, LearningLevel, ReviewDecision } from '@/types/domain';
import {
  BookOpen,
  Plus,
  Upload,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Video,
  Users,
  Calendar,
  MessageSquare,
  BarChart3,
  Play,
  Send,
  TrendingUp,
  FileText,
  GraduationCap,
  ChevronRight,
  Sparkles,
  LayoutDashboard,
  User,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

/* ─── Enhanced Theme with 3D Depth Properties ─── */
const theme = {
  navy: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-400',
    gradient: 'from-blue-600/15 via-blue-500/10 to-blue-600/5',
    glow: 'shadow-blue-500/10',
    solid: 'bg-blue-600',
    solidHover: 'hover:bg-blue-500',
    subtle: 'bg-blue-500/5',
    subtleBorder: 'border-blue-500/10',
    subtleText: 'text-blue-400/60',
    depth: 'shadow-[0_8px_32px_-8px_rgba(59,130,246,0.2),0_4px_16px_-4px_rgba(59,130,246,0.1)]',
    glow3D: 'shadow-[0_0_40px_-8px_rgba(59,130,246,0.3),0_0_80px_-16px_rgba(59,130,246,0.15)]',
    reflection: 'bg-gradient-to-br from-blue-400/5 via-transparent to-blue-600/10',
  },
  orange: {
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    text: 'text-sky-400',
    gradient: 'from-orange-600/15 via-sky-500/10 to-orange-600/5',
    glow: 'shadow-sky-500/10',
    solid: 'bg-orange-600',
    solidHover: 'hover:bg-sky-500',
    subtle: 'bg-sky-500/5',
    subtleBorder: 'border-sky-500/10',
    subtleText: 'text-sky-400/60',
    depth: 'shadow-[0_8px_32px_-8px_rgba(249,115,22,0.2),0_4px_16px_-4px_rgba(249,115,22,0.1)]',
    glow3D: 'shadow-[0_0_40px_-8px_rgba(249,115,22,0.3),0_0_80px_-16px_rgba(249,115,22,0.15)]',
    reflection: 'bg-gradient-to-br from-sky-400/5 via-transparent to-orange-600/10',
  },
} as const;

type ThemeKey = keyof typeof theme;

const card3DClass =
  'transition-all duration-500 ease-out transform-gpu perspective-1000 hover:rotate-y-1 hover:rotate-x-0.5 hover:shadow-[0_20px_60px_-12px_rgba(26, 107, 46, 0.1),0_10px_40px_-8px_rgba(26, 107, 46, 0.1)] hover:-translate-y-2 hover:scale-[1.02]';
const glassEffect =
  'backdrop-blur-xl bg-gradient-to-br from-gray-800/40 to-gray-900/60 border border-white/[0.08] shadow-[0_8px_32px_-8px_rgba(26, 107, 46, 0.1)]';

function SectionHeader({
  icon: Icon,
  themeKey,
  title,
  caption,
  badge,
}: {
  icon: React.ElementType;
  themeKey: ThemeKey;
  title: string;
  caption: string;
  badge?: React.ReactNode;
}) {
  const t = theme[themeKey];
  return (
    <div className="flex items-start sm:items-center justify-between gap-4 mb-7 group">
      <div className="flex items-center gap-3.5">
        <div
          className={`w-12 h-12 rounded-2xl ${t.bg} border ${t.border} flex items-center justify-center flex-shrink-0 ${t.depth} ${t.reflection} transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-[0_8px_32px_-8px_rgba(26, 107, 46, 0.1),0_0_20px_-4px_rgba(59,130,246,0.2)] relative overflow-hidden`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent rounded-2xl" />
          <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/[0.02] to-transparent rounded-2xl" />
          <Icon
            className={`w-5 h-5 ${t.text} relative z-10 drop-shadow-lg transition-transform duration-500 group-hover:scale-110`}
          />
        </div>
        <div>
          <h2 className="text-[17px] font-semibold text-[#0f3d1a] leading-snug tracking-[-0.01em] relative">
            {title}
            <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-blue-400/0 via-blue-400/50 to-blue-400/0 group-hover:w-full transition-all duration-700 ease-out" />
          </h2>
          <p className="text-[13px] text-[#7dab52] mt-1 leading-relaxed font-normal">{caption}</p>
        </div>
      </div>
      {badge && <div className="animate-[fadeIn_0.5s_ease-out_forwards]">{badge}</div>}
    </div>
  );
}

function StatCard({
  icon: Icon,
  themeKey,
  label,
  value,
  delay,
}: {
  icon: React.ElementType;
  themeKey: ThemeKey;
  label: string;
  value: string | number;
  delay: number;
}) {
  const t = theme[themeKey];
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${t.border} bg-gradient-to-br ${t.gradient} p-6 cursor-default ${t.depth} ${t.reflection} ${card3DClass} transform-gpu animate-[staggeredFadeIn_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0 before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-tl before:from-white/[0.04] before:to-transparent before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100`}
      style={{ animationDelay: `${delay}ms`, transformStyle: 'preserve-3d' }}
    >
      <div
        className={`absolute -right-8 -top-8 w-32 h-32 rounded-full ${t.bg} opacity-30 transition-all duration-700 group-hover:opacity-50 blur-3xl group-hover:scale-150`}
      />
      <div
        className={`absolute -left-4 -bottom-4 w-24 h-24 rounded-full ${t.bg} opacity-20 transition-all duration-700 group-hover:opacity-40 blur-2xl group-hover:scale-125`}
      />
      <div className="absolute top-1/2 left-1/2 w-40 h-40 rounded-full bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 blur-3xl -translate-x-1/2 -translate-y-1/2 transition-all duration-700" />

      <div className="relative flex items-start justify-between">
        <div className="relative z-10">
          <p className="text-[11px] font-medium text-[#7dab52] uppercase tracking-wider mb-3">{label}</p>
          <div className="relative">
            <p className="text-[32px] font-bold text-[#0f3d1a] tracking-tight leading-none tabular-nums bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
              {value}
            </p>
            <div className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        </div>
        <div
          className={`w-12 h-12 rounded-2xl ${t.bg} border ${t.border} flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-[0_4px_16px_-2px_rgba(26, 107, 46, 0.1)] group-hover:shadow-[0_8px_24px_-4px_rgba(26, 107, 46, 0.1)] relative overflow-hidden`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent rounded-2xl" />
          <Icon className={`w-5 h-5 ${t.text} relative z-10 transition-transform duration-500 group-hover:scale-110`} />
        </div>
      </div>

      <div className="absolute top-0 left-2 right-2 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
    </div>
  );
}

function FormSection({
  id,
  icon: Icon,
  themeKey,
  title,
  caption,
  children,
}: {
  id?: string;
  icon: React.ElementType;
  themeKey: ThemeKey;
  title: string;
  caption: string;
  children: React.ReactNode;
}) {
  const t = theme[themeKey];
  return (
    <div
      id={id}
      className={`relative rounded-2xl ${glassEffect} p-6 sm:p-7 overflow-hidden ${card3DClass} before:absolute before:top-0 before:left-8 before:right-8 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/[0.12] before:to-transparent after:absolute after:bottom-0 after:left-8 after:right-8 after:h-px after:bg-gradient-to-r after:from-transparent after:via-white/[0.04] after:to-transparent transform-gpu animate-[scaleIn_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div
        className={`absolute -top-20 -right-20 w-60 h-60 rounded-full ${t.bg} opacity-20 blur-3xl transition-all duration-700 group-hover:opacity-30 group-hover:scale-110`}
      />
      <div
        className={`absolute -bottom-20 -left-20 w-60 h-60 rounded-full ${t.bg} opacity-10 blur-3xl transition-all duration-700 group-hover:opacity-20 group-hover:scale-110`}
      />

      <SectionHeader icon={Icon} themeKey={themeKey} title={title} caption={caption} />
      <div className="relative z-10">{children}</div>

      <div className="absolute top-0 left-0 w-full h-full rounded-2xl border border-white/[0.06] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
    </div>
  );
}

export function TrainerDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const [courses, setCourses] = useState<Course[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);

  const [courseForm, setCourseForm] = useState({ title: '', description: '', level: 'university' as LearningLevel });
  const [videoForm, setVideoForm] = useState({ courseId: '', title: '', position: 1, videoUrl: '', summary: '' });
  const [meetingForm, setMeetingForm] = useState({
    courseId: '',
    startsAt: '',
    provider: 'zoom' as 'zoom' | 'google_meet',
    meetingUrl: '',
    agenda: '',
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'info'>('success');

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const hasLoadedRef = useRef(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes staggeredFadeIn {
        from {
          opacity: 0;
          transform: translateY(20px) scale(0.95) rotateX(2deg);
          filter: blur(8px);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1) rotateX(0);
          filter: blur(0);
        }
      }

      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.9) translateZ(-20px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateZ(0);
        }
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes slideInRight {
        from { opacity: 0; transform: translateX(100px) scale(0.9); }
        to { opacity: 1; transform: translateX(0) scale(1); }
      }

      @keyframes pulse-subtle {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
      }

      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      .parallax-card {
        transition: transform 0.1s ease-out, box-shadow 0.3s ease;
        transform-style: preserve-3d;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dashboardRef.current) return;
      const cards = dashboardRef.current.querySelectorAll('.parallax-card');
      cards.forEach((card) => {
        const rect = (card as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        (card as HTMLElement).style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px) scale3d(1.02, 1.02, 1.02)`;
      });
    };

    const handleMouseLeave = () => {
      if (!dashboardRef.current) return;
      const cards = dashboardRef.current.querySelectorAll('.parallax-card');
      cards.forEach((card) => {
        (card as HTMLElement).style.transform = '';
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  async function load() {
    const [courseResult, submissionResult] = await Promise.allSettled([coursesApi.list(), submissionsApi.trainerList()]);
    setCourses(courseResult.status === 'fulfilled' ? courseResult.value : []);
    setSubmissions(submissionResult.status === 'fulfilled' ? submissionResult.value : []);
    setIsLoading(false);
  }

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    const timer = setTimeout(() => {
      load().catch((error: any) => {
        setMessage(error.message);
        setMessageType('info');
        setIsLoading(false);
      });
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(''), 5000);
    return () => clearTimeout(timer);
  }, [message]);

  async function createCourse(event: FormEvent) {
    event.preventDefault();
    try {
      const created = await coursesApi.create(courseForm);
      setCourseForm({ title: '', description: '', level: 'university' });
      setMessageType('success');
      setMessage(`Course created: ${created.title}`);
      await load();
    } catch (error: any) {
      setMessageType('info');
      setMessage(error.message);
    }
  }

  async function addVideo(event: FormEvent) {
    event.preventDefault();
    try {
      await coursesApi.addVideo(videoForm.courseId, {
        title: videoForm.title,
        position: Number(videoForm.position),
        videoUrl: videoForm.videoUrl,
        summary: videoForm.summary,
      });
      setMessageType('success');
      setMessage('Video added. Add MCQ, quiz, summary, and homework sets through the assessment builder payload.');
      setVideoForm({ courseId: '', title: '', position: 1, videoUrl: '', summary: '' });
      await load();
    } catch (error: any) {
      setMessageType('info');
      setMessage(error.message);
    }
  }

  async function reviewSubmission(id: string, decision: ReviewDecision) {
    await submissionsApi.review(
      id,
      decision,
      decision === 'fail' ? 'Rewatch the video and retry a different test set.' : 'Reviewed by trainer.'
    );
    setMessageType('success');
    setMessage(`Submission marked as ${decision}.`);
    await load();
  }

  async function createMeeting(event: FormEvent) {
    event.preventDefault();
    try {
      await meetingsApi.create(meetingForm);
      setMeetingForm({ courseId: '', startsAt: '', provider: 'zoom', meetingUrl: '', agenda: '' });
      setMessageType('success');
      setMessage('Meeting scheduled.');
    } catch (error: any) {
      setMessageType('info');
      setMessage(error.message);
    }
  }

  const pendingCount = submissions.filter((s) => !s.reviewed).length;

  return (
    <div ref={dashboardRef} className="relative">
      {/* 3D BACKGROUND PARTICLES */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-[float3D_8s_ease-in-out_infinite]" />
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl animate-[float3D_10s_ease-in-out_infinite_1s]" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl animate-[float3D_12s_ease-in-out_infinite_2s]" />
      </div>

      {message && (
        <div
          className={`fixed top-20 right-6 z-50 max-w-sm w-full rounded-2xl border p-5 flex items-start gap-3 backdrop-blur-2xl transition-all duration-500 animate-[slideInRight_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards] shadow-[0_20px_60px_-12px_rgba(26, 107, 46, 0.1),0_8px_24px_-8px_rgba(26, 107, 46, 0.1)] ${messageType === 'success' ? 'border-blue-500/25 bg-gray-900/95' : 'border-sky-500/25 bg-gray-900/95'
            } transform-gpu hover:scale-105 hover:rotate-y-1`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div
            className={`absolute inset-0 rounded-2xl ${messageType === 'success' ? 'bg-blue-500/5' : 'bg-sky-500/5'} blur-xl`}
          />
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
          <CheckCircle2
            className={`w-5 h-5 flex-shrink-0 mt-0.5 relative z-10 ${messageType === 'success' ? 'text-blue-400' : 'text-sky-400'}`}
          />
          <p
            className={`text-sm flex-1 leading-relaxed relative z-10 ${messageType === 'success' ? 'text-blue-200' : 'text-orange-200'
              }`}
          >
            {message}
          </p>
          <button
            onClick={() => setMessage('')}
            className="text-[#7dab52] hover:text-[#1a6b2e] transition-colors flex-shrink-0 mt-0.5 active:scale-90 relative z-10 hover:rotate-90 transition-transform duration-300"
            aria-label="Dismiss"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}
 
      <header className="animate-[fadeIn_0.7s_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5E6F58]/20 to-sky-500/10 border border-[#5E6F58]/20 flex items-center justify-center flex-shrink-0 shadow-[0_8px_32px_-8px_rgba(240,89,31,0.3),0_4px_16px_-4px_rgba(240,89,31,0.2)] transition-all duration-500 group hover:shadow-[0_12px_40px_-8px_rgba(240,89,31,0.4),0_0_20px_-4px_rgba(240,89,31,0.3)] hover:scale-110 hover:rotate-6"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent rounded-2xl" />
              <GraduationCap className="w-7 h-7 text-[#d94d19] relative z-10 group-hover:scale-110 transition-transform duration-500 drop-shadow-lg" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-blue-500 border-2 border-[#020617] shadow-[0_0_12px_rgba(59,130,246,0.6)] animate-[pulse-subtle_2s_ease-in-out_infinite]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#0f3d1a] tracking-tight">Trainer Dashboard</h1>
              <p className="text-xs text-[#1a6b2e] mt-1.5">Welcome back, {user?.name || 'Trainer'}! Here is your current overview.</p>
            </div>
          </div>
        </div>
      </header>

      {/* QUICK STATS WITH 3D CARDS */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8" aria-label="Quick statistics">
        <StatCard icon={BookOpen} themeKey="navy" label="Total Courses" value={courses.length} delay={0} />
        <StatCard icon={MessageSquare} themeKey="orange" label="Submissions" value={submissions.length} delay={80} />
        <StatCard icon={AlertCircle} themeKey="orange" label="Awaiting Review" value={pendingCount} delay={160} />
        <StatCard icon={Users} themeKey="navy" label="Learners Active" value={24} delay={240} />
      </section>

      {/* CREATE COURSE + ADD VIDEO WITH 3D PARALLAX */}
      <section className="grid gap-6 lg:grid-cols-2 mb-8" aria-label="Course and video creation">
        <FormSection
          id="create-course"
          icon={Plus}
          themeKey="navy"
          title="Create New Course"
          caption="Define course details and learning level for admin approval."
        >
          <form className="space-y-5" onSubmit={createCourse}>
            <Field label="Course Title">
              <TextInput
                value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                placeholder="Enter course title"
                required
              />
            </Field>
            <Field label="Learning Level">
              <SelectInput
                value={courseForm.level}
                onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value as LearningLevel })}
              >
                <option value="school">School</option>
                <option value="college">College</option>
                <option value="university">University</option>
                <option value="individual">Individual</option>
              </SelectInput>
            </Field>
            <Field label="Description">
              <TextArea
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                placeholder="Describe your course, learning objectives, and target audience..."
                required
              />
            </Field>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-[#0f3d1a] rounded-xl h-12 font-semibold transition-all duration-500 border-0 shadow-[0_8px_24px_-4px_rgba(234,88,12,0.4),0_4px_12px_-2px_rgba(234,88,12,0.3)] hover:shadow-[0_12px_32px_-6px_rgba(234,88,12,0.5),0_8px_20px_-4px_rgba(234,88,12,0.4)] hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-[0.98] active:shadow-[0_2px_8px_-2px_rgba(234,88,12,0.3)] relative overflow-hidden group transform-gpu"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <span className="relative z-10 flex items-center justify-center">
                <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-500" />
                Create Course
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <div className="absolute inset-0 rounded-xl border border-white/[0.08]" />
            </Button>
          </form>
        </FormSection>

        <FormSection
          id="upload-video"
          icon={Upload}
          themeKey="orange"
          title="Add Video Lesson"
          caption="Attach video URLs and content summaries for learners."
        >
          <form className="space-y-5" onSubmit={addVideo}>
            <Field label="Select Course">
              <SelectInput
                value={videoForm.courseId}
                onChange={(e) => setVideoForm({ ...videoForm, courseId: e.target.value })}
                required
              >
                <option value="" disabled={courses.length > 0}>
                  Choose a course...
                </option>
                {courses.length === 0 ? (
                  <option value="" disabled>
                    No active courses available
                  </option>
                ) : (
                  courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))
                )}
              </SelectInput>
            </Field>
            <Field label="Video Title">
              <TextInput
                value={videoForm.title}
                onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                placeholder="Lesson topic"
                required
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Position #">
                <TextInput
                  type="number"
                  min={1}
                  value={videoForm.position}
                  onChange={(e) => setVideoForm({ ...videoForm, position: Number(e.target.value) })}
                  required
                />
              </Field>
              <Field label="Duration">
                <TextInput type="text" placeholder="e.g., 45 min" />
              </Field>
            </div>
            <Field label="Video URL">
              <TextInput
                value={videoForm.videoUrl}
                onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                placeholder="YouTube or video platform URL"
                required
              />
            </Field>
            <Field label="Summary">
              <TextArea
                value={videoForm.summary}
                onChange={(e) => setVideoForm({ ...videoForm, summary: e.target.value })}
                placeholder="Key points and learning objectives for this lesson..."
              />
            </Field>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-[#0f3d1a] rounded-xl h-12 font-semibold transition-all duration-500 border-0 shadow-[0_8px_24px_-4px_rgba(234,88,12,0.4),0_4px_12px_-2px_rgba(234,88,12,0.3)] hover:shadow-[0_12px_32px_-6px_rgba(234,88,12,0.5),0_8px_20px_-4px_rgba(234,88,12,0.4)] hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-[0.98] active:shadow-[0_2px_8px_-2px_rgba(234,88,12,0.3)] relative overflow-hidden group transform-gpu"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <span className="relative z-10 flex items-center justify-center">
                <Upload className="w-5 h-5 mr-2 group-hover:-translate-y-0.5 transition-transform duration-500" />
                Add Video
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <div className="absolute inset-0 rounded-xl border border-white/[0.08]" />
            </Button>
          </form>
        </FormSection>
      </section>

      {/* MY COURSES WITH 3D CARDS AND PARALLAX EFFECT */}
      <section
        id="my-courses"
        className={`relative rounded-2xl ${glassEffect} p-6 sm:p-7 overflow-hidden mb-8 ${card3DClass} parallax-card before:absolute before:top-0 before:left-8 before:right-8 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/[0.12] before:to-transparent after:absolute after:bottom-0 after:left-8 after:right-8 after:h-px after:bg-gradient-to-r after:from-transparent after:via-white/[0.04] after:to-transparent transform-gpu animate-[scaleIn_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl transition-all duration-700 group-hover:scale-110" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-blue-400/5 blur-3xl transition-all duration-700 group-hover:scale-110" />

        <SectionHeader
          icon={BookOpen}
          themeKey="navy"
          title="My Courses"
          caption="Manage courses awaiting or submitted for admin approval."
          badge={
            <span className="text-xs text-[#7dab52] font-medium bg-gray-800/60 px-3 py-1.5 rounded-lg border border-gray-700/50 backdrop-blur-xl shadow-[0_4px_12px_rgba(26, 107, 46, 0.1)]">
              {courses.length} course{courses.length !== 1 ? 's' : ''}
            </span>
          }
        />

        {courses.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, index) => {
              const status = (course as any).status || 'draft';
              const statusStyles: Record<string, { bg: string; text: string; border: string; dot: string; icon: any }> = {
                approved: {
                  bg: 'bg-blue-500/12',
                  text: 'text-blue-300',
                  border: 'border-blue-500/25',
                  dot: 'bg-blue-400',
                  icon: CheckCircle2,
                },
                rejected: {
                  bg: 'bg-sky-500/12',
                  text: 'text-orange-300',
                  border: 'border-sky-500/25',
                  dot: 'bg-sky-400',
                  icon: XCircle,
                },
                draft: {
                  bg: 'bg-sky-500/8',
                  text: 'text-sky-400/70',
                  border: 'border-sky-500/15',
                  dot: 'bg-sky-400/60',
                  icon: AlertCircle,
                },
              };
              const s = statusStyles[status] || statusStyles.draft;

              return (
                <div
                  key={course.id}
                  className={`group/card rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900/60 to-gray-900/40 backdrop-blur-sm overflow-hidden transition-all duration-500 ease-out parallax-card shadow-[0_4px_16px_rgba(26, 107, 46, 0.1),0_2px_8px_rgba(26, 107, 46, 0.1)] hover:shadow-[0_20px_60px_-12px_rgba(26, 107, 46, 0.1),0_10px_40px_-8px_rgba(26, 107, 46, 0.1)] hover:-translate-y-3 hover:scale-[1.03] hover:rotate-y-1 transform-gpu animate-[staggeredFadeIn_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0`}
                  style={{ animationDelay: `${index * 100}ms`, transformStyle: 'preserve-3d' }}
                >
                  <div className="relative h-28 bg-gradient-to-br from-blue-600/10 via-gray-800/80 to-gray-900/80 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.08),transparent_70%)] group-hover/card:opacity-90 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-tl from-blue-500/5 to-transparent" />

                    <div className="absolute top-4 left-4 grid grid-cols-4 gap-1.5 opacity-20">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-1 h-1 rounded-full bg-blue-400 group-hover/card:animate-pulse"
                          style={{ animationDelay: `${i * 50}ms` }}
                        />
                      ))}
                    </div>

                    <div className="absolute top-3 right-3 z-10">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider ${s.bg} ${s.text} border ${s.border} backdrop-blur-md shadow-[0_4px_12px_rgba(26, 107, 46, 0.1)] transition-all duration-300 group-hover/card:shadow-[0_8px_20px_rgba(26, 107, 46, 0.1)] group-hover/card:-translate-y-0.5`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${s.dot} ${status === 'draft' ? 'animate-[pulse_1.5s_ease-in-out_infinite]' : ''} shadow-[0_0_6px_rgba(59,130,246,0.5)]`}
                        />
                        {status}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3">
                      <div className="w-12 h-12 rounded-2xl bg-gray-900/60 border border-gray-700/30 flex items-center justify-center backdrop-blur-sm shadow-[0_4px_16px_-2px_rgba(26, 107, 46, 0.1)] group-hover/card:border-blue-500/30 group-hover/card:shadow-[0_8px_24px_-4px_rgba(26, 107, 46, 0.1)] transition-all duration-500 group-hover/card:scale-110 group-hover/card:rotate-6">
                        <BookOpen className="w-5 h-5 text-blue-400 group-hover/card:scale-110 transition-transform duration-500" />
                      </div>
                    </div>

                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/[0.04] to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                  </div>

                  <div className="p-5 relative">
                    <h3 className="font-semibold text-[#0f3d1a] text-[15px] mb-1.5 line-clamp-2 leading-snug group-hover/card:text-blue-300 transition-colors duration-500">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mb-3">
                      <GraduationCap className="w-3.5 h-3.5 text-gray-600" />
                      <p className="text-[12px] text-[#7dab52] capitalize">{course.level}</p>
                      <span className="w-1 h-1 rounded-full bg-gradient-to-r from-blue-400 to-sky-400 mx-0.5" />
                      <Video className="w-3.5 h-3.5 text-gray-600" />
                      <span className="text-[12px] text-[#7dab52]">Lessons</span>
                    </div>
                    <p className="text-[13px] text-[#7dab52] mb-5 line-clamp-2 leading-relaxed">{course.description}</p>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          className="flex-1 text-[12px] h-10 rounded-lg border border-gray-700/50 hover:border-blue-500/40 hover:bg-blue-500/8 hover:text-blue-300 transition-all duration-500 group/btn backdrop-blur-sm shadow-[0_4px_12px_rgba(26, 107, 46, 0.1)] hover:shadow-[0_8px_20px_-4px_rgba(59,130,246,0.3)] hover:-translate-y-0.5 active:scale-[0.98]"
                          onClick={() => router.push(`/trainer/courses/${course.id}`)}
                        >
                          <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                          Overview
                        </Button>
                        <Button
                          variant="ghost"
                          className="flex-1 text-[12px] h-10 rounded-lg border border-gray-700/50 hover:border-sky-500/40 hover:bg-sky-500/8 hover:text-orange-300 transition-all duration-500 group/btn backdrop-blur-sm shadow-[0_4px_12px_rgba(26, 107, 46, 0.1)] hover:shadow-[0_8px_20px_-4px_rgba(234,88,12,0.3)] hover:-translate-y-0.5 active:scale-[0.98]"
                          onClick={() => router.push(`/trainer/courses/${course.id}/videos`)}
                        >
                          <Video className="w-3.5 h-3.5 mr-1.5" />
                          Videos
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        className="w-full text-[12px] h-10 rounded-lg border border-gray-700/50 hover:border-blue-500/40 hover:bg-blue-500/8 hover:text-blue-300 transition-all duration-500 group/btn backdrop-blur-sm shadow-[0_4px_12px_rgba(26, 107, 46, 0.1)] hover:shadow-[0_8px_20px_-4px_rgba(59,130,246,0.3)] hover:-translate-y-0.5 active:scale-[0.98]"
                        onClick={() => coursesApi.submitReview(course.id).then(load)}
                      >
                        <Send className="w-3.5 h-3.5 mr-1.5 group-hover/btn:-translate-y-0.5 transition-transform duration-500" />
                        {status === 'approved' ? 'Submit Update' : 'Submit for Review'}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState title="No courses yet" detail="Create your first course to start teaching on NextGen-LMS." />
        )}
      </section>

      {/* STUDENT SUBMISSIONS WITH 3D EFFECTS */}
      <section
        id="submissions"
        className={`relative rounded-2xl ${glassEffect} p-6 sm:p-7 overflow-hidden mb-8 ${card3DClass} parallax-card before:absolute before:top-0 before:left-8 before:right-8 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/[0.12] before:to-transparent after:absolute after:bottom-0 after:left-8 after:right-8 after:h-px after:bg-gradient-to-r after:from-transparent after:via-white/[0.04] after:to-transparent transform-gpu animate-[scaleIn_0.7s_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl transition-all duration-700 group-hover:scale-110" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-sky-400/5 blur-3xl transition-all duration-700 group-hover:scale-110" />

        <SectionHeader
          icon={FileText}
          themeKey="orange"
          title="Student Submissions"
          caption="Review homework and practical assignments from your learners."
          badge={
            pendingCount > 0 ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium bg-sky-500/15 text-orange-300 border border-sky-500/25 backdrop-blur-md shadow-[0_4px_16px_rgba(249,115,22,0.3)] animate-[pulse-subtle_2s_ease-in-out_infinite]">
                <span className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(249,115,22,0.6)] animate-pulse" />
                {pendingCount} Pending
              </span>
            ) : submissions.length > 0 ? (
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-[12px] font-medium bg-blue-500/15 text-blue-300 border border-blue-500/25 backdrop-blur-md shadow-[0_4px_16px_rgba(59,130,246,0.3)]">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                All Reviewed
              </span>
            ) : undefined
          }
        />

        {submissions.length > 0 ? (
          <div className="space-y-4">
            {submissions.map((submission, index) => {
              const learnerInitial = submission.enrollment?.learner?.name?.charAt(0)?.toUpperCase() || 'L';
              const learnerName = submission.enrollment?.learner?.name ?? 'Learner';
              const videoTitle = submission.video?.title ?? 'Homework Submission';
              const submissionContent = submission.textAnswer ?? submission.fileUrl ?? 'No submission content';
              const isReviewed = submission.reviewed;

              const avatarPalettes = [
                { gradient: 'from-sky-500/25 to-orange-600/10', border: 'border-sky-500/20', text: 'text-orange-300' },
                { gradient: 'from-blue-500/25 to-blue-600/10', border: 'border-blue-500/20', text: 'text-blue-300' },
                { gradient: 'from-blue-600/25 to-blue-700/10', border: 'border-blue-600/20', text: 'text-blue-200' },
                { gradient: 'from-orange-600/25 to-orange-700/10', border: 'border-orange-600/20', text: 'text-orange-200' },
                { gradient: 'from-blue-500/30 to-blue-500/10', border: 'border-blue-400/20', text: 'text-blue-300' },
              ];
              const palette = avatarPalettes[submission.id.charCodeAt(1) % avatarPalettes.length];

              return (
                <div
                  key={submission.id}
                  className={`rounded-xl border p-5 transition-all duration-500 ease-out animate-[staggeredFadeIn_0.6s_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0 parallax-card ${isReviewed
                      ? 'border-gray-800/60 bg-gray-900/40 backdrop-blur-sm shadow-[0_4px_16px_rgba(26, 107, 46, 0.1)]'
                      : 'border-gray-800 bg-gray-900/70 backdrop-blur-sm shadow-[0_8px_24px_rgba(26, 107, 46, 0.1)] hover:shadow-[0_20px_60px_-12px_rgba(26, 107, 46, 0.1)] hover:-translate-y-2 hover:scale-[1.02] hover:rotate-y-0.5'
                    } transform-gpu`}
                  style={{ animationDelay: `${index * 120}ms`, transformStyle: 'preserve-3d' }}
                >
                  <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-12 h-12 rounded-full bg-gradient-to-br ${palette.gradient} flex items-center justify-center text-[14px] font-semibold ${palette.text} border ${palette.border} flex-shrink-0 shadow-[0_4px_16px_-2px_rgba(26, 107, 46, 0.1)] transition-all duration-500 hover:scale-110 hover:rotate-6 relative overflow-hidden group`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent rounded-full" />
                          <span className="relative z-10">{learnerInitial}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[#0f3d1a] text-[14px] leading-snug">{learnerName}</p>
                          <p className="text-[12px] text-[#7dab52] mt-0.5 truncate">{videoTitle}</p>
                        </div>

                        {!isReviewed && (
                          <span className="ml-auto flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-sky-500/15 text-orange-300 border border-sky-500/25 uppercase tracking-wider backdrop-blur-md shadow-[0_4px_12px_rgba(249,115,22,0.3)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-[pulse_1.5s_ease-in-out_infinite] shadow-[0_0_6px_rgba(249,115,22,0.6)]" />
                            New
                          </span>
                        )}

                        {isReviewed && submission.reviewDecision && (
                          <span
                            className={`ml-auto flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md shadow-[0_4px_12px_rgba(26, 107, 46, 0.1)] ${submission.reviewDecision === 'pass'
                                ? 'bg-blue-500/12 text-blue-300 border border-blue-500/20'
                                : submission.reviewDecision === 'fail'
                                  ? 'bg-sky-500/12 text-orange-300 border border-sky-500/20'
                                  : 'bg-sky-500/8 text-sky-400/70 border border-sky-500/10'
                              }`}
                          >
                            {submission.reviewDecision === 'pass' ? <ThumbsUp className="w-3 h-3" /> : <ThumbsDown className="w-3 h-3" />}
                            {submission.reviewDecision}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 p-4 rounded-lg bg-gray-800/50 border border-gray-700/40 backdrop-blur-sm shadow-[inset_0_2px_4px_rgba(26, 107, 46, 0.1)] transition-all duration-500 hover:bg-gray-800/70 hover:border-gray-700/60 hover:shadow-[inset_0_2px_8px_rgba(26, 107, 46, 0.1)] group-hover:translate-z-2">
                        <p className="text-[13px] text-[#1a6b2e] line-clamp-3 leading-relaxed">{submissionContent}</p>
                      </div>
                    </div>

                    <div className="lg:flex-shrink-0 flex lg:flex-col gap-2 lg:gap-2.5">
                      <Button
                        onClick={() => reviewSubmission(submission.id, 'pass')}
                        className="flex-1 lg:flex-none bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-[#0f3d1a] text-[12px] h-10 rounded-lg font-semibold transition-all duration-500 border-0 shadow-[0_4px_12px_-2px_rgba(37,99,235,0.4),0_2px_6px_-1px_rgba(37,99,235,0.3)] hover:shadow-[0_8px_20px_-4px_rgba(37,99,235,0.5),0_4px_12px_-2px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-[0.98] active:shadow-[0_2px_8px_-2px_rgba(37,99,235,0.3)] transform-gpu"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                        Pass
                      </Button>
                      <Button
                        onClick={() => reviewSubmission(submission.id, 'fail')}
                        variant="ghost"
                        className="flex-1 lg:flex-none border border-sky-500/25 text-sky-400 hover:bg-sky-500/10 hover:border-sky-500/40 text-[12px] h-10 rounded-lg font-semibold transition-all duration-500 shadow-[0_4px_12px_rgba(26, 107, 46, 0.1)] hover:shadow-[0_8px_20px_-4px_rgba(234,88,12,0.4)] hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1.5" />
                        Fail
                      </Button>
                      <Button
                        onClick={() => reviewSubmission(submission.id, 'improve')}
                        variant="ghost"
                        className="flex-1 lg:flex-none border border-blue-500/20 text-blue-400 hover:bg-blue-500/8 hover:border-blue-500/30 text-[12px] h-10 rounded-lg font-semibold transition-all duration-500 shadow-[0_4px_12px_rgba(26, 107, 46, 0.1)] hover:shadow-[0_8px_20px_-4px_rgba(59,130,246,0.3)] hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm"
                      >
                        <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
                        Improve
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No submissions yet"
            detail="Homework submissions from learners will appear here for your review."
          />
        )}
      </section>

      {/* MEETINGS & REPORTS WITH 3D ANIMATIONS */}
      <section className="grid gap-6 lg:grid-cols-2 mb-8" aria-label="Meetings and reports">
        <FormSection
          id="meetings"
          icon={Calendar}
          themeKey="orange"
          title="Schedule Live Session"
          caption="Create Q&A sessions via Zoom or Google Meet."
        >
          <form className="space-y-5" onSubmit={createMeeting}>
            <Field label="Select Course">
              <SelectInput
                value={meetingForm.courseId}
                onChange={(e) => setMeetingForm({ ...meetingForm, courseId: e.target.value })}
                required
              >
                <option value="" disabled={courses.length > 0}>
                  Choose a course...
                </option>
                {courses.length === 0 ? (
                  <option value="" disabled>
                    No active courses available
                  </option>
                ) : (
                  courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))
                )}
              </SelectInput>
            </Field>

            <Field label="Session Date & Time">
              <TextInput
                type="datetime-local"
                value={meetingForm.startsAt}
                onChange={(e) => setMeetingForm({ ...meetingForm, startsAt: e.target.value })}
                required
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Platform">
                <SelectInput
                  value={meetingForm.provider}
                  onChange={(e) => setMeetingForm({ ...meetingForm, provider: e.target.value as 'zoom' | 'google_meet' })}
                >
                  <option value="zoom">Zoom</option>
                  <option value="google_meet">Google Meet</option>
                </SelectInput>
              </Field>

              <Field label="Meeting URL">
                <TextInput
                  value={meetingForm.meetingUrl}
                  onChange={(e) => setMeetingForm({ ...meetingForm, meetingUrl: e.target.value })}
                  placeholder="https://..."
                  required
                />
              </Field>
            </div>

            <Field label="Session Agenda">
              <TextArea
                value={meetingForm.agenda}
                onChange={(e) => setMeetingForm({ ...meetingForm, agenda: e.target.value })}
                placeholder="Topics to discuss in this session..."
              />
            </Field>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-[#0f3d1a] rounded-xl h-12 font-semibold transition-all duration-500 border-0 shadow-[0_8px_24px_-4px_rgba(234,88,12,0.4),0_4px_12px_-2px_rgba(234,88,12,0.3)] hover:shadow-[0_12px_32px_-6px_rgba(234,88,12,0.5),0_8px_20px_-4px_rgba(234,88,12,0.4)] hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-[0.98] active:shadow-[0_2px_8px_-2px_rgba(234,88,12,0.3)] relative overflow-hidden group transform-gpu"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <span className="relative z-10 flex items-center justify-center">
                <Calendar className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-500" />
                Schedule Session
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <div className="absolute inset-0 rounded-xl border border-white/[0.08]" />
            </Button>
          </form>
        </FormSection>

        <FormSection
          id="reports"
          icon={BarChart3}
          themeKey="orange"
          title="Analytics & Reports"
          caption="Generate progress reports for your courses and learners."
        >
          <div className="space-y-5">
            <div
              className={`rounded-xl bg-gradient-to-br from-sky-500/8 to-orange-600/5 border border-sky-500/20 p-5 backdrop-blur-sm shadow-[0_4px_16px_rgba(26, 107, 46, 0.1),inset_0_1px_0_rgba(255,255,255,0.02)] transition-all duration-500 hover:bg-sky-500/12 hover:border-sky-500/30 hover:shadow-[0_8px_24px_-4px_rgba(249,115,22,0.3)] ${card3DClass}`}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="relative">
                  <Sparkles className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5 animate-[pulse-subtle_2s_ease-in-out_infinite]" />
                  <div className="absolute inset-0 bg-sky-400/20 blur-xl animate-pulse" />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-orange-200 mb-1.5">Report Generation</p>
                  <p className="text-[13px] text-orange-300/70 leading-relaxed">Generate weekly or biweekly progress reports through the API service.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mt-4">
                {[
                  { label: 'Engagement Metrics', icon: TrendingUp },
                  { label: 'Pass Rates', icon: BarChart3 },
                  { label: 'Completion Status', icon: CheckCircle2 },
                  { label: 'Progress Tracking', icon: Play },
                ].map(({ label, icon: ItemIcon }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-blue-500/8 border border-blue-500/15 backdrop-blur-sm shadow-[0_2px_8px_rgba(26, 107, 46, 0.1)] transition-all duration-300 hover:shadow-[0_8px_20px_-4px_rgba(59,130,246,0.3)] hover:-translate-y-1 hover:scale-[1.02] hover:bg-blue-500/12 hover:border-blue-500/25 cursor-pointer transform-gpu"
                  >
                    <ItemIcon className="w-3.5 h-3.5 text-blue-400/60 flex-shrink-0" />
                    <span className="text-[12px] text-blue-300/70">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="ghost"
              onClick={() => {
                setMessageType('info');
                setMessage('Reports API is configured. Use POST /api/reports with course, learner, and institute IDs.');
              }}
              className="w-full border border-sky-500/25 text-sky-400 hover:bg-sky-500/10 hover:border-sky-500/40 rounded-xl h-12 font-semibold transition-all duration-500 shadow-[0_4px_16px_-2px_rgba(234,88,12,0.3)] hover:shadow-[0_8px_24px_-4px_rgba(234,88,12,0.4)] hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-[0.99] backdrop-blur-sm group transform-gpu"
            >
              <BarChart3 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-500" />
              Generate Report
              <ExternalLink className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
            </Button>
          </div>
        </FormSection>
      </section>

      <div className="h-4" />
    </div>
  );
}

