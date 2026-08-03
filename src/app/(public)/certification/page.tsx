import React from 'react';
import Link from 'next/link';
import CertificatePreview from '@/components/public/CertificatePreview';

export default function CertificationPage() {
  const details = [
    { title: 'Official Badge', desc: 'A verified NextGen LMS Certified Badge on your profile.', icon: '🏅' },
    { title: 'Your Full Name', desc: 'Displaying your professional name as registered.', icon: '📛' },
    { title: 'Skill Category', desc: 'The specific course name and skill category you mastered.', icon: '📚' },
    { title: 'Certification Date', desc: 'The exact date you completed all assessments.', icon: '📅' },
    { title: 'Trainer Verified', desc: 'Status showing you were reviewed by a real professional.', icon: '✅' },
  ];

  const steps = [
    'Complete all course videos in order',
    'Pass every post-video assessment (MCQs, quiz, summary, practical)',
    'Pass the final comprehensive exam',
    'Receive a passing recommendation from your trainer',
    'Your certificate and badge are automatically added to your profile'
  ];

  return (
    <div className="pt-28 sm:pt-40 pb-16 sm:pb-20 px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="max-w-5xl mx-auto text-center mb-16 sm:mb-24 space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-[#0f3d1a] leading-tight">NextGen LMS Certificate</h1>
            <p className="text-base sm:text-xl text-bodyGrayText leading-relaxed">Proof That You're Ready to Earn. Not just a PDF, but a marketplace-connected credential.</p>
          </div>
          
          <div className="w-full">
            <CertificatePreview />
            <p className="mt-8 text-lg sm:text-2xl font-bold text-[#0f3d1a] uppercase tracking-wide">
              Jo course complete karega, usse milega ye certificate!
            </p>
          </div>
        </div>

        {/* What is it? */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center mb-20 sm:mb-32">
           <div className="space-y-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0f3d1a]">What Is the NextGen LMS Certificate?</h2>
              <div className="space-y-5 sm:space-y-6 text-sm sm:text-lg text-bodyGrayText leading-relaxed">
                 <p>
                   The NextGen LMS Certificate is awarded to learners who successfully complete all course videos, pass every progressive assessment, and receive a passing recommendation from their trainer.
                 </p>
                 <p className="p-6 rounded-2xl glass-navbar border border-orangeBorderActive/20 text-[#0f3d1a] font-medium italic">
                   "This is not an automated certificate. It is earned through structured testing, trainer review, and demonstrated practical skill."
                 </p>
              </div>
           </div>
           <div className="theme-card p-5 sm:p-10 lg:p-12 rounded-2xl sm:rounded-[3rem] border-primaryBlue/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 orange-gradient rounded-full blur-3xl opacity-20" />
              <div className="space-y-8 relative z-10">
                 <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-16 h-16 orange-gradient rounded-2xl flex items-center justify-center text-3xl">🏅</div>
                    <div>
                       <div className="text-sm font-bold text-primaryBlue uppercase tracking-widest">NextGen-LMS Certified</div>
                       <div className="text-base sm:text-xl font-bold text-[#0f3d1a]">Skill Verification</div>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="h-2 w-full bg-lightBorder rounded-full overflow-hidden">
                       <div className="h-full w-[85%] orange-gradient" />
                    </div>
                    <div className="flex justify-between text-xs font-bold text-darkGrayNumber uppercase">
                       <span>Training Progress</span>
                       <span>85% Verified</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* What it includes */}
        <div className="mb-20 sm:mb-32">
           <h2 className="text-2xl sm:text-3xl font-bold text-[#0f3d1a] mb-8 sm:mb-12 text-center">What the Certificate Includes</h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
              {details.map((item) => (
                <div key={item.title} className="theme-card p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl text-center space-y-3 sm:space-y-4 hover:border-primaryBlue transition-colors">
                   <div className="text-3xl">{item.icon}</div>
                   <h4 className="text-sm font-bold text-[#0f3d1a] uppercase tracking-wider">{item.title}</h4>
                   <p className="text-xs text-bodyGrayText leading-relaxed">{item.desc}</p>
                </div>
              ))}
           </div>
        </div>

        {/* Marketplace Section */}
        <div className="p-5 sm:p-10 md:p-20 rounded-2xl sm:rounded-[3rem] bg-cardBg border border-lightBorder relative overflow-hidden mb-20 sm:mb-32">
           <div className="absolute bottom-0 left-0 w-64 h-64 secondary-glow opacity-10" />
           <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="space-y-6">
                 <h2 className="text-2xl sm:text-3xl font-bold text-[#0f3d1a]">Certificate on Your Marketplace Profile</h2>
                 <p className="text-bodyGrayText leading-relaxed">
                   Once certified, your NextGen-LMS freelance profile will display the "NextGen LMS Certified" badge. Clients browsing the marketplace can see this badge — and studies consistently show that verified credentials significantly increase hiring rates.
                 </p>
              </div>
              <div className="space-y-4">
                 {['Badge Displayed', 'Certification Date', 'Verified Skills'].map((check) => (
                   <div key={check} className="flex items-center gap-3 sm:gap-4 p-4 rounded-xl bg-[#1a6b2e]/5 border border-lightBorder">
                      <div className="text-primaryBlue font-bold">✓</div>
                      <span className="text-[#0f3d1a] font-medium">{check}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* How to Earn */}
        <div className="max-w-3xl mx-auto space-y-8 sm:space-y-12 mb-20 sm:mb-32">
           <h2 className="text-2xl sm:text-3xl font-bold text-[#0f3d1a] text-center">How to Earn Your Certificate</h2>
           <div className="space-y-3 sm:space-y-4">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-cardBg border border-lightBorder group hover:border-primaryBlue transition-all">
                   <div className="w-8 h-8 rounded-full bg-lightBorder group-hover:bg-primaryBlue flex items-center justify-center text-xs font-bold text-[#0f3d1a] transition-colors">
                      {i + 1}
                   </div>
                   <p className="text-sm sm:text-base text-[#0f3d1a] font-medium leading-relaxed">{step}</p>
                </div>
              ))}
           </div>
        </div>

        <div className="text-center">
          <Link
            href="/courses"
            className="inline-flex w-full sm:w-auto justify-center px-6 py-3.5 sm:px-8 sm:py-4 bg-primaryBlue hover:bg-opacity-90 text-[#0f3d1a] font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-primaryBlue/20 transition-all hover:scale-105 active:scale-95"
          >
            Start a Course Today →
          </Link>
        </div>
      </div>
    </div>
  );
}
