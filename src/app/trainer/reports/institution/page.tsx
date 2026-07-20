'use client';

import React, { useEffect, useState } from 'react';
import { Building2, Send, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { trainerApi, coursesApi } from '@/lib/api';
import {
  PageHeader,
  Card,
  SectionHeader,
  EmptyState,
  Loading,
} from '@/components/trainer/ui';

type Student = {
  id: string;
  learnerId: string;
  name: string;
  email: string;
  course: string;
  courseId: string;
  progress: number;
};

type Course = { id: string; title: string };

type Report = { id: string; learner: string; course: string; remarks: string; createdAt: string };

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return value ?? '';
  }
}

export default function InstitutionReportsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const [courseId, setCourseId] = useState('');
  const [learnerId, setLearnerId] = useState('');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function loadReports() {
    try {
      const data = await trainerApi.reports();
      setReports(Array.isArray(data) ? data : []);
    } catch {
      setReports([]);
    }
  }

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const [studentData, courseData, reportData] = await Promise.all([
          trainerApi.students().catch(() => []),
          coursesApi.list().catch(() => []),
          trainerApi.reports().catch(() => []),
        ]);
        if (!active) return;
        setStudents(Array.isArray(studentData) ? (studentData as Student[]) : []);
        setCourses(Array.isArray(courseData) ? (courseData as Course[]) : []);
        setReports(Array.isArray(reportData) ? (reportData as Report[]) : []);
      } catch {
        if (active) {
          setStudents([]);
          setCourses([]);
          setReports([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Learners shown in the dropdown, narrowed to the picked course when one is set.
  const learnerOptions = courseId
    ? students.filter((s) => s.courseId === courseId)
    : students;

  async function handleSubmit() {
    setFeedback(null);
    const learner = students.find(
      (s) => s.learnerId === learnerId && (!courseId || s.courseId === courseId),
    );
    const finalCourseId = courseId || learner?.courseId;
    if (!learner || !finalCourseId) {
      setFeedback({ type: 'error', text: 'Please select a learner before submitting.' });
      return;
    }
    setSubmitting(true);
    try {
      await trainerApi.createReport({ learnerId: learner.learnerId, courseId: finalCourseId, remarks });
      setFeedback({ type: 'success', text: `Report submitted for ${learner.name}.` });
      setCourseId('');
      setLearnerId('');
      setRemarks('');
      await loadReports();
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to submit report. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Institution"
        title="Institution Reports"
        subtitle="Submit weekly/bi-weekly updates to your Institution Head."
      />

      <Card className="p-6 sm:p-8">
        <SectionHeader
          icon={Building2}
          tone="info"
          title="Generate Report"
          caption="Select timeframe and generate automated progress stats."
        />

        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="gt-label">Select Course</label>
              <select
                value={courseId}
                onChange={(e) => {
                  setCourseId(e.target.value);
                  setLearnerId('');
                }}
                className="gt-input appearance-none"
              >
                <option value="">All Courses</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="gt-label">Select Learner</label>
              <select
                value={learnerId}
                onChange={(e) => setLearnerId(e.target.value)}
                className="gt-input appearance-none"
              >
                <option value="">{loading ? 'Loading learners…' : 'Choose a learner'}</option>
                {learnerOptions.map((s) => (
                  <option key={`${s.learnerId}-${s.courseId}`} value={s.learnerId}>
                    {s.name} — {s.course}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="gt-label">Additional Notes for Head</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="gt-input"
              placeholder="Highlight any specific student achievements or issues…"
            />
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-[var(--gt-border-2)] bg-[var(--gt-surface-2)] p-4">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[var(--gt-success)]" />
            <p className="text-sm text-[var(--gt-text-2)]">Automated stats (Enrollment count, avg score, completion rate) will be automatically attached.</p>
          </div>

          {feedback && (
            <div
              className="flex items-center gap-3 rounded-xl border p-4"
              style={
                feedback.type === 'success'
                  ? { borderColor: 'rgba(52,211,153,0.3)', background: 'rgba(52,211,153,0.1)' }
                  : { borderColor: 'rgba(251,113,133,0.3)', background: 'rgba(251,113,133,0.1)' }
              }
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[var(--gt-success)]" />
              ) : (
                <XCircle className="h-5 w-5 flex-shrink-0 text-[var(--gt-danger)]" />
              )}
              <p className="text-sm" style={{ color: feedback.type === 'success' ? 'var(--gt-success)' : 'var(--gt-danger)' }}>
                {feedback.text}
              </p>
            </div>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="gt-btn gt-btn--primary flex-1"
            >
              <Send className="h-4 w-4" /> {submitting ? 'Submitting…' : 'Submit to Institution Head'}
            </button>
          </div>
        </div>
      </Card>

      <Card className="p-6 sm:p-8">
        <SectionHeader
          icon={FileText}
          tone="accent"
          title="Generated Reports"
          caption="Reports you have already submitted."
        />

        {loading ? (
          <Loading label="Loading reports…" />
        ) : reports.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No reports generated yet"
            detail="Submit a report above and it will appear here."
          />
        ) : (
          <div className="gt-stagger space-y-3">
            {reports.map((r) => (
              <div key={r.id} className="gt-card p-5">
                <div className="mb-2 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h4 className="truncate font-semibold text-[var(--gt-text)]">{r.learner}</h4>
                    <p className="truncate text-xs text-[var(--gt-text-3)]">{r.course}</p>
                  </div>
                  <span className="whitespace-nowrap text-xs font-semibold text-[var(--gt-text-2)]">
                    {formatDate(r.createdAt)}
                  </span>
                </div>
                {r.remarks && <p className="text-sm text-[var(--gt-text-2)]">{r.remarks}</p>}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
