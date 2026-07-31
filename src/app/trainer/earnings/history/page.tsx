import React from 'react';
import { ArrowLeft, Download, Filter } from 'lucide-react';
import Link from 'next/link';

export default function RevenueHistoryPage() {
  const history = [
    { id: 'TRX-1092', date: 'Oct 24, 2026', type: 'Course Sale', details: 'Advanced Web Dev (Sale Price: $50)', amount: '+$35.00', status: 'Cleared' },
    { id: 'TRX-1091', date: 'Oct 23, 2026', type: 'Withdrawal', details: 'Bank Transfer to Meezan Bank', amount: '-$1,000.00', status: 'Completed' },
    { id: 'TRX-1090', date: 'Oct 22, 2026', type: 'Course Sale', details: 'UI/UX Masterclass (Sale Price: $40)', amount: '+$28.00', status: 'Pending' },
    { id: 'TRX-1089', date: 'Oct 20, 2026', type: 'Course Sale', details: 'Python Data Scraping (Sale Price: $30)', amount: '+$21.00', status: 'Cleared' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <Link href="/dashboard/trainer/earnings" className="inline-flex items-center gap-2 text-[#64748b] hover:text-[#0f3d1a] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-black text-[#0f3d1a] mb-2">Revenue History</h1>
          <p className="text-[#1a6b2e]">Detailed log of all transactions and sales.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-[#0f172a] border border-[#1e293b] text-[#0f3d1a] px-4 py-2.5 rounded-xl hover:bg-[#1e293b] transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 bg-[#5E6F58] text-[#0f3d1a] px-4 py-2.5 rounded-xl hover:bg-[#ea580c] transition-colors shadow-[0_0_15px_rgba(240,89,31,0.3)]">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-[#0f172a]/80 backdrop-blur-md border border-[#1e293b] rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#1e293b] bg-[#c8e6c9]/50">
              <th className="p-5 text-xs font-bold text-[#64748b] uppercase tracking-wider">Transaction ID</th>
              <th className="p-5 text-xs font-bold text-[#64748b] uppercase tracking-wider">Date</th>
              <th className="p-5 text-xs font-bold text-[#64748b] uppercase tracking-wider">Type / Details</th>
              <th className="p-5 text-xs font-bold text-[#64748b] uppercase tracking-wider text-right">Amount (70%)</th>
              <th className="p-5 text-xs font-bold text-[#64748b] uppercase tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id} className="border-b border-[#1e293b] hover:bg-white/[0.02] transition-colors">
                <td className="p-5 text-sm font-mono text-[#1a6b2e]">{item.id}</td>
                <td className="p-5 text-sm text-[#1a6b2e]">{item.date}</td>
                <td className="p-5">
                  <p className="font-bold text-[#0f3d1a]">{item.type}</p>
                  <p className="text-xs text-[#64748b]">{item.details}</p>
                </td>
                <td className={`p-5 text-right font-black ${item.amount.startsWith('+') ? 'text-green-400' : 'text-[#0f3d1a]'}`}>
                  {item.amount}
                </td>
                <td className="p-5 text-right">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    item.status === 'Cleared' || item.status === 'Completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                  }`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
