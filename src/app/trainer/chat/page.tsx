import React from 'react';
import { Search, Send, Paperclip, MoreVertical, Phone, Video } from 'lucide-react';

export default function ChatPage() {
  const contacts = [
    { id: 1, name: 'Sarah Khan', lastMessage: 'Thank you for the feedback!', time: '10:42 AM', active: true, unread: 0 },
    { id: 2, name: 'Ali Raza', lastMessage: 'Can you explain the hooks?', time: 'Yesterday', active: false, unread: 2 },
    { id: 3, name: 'Zainab B.', lastMessage: 'Assignment submitted.', time: 'Monday', active: false, unread: 0 },
  ];

  return (
    <div className="h-full max-w-7xl mx-auto flex flex-col md:flex-row gap-6 p-4 sm:p-6 animate-in fade-in duration-500">
      
      {/* Sidebar / Contacts */}
      <div className="w-full md:w-80 bg-white/[0.02] backdrop-blur-3xl border border-[#1a6b2e]/20 rounded-[40px] flex flex-col shadow-2xl overflow-hidden h-[85vh] transition-all duration-700 transform-style-3d hover:-translate-y-2 hover:scale-[1.01] hover:border-sky-500/30 hover:shadow-[0_20px_60px_rgba(240,89,31,0.2)]">
        <div className="p-6 border-b border-[#1e293b]">
          <h2 className="text-xl font-bold text-[#0f3d1a] mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
            <input 
              type="text" 
              placeholder="Search students..." 
              className="w-full bg-[#c8e6c9] border border-[#1e293b] rounded-xl pl-10 pr-4 py-2 text-sm text-[#0f3d1a] focus:outline-none focus:border-[#5E6F58] transition-all"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {contacts.map(contact => (
            <div key={contact.id} className={`p-4 border-b border-[#1e293b] flex items-center gap-3 cursor-pointer transition-colors ${contact.active ? 'bg-white/[0.05] border-l-2 border-l-[#5E6F58]' : 'hover:bg-white/[0.02] border-l-2 border-l-transparent'}`}>
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[#0f3d1a] font-bold text-sm">
                  {contact.name.split(' ').map(n => n[0]).join('')}
                </div>
                {contact.active && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0f172a]" />}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-[#0f3d1a] text-sm truncate">{contact.name}</h4>
                  <span className="text-xs text-[#64748b] whitespace-nowrap">{contact.time}</span>
                </div>
                <p className={`text-xs truncate ${contact.unread > 0 ? 'text-[#0f3d1a] font-medium' : 'text-[#64748b]'}`}>{contact.lastMessage}</p>
              </div>
              {contact.unread > 0 && (
                <div className="w-5 h-5 rounded-full bg-[#5E6F58] flex items-center justify-center text-[#0f3d1a] text-[10px] font-bold">
                  {contact.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-white/[0.02] backdrop-blur-3xl border border-[#1a6b2e]/20 rounded-[24px] sm:rounded-[40px] flex flex-col shadow-2xl h-[60vh] md:h-[85vh] transition-all duration-700 transform-style-3d hover:-translate-y-2 hover:scale-[1.01] hover:border-sky-500/30 hover:shadow-[0_20px_60px_rgba(240,89,31,0.2)]">
        {/* Chat Header */}
        <div className="p-4 sm:p-6 border-b border-[#1e293b] flex justify-between items-center bg-[#c8e6c9]/50 rounded-t-[24px] sm:rounded-t-3xl">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[#0f3d1a] font-bold text-sm">
              SK
            </div>
            <div>
              <h3 className="font-bold text-[#0f3d1a]">Sarah Khan</h3>
              <p className="text-xs text-green-400">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-[#64748b] hover:text-[#0f3d1a] bg-[#1e293b] rounded-full transition-colors">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-2 text-[#64748b] hover:text-[#0f3d1a] bg-[#1e293b] rounded-full transition-colors">
              <Video className="w-4 h-4" />
            </button>
            <button className="p-2 text-[#64748b] hover:text-[#0f3d1a] bg-[#1e293b] rounded-full transition-colors ml-2">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 hide-scrollbar">
          <div className="text-center text-xs text-[#64748b] my-4">Today</div>
          
          <div className="flex items-end gap-3 max-w-[80%]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex-shrink-0" />
            <div className="bg-[#1e293b] p-4 rounded-2xl rounded-bl-sm text-sm text-[#1a6b2e]">
              Hello! I had a question about the assignment submission. Do I need to include the node_modules folder?
            </div>
            <span className="text-[10px] text-[#64748b] mb-1">10:30 AM</span>
          </div>

          <div className="flex items-end gap-3 max-w-[80%] ml-auto flex-row-reverse">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex-shrink-0" />
            <div className="bg-gradient-to-r from-[#5E6F58] to-sky-500 p-4 rounded-2xl rounded-br-sm text-sm text-[#0f3d1a] shadow-[0_0_15px_rgba(240,89,31,0.2)]">
              Hi Sarah! No, please do not include the node_modules. Just push your code to GitHub or submit the zipped src folder.
            </div>
            <span className="text-[10px] text-[#64748b] mb-1">10:40 AM</span>
          </div>
          
          <div className="flex items-end gap-3 max-w-[80%]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex-shrink-0" />
            <div className="bg-[#1e293b] p-4 rounded-2xl rounded-bl-sm text-sm text-[#1a6b2e]">
              Understood. Thank you for the feedback!
            </div>
            <span className="text-[10px] text-[#64748b] mb-1">10:42 AM</span>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-[#1e293b] bg-[#c8e6c9]/50 rounded-b-3xl">
          <div className="flex items-center gap-3">
            <button className="p-3 text-[#64748b] hover:text-[#0f3d1a] hover:bg-[#1e293b] rounded-xl transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            <input 
              type="text" 
              placeholder="Type your message..." 
              className="flex-1 bg-[#1e293b]/50 border border-[#1e293b] rounded-xl px-4 py-3 text-sm text-[#0f3d1a] focus:outline-none focus:border-[#5E6F58] transition-all"
            />
            <button className="p-3 bg-[#5E6F58] hover:bg-[#ea580c] text-[#0f3d1a] rounded-xl shadow-lg transition-all active:scale-95">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
