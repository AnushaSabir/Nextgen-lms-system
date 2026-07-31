import React from 'react';
import { ShieldCheck, UserCheck, UserX, FileText, Camera, Video } from 'lucide-react';

export default function TrainerApprovalPage() {
  const pendingTrainers = [
    { id: 1, name: 'Hassan Ali', expertise: 'Machine Learning', applied: '2 hours ago', status: 'Pending Review' },
    { id: 2, name: 'Fatima Noor', expertise: 'UI/UX Design', applied: '1 day ago', status: 'Pending Review' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-black text-[#0f3d1a] mb-2 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-[#d94d19]" /> Trainer Approvals
          </h1>
          <p className="text-[#1a6b2e]">Review trainer applications, videos, and environment proofs.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {pendingTrainers.map((trainer) => (
          <div key={trainer.id} className="bg-[#0f172a]/80 backdrop-blur-md border border-[#1e293b] rounded-[32px] p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-8">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#5E6F58]/5 rounded-bl-[100px] pointer-events-none" />
            
            <div className="md:w-1/3 border-r border-[#1e293b] pr-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[#0f3d1a] font-black text-xl shadow-lg mb-4">
                {trainer.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h2 className="text-2xl font-bold text-[#0f3d1a]">{trainer.name}</h2>
              <p className="text-[#d94d19] font-medium text-sm mb-4">{trainer.expertise}</p>
              <p className="text-xs text-[#64748b] mb-6">Applied: {trainer.applied}</p>
              
              <div className="flex gap-3">
                <button className="flex-1 bg-green-500 hover:bg-green-600 text-[#0f3d1a] py-2.5 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2">
                  <UserCheck className="w-4 h-4" /> Approve
                </button>
                <button className="flex-1 bg-[#1e293b] hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 text-[#1a6b2e] py-2.5 rounded-xl font-bold transition-all border border-[#334155] flex items-center justify-center gap-2">
                  <UserX className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>

            <div className="md:w-2/3 grid grid-cols-2 gap-6 relative z-10">
              <div className="bg-[#c8e6c9] rounded-2xl p-5 border border-[#1e293b] hover:border-[#5E6F58]/50 transition-colors cursor-pointer group">
                <Video className="w-6 h-6 text-[#64748b] mb-3 group-hover:text-[#d94d19]" />
                <h4 className="font-bold text-[#0f3d1a] mb-1">Demo Lecture</h4>
                <p className="text-xs text-[#1a6b2e]">Review teaching style & HD video quality.</p>
              </div>
              <div className="bg-[#c8e6c9] rounded-2xl p-5 border border-[#1e293b] hover:border-[#5E6F58]/50 transition-colors cursor-pointer group">
                <Camera className="w-6 h-6 text-[#64748b] mb-3 group-hover:text-[#d94d19]" />
                <h4 className="font-bold text-[#0f3d1a] mb-1">Equipment Proof</h4>
                <p className="text-xs text-[#1a6b2e]">Verify DSLR/iPhone camera setup.</p>
              </div>
              <div className="bg-[#c8e6c9] rounded-2xl p-5 border border-[#1e293b] hover:border-[#5E6F58]/50 transition-colors cursor-pointer group">
                <Camera className="w-6 h-6 text-[#64748b] mb-3 group-hover:text-[#d94d19]" />
                <h4 className="font-bold text-[#0f3d1a] mb-1">Workspace Proof</h4>
                <p className="text-xs text-[#1a6b2e]">Verify professional environment.</p>
              </div>
              <div className="bg-[#c8e6c9] rounded-2xl p-5 border border-[#1e293b] hover:border-[#5E6F58]/50 transition-colors cursor-pointer group">
                <FileText className="w-6 h-6 text-[#64748b] mb-3 group-hover:text-[#d94d19]" />
                <h4 className="font-bold text-[#0f3d1a] mb-1">CV & Portfolio</h4>
                <p className="text-xs text-[#1a6b2e]">Review professional background.</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
