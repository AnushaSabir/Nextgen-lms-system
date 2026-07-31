import React from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  Briefcase, 
  Users2, 
  Trophy, 
  ArrowRight, 
  Target, 
  Rocket, 
  Globe2 
} from 'lucide-react';

export default function AboutPage() {
  const leadership = [
    { name: 'Badshah Irfan Raput', role: 'Founder & CEO', quote: 'My vision is to establish Pakistan as a hub for global tech giants, with NextGen-LMS being a flagship company.' },
    { name: 'Muhammad Ikram', role: 'Co-Founder', quote: 'Our goal is to empower young individuals nationwide by providing opportunities to unlock their potential.' },
    { name: 'Abdul Qavi Memon', role: 'Chief Technology Officer', quote: 'Leading NextGen-LMS\'s technical vision to build a world-class platform that is secure, scalable, and innovative.' },
  ];

  const ecosystem = [
    { title: 'NextGen-LMS LMS', desc: 'Learn, get assessed, and earn your certificate', icon: <GraduationCap className="w-10 h-10" /> },
    { title: 'NextGen-LMS Marketplace', desc: 'Find work, manage projects, and get paid', icon: <Briefcase className="w-10 h-10" /> },
    { title: 'Business Developers', desc: 'Connect clients and experts without technical skills', icon: <Users2 className="w-10 h-10" /> },
    { title: 'Reward System', desc: 'Bonuses, life insurance, and medical support', icon: <Trophy className="w-10 h-10" /> },
  ];

  return (
    <div className="pt-28 sm:pt-40 pb-16 sm:pb-20 px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center mb-16 sm:mb-24 space-y-4 sm:space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-[#0f3d1a] leading-tight tracking-tight">
            Built in <span className="text-primaryBlue">Pakistan.</span> <br />
            Built for the <span className="bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">World.</span>
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-bodyGrayText font-medium max-w-2xl mx-auto leading-relaxed">A movement to empower the next generation of digital professionals.</p>
        </div>

        {/* Story */}
        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12 mb-20 sm:mb-32">
           <h2 className="text-3xl font-bold text-[#0f3d1a] text-center">Our Story</h2>
           <div className="space-y-6 sm:space-y-8 text-base sm:text-lg text-bodyGrayText leading-relaxed">
              <p>
                NextGen-LMS started with one mission: to create real income opportunities for Pakistani freelancers. As Pakistan's first dedicated freelance marketplace, we built a platform where Experts, Clients, and Business Developers could connect and create value together.
              </p>
              <div className="p-5 sm:p-8 rounded-2xl sm:rounded-[2rem] bg-cardBg border border-orangeBorderActive/20 text-[#0f3d1a] font-medium italic relative">
                 <div className="absolute -top-4 -left-4 text-6xl text-primaryBlue/20 opacity-50">"</div>
                 But we noticed a gap. Thousands of young people in Pakistan — students in schools, colleges, and universities — were left out.
              </div>
              <p>
                So we built NextGen-LMS LMS. A learning system directly connected to a live marketplace. Not just an education platform — a complete pipeline from skill to income.
              </p>
           </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-20 sm:mb-32">
           <div className="theme-card p-6 sm:p-10 lg:p-12 rounded-2xl sm:rounded-[3rem] space-y-5 sm:space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 orange-gradient rounded-full blur-3xl opacity-10" />
              <h3 className="text-2xl font-bold text-[#0f3d1a] uppercase tracking-widest">Our Vision</h3>
              <p className="text-bodyGrayText leading-relaxed">
                To make Pakistan a global technology hub by creating a generation of skilled, certified, and financially independent freelancers who compete at the highest level on the world stage.
              </p>
              <p className="text-primaryBlue font-bold italic">
                We will not stop until we have brought a revolution in the freelance world.
              </p>
           </div>
           <div className="theme-card p-6 sm:p-10 lg:p-12 rounded-2xl sm:rounded-[3rem] space-y-5 sm:space-y-6 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-32 h-32 orange-gradient rounded-full blur-3xl opacity-10" />
              <h3 className="text-2xl font-bold text-[#0f3d1a] uppercase tracking-widest">Our Mission</h3>
              <p className="text-bodyGrayText leading-relaxed">
                To provide every individual in Pakistan access to professional skill training, a verified certification, and a direct path to earning in dollars.
              </p>
              <div className="pt-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                 <span className="text-2xl sm:text-3xl font-bold text-[#0f3d1a]">10 Million</span>
                 <span className="text-sm text-darkGrayNumber font-bold uppercase">Freelance Jobs by 2030</span>
              </div>
           </div>
        </div>

        {/* Ecosystem */}
        <div className="mb-20 sm:mb-32">
           <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0f3d1a] mb-10 sm:mb-20 text-center tracking-tight">The NextGen-LMS Ecosystem</h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8 lg:gap-10">
              {ecosystem.map((item) => (
                <div key={item.title} className="theme-card p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-[3rem] text-center space-y-4 sm:space-y-6 flex flex-col items-center">
                   <div className="p-4 rounded-2xl bg-primaryBlue/10 text-primaryBlue group-hover:bg-primaryBlue group-hover:text-[#0f3d1a] transition-all">
                      {item.icon}
                   </div>
                   <h4 className="text-xl font-bold text-[#0f3d1a] group-hover:text-primaryBlue transition-colors">{item.title}</h4>
                   <p className="text-sm sm:text-base lg:text-lg text-bodyGrayText leading-relaxed">{item.desc}</p>
                </div>
              ))}
           </div>
        </div>

        {/* Leadership */}
        <div className="mb-20 sm:mb-32">
           <h2 className="text-3xl font-bold text-[#0f3d1a] mb-10 sm:mb-16 text-center">Leadership</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
              {leadership.map((leader) => (
                <div key={leader.name} className="theme-card p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-[2.5rem] space-y-5 sm:space-y-6 text-center group">
                   <div className="w-24 h-24 orange-gradient rounded-full mx-auto flex items-center justify-center text-3xl text-[#0f3d1a] shadow-xl group-hover:scale-110 transition-transform">
                      {leader.name.charAt(0)}
                   </div>
                   <div>
                      <h4 className="text-xl font-bold text-[#0f3d1a]">{leader.name}</h4>
                      <p className="text-primaryBlue text-sm font-semibold uppercase tracking-widest">{leader.role}</p>
                   </div>
                   <p className="text-sm text-bodyGrayText italic leading-relaxed">
                     "{leader.quote}"
                   </p>
                </div>
              ))}
           </div>
        </div>

        {/* Community */}
        <div className="p-6 sm:p-12 md:p-20 rounded-[2.5rem] sm:rounded-[3rem] bg-[#c8e6c9] border border-lightBorder relative overflow-hidden text-center space-y-8">
           <div className="absolute top-0 right-0 w-64 h-64 secondary-glow opacity-10" />
           <h2 className="text-3xl font-bold text-[#0f3d1a] uppercase tracking-widest">Our Community</h2>
           <p className="text-sm sm:text-lg text-bodyGrayText max-w-3xl mx-auto leading-relaxed">
             NextGen-LMS already has city heads in Karachi, Faisalabad, Hyderabad, Bahawalnagar, Khairpur Mir's, Pakpattan Sharif, Pial Kalan, Dina, and Fortabass — with more joining every month.
           </p>
           <div className="text-2xl font-bold text-[#0f3d1a] italic">"We are not just a platform. We are a movement."</div>
        </div>

        <div className="text-center mt-16 sm:mt-32">
          <Link
            href="/register"
            className="group inline-flex w-full sm:w-auto items-center justify-center gap-3 px-6 sm:px-12 lg:px-16 py-4 sm:py-6 bg-primaryBlue hover:bg-opacity-90 text-[#0f3d1a] font-black text-base sm:text-xl rounded-2xl sm:rounded-[2rem] shadow-2xl shadow-primaryBlue/30 transition-all hover:scale-105 active:scale-95"
          >
            <span>Join the Movement</span>
            <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
