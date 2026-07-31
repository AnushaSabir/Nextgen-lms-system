'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { ChevronRight, Upload } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle } from '@/components/ui/Card';
import { Field, TextArea, TextInput } from '@/components/ui/Field';
import { PageHeader, InfoList } from '../components/TrainerShared';
import { videoRequirements } from '../trainerModuleData';
import { getCourse as apiGetCourse, uploadVideo as apiUploadVideo } from '@/services/trainerApi';
import { useToastStore } from '@/store/toast-store';
import { getErrorMessage } from '@/utils/errorParser';

type Course = any;

export function VideoUploadScreen({ courseId }: { courseId: string }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToastStore();

  useEffect(() => {
    apiGetCourse(courseId).then((res) => setCourse(res.data ?? res)).catch((err) => console.error(err));
  }, [courseId]);

  async function handleUpload(e: FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    try {
      setLoading(true);
      await apiUploadVideo(courseId, fd);
      showToast('Video uploaded successfully.', 'success');
      window.location.href = `/trainer/courses/${courseId}/videos`;
    } catch (err) {
      console.error('Upload failed', err);
      showToast(getErrorMessage(err, 'Upload failed. Check validation requirements.'), 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 pb-8">
      <div className="flex items-center gap-2 text-sm text-[#1a6b2e] mb-4">
        <Link href={`/trainer/courses/${courseId}`} className="hover:text-[#0f3d1a] transition-colors">Course Details</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-[#1a6b2e]">Upload Content</span>
      </div>

      <PageHeader
        title="Upload Video Lesson"
        caption={course ? `Add HD content to module: ${course.title}` : 'Loading course context...'}
      />

      <div className="grid gap-8 xl:grid-cols-[1fr_350px]">
        <Card className="border-gray-700/50 bg-gray-900/60 shadow-xl backdrop-blur-sm p-8">
          <CardTitle title="Lesson Details" caption="Provide clear titles and descriptions for better student navigation." />

          <form className="mt-6 space-y-6" onSubmit={handleUpload}>
            <Field label="Lesson Title"><TextInput name="title" placeholder="e.g. Understanding CSS Grid Layouts" required className="py-3" /></Field>
            <Field label="Lesson Description"><TextArea name="description" className="min-h-[100px]" placeholder="Briefly explain what this specific lesson covers." required /></Field>

            <div className="grid gap-6 sm:grid-cols-2 pt-4 border-t border-gray-800">
              <Field label="Video File (MP4/WebM)">
                <TextInput name="videoFile" type="file" accept="video/*" required className="file:mr-4 file:rounded-full file:border-0 file:bg-sky-500/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-sky-400" />
              </Field>
              <Field label="Custom Thumbnail">
                <TextInput name="thumbnail" type="file" accept="image/*" required className="file:mr-4 file:rounded-full file:border-0 file:bg-gray-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#1a6b2e]" />
              </Field>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Duration"><TextInput name="duration" placeholder="e.g. 15:30 or 28 min" required /></Field>
              <Field label="Sequence Order"><TextInput name="position" type="number" min={1} defaultValue={(course?.videos?.length ?? 0) + 1} required /></Field>
            </div>

            <div className="pt-6 border-t border-gray-800">
              <Button type="submit" size="lg" disabled={loading} className="w-full shadow-lg shadow-sky-500/20">
                <Upload className="mr-2 h-4 w-4" />{loading ? 'Uploading & Processing...' : 'Upload Lesson'}
              </Button>
            </div>
          </form>
        </Card>

        <div className="space-y-6">
          <Card className="border-gray-700/50 bg-gray-800/40 sticky top-6">
            <CardTitle title="Content Guidelines" caption="Ensure your videos meet platform standards." />
            <InfoList items={videoRequirements} />
          </Card>
        </div>
      </div>
    </div>
  );
}
