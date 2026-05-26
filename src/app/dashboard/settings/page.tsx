import React from 'react'
import { User, Lock, Bell, Shield } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">Account Settings</h1>
        <p className="text-gray-400 text-sm">Manage your profile, password, and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-2">
          {['Profile Information', 'Security & Password', 'Notifications', 'Privacy Settings'].map((tab, idx) => (
            <button key={idx} className={`w-full text-left px-6 py-4 rounded-xl font-bold text-sm transition-all ${idx === 0 ? 'bg-[#FF6B00] text-white shadow-[0_0_15px_rgba(255,107,0,0.3)]' : 'bg-[#001A3B]/40 text-gray-400 hover:bg-[#002855] hover:text-white border border-[#002855]'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="lg:col-span-2">
          <div className="bg-[#001A3B]/40 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-[#002855]">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <User className="text-[#FF6B00]" /> Profile Information
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-[#001229] border-4 border-[#002855] flex items-center justify-center overflow-hidden">
                  <User size={40} className="text-gray-500" />
                </div>
                <div>
                  <button className="bg-[#001229] border border-[#002855] hover:bg-[#FF6B00] hover:border-[#FF6B00] text-white px-4 py-2 rounded-lg font-bold text-xs transition-colors">Change Avatar</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                  <input type="text" defaultValue="Demo Student" className="w-full px-4 py-3 bg-[#001229] border border-[#002855] rounded-xl text-white focus:outline-none focus:border-[#FF6B00] transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                  <input type="email" defaultValue="student@nextgen.edu" disabled className="w-full px-4 py-3 bg-[#001229]/50 border border-[#002855] rounded-xl text-gray-500 cursor-not-allowed" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
                  <input type="text" defaultValue="+1 234 567 890" className="w-full px-4 py-3 bg-[#001229] border border-[#002855] rounded-xl text-white focus:outline-none focus:border-[#FF6B00] transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Student ID</label>
                  <input type="text" defaultValue="NG-2026-0089" disabled className="w-full px-4 py-3 bg-[#001229]/50 border border-[#002855] rounded-xl text-gray-500 cursor-not-allowed" />
                </div>
              </div>

              <div className="pt-4 border-t border-[#002855] flex justify-end">
                <button className="bg-[#FF6B00] hover:bg-[#E66000] text-white px-8 py-3 rounded-xl font-bold text-sm transition-colors shadow-[0_5px_15px_rgba(255,107,0,0.3)]">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
