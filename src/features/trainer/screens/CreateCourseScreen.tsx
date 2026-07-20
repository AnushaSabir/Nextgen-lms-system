'use client';

import { FormEvent, useState, type ReactNode } from 'react';
import { Save, Send, BookOpen, CheckCircle2 } from 'lucide-react';
import type { LearningLevel } from '@/types/domain';
import { PageHeader, Card, SectionHeader } from '@/components/trainer/ui';
import { trainerLevels, approvalStandards } from '../trainerModuleData';
import { createCourse as apiCreateCourse } from '@/services/trainerApi';
import { useToastStore } from '@/store/toast-store';
import { getErrorMessage } from '@/utils/errorParser';

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block min-w-0">
      <span className="gt-label">{label}</span>
      {children}
    </label>
  );
}

export function CreateCourseScreen() {
  const [level, setLevel] = useState<LearningLevel>('college');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToastStore();

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
    <div className="space-y-6">
      <PageHeader
        eyebrow="Trainer Workspace"
        title="Create New Course"
        subtitle="Design a comprehensive learning experience. Save as draft or submit for admin review."
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_350px]">
        {/* Main Form Card */}
        <Card className="p-6 sm:p-8">
          <SectionHeader
            icon={BookOpen}
            tone="info"
            title="Course Essentials"
            caption="Provide accurate details to ensure faster approval."
          />

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
                  />
                </Field>
              </div>
            </div>

            <div className="gt-hairline flex flex-col items-center gap-3 pt-6 sm:flex-row">
              <button type="submit" className="gt-btn gt-btn--ghost w-full sm:w-auto" disabled={loading}>
                <Save className="h-4 w-4" />
                {loading ? 'Processing...' : 'Save as Draft'}
              </button>
              <button
                type="button"
                onClick={(e) => handleCreate(e as any, true)}
                className="gt-btn gt-btn--primary w-full sm:w-auto"
                disabled={loading}
              >
                <Send className="h-4 w-4" />
                {loading ? 'Processing...' : 'Submit for Approval'}
              </button>
            </div>
          </form>
        </Card>

        {/* Sidebar - Approval Checklist */}
        <div className="space-y-6">
          <Card className="p-6 xl:sticky xl:top-6">
            <SectionHeader
              icon={CheckCircle2}
              tone="accent"
              title="Approval Checklist"
              caption="Review these standards before submitting."
            />
            <div className="gt-stagger space-y-2.5">
              {approvalStandards.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-[var(--gt-border)] bg-[var(--gt-surface)] p-3.5 transition-colors hover:border-[rgba(240,89,31,0.3)] hover:bg-[var(--gt-surface-2)]"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-[var(--gt-accent)]" />
                  <span className="text-sm leading-snug text-[var(--gt-text-2)]">{item}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
