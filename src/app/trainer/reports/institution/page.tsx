import React from 'react';
import { Building2, Send, FileText, CheckCircle2 } from 'lucide-react';

export default function InstitutionReportsPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-[#0f3d1a] mb-2">Institution Reports</h1>
        <p className="text-[#1a6b2e]">Submit weekly/bi-weekly updates to your Institution Head.</p>
      </div>

      <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-[#1e293b] rounded-3xl p-8 shadow-2xl relative overflow-hidden transition-all duration-500 transform-style-3d hover:-translate-y-2 hover:scale-[1.01] hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)] hover:border-blue-500/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-bl-[100px] pointer-events-none" />
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center">
            <Building2 className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#0f3d1a]">Generate Report</h2>
            <p className="text-sm text-[#1a6b2e]">Select timeframe and generate automated progress stats.</p>
          </div>
        </div>

        <div className="space-y-6 relative z-10">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#64748b] uppercase">Report Type</label>
              <select className="w-full bg-[#c8e6c9] border border-[#1e293b] rounded-xl px-4 py-3 text-[#0f3d1a] focus:outline-none focus:border-[#5E6F58] transition-all appearance-none">
                <option>Weekly Update</option>
                <option>Bi-Weekly Update</option>
                <option>Monthly Overview</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#64748b] uppercase">Select Course</label>
              <select className="w-full bg-[#c8e6c9] border border-[#1e293b] rounded-xl px-4 py-3 text-[#0f3d1a] focus:outline-none focus:border-[#5E6F58] transition-all appearance-none">
                <option>Advanced Web Dev</option>
                <option>UI/UX Masterclass</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#64748b] uppercase">Additional Notes for Head</label>
            <textarea 
              className="w-full h-32 bg-[#c8e6c9] border border-[#1e293b] rounded-xl p-4 text-sm text-[#0f3d1a] placeholder:text-[#475569] focus:outline-none focus:border-[#5E6F58] transition-all resize-none"
              placeholder="Highlight any specific student achievements or issues..."
            ></textarea>
          </div>

          <div className="bg-[#1e293b]/50 p-4 rounded-xl border border-[#334155] flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <p className="text-sm text-[#1a6b2e]">Automated stats (Enrollment count, avg score, completion rate) will be automatically attached.</p>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <button className="flex-1 flex justify-center items-center gap-2 bg-[#5E6F58] hover:bg-[#ea580c] text-[#0f3d1a] py-4 rounded-xl font-bold shadow-[0_0_20px_rgba(240,89,31,0.3)] transition-all active:scale-95">
              <Send className="w-5 h-5" /> Submit to Institution Head
            </button>
            <button className="p-4 bg-[#1e293b] hover:bg-[#334155] rounded-xl text-[#0f3d1a] transition-colors border border-[#334155]" title="Preview Report">
              <FileText className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
