'use client';

import Link from 'next/link';
import { BookOpen, Plus, Video as VideoIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle } from '@/components/ui/Card';
import { StatusBadge } from './TrainerShared';

type Course = any;

export function CoursesTable({ compact = false, courses }: { compact?: boolean; courses?: Course[] }) {
  if (!courses?.length) {
    return (
      <Card className="border-gray-700/50 bg-gray-800/30 flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-gray-800 p-4 border border-gray-700 mb-4">
          <BookOpen className="h-8 w-8 text-[#1a6b2e]" />
        </div>
        <h3 className="text-lg font-semibold text-[#0f3d1a]">No Courses Found</h3>
        <p className="mt-2 text-sm text-[#1a6b2e] max-w-sm mb-6">You haven't created any courses yet. Start building your curriculum today.</p>
        <Link href="/trainer/create-course">
          <Button><Plus className="mr-2 h-4 w-4" /> Create First Course</Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="border-gray-700/50 bg-gray-800/30">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle title="Course Directory" caption={compact ? 'Recent courses.' : 'Manage, edit, and publish your educational content.'} />
        <Link href="/trainer/create-course">
          <Button variant="ghost" className="bg-gray-800 hover:bg-gray-700 border border-gray-600"><Plus className="mr-2 h-4 w-4" /> New Course</Button>
        </Link>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {courses.map((course) => (
          <div key={course.id} className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-700/50 bg-gray-900/50 p-6 transition-all duration-300 hover:border-gray-600 hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/80 pointer-events-none" />

            <div className="relative z-10 flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400">{course.category}</span>
                  <span className="h-1 w-1 rounded-full bg-gray-600" />
                  <span className="text-xs text-[#1a6b2e] capitalize">{course.level}</span>
                </div>
                <h3 className="text-lg font-bold text-[#0f3d1a] line-clamp-1 group-hover:text-orange-100 transition-colors">{course.title}</h3>
              </div>
              <StatusBadge status={course.status} />
            </div>

            <p className="relative z-10 mt-4 line-clamp-2 text-sm leading-relaxed text-[#1a6b2e] flex-grow">
              {course.description}
            </p>

            <div className="relative z-10 mt-6 pt-4 border-t border-gray-800/80 flex flex-wrap items-center gap-3">
              <Link href={`/trainer/courses/${course.id}`} className="flex-1">
                <Button size="sm" variant="ghost" className="w-full bg-transparent border border-gray-700 hover:bg-gray-800 hover:text-[#0f3d1a]">Overview</Button>
              </Link>
              <Link href={`/trainer/courses/${course.id}/videos`} className="flex-1">
                <Button size="sm" className="w-full bg-gray-800 text-[#0f3d1a] hover:bg-gray-700 border-none"><VideoIcon className="mr-2 h-3.5 w-3.5" /> Content</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
