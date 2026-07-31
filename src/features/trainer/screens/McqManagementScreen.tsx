'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { ChevronRight, ListChecks, Plus } from 'lucide-react';
import { PageHeader, Card, SectionHeader } from '@/components/trainer/ui';
import { getVideos as apiGetVideos, addMcq as apiAddMcq, getMcqs as apiGetMcqs } from '@/services/trainerApi';
import { useToastStore } from '@/store/toast-store';
import { getErrorMessage } from '@/utils/errorParser';

type Video = any;

export function McqManagementScreen({ courseId, videoId }: { courseId: string; videoId: string }) {
  const [video, setVideo] = useState<Video | null>(null);
  const [mcqs, setMcqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToastStore();

  useEffect(() => {
    apiGetVideos(courseId).then((res) => {
      const list = res.data ?? res;
      setVideo((list || []).find((x: any) => String(x.id) === String(videoId)) || null);
    }).catch(err => console.error(err));

    fetchMcqs();
  }, [courseId, videoId]);

  function fetchMcqs() {
    apiGetMcqs(videoId).then((res) => {
      setMcqs(res.data ?? res);
    }).catch(err => console.error(err));
  }

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);

    const prompt = fd.get('prompt') as string;
    const options = [fd.get('opt1'), fd.get('opt2'), fd.get('opt3'), fd.get('opt4')].map(String);
    const correctIndex = Number(fd.get('correct'));
    const correctAnswer = options[correctIndex - 1];

    try {
      setLoading(true);
      await apiAddMcq(videoId, { prompt, options, correctAnswer: [correctAnswer], points: 5 });
      showToast('MCQ added successfully.', 'success');
      form.reset();
      fetchMcqs();
    } catch (err) {
      console.error('Add MCQ failed', err);
      showToast(getErrorMessage(err, 'Add MCQ failed. Please try again.'), 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 pb-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-[#1a6b2e] mb-4">
        <Link href={`/trainer/courses/${courseId}/videos`} className="hover:text-[#0f3d1a] transition-colors">Curriculum</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-[#1a6b2e]">MCQ Assessment</span>
      </div>

      <PageHeader
        eyebrow="Trainer Workspace"
        title="Multiple Choice Questions"
        subtitle={`Add automated assessments for: ${video?.title ?? 'Lesson'}`}
      />

      <Card className="p-6">
        <SectionHeader icon={ListChecks} title="Create New MCQ" caption="Questions are randomized for students." />

        <form className="space-y-6" onSubmit={handleAdd}>
          <div>
            <label className="gt-label">Question Prompt</label>
            <textarea className="gt-input" name="prompt" placeholder="What is the main advantage of using Flexbox?" required />
          </div>

          <div className="grid gap-6 rounded-2xl border border-[var(--gt-border)] bg-[var(--gt-bg-soft)] p-5 sm:grid-cols-2">
            {[1, 2, 3, 4].map((num) => (
              <div key={num}>
                <label className="gt-label">Option {num}</label>
                <div className="relative">
                  <div className="absolute left-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-xs font-bold text-[#1a6b2e]">{num}</div>
                  <TextInput name={`opt${num}`} placeholder={`Enter answer option ${num}`} className="pl-12" required />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="gt-label">Correct Answer</label>
              <select className="gt-input" name="correct" defaultValue="1" required>
                {[1, 2, 3, 4].map(num => <option key={num} value={num}>Option {num} is correct</option>)}
              </select>
            </div>
            <Button type="submit" size="lg" disabled={loading} className="shadow-lg shadow-sky-500/20">
              <Plus className="mr-2 h-4 w-4" />{loading ? 'Saving...' : 'Add Question to Bank'}
            </Button>
          </div>
        </form>
      </Card>

      {mcqs.length > 0 && (
        <Card className="p-6">
          <SectionHeader
            icon={ListChecks}
            tone="success"
            title="Existing MCQs"
            caption={`There are ${mcqs.length} multiple choice questions for this lesson.`}
          />
          <div className="space-y-3">
            {mcqs.map((mcq, idx) => (
              <div key={mcq.id} className="p-5 rounded-xl border border-gray-800 bg-gray-800/40">
                <p className="font-semibold text-[#0f3d1a] mb-3 text-sm">Q{idx + 1}. {mcq.prompt}</p>
                <div className="grid grid-cols-2 gap-3">
                  {(mcq.options || []).map((opt: string, i: number) => {
                    const isCorrect = (mcq.correctAnswer || []).includes(opt);
                    return (
                      <div key={i} className={`text-xs p-2.5 rounded-lg border ${isCorrect ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200' : 'border-gray-700 bg-gray-800 text-[#1a6b2e]'}`}>
                        {opt} {isCorrect && '(Correct)'}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
