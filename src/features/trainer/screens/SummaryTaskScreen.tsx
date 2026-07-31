'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { ChevronRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field, TextArea, TextInput } from '@/components/ui/Field';
import { PageHeader } from '../components/TrainerShared';
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
    <div className="space-y-8 pb-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-[#1a6b2e] mb-4">
        <Link href={`/trainer/courses/${courseId}/videos`} className="hover:text-[#0f3d1a] transition-colors">Curriculum</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-[#1a6b2e]">Summary Task</span>
      </div>

      <PageHeader title="Written Summary Task" caption={`Configure essay/summary requirements for: ${video?.title ?? 'Lesson'}`} />

      <Card className="border-gray-700/50 bg-gray-900/60 shadow-xl p-8">
        <form className="space-y-6" onSubmit={handleSave}>
          <Field label="Task Instructions & Prompt"><TextArea name="prompt" className="min-h-[120px]" placeholder="Summarize the key architectural decisions discussed in this lesson..." required /></Field>

          <div className="grid gap-6 sm:grid-cols-[200px_1fr]">
            <Field label="Minimum Words"><TextInput name="minimumWords" type="number" min={50} defaultValue={150} required /></Field>
            <Field label="Passing Criteria / Rubric"><TextInput name="passingCriteria" placeholder="Must include mentions of React, state, and props..." required /></Field>
          </div>

          <div className="pt-4 border-t border-gray-800">
            <Button type="submit" size="lg" disabled={loading} className="w-full sm:w-auto shadow-lg shadow-sky-500/20">
              <FileText className="mr-2 h-4 w-4" />{loading ? 'Saving Task...' : 'Configure Summary Task'}
            </Button>
          </div>
        </form>
      </Card>

      {tasks.length > 0 && (
        <Card className="border-gray-700/50 bg-gray-900/60 shadow-xl p-8 mt-8">
          <div className="flex flex-col gap-1 mb-6">
            <h3 className="text-xl font-bold text-[#0f3d1a] tracking-tight">Configured Summary Tasks</h3>
            <p className="text-sm text-[#1a6b2e]">Students must complete these tasks to pass the lesson.</p>
          </div>
          <div className="space-y-4">
            {tasks.map((task, idx) => (
              <div key={task.id} className="p-5 rounded-xl border border-gray-800 bg-gray-800/40">
                <p className="font-semibold text-[#0f3d1a] mb-3 text-sm">Task {idx + 1}. {task.prompt}</p>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-[#1a6b2e] bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
                  <div><span className="text-[#7dab52] font-medium mr-2">Minimum Words:</span> {task.correctAnswer?.minimumWords || 150}</div>
                  <div><span className="text-[#7dab52] font-medium mr-2">Passing Criteria:</span> {task.correctAnswer?.passingCriteria || 'N/A'}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
