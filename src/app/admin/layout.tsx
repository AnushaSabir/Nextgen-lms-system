'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Home, Users, CheckSquare, LogOut, Settings, MessageSquare, FileText } from 'lucide-react'
import { logout } from '@/app/(auth)/actions'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Students', href: '/admin/students', icon: Users },
    { name: 'Courses', href: '/admin/courses', icon: BookOpen },
    { name: 'Announcements', href: '/admin/announcements', icon: MessageSquare },
    { name: 'Invoices (Fee)', href: '/admin/invoices', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-[#001229] text-gray-200">
      {/* Sidebar */}
      <aside className="w-[280px] bg-[#000E1F] border-r border-[#002855] flex flex-col shadow-2xl">
        <div className="p-8 border-b border-[#002855]">
          <h2 className="text-4xl font-black tracking-tighter">
            <span className="text-white">NEXT</span>
            <span className="text-[#FF6B00]">GEN</span>
          </h2>
          <p className="text-xs text-[#FF6B00] tracking-[0.2em] mt-1 uppercase font-black">Admin Panel</p>
        </div>
        
        <nav className="flex-1 py-8 px-4 space-y-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin')
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-4 px-5 py-3.5 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#001A3B] text-[#FF6B00] border border-[#FF6B00]/30 shadow-[0_0_15px_rgba(255,107,0,0.15)]' 
                    : 'text-gray-400 hover:bg-[#001A3B]/50 hover:text-white border border-transparent'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-[#FF6B00]' : 'text-gray-500'} />
                <span className="font-semibold text-sm">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-6 border-t border-[#002855]">
          <form action={logout}>
            <button type="submit" className="flex items-center justify-center space-x-3 px-4 py-3.5 rounded-xl text-gray-400 hover:bg-[#FF4757]/10 hover:text-[#FF4757] hover:border-[#FF4757]/30 border border-transparent w-full transition-all duration-200">
              <LogOut size={18} />
              <span className="font-bold text-sm">Logout</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
