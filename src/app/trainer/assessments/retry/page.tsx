import React from 'react';
import { RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RetryQuestionsPage() {
  const retrySets = [
    { id: 1, course: 'Advanced Web Dev', module: 'Video 2: React Hooks', failedStudents: 12, setsAvailable: 3 },
    { id: 2, course: 'UI/UX Masterclass', module: 'Video 4: Color Theory', failedStudents: 5, setsAvailable: 1 },
    { id: 3, course: 'Python Data Scraping', module: 'Video 1: Basics', failedStudents: 0, setsAvailable: 2 },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-[#0f3d1a] mb-2">Retry Question Sets</h1>
        <p className="text-[#1a6b2e]">Manage alternative assessment sets for students who fail initial attempts.</p>
      </div>

      <div className="bg-[#0f172a]/60 backdrop-blur-xl border border-[#1e293b] rounded-[32px] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-[#1e293b] flex items-center gap-4 bg-gradient-to-r from-red-500/10 to-transparent">
          <AlertCircle className="w-6 h-6 text-red-400" />
          <div>
            <h3 className="font-bold text-[#0f3d1a]">Why multiple sets?</h3>
            <p className="text-sm text-[#1a6b2e]">To prevent cheating, students who retry an assessment must receive a different set of questions.</p>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {retrySets.map((set) => (
              <div key={set.id} className="flex items-center justify-between p-5 rounded-2xl border border-[#1e293b] hover:bg-[#1e293b]/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                    <RotateCcw className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#0f3d1a]">{set.module}</h4>
                    <p className="text-sm text-[#64748b]">{set.course}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-xs text-[#64748b] uppercase font-bold mb-1">Failed</p>
                    <p className={`text-lg font-black ${set.failedStudents > 0 ? 'text-red-400' : 'text-green-400'}`}>{set.failedStudents}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-[#64748b] uppercase font-bold mb-1">Alt Sets</p>
                    <p className="text-lg font-black text-[#0f3d1a] flex items-center gap-1 justify-center">
                      {set.setsAvailable} {set.setsAvailable >= 2 && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                    </p>
                  </div>
                  <button className="bg-[#1e293b] hover:bg-white hover:text-black text-[#0f3d1a] px-5 py-2.5 rounded-xl font-bold transition-all border border-[#334155] shadow-lg">
                    Manage Sets
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
