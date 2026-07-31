import React from 'react';
import { Plus, BookOpen, Clock, MoreVertical, Edit2, Trash2 } from 'lucide-react';

export default function PracticalAssignmentsPage() {
  const assignments = [
    { id: 1, title: 'Build a React Landing Page', course: 'Advanced Web Dev', due: '3 Days', status: 'Active' },
    { id: 2, title: 'Design System Creation', course: 'UI/UX Masterclass', due: '5 Days', status: 'Draft' },
    { id: 3, title: 'Python Data Scraping', course: 'Data Science 101', due: 'Ended', status: 'Completed' },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f3d1a] mb-1 sm:mb-2">Practical Assignments</h1>
          <p className="text-sm sm:text-base text-[#1a6b2e]">Create and manage practical tasks for your students.</p>
        </div>
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#5E6F58] to-sky-500 hover:opacity-90 text-[#0f3d1a] px-6 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(240,89,31,0.3)] transition-all active:scale-95">
          <Plus className="w-5 h-5" /> New Assignment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="bg-white/[0.02] backdrop-blur-3xl border border-[#1a6b2e]/20 rounded-[32px] p-8 transition-all duration-700 transform-style-3d hover:-translate-y-2 hover:scale-[1.02] hover:border-sky-500/50 hover:shadow-[0_20px_60px_rgba(240,89,31,0.2)] group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#1a6b2e]/5 rounded-bl-full pointer-events-none group-hover:bg-[#5E6F58]/5 transition-colors" />
            
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-[#1e293b] rounded-xl text-[#d94d19]">
                <BookOpen className="w-6 h-6" />
              </div>
              <button className="text-[#64748b] hover:text-[#0f3d1a] p-2">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            
            <h3 className="text-xl font-bold text-[#0f3d1a] mb-1">{assignment.title}</h3>
            <p className="text-[#64748b] text-sm mb-6">{assignment.course}</p>
            
            <div className="flex items-center justify-between pt-4 border-t border-[#1e293b]">
              <div className="flex items-center gap-2 text-sm text-[#1a6b2e]">
                <Clock className="w-4 h-4" /> {assignment.due}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                assignment.status === 'Active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                assignment.status === 'Draft' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              }`}>
                {assignment.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
