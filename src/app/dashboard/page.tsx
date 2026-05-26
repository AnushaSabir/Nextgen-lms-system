import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { 
  Flame, 
  GraduationCap, 
  BarChart2, 
  ClipboardList, 
  Trophy, 
  UploadCloud, 
  CreditCard, 
  DownloadCloud, 
  PenTool, 
  PhoneCall, 
  FileBadge, 
  CalendarDays, 
  LifeBuoy,
  Clock,
  ArrowRight
} from 'lucide-react'
import { cookies } from 'next/headers'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const isDemoMode = cookieStore.get('demo_user_logged_in')?.value === 'true'
  
  let userName = 'Student'
  
  if (isDemoMode) {
    userName = cookieStore.get('demo_user_name')?.value || 'Demo Student'
  } else {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      userName = user?.user_metadata?.full_name || 'Student'
    } catch (e) {
      // Ignore if Supabase fails
    }
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#001A3B] to-[#000E1F] border border-[#002855] rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-[0_10px_30px_rgba(0,26,59,0.8)]">
        {/* Subtle background decoration */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#FF6B00]/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-[#003B82]/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-gray-400 font-medium tracking-wide mb-1 uppercase text-xs">Welcome back,</p>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
              {userName}
            </h1>
            <p className="text-gray-300 text-sm md:text-base">
              You have <span className="text-[#FF6B00] font-bold">2 classes today</span> • <span className="text-white font-medium">5 assignments pending</span>
            </p>
            {isDemoMode && (
              <div className="mt-4 inline-block px-3 py-1 bg-amber-500/20 text-amber-500 border border-amber-500/30 text-xs font-bold rounded-full">
                Demo Mode Active
              </div>
            )}
          </div>
          <div className="shrink-0">
            <button className="bg-[#FF6B00] hover:bg-[#E66000] text-white font-extrabold py-3 px-6 rounded-full shadow-[0_0_20px_rgba(255,107,0,0.4)] flex items-center gap-2 transition-all transform hover:scale-105">
              <Flame size={20} className="fill-current" />
              <span>7-Day Streak</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'ENROLLED COURSES', value: '3', sub: 'Active this semester', icon: GraduationCap, color: 'text-[#00A3FF]', bg: 'bg-[#00A3FF]/10' },
          { title: 'ATTENDANCE', value: '87%', sub: '↑ 3% this month', subColor: 'text-emerald-400', icon: BarChart2, color: 'text-[#00E5FF]', bg: 'bg-[#00E5FF]/10' },
          { title: 'ASSIGNMENTS DUE', value: '5', sub: 'Next: Friday', icon: ClipboardList, color: 'text-[#FF6B00]', bg: 'bg-[#FF6B00]/10' },
          { title: 'AVG. SCORE', value: '78%', sub: '↑ 5% last quiz', subColor: 'text-emerald-400', icon: Trophy, color: 'text-[#FFAA00]', bg: 'bg-[#FFAA00]/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#001A3B]/40 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-[#002855] hover:border-[#FF6B00]/50 hover:shadow-[0_10px_30px_rgba(255,107,0,0.1)] transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-transparent group-hover:bg-gradient-to-r group-hover:from-[#FF6B00] group-hover:to-[#FF8C00] transition-all"></div>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-[10px] font-black text-gray-400 tracking-widest w-24 leading-tight uppercase">{stat.title}</h3>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} strokeWidth={2.5} />
              </div>
            </div>
            <div className="text-3xl font-black text-white mb-1 drop-shadow-md">{stat.value}</div>
            <p className={`text-xs ${stat.subColor || 'text-gray-500 font-medium'}`}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center">
          Quick Actions
        </h2>
        <div className="bg-[#001A3B]/30 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-[#002855]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: 'Submit Assignment', icon: UploadCloud, color: 'text-[#00A3FF]', bg: 'bg-[#00A3FF]/10' },
              { name: 'Pay Fee Online', icon: CreditCard, color: 'text-[#FFAA00]', bg: 'bg-[#FFAA00]/10' },
              { name: 'Download Notes', icon: DownloadCloud, color: 'text-[#00E5FF]', bg: 'bg-[#00E5FF]/10' },
              { name: 'Take Quiz', icon: PenTool, color: 'text-[#FF4757]', bg: 'bg-[#FF4757]/10' },
              { name: 'Contact Instructor', icon: PhoneCall, color: 'text-[#FF6B00]', bg: 'bg-[#FF6B00]/10' },
              { name: 'View Certificate', icon: FileBadge, color: 'text-[#2ED573]', bg: 'bg-[#2ED573]/10' },
              { name: 'Book Lab Slot', icon: CalendarDays, color: 'text-[#7BED9F]', bg: 'bg-[#7BED9F]/10' },
              { name: 'IT Support', icon: LifeBuoy, color: 'text-[#ECCC68]', bg: 'bg-[#ECCC68]/10' },
            ].map((action, i) => (
              <button key={i} className="flex flex-col items-center justify-center p-4 rounded-xl hover:bg-[#002855]/50 border border-transparent hover:border-[#FF6B00]/30 transition-all group">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 group-active:scale-95 ${action.bg} ${action.color}`}>
                  <action.icon size={24} strokeWidth={2} />
                </div>
                <span className="text-xs font-semibold text-gray-300 text-center w-full group-hover:text-white transition-colors">{action.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: My Courses */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#001A3B]/30 backdrop-blur-md rounded-2xl shadow-lg border border-[#002855] overflow-hidden">
            <div className="p-5 border-b border-[#002855] flex justify-between items-center bg-[#000E1F]/50">
              <h2 className="text-lg font-bold text-white">My Courses</h2>
              <button className="text-sm text-[#FF6B00] font-semibold hover:text-[#E66000] transition-colors flex items-center">
                View all <ArrowRight size={14} className="ml-1" />
              </button>
            </div>
            <div className="p-0">
              {[
                { title: 'Cyber Security Fundamentals', progress: 72, status: 'Active', color: 'bg-[#FF6B00]' },
                { title: 'Cloud Computing — AWS', progress: 45, status: 'Active', color: 'bg-[#00A3FF]' },
                { title: 'Python & Data Analysis', progress: 88, status: 'Active', color: 'bg-[#00E5FF]' },
                { title: 'Advanced Networking (CCNA)', progress: 0, status: 'Upcoming', color: 'bg-gray-600' },
              ].map((course, i) => (
                <div key={i} className="p-5 border-b border-[#002855] last:border-0 hover:bg-[#002855]/40 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${course.color} shadow-[0_0_8px_currentColor]`}></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-100 leading-snug mb-3 pr-2">{course.title}</h4>
                      <div className="flex items-center justify-between gap-3">
                        {course.status === 'Active' ? (
                          <>
                            <div className="flex-1 h-1.5 bg-[#001229] rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${course.color}`} style={{ width: `${course.progress}%` }}></div>
                            </div>
                            <span className="text-xs font-bold text-gray-400 shrink-0">{course.progress}%</span>
                            <span className="text-[10px] uppercase tracking-wider font-bold text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded shrink-0">Active</span>
                          </>
                        ) : (
                          <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 bg-gray-800 px-2 py-0.5 rounded shrink-0">Upcoming</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Schedule & Announcements */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#001A3B]/30 backdrop-blur-md rounded-2xl shadow-lg border border-[#002855] overflow-hidden">
            <div className="p-5 border-b border-[#002855] flex justify-between items-center bg-[#000E1F]/50">
              <h2 className="text-lg font-bold text-white">
                Today's Schedule
              </h2>
              <button className="text-sm text-[#FF6B00] font-semibold hover:text-[#E66000] transition-colors flex items-center">
                Full calendar <ArrowRight size={14} className="ml-1" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-12 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#002855] before:to-transparent">
                {[
                  { time: '09:00 - 11:00', title: 'Cyber Security — Lecture 12', instructor: 'Usman Tariq', room: 'Room 204', color: 'border-[#FF6B00]' },
                  { time: '11:30 - 12:30', title: 'Cloud Lab — AWS S3 Practice', instructor: 'Sara Noor', room: 'Lab 3', color: 'border-[#00A3FF]' },
                  { time: '14:00 - 15:30', title: 'Python — Data Visualization', instructor: 'Ahmed Raza', room: 'Online (Zoom)', color: 'border-[#00E5FF]' },
                  { time: '16:00 - 17:00', title: 'Assignment Submission Deadline', subtitle: 'Python — Module 5 Project', color: 'border-[#FFAA00]' },
                ].map((slot, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-[#001229] bg-[#002855] text-gray-500 group-[.is-active]:bg-[#FF6B00] group-[.is-active]:text-white shadow-[0_0_10px_rgba(255,107,0,0.5)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-8 md:left-1/2 -translate-x-1/2 md:translate-x-0 z-10">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2rem)] pl-16 md:pl-0">
                      <div className={`p-4 rounded-xl border-l-4 ${slot.color} bg-[#001229]/80 backdrop-blur-sm border border-[#002855] shadow-lg hover:bg-[#001A3B] transition-colors`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Clock size={14} className="text-[#FF6B00]" />
                          <time className="text-xs font-bold text-gray-300">{slot.time}</time>
                        </div>
                        <h4 className="text-sm font-bold text-white mb-1.5">{slot.title}</h4>
                        {slot.instructor && (
                          <p className="text-xs text-gray-400 font-medium">{slot.instructor} • <span className="text-gray-300">{slot.room}</span></p>
                        )}
                        {slot.subtitle && (
                          <p className="text-xs text-[#FFAA00] font-medium mt-1">{slot.subtitle}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#001A3B]/30 backdrop-blur-md rounded-2xl shadow-lg border border-[#002855] overflow-hidden">
            <div className="p-5 border-b border-[#002855] flex justify-between items-center bg-[#000E1F]/50">
              <h2 className="text-lg font-bold text-white">Announcements</h2>
              <button className="text-sm text-[#FF6B00] font-semibold hover:text-[#E66000] transition-colors flex items-center">
                View all <ArrowRight size={14} className="ml-1" />
              </button>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { tag: 'Important', tagColor: 'text-[#FF6B00] bg-[#FF6B00]/10 border border-[#FF6B00]/20', title: 'Semester Fee Due — April 30', date: 'Apr 20, 2026' },
                  { tag: 'Result', tagColor: 'text-[#00E5FF] bg-[#00E5FF]/10 border border-[#00E5FF]/20', title: 'Mid-Term Results Published', date: 'Apr 18, 2026' },
                  { tag: 'Event', tagColor: 'text-[#00A3FF] bg-[#00A3FF]/10 border border-[#00A3FF]/20', title: 'Tech Seminar — May 5, Main Hall', date: 'Apr 15, 2026' },
                ].map((announcement, i) => (
                  <div key={i} className="p-5 rounded-xl border border-[#002855] bg-[#001229]/60 hover:border-[#FF6B00]/40 hover:bg-[#001A3B] transition-all cursor-pointer">
                    <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest mb-3 ${announcement.tagColor}`}>
                      {announcement.tag}
                    </span>
                    <h4 className="text-sm font-bold text-gray-100 mb-4 leading-relaxed">{announcement.title}</h4>
                    <p className="text-xs text-gray-500 font-bold tracking-wide">{announcement.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
