'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ChevronRight, Clock, ListChecks, PlayCircle, Upload } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '../components/TrainerShared';
import { getCourse as apiGetCourse, getVideos as apiGetVideos } from '@/services/trainerApi';

type Course = any;
type Video = any;

export function VideoListScreen({ courseId, embedded = false }: { courseId: string; embedded?: boolean }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([apiGetCourse(courseId), apiGetVideos(courseId)])
      .then(([courseRes, videosRes]) => {
        if (!mounted) return;
        setCourse(courseRes.data ?? courseRes);
        setVideos(videosRes.data ?? videosRes);
      })
      .catch(err => console.error(err))
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [courseId]);

  if (loading) return <div className="py-10 text-center"><div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" /></div>;

  const content = (
    <div className="space-y-4">
      {videos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-700 p-12 text-center bg-gray-800/20">
          <PlayCircle className="mx-auto h-12 w-12 text-[#7dab52] mb-3" />
          <h3 className="text-lg font-medium text-[#0f3d1a]">No lessons added yet</h3>
          <p className="mt-1 text-sm text-[#1a6b2e] mb-6">Upload your first video to start building the curriculum.</p>
          <Link href={`/trainer/courses/${courseId}/videos/upload`}>
            <Button variant="ghost" className="border border-gray-700"><Upload className="mr-2 h-4 w-4" /> Upload Lesson</Button>
          </Link>
        </div>
      ) : (
        videos.map((video) => (
          <div key={video.id} className="group flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-2xl border border-gray-700/50 bg-gray-800/40 p-5 transition-all hover:bg-gray-800/80 hover:border-gray-600">
            <div className="flex items-start gap-5">
              <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg bg-gray-900 border border-gray-700 group-hover:border-sky-500/50 transition-colors relative overflow-hidden">
                <PlayCircle className="h-8 w-8 text-sky-500/70 z-10 relative" />
                <div className="absolute inset-0 bg-black/40" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-700 text-xs font-bold text-[#1a6b2e]">{video.position || video.order || 1}</span>
                  <h3 className="text-base font-bold text-[#0f3d1a] group-hover:text-orange-300 transition-colors">{video.title}</h3>
                </div>
                <p className="mt-1.5 text-sm text-[#1a6b2e] line-clamp-2">{video.description}</p>
                <div className="mt-2 flex items-center gap-4 text-xs font-medium text-[#7dab52]">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-[#1a6b2e]" /> {video.duration}</span>
                  <span className="flex items-center gap-1"><ListChecks className="h-3.5 w-3.5 text-emerald-400" /> Assessments Active</span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 md:flex-col lg:flex-row border-t border-gray-700/50 pt-4 md:border-0 md:pt-0">
              <Link href={`/trainer/courses/${courseId}/videos/${video.id}/mcqs`}><Button size="sm" variant="ghost" className="bg-gray-900/50 hover:bg-gray-700 hover:text-[#0f3d1a] border border-gray-700">MCQs</Button></Link>
              <Link href={`/trainer/courses/${courseId}/videos/${video.id}/quiz`}><Button size="sm" variant="ghost" className="bg-gray-900/50 hover:bg-gray-700 hover:text-[#0f3d1a] border border-gray-700">Quiz</Button></Link>
              <Link href={`/trainer/courses/${courseId}/videos/${video.id}/summary-task`}><Button size="sm" variant="ghost" className="bg-gray-900/50 hover:bg-gray-700 hover:text-[#0f3d1a] border border-gray-700">Summary</Button></Link>
            </div>
          </div>
        ))
      )}
    </div>
  );

  if (embedded) return content;

  return (
    <div className="space-y-8 pb-8">
      <div className="flex items-center gap-2 text-sm text-[#1a6b2e] mb-4">
        <Link href={`/trainer/courses/${courseId}`} className="hover:text-[#0f3d1a] transition-colors">Course Details</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-[#1a6b2e]">Curriculum Content</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <PageHeader title="Curriculum Manager" caption={`Organize lessons and assessments for ${course?.title || 'this course'}.`} />
        {videos.length > 0 && (
          <Link href={`/trainer/courses/${courseId}/videos/upload`}>
            <Button className="shadow-lg"><Upload className="mr-2 h-4 w-4" /> Add Lesson</Button>
          </Link>
        )}
      </div>

      {content}
    </div>
  );
}

export default VideoListScreen;
