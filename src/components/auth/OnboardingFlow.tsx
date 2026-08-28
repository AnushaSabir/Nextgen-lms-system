'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  GraduationCap, Building2, ChevronRight, ArrowLeft,
  CheckCircle2, Sparkles, School, User, Mail, Phone,
  FileText, ShieldCheck, Award, BookOpen, Layers, KeyRound,
  IdCard, Tag, Compass, Flame, Check
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import Image from 'next/image';

type UserRole = 'student' | 'institute_admin';

export default function OnboardingFlow() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole>('student');

  // Student Questionnaire
  const [studentForm, setStudentForm] = useState({
    schoolName: 'Beaconhouse International System',
    customSchool: '',
    passcode: 'BHS-2026-X9',
    level: 'Grade 11 / College (ICS/FSc/A-Levels)',
    rollNo: 'BH-2026-089',
    bio: 'Aspiring Full-Stack & Generative AI Engineer. Passionate about building modern web apps.',
    targetField: 'Artificial Intelligence & Software Engineering',
    avatar: '👨‍💻',
  });

  // School Admin Questionnaire
  const [instituteForm, setInstituteForm] = useState({
    institutionName: 'Beaconhouse International System',
    campusCity: 'Lahore Main Campus (Gulberg Sector)',
    grNumber: 'REG-BISE-LHR-2026-992',
    ownerName: 'Prof. Asad Mahmood (Principal)',
    officialEmail: 'principal@beaconhouse.edu.pk',
    officialPhone: '+92 300 1234567',
    totalStudents: '420',
    billingCycle: '10th of Every Month (Standard)',
  });

  const handleFinish = () => {
    if (role === 'student') {
      const finalSchool = studentForm.schoolName === 'Other' ? studentForm.customSchool : studentForm.schoolName;
      updateUser({
        role: 'learner',
        name: user?.name || 'Ali Hassan',
        institutionId: finalSchool,
      });
      router.push('/student/dashboard');
    } else {
      updateUser({
        role: 'institute_head',
        name: instituteForm.ownerName,
        institutionId: instituteForm.institutionName,
      });
      router.push('/institute/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#c8e6c9] text-[#0f3d1a] flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#1a6b2e]/20 relative overflow-hidden">
        
        {/* Top Logo & Header */}
        <div className="flex items-center justify-between pb-5 border-b border-[#1a6b2e]/15 mb-6">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center p-1 rounded-2xl bg-[#0f3d1a] shadow-md">
              <Image src="/logo.png" alt="NextGen LMS" width={40} height={40} className="object-contain" priority />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0f3d1a] tracking-tight leading-none">NextGen LMS</h2>
              <p className="text-[11px] font-bold text-[#1a6b2e] mt-0.5">Institution Verification & Profile Questionnaire</p>
            </div>
          </div>
          <span className="text-xs font-black px-3.5 py-1 rounded-full bg-[#c8e6c9] text-[#0f3d1a] border border-[#1a6b2e]/20 shadow-sm">
            Step {step} of 2
          </span>
        </div>

        {/* STEP 1: Select Portal Role */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-black text-[#0f3d1a]">Select Account Category</h3>
              <p className="text-xs font-semibold text-[#1a6b2e] mt-1">Choose how you are joining the NextGen Learning Ecosystem</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`p-5 rounded-2xl border-2 text-left transition-all ${
                  role === 'student'
                    ? 'border-[#0f3d1a] bg-[#c8e6c9]/40 shadow-lg scale-[1.02]'
                    : 'border-gray-200 hover:border-[#1a6b2e]/40 bg-white'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#0f3d1a] flex items-center justify-center text-white mb-3 shadow-md">
                  <GraduationCap className="w-6 h-6 text-[#c8e6c9]" />
                </div>
                <h4 className="font-black text-[#0f3d1a] text-base">Student / Learner</h4>
                <p className="text-xs text-[#1a6b2e] font-semibold mt-1">
                  Enrolled via School, College, or University with passkey & roll number.
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Bio, Skill Badges & Social Portfolio</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('institute_admin')}
                className={`p-5 rounded-2xl border-2 text-left transition-all ${
                  role === 'institute_admin'
                    ? 'border-[#0f3d1a] bg-[#c8e6c9]/40 shadow-lg scale-[1.02]'
                    : 'border-gray-200 hover:border-[#1a6b2e]/40 bg-white'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#0f3d1a] flex items-center justify-center text-white mb-3 shadow-md">
                  <Building2 className="w-6 h-6 text-[#c8e6c9]" />
                </div>
                <h4 className="font-black text-[#0f3d1a] text-base">School / College Admin</h4>
                <p className="text-xs text-[#1a6b2e] font-semibold mt-1">
                  Principals & Academic Directors managing student cohorts & parent reports.
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Passcode & Parent Report Cards Hub</span>
                </div>
              </button>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 rounded-2xl bg-[#0f3d1a] hover:bg-[#1a6b2e] text-white font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Continue to Verification Questionnaire</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Questionnaire Form */}
        {step === 2 && role === 'student' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-[#0f3d1a]">Student Profile & Campus Setup</h3>
                <p className="text-xs font-semibold text-[#1a6b2e]">Enter your institutional details to link with your school</p>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-xs font-bold text-[#1a6b2e] hover:underline flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            </div>

            <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
              {/* School Name */}
              <div>
                <label className="text-xs font-black text-[#0f3d1a] flex items-center gap-1.5 mb-1">
                  <School className="w-3.5 h-3.5 text-[#1a6b2e]" />
                  <span>School / College / University Name</span>
                </label>
                <select
                  value={studentForm.schoolName}
                  onChange={(e) => setStudentForm({ ...studentForm, schoolName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#1a6b2e]/20 text-[#0f3d1a] font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-[#1a6b2e]/30"
                >
                  <option value="Beaconhouse International System">Beaconhouse International System (Lahore Main)</option>
                  <option value="Roots Millennium School & College">Roots Millennium School & College (Islamabad)</option>
                  <option value="FAST-NUCES Faculty of Computing">FAST-NUCES Faculty of Computing (Karachi)</option>
                  <option value="Army Public College & University">Army Public College & University (Rawalpindi)</option>
                  <option value="The City School International">The City School International (Gulshan Campus)</option>
                  <option value="Lahore Grammar School (LGS)">Lahore Grammar School (LGS Defense)</option>
                  <option value="Other">Other Institutional Campus (Write Name Below)</option>
                </select>
              </div>

              {studentForm.schoolName === 'Other' && (
                <div>
                  <label className="text-xs font-black text-[#0f3d1a] block mb-1">Enter Custom School / College Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Crescent Model Higher Secondary School"
                    value={studentForm.customSchool}
                    onChange={(e) => setStudentForm({ ...studentForm, customSchool: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#1a6b2e]/20 text-[#0f3d1a] font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-[#1a6b2e]/30"
                  />
                </div>
              )}

              {/* Standard / Grade & Roll Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black text-[#0f3d1a] flex items-center gap-1.5 mb-1">
                    <Layers className="w-3.5 h-3.5 text-[#1a6b2e]" />
                    <span>Grade / Standard / Semester</span>
                  </label>
                  <select
                    value={studentForm.level}
                    onChange={(e) => setStudentForm({ ...studentForm, level: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#1a6b2e]/20 text-[#0f3d1a] font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-[#1a6b2e]/30"
                  >
                    <option>Grade 9 / Matric / O-Level 1</option>
                    <option>Grade 10 / Matric / O-Level 2</option>
                    <option>Grade 11 / College (ICS / FSc / A-Level 1)</option>
                    <option>Grade 12 / College (ICS / FSc / A-Level 2)</option>
                    <option>BSCS / BS-IT / Software Engineering (Sem 1-4)</option>
                    <option>BSCS / BS-IT / Software Engineering (Sem 5-8)</option>
                    <option>University Postgraduate / General</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black text-[#0f3d1a] flex items-center gap-1.5 mb-1">
                    <IdCard className="w-3.5 h-3.5 text-[#1a6b2e]" />
                    <span>Student Roll No / GR #</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BH-2026-089"
                    value={studentForm.rollNo}
                    onChange={(e) => setStudentForm({ ...studentForm, rollNo: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#1a6b2e]/20 text-[#0f3d1a] font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-[#1a6b2e]/30"
                  />
                </div>
              </div>

              {/* Monthly School Passcode */}
              <div>
                <label className="text-xs font-black text-[#0f3d1a] flex items-center gap-1.5 mb-1">
                  <KeyRound className="w-3.5 h-3.5 text-[#1a6b2e]" />
                  <span>Monthly School Access Key / Passcode</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. BHS-2026-X9"
                  value={studentForm.passcode}
                  onChange={(e) => setStudentForm({ ...studentForm, passcode: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#1a6b2e]/20 text-[#0f3d1a] font-black text-xs uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#1a6b2e]/30 bg-[#c8e6c9]/20"
                />
                <p className="text-[10px] text-[#1a6b2e] font-semibold mt-1">Provided by your school admin or computer lab teacher.</p>
              </div>

              {/* Public Bio & Ambition */}
              <div>
                <label className="text-xs font-black text-[#0f3d1a] flex items-center gap-1.5 mb-1">
                  <User className="w-3.5 h-3.5 text-[#1a6b2e]" />
                  <span>Social Profile Bio (Displayed on your Public Portfolio)</span>
                </label>
                <textarea
                  rows={2}
                  value={studentForm.bio}
                  onChange={(e) => setStudentForm({ ...studentForm, bio: e.target.value })}
                  placeholder="e.g. Aspiring Full-Stack Developer at Beaconhouse. Building Next.js AI apps."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#1a6b2e]/20 text-[#0f3d1a] font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-[#1a6b2e]/30 resize-none"
                />
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3.5 rounded-2xl bg-[#0f3d1a] hover:bg-[#1a6b2e] text-white font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 mt-4"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Complete Setup & Enter Student Portal</span>
            </button>
          </div>
        )}

        {/* STEP 2: School Admin Questionnaire */}
        {step === 2 && role === 'institute_admin' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-[#0f3d1a]">School / College Registration</h3>
                <p className="text-xs font-semibold text-[#1a6b2e]">Register your institutional campus on NextGen LMS</p>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-xs font-bold text-[#1a6b2e] hover:underline flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              <div>
                <label className="text-xs font-black text-[#0f3d1a] flex items-center gap-1.5 mb-1">
                  <School className="w-3.5 h-3.5 text-[#1a6b2e]" />
                  <span>Institution Full Name</span>
                </label>
                <input
                  type="text"
                  value={instituteForm.institutionName}
                  onChange={(e) => setInstituteForm({ ...instituteForm, institutionName: e.target.value })}
                  placeholder="e.g. Beaconhouse International System"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#1a6b2e]/20 text-[#0f3d1a] font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-[#1a6b2e]/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black text-[#0f3d1a] flex items-center gap-1.5 mb-1">
                    <Building2 className="w-3.5 h-3.5 text-[#1a6b2e]" />
                    <span>Campus Branch & City</span>
                  </label>
                  <input
                    type="text"
                    value={instituteForm.campusCity}
                    onChange={(e) => setInstituteForm({ ...instituteForm, campusCity: e.target.value })}
                    placeholder="e.g. Lahore Main Campus"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#1a6b2e]/20 text-[#0f3d1a] font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-[#1a6b2e]/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-[#0f3d1a] flex items-center gap-1.5 mb-1">
                    <FileText className="w-3.5 h-3.5 text-[#1a6b2e]" />
                    <span>School Registration / GR #</span>
                  </label>
                  <input
                    type="text"
                    value={instituteForm.grNumber}
                    onChange={(e) => setInstituteForm({ ...instituteForm, grNumber: e.target.value })}
                    placeholder="e.g. REG-BISE-LHR-2026-992"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#1a6b2e]/20 text-[#0f3d1a] font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-[#1a6b2e]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black text-[#0f3d1a] flex items-center gap-1.5 mb-1">
                    <User className="w-3.5 h-3.5 text-[#1a6b2e]" />
                    <span>Principal / Owner Full Name</span>
                  </label>
                  <input
                    type="text"
                    value={instituteForm.ownerName}
                    onChange={(e) => setInstituteForm({ ...instituteForm, ownerName: e.target.value })}
                    placeholder="e.g. Prof. Asad Mahmood"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#1a6b2e]/20 text-[#0f3d1a] font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-[#1a6b2e]/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-[#0f3d1a] flex items-center gap-1.5 mb-1">
                    <Phone className="w-3.5 h-3.5 text-[#1a6b2e]" />
                    <span>Official WhatsApp / Phone</span>
                  </label>
                  <input
                    type="text"
                    value={instituteForm.officialPhone}
                    onChange={(e) => setInstituteForm({ ...instituteForm, officialPhone: e.target.value })}
                    placeholder="e.g. +92 300 1234567"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#1a6b2e]/20 text-[#0f3d1a] font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-[#1a6b2e]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black text-[#0f3d1a] flex items-center gap-1.5 mb-1">
                    <Layers className="w-3.5 h-3.5 text-[#1a6b2e]" />
                    <span>Estimated Students to Enroll</span>
                  </label>
                  <select
                    value={instituteForm.totalStudents}
                    onChange={(e) => setInstituteForm({ ...instituteForm, totalStudents: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#1a6b2e]/20 text-[#0f3d1a] font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-[#1a6b2e]/30"
                  >
                    <option value="50">Small Batch (50 Students)</option>
                    <option value="150">Medium Campus (150 Students)</option>
                    <option value="420">Large Institutional School (420 Students)</option>
                    <option value="1000">University Faculty / Multi-Branch (1,000+ Students)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black text-[#0f3d1a] flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#1a6b2e]" />
                    <span>Billing Cycle</span>
                  </label>
                  <input
                    type="text"
                    disabled
                    value={instituteForm.billingCycle}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#1a6b2e]/20 bg-gray-50 text-[#0f3d1a] font-bold text-xs"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3.5 rounded-2xl bg-[#0f3d1a] hover:bg-[#1a6b2e] text-white font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 mt-4"
            >
              <Check className="w-4 h-4" />
              <span>Register School & Open Campus Portal</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
