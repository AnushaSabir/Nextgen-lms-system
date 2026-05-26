import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { AlertCircle, User, Award, CalendarDays, Phone, Mail } from 'lucide-react'
import Link from 'next/link'

export default async function IDCardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <div>Please log in</div>
  }

  // Fetch all invoices for the student
  const { data: invoices } = await supabase
    .from('invoices')
    .select('*')
    .eq('student_id', user.id)

  const hasPendingDues = invoices?.some(inv => inv.status === 'Pending' || inv.status === 'Under Review')

  if (hasPendingDues) {
    return (
      <div className="space-y-8 pb-12">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2">Digital ID Card</h1>
          <p className="text-gray-400 text-sm">Your digital identity at NextGen IT Institute.</p>
        </div>

        <div className="bg-[#001A3B]/40 backdrop-blur-md rounded-3xl p-12 shadow-lg border border-red-500/20 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
            <AlertCircle size={40} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-white mb-4">Access Restricted</h2>
          <p className="text-gray-400 max-w-md mx-auto mb-8">
            Your Digital ID Card is currently locked because you have pending fee dues. Please clear your dues to access your ID Card and other restricted resources.
          </p>
          <Link 
            href="/dashboard/fee" 
            className="bg-[#FF6B00] hover:bg-[#E66000] text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-[0_0_15px_rgba(255,107,0,0.3)]"
          >
            Pay Now
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12 flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full text-center mb-4">
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">Digital ID Card</h1>
        <p className="text-gray-400 text-sm">Valid for academic year 2026-2027</p>
      </div>

      {/* ID Card Wrapper */}
      <div className="relative w-full max-w-md aspect-[1/1.5] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden bg-gradient-to-br from-[#000E1F] to-[#001A3B] border border-[#002855] group">
        
        {/* Lanyard Hole */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-3 bg-[#001229] border border-[#002855] rounded-full z-10 shadow-inner"></div>

        {/* Top Header */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-br from-[#FF6B00] to-[#E66000] rounded-b-[40px] flex items-start justify-center pt-10 px-8">
          <div className="text-center w-full">
             <h2 className="text-3xl font-black tracking-tighter">
              <span className="text-white">NEXT</span>
              <span className="text-[#000E1F]">GEN</span>
            </h2>
            <p className="text-[10px] text-white/80 tracking-[0.2em] mt-1 uppercase font-black">IT Institute</p>
          </div>
        </div>

        {/* Card Content */}
        <div className="absolute inset-0 pt-36 px-8 pb-8 flex flex-col items-center z-20">
          
          {/* Profile Picture Placeholder */}
          <div className="w-32 h-32 rounded-full border-4 border-[#001A3B] bg-[#001229] shadow-2xl flex items-center justify-center overflow-hidden mb-6 relative">
             <User size={60} className="text-gray-500" />
             <div className="absolute inset-0 bg-gradient-to-tr from-[#FF6B00]/20 to-transparent"></div>
          </div>

          <div className="text-center mb-6 w-full space-y-1">
            <h3 className="text-2xl font-black text-white uppercase tracking-wide">{user.user_metadata?.full_name || 'Student'}</h3>
            <p className="text-[#00E5FF] font-mono text-sm tracking-widest font-bold">STUDENT</p>
          </div>

          {/* Details */}
          <div className="w-full bg-[#001229]/80 backdrop-blur-sm rounded-2xl p-5 space-y-4 border border-[#002855]">
            <div className="flex items-center gap-3">
              <Award size={16} className="text-[#FF6B00]" />
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Student ID</p>
                <p className="text-white text-xs font-mono">{user.id.substring(0, 13).toUpperCase()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-[#FF6B00]" />
              <div className="overflow-hidden">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Email</p>
                <p className="text-white text-xs truncate">{user.email}</p>
              </div>
            </div>
             <div className="flex items-center gap-3">
              <CalendarDays size={16} className="text-[#FF6B00]" />
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Valid Till</p>
                <p className="text-white text-xs font-mono">DEC 2027</p>
              </div>
            </div>
          </div>

          {/* Footer Barcode */}
          <div className="mt-auto pt-6 w-full flex flex-col items-center opacity-80 group-hover:opacity-100 transition-opacity">
            <div className="h-10 w-full max-w-[200px] bg-[repeating-linear-gradient(to_right,white,white_3px,transparent_3px,transparent_6px,white_6px,white_12px,transparent_12px,transparent_16px,white_16px,white_20px,transparent_20px,transparent_22px)] mb-2"></div>
            <p className="text-[8px] text-gray-600 font-mono tracking-[0.3em]">{user.id.toUpperCase()}</p>
          </div>
        </div>

        {/* Glow Effects */}
        <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-[#FF6B00]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 top-40 w-40 h-40 bg-[#00E5FF]/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>
    </div>
  )
}
