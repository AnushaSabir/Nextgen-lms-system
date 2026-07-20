'use client';

import { FormEvent, useEffect, useState, useRef, ChangeEvent } from 'react';
import { BadgeCheck, AlertCircle, UserRound, Save, Briefcase, Globe, Award, Zap, Camera, CreditCard, Plus, Trash2, CheckCircle2, Building2 } from 'lucide-react';
import { PageHeader, Card, SectionHeader, Badge, Loading, Button } from '@/components/trainer/ui';
import { trainerLevels } from '../trainerModuleData';
import { getProfile, updateProfile } from '@/services/trainerApi';
import { useToastStore } from '@/store/toast-store';
import { useAuthStore } from '@/store/auth-store';
import { getErrorMessage } from '@/utils/errorParser';

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

  if (initLoading) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Trainer Studio" title="Profile & Settings" subtitle="Loading your profile…" />
        <Card className="p-2">
          <Loading label="Fetching your profile…" />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Trainer Studio"
        title="Profile & Settings"
        subtitle="Manage your professional identity, experience, and platform visibility."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        {/* Left Column — Profile summary & professional info */}
        <div className="gt-stagger space-y-6">
          {/* Profile summary card */}
          <Card className="p-6 text-center">
            <div
              className="group/avatar relative mx-auto h-28 w-28 cursor-pointer"
              onClick={handleAvatarClick}
            >
              <div className="h-28 w-28 overflow-hidden rounded-full border border-[var(--gt-border-2)] bg-[var(--gt-surface-2)]">
                {avatarPreview || profile?.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarPreview || profile?.avatar || ''} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-[var(--gt-accent)]">
                    <UserRound className="h-11 w-11" />
                  </span>
                )}
              </div>

              {/* Hover overlay for upload */}
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 transition-opacity duration-300 group-hover/avatar:opacity-100">
                <Camera className="h-7 w-7 text-white" />
              </div>

              {/* Upload spinner */}
              {isUploadingAvatar && (
                <div className="absolute inset-0 z-20 flex items-center justify-center rounded-full bg-black/55">
                  <span className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--gt-border-2)] border-t-[var(--gt-accent)]" />
                </div>
              )}

              {/* Hidden input */}
              <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-[var(--gt-text)]">{profile?.name ?? '—'}</h2>
            <p className="mt-1 text-sm font-medium text-[var(--gt-text-2)] capitalize">{profile?.role ?? 'Trainer'}</p>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {profile?.verifiedBadge ? (
                <Badge tone="success"><BadgeCheck className="h-3.5 w-3.5" /> Verified Educator</Badge>
              ) : (
                <Badge tone="warn"><AlertCircle className="h-3.5 w-3.5" /> Unverified Profile</Badge>
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

              {/* Skills chips */}
              <div className="rounded-xl border border-[var(--gt-border)] bg-[var(--gt-surface)] p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5 text-[var(--gt-accent)]" />
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--gt-text-3)]">Skills</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(profile?.trainerSkills || []).map((skill: string) => (
                    <span
                      key={skill}
                      className="rounded-lg border border-[var(--gt-border-2)] bg-[var(--gt-surface-2)] px-3 py-1.5 text-xs font-medium text-[var(--gt-text-2)]"
                    >
                      {skill}
                    </span>
                  ))}
                  {(!profile?.trainerSkills || profile.trainerSkills.length === 0) && (
                    <span className="text-sm text-[var(--gt-text-3)]">None listed</span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column — Edit form & withdrawal methods */}
        <div className="gt-stagger flex min-w-0 flex-col space-y-6">
          {/* Update form card */}
          <Card className="p-6">
            <SectionHeader
              icon={Save}
              title="Update Information"
              caption="Keep your details current to maintain platform trust."
            />

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
                      className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--gt-border)] bg-[var(--gt-surface)] p-4 transition-colors hover:border-[rgba(240,89,31,0.3)]"
                    >
                      <input
                        name="teachingLevels[]"
                        type="checkbox"
                        value={level.value}
                        className="mt-0.5 h-4 w-4 accent-[var(--gt-accent)]"
                        defaultChecked={(profile?.teachingLevels || []).includes(level.value)}
                      />
                      <span className="text-sm font-medium text-[var(--gt-text)]">{level.label}</span>
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
                />
              </div>

              <div className="pt-1">
                <Button type="submit" disabled={loading}>
                  <Save className="h-4 w-4" />
                  {loading ? 'Saving Changes…' : 'Save Profile Settings'}
                </Button>
              </div>
            </form>
          </Card>

          {/* Withdrawal methods card */}
          <Card className="p-6">
            <SectionHeader
              icon={CreditCard}
              tone="accent"
              title="Withdrawal Methods"
              caption="Manage how you receive your earnings."
              actions={
                !showAddMethod ? (
                  <Button variant="ghost" size="sm" onClick={() => setShowAddMethod(true)}>
                    <Plus className="h-4 w-4" /> Add New
                  </Button>
                ) : undefined
              }
            />

            {showAddMethod && (
              <form onSubmit={handleAddMethod} className="mb-6 space-y-4 rounded-xl border border-[var(--gt-border)] bg-[var(--gt-surface)] p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="gt-label">Provider</label>
                    <select
                      className="gt-input"
                      value={newMethod.provider}
                      onChange={(e) => setNewMethod({ ...newMethod, provider: e.target.value })}
                    >
                      <option value="easypaisa">Easypaisa</option>
                      <option value="jazzcash">JazzCash</option>
                      <option value="sadapay">SadaPay</option>
                      <option value="nayapay">NayaPay</option>
                      <option value="bank">Bank Transfer</option>
                    </select>
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
                <p className="text-sm italic text-[var(--gt-text-3)]">No withdrawal methods added yet. Add one to receive payments.</p>
              ) : (
                withdrawalMethods.map(method => (
                  <div
                    key={method.id}
                    className={`flex items-center justify-between rounded-xl border p-4 transition-colors ${method.isActive ? 'border-[rgba(240,89,31,0.4)] bg-[var(--gt-accent-soft)]' : 'border-[var(--gt-border)] bg-[var(--gt-surface)]'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold uppercase ${method.isActive ? 'bg-[var(--gt-accent-soft)] text-[var(--gt-accent)]' : 'bg-[var(--gt-surface-2)] text-[var(--gt-text-2)]'}`}>
                        {method.provider.substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold capitalize text-[var(--gt-text)]">{method.provider}</p>
                        <p className="text-xs text-[var(--gt-text-2)]">{method.accountTitle} &bull; {method.accountNumber}</p>
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
