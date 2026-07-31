'use client';

import { FormEvent, useState, type ReactNode } from 'react';
import { Save, Send, BookOpen, CheckCircle2 } from 'lucide-react';
import type { LearningLevel } from '@/types/domain';
import { PageHeader, Card, SectionHeader } from '@/components/trainer/ui';
import { trainerLevels, approvalStandards } from '../trainerModuleData';
import { createCourse as apiCreateCourse } from '@/services/trainerApi';
import { useToastStore } from '@/store/toast-store';
import { getErrorMessage } from '@/utils/errorParser';

/* ─── Two Accent Colors Only: Navy Blue (primary) & Orange (secondary) ─── */
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

const card3DClass = "transition-all duration-500 ease-out transform-gpu perspective-1000 hover:rotate-y-1 hover:rotate-x-0.5 hover:shadow-[0_20px_60px_-12px_rgba(26, 107, 46, 0.1),0_10px_40px_-8px_rgba(26, 107, 46, 0.1)] hover:-translate-y-2 hover:scale-[1.02]";

const glassEffect = "backdrop-blur-xl bg-gradient-to-br from-gray-800/40 to-gray-900/60 border border-white/[0.08] shadow-[0_8px_32px_-8px_rgba(26, 107, 46, 0.1)]";

function SectionHeader({
  icon: Icon,
  themeKey,
  title,
  caption,
}: {
  icon: React.ElementType;
  themeKey: ThemeKey;
  title: string;
  caption?: string;
}) {
  const t = theme[themeKey];
  return (
    <div className="flex items-center gap-3.5 mb-6 group">
      <div
        className={`w-12 h-12 rounded-2xl ${t.bg} border ${t.border} flex items-center justify-center flex-shrink-0 ${t.depth} ${t.reflection} transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-[0_8px_32px_-8px_rgba(26, 107, 46, 0.1),0_0_20px_-4px_rgba(59,130,246,0.2)] relative overflow-hidden`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent rounded-2xl" />
        <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/[0.02] to-transparent rounded-2xl" />
        <Icon className={`w-5 h-5 ${t.text} relative z-10 drop-shadow-lg transition-transform duration-500 group-hover:scale-110`} />
      </div>
      <div>
        <h3 className="text-[17px] font-semibold text-[#0f3d1a] leading-snug tracking-[-0.01em] relative">
          {title}
          <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-blue-400/0 via-blue-400/50 to-blue-400/0 group-hover:w-full transition-all duration-700 ease-out" />
        </h3>
        {caption && <p className="text-[13px] text-[#7dab52] mt-1 leading-relaxed font-normal">{caption}</p>}
      </div>
    </div>
  );
}

export function CreateCourseScreen() {
  const [level, setLevel] = useState<LearningLevel>('college');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToastStore();

  // Inject keyframe animations
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
      
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      
      @keyframes pulse-subtle {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
      }
      
      @keyframes float3D {
        0%, 100% { 
          transform: translate3d(0, 0, 0) rotateX(0deg); 
          filter: drop-shadow(0 4px 8px rgba(26, 107, 46, 0.1));
        }
        25% { 
          transform: translate3d(3px, -6px, 15px) rotateX(1deg); 
          filter: drop-shadow(0 8px 16px rgba(26, 107, 46, 0.1));
        }
        50% { 
          transform: translate3d(-3px, -10px, 8px) rotateX(-0.5deg); 
          filter: drop-shadow(0 6px 12px rgba(26, 107, 46, 0.1));
        }
        75% { 
          transform: translate3d(2px, -4px, 18px) rotateX(0.5deg); 
          filter: drop-shadow(0 10px 20px rgba(26, 107, 46, 0.1));
        }
      }
      
      .perspective-1000 {
        perspective: 1000px;
      }
      
      .transform-style-3d {
        transform-style: preserve-3d;
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

  // 3D parallax effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!createRef.current) return;
      const cards = createRef.current.querySelectorAll('.parallax-card');
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
      if (!createRef.current) return;
      const cards = createRef.current.querySelectorAll('.parallax-card');
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

  async function handleCreate(e: FormEvent, submitForApproval = false) {
    e.preventDefault();
    // "Submit for Approval" is a type=button, so e.target is the button — resolve the real form.
    const form = ((e.currentTarget as HTMLElement).closest('form') ??
      (e.target as HTMLElement).closest('form')) as HTMLFormElement | null;
    if (!form) return;
    // Run native validation for the non-submit (Approval) path too.
    if (!form.reportValidity()) return;
    const fd = new FormData(form);

    // Convert textarea strings to arrays for requirements and outcomes
    const reqString = fd.get('requirements_text') as string;
    const outString = fd.get('outcomes_text') as string;

    const requirements = reqString.split('\n').map(s => s.trim()).filter(Boolean);
    const outcomes = outString.split('\n').map(s => s.trim()).filter(Boolean);

    fd.delete('requirements_text');
    fd.delete('outcomes_text');

    requirements.forEach(r => fd.append('requirements[]', r));
    outcomes.forEach(o => fd.append('learningOutcomes[]', o));

    fd.append('status', submitForApproval ? 'pending_review' : 'draft');

    try {
      setLoading(true);
      await apiCreateCourse(fd);
      showToast('Course saved successfully.', 'success');
      window.location.href = '/trainer/courses';
    } catch (err) {
      console.error('Create course failed', err);
      showToast(getErrorMessage(err, 'Create course failed. Please check form inputs.'), 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div ref={createRef} className="space-y-8 pb-8 relative">
      {/* 3D BACKGROUND PARTICLES */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-[float3D_8s_ease-in-out_infinite]" />
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl animate-[float3D_10s_ease-in-out_infinite_1s]" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl animate-[float3D_12s_ease-in-out_infinite_2s]" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_350px]">
        {/* Main Form Card */}
        <div
          className={`relative rounded-2xl ${glassEffect} p-6 sm:p-8 overflow-hidden ${card3DClass} parallax-card
            before:absolute before:top-0 before:left-8 before:right-8 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/[0.12] before:to-transparent
            after:absolute after:bottom-0 after:left-8 after:right-8 after:h-px after:bg-gradient-to-r after:from-transparent after:via-white/[0.04] after:to-transparent
            transform-gpu animate-[scaleIn_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* 3D ambient effects */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl transition-all duration-700 group-hover:scale-110" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-sky-500/5 blur-3xl transition-all duration-700 group-hover:scale-110" />

          <form className="space-y-8" onSubmit={(e) => handleCreate(e, false)} id="create-course-form">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Course Title">
                  <input name="title" placeholder="e.g. Advanced Frontend Foundations" required className="gt-input" />
                </Field>
              </div>
              <Field label="Category">
                <input name="category" placeholder="e.g. Web Development" required className="gt-input" />
              </Field>
              <Field label="Learning Level">
                <select
                  name="level"
                  value={level}
                  onChange={(e) => setLevel(e.target.value as LearningLevel)}
                  className="gt-input cursor-pointer appearance-none"
                >
                  {trainerLevels.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Price (PKR)">
                <input name="price" type="number" min={0} placeholder="12000" required className="gt-input" />
              </Field>
              <Field label="Cover Thumbnail">
                <input
                  name="thumbnail"
                  type="file"
                  accept="image/*"
                  required
                  className="gt-input file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--gt-accent-soft)] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-[var(--gt-accent)]"
                />
              </Field>
            </div>

            <div className="gt-hairline space-y-6 pt-6">
              <Field label="Course Description">
                <textarea
                  name="description"
                  className="gt-input min-h-[120px]"
                  placeholder="Detailed description of the course, target audience, and curriculum structure."
                  required
                />
              </Field>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Prerequisites & Requirements (One per line)">
                  <textarea
                    name="requirements_text"
                    className="gt-input min-h-[120px]"
                    placeholder="Basic HTML knowledge&#10;Computer with internet"
                    required
                  />
                </Field>
                <Field label="Learning Outcomes (One per line)">
                  <textarea
                    name="outcomes_text"
                    className="gt-input min-h-[120px]"
                    placeholder="Build responsive websites&#10;Understand React hooks"
                    required
                    className="file:mr-4 file:rounded-full file:border-0 file:bg-sky-500/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-sky-400 hover:file:bg-sky-500/20 file:transition-all file:duration-300 file:hover:scale-105 file:hover:shadow-[0_4px_12px_rgba(249,115,22,0.3)]"
                  />
                </Field>
              </div>
            </div>

              <div className="border-t border-white/[0.06] pt-6 space-y-6">
                <Field label="Course Description">
                  <TextArea name="description" className="min-h-[120px]" placeholder="Detailed description of the course, target audience, and curriculum structure." required />
                </Field>

                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Prerequisites & Requirements (One per line)">
                    <TextArea name="requirements_text" className="min-h-[120px]" placeholder="Basic HTML knowledge&#10;Computer with internet" required />
                  </Field>
                  <Field label="Learning Outcomes (One per line)">
                    <TextArea name="outcomes_text" className="min-h-[120px]" placeholder="Build responsive websites&#10;Understand React hooks" required />
                  </Field>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-white/[0.06]">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 text-[#0f3d1a] rounded-xl h-12 font-semibold transition-all duration-500 border border-gray-700/50 shadow-[0_4px_12px_rgba(26, 107, 46, 0.1)] hover:shadow-[0_8px_20px_-4px_rgba(26, 107, 46, 0.1)] hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-[0.98] transform-gpu"
                  disabled={loading}
                >
                  <Save className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform duration-500" />
                  {loading ? 'Processing...' : 'Save as Draft'}
                </Button>
                <Button
                  type="button"
                  size="lg"
                  onClick={(e) => handleCreate(e as any, true)}
                  className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-[#0f3d1a] rounded-xl h-12 font-semibold transition-all duration-500 border-0 shadow-[0_8px_24px_-4px_rgba(234,88,12,0.4),0_4px_12px_-2px_rgba(234,88,12,0.3)] hover:shadow-[0_12px_32px_-6px_rgba(234,88,12,0.5),0_8px_20px_-4px_rgba(234,88,12,0.4)] hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-[0.98] active:shadow-[0_2px_8px_-2px_rgba(234,88,12,0.3)] relative overflow-hidden group transform-gpu"
                  disabled={loading}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    <Send className="mr-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-500" />
                    {loading ? 'Processing...' : 'Submit for Approval'}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <div className="absolute inset-0 rounded-xl border border-white/[0.08]" />
                </Button>
              </div>
            </form>
          </div>

          {/* 3D border highlights */}
          <div className="absolute top-0 left-0 w-full h-full rounded-2xl border border-white/[0.06] pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-full rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
        </div>

        {/* Sidebar - Approval Checklist */}
        <div className="space-y-6">
          <div
            className={`relative rounded-2xl ${glassEffect} overflow-hidden ${card3DClass} parallax-card
              before:absolute before:top-0 before:left-8 before:right-8 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/[0.12] before:to-transparent
              after:absolute after:bottom-0 after:left-8 after:right-8 after:h-px after:bg-gradient-to-r after:from-transparent after:via-white/[0.04] after:to-transparent
              transform-gpu animate-[scaleIn_0.7s_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0 sticky top-6`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* 3D ambient light */}
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-sky-500/10 blur-3xl transition-all duration-700 group-hover:scale-110" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-blue-500/5 blur-3xl transition-all duration-700 group-hover:scale-110" />

            <div className="p-6 relative z-10">
              <SectionHeader icon={CheckCircle2} themeKey="orange" title="Approval Checklist" caption="Review these standards before submitting." />
              <InfoList items={approvalStandards} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
