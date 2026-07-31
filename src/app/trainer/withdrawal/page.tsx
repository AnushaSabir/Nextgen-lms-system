'use client';

import React, { useState } from 'react';
import { CreditCard, ArrowLeft, ArrowRight, Wallet, ShieldCheck, Banknote } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToastStore } from '@/store/toast-store';

export default function WithdrawalPage() {
  const router = useRouter();
  const { showToast } = useToastStore();
  
  const [amount, setAmount] = useState('');
  const [selectedMethodId, setSelectedMethodId] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock available balance and methods
  const availableBalance = 4250.00;
  const methods = [
    { id: '1', provider: 'easypaisa', accountTitle: 'John Doe', accountNumber: '03001234567', isActive: true },
  ];

  const handleWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }
    
    if (numAmount > availableBalance) {
      showToast('Amount exceeds available balance', 'error');
      return;
    }

    if (!selectedMethodId) {
      showToast('Please select a withdrawal method', 'error');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API Call
    setTimeout(() => {
      setIsSubmitting(false);
      showToast(`Withdrawal request for $${numAmount} submitted successfully!`, 'success');
      router.push('/trainer/earnings');
    }, 1500);
  };

  return (
    <div className="p-6 md:p-12 w-full h-full relative overflow-y-auto hide-scrollbar z-10 animate-in fade-in zoom-in-95 duration-1000">
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-12">
        <div>
          <Link href="/trainer/earnings" className="inline-flex items-center text-sm font-semibold text-sky-400 hover:text-orange-300 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Earnings
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0f3d1a] mb-2 tracking-tight">Withdraw Funds</h1>
          <p className="text-[#1a6b2e]">Transfer your available balance to your preferred account.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Col - Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white/[0.02] backdrop-blur-2xl border border-[#1a6b2e]/20 rounded-[40px] p-8 md:p-10 shadow-2xl transition-all duration-700 transform-style-3d hover:border-white/20">
            <form onSubmit={handleWithdrawal} className="space-y-8">
              
              {/* Amount Input */}
              <div>
                <label className="block text-sm font-bold text-[#1a6b2e] uppercase tracking-wider mb-4">Amount to Withdraw</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <span className="text-3xl font-black text-[#1a6b2e]">$</span>
                  </div>
                  <input 
                    type="number" 
                    min="1"
                    step="0.01"
                    max={availableBalance}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 bg-[#c8e6c9]/50 border-2 border-[#1a6b2e]/20 rounded-3xl text-4xl font-black text-[#0f3d1a] placeholder-gray-600 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 transition-all"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="flex justify-between mt-3 text-sm">
                  <span className="text-[#7dab52]">Available: <strong className="text-[#0f3d1a]">${availableBalance.toFixed(2)}</strong></span>
                  <button type="button" onClick={() => setAmount(availableBalance.toString())} className="text-sky-400 hover:text-orange-300 font-bold">
                    Withdraw Max
                  </button>
                </div>
              </div>

              {/* Method Selection */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-bold text-[#1a6b2e] uppercase tracking-wider">Select Method</label>
                  <Link href="/trainer/profile" className="text-xs font-bold text-blue-400 hover:text-blue-300">
                    Manage Methods
                  </Link>
                </div>

                {methods.length === 0 ? (
                  <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
                    <p className="text-red-400 mb-3">You haven't added any withdrawal methods.</p>
                    <Link href="/trainer/profile" className="inline-block bg-red-500/20 text-red-300 px-4 py-2 rounded-xl font-bold hover:bg-red-500/30">
                      Add a Method
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {methods.map(m => (
                      <label 
                        key={m.id} 
                        className={`flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all ${selectedMethodId === m.id ? 'border-sky-500 bg-sky-500/10' : 'border-[#1a6b2e]/20 bg-[#c8e6c9]/50 hover:border-white/20'}`}
                      >
                        <input 
                          type="radio" 
                          name="withdrawalMethod" 
                          value={m.id} 
                          checked={selectedMethodId === m.id}
                          onChange={() => setSelectedMethodId(m.id)}
                          className="sr-only"
                        />
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm uppercase mr-4 ${selectedMethodId === m.id ? 'bg-sky-500 text-[#0f3d1a]' : 'bg-gray-800 text-[#1a6b2e]'}`}>
                          {m.provider.substring(0, 2)}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-[#0f3d1a] capitalize">{m.provider}</p>
                          <p className="text-sm text-[#1a6b2e]">{m.accountTitle} &bull; {m.accountNumber}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethodId === m.id ? 'border-sky-500' : 'border-gray-600'}`}>
                          {selectedMethodId === m.id && <div className="w-3 h-3 rounded-full bg-sky-500" />}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit */}
              <button 
                type="submit" 
                disabled={isSubmitting || methods.length === 0}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-600 to-sky-500 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-[#0f3d1a] px-6 py-5 rounded-3xl font-black shadow-[0_10px_40px_-10px_rgba(240,89,31,0.5)] transition-all active:scale-95 text-lg"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  <>
                    <Banknote className="w-6 h-6" /> Submit Request
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Col - Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-b from-[#0f172a] to-[#020617] border border-[#1a6b2e]/20 rounded-[40px] p-8 shadow-2xl">
            <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#0f3d1a] mb-4">Secure Withdrawals</h3>
            <p className="text-[#1a6b2e] leading-relaxed mb-6">
              Your earnings are safe with NextGen-LMS. Withdrawal requests are processed within <strong>24-48 hours</strong> during business days. 
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-[#1a6b2e]">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2" />
                Minimum withdrawal amount is $50.00
              </li>
              <li className="flex items-start gap-3 text-sm text-[#1a6b2e]">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2" />
                Make sure your account details match your profile name perfectly.
              </li>
              <li className="flex items-start gap-3 text-sm text-[#1a6b2e]">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-2" />
                No hidden fees. You get exactly what you earned.
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
