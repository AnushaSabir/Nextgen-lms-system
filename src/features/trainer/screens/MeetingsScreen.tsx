'use client';

import { FormEvent, useEffect, useState } from 'react';
import {
  Calendar, Clock, ExternalLink, Link2, Plus, Trash2, Video, Loader2,
} from 'lucide-react';
import {
  PageHeader,
  Card,
  SectionHeader,
  Badge,
  EmptyState,
  Loading,
} from '@/components/trainer/ui';
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

const PROVIDER_TONE: Record<string, 'info' | 'success'> = {
  zoom: 'info',
  google_meet: 'success',
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
      <div className="space-y-6">
        <PageHeader
          eyebrow="Live Q&A"
          title="Meetings"
          subtitle="Schedule and manage Google Meet or Zoom sessions for your learners."
        />
        <Card className="p-2">
          <Loading label="Loading meetings…" />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Live Q&A"
        title="Meetings"
        subtitle="Schedule and manage Google Meet or Zoom sessions for your learners."
        actions={
          <button onClick={() => setShowForm((v) => !v)} className="gt-btn gt-btn--primary">
            <Plus className="h-4 w-4" />
            {showForm ? 'Hide Form' : 'Schedule Meeting'}
          </button>
        }
      />

      {/* ── Create Form ── */}
      {showForm && (
        <Card className="p-6 sm:p-8">
          <SectionHeader
            icon={Calendar}
            title="New Meeting"
            caption="Provide a manual Zoom or Google Meet link."
          />
          <form className="space-y-5" onSubmit={handleCreate}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="gt-label">Course</label>
                <select name="courseId" required className="gt-input appearance-none">
                  <option value="">— Select course —</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="gt-label">Provider</label>
                <select name="provider" defaultValue="zoom" required className="gt-input appearance-none">
                  <option value="zoom">Zoom</option>
                  <option value="google_meet">Google Meet</option>
                </select>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="gt-label">Date &amp; Time</label>
                <input name="startsAt" type="datetime-local" required className="gt-input" />
              </div>
              <div>
                <label className="gt-label">Meeting Link</label>
                <input
                  name="meetingUrl"
                  type="url"
                  placeholder="https://meet.google.com/xxx or https://zoom.us/j/xxx"
                  required
                  className="gt-input"
                />
              </div>
            </div>

            <div>
              <label className="gt-label">Agenda (optional)</label>
              <textarea name="agenda" placeholder="Topics to cover in this session…" className="gt-input" />
            </div>

            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={submitting} className="gt-btn gt-btn--primary">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Calendar className="h-4 w-4" />}
                {submitting ? 'Scheduling…' : 'Schedule Meeting'}
              </button>
              <button type="button" className="gt-btn gt-btn--ghost" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* ── Meetings List ── */}
      {meetings.length === 0 ? (
        <Card className="p-2">
          <EmptyState
            icon={Calendar}
            title="No meetings scheduled"
            detail='Click "Schedule Meeting" above to create your first session.'
          />
        </Card>
      ) : (
        <div className="gt-stagger space-y-3">
          {meetings.map((meeting) => (
            <Card
              key={meeting.id}
              hover
              className="flex flex-col justify-between gap-5 p-5 sm:flex-row sm:items-center"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border border-[rgba(240,89,31,0.3)] bg-[var(--gt-accent-soft)] text-[var(--gt-accent)]">
                  <Video className="h-6 w-6" />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={PROVIDER_TONE[meeting.provider]}>
                      {PROVIDER_LABELS[meeting.provider] ?? meeting.provider}
                    </Badge>
                    <Badge>{meeting.course?.title ?? meeting.courseId}</Badge>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-[var(--gt-text)]">
                    <Clock className="h-4 w-4 flex-shrink-0 text-[var(--gt-accent)]" />
                    <span>{formatDateTime(meeting.startsAt)}</span>
                  </div>
                  {meeting.agenda && (
                    <p className="mt-1.5 line-clamp-1 text-xs text-[var(--gt-text-2)]">{meeting.agenda}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 sm:flex-col lg:flex-row">
                <a
                  href={meeting.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gt-btn gt-btn--primary gt-btn--sm"
                >
                  <Link2 className="h-4 w-4" />
                  Join
                  <ExternalLink className="h-3 w-3" />
                </a>
                <button
                  onClick={() => handleDelete(meeting.id)}
                  disabled={deletingId === meeting.id}
                  className="gt-btn gt-btn--sm"
                  style={{ background: 'rgba(251,113,133,0.12)', color: 'var(--gt-danger)', border: '1px solid rgba(251,113,133,0.28)' }}
                >
                  {deletingId === meeting.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Cancel
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Future OAuth integration note */}
      <Card
        className="p-4 text-sm text-[var(--gt-info)]"
        style={{ borderColor: 'rgba(56,189,248,0.28)', background: 'rgba(56,189,248,0.06)' }}
      >
        <strong className="text-[var(--gt-text)]">Note:</strong> Currently using manual meeting links. Zoom and Google Meet OAuth integration is prepared — add credentials to{' '}
        <code className="rounded bg-[rgba(56,189,248,0.15)] px-1.5 py-0.5 text-xs">.env</code> when ready.
      </Card>
    </div>
  );
}
