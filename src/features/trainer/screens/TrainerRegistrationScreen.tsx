'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FormEvent, useState, Suspense } from 'react';
import { CheckCircle2, ChevronRight, Send, Upload } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle } from '@/components/ui/Card';
import { Field, TextArea, TextInput } from '@/components/ui/Field';
import { trainerLevels } from '../trainerModuleData';
import { registerTrainer } from '@/services/trainerApi';
import { useToastStore } from '@/store/toast-store';
import { getErrorMessage } from '@/utils/errorParser';

export function TrainerRegistrationScreenContent() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToastStore();
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    
    if (ref) {
      formData.append('instituteId', ref);
      formData.append('trainerType', 'institute');
    } else {
      formData.append('trainerType', 'individual');
    }

    try {
      setLoading(true);
      await registerTrainer(formData);
      setSent(true);
    } catch (err) {
      console.error('Registration error', err);
      showToast(getErrorMessage(err, 'Registration failed. Check console for details.'), 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12">
      <div className="mb-8">
        <Link href="/login" className="inline-flex items-center text-sm font-medium text-[#1a6b2e] transition-colors hover:text-sky-400">
          <ChevronRight className="mr-1 h-4 w-4 rotate-180" />
          Back to login
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <Card className="border-gray-700/50 bg-gray-900/80 backdrop-blur-xl shadow-2xl p-8">
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div>
              <h2 className="text-2xl font-bold text-[#0f3d1a]">Apply as Trainer</h2>
              <p className="mt-2 text-sm text-[#1a6b2e]">Join NextGen-LMS LMS and share your expertise. Admin review is required before access.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Full Name"><TextInput name="name" placeholder="e.g. Ayesha Khan" required /></Field>
              <Field label="Email"><TextInput name="email" type="email" placeholder="you@example.com" required /></Field>
              <Field label="Password"><TextInput name="password" type="password" placeholder="Choose a secure password" required /></Field>
              <Field label="Professional Portfolio"><TextInput name="portfolio" type="url" placeholder="https://portfolio.example.com" required /></Field>
              <Field label="Teaching Experience"><TextInput name="teachingExperience" placeholder="e.g. 4 years teaching web development" required /></Field>
              <Field label="Industry Experience"><TextInput name="industryExperience" placeholder="e.g. 6 years frontend engineering" required /></Field>
            </div>

            <Field label="Teaching Levels">
              <div className="grid gap-4 md:grid-cols-2">
                {trainerLevels.map((level) => (
                  <label key={level.value} className="group relative flex cursor-pointer rounded-xl border border-gray-700/50 bg-gray-800/40 p-4 transition-all hover:border-sky-500/50 hover:bg-gray-800/80">
                    <input name="teachingLevels[]" type="checkbox" value={level.value} className="peer mt-0.5 h-4 w-4 shrink-0 rounded border-gray-600 bg-gray-700 text-sky-500 focus:ring-sky-500 focus:ring-offset-gray-900" defaultChecked={level.value !== 'school'} />
                    <div className="ml-3 flex flex-col">
                      <span className="text-sm font-semibold text-[#0f3d1a] peer-checked:text-sky-400">{level.label}</span>
                      <span className="mt-1 text-xs text-[#1a6b2e]">{level.detail}</span>
                    </div>
                  </label>
                ))}
              </div>
            </Field>

            <Field label="Reason for Joining">
              <TextArea name="joiningReason" className="min-h-[120px]" placeholder="Tell admin why you want to teach on NextGen-LMS and what student outcomes you can deliver." required />
            </Field>

            <Field label="CV Upload">
              <div className="flex w-full items-center justify-center rounded-xl border border-dashed border-gray-600/50 bg-gray-800/20 px-6 py-8 transition-all hover:border-sky-500/50 hover:bg-gray-800/40">
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-[#1a6b2e]" />
                  <div className="mt-4 flex text-sm leading-6 text-[#1a6b2e]">
                    <label className="relative cursor-pointer rounded-md font-semibold text-sky-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-sky-500 focus-within:ring-offset-2 hover:text-orange-300">
                      <span>Upload a file</span>
                      <TextInput name="cv" type="file" className="sr-only" accept=".pdf,.doc,.docx" required />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-[#7dab52]">PDF, DOC up to 10MB</p>
                </div>
              </div>
            </Field>

            <div className="flex items-center justify-between pt-4">
              <Button type="submit" size="lg" className="w-full sm:w-auto shadow-lg shadow-sky-500/20" disabled={loading}>
                <Send className="mr-2 h-4 w-4" />
                {loading ? 'Submitting Application...' : 'Apply for Review'}
              </Button>
            </div>

            {sent && (
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">Application submitted successfully! Please wait for admin approval to access your dashboard.</p>
              </div>
            )}
          </form>
        </Card>

        <div className="space-y-6">
          <Card className="border-gray-700/50 bg-gray-900/80 backdrop-blur-xl">
            <CardTitle title="Approval Flow" caption="Track your application status" />
            <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-700 before:to-transparent">
              {['Submit Application', 'Admin Review', 'Profile Verification', 'Dashboard Access'].map((step, index) => (
                <div key={step} className="relative flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-700 bg-gray-800 text-sm font-bold text-[#1a6b2e] shadow-sm z-10">
                    {index + 1}
                  </div>
                  <div className="flex-1 rounded-lg border border-gray-700/50 bg-gray-800/40 p-3 text-sm font-medium text-[#1a6b2e]">
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function TrainerRegistrationScreen() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" /></div>}>
      <TrainerRegistrationScreenContent />
    </Suspense>
  );
}
