import React from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="pt-28 sm:pt-40 pb-16 sm:pb-20 px-4 sm:px-6 min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 inset-x-0 h-[600px] pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557200134-90327ee9fafa?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/50 via-[#020617]/80 to-[#020617]" />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primaryBlue/20 blur-[150px] rounded-full" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-14 sm:mb-20 space-y-4 sm:space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primaryBlue/20 bg-primaryBlue/10 text-primaryBlue text-xs font-bold uppercase tracking-widest shadow-sm">
            <MessageSquare className="w-3.5 h-3.5" /> Get in Touch
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0f3d1a] leading-tight tracking-tight text-3d">
            Let's Talk About <span className="text-primaryBlue text-3d-orange">Your Future.</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-[#1a6b2e] font-medium leading-relaxed">
            Whether you want to partner with us, request a demo, or simply ask a question, our team is ready to help.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          
          {/* Left Side: Contact Info */}
          <div className="space-y-8 sm:space-y-12">
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0f3d1a]">Contact Information</h2>
              <p className="text-[#1a6b2e] leading-relaxed">
                Fill out the form and our team will get back to you within 24 hours. We are dedicated to providing the best support for our learners and partners.
              </p>
            </div>

            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="w-14 h-14 rounded-2xl bg-[#1a6b2e]/5 border border-[#1a6b2e]/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primaryBlue" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[#0f3d1a] font-bold mb-1">Email Us</h4>
                  <p className="text-[#1a6b2e]">support@nextgen-lms.com</p>
                  <p className="text-[#1a6b2e]">partnerships@nextgen-lms.com</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="w-14 h-14 rounded-2xl bg-[#1a6b2e]/5 border border-[#1a6b2e]/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primaryBlue" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[#0f3d1a] font-bold mb-1">Call Us</h4>
                  <p className="text-[#1a6b2e]">+92 300 1234567</p>
                  <p className="text-sm text-darkGrayNumber mt-1">Mon-Fri from 9am to 6pm (PKT)</p>
                </div>
              </div>

              <div className="flex items-start gap-4 sm:gap-6">
                <div className="w-14 h-14 rounded-2xl bg-[#1a6b2e]/5 border border-[#1a6b2e]/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primaryBlue" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[#0f3d1a] font-bold mb-1">Headquarters</h4>
                  <p className="text-[#1a6b2e]">123 Tech Avenue, Block 4</p>
                  <p className="text-[#1a6b2e]">Lahore, Pakistan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="theme-card card-3d p-6 sm:p-10 md:p-12 rounded-[2rem] sm:rounded-[3rem] border-[#1a6b2e]/20 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primaryBlue/10 blur-[100px] rounded-full pointer-events-none" />
            
            <form className="relative z-10 space-y-5 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#0f3d1a] uppercase tracking-wider">First Name</label>
                  <input type="text" placeholder="John" className="w-full min-w-0 bg-[#c8e6c9] border border-[#1a6b2e]/20 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3.5 sm:py-4 text-[#0f3d1a] focus:outline-none focus:border-primaryBlue transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#0f3d1a] uppercase tracking-wider">Last Name</label>
                  <input type="text" placeholder="Doe" className="w-full min-w-0 bg-[#c8e6c9] border border-[#1a6b2e]/20 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3.5 sm:py-4 text-[#0f3d1a] focus:outline-none focus:border-primaryBlue transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#0f3d1a] uppercase tracking-wider">Email Address</label>
                <input type="email" placeholder="john@company.com" className="w-full min-w-0 bg-[#c8e6c9] border border-[#1a6b2e]/20 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3.5 sm:py-4 text-[#0f3d1a] focus:outline-none focus:border-primaryBlue transition-colors" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#0f3d1a] uppercase tracking-wider">Subject / Inquiry Type</label>
                <select className="w-full min-w-0 bg-[#c8e6c9] border border-[#1a6b2e]/20 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3.5 sm:py-4 text-[#0f3d1a] focus:outline-none focus:border-primaryBlue transition-colors appearance-none">
                  <option>General Inquiry</option>
                  <option>Partner with Us (Institutions)</option>
                  <option>Request a Demo</option>
                  <option>Support & Billing</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#0f3d1a] uppercase tracking-wider">Message</label>
                <textarea rows={5} placeholder="Tell us how we can help you..." className="w-full min-w-0 bg-[#c8e6c9] border border-[#1a6b2e]/20 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3.5 sm:py-4 text-[#0f3d1a] focus:outline-none focus:border-primaryBlue transition-colors resize-none"></textarea>
              </div>

              <button type="button" className="w-full inline-flex items-center justify-center gap-2 py-3.5 sm:py-4 bg-gradient-to-r from-primaryBlue to-[#C6D6C0] text-[#0f3d1a] font-black text-sm sm:text-base rounded-xl shadow-lg shadow-primaryBlue/20 transition-all hover:-translate-y-0.5 hover:scale-[1.01] active:scale-95">
                <span>Send Message</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
