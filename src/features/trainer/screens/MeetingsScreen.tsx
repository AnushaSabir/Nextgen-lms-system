'use client';

import { FormEvent, useEffect, useState } from 'react';
import {
  Calendar, Clock, ExternalLink, Link2, Plus, Trash2, Video, Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle } from '@/components/ui/Card';
import { Field, SelectInput, TextArea, TextInput } from '@/components/ui/Field';
import { PageHeader } from '../components/TrainerShared';
import { meetingsApi, coursesApi } from '@/lib/api';
import { useToastStore } from '@/store/toast-store';
import { getErrorMessage } from '@/utils/errorParser';

type Meeting = {
  id: string;
  courseId: string;
  course?: { id: string; title: string };
  startsAt: string;
  provider: 'zoom' | 'google_meet';
  meetingUrl: string;
  agenda?: string;
};

type Course = { id: string; title: string };

const PROVIDER_LABELS: Record<string, string> = {
  zoom: 'Zoom',
  google_meet: 'Google Meet',
};

const PROVIDER_COLORS: Record<string, string> = {
  zoom: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  google_meet: 'bg-green-500/10 text-green-400 border-green-500/20',
};

function formatDateTime(dt: string) {
  try {
    return new Intl.DateTimeFormat('en-PK', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(dt));
  } catch {
    return dt;
  }
}

export function MeetingsScreen() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { showToast } = useToastStore();

  async function load() {
    const [m, c] = await Promise.all([
      meetingsApi.list(),
      coursesApi.list(),
    ]);
    setMeetings(m);
    setCourses(c as unknown as Course[]);
  }

  useEffect(() => {
    load().catch(console.error).finally(() => setLoading(false));
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    try {
      setSubmitting(true);
      await meetingsApi.create({
        courseId:   fd.get('courseId') as string,
        startsAt:   fd.get('startsAt') as string,
        provider:   (fd.get('provider') as 'zoom' | 'google_meet') ?? 'zoom',
        meetingUrl: fd.get('meetingUrl') as string,
        agenda:     fd.get('agenda') as string,
      });
      showToast('Meeting scheduled successfully.', 'success');
      (e.target as HTMLFormElement).reset();
      setShowForm(false);
      await load();
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to schedule meeting.'), 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Cancel this meeting?')) return;
    try {
      setDeletingId(id);
      await meetingsApi.destroy(id);
      showToast('Meeting cancelled.', 'success');
      setMeetings((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to cancel meeting.'), 'error');
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <PageHeader
          title="Meetings"
          caption="Schedule and manage Google Meet or Zoom sessions for your learners."
        />
        <Button onClick={() => setShowForm((v) => !v)} className="shrink-0 shadow-lg shadow-sky-500/20">
          <Plus className="mr-2 h-4 w-4" />
          {showForm ? 'Hide Form' : 'Schedule Meeting'}
        </Button>
      </div>

      {/* ── Create Form ── */}
      {showForm && (
        <Card className="border-sky-500/20 bg-gray-900/70 shadow-xl p-8">
          <CardTitle title="New Meeting" caption="Provide a manual Zoom or Google Meet link." />
          <form className="mt-6 space-y-5" onSubmit={handleCreate}>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Course">
                <SelectInput name="courseId" required>
                  <option value="">— Select course —</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="Provider">
                <SelectInput name="provider" defaultValue="zoom" required>
                  <option value="zoom">Zoom</option>
                  <option value="google_meet">Google Meet</option>
                </SelectInput>
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Date & Time">
                <TextInput name="startsAt" type="datetime-local" required />
              </Field>
              <Field label="Meeting Link">
                <TextInput
                  name="meetingUrl"
                  type="url"
                  placeholder="https://meet.google.com/xxx or https://zoom.us/j/xxx"
                  required
                />
              </Field>
            </div>

            <Field label="Agenda (optional)">
              <TextArea name="agenda" placeholder="Topics to cover in this session..." />
            </Field>

            <div className="pt-2 flex gap-3">
              <Button type="submit" disabled={submitting} className="shadow-lg shadow-sky-500/20">
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calendar className="mr-2 h-4 w-4" />}
                {submitting ? 'Scheduling...' : 'Schedule Meeting'}
              </Button>
              <Button type="button" variant="ghost" className="border border-gray-700" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* ── Meetings List ── */}
      {meetings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-700 p-16 text-center bg-gray-800/20">
          <Calendar className="mx-auto h-12 w-12 text-[#7dab52] mb-4" />
          <h3 className="text-lg font-semibold text-[#0f3d1a]">No meetings scheduled</h3>
          <p className="mt-2 text-sm text-[#1a6b2e]">
            Click "Schedule Meeting" above to create your first session.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-5 rounded-2xl border border-gray-700/50 bg-gray-800/40 p-5 transition-all hover:bg-gray-800/80 hover:border-gray-600"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/20">
                  <Video className="h-6 w-6 text-sky-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${PROVIDER_COLORS[meeting.provider] ?? 'bg-gray-700 text-[#1a6b2e] border-gray-600'}`}
                    >
                      {PROVIDER_LABELS[meeting.provider] ?? meeting.provider}
                    </span>
                    <span className="text-xs text-[#7dab52] bg-gray-800 px-2.5 py-1 rounded-full border border-gray-700">
                      {meeting.course?.title ?? meeting.courseId}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-[#1a6b2e]">
                    <Clock className="h-4 w-4 text-sky-400 shrink-0" />
                    <span>{formatDateTime(meeting.startsAt)}</span>
                  </div>
                  {meeting.agenda && (
                    <p className="mt-1.5 text-xs text-[#7dab52] line-clamp-1">{meeting.agenda}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 sm:flex-col lg:flex-row">
                <a
                  href={meeting.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-[#0f3d1a] text-sm font-semibold px-4 py-2 transition-colors"
                >
                  <Link2 className="h-4 w-4" />
                  Join
                  <ExternalLink className="h-3 w-3" />
                </a>
                <button
                  onClick={() => handleDelete(meeting.id)}
                  disabled={deletingId === meeting.id}
                  className="flex items-center gap-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-semibold px-4 py-2 border border-red-500/20 transition-colors"
                >
                  {deletingId === meeting.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Future OAuth integration note */}
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 text-sm text-blue-300">
        <strong className="text-blue-200">Note:</strong> Currently using manual meeting links. Zoom and Google Meet OAuth integration is prepared — add credentials to <code className="text-xs bg-blue-900/30 px-1.5 py-0.5 rounded">.env</code> when ready.
      </div>
    </div>
  );
}
