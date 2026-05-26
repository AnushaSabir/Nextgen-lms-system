import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { Users, BookOpen } from 'lucide-react'

export default async function AdminStudentsPage() {
  const supabase = await createClient()
  
  // Fetch enrollments with course details
  const { data: enrollments, error } = await supabase
    .from('enrollments')
    .select('*, courses(title)')
    .order('enrolled_at', { ascending: false })

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">Registered Students</h1>
        <p className="text-gray-400 text-sm">View student enrollments and manage their academic progress.</p>
      </div>

      <div className="bg-[#001A3B]/40 backdrop-blur-md rounded-3xl shadow-lg border border-[#002855] overflow-hidden">
        <div className="p-6 border-b border-[#002855] bg-[#000E1F]/50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="text-[#00A3FF]" /> Student Directory
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#001A3B]/50 border-b border-[#002855]">
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Student ID</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Course Enrolled</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Progress</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#002855]">
              {enrollments && enrollments.map((record) => (
                <tr key={record.id} className="hover:bg-[#001A3B] transition-colors">
                  <td className="py-4 px-6 text-sm text-gray-300 font-mono">
                    {record.student_id.substring(0, 8)}...
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-white flex items-center gap-2">
                      <BookOpen size={14} className="text-[#FF6B00]" />
                      {(record.courses as any)?.title || 'Unknown Course'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-full bg-[#001229] rounded-full h-1.5 border border-[#002855]">
                        <div className="bg-[#00E5FF] h-1.5 rounded-full" style={{ width: `${record.progress}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-gray-400 w-8">{record.progress}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-green-500/10 text-green-500">
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!enrollments || enrollments.length === 0) && (
            <div className="p-12 text-center text-gray-500 font-medium">
              No students enrolled yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
