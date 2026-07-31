import React from 'react';
import { BarChart3, TrendingUp, Users, Target } from 'lucide-react';

export default function StudentReportsPage() {
  const students = [
    { id: 1, name: 'Sarah Khan', progress: 85, score: 'A', status: 'Excellent' },
    { id: 2, name: 'Ali Raza', progress: 45, score: 'C', status: 'Needs Help' },
    { id: 3, name: 'Zainab B.', progress: 100, score: 'A+', status: 'Graduated' },
    { id: 4, name: 'Omar M.', progress: 15, score: 'F', status: 'At Risk' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-[#0f3d1a] mb-2">Student Reports</h1>
        <p className="text-[#1a6b2e]">Track progress and identify students who need help.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#0f172a]/80 p-6 rounded-3xl border border-[#1e293b] shadow-xl">
          <Users className="w-6 h-6 text-blue-400 mb-2" />
          <p className="text-sm text-[#64748b] font-medium mb-1">Total Students</p>
          <h2 className="text-2xl font-black text-[#0f3d1a]">1,248</h2>
        </div>
        <div className="bg-[#0f172a]/80 p-6 rounded-3xl border border-[#1e293b] shadow-xl">
          <Target className="w-6 h-6 text-green-400 mb-2" />
          <p className="text-sm text-[#64748b] font-medium mb-1">Average Completion</p>
          <h2 className="text-2xl font-black text-[#0f3d1a]">68%</h2>
        </div>
        <div className="bg-[#0f172a]/80 p-6 rounded-3xl border border-[#1e293b] shadow-xl">
          <TrendingUp className="w-6 h-6 text-yellow-400 mb-2" />
          <p className="text-sm text-[#64748b] font-medium mb-1">Avg Score</p>
          <h2 className="text-2xl font-black text-[#0f3d1a]">B+</h2>
        </div>
        <div className="bg-[#0f172a]/80 p-6 rounded-3xl border border-[#1e293b] shadow-xl">
          <BarChart3 className="w-6 h-6 text-red-400 mb-2" />
          <p className="text-sm text-[#64748b] font-medium mb-1">At Risk Students</p>
          <h2 className="text-2xl font-black text-[#0f3d1a]">42</h2>
        </div>
      </div>

      <div className="bg-[#0f172a]/80 backdrop-blur-md border border-[#1e293b] rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-[#1e293b] flex justify-between items-center">
          <h3 className="font-bold text-[#0f3d1a] text-lg">Performance Overview</h3>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {students.map(student => (
              <div key={student.id} className="flex items-center justify-between">
                <div className="w-1/4">
                  <h4 className="font-bold text-[#0f3d1a]">{student.name}</h4>
                  <p className="text-xs text-[#64748b]">{student.status}</p>
                </div>
                
                <div className="flex-1 px-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-[#1a6b2e]">Progress</span>
                    <span className="text-xs font-bold text-[#0f3d1a]">{student.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#1e293b] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        student.progress < 30 ? 'bg-red-500' : student.progress < 70 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${student.progress}%` }}
                    />
                  </div>
                </div>

                <div className="w-1/4 text-right">
                  <span className="text-2xl font-black text-[#0f3d1a]">{student.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
