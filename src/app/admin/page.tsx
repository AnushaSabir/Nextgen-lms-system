import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { BookOpen, Users, GraduationCap, CheckSquare, ArrowUpRight } from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-400 mt-2 text-sm font-medium">Platform overview and statistics.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Total Students', value: '1,240', icon: Users, color: 'text-[#00A3FF]', bg: 'bg-[#00A3FF]/10' },
          { title: 'Total Courses', value: '32', icon: BookOpen, color: 'text-[#FF6B00]', bg: 'bg-[#FF6B00]/10' },
          { title: 'Total Enrollments', value: '4,850', icon: GraduationCap, color: 'text-[#00E5FF]', bg: 'bg-[#00E5FF]/10' },
          { title: 'Exams Created', value: '156', icon: CheckSquare, color: 'text-[#FFAA00]', bg: 'bg-[#FFAA00]/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#001A3B]/40 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-[#002855] hover:border-gray-500/30 transition-all duration-300 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest leading-tight w-24">{stat.title}</h3>
              <div className={`p-3.5 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} strokeWidth={2.5} />
              </div>
            </div>
            <div className="text-4xl md:text-5xl font-black text-white tracking-tight">{stat.value}</div>
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-transparent group-hover:bg-gradient-to-r group-hover:from-[#002855] group-hover:to-gray-500 transition-all"></div>
          </div>
        ))}
      </div>

      <div className="pt-6">
        <h2 className="text-xl font-bold tracking-tight text-white mb-6 flex items-center">
          Quick Actions
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'Manage Students', desc: 'Add or remove users', icon: Users, color: 'text-[#00A3FF]', bg: 'bg-[#00A3FF]/10' },
            { title: 'Create Course', desc: 'Add new learning material', icon: BookOpen, color: 'text-[#FF6B00]', bg: 'bg-[#FF6B00]/10' },
            { title: 'Create Exam', desc: 'Set up new assessments', icon: CheckSquare, color: 'text-[#FFAA00]', bg: 'bg-[#FFAA00]/10' },
          ].map((action, i) => (
            <div key={i} className="bg-[#001A3B]/30 backdrop-blur-sm rounded-3xl shadow-lg border border-[#002855] hover:bg-[#002855]/60 hover:border-[#FF6B00]/50 transition-all duration-300 cursor-pointer group">
              <div className="p-8 flex items-center space-x-6">
                <div className={`p-4 rounded-2xl ${action.bg} ${action.color} group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon size={28} strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-100 text-lg flex items-center group-hover:text-white">
                    {action.title}
                    <ArrowUpRight size={18} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-[#FF6B00]" />
                  </h3>
                  <p className="text-sm text-gray-400 font-medium mt-1">{action.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
