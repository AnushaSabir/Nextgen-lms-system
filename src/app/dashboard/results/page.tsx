import React from 'react'
import { BarChart, Trophy, FileText, DownloadCloud } from 'lucide-react'

export default function ResultsPage() {
  const results = [
    { course: 'Python & Data Analysis', grade: 'A+', score: '94%', credits: 3 },
    { course: 'Cloud Computing — AWS', grade: 'B+', score: '82%', credits: 3 },
    { course: 'Cyber Security Fundamentals', grade: 'A', score: '89%', credits: 4 },
  ]

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2">Results & Grades</h1>
          <p className="text-gray-400 text-sm">Your academic performance and transcripts.</p>
        </div>
        <button className="bg-[#001A3B] border border-[#002855] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:border-[#FF6B00]/50 transition-colors flex items-center gap-2">
          <DownloadCloud size={16} className="text-[#FF6B00]" />
          Download Transcript
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#001A3B]/40 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-[#002855] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#00E5FF]/10 flex items-center justify-center mb-4">
            <Trophy size={32} className="text-[#00E5FF]" />
          </div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Cumulative GPA</h3>
          <div className="text-5xl font-black text-white">3.8<span className="text-xl text-gray-500">/4.0</span></div>
        </div>

        <div className="bg-[#001A3B]/40 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-[#002855] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#FFAA00]/10 flex items-center justify-center mb-4">
            <FileText size={32} className="text-[#FFAA00]" />
          </div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Credits Earned</h3>
          <div className="text-5xl font-black text-white">45<span className="text-xl text-gray-500">/120</span></div>
        </div>

        <div className="bg-[#001A3B]/40 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-[#002855] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#FF6B00]/10 flex items-center justify-center mb-4">
            <BarChart size={32} className="text-[#FF6B00]" />
          </div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Current Standing</h3>
          <div className="text-4xl font-black text-[#FF6B00] mt-2">Excellent</div>
        </div>
      </div>

      <div className="bg-[#001A3B]/40 backdrop-blur-md rounded-3xl shadow-lg border border-[#002855] overflow-hidden">
        <div className="p-6 border-b border-[#002855] bg-[#000E1F]/50">
          <h2 className="text-lg font-bold text-white">Recent Course Grades</h2>
        </div>
        <div className="p-0">
          {results.map((result, idx) => (
            <div key={idx} className="p-6 border-b border-[#002855] last:border-0 hover:bg-[#001A3B] transition-colors flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{result.course}</h3>
                <p className="text-sm text-gray-400">{result.credits} Credits</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Score</div>
                  <div className="text-xl font-bold text-white">{result.score}</div>
                </div>
                <div className="w-16 h-16 rounded-xl bg-[#001229] border border-[#002855] flex items-center justify-center text-2xl font-black text-[#FF6B00] shadow-inner">
                  {result.grade}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
