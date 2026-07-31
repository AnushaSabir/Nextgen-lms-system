'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { ChevronRight, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field, TextArea, TextInput } from '@/components/ui/Field';
import { PageHeader } from '../components/TrainerShared';
import { getVideos as apiGetVideos, addQuiz as apiAddQuiz, getQuizzes as apiGetQuizzes } from '@/services/trainerApi';
import { useToastStore } from '@/store/toast-store';
import { getErrorMessage } from '@/utils/errorParser';

type Video = any;

export function QuizManagementScreen({ courseId, videoId }: { courseId: string; videoId: string }) {
  const [video, setVideo] = useState<Video | null>(null);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToastStore();

  useEffect(() => {
    apiGetVideos(courseId).then((res) => {
      setVideo((res.data || res || []).find((x: any) => String(x.id) === String(videoId)) || null);
    }).catch(console.error);

    fetchQuizzes();
  }, [courseId, videoId]);

  function fetchQuizzes() {
    apiGetQuizzes(videoId).then((res) => {
      setQuizzes(res.data ?? res);
    }).catch(console.error);
  }

  async function handleAddQuiz(e: FormEvent) {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    try {
      setLoading(true);
      await apiAddQuiz(videoId, {
        prompt: fd.get('prompt'),
        correctAnswer: fd.get('correctAnswer'),
        points: Number(fd.get('points')) || 5
      });
      showToast('Quiz question added successfully.', 'success');
      (e.target as HTMLFormElement).reset();
      fetchQuizzes();
    } catch (err) {
      console.error(err);
      showToast(getErrorMessage(err, 'Add quiz failed.'), 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 pb-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-[#1a6b2e] mb-4">
        <Link href={`/trainer/courses/${courseId}/videos`} className="hover:text-[#0f3d1a] transition-colors">Curriculum</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-[#1a6b2e]">Short Quiz</span>
      </div>

      <PageHeader title="Quiz Questions" caption={`Add conceptual questions for: ${video?.title ?? 'Lesson'}`} />

      <Card className="border-gray-700/50 bg-gray-900/60 shadow-xl p-8">
        <form className="space-y-6" onSubmit={handleAddQuiz}>
          <Field label="Question Prompt"><TextArea name="prompt" placeholder="Write a short answer question..." required /></Field>
          <Field label="Expected Answer Key"><TextArea name="correctAnswer" placeholder="Provide the key points expected in the answer..." required /></Field>

          <div className="flex items-end gap-6">
            <div className="w-32">
              <Field label="Points"><TextInput name="points" type="number" min={1} defaultValue={5} required /></Field>
            </div>
            <Button type="submit" size="lg" disabled={loading}>
              <ListChecks className="mr-2 h-4 w-4" />{loading ? 'Saving...' : 'Add Quiz Question'}
            </Button>
          </div>
        </form>
      </Card>

      {quizzes.length > 0 && (
        <Card className="border-gray-700/50 bg-gray-900/60 shadow-xl p-8 mt-8">
          <div className="flex flex-col gap-1 mb-6">
            <h3 className="text-xl font-bold text-[#0f3d1a] tracking-tight">Existing Quizzes</h3>
            <p className="text-sm text-[#1a6b2e]">There are {quizzes.length} short answer questions for this lesson.</p>
          </div>
          <div className="space-y-4">
            {quizzes.map((quiz, idx) => (
              <div key={quiz.id} className="p-5 rounded-xl border border-gray-800 bg-gray-800/40">
                <p className="font-semibold text-[#0f3d1a] mb-3 text-sm">Q{idx + 1}. {quiz.prompt}</p>
                <div className="mt-2 text-sm text-[#1a6b2e]">
                  <span className="text-[#7dab52] font-medium mr-2">Expected Answer:</span>
                  {(quiz.correctAnswer || []).join(', ')}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
