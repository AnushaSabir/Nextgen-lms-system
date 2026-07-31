import React from 'react';
import { Bell, CheckSquare, MessageSquare, PlusCircle } from 'lucide-react';

export default function NotificationsPage() {
  const notifications = [
    { id: 1, type: 'enroll', title: 'New Student Enrollment', desc: 'Sarah Khan enrolled in Advanced Web Dev.', time: '2 hours ago', icon: PlusCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
    { id: 2, type: 'submission', title: 'New Submission', desc: 'Ali Raza submitted React Portfolio.', time: '5 hours ago', icon: CheckSquare, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 3, type: 'message', title: 'New Message', desc: 'Zainab B. sent you a message.', time: '1 day ago', icon: MessageSquare, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-black text-[#0f3d1a] mb-2">Notifications</h1>
          <p className="text-[#1a6b2e]">Stay updated with student activity.</p>
        </div>
        <button className="text-sm font-bold text-[#d94d19] hover:text-[#ea580c]">
          Mark all as read
        </button>
      </div>

      <div className="bg-[#0f172a]/80 backdrop-blur-md border border-[#1e293b] rounded-[32px] overflow-hidden shadow-2xl">
        {notifications.map((notif, index) => {
          const Icon = notif.icon;
          return (
            <div key={notif.id} className={`p-6 flex items-start gap-5 hover:bg-white/[0.02] transition-colors ${index !== notifications.length - 1 ? 'border-b border-[#1e293b]' : ''}`}>
              <div className={`p-4 rounded-2xl ${notif.bg} border border-[#1a6b2e]/10`}>
                <Icon className={`w-6 h-6 ${notif.color}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[#0f3d1a] text-lg">{notif.title}</h3>
                <p className="text-[#1a6b2e] mt-1">{notif.desc}</p>
                <p className="text-xs text-[#64748b] mt-3 font-medium uppercase tracking-wider">{notif.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
