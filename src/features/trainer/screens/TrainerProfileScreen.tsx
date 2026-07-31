'use client';

import { FormEvent, useEffect, useState, useRef, ChangeEvent } from 'react';
import { BadgeCheck, AlertCircle, UserRound, Save, Briefcase, Globe, Award, Zap, Camera, CreditCard, Plus, Trash2, CheckCircle2, Building2 } from 'lucide-react';
import { PageHeader, Card, SectionHeader, Badge, Loading, Button } from '@/components/trainer/ui';
import { trainerLevels } from '../trainerModuleData';
import { getProfile, updateProfile } from '@/services/trainerApi';
import { useToastStore } from '@/store/toast-store';
import { useAuthStore } from '@/store/auth-store';
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
  caption: string;
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

export function TrainerProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToastStore();
  const { updateUser } = useAuthStore();

  // Local state for withdrawal methods (Mocked for UI)
  const [withdrawalMethods, setWithdrawalMethods] = useState<any[]>([
    { id: '1', provider: 'easypaisa', accountTitle: 'John Doe', accountNumber: '03001234567', isActive: true },
  ]);
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [newMethod, setNewMethod] = useState({ provider: 'easypaisa', accountTitle: '', accountNumber: '' });

  const handleAddMethod = (e: FormEvent) => {
    e.preventDefault();
    if (!newMethod.accountTitle || !newMethod.accountNumber) return;
    setWithdrawalMethods([...withdrawalMethods, { ...newMethod, id: Math.random().toString(), isActive: false }]);
    setShowAddMethod(false);
    setNewMethod({ provider: 'easypaisa', accountTitle: '', accountNumber: '' });
    showToast('Withdrawal method added successfully', 'success');
  };

  const setPrimaryMethod = (id: string) => {
    setWithdrawalMethods(methods => methods.map(m => ({ ...m, isActive: m.id === id })));
    showToast('Primary withdrawal method updated', 'success');
  };

  const removeMethod = (id: string) => {
    setWithdrawalMethods(methods => methods.filter(m => m.id !== id));
    showToast('Withdrawal method removed', 'success');
  };

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
      
      @keyframes pulse {
        0%, 100% { opacity: 0.5; }
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
      
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
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
      if (!profileRef.current) return;
      const cards = profileRef.current.querySelectorAll('.parallax-card');
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
      if (!profileRef.current) return;
      const cards = profileRef.current.querySelectorAll('.parallax-card');
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

  useEffect(() => {
    let mounted = true;
    getProfile()
      .then((res) => {
        if (!mounted) return;
        setProfile(res.data ?? res);
      })
      .catch((err) => console.error('Failed to load profile', err))
      .finally(() => { if (mounted) setInitLoading(false); });
    return () => { mounted = false; };
  }, []);

  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    // Immediate upload
    try {
      setIsUploadingAvatar(true);
      const fd = new FormData();
      fd.append('avatar', file);

      await updateProfile(fd);
      const updated = await getProfile();
      setProfile(updated.data ?? updated);
      updateUser({ avatar: (updated.data ?? updated).avatar });
      showToast('Profile image updated successfully.', 'success');
    } catch (err) {
      console.error('Avatar upload failed', err);
      showToast(getErrorMessage(err, 'Failed to update profile image.'), 'error');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);

    const rawSkills = fd.get('trainerSkills[]');
    if (typeof rawSkills === 'string') {
      const skills = rawSkills
        .split(/[,\n]/)
        .map((skill) => skill.trim())
        .filter(Boolean);
      fd.delete('trainerSkills[]');
      skills.forEach((skill) => fd.append('trainerSkills[]', skill));
    }

    try {
      setLoading(true);
      await updateProfile(fd);
      const updated = await getProfile();
      setProfile(updated.data ?? updated);
      updateUser({
        name: (updated.data ?? updated).name,
        avatar: (updated.data ?? updated).avatar
      });
      showToast('Profile updated successfully.', 'success');
    } catch (err) {
      console.error('Update profile failed', err);
      showToast(getErrorMessage(err, 'Failed to update profile.'), 'error');
    } finally {
      setLoading(false);
    }
  }

  if (initLoading) return (
    <div className="flex h-96 items-center justify-center">
      <div className="relative">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-sky-500/20 border-t-sky-500 shadow-[0_0_30px_rgba(249,115,22,0.3)]" />
        <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-blue-500/10 border-b-blue-500 animate-[spin_3s_linear_infinite]" />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div ref={profileRef} className="space-y-8 pb-8 relative">
      {/* 3D BACKGROUND PARTICLES */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-[float3D_8s_ease-in-out_infinite]" />
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl animate-[float3D_10s_ease-in-out_infinite_1s]" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl animate-[float3D_12s_ease-in-out_infinite_2s]" />
      </div>

      {/* PAGE HEADER */}
      <div className="relative z-10">
        <PageHeader title="Profile & Settings" caption="Manage your professional identity, experience, and platform visibility." />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr] relative z-10">
        {/* Left Column - Profile Card & Info */}
        <div className="space-y-6">
          {/* Profile Avatar Card */}
          <div
            className={`relative rounded-2xl ${glassEffect} p-8 text-center overflow-hidden ${card3DClass} parallax-card
              before:absolute before:top-0 before:left-8 before:right-8 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/[0.12] before:to-transparent
              after:absolute after:bottom-0 after:left-8 after:right-8 after:h-px after:bg-gradient-to-r after:from-transparent after:via-white/[0.04] after:to-transparent
              transform-gpu animate-[scaleIn_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* 3D ambient lights */}
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-sky-500/20 blur-3xl transition-all duration-700 group-hover:opacity-30 group-hover:scale-110" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-blue-500/10 blur-3xl transition-all duration-700 group-hover:opacity-20 group-hover:scale-110" />

            {/* Avatar with orbiting ring */}
            <div className="relative mx-auto w-28 h-28 group/avatar cursor-pointer" onClick={handleAvatarClick}>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 via-blue-500 to-sky-500 animate-[spin_4s_linear_infinite] opacity-75 blur-sm group-hover/avatar:opacity-100 transition-opacity" />
              <div className="absolute inset-[3px] rounded-full bg-gray-900" />
              
              <div className="absolute inset-[3px] flex items-center justify-center rounded-full bg-gradient-to-br from-sky-500/20 to-orange-600/10 shadow-inner overflow-hidden">
                {avatarPreview || profile?.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarPreview || profile?.avatar || ''} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <UserRound className="h-12 w-12 text-sky-400 relative z-10 drop-shadow-lg" />
                )}
                
                {/* Hover overlay for upload */}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300">
                  <Camera className="w-8 h-8 text-[#0f3d1a]" />
                </div>
              </div>

              {/* Upload spinner */}
              {isUploadingAvatar && (
                <div className="absolute inset-0 z-20 flex items-center justify-center rounded-full bg-black/55">
                  <span className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--gt-border-2)] border-t-[var(--gt-accent)]" />
                </div>
              )}

              {/* Hidden input */}
              <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />

              {/* Floating particles around avatar */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-sky-400 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.8)] animate-pulse" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>

            <h2 className="mt-6 text-3xl font-bold text-[#0f3d1a] bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">{profile?.name ?? '—'}</h2>
            <p className="mt-1 text-sm font-medium text-[#1a6b2e]">{profile?.role ?? 'Trainer'}</p>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {profile?.verifiedBadge ? (
                <Badge tone="success"><BadgeCheck className="h-3.5 w-3.5" /> Verified Educator</Badge>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-600/50 bg-gray-800/50 px-4 py-2 text-xs font-medium text-[#1a6b2e] backdrop-blur-sm transition-all duration-300 hover:border-sky-500/30 hover:text-orange-300 hover:shadow-[0_4px_12px_rgba(249,115,22,0.2)]">
                  <AlertCircle className="h-4 w-4" /> Unverified Profile
                </span>
              )}
              <Badge tone="info">
                {profile?.trainerType === 'institute' ? (
                  <><Building2 className="h-3.5 w-3.5" /> Institute Trainer</>
                ) : (
                  <><UserRound className="h-3.5 w-3.5" /> Individual Trainer</>
                )}
              </Badge>
            </div>
          </Card>

          {/* Professional info card */}
          <Card className="p-6">
            <SectionHeader
              icon={Briefcase}
              tone="info"
              title="Professional Info"
              caption="Your teaching credentials and expertise."
            />
            <div className="space-y-3">
              {[
                { label: 'Portfolio', value: profile?.portfolio ?? 'Not provided', icon: Globe },
                { label: 'Experience', value: profile?.teachingExperience ?? 'Not provided', icon: Award },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-xl border border-[var(--gt-border)] bg-[var(--gt-surface)] p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-[var(--gt-text-3)]" />
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--gt-text-3)]">{label}</p>
                  </div>
                  <p className="break-all text-sm font-medium text-[var(--gt-text)]">{value}</p>
                </div>
              ))}

            <div className="p-6 relative z-10">
              <SectionHeader icon={Briefcase} themeKey="navy" title="Professional Info" caption="Your teaching credentials and expertise" />

              <div className="space-y-4">
                {[
                  { label: 'Portfolio', value: profile?.portfolio ?? 'Not provided', icon: Globe, themeKey: 'orange' as ThemeKey },
                  { label: 'Experience', value: profile?.teachingExperience ?? 'Not provided', icon: Award, themeKey: 'navy' as ThemeKey },
                ].map(({ label, value, icon: Icon, themeKey: tk }, index) => {
                  const t = theme[tk];
                  return (
                    <div
                      key={label}
                      className={`rounded-xl border ${t.subtleBorder} ${t.subtle} p-4 backdrop-blur-sm transition-all duration-300 hover:border-sky-500/20 hover:bg-gray-800/60 hover:shadow-[0_4px_16px_rgba(26, 107, 46, 0.1)] hover:-translate-y-1 transform-gpu
                        animate-[staggeredFadeIn_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className={`w-3.5 h-3.5 ${t.subtleText}`} />
                        <p className="text-xs uppercase tracking-wider text-[#7dab52]">{label}</p>
                      </div>
                      <p className="mt-1 text-sm font-medium text-[#0f3d1a] break-all">{value}</p>
                    </div>
                  );
                })}

                {/* Skills Section */}
                <div className={`rounded-xl border border-sky-500/10 bg-sky-500/5 p-4 backdrop-blur-sm transition-all duration-300 hover:border-sky-500/20 hover:bg-gray-800/60 hover:shadow-[0_4px_16px_rgba(26, 107, 46, 0.1)] hover:-translate-y-1 transform-gpu
                  animate-[staggeredFadeIn_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0`}
                  style={{ animationDelay: '200ms' }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-3.5 h-3.5 text-sky-400/60" />
                    <p className="text-xs uppercase tracking-wider text-[#7dab52]">Skills</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(profile?.trainerSkills || []).map((skill: string, index: number) => (
                      <span
                        key={skill}
                        className="rounded-lg bg-gradient-to-r from-sky-500/10 to-blue-500/5 px-3 py-1.5 text-xs font-medium text-[#1a6b2e] border border-sky-500/20 backdrop-blur-sm shadow-[0_2px_8px_rgba(26, 107, 46, 0.1)] transition-all duration-300 hover:scale-110 hover:rotate-1 hover:shadow-[0_4px_16px_rgba(249,115,22,0.3)] hover:border-sky-500/40 cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                    {(!profile?.trainerSkills || profile.trainerSkills.length === 0) &&
                      <span className="text-sm text-[#7dab52]">None listed</span>
                    }
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8 flex flex-col min-w-0">
          
          {/* Update Form Card */}
          <div
            className={`relative rounded-2xl ${glassEffect} p-6 sm:p-8 overflow-hidden ${card3DClass} parallax-card
              before:absolute before:top-0 before:left-8 before:right-8 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/[0.12] before:to-transparent
              after:absolute after:bottom-0 after:left-8 after:right-8 after:h-px after:bg-gradient-to-r after:from-transparent after:via-white/[0.04] after:to-transparent
              transform-gpu animate-[scaleIn_0.7s_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0`}
            style={{ transformStyle: 'preserve-3d' }}
          >
          {/* 3D ambient effects */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl transition-all duration-700 group-hover:scale-110" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl transition-all duration-700 group-hover:scale-110" />

            <form className="space-y-5" onSubmit={handleSave}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="gt-label">Full Name</label>
                  <input className="gt-input" name="name" defaultValue={profile?.name ?? ''} required />
                </div>
                <div>
                  <label className="gt-label">Portfolio URL</label>
                  <input className="gt-input" name="portfolio" type="url" defaultValue={profile?.portfolio ?? ''} />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="gt-label">Teaching Experience</label>
                  <input className="gt-input" name="teachingExperience" defaultValue={profile?.teachingExperience ?? ''} />
                </div>
                <div>
                  <label className="gt-label">Industry Experience</label>
                  <input className="gt-input" name="industryExperience" defaultValue={profile?.industryExperience ?? ''} />
                </div>
              </div>

              <div>
                <label className="gt-label">Trainer Skills (comma separated)</label>
                <input className="gt-input" name="trainerSkills[]" defaultValue={(profile?.trainerSkills || []).join(', ')} />
              </div>

              <div>
                <label className="gt-label">Approved Teaching Levels</label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {trainerLevels.map((level) => (
                    <label
                      key={level.value}
                      className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-700/50 bg-gray-800/40 p-4 backdrop-blur-sm transition-all duration-300 hover:border-sky-500/30 hover:bg-gray-800/60 hover:shadow-[0_4px_16px_rgba(249,115,22,0.2)] hover:-translate-y-1 transform-gpu group"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <input
                        name="teachingLevels[]"
                        type="checkbox"
                        value={level.value}
                        className="mt-1 h-4 w-4 rounded border-gray-600 bg-gray-700 text-sky-500 focus:ring-sky-500 transition-all duration-300 group-hover:scale-110"
                        defaultChecked={(profile?.teachingLevels || []).includes(level.value)}
                      />
                      <span className="text-sm font-medium text-[#0f3d1a] group-hover:text-[#0f3d1a] transition-colors duration-300">{level.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="gt-label">Update CV (Optional)</label>
                <input
                  className="gt-input file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--gt-accent-soft)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--gt-accent)]"
                  name="cv"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="file:mr-4 file:rounded-full file:border-0 file:bg-sky-500/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-sky-400 hover:file:bg-sky-500/20 file:transition-all file:duration-300 file:hover:scale-105 file:hover:shadow-[0_4px_12px_rgba(249,115,22,0.3)]"
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-[#0f3d1a] rounded-xl h-12 font-semibold transition-all duration-500 border-0 shadow-[0_8px_24px_-4px_rgba(234,88,12,0.4),0_4px_12px_-2px_rgba(234,88,12,0.3)] hover:shadow-[0_12px_32px_-6px_rgba(234,88,12,0.5),0_8px_20px_-4px_rgba(234,88,12,0.4)] hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-[0.98] active:shadow-[0_2px_8px_-2px_rgba(234,88,12,0.3)] relative overflow-hidden group transform-gpu"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    <Save className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform duration-500" />
                    {loading ? (
                      <>
                        <span className="animate-pulse">Saving Changes...</span>
                        <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      </>
                    ) : (
                      'Save Profile Settings'
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <div className="absolute inset-0 rounded-xl border border-white/[0.08]" />
                </Button>
              </div>
            </form>
          </Card>

        {/* Withdrawal Options Card */}
          <div
            className={`relative rounded-2xl ${glassEffect} p-6 sm:p-8 overflow-hidden ${card3DClass} parallax-card
              before:absolute before:top-0 before:left-8 before:right-8 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/[0.12] before:to-transparent
              after:absolute after:bottom-0 after:left-8 after:right-8 after:h-px after:bg-gradient-to-r after:from-transparent after:via-white/[0.04] after:to-transparent
              transform-gpu animate-[scaleIn_0.8s_cubic-bezier(0.16,1,0.3,1)_forwards] opacity-0`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-green-500/10 blur-3xl transition-all duration-700" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <SectionHeader icon={CreditCard} themeKey="orange" title="Withdrawal Methods" caption="Manage how you receive your earnings" />
                {!showAddMethod && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowAddMethod(true)}
                    className="border-sky-500/30 text-sky-400 hover:bg-sky-500/10"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add New
                  </Button>
                ) : undefined
              }
            />

              {showAddMethod && (
                <form onSubmit={handleAddMethod} className="mb-8 p-5 bg-gray-800/40 border border-gray-700/50 rounded-xl space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Provider">
                      <select 
                        className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-[#0f3d1a] focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                        value={newMethod.provider}
                        onChange={(e) => setNewMethod({...newMethod, provider: e.target.value})}
                      >
                        <option value="easypaisa">Easypaisa</option>
                        <option value="jazzcash">JazzCash</option>
                        <option value="sadapay">SadaPay</option>
                        <option value="nayapay">NayaPay</option>
                        <option value="bank">Bank Transfer</option>
                      </select>
                    </Field>
                    <Field label="Account Title">
                      <TextInput 
                        placeholder="e.g. John Doe"
                        value={newMethod.accountTitle}
                        onChange={(e) => setNewMethod({...newMethod, accountTitle: e.target.value})}
                        required
                      />
                    </Field>
                  </div>
                  <div>
                    <label className="gt-label">Account Title</label>
                    <input
                      className="gt-input"
                      placeholder="e.g. John Doe"
                      value={newMethod.accountTitle}
                      onChange={(e) => setNewMethod({ ...newMethod, accountTitle: e.target.value })}
                      required
                    />
                  </Field>
                  <div className="flex gap-3 justify-end pt-2">
                    <Button variant="ghost" className="border border-gray-600" type="button" onClick={() => setShowAddMethod(false)}>Cancel</Button>
                    <Button type="submit" className="bg-orange-600 hover:bg-sky-500">Save Method</Button>
                  </div>
                </div>
                <div>
                  <label className="gt-label">Account Number / IBAN</label>
                  <input
                    className="gt-input"
                    placeholder="e.g. 03001234567 or PK00MEZN…"
                    value={newMethod.accountNumber}
                    onChange={(e) => setNewMethod({ ...newMethod, accountNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="flex justify-end gap-3 pt-1">
                  <Button variant="ghost" type="button" onClick={() => setShowAddMethod(false)}>Cancel</Button>
                  <Button type="submit">Save Method</Button>
                </div>
              </form>
            )}

              <div className="space-y-3">
                {withdrawalMethods.length === 0 ? (
                  <p className="text-[#7dab52] text-sm italic">No withdrawal methods added yet. Add one to receive payments.</p>
                ) : (
                  withdrawalMethods.map(method => (
                    <div key={method.id} className={`p-4 rounded-xl border flex items-center justify-between transition-all ${method.isActive ? 'border-sky-500/50 bg-sky-500/5' : 'border-gray-700/50 bg-gray-800/40 hover:border-gray-600'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm uppercase ${method.isActive ? 'bg-sky-500/20 text-sky-400' : 'bg-gray-700 text-[#1a6b2e]'}`}>
                          {method.provider.substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-[#0f3d1a] capitalize">{method.provider}</p>
                          <p className="text-xs text-[#1a6b2e]">{method.accountTitle} &bull; {method.accountNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {method.isActive ? (
                          <span className="flex items-center text-xs font-semibold text-sky-400 bg-sky-400/10 px-2.5 py-1 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Primary
                          </span>
                        ) : (
                          <button onClick={() => setPrimaryMethod(method.id)} className="text-xs text-[#1a6b2e] hover:text-[#0f3d1a] transition-colors">
                            Set Primary
                          </button>
                        )}
                        <button onClick={() => removeMethod(method.id)} className="text-[#7dab52] hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {method.isActive ? (
                        <Badge tone="accent"><CheckCircle2 className="h-3.5 w-3.5" /> Primary</Badge>
                      ) : (
                        <button onClick={() => setPrimaryMethod(method.id)} className="text-xs text-[var(--gt-text-2)] transition-colors hover:text-[var(--gt-text)]">
                          Set Primary
                        </button>
                      )}
                      <button aria-label="Remove withdrawal method" onClick={() => removeMethod(method.id)} className="text-[var(--gt-text-3)] transition-colors hover:text-[var(--gt-danger)]">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
