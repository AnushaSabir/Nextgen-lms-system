import React from 'react'
import { ClipboardList, UploadCloud, CheckCircle2, Clock } from 'lucide-react'

export default function AssignmentsPage() {
  const assignments = [
    { title: 'Python Module 5 Project', course: 'Python & Data Analysis', dueDate: 'May 14, 2026', status: 'Pending', score: null, icon: Clock, color: 'text-[#FFAA00]', bg: 'bg-[#FFAA00]/10', border: 'border-[#FFAA00]' },
    { title: 'AWS IAM Policy Setup', course: 'Cloud Computing — AWS', dueDate: 'May 10, 2026', status: 'Pending', score: null, icon: Clock, color: 'text-[#00A3FF]', bg: 'bg-[#00A3FF]/10', border: 'border-[#00A3FF]' },
    { title: 'Network Topology Design', course: 'Cyber Security Fundamentals', dueDate: 'May 02, 2026', status: 'Graded', score: '95/100', icon: CheckCircle2, color: 'text-[#00E5FF]', bg: 'bg-[#00E5FF]/10', border: 'border-[#00E5FF]' },
  ]

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2">Assignments</h1>
          <p className="text-gray-400 text-sm">Manage your pending and graded assignments.</p>
        </div>
      </div>

      <div className="bg-[#001A3B]/40 backdrop-blur-md rounded-3xl shadow-lg border border-[#002855] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#000E1F]/80 border-b border-[#002855]">
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Assignment</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Course</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Due Date</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#002855]">
              {assignments.map((assignment, idx) => (
                <tr key={idx} className="hover:bg-[#001A3B] transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-white">{assignment.title}</div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-400">{assignment.course}</td>
                  <td className="py-4 px-6 text-sm text-gray-300 font-medium">{assignment.dueDate}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider ${assignment.bg} ${assignment.color}`}>
                      <assignment.icon size={12} />
                      {assignment.status === 'Graded' ? assignment.score : assignment.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {assignment.status === 'Pending' ? (
                      <button className="inline-flex items-center gap-2 bg-[#FF6B00] hover:bg-[#E66000] text-white px-4 py-2 rounded-lg font-bold text-xs transition-colors shadow-lg">
                        <UploadCloud size={14} />
                        Submit
                      </button>
                    ) : (
                      <button className="inline-flex items-center gap-2 bg-[#001229] border border-[#002855] hover:text-[#00E5FF] text-gray-400 px-4 py-2 rounded-lg font-bold text-xs transition-colors">
                        View Details
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
