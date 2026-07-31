'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle } from '@/components/ui/Card';
import { Field, SelectInput, TextArea, TextInput } from '@/components/ui/Field';
import { PageHeader } from '../components/TrainerShared';
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

      <PageHeader title="Multiple Choice Questions" caption={`Add automated assessments for: ${video?.title ?? 'Lesson'}`} />

      <Card className="border-gray-700/50 bg-gray-900/60 shadow-xl backdrop-blur-sm p-8">
        <CardTitle title="Create New MCQ" caption="Questions are randomized for students." />

        <form className="mt-6 space-y-6" onSubmit={handleAdd}>
          <Field label="Question Prompt"><TextArea name="prompt" className="min-h-[100px]" placeholder="What is the main advantage of using Flexbox?" required /></Field>

          <div className="grid gap-6 sm:grid-cols-2 rounded-xl border border-gray-800 bg-gray-900/50 p-6">
            {[1, 2, 3, 4].map((num) => (
              <Field key={num} label={`Option ${num}`}>
                <div className="relative">
                  <div className="absolute left-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-xs font-bold text-[#1a6b2e]">{num}</div>
                  <TextInput name={`opt${num}`} placeholder={`Enter answer option ${num}`} className="pl-12" required />
                </div>
              </Field>
            ))}
          </div>

          <div className="flex items-end gap-6">
            <div className="flex-1">
              <Field label="Correct Answer">
                <SelectInput name="correct" defaultValue="1" required className="py-3">
                  {[1, 2, 3, 4].map(num => <option key={num} value={num}>Option {num} is correct</option>)}
                </SelectInput>
              </Field>
            </div>
            <Button type="submit" size="lg" disabled={loading} className="shadow-lg shadow-sky-500/20">
              <Plus className="mr-2 h-4 w-4" />{loading ? 'Saving...' : 'Add Question to Bank'}
            </Button>
          </div>
        </form>
      </Card>

      {mcqs.length > 0 && (
        <Card className="border-gray-700/50 bg-gray-900/60 shadow-xl backdrop-blur-sm p-8">
          <CardTitle title="Existing MCQs" caption={`There are ${mcqs.length} multiple choice questions for this lesson.`} />
          <div className="mt-6 space-y-4">
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
