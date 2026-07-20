'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { ChevronRight, ListChecks } from 'lucide-react';
import { PageHeader, Card, SectionHeader } from '@/components/trainer/ui';
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
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--gt-text-3)]">
        <Link href={`/trainer/courses/${courseId}/videos`} className="transition-colors hover:text-[var(--gt-text)]">Curriculum</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-[var(--gt-text-2)]">Short Quiz</span>
      </div>

      <PageHeader
        eyebrow="Trainer Workspace"
        title="Quiz Questions"
        subtitle={`Add conceptual questions for: ${video?.title ?? 'Lesson'}`}
      />

      <Card className="p-6">
        <SectionHeader icon={ListChecks} title="Create New Quiz" caption="Short answer questions with an expected answer key." />

        <form className="space-y-6" onSubmit={handleAddQuiz}>
          <div>
            <label className="gt-label">Question Prompt</label>
            <textarea className="gt-input" name="prompt" placeholder="Write a short answer question…" required />
          </div>
          <div>
            <label className="gt-label">Expected Answer Key</label>
            <textarea className="gt-input" name="correctAnswer" placeholder="Provide the key points expected in the answer…" required />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="w-full sm:w-32">
              <label className="gt-label">Points</label>
              <input className="gt-input" name="points" type="number" min={1} defaultValue={5} required />
            </div>
            <button type="submit" disabled={loading} className="gt-btn gt-btn--primary">
              <ListChecks className="h-4 w-4" />{loading ? 'Saving…' : 'Add Quiz Question'}
            </button>
          </div>
        </form>
      </Card>

      {quizzes.length > 0 && (
        <Card className="p-6">
          <SectionHeader
            icon={ListChecks}
            tone="info"
            title="Existing Quizzes"
            caption={`There are ${quizzes.length} short answer questions for this lesson.`}
          />
          <div className="space-y-3">
            {quizzes.map((quiz, idx) => (
              <div key={quiz.id} className="gt-card p-5">
                <p className="mb-3 text-sm font-semibold text-[var(--gt-text)]">Q{idx + 1}. {quiz.prompt}</p>
                <div className="text-sm text-[var(--gt-text-2)]">
                  <span className="mr-2 font-medium text-[var(--gt-text-3)]">Expected Answer:</span>
                  {Array.isArray(quiz.correctAnswer) ? quiz.correctAnswer.join(', ') : (quiz.correctAnswer ?? '—')}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
