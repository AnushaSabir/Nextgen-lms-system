import React from 'react'
import { BookOpen, PlayCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

export default async function MyCoursesPage() {
  const supabase = await createClient()
  
  // Fetch available courses from Supabase
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })

  const colors = [
    { bg: 'bg-[#FF6B00]', text: 'text-[#FF6B00]' },
    { bg: 'bg-[#00A3FF]', text: 'text-[#00A3FF]' },
    { bg: 'bg-[#00E5FF]', text: 'text-[#00E5FF]' },
  ]

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">Available Courses</h1>
        <p className="text-gray-400 text-sm">Explore and enroll in cutting-edge IT courses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses && courses.length > 0 ? courses.map((course, idx) => {
          const colorTheme = colors[idx % colors.length]
          return (
            <div key={course.id} className="bg-[#001A3B]/40 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-[#002855] hover:border-gray-500/30 transition-all duration-300 group flex flex-col">
              <div className={`w-14 h-14 rounded-2xl ${colorTheme.bg}/10 flex items-center justify-center mb-6`}>
                <BookOpen size={28} className={colorTheme.text} />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">{course.title}</h2>
              <p className="text-sm text-gray-400 mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                  {course.instructor.charAt(0)}
                </span>
                {course.instructor}
              </p>
              
              <div className="mb-6 flex-1">
                <p className="text-sm text-gray-300 line-clamp-3">{course.description}</p>
                <p className="text-xs text-gray-500 mt-4 font-bold uppercase tracking-widest">{course.total_modules} Modules</p>
              </div>

              <button className={`w-full py-3 rounded-xl bg-[#001229] text-white font-bold text-sm border border-[#002855] hover:${colorTheme.bg} hover:border-transparent transition-all duration-300 flex items-center justify-center gap-2 shadow-lg mt-auto`}>
                <PlayCircle size={18} />
                Enroll Now
              </button>
            </div>
          )
        }) : (
           <div className="col-span-full p-12 text-center text-gray-500 font-medium bg-[#001A3B]/40 rounded-3xl border border-[#002855]">
             No courses have been added by the admin yet.
           </div>
        )}
      </div>
    </div>
  )
}
