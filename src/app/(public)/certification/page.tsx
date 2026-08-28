'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Share2,
  QrCode,
  Sparkles,
  ArrowRight,
  Lock,
  Globe2,
  FileCheck,
} from 'lucide-react';

export default function CertificationPage() {
  const certFeatures = [
    {
      title: 'Cryptographic Verification',
      desc: 'Each certificate possesses a unique hash ID and tamper-proof verification URL on the NextGen Ledger.',
      icon: Lock,
    },
    {
      title: 'One-Click LinkedIn Sync',
      desc: 'Instantly add your verified skill badge and license ID directly to your LinkedIn Licenses & Certifications profile.',
      icon: Share2,
    },
    {
      title: 'Employer QR Verification',
      desc: 'Recruiters and hiring managers can scan the printed or digital QR code to verify coursework and quiz scores instantly.',
      icon: QrCode,
    },
    {
      title: 'Global Industry Standards',
      desc: 'Curricula mapped to modern enterprise job requirements across Web Architecture, AI/ML, Cloud, and Security.',
      icon: Globe2,
    },
  ];

  const steps = [
    { step: '1', title: 'Complete Coursework', desc: 'Finish 100% of video modules and practical sandbox labs.' },
    { step: '2', title: 'Pass Final Assessment', desc: 'Score 80% or higher on the comprehensive AI-evaluated final exam.' },
    { step: '3', title: 'Project Verification', desc: 'Submit your capstone portfolio project for instructor grading.' },
    { step: '4', title: 'Claim Digital Credential', desc: 'Download your high-resolution PDF certificate and share your digital badge.' },
  ];

  return (
    <div className="min-h-screen bg-[#323232] text-white pt-24 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-[#50BED9]/[0.08] via-[#33C6B6]/[0.04] to-transparent rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-20">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#50BED9]/30 bg-[#151515] text-[#50BED9] text-xs font-black uppercase tracking-widest shadow-md">
            <Award className="w-3.5 h-3.5" />
            <span>NextGen Verified Credentialing</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Certificates that <br />
            <span className="bg-gradient-to-r from-[#50BED9] via-[#159BD7] to-[#33C6B6] bg-clip-text text-transparent">
              Prove Real Competency
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#D0D3D6] max-w-2xl mx-auto font-medium leading-relaxed">
            Gain verified, sharable credentials upon successfully mastering courses and completing real-world projects on NextGen LMS.
          </p>

          <div className="flex justify-center pt-2">
            <Link
              href="/courses"
              className="px-8 py-4 bg-[#50BED9] hover:bg-[#159BD7] text-[#101010] hover:text-white font-black text-base rounded-2xl shadow-xl transition-all flex items-center gap-2"
            >
              <span>Explore Certified Courses</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Certificate Mockup Preview Card */}
        <div className="bg-[#101010] border border-[#50BED9]/30 rounded-[2.5rem] p-8 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#353638] text-[#33C6B6] text-xs font-black uppercase">
                <ShieldCheck className="w-4 h-4" /> Tamper-Proof Digital Verification
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                Stand Out in Technical Job Interviews
              </h2>
              <p className="text-sm text-[#D0D3D6] leading-relaxed">
                Employers don't just want course completion ticks — they want proof of applied skills. NextGen credentials verify your code repositories, test accuracy, and capstone implementations.
              </p>
              
              <div className="space-y-3 pt-2">
                {[
                  'Cryptographically signed by NextGen Academic Board',
                  'Embedded QR code for 1-second instant validation',
                  'High-resolution vector PDF ready for framing & printing',
                  'Permanent blockchain ledger record that never expires',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-[#D0D3D6]">
                    <CheckCircle2 className="w-4 h-4 text-[#33C6B6] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-2xl sm:rounded-3xl bg-[#151515] border-2 border-[#50BED9]/40 p-6 sm:p-8 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-[#353638] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#50BED9] text-[#101010] flex items-center justify-center font-black text-lg">
                      N
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">NEXTGEN STUDIO</h4>
                      <p className="text-[10px] text-[#50BED9] font-bold">Official Credential of Completion</p>
                    </div>
                  </div>
                  <Award className="w-8 h-8 text-amber-400" />
                </div>

                <div className="space-y-2 text-center py-2">
                  <p className="text-xs text-[#D0D3D6]/70 uppercase tracking-widest font-bold">This is proudly presented to</p>
                  <h3 className="text-xl sm:text-2xl font-black text-white">Alex Johnson</h3>
                  <p className="text-xs text-[#D0D3D6] max-w-sm mx-auto">
                    for successfully demonstrating mastery in <br />
                    <span className="text-[#50BED9] font-bold">Applied Generative AI & Enterprise LLM Architecture</span>
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#353638] text-[10px] text-[#D0D3D6]/60">
                  <div>
                    <span className="block font-bold text-white">ID: NXG-9482-AI</span>
                    <span>Issued: Verified</span>
                  </div>
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center border border-white/20 text-[8px] font-black text-[#50BED9]">
                    [ QR ]
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 4 Feature Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certFeatures.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div key={i} className="bg-[#101010] border border-[#353638] rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-[#151515] border border-[#353638] text-[#50BED9] flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">{feat.title}</h4>
                <p className="text-xs text-[#D0D3D6] leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>

        {/* How to Earn Steps */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black text-white">How to Earn Your Certificate</h2>
            <p className="text-sm text-[#D0D3D6]">Structured 4-step path from enrollment to verified certification.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, idx) => (
              <div key={idx} className="bg-[#101010] border border-[#353638] rounded-3xl p-6 space-y-3">
                <span className="w-8 h-8 rounded-full bg-[#50BED9] text-[#101010] font-black text-xs flex items-center justify-center">
                  {s.step}
                </span>
                <h4 className="text-base font-bold text-white">{s.title}</h4>
                <p className="text-xs text-[#D0D3D6] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
