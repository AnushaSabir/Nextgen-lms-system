import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { BookOpen, PlusCircle } from 'lucide-react'
import { createCourse } from '../actions'

export default async function AdminCoursesPage() {
  const supabase = await createClient()
  
  // Fetch existing courses
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">Manage Courses</h1>
        <p className="text-gray-400 text-sm">Add new courses to the catalog and manage existing ones.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Course Form */}
        <div className="lg:col-span-1">
          <div className="bg-[#001A3B]/40 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-[#002855]">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <PlusCircle className="text-[#FF6B00]" /> Add New Course
            </h2>
            <form action={createCourse} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Course Title</label>
                <input required type="text" name="title" className="w-full px-4 py-3 bg-[#001229] border border-[#002855] rounded-xl text-white focus:outline-none focus:border-[#FF6B00] transition-colors" placeholder="e.g. Advanced Networking" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description</label>
                <textarea name="description" rows={3} className="w-full px-4 py-3 bg-[#001229] border border-[#002855] rounded-xl text-white focus:outline-none focus:border-[#FF6B00] transition-colors" placeholder="Brief course description..."></textarea>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Instructor Name</label>
                <input required type="text" name="instructor" className="w-full px-4 py-3 bg-[#001229] border border-[#002855] rounded-xl text-white focus:outline-none focus:border-[#FF6B00] transition-colors" placeholder="e.g. John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Modules</label>
                <input required type="number" name="total_modules" min="1" className="w-full px-4 py-3 bg-[#001229] border border-[#002855] rounded-xl text-white focus:outline-none focus:border-[#FF6B00] transition-colors" placeholder="10" />
              </div>
              <button type="submit" className="w-full mt-4 bg-[#FF6B00] hover:bg-[#E66000] text-white px-4 py-3 rounded-xl font-bold text-sm transition-colors shadow-lg">
                Publish Course
              </button>
            </form>
          </div>
        </div>

        {/* Existing Courses List */}
        <div className="lg:col-span-2">
          <div className="bg-[#001A3B]/40 backdrop-blur-md rounded-3xl shadow-lg border border-[#002855] overflow-hidden">
            <div className="p-6 border-b border-[#002855] bg-[#000E1F]/50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="text-[#00A3FF]" /> Course Catalog
              </h2>
            </div>
            <div className="p-0">
              {courses && courses.length > 0 ? (
                <ul className="divide-y divide-[#002855]">
                  {courses.map((course) => (
                    <li key={course.id} className="p-6 hover:bg-[#001A3B] transition-colors">
                      <h3 className="text-lg font-bold text-white mb-1">{course.title}</h3>
                      <p className="text-sm text-gray-400 mb-3">{course.description}</p>
                      <div className="flex gap-4 text-xs font-medium text-gray-500">
                        <span className="bg-[#001229] px-2 py-1 rounded border border-[#002855]">Instructor: {course.instructor}</span>
                        <span className="bg-[#001229] px-2 py-1 rounded border border-[#002855]">{course.total_modules} Modules</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-12 text-center text-gray-500 font-medium">
                  No courses found. Add a new course to see it here.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
