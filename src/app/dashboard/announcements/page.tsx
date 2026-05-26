import React from 'react'
import { Bell, Info, AlertTriangle, CalendarDays } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

export default async function AnnouncementsPage() {
  const supabase = await createClient()
  
  const { data: announcements, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">Announcements</h1>
        <p className="text-gray-400 text-sm">Important updates and notices from the institute.</p>
      </div>

      <div className="space-y-6">
        {announcements && announcements.length > 0 ? announcements.map((item) => {
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
            <div key={item.id} className="bg-[#001A3B]/40 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-lg border border-[#002855] flex gap-6 hover:bg-[#001229] transition-colors">
              <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${bg} ${color}`}>
                <Icon size={24} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-white">{item.title}</h2>
                  <span className="text-[10px] uppercase font-black tracking-widest text-gray-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-300 leading-relaxed text-sm">{item.content}</p>
              </div>
            </div>
          )
        }) : (
          <div className="p-12 text-center text-gray-500 font-medium bg-[#001A3B]/40 rounded-3xl border border-[#002855]">
            No recent announcements to display.
          </div>
        )}
      </div>
    </div>
  )
}
