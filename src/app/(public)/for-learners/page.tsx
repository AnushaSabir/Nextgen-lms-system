import React from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  GraduationCap, 
  Building2, 
  User, 
  CheckCircle2, 
  Award, 
  Calendar, 
  Star, 
  ArrowRight 
} from 'lucide-react';

export default function ForLearnersPage() {
  const learnerTypes = [
    {
      title: 'School Students',
      desc: 'Courses are designed with beginner-friendly explanations, simple examples, and step-by-step guidance. Perfect for students who are just starting to explore digital skills.',
      icon: <BookOpen className="w-8 h-8" />,
    },
    {
      title: 'College Students',
      desc: 'Intermediate-level courses that go beyond basics. Learn how to apply skills practically, build real projects, and develop professional habits early.',
      icon: <GraduationCap className="w-8 h-8" />,
    },
    {
      title: 'University Students',
      desc: 'Advanced professional courses designed to match industry standards. Ideal for students preparing to enter the job market or launch a freelance career.',
      icon: <Building2 className="w-8 h-8" />,
    },
    {
      title: 'Individual Learners',
      desc: 'Not enrolled in a school or university? No problem. NextGen-LMS LMS is open to anyone who wants to learn. Browse all available courses, enroll at your own pace, and earn your certificate.',
      icon: <User className="w-8 h-8" />,
    },
  ];

  const benefits = [
    'Level-appropriate courses designed specifically for your educational background',
    'HD video lessons from verified expert trainers',
    'Structured assessments after every video — MCQs, quizzes, summaries, and practicals',
    'Direct communication with your trainer through built-in chat',
    'Weekly live Q&A sessions hosted by trainers',
    'Access to the global NextGen-LMS LMS community group',
    'An official NextGen-LMS LMS Certified badge upon completion',
    'Immediate access to the NextGen-LMS freelance marketplace after certification',
  ];

  return (
    <div className="pt-28 sm:pt-40 pb-16 sm:pb-20 px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center mb-16 sm:mb-24 space-y-4 sm:space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0f3d1a] leading-tight tracking-tight text-3d">
            Start Your Learning <span className="text-primaryBlue text-3d-orange">Journey</span> Today
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-bodyGrayText font-medium max-w-2xl mx-auto leading-relaxed">
            Whether you are a school student, university graduate, or self-motivated individual — NextGen-LMS LMS has a learning path built for you.
          </p>
        </div>

        {/* Learner Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 mb-20 sm:mb-32">
          {learnerTypes.map((type) => (
            <div key={type.title} className="theme-card card-3d p-5 sm:p-8 lg:p-12 rounded-2xl sm:rounded-[3rem] space-y-4 sm:space-y-6 group hover:-translate-y-2 transition-transform">
              <div className="p-4 rounded-2xl bg-primaryBlue/10 text-primaryBlue mb-2 sm:mb-8 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center group-hover:bg-primaryBlue group-hover:text-[#0f3d1a] transition-all">
                 {type.icon}
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0f3d1a] tracking-tight leading-tight">{type.title}</h3>
              <p className="text-sm sm:text-base lg:text-lg text-bodyGrayText leading-relaxed font-medium">{type.desc}</p>
            </div>
          ))}
        </div>

        {/* What You Get */}
        <div className="p-5 sm:p-10 md:p-16 lg:p-20 rounded-2xl sm:rounded-[3rem] bg-cardBg border border-lightBorder relative overflow-hidden mb-20 sm:mb-32">
          <div className="absolute top-0 right-0 w-64 h-64 secondary-glow opacity-10" />
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#0f3d1a] mb-10 sm:mb-16 text-center tracking-tight">What You Get as a Learner</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-16 gap-y-5 sm:gap-y-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 sm:gap-5">
                <div className="w-8 h-8 rounded-full bg-primaryBlue/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                   <CheckCircle2 className="w-5 h-5 text-primaryBlue" />
                </div>
                <p className="text-sm sm:text-base lg:text-lg text-bodyGrayText font-medium leading-relaxed">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Certification Badge Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center mb-20 sm:mb-32">
           <div className="space-y-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0f3d1a] leading-tight tracking-tight">Your Certification Badge</h2>
              <p className="text-base sm:text-xl text-bodyGrayText leading-relaxed font-medium">
                Once you complete your course and pass all assessments, your NextGen-LMS profile will display a verified badge that tells every client you have been trained, tested, and certified.
              </p>
              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-4 sm:gap-5 text-[#0f3d1a] font-bold text-sm sm:text-lg">
                   <div className="w-12 h-12 rounded-2xl bg-primaryBlue/10 flex items-center justify-center text-primaryBlue">
                     <Award className="w-6 h-6" />
                   </div>
                   <span>NextGen-LMS LMS Certified</span>
                </div>
                <div className="flex items-center gap-4 sm:gap-5 text-mediumGrayTitle font-medium text-sm sm:text-lg">
                   <div className="w-12 h-12 rounded-2xl bg-[#1a6b2e]/5 flex items-center justify-center">
                     <Calendar className="w-6 h-6" />
                   </div>
                   <span>Certification Date Displayed</span>
                </div>
                <div className="flex items-center gap-4 sm:gap-5 text-mediumGrayTitle font-medium text-sm sm:text-lg">
                   <div className="w-12 h-12 rounded-2xl bg-[#1a6b2e]/5 flex items-center justify-center">
                     <Star className="w-6 h-6" />
                   </div>
                   <span>Skill Verified by Trainer</span>
                </div>
              </div>
           </div>
           <div className="relative">
              <div className="aspect-square rounded-2xl sm:rounded-[3rem] bg-cardBg border border-orangeBorderActive/20 flex items-center justify-center relative overflow-hidden max-w-md mx-auto">
                 <div className="absolute top-0 right-0 w-full h-full orange-gradient opacity-5 blur-3xl" />
                 <div className="text-center space-y-6 animate-pulse relative z-10">
                    <div className="w-32 h-32 sm:w-48 sm:h-48 orange-gradient rounded-full mx-auto flex items-center justify-center shadow-[0_0_80px_rgba(251,146,60,0.3)]">
                       <Award className="w-16 h-16 sm:w-24 sm:h-24 text-[#0f3d1a]" />
                    </div>
                    <div className="text-xl sm:text-3xl font-black text-[#0f3d1a] tracking-[0.14em] sm:tracking-[0.2em] uppercase">VERIFIED</div>
                 </div>
              </div>
           </div>
        </div>

        <div className="text-center">
          <Link
            href="/courses"
            className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 bg-primaryBlue hover:bg-opacity-90 text-[#0f3d1a] font-black text-sm sm:text-base rounded-xl shadow-lg shadow-primaryBlue/20 transition-all hover:scale-105 active:scale-95"
          >
            <span>Ready to start? Browse Courses</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
