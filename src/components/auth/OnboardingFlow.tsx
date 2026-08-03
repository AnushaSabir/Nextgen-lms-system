'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Briefcase, Building2, ChevronRight, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import Image from 'next/image';

type Role = 'learner' | 'trainer' | 'institute_head' | null;
type LearnerCategory = 'school_student' | 'college_student' | 'university_student' | null;

export default function OnboardingFlow() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role>(null);
  const [learnerCategory, setLearnerCategory] = useState<LearnerCategory>(null);

  const handleNext = () => {
    if (step === 1) {
      if (role === 'learner') {
        setStep(2);
      } else {
        // Teacher or Admin -> Finish onboarding
        finishOnboarding();
      }
    } else if (step === 2) {
      finishOnboarding();
    }
  };

  const finishOnboarding = () => {
    // Update user context (mocking backend call)
    updateUser({ 
      role: role ?? 'learner', 
      learnerCategory: role === 'learner' ? learnerCategory : null 
    });
    
    // Redirect based on role
    if (role === 'learner') {
      router.push('/student/dashboard');
    } else if (role === 'trainer') {
      router.push('/trainer/dashboard');
    } else if (role === 'institute_head') {
      router.push('/institute/dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      
      <div className="w-full max-w-3xl">
        {/* Header / Logo */}
        <div className="flex justify-center mb-10">
          <Image src="/logo.png" alt="NextGen LMS" width={220} height={60} className="object-contain" style={{filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.4)) drop-shadow(-1px -2px 3px rgba(255,255,255,0.6))'}} />
        </div>

        {/* Wizard Card */}
        <div className="bg-[#c8e6c9] rounded-3xl p-8 sm:p-12 shadow-2xl border border-[#1a6b2e]/30 relative overflow-hidden">
          
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-[#0f3d1a] mb-3 tracking-tight">Welcome to NextGen LMS!</h2>
                <p className="text-[#1a6b2e] font-medium">To personalize your experience, please tell us who you are.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                
                {/* Student */}
                <div 
                  onClick={() => setRole('learner')}
                  className={`cursor-pointer border-2 rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 ${role === 'learner' ? 'border-[#d94d19] bg-white shadow-lg' : 'border-[#1a6b2e]/20 bg-white/50 hover:bg-white hover:border-[#d94d19]/50'}`}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${role === 'learner' ? 'bg-[#d94d19]/10' : 'bg-[#c8e6c9]'}`}>
                    <GraduationCap className={`w-8 h-8 ${role === 'learner' ? 'text-[#d94d19]' : 'text-[#1a6b2e]'}`} />
                  </div>
                  <h3 className="font-black text-[#0f3d1a] text-lg mb-1">Student</h3>
                  <p className="text-xs text-[#1a6b2e]">Learn skills & earn certificates</p>
                </div>

                {/* Teacher */}
                <div 
                  onClick={() => setRole('trainer')}
                  className={`cursor-pointer border-2 rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 ${role === 'trainer' ? 'border-[#d94d19] bg-white shadow-lg' : 'border-[#1a6b2e]/20 bg-white/50 hover:bg-white hover:border-[#d94d19]/50'}`}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${role === 'trainer' ? 'bg-[#d94d19]/10' : 'bg-[#c8e6c9]'}`}>
                    <Briefcase className={`w-8 h-8 ${role === 'trainer' ? 'text-[#d94d19]' : 'text-[#1a6b2e]'}`} />
                  </div>
                  <h3 className="font-black text-[#0f3d1a] text-lg mb-1">Teacher</h3>
                  <p className="text-xs text-[#1a6b2e]">Create courses & train students</p>
                </div>

                {/* Administrator */}
                <div 
                  onClick={() => setRole('institute_head')}
                  className={`cursor-pointer border-2 rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 ${role === 'institute_head' ? 'border-[#d94d19] bg-white shadow-lg' : 'border-[#1a6b2e]/20 bg-white/50 hover:bg-white hover:border-[#d94d19]/50'}`}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${role === 'institute_head' ? 'bg-[#d94d19]/10' : 'bg-[#c8e6c9]'}`}>
                    <Building2 className={`w-8 h-8 ${role === 'institute_head' ? 'text-[#d94d19]' : 'text-[#1a6b2e]'}`} />
                  </div>
                  <h3 className="font-black text-[#0f3d1a] text-lg mb-1">School Admin</h3>
                  <p className="text-xs text-[#1a6b2e]">Manage your institution</p>
                </div>

              </div>

              <div className="mt-10 flex justify-end">
                <button 
                  onClick={handleNext}
                  disabled={!role}
                  className="px-8 py-3 bg-gradient-to-r from-[#38bdf8] to-[#0ea5e9] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
                >
                  Continue <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              
              <button onClick={() => setStep(1)} className="text-[#1a6b2e] hover:text-[#0f3d1a] flex items-center gap-1 mb-6 text-sm font-bold transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-[#0f3d1a] mb-3 tracking-tight">What is your education level?</h2>
                <p className="text-[#1a6b2e] font-medium">This helps us recommend the right courses for you.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                
                {/* School */}
                <div 
                  onClick={() => setLearnerCategory('school_student')}
                  className={`cursor-pointer border-2 rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 ${learnerCategory === 'school_student' ? 'border-[#d94d19] bg-white shadow-lg' : 'border-[#1a6b2e]/20 bg-white/50 hover:bg-white hover:border-[#d94d19]/50'}`}
                >
                  <h3 className="font-black text-[#0f3d1a] text-xl mb-2">School Student</h3>
                  <p className="text-sm text-[#1a6b2e]">Primary to High School</p>
                </div>

                {/* College */}
                <div 
                  onClick={() => setLearnerCategory('college_student')}
                  className={`cursor-pointer border-2 rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 ${learnerCategory === 'college_student' ? 'border-[#d94d19] bg-white shadow-lg' : 'border-[#1a6b2e]/20 bg-white/50 hover:bg-white hover:border-[#d94d19]/50'}`}
                >
                  <h3 className="font-black text-[#0f3d1a] text-xl mb-2">College Student</h3>
                  <p className="text-sm text-[#1a6b2e]">Intermediate / A-Levels</p>
                </div>

                {/* University */}
                <div 
                  onClick={() => setLearnerCategory('university_student')}
                  className={`cursor-pointer border-2 rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 ${learnerCategory === 'university_student' ? 'border-[#d94d19] bg-white shadow-lg' : 'border-[#1a6b2e]/20 bg-white/50 hover:bg-white hover:border-[#d94d19]/50'}`}
                >
                  <h3 className="font-black text-[#0f3d1a] text-xl mb-2">University Student</h3>
                  <p className="text-sm text-[#1a6b2e]">Undergrad & Postgrad</p>
                </div>

              </div>

              <div className="mt-10 flex justify-end">
                <button 
                  onClick={handleNext}
                  disabled={!learnerCategory}
                  className="px-8 py-3 bg-gradient-to-r from-[#38bdf8] to-[#0ea5e9] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
                >
                  Go to Dashboard <ChevronRight className="w-5 h-5" />
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
