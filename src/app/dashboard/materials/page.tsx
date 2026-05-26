import React from 'react'
import { Folder, FileText, Download, Search } from 'lucide-react'

export default function MaterialsPage() {
  const materials = [
    { title: 'Cyber Security Module 1 Notes', type: 'PDF', size: '2.4 MB', date: 'May 01, 2026' },
    { title: 'AWS EC2 Cheat Sheet', type: 'PDF', size: '1.1 MB', date: 'May 05, 2026' },
    { title: 'Python Pandas Workshop Slides', type: 'PPTX', size: '5.6 MB', date: 'May 08, 2026' },
    { title: 'Networking Subnetting Guide', type: 'PDF', size: '3.2 MB', date: 'Apr 25, 2026' },
  ]

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2">Study Material</h1>
          <p className="text-gray-400 text-sm">Access your course notes, slides, and cheat sheets.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input type="text" placeholder="Search materials..." className="w-full pl-10 pr-4 py-2 bg-[#001A3B] border border-[#002855] rounded-xl text-sm text-white focus:outline-none focus:border-[#FF6B00]" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {materials.map((file, idx) => (
          <div key={idx} className="bg-[#001A3B]/40 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-[#002855] hover:border-[#FF6B00]/50 transition-all duration-300 group flex flex-col">
            <div className="w-12 h-12 rounded-2xl bg-[#001229] flex items-center justify-center mb-4">
              <FileText size={24} className="text-[#00A3FF]" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1 line-clamp-2">{file.title}</h3>
            <p className="text-xs text-gray-500 mb-6">{file.type} • {file.size} • {file.date}</p>
            <button className="mt-auto w-full py-2.5 rounded-xl bg-[#001229] border border-[#002855] text-white text-xs font-bold hover:bg-[#FF6B00] hover:border-[#FF6B00] transition-colors flex items-center justify-center gap-2">
              <Download size={14} />
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
