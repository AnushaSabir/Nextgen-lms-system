'use client';

import React from 'react';
import Link from 'next/link';
import {
  Building2,
  ShieldCheck,
  BarChart3,
  Users,
  GraduationCap,
  Sparkles,
  Zap,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  FileCheck,
  TrendingUp,
  Globe2,
  Laptop,
} from 'lucide-react';

export default function ForInstitutionsPage() {
  const enterpriseFeatures = [
    {
      title: 'Dean & Department Command Center',
      desc: 'Centralized administrative controls to oversee departments, assign faculty, manage cohorts, and review academic performance metrics.',
      icon: Building2,
      tag: 'Admin Portal',
    },
    {
      title: 'AI Early Warning & Learner Analytics',
      desc: 'Real-time telemetry on student attendance, quiz scores, and course completion velocity with automated intervention alerts.',
      icon: BarChart3,
      tag: 'Predictive AI',
    },
    {
      title: 'Bulk Roster Management & SIS Sync',
      desc: 'Seamlessly onboard thousands of students via CSV, SSO (SAML/OAuth), and integrate with existing campus management systems.',
      icon: Users,
      tag: 'Enterprise Scalability',
    },
    {
      title: 'Institutional Blockchain Certificates',
      desc: 'Issue tamper-proof, custom-branded university certificates with QR verification that graduates can share on LinkedIn and resume portfolios.',
      icon: ShieldCheck,
      tag: 'Verified Credentials',
    },
    {
      title: 'Custom Curricula & Private Courses',
      desc: 'Host private institutional courses restricted strictly to your university students, alongside access to the public NextGen catalog.',
      icon: Layers,
      tag: 'Flexible Delivery',
    },
    {
      title: 'Role-Based Permissions & Security',
      desc: 'Granular access controls for Administrators, Faculty Leads, Instructors, Teaching Assistants, and Enrolled Learners.',
      icon: Lock,
      tag: 'Enterprise Security',
    },
  ];

  const outcomes = [
    { metric: '99.9%', label: 'Cloud Infrastructure SLA Uptime' },
    { metric: '82%', label: 'Higher Student Course Completion' },
    { metric: '10x', label: 'Faster Faculty Grading with AI Assistants' },
    { metric: '100%', label: 'Compliance with Academic Data Standards' },
  ];

  return (
    <div className="min-h-screen bg-[#323232] text-white pt-24 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-[#50BED9]/[0.08] via-[#159BD7]/[0.04] to-transparent rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-20">
        
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#50BED9]/30 bg-[#151515] text-[#50BED9] text-xs font-black uppercase tracking-widest shadow-md">
            <Building2 className="w-3.5 h-3.5" />
            <span>NextGen for Universities & Academies</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.12]">
            Modernize Your Campus <br />
            <span className="bg-gradient-to-r from-[#50BED9] via-[#159BD7] to-[#33C6B6] bg-clip-text text-transparent">
              Learning Infrastructure
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#D0D3D6] max-w-2xl mx-auto font-medium leading-relaxed">
            Deploy an enterprise-grade AI Learning Management System. Streamline department oversight, empower faculty with automated grading tools, and elevate student career outcomes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/contact?type=institution"
              className="w-full sm:w-auto px-8 py-4 bg-[#50BED9] hover:bg-[#159BD7] text-[#101010] hover:text-white font-black text-base rounded-2xl shadow-[0_10px_30px_rgba(80,190,217,0.35)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Schedule Institutional Demo</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/institute"
              className="w-full sm:w-auto px-8 py-4 bg-[#151515] border border-[#353638] hover:border-[#50BED9]/50 text-white font-bold text-base rounded-2xl hover:bg-[#353638] transition-all flex items-center justify-center gap-2"
            >
              <span>View Institute Dashboard Preview</span>
            </Link>
          </div>
        </div>

        {/* Enterprise Outcomes Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {outcomes.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#101010] border border-[#353638] rounded-3xl p-6 text-center space-y-2 shadow-xl"
            >
              <div className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-[#50BED9] to-[#33C6B6] bg-clip-text text-transparent">
                {item.metric}
              </div>
              <p className="text-xs sm:text-sm text-[#D0D3D6] font-semibold">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black text-white">Engineered for Modern Higher Education</h2>
            <p className="text-sm text-[#D0D3D6]">Comprehensive capabilities designed to meet the demands of deans, professors, and enterprise administrators.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {enterpriseFeatures.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  className="bg-[#101010] border border-[#353638] hover:border-[#50BED9]/50 rounded-3xl p-8 flex flex-col justify-between space-y-6 shadow-xl hover:-translate-y-1.5 transition-all duration-300 group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-[#151515] border border-[#353638] text-[#50BED9] group-hover:bg-[#50BED9] group-hover:text-[#101010] transition-colors flex items-center justify-center shadow-md">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#353638] text-[#33C6B6]">
                        {feat.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-white group-hover:text-[#50BED9] transition-colors">
                      {feat.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#D0D3D6] leading-relaxed font-medium">
                      {feat.desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-[#50BED9]">
                    <CheckCircle2 className="w-4 h-4 text-[#33C6B6]" />
                    <span>Included in Institutional Plan</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Final CTA Card */}
        <div className="bg-[#101010] border border-[#50BED9]/30 rounded-[2.5rem] p-10 sm:p-16 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#50BED9]/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white">Partner with NextGen LMS</h2>
            <p className="text-sm sm:text-base text-[#D0D3D6]">
              Request a tailored campus deployment roadmap, custom pilot sandbox, and volume licensing proposal for your institution.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/contact?type=institution"
                className="w-full sm:w-auto px-10 py-4 bg-[#50BED9] hover:bg-[#159BD7] text-[#101010] hover:text-white font-black text-base rounded-2xl shadow-xl transition-all"
              >
                Request Custom Proposal
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
