import React from 'react'
import { FileQuestion, CheckCircle2, Clock } from 'lucide-react'

export default function TestsPage() {
  const tests = [
    { title: 'AWS Cloud Practitioner Mock Test', questions: 65, duration: '90 Mins', status: 'Available', score: null },
    { title: 'Python Basics Quiz 2', questions: 20, duration: '30 Mins', status: 'Available', score: null },
    { title: 'Networking Fundamentals Quiz 1', questions: 30, duration: '45 Mins', status: 'Completed', score: '88%' },
  ]

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">Practice Tests</h1>
        <p className="text-gray-400 text-sm">Evaluate your knowledge with quizzes and mock exams.</p>
      </div>

      <div className="space-y-4">
        {tests.map((test, idx) => (
          <div key={idx} className="bg-[#001A3B]/40 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-[#002855] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-gray-500/30 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#001229] flex items-center justify-center">
                <FileQuestion size={24} className={test.status === 'Available' ? 'text-[#00A3FF]' : 'text-[#00E5FF]'} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{test.title}</h3>
                <div className="flex gap-4 text-xs text-gray-400 mt-1">
                  <span className="flex items-center gap-1"><FileQuestion size={12}/> {test.questions} Questions</span>
                  <span className="flex items-center gap-1"><Clock size={12}/> {test.duration}</span>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-auto">
              {test.status === 'Available' ? (
                <button className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#E66000] text-white font-bold text-sm shadow-lg transition-colors">
                  Start Test
                </button>
              ) : (
                <div className="px-6 py-2.5 rounded-xl bg-[#001229] border border-[#002855] flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#00E5FF]" />
                  <span className="text-white font-bold text-sm">Score: {test.score}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
