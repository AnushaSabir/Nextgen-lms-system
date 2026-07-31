'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, Heart, ArrowRight, ChevronDown } from 'lucide-react';

const Footer = () => {
  // State to manage accordion open/close on mobile
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const quickLinks = [
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'For Learners', href: '/for-learners' },
    { name: 'For Trainers', href: '/for-trainers' },
    { name: 'For Institutions', href: '/for-institutions' },
  ];

  const supportLinks = [
    { name: 'Pricing', href: '/pricing' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms-of-service' },
  ];

  const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
  );
  const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
  );
  const TwitterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
  );
  const YoutubeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
  );

  const socialLinks = [
    { Icon: FacebookIcon, label: 'Facebook', href: 'https://www.facebook.com/nextgen-lms', hoverBg: 'hover:bg-blue-600 hover:border-blue-600' },
    { Icon: InstagramIcon, label: 'Instagram', href: 'https://www.instagram.com/nextgen-lms', hoverBg: 'hover:bg-pink-600 hover:border-pink-600' },
    { Icon: TwitterIcon, label: 'Twitter', href: 'https://x.com/nextgen-lms', hoverBg: 'hover:bg-gray-800 hover:border-gray-800' },
    { Icon: YoutubeIcon, label: 'YouTube', href: 'https://www.youtube.com/@NextGen-LMS', hoverBg: 'hover:bg-red-600 hover:border-red-600' },
  ];

  return (
    <footer className="bg-navy-900 relative overflow-hidden">
      {/* Subtle ambient glow - SaaS style */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#5E6F58]/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-8 relative z-10">

        {/* ── Top Area: Brand & Connect ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12 border-b border-[#1a6b2e]/10 pb-10">
          <div className="max-w-md">
            <Link href="/" className="inline-flex items-center gap-3 group mb-4">
              <div className="w-10 h-10 bg-[#5E6F58] rounded-xl flex items-center justify-center shadow-lg shadow-[#5E6F58]/20 transition-transform group-hover:rotate-6 duration-300">
                <span className="text-[#0f3d1a] font-black text-xl">N</span>
              </div>
              <h2 className="text-2xl font-bold text-[#0f3d1a] tracking-tight">
                NEXT<span className="text-[#d94d19]">GEN</span>
              </h2>
            </Link>
            <p className="text-[#1a6b2e] text-sm leading-relaxed">
              Pakistan&apos;s first skill-based learning platform directly connected to a live freelance marketplace.{' '}
              <span className="text-[#0f3d1a] font-medium">Learn, get certified, and start earning instantly.</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <p className="text-xs font-semibold text-[#7dab52] uppercase tracking-widest">Connect with us</p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const { Icon } = social;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`w-10 h-10 rounded-lg border border-[#1a6b2e]/20 flex items-center justify-center text-[#1a6b2e] transition-all duration-300 hover:text-[#0f3d1a] hover:-translate-y-1 ${social.hoverBg}`}
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Middle Grid: Links & Contact ── */}
        {/* On mobile it's 1 col, on md it's 2 col, on lg it's 12 col */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 mb-12">
          
          {/* Quick Links - Collapsible on Mobile */}
          <div className="lg:col-span-3">
            <button 
              onClick={() => toggleSection('quick')}
              className="w-full flex items-center justify-between text-[#0f3d1a] font-semibold text-sm uppercase tracking-wider mb-4 lg:cursor-default group/heading"
            >
              <div className="flex items-center gap-3">
                Quick Links
                <span className="flex-1 h-px bg-gradient-to-r from-[#5E6F58]/50 to-transparent w-16"></span>
              </div>
              {/* Chevron Icon - Only visible on screens smaller than lg */}
              <ChevronDown className={`w-5 h-5 text-[#1a6b2e] lg:hidden transition-transform duration-300 ${openSection === 'quick' ? 'rotate-180' : 'rotate-0'}`} />
            </button>
            
            {/* Accordion Content */}
            <div className={`overflow-hidden transition-all duration-300 lg:max-h-full lg:opacity-100 ${openSection === 'quick' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 text-[#1a6b2e] hover:text-[#0f3d1a] transition-colors duration-200 text-sm"
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-[#d94d19] opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                      <span className="group-hover:translate-x-1 transition-transform duration-200">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Support - Collapsible on Mobile */}
          <div className="lg:col-span-3">
            <button 
              onClick={() => toggleSection('support')}
              className="w-full flex items-center justify-between text-[#0f3d1a] font-semibold text-sm uppercase tracking-wider mb-4 lg:cursor-default group/heading"
            >
              <div className="flex items-center gap-3">
                Support
                <span className="flex-1 h-px bg-gradient-to-r from-[#5E6F58]/50 to-transparent w-16"></span>
              </div>
              {/* Chevron Icon - Only visible on screens smaller than lg */}
              <ChevronDown className={`w-5 h-5 text-[#1a6b2e] lg:hidden transition-transform duration-300 ${openSection === 'support' ? 'rotate-180' : 'rotate-0'}`} />
            </button>
            
            {/* Accordion Content */}
            <div className={`overflow-hidden transition-all duration-300 lg:max-h-full lg:opacity-100 ${openSection === 'support' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <ul className="space-y-3">
                {supportLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 text-[#1a6b2e] hover:text-[#0f3d1a] transition-colors duration-200 text-sm"
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-[#d94d19] opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                      <span className="group-hover:translate-x-1 transition-transform duration-200">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Card - Premium Glassmorphism Effect */}
          <div className="md:col-span-2 lg:col-span-6 lg:pl-6">
            <div className="bg-white/[0.02] backdrop-blur-sm border border-[#1a6b2e]/20 rounded-2xl p-6 sm:p-8 h-full relative overflow-hidden group transition-all duration-500 hover:border-[#5E6F58]/30">
              {/* Hover glow effect inside card */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#5E6F58]/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-[#5E6F58]/20 transition-colors duration-500 pointer-events-none"></div>
              
              <h4 className="text-[#0f3d1a] font-semibold text-sm uppercase tracking-wider mb-6 flex items-center gap-3 relative z-10">
                Contact Us
                <span className="flex-1 h-px bg-gradient-to-r from-[#5E6F58]/50 to-transparent"></span>
              </h4>
              
              <div className="space-y-5 relative z-10">
                <a href="tel:+923411228760" className="flex items-start gap-4 group/call">
                  <div className="w-11 h-11 rounded-xl bg-[#1a6b2e]/5 border border-[#1a6b2e]/20 flex items-center justify-center text-[#d94d19] group-hover/call:bg-[#5E6F58] group-hover/call:text-[#0f3d1a] group-hover/call:border-[#5E6F58] transition-all duration-300 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-[#7dab52] mb-0.5 font-medium">Call Us Anytime</p>
                    <p className="text-base text-[#0f3d1a] font-semibold group-hover/call:text-[#0f3d1a] transition-colors">+92 341 1228760</p>
                    <p className="text-[11px] text-gray-600 mt-0.5">Mon - Fri 9am - 6pm</p>
                  </div>
                </a>

                <a href="mailto:info@nextgen-lms.co" className="flex items-start gap-4 group/mail">
                  <div className="w-11 h-11 rounded-xl bg-[#1a6b2e]/5 border border-[#1a6b2e]/20 flex items-center justify-center text-[#d94d19] group-hover/mail:bg-[#5E6F58] group-hover/mail:text-[#0f3d1a] group-hover/mail:border-[#5E6F58] transition-all duration-300 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-[#7dab52] mb-0.5 font-medium">Email Us</p>
                    <p className="text-base text-[#0f3d1a] font-semibold group-hover/mail:text-[#0f3d1a] transition-colors">info@nextgen-lms.co</p>
                    <p className="text-[11px] text-gray-600 mt-0.5">We reply within 24hrs</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="border-t border-[#1a6b2e]/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p className="text-[#7dab52] text-xs sm:text-sm order-2 sm:order-1">
            &copy; {new Date().getFullYear()} NextGen-LMS LMS. All Rights Reserved.
          </p>
          <div className="order-1 sm:order-2 flex items-center gap-1.5 text-xs text-[#7dab52]">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> in Pakistan
          </div>
          <div className="order-3 flex items-center gap-4">
            <Link href="/privacy" className="text-[#7dab52] hover:text-[#0f3d1a] transition-colors text-xs sm:text-sm">
              Privacy
            </Link>
            <Link href="/terms" className="text-[#7dab52] hover:text-[#0f3d1a] transition-colors text-xs sm:text-sm">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
