'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Sparkles, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    role: 'Student',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#323232] text-white pt-24 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-[#50BED9]/[0.08] via-[#159BD7]/[0.04] to-transparent rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#50BED9]/30 bg-[#151515] text-[#50BED9] text-xs font-black uppercase tracking-widest shadow-md">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Connect with NextGen Studio</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Let's Talk About <br />
            <span className="bg-gradient-to-r from-[#50BED9] via-[#159BD7] to-[#33C6B6] bg-clip-text text-transparent">
              Your Learning Future
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#D0D3D6] max-w-2xl mx-auto font-medium leading-relaxed">
            Have questions about courses, institutional pilots, or instructor partnerships? Our advisory team is here to assist you.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#101010] border border-[#353638] rounded-3xl p-8 space-y-6 shadow-xl">
              <h3 className="text-2xl font-black text-white">Direct Communication</h3>
              <p className="text-sm text-[#D0D3D6] leading-relaxed">
                We typically respond to student inquiries within 2 hours, and institutional proposals within 24 business hours.
              </p>

              <div className="space-y-6 pt-2">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#151515] border border-[#353638] text-[#50BED9] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Email Addresses</h4>
                    <p className="text-xs text-[#50BED9] font-medium mt-0.5">support@nextgen-lms.com</p>
                    <p className="text-xs text-[#D0D3D6]/70 mt-0.5">enterprise@nextgen-lms.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#151515] border border-[#353638] text-[#33C6B6] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Direct Advisory Line</h4>
                    <p className="text-xs text-white font-semibold mt-0.5">+1 (800) 592-NEXTGEN</p>
                    <p className="text-xs text-[#D0D3D6]/70 mt-0.5">Mon – Fri, 9:00 AM – 6:00 PM EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#151515] border border-[#353638] text-[#159BD7] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Global Headquarters</h4>
                    <p className="text-xs text-[#D0D3D6] mt-0.5">Innovation Way, Silicon Oasis</p>
                    <p className="text-xs text-[#D0D3D6]/70">Digital Hub, Building 4</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Guarantees */}
            <div className="p-6 rounded-2xl bg-[#151515] border border-[#353638] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-[#33C6B6]" />
                <span>Strict Data Privacy & NDA Compliant</span>
              </div>
              <p className="text-[11px] text-[#D0D3D6]/70 leading-relaxed">
                Your submitted contact details and institutional data are fully encrypted and never shared with third parties.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-[#101010] border border-[#50BED9]/30 rounded-3xl p-8 sm:p-12 shadow-2xl">
            {submitted ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-[#50BED9]/20 border border-[#50BED9] rounded-2xl flex items-center justify-center mx-auto text-[#50BED9]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white">Message Received!</h3>
                <p className="text-sm text-[#D0D3D6] max-w-md mx-auto">
                  Thank you for reaching out. An advisory lead from NextGen Studio will review your message and respond shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#353638] text-white text-xs font-bold hover:bg-[#50BED9] hover:text-[#101010] transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-white">Send Us a Message</h3>
                  <p className="text-xs text-[#D0D3D6]">Fill out the form below and we will get back to you promptly.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#D0D3D6]">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#151515] border border-[#353638] focus:border-[#50BED9] rounded-xl px-4 py-3 text-sm text-white placeholder-[#D0D3D6]/40 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#D0D3D6]">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#151515] border border-[#353638] focus:border-[#50BED9] rounded-xl px-4 py-3 text-sm text-white placeholder-[#D0D3D6]/40 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#D0D3D6]">I am a...</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-[#151515] border border-[#353638] focus:border-[#50BED9] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                    >
                      <option value="Student">Student / Independent Learner</option>
                      <option value="University">University / College Dean</option>
                      <option value="Enterprise">Enterprise Team Leader</option>
                      <option value="Other">General Inquiry</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#D0D3D6]">Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Institutional Pilot Inquiry"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-[#151515] border border-[#353638] focus:border-[#50BED9] rounded-xl px-4 py-3 text-sm text-white placeholder-[#D0D3D6]/40 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#D0D3D6]">Message Details</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your learning goals or organization's requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#151515] border border-[#353638] focus:border-[#50BED9] rounded-xl p-4 text-sm text-white placeholder-[#D0D3D6]/40 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-[#50BED9] hover:bg-[#159BD7] text-[#101010] hover:text-white font-black text-sm transition-all shadow-lg hover:scale-[1.01] flex items-center justify-center gap-2"
                >
                  <span>Send Message</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
