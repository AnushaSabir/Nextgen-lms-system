import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { Building2, CheckCircle2, Clock, Upload, AlertCircle } from 'lucide-react'
import { submitPaymentReference } from '../actions'

export default async function FeePage() {
  const supabase = await createClient()
  
  const { data: invoices, error } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false })

  const totalDue = invoices 
    ? invoices.filter(inv => inv.status === 'Pending').reduce((sum, inv) => sum + Number(inv.amount), 0)
    : 0

  const pendingInvoices = invoices ? invoices.filter(inv => inv.status === 'Pending').sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()) : []
  const earliestDueDate = pendingInvoices.length > 0 ? pendingInvoices[0].due_date : null
  const currentInvoice = pendingInvoices.length > 0 ? pendingInvoices[0] : null

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">Fee Payment</h1>
        <p className="text-gray-400 text-sm">Pay your tuition fees manually via Bank Transfer.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-[#FF6B00] to-[#E66000] rounded-3xl p-8 shadow-[0_10px_30px_rgba(255,107,0,0.3)] relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div>
            <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest mb-1">Current Balance Due</h3>
            <div className="text-5xl font-black text-white mb-6">${totalDue.toFixed(2)}</div>
            {earliestDueDate && (
              <div className="flex items-center gap-2 text-white/90 font-medium">
                <Clock size={16} /> Due by: {new Date(earliestDueDate).toLocaleDateString()}
              </div>
            )}
          </div>
          {currentInvoice && (
            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-white font-bold mb-2">Paying for Invoice: {currentInvoice.invoice_number}</p>
            </div>
          )}
        </div>

        {/* Bank Details & Submission Card */}
        <div className="bg-[#001A3B]/40 backdrop-blur-md rounded-3xl shadow-lg border border-[#002855] overflow-hidden flex flex-col">
          <div className="p-6 border-b border-[#002855] bg-[#000E1F]/50">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="text-[#00E5FF]" /> Bank Account Details
            </h3>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-3 bg-[#001229] p-4 rounded-xl border border-[#002855]">
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm font-bold">Bank Name:</span>
                <span className="text-white text-sm font-black">Standard Chartered</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm font-bold">Account Title:</span>
                <span className="text-white text-sm font-black">NextGen IT Institute</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm font-bold">IBAN:</span>
                <span className="text-[#00E5FF] text-sm font-mono tracking-wider">PK35 SCBL 0000 0001 2345 67</span>
              </div>
            </div>

            {currentInvoice ? (
              <form action={submitPaymentReference} className="space-y-4">
                <input type="hidden" name="invoice_id" value={currentInvoice.id} />
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Submit Transaction ID</label>
                  <input required type="text" name="reference" className="w-full px-4 py-3 bg-[#001229] border border-[#002855] rounded-xl text-white focus:outline-none focus:border-[#FF6B00] transition-colors" placeholder="e.g. TID-123456789" />
                </div>
                <button type="submit" className="w-full bg-[#FF6B00] hover:bg-[#E66000] text-white px-4 py-3 rounded-xl font-bold text-sm transition-colors shadow-lg flex items-center justify-center gap-2">
                  <Upload size={18} /> Submit for Verification
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2 text-gray-400 text-sm justify-center bg-[#001229] p-4 rounded-xl border border-[#002855]">
                <CheckCircle2 className="text-green-500" /> You have no pending invoices.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#001A3B]/40 backdrop-blur-md rounded-3xl shadow-lg border border-[#002855] overflow-hidden">
        <div className="p-6 border-b border-[#002855] bg-[#000E1F]/50">
          <h2 className="text-lg font-bold text-white">Payment History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#001A3B]/50 border-b border-[#002855]">
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Invoice</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Amount</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#002855]">
              {invoices && invoices.map((item) => {
                let statusColor = 'bg-[#FFAA00]/10 text-[#FFAA00]'
                let StatusIcon = AlertCircle
                if (item.status === 'Paid') {
                  statusColor = 'bg-green-500/10 text-green-500'
                  StatusIcon = CheckCircle2
                } else if (item.status === 'Under Review') {
                  statusColor = 'bg-[#00E5FF]/10 text-[#00E5FF]'
                  StatusIcon = Clock
                }

                return (
                  <tr key={item.id} className="hover:bg-[#001229] transition-colors">
                    <td className="py-4 px-6 font-mono text-sm text-gray-300">
                      {item.invoice_number}
                      {item.stripe_session_id && <div className="text-[10px] text-gray-500 mt-1">Ref: {item.stripe_session_id}</div>}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-400">{new Date(item.created_at).toLocaleDateString()}</td>
                    <td className="py-4 px-6 font-bold text-white">${item.amount}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider ${statusColor}`}>
                        <StatusIcon size={14} /> {item.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {(!invoices || invoices.length === 0) && (
            <div className="p-12 text-center text-gray-500 font-medium">
              No invoices generated yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
