'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { CheckCircle2, ChevronRight, ShieldCheck, Upload, Video } from 'lucide-react';
import { PageHeader, Card, SectionHeader } from '@/components/trainer/ui';
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
        eyebrow="Trainer Workspace"
        title="Upload Video Lesson"
        subtitle={course ? `Add HD content to module: ${course.title}` : 'Loading course context…'}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_350px]">
        <Card className="p-6">
          <SectionHeader
            icon={Video}
            title="Lesson Details"
            caption="Provide clear titles and descriptions for better student navigation."
          />

          <form className="space-y-6" onSubmit={handleUpload}>
            <div>
              <label className="gt-label">Lesson Title</label>
              <input className="gt-input" name="title" placeholder="e.g. Understanding CSS Grid Layouts" required />
            </div>
            <div>
              <label className="gt-label">Lesson Description</label>
              <textarea className="gt-input" name="description" placeholder="Briefly explain what this specific lesson covers." required />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 pt-4 border-t border-gray-800">
              <Field label="Video File (MP4/WebM)">
                <TextInput name="videoFile" type="file" accept="video/*" required className="file:mr-4 file:rounded-full file:border-0 file:bg-sky-500/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-sky-400" />
              </Field>
              <Field label="Custom Thumbnail">
                <TextInput name="thumbnail" type="file" accept="image/*" required className="file:mr-4 file:rounded-full file:border-0 file:bg-gray-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#1a6b2e]" />
              </Field>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="gt-label">Duration</label>
                <input className="gt-input" name="duration" placeholder="e.g. 15:30 or 28 min" required />
              </div>
              <div>
                <label className="gt-label">Sequence Order</label>
                <input key={`pos-${course?.videos?.length ?? 0}`} className="gt-input" name="position" type="number" min={1} defaultValue={(course?.videos?.length ?? 0) + 1} required />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-800">
              <Button type="submit" size="lg" disabled={loading} className="w-full shadow-lg shadow-sky-500/20">
                <Upload className="mr-2 h-4 w-4" />{loading ? 'Uploading & Processing...' : 'Upload Lesson'}
              </Button>
            </div>
          </form>
        </Card>

        <Card className="h-fit p-6 xl:sticky xl:top-6">
          <SectionHeader
            icon={ShieldCheck}
            title="Content Guidelines"
            caption="Ensure your videos meet platform standards."
          />
          <div className="space-y-2.5">
            {videoRequirements.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-[var(--gt-border)] bg-[var(--gt-surface)] p-3.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-[var(--gt-accent)]" />
                <span className="text-sm leading-snug text-[var(--gt-text-2)]">{item}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
