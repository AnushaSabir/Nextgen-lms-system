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
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-[#0f3d1a] mb-2">Institution Reports</h1>
        <p className="text-[#1a6b2e]">Submit weekly/bi-weekly updates to your Institution Head.</p>
      </div>

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
            <h2 className="text-2xl font-bold text-[#0f3d1a]">Generate Report</h2>
            <p className="text-sm text-[#1a6b2e]">Select timeframe and generate automated progress stats.</p>
          </div>

        <div className="space-y-6 relative z-10">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#64748b] uppercase">Report Type</label>
              <select className="w-full bg-[#c8e6c9] border border-[#1e293b] rounded-xl px-4 py-3 text-[#0f3d1a] focus:outline-none focus:border-[#5E6F58] transition-all appearance-none">
                <option>Weekly Update</option>
                <option>Bi-Weekly Update</option>
                <option>Monthly Overview</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#64748b] uppercase">Select Course</label>
              <select className="w-full bg-[#c8e6c9] border border-[#1e293b] rounded-xl px-4 py-3 text-[#0f3d1a] focus:outline-none focus:border-[#5E6F58] transition-all appearance-none">
                <option>Advanced Web Dev</option>
                <option>UI/UX Masterclass</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#64748b] uppercase">Additional Notes for Head</label>
            <textarea 
              className="w-full h-32 bg-[#c8e6c9] border border-[#1e293b] rounded-xl p-4 text-sm text-[#0f3d1a] placeholder:text-[#475569] focus:outline-none focus:border-[#5E6F58] transition-all resize-none"
              placeholder="Highlight any specific student achievements or issues..."
            ></textarea>
          </div>

          <div className="bg-[#1e293b]/50 p-4 rounded-xl border border-[#334155] flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <p className="text-sm text-[#1a6b2e]">Automated stats (Enrollment count, avg score, completion rate) will be automatically attached.</p>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <button className="flex-1 flex justify-center items-center gap-2 bg-[#5E6F58] hover:bg-[#ea580c] text-[#0f3d1a] py-4 rounded-xl font-bold shadow-[0_0_20px_rgba(240,89,31,0.3)] transition-all active:scale-95">
              <Send className="w-5 h-5" /> Submit to Institution Head
            </button>
            <button className="p-4 bg-[#1e293b] hover:bg-[#334155] rounded-xl text-[#0f3d1a] transition-colors border border-[#334155]" title="Preview Report">
              <FileText className="w-5 h-5" />
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
