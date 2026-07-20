'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { ChevronRight, FileText } from 'lucide-react';
import { PageHeader, Card, SectionHeader } from '@/components/trainer/ui';
import { getVideos as apiGetVideos, addSummaryTask as apiAddSummaryTask, getSummaryTasks as apiGetSummaryTasks } from '@/services/trainerApi';
import { useToastStore } from '@/store/toast-store';
import { getErrorMessage } from '@/utils/errorParser';

type Video = any;

export function SummaryTaskScreen({ courseId, videoId }: { courseId: string; videoId: string }) {
  const [video, setVideo] = useState<Video | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToastStore();

  useEffect(() => {
    apiGetVideos(courseId).then((res) => {
      setVideo((res.data || res || []).find((x: any) => String(x.id) === String(videoId)) || null);
    }).catch(console.error);

    fetchTasks();
  }, [courseId, videoId]);

  function fetchTasks() {
    apiGetSummaryTasks(videoId).then((res) => {
      setTasks(res.data ?? res);
    }).catch(console.error);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    try {
      setLoading(true);
      await apiAddSummaryTask(videoId, {
        prompt: fd.get('prompt'),
        minimumWords: Number(fd.get('minimumWords')) || 150,
        passingCriteria: fd.get('passingCriteria'),
        points: 10
      });
      showToast('Summary task configured successfully.', 'success');
      (e.target as HTMLFormElement).reset();
      fetchTasks();
    } catch (err) {
      console.error(err);
      showToast(getErrorMessage(err, 'Save summary failed.'), 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--gt-text-3)]">
        <Link href={`/trainer/courses/${courseId}/videos`} className="transition-colors hover:text-[var(--gt-text)]">Curriculum</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-[var(--gt-text-2)]">Summary Task</span>
      </div>

      <PageHeader
        eyebrow="Trainer Workspace"
        title="Written Summary Task"
        subtitle={`Configure essay/summary requirements for: ${video?.title ?? 'Lesson'}`}
      />

      <Card className="p-6">
        <SectionHeader icon={FileText} title="Configure Summary Task" caption="Set the prompt, minimum length, and passing rubric." />

        <form className="space-y-6" onSubmit={handleSave}>
          <div>
            <label className="gt-label">Task Instructions & Prompt</label>
            <textarea className="gt-input min-h-[120px]" name="prompt" placeholder="Summarize the key architectural decisions discussed in this lesson…" required />
          </div>

          <div className="grid gap-6 sm:grid-cols-[200px_1fr]">
            <div>
              <label className="gt-label">Minimum Words</label>
              <input className="gt-input" name="minimumWords" type="number" min={50} defaultValue={150} required />
            </div>
            <div>
              <label className="gt-label">Passing Criteria / Rubric</label>
              <input className="gt-input" name="passingCriteria" placeholder="Must include mentions of React, state, and props…" required />
            </div>
          </div>

          <div className="border-t border-[var(--gt-border)] pt-6">
            <button type="submit" disabled={loading} className="gt-btn gt-btn--primary w-full sm:w-auto">
              <FileText className="h-4 w-4" />{loading ? 'Saving Task…' : 'Configure Summary Task'}
            </button>
          </div>
        </form>
      </Card>

      {tasks.length > 0 && (
        <Card className="p-6">
          <SectionHeader
            icon={FileText}
            tone="info"
            title="Configured Summary Tasks"
            caption="Students must complete these tasks to pass the lesson."
          />
          <div className="space-y-3">
            {tasks.map((task, idx) => (
              <div key={task.id} className="gt-card p-5">
                <p className="mb-3 text-sm font-semibold text-[var(--gt-text)]">Task {idx + 1}. {task.prompt}</p>
                <div className="flex flex-wrap gap-4 rounded-lg border border-[var(--gt-border)] bg-[var(--gt-surface)] p-3 text-sm text-[var(--gt-text-2)]">
                  <div><span className="mr-2 font-medium text-[var(--gt-text-3)]">Minimum Words:</span> {task.correctAnswer?.minimumWords || 150}</div>
                  <div><span className="mr-2 font-medium text-[var(--gt-text-3)]">Passing Criteria:</span> {task.correctAnswer?.passingCriteria || 'N/A'}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
