import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { Bell, PlusCircle, AlertTriangle, Info, CalendarDays } from 'lucide-react'
import { createAnnouncement } from '../actions'

export default async function AdminAnnouncementsPage() {
  const supabase = await createClient()
  
  // Fetch existing announcements
  const { data: announcements, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">Announcements</h1>
        <p className="text-gray-400 text-sm">Post new alerts, events, and information to all students.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Post Announcement Form */}
        <div className="lg:col-span-1">
          <div className="bg-[#001A3B]/40 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-[#002855]">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <PlusCircle className="text-[#FF6B00]" /> Post Update
            </h2>
            <form action={createAnnouncement} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Headline</label>
                <input required type="text" name="title" className="w-full px-4 py-3 bg-[#001229] border border-[#002855] rounded-xl text-white focus:outline-none focus:border-[#FF6B00] transition-colors" placeholder="e.g. Exam Schedule Changed" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Message Content</label>
                <textarea required name="content" rows={5} className="w-full px-4 py-3 bg-[#001229] border border-[#002855] rounded-xl text-white focus:outline-none focus:border-[#FF6B00] transition-colors" placeholder="Detailed message..."></textarea>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Announcement Type</label>
                <select name="type" className="w-full px-4 py-3 bg-[#001229] border border-[#002855] rounded-xl text-white focus:outline-none focus:border-[#FF6B00] transition-colors appearance-none">
                  <option value="info">General Info</option>
                  <option value="important">Important Alert</option>
                  <option value="event">Event / Seminar</option>
                </select>
              </div>
              <button type="submit" className="w-full mt-4 bg-[#00A3FF] hover:bg-[#0082CC] text-white px-4 py-3 rounded-xl font-bold text-sm transition-colors shadow-lg">
                Broadcast Message
              </button>
            </form>
          </div>
        </div>

        {/* Existing Announcements List */}
        <div className="lg:col-span-2">
          <div className="bg-[#001A3B]/40 backdrop-blur-md rounded-3xl shadow-lg border border-[#002855] overflow-hidden">
            <div className="p-6 border-b border-[#002855] bg-[#000E1F]/50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Bell className="text-[#FF6B00]" /> Recent Broadcasts
              </h2>
            </div>
            <div className="p-0">
              {announcements && announcements.length > 0 ? (
                <ul className="divide-y divide-[#002855]">
                  {announcements.map((item) => {
                    let Icon = Info;
                    let color = 'text-[#00A3FF]';
                    let bg = 'bg-[#00A3FF]/10';
                    
                    if (item.type === 'important') {
                      Icon = AlertTriangle;
                      color = 'text-[#FF6B00]';
                      bg = 'bg-[#FF6B00]/10';
                    } else if (item.type === 'event') {
                      Icon = CalendarDays;
                      color = 'text-[#00E5FF]';
                      bg = 'bg-[#00E5FF]/10';
                    }

                    return (
                      <li key={item.id} className="p-6 hover:bg-[#001A3B] transition-colors flex gap-4">
                        <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${bg} ${color}`}>
                          <Icon size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                          <p className="text-sm text-gray-400 mb-2">{item.content}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">
                            {new Date(item.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <div className="p-12 text-center text-gray-500 font-medium">
                  No announcements yet. Broadcast a message to see it here.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
