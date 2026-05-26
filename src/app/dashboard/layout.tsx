'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  GraduationCap, 
  Calendar, 
  ClipboardList, 
  BarChart, 
  Folder, 
  Video, 
  FileText, 
  Award, 
  CreditCard, 
  MessageSquare, 
  Settings,
  Search,
  Bell,
  Mail
} from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const navGroups = [
    {
      title: 'MAIN',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'My Courses', href: '/dashboard/courses', icon: GraduationCap, badge: 3 },
        { name: 'Schedule', href: '/dashboard/schedule', icon: Calendar },
        { name: 'Assignments', href: '/dashboard/assignments', icon: ClipboardList, badge: 5 },
        { name: 'Results & Grades', href: '/dashboard/results', icon: BarChart },
      ]
    },
    {
      title: 'RESOURCES',
      items: [
        { name: 'Study Material', href: '/dashboard/materials', icon: Folder },
        { name: 'Video Lectures', href: '/dashboard/videos', icon: Video },
        { name: 'Practice Tests', href: '/dashboard/tests', icon: FileText },
        { name: 'Certifications', href: '/dashboard/certifications', icon: Award },
      ]
    },
    {
      title: 'ACCOUNT',
      items: [
        { name: 'Fee Payment', href: '/dashboard/fee', icon: CreditCard },
        { name: 'ID Card', href: '/dashboard/id-card', icon: Award },
        { name: 'Announcements', href: '/dashboard/announcements', icon: MessageSquare, badge: 2 },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
      ]
    }
  ]

  return (
    <div className="flex h-screen bg-[#001229] text-gray-200">
      {/* Sidebar */}
      <aside className="w-[280px] bg-[#000E1F] border-r border-[#002855] flex flex-col overflow-y-auto custom-scrollbar">
        <div className="p-8 border-b border-[#002855]">
          <h2 className="text-4xl font-black tracking-tighter">
            <span className="text-white">NEXT</span>
            <span className="text-[#FF6B00]">GEN</span>
          </h2>
          <p className="text-xs text-gray-500 tracking-[0.2em] mt-1 uppercase font-black">IT Institute</p>
        </div>
        
        <nav className="flex-1 py-6">
          {navGroups.map((group, idx) => (
            <div key={group.title} className={idx > 0 ? 'mt-8' : ''}>
              <h3 className="px-6 text-[10px] font-bold text-gray-500 tracking-widest mb-3 uppercase">
                {group.title}
              </h3>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                  const Icon = item.icon
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center justify-between px-6 py-3 transition-all duration-200 ${
                          isActive 
                            ? 'text-[#FF6B00] border-l-4 border-[#FF6B00] bg-[#001A3B]' 
                            : 'border-l-4 border-transparent text-gray-400 hover:text-white hover:bg-[#001A3B]/50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon size={18} className={isActive ? 'text-[#FF6B00]' : 'text-gray-500 group-hover:text-gray-300'} />
                          <span className={`font-semibold text-sm ${isActive ? 'text-white' : ''}`}>{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isActive ? 'bg-[#FF6B00] text-white shadow-[0_0_10px_rgba(255,107,0,0.5)]' : 'bg-[#002855] text-gray-300'}`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-[#000E1F]/80 backdrop-blur-md border-b border-[#002855] flex items-center justify-between px-8 shrink-0 z-10">
          <h1 className="text-2xl font-bold text-white">Student Portal</h1>
          
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search courses, material..." 
                className="w-64 pl-10 pr-4 py-2.5 bg-[#001A3B] border border-[#002855] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/50 focus:border-[#FF6B00] transition-all placeholder-gray-500"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="relative p-2.5 text-gray-400 hover:text-white transition-colors bg-[#001A3B] border border-[#002855] rounded-xl hover:border-[#FF6B00]/50">
                <Bell size={20} className="text-gray-300" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#FF6B00] rounded-full shadow-[0_0_8px_rgba(255,107,0,0.8)]"></span>
              </button>
              <button className="relative p-2.5 text-gray-400 hover:text-white transition-colors bg-[#001A3B] border border-[#002855] rounded-xl hover:border-blue-500/50">
                <Mail size={20} className="text-gray-300" />
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-[#001229]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
