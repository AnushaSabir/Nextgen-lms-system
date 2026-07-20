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
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-[var(--gt-text-3)]">
        <Link href={`/trainer/courses/${courseId}`} className="transition-colors hover:text-[var(--gt-text)]">Course Details</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-[var(--gt-text-2)]">Upload Content</span>
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

            <div className="grid gap-6 border-t border-[var(--gt-border)] pt-6 sm:grid-cols-2">
              <div>
                <label className="gt-label">Video File (MP4/WebM)</label>
                <input
                  className="gt-input file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--gt-accent-soft)] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-[var(--gt-accent-2)]"
                  name="videoFile"
                  type="file"
                  accept="video/*"
                  required
                />
              </div>
              <div>
                <label className="gt-label">Custom Thumbnail</label>
                <input
                  className="gt-input file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--gt-surface-2)] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-[var(--gt-text-2)]"
                  name="thumbnail"
                  type="file"
                  accept="image/*"
                  required
                />
              </div>
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

            <div className="border-t border-[var(--gt-border)] pt-6">
              <button type="submit" disabled={loading} className="gt-btn gt-btn--primary w-full">
                <Upload className="h-4 w-4" />{loading ? 'Uploading & Processing…' : 'Upload Lesson'}
              </button>
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
