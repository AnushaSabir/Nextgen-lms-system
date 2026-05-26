import React from 'react'
import { Settings, Shield, Bell, Save } from 'lucide-react'

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">Portal Settings</h1>
        <p className="text-gray-400 text-sm">Configure institute details and administrative preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#001A3B]/40 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-[#002855]">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Shield className="text-[#FF6B00]" /> Institute Profile
          </h2>
          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Institute Name</label>
              <input type="text" defaultValue="NextGen IT Institute" className="w-full px-4 py-3 bg-[#001229] border border-[#002855] rounded-xl text-white focus:outline-none focus:border-[#FF6B00] transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Support Email</label>
              <input type="email" defaultValue="support@nextgenit.edu" className="w-full px-4 py-3 bg-[#001229] border border-[#002855] rounded-xl text-white focus:outline-none focus:border-[#FF6B00] transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Bank Account IBAN</label>
              <input type="text" defaultValue="PK35 SCBL 0000 0001 2345 67" className="w-full px-4 py-3 bg-[#001229] border border-[#002855] rounded-xl text-white focus:outline-none focus:border-[#FF6B00] transition-colors" />
            </div>
            <button type="button" className="w-full mt-4 bg-[#FF6B00] hover:bg-[#E66000] text-white px-4 py-3 rounded-xl font-bold text-sm transition-colors shadow-lg flex items-center justify-center gap-2">
              <Save size={18} /> Save Configurations
            </button>
          </form>
        </div>

        <div className="bg-[#001A3B]/40 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-[#002855]">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Bell className="text-[#00E5FF]" /> Notification Preferences
          </h2>
          <div className="space-y-4">
            {[
              { label: 'Email alerts for new student signups', enabled: true },
              { label: 'Weekly fee collection reports', enabled: true },
              { label: 'Admin login security alerts', enabled: false },
            ].map((pref, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-[#001229] border border-[#002855]">
                <span className="text-sm font-medium text-gray-300">{pref.label}</span>
                <button className={`w-12 h-6 rounded-full relative transition-colors ${pref.enabled ? 'bg-[#00E5FF]' : 'bg-gray-700'}`}>
                  <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${pref.enabled ? 'translate-x-6' : ''}`}></span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
