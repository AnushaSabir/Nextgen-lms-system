import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { FileText, PlusCircle, CheckCircle2 } from 'lucide-react'
import { generateInvoice } from '../actions'

export default async function AdminInvoicesPage() {
  const supabase = await createClient()
  
  // Fetch existing invoices
  const { data: invoices, error } = await supabase
    .from('invoices')
    .select('*, auth.users(email, user_metadata)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">Invoices & Fees</h1>
        <p className="text-gray-400 text-sm">Generate new fee challans and manage student payments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Generate Invoice Form */}
        <div className="lg:col-span-1">
          <div className="bg-[#001A3B]/40 backdrop-blur-md rounded-3xl p-6 shadow-lg border border-[#002855]">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <PlusCircle className="text-[#FF6B00]" /> Generate Invoice
            </h2>
            <form action={generateInvoice} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Student ID (UUID)</label>
                <input required type="text" name="student_id" className="w-full px-4 py-3 bg-[#001229] border border-[#002855] rounded-xl text-white focus:outline-none focus:border-[#FF6B00] transition-colors" placeholder="e.g. 550e8400-e29b..." />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Amount ($)</label>
                <input required type="number" step="0.01" name="amount" className="w-full px-4 py-3 bg-[#001229] border border-[#002855] rounded-xl text-white focus:outline-none focus:border-[#FF6B00] transition-colors" placeholder="450.00" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Due Date</label>
                <input required type="date" name="due_date" className="w-full px-4 py-3 bg-[#001229] border border-[#002855] rounded-xl text-white focus:outline-none focus:border-[#FF6B00] transition-colors" />
              </div>
              <button type="submit" className="w-full mt-4 bg-[#FF6B00] hover:bg-[#E66000] text-white px-4 py-3 rounded-xl font-bold text-sm transition-colors shadow-lg">
                Generate Invoice
              </button>
            </form>
          </div>
        </div>

        {/* Existing Invoices List */}
        <div className="lg:col-span-2">
          <div className="bg-[#001A3B]/40 backdrop-blur-md rounded-3xl shadow-lg border border-[#002855] overflow-hidden">
            <div className="p-6 border-b border-[#002855] bg-[#000E1F]/50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="text-[#00E5FF]" /> Issued Invoices
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#001A3B]/50 border-b border-[#002855]">
                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Invoice</th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Student</th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Amount</th>
                    <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#002855]">
                  {invoices && (invoices as any[]).map((inv) => (
                    <tr key={inv.id} className="hover:bg-[#001A3B] transition-colors">
                      <td className="py-4 px-6 font-mono text-sm text-white">{inv.invoice_number}</td>
                      <td className="py-4 px-6 text-sm text-gray-400">{inv.student_id}</td>
                      <td className="py-4 px-6 font-bold text-[#FF6B00]">${inv.amount}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider ${inv.status === 'Paid' ? 'bg-[#00E5FF]/10 text-[#00E5FF]' : inv.status === 'Under Review' ? 'bg-purple-500/10 text-purple-500' : 'bg-[#FFAA00]/10 text-[#FFAA00]'}`}>
                          {inv.status === 'Paid' && <CheckCircle2 size={12} />} {inv.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {inv.status !== 'Paid' && (
                          <div className="flex items-center gap-2">
                            <form action={async (formData) => {
                              'use server';
                              const { markInvoicePaid } = await import('../actions');
                              await markInvoicePaid(formData);
                            }}>
                              <input type="hidden" name="invoice_id" value={inv.id} />
                              <button type="submit" className="text-xs font-bold bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-white px-3 py-1.5 rounded-lg transition-colors">
                                Mark Paid
                              </button>
                            </form>
                            <form action={async (formData) => {
                              'use server';
                              const { sendFeeReminder } = await import('../actions');
                              await sendFeeReminder(formData);
                            }}>
                              <input type="hidden" name="invoice_id" value={inv.id} />
                              <button type="submit" className="text-xs font-bold bg-[#FF6B00]/20 text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white px-3 py-1.5 rounded-lg transition-colors">
                                Send Reminder
                              </button>
                            </form>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
