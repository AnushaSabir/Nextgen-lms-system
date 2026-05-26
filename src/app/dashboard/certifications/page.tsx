import React from 'react'
import { Award, Download } from 'lucide-react'

export default function CertificationsPage() {
  const certs = [
    { title: 'Cyber Security Basics Certified', date: 'Mar 15, 2026', id: 'NG-CYB-0012' },
  ]

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">Certifications</h1>
        <p className="text-gray-400 text-sm">Your earned certificates and badges.</p>
      </div>

      {certs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((cert, idx) => (
            <div key={idx} className="bg-[#001A3B]/40 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-[#002855] text-center flex flex-col items-center group hover:border-[#FF6B00]/50 transition-all">
              <div className="w-24 h-24 rounded-full bg-[#001229] border-4 border-[#FF6B00] flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,107,0,0.3)]">
                <Award size={48} className="text-[#FF6B00]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{cert.title}</h3>
              <p className="text-xs text-gray-400 mb-1">Issued: {cert.date}</p>
              <p className="text-xs font-mono text-gray-500 mb-6">ID: {cert.id}</p>
              <button className="w-full py-2.5 rounded-xl bg-[#001229] border border-[#002855] text-white text-sm font-bold hover:bg-[#FF6B00] hover:border-[#FF6B00] transition-colors flex items-center justify-center gap-2">
                <Download size={16} /> Download PDF
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#001A3B]/40 rounded-3xl p-12 border border-[#002855] text-center">
          <Award size={48} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400 font-medium">You have not earned any certifications yet.</p>
        </div>
      )}
    </div>
  )
}
