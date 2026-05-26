import React from 'react'
import { Calendar as CalendarIcon, Clock, MapPin, Video } from 'lucide-react'

export default function SchedulePage() {
  const schedule = [
    { time: '09:00 AM - 11:00 AM', title: 'Cyber Security — Lecture 12', type: 'On-Campus', location: 'Room 204', color: 'border-[#FF6B00]', bg: 'bg-[#FF6B00]/10', text: 'text-[#FF6B00]', icon: MapPin },
    { time: '11:30 AM - 12:30 PM', title: 'Cloud Lab — AWS S3 Practice', type: 'Lab', location: 'Lab 3', color: 'border-[#00A3FF]', bg: 'bg-[#00A3FF]/10', text: 'text-[#00A3FF]', icon: MapPin },
    { time: '02:00 PM - 03:30 PM', title: 'Python — Data Visualization', type: 'Online', location: 'Zoom Link', color: 'border-[#00E5FF]', bg: 'bg-[#00E5FF]/10', text: 'text-[#00E5FF]', icon: Video },
  ]

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2">Class Schedule</h1>
          <p className="text-gray-400 text-sm">Your weekly timetable and upcoming classes.</p>
        </div>
        <button className="bg-[#001A3B] border border-[#002855] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:border-[#FF6B00]/50 transition-colors flex items-center gap-2">
          <CalendarIcon size={16} className="text-[#FF6B00]" />
          Sync Calendar
        </button>
      </div>

      <div className="bg-[#001A3B]/40 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-[#002855]">
        <div className="flex gap-4 overflow-x-auto pb-6 border-b border-[#002855] scrollbar-hide">
          {['Mon, 10 May', 'Tue, 11 May', 'Wed, 12 May', 'Thu, 13 May', 'Fri, 14 May'].map((day, idx) => (
            <button key={idx} className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${idx === 0 ? 'bg-[#FF6B00] text-white shadow-[0_0_15px_rgba(255,107,0,0.4)]' : 'bg-[#001229] text-gray-400 border border-[#002855] hover:text-white'}`}>
              {day}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-6">
          {schedule.map((slot, idx) => (
            <div key={idx} className={`p-6 rounded-2xl bg-[#001229]/50 border-l-4 ${slot.color} border border-y-[#002855] border-r-[#002855] flex flex-col md:flex-row gap-6 items-start md:items-center hover:bg-[#001A3B] transition-colors`}>
              <div className="shrink-0 w-48">
                <div className="flex items-center gap-2 text-gray-300 font-bold mb-1">
                  <Clock size={16} className={slot.text} />
                  {slot.time}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2">{slot.title}</h3>
                <div className="flex items-center gap-4 text-sm font-medium">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider ${slot.bg} ${slot.text}`}>
                    {slot.type}
                  </span>
                  <span className="flex items-center gap-1.5 text-gray-400">
                    <slot.icon size={14} />
                    {slot.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
