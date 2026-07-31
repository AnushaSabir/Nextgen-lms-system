'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, ReactNode, useEffect, useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth-store';
import type { LearnerCategory, LearningLevel, Role } from '@/types/domain';
import type { StaticImageData } from 'next/image';
import {
  LogIn,
  UserPlus,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Building2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

/* ─── Password Strength Helper ─── */
function getPasswordStrength(pw: string): number {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const STRENGTH_COLORS = ['', '#ef4444', '#f59e0b', '#10b981', '#059669'];
const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];

/* ─── Input Styles ─── */
const INPUT_CLS = 'w-full rounded-lg px-4 py-2.5 text-sm bg-gray-900 border border-gray-700 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all duration-200 text-[#0f3d1a] placeholder-gray-500';
const SELECT_CLS = 'w-full rounded-lg px-4 py-2.5 text-sm bg-gray-900 border border-gray-700 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all duration-200 text-[#0f3d1a]';

/* ─── Images ─── */
const loginImages = [
  { src: '/images/education/student-laptop.jpg', title: 'Learn Anywhere', subtitle: 'Access courses from any device' },
  { src: '/images/education/university-lecture.jpg', title: 'University Ready', subtitle: 'Curriculum for institutions' },
  { src: '/images/education/online-class.jpg', title: 'Live Sessions', subtitle: 'Interactive classes' },
];

const registerImages = [
  { src: '/images/education/teacher-classroom.jpg', title: 'Expert Guidance', subtitle: 'Learn from professionals' },
  { src: '/images/education/group-study.jpg', title: 'Collaborative Learning', subtitle: 'Study with peers' },
  { src: '/images/education/workshop.jpg', title: 'Skill Development', subtitle: 'Hands-on workshops' },
];

/* ────────────────────────────────────────────
   PASSWORD STRENGTH
   ──────────────────────────────────────────── */
function PasswordStrength({ password }: { password: string }) {
  const score = getPasswordStrength(password);
  if (!password) return null;

  return (
    <div className="mt-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= score ? 'bg-sky-500' : 'bg-gray-700'}`} />
        ))}
      </div>
      <p className="text-xs mt-1" style={{ color: STRENGTH_COLORS[score] }}>{STRENGTH_LABELS[score]} password</p>
    </div>
  );
}

/* ────────────────────────────────────────────
   LOGIN PANEL
   ──────────────────────────────────────────── */
export function LoginPanel() {
  const router = useRouter();
  const { login, loading, error } = useAuthStore();
  const [email, setEmail] = useState('admin@nextgen-lms.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const next = await login({ email, password });
      router.replace(next);
    } catch {}
  }

  return (
    <AuthFrame title="Welcome back" subtitle="Sign in to continue" images={loginImages}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#1a6b2e] mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7dab52]" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${INPUT_CLS} pl-10`} placeholder="you@example.com" required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1a6b2e] mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7dab52]" />
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className={`${INPUT_CLS} pl-10 pr-10`} placeholder="••••••••" required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7dab52] hover:text-sky-500">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <PasswordStrength password={password} />
        </div>

        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm text-sky-500 hover:text-sky-400">Forgot password?</Link>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <button type="submit" disabled={loading} className="w-full bg-sky-500 hover:bg-orange-600 text-[#0f3d1a] font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50">
          {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : 'Sign In'}
        </button>

        <p className="text-center text-sm text-[#1a6b2e]">
          New here? <Link href="/register" className="text-sky-500 font-semibold">Create account</Link>
        </p>
      </form>
    </AuthFrame>
  );
}

/* ────────────────────────────────────────────
   REGISTER PANEL
   ──────────────────────────────────────────── */
export function RegisterPanel() {
  const router = useRouter();
  const { register, loading, error } = useAuthStore();
  const [role, setRole] = useState<Role>('learner');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [learnerCategory, setLearnerCategory] = useState<LearnerCategory>('individual_learner');
  const [trainerLevel, setTrainerLevel] = useState<LearningLevel>('university');
  const [teachingExperience, setTeachingExperience] = useState('');
  const [instituteName, setInstituteName] = useState('');
  const [instituteType, setInstituteType] = useState('school');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const next = await register({
        name, email, password, role,
        learnerCategory: role === 'learner' ? learnerCategory : undefined,
        trainerLevel: role === 'trainer' ? trainerLevel : undefined,
        teachingExperience: role === 'trainer' ? teachingExperience : undefined,
      });
      router.replace(next);
    } catch {}
  }

  return (
    <AuthFrame title="Create account" subtitle="Join NextGen-LMS today" images={registerImages}>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Role Selection */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'learner', label: '🎓 Learner' },
            { value: 'trainer', label: '👨‍🏫 Trainer' },
            { value: 'institute_head', label: '🏛️ Institute' },
          ].map((option) => (
            <button key={option.value} type="button" onClick={() => setRole(option.value as Role)} className={`py-2 rounded-lg text-sm font-medium transition-all ${role === option.value ? 'bg-sky-500 text-[#0f3d1a]' : 'bg-gray-800 text-[#1a6b2e] hover:bg-gray-700'}`}>
              {option.label}
            </button>
          ))}
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-[#1a6b2e] mb-1.5">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7dab52]" />
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={`${INPUT_CLS} pl-10`} placeholder="John Doe" required />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-[#1a6b2e] mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7dab52]" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${INPUT_CLS} pl-10`} placeholder="you@example.com" required />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-[#1a6b2e] mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7dab52]" />
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className={`${INPUT_CLS} pl-10 pr-10`} placeholder="Create password" required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7dab52] hover:text-sky-500">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <PasswordStrength password={password} />
        </div>

        {/* Conditional Fields */}
        {role === 'learner' && (
          <select value={learnerCategory} onChange={(e) => setLearnerCategory(e.target.value as LearnerCategory)} className={SELECT_CLS}>
            <option value="school_student">School Student</option>
            <option value="college_student">College Student</option>
            <option value="university_student">University Student</option>
            <option value="individual_learner">Individual Learner</option>
          </select>
        )}

        {role === 'trainer' && (
          <>
            <select value={trainerLevel} onChange={(e) => setTrainerLevel(e.target.value as LearningLevel)} className={SELECT_CLS}>
              <option value="school">School Level</option>
              <option value="college">College Level</option>
              <option value="university">University Level</option>
            </select>
            <textarea value={teachingExperience} onChange={(e) => setTeachingExperience(e.target.value)} className={INPUT_CLS} rows={2} placeholder="Teaching experience..." />
          </>
        )}

        {role === 'institute_head' && (
          <>
            <input type="text" value={instituteName} onChange={(e) => setInstituteName(e.target.value)} className={INPUT_CLS} placeholder="Institute Name" />
            <select value={instituteType} onChange={(e) => setInstituteType(e.target.value)} className={SELECT_CLS}>
              <option value="school">School</option>
              <option value="college">College</option>
              <option value="university">University</option>
              <option value="training_center">Training Center</option>
            </select>
          </>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <button type="submit" disabled={loading} className="w-full bg-sky-500 hover:bg-orange-600 text-[#0f3d1a] font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50">
          {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : 'Create Account'}
        </button>

        <p className="text-center text-sm text-[#1a6b2e]">
          Already have an account? <Link href="/login" className="text-sky-500 font-semibold">Sign in</Link>
        </p>
      </form>
    </AuthFrame>
  );
}

/* ────────────────────────────────────────────
   AUTH FRAME - Clean with Carousel (Mobile + Desktop)
   ──────────────────────────────────────────── */
function AuthFrame({ title, subtitle, children, images }: { title: string; subtitle: string; children: ReactNode; images: { src: string; title: string; subtitle: string }[] }) {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
        
        {/* Mobile: Image Carousel at Top */}
        <div className="lg:hidden relative h-48">
          <img src={images[currentImage].src} alt={images[currentImage].title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-0 right-0 text-center">
            <p className="text-[#0f3d1a] font-semibold text-sm">{images[currentImage].title}</p>
            <p className="text-[#1a6b2e] text-xs">{images[currentImage].subtitle}</p>
          </div>
          <div className="absolute top-3 right-3 flex gap-1">
            {images.map((_, i) => (
              <button key={i} onClick={() => setCurrentImage(i)} className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentImage ? 'bg-sky-500 w-4' : 'bg-[#1a6b2e]/50'}`} />
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2">
          {/* Form Section */}
          <div className="p-6 md:p-8">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                <span className="text-xs font-semibold text-sky-500 uppercase">NextGen-LMS LMS</span>
              </div>
              <h1 className="text-2xl font-bold text-[#0f3d1a] mb-1">{title}</h1>
              <p className="text-sm text-[#1a6b2e]">{subtitle}</p>
            </div>
            {children}
          </div>

          {/* Desktop: Image Carousel */}
          <div className="hidden lg:block relative bg-gradient-to-br from-orange-600 to-red-600 p-8 min-h-[500px]">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="rounded-xl overflow-hidden shadow-2xl mb-6">
                <img src={images[currentImage].src} alt={images[currentImage].title} className="w-full h-64 object-cover" />
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-bold text-[#0f3d1a] mb-2">{images[currentImage].title}</h3>
                <p className="text-orange-100">{images[currentImage].subtitle}</p>
              </div>

              <div className="flex justify-center gap-2 mt-6">
                {images.map((_, i) => (
                  <button key={i} onClick={() => setCurrentImage(i)} className={`h-1.5 rounded-full transition-all ${i === currentImage ? 'w-8 bg-white' : 'w-1.5 bg-[#1a6b2e]/50'}`} />
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-white/20">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div><div className="text-2xl font-bold text-[#0f3d1a]">10K+</div><div className="text-orange-100 text-xs">Learners</div></div>
                  <div><div className="text-2xl font-bold text-[#0f3d1a]">500+</div><div className="text-orange-100 text-xs">Trainers</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
