'use client';

import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Briefcase,
  CheckCircle2,
  Camera,
  GraduationCap,
  FileText,
  Upload,
  Video
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { useToastStore } from '@/store/toast-store';
import { getErrorMessage } from '@/utils/errorParser';

type Role = 'learner' | 'trainer' | null;
type LearnerLevel = 'school' | 'college' | 'university' | null;
type TrainerType = 'individual' | 'institute' | null;

export default function OnboardingFlow() {
  const router = useRouter();
  const { register, loading } = useAuthStore();
  const { showToast } = useToastStore();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role>(null);
  const [learnerLevel, setLearnerLevel] = useState<LearnerLevel>(null);
  const [trainerType, setTrainerType] = useState<TrainerType>(null);

  const [personalDetails, setPersonalDetails] = useState({
    name: '',
    username: '',
    phone: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    country: 'Pakistan',
    city: '',
  });

  const [profDetails, setProfDetails] = useState({ title: '', experience: '', university: '' });
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');

  const [profilePic, setProfilePic] = useState<File | null>(null);
  const profilePicRef = useRef<HTMLInputElement>(null);

  const [documents, setDocuments] = useState<{ cnic: File | null; degree: File | null; resume: File | null }>({
    cnic: null,
    degree: null,
    resume: null,
  });
  const cnicRef = useRef<HTMLInputElement>(null);
  const degreeRef = useRef<HTMLInputElement>(null);
  const resumeRef = useRef<HTMLInputElement>(null);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const [videoLink, setVideoLink] = useState('');
  const [docs, setDocs] = useState({ state: null, cnic: null });
  const [interview, setInterview] = useState({ date: '', time: '' });

  // Use session storage to pull data if they came from DoubleSliderAuth
  useEffect(() => {
    const signupName = sessionStorage.getItem('signup_name');
    const signupEmail = sessionStorage.getItem('signup_email');
    if (signupName || signupEmail) {
      setPersonalDetails(prev => ({
        ...prev,
        name: signupName || prev.name,
        email: signupEmail || prev.email,
      }));
    }
  }, []);

  const totalSteps = useMemo(() => (role === 'trainer' ? 7 : 4), [role]);

  const handleNext = () => {
    setStep((s) => Math.min(s + 1, totalSteps));
  };

  const handleBack = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  const learnerCategoryForLevel = () => {
    if (learnerLevel === 'school') return 'school_student';
    if (learnerLevel === 'college') return 'college_student';
    if (learnerLevel === 'university') return 'university_student';
    return 'individual_learner';
  };

  const handleComplete = async () => {
    if (!role) return;

    const fullName = `${personalDetails.firstName || ''} ${personalDetails.lastName || ''}`.trim() || personalDetails.name;

    const splitName = (v: string) => {
      const parts = v.trim().split(/\s+/).filter(Boolean);
      return {
        firstName: parts[0] ?? '',
        lastName: parts.slice(1).join(' ') ?? '',
      };
    };

    const { firstName, lastName } =
      personalDetails.firstName || personalDetails.lastName ? { firstName: personalDetails.firstName, lastName: personalDetails.lastName } : splitName(personalDetails.name);

    try {
      await register({
        name: fullName,
        email: personalDetails.email,
        password: personalDetails.password,
        role,
        learnerCategory: role === 'learner' ? learnerCategoryForLevel() : undefined,
        trainerLevel: role === 'trainer' ? (trainerType === 'individual' ? 'individual' : 'university') : undefined,
        firstName,
        lastName,
      } as any);

      // Move to success step which is totalSteps + 1
      setStep(totalSteps + 1);
    } catch (err) {
      console.error('Registration failed', err);
      showToast(getErrorMessage(err, 'Registration failed. Please check your details.'), 'error');
    }
  };

  const handleFinish = () => {
    if (role === 'trainer') {
      router.push('/trainer-welcome');
    } else {
      router.push('/student/dashboard');
    }
  };

  const addSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentSkill.trim()) {
      e.preventDefault();
      const next = currentSkill.trim();
      if (!skills.includes(next)) setSkills([...skills, next]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const canContinue = (() => {
    switch (step) {
      case 1:
        return !!role;
      case 2:
        return !!personalDetails.name && !!personalDetails.username && !!personalDetails.email && !!personalDetails.phone && !!personalDetails.password;
      case 3:
        return !!profDetails.experience || !!profDetails.title;
      case 4:
        return skills.length > 0;
      case 7:
        return !!interview.date && !!interview.time;
      default:
        return true;
    }
  })();

  const currentProgress = Math.min(step, totalSteps);

  return (
    <div className="min-h-screen bg-[#f9fafb] font-sans flex flex-col">
      {/* Navbar / Header */}
      <div className="w-full bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5E6F58] to-[#C6D6C0] flex items-center justify-center">
            <span className="text-[#0f3d1a] font-bold text-sm">G</span>
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tight">
            NextGen-LMS<span className="text-[#d94d19]">.</span>
          </span>
        </div>
        <div className="text-sm text-[#7dab52] font-medium hidden sm:block">
          {step <= totalSteps ? 'Account Setup' : 'Completed'}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
        {/* Progress Bar Container */}
        {step <= totalSteps && (
          <div className="w-full max-w-2xl mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#1a6b2e] uppercase tracking-wider">
                Step {currentProgress} of {totalSteps}
              </span>
              <span className="text-xs font-bold text-[#d94d19]">
                {Math.round((currentProgress / totalSteps) * 100)}%
              </span>
            </div>
            <div className="w-full h-2 bg-[#c8e6c9] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#5E6F58] transition-all duration-500 ease-out" 
                style={{ width: `${(currentProgress / totalSteps) * 100}%` }} 
              />
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 sm:p-10">
            
            {/* Step 1: Role Selection */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">Join as a Student or Trainer</h2>
                <p className="text-[#7dab52] text-center mb-10">Select your role to personalize your NextGen-LMS experience.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Student Card */}
                  <div
                    onClick={() => {
                      setRole('learner');
                      setTrainerType(null);
                    }}
                    className={`cursor-pointer group relative rounded-xl border-2 p-6 transition-all duration-200 ${
                      role === 'learner'
                        ? 'border-[#5E6F58] bg-[#5E6F58]/5'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <GraduationCap className={`w-8 h-8 ${role === 'learner' ? 'text-[#d94d19]' : 'text-[#1a6b2e] group-hover:text-gray-600'}`} />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${role === 'learner' ? 'border-[#5E6F58]' : 'border-gray-300'}`}>
                        {role === 'learner' && <div className="w-2.5 h-2.5 rounded-full bg-[#5E6F58]" />}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">I'm a Student</h3>
                    <p className="text-sm text-[#7dab52]">Learn premium skills, complete practical tasks, and start earning.</p>
                  </div>

                  {/* Trainer Card */}
                  <div
                    onClick={() => {
                      setRole('trainer');
                      setTrainerType('individual');
                    }}
                    className={`cursor-pointer group relative rounded-xl border-2 p-6 transition-all duration-200 ${
                      role === 'trainer'
                        ? 'border-[#5E6F58] bg-[#5E6F58]/5'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <Briefcase className={`w-8 h-8 ${role === 'trainer' ? 'text-[#d94d19]' : 'text-[#1a6b2e] group-hover:text-gray-600'}`} />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${role === 'trainer' ? 'border-[#5E6F58]' : 'border-gray-300'}`}>
                        {role === 'trainer' && <div className="w-2.5 h-2.5 rounded-full bg-[#5E6F58]" />}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">I'm a Trainer</h3>
                    <p className="text-sm text-[#7dab52]">Teach high-demand skills, review assignments, and earn revenue share.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Personal Details */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
                <p className="text-[#7dab52] mb-8">Tell us about yourself so we can set up your profile.</p>

                <div className="space-y-6">
                  {/* Photo Upload */}
                  <div className="flex items-center gap-6">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={profilePicRef}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) setProfilePic(e.target.files[0]);
                      }}
                    />
                    <div
                      onClick={() => profilePicRef.current?.click()}
                      className="w-20 h-20 rounded-full bg-gray-100 border border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-[#c8e6c9] transition-colors overflow-hidden"
                    >
                      {profilePic ? (
                        <span className="text-[#d94d19] font-bold text-[10px] text-center px-1">{profilePic.name.slice(0, 10)}</span>
                      ) : (
                        <Camera className="w-6 h-6 text-[#1a6b2e]" />
                      )}
                    </div>
                    <div>
                      <button onClick={() => profilePicRef.current?.click()} className="text-sm font-semibold text-[#d94d19] border border-[#5E6F58] px-4 py-2 rounded-lg hover:bg-[#5E6F58]/5 transition-colors">
                        Upload Photo
                      </button>
                      <p className="text-xs text-[#1a6b2e] mt-2">JPG or PNG. Max size 5MB.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">Full Name</label>
                      <input 
                        type="text" 
                        value={personalDetails.name}
                        onChange={(e) => setPersonalDetails({...personalDetails, name: e.target.value})}
                        placeholder="John Doe" 
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5E6F58]/20 focus:border-[#5E6F58] transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">Username</label>
                      <input 
                        type="text" 
                        value={personalDetails.username}
                        onChange={(e) => setPersonalDetails({...personalDetails, username: e.target.value})}
                        placeholder="johndoe123" 
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5E6F58]/20 focus:border-[#5E6F58] transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">Email Address</label>
                      <input 
                        type="email" 
                        value={personalDetails.email}
                        onChange={(e) => setPersonalDetails({...personalDetails, email: e.target.value})}
                        placeholder="john@example.com" 
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5E6F58]/20 focus:border-[#5E6F58] transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                      <input 
                        type="tel" 
                        value={personalDetails.phone}
                        onChange={(e) => setPersonalDetails({...personalDetails, phone: e.target.value})}
                        placeholder="+92 300 0000000" 
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5E6F58]/20 focus:border-[#5E6F58] transition-all"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-sm font-semibold text-gray-700">Password</label>
                      <input 
                        type="password" 
                        value={personalDetails.password}
                        onChange={(e) => setPersonalDetails({...personalDetails, password: e.target.value})}
                        placeholder="••••••••" 
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5E6F58]/20 focus:border-[#5E6F58] transition-all"
                      />
                      <p className="text-xs text-[#7dab52] mt-1">Must be at least 8 characters long.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Professional Details */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Background</h2>
                <p className="text-[#7dab52] mb-8">Share your experience and academic history.</p>

                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Professional Title</label>
                    <input 
                      type="text" 
                      value={profDetails.title}
                      onChange={(e) => setProfDetails({...profDetails, title: e.target.value})}
                      placeholder={role === 'trainer' ? "e.g. Senior Frontend Engineer" : "e.g. Computer Science Student"} 
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5E6F58]/20 focus:border-[#5E6F58] transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">Years of Experience</label>
                      <select 
                        value={profDetails.experience}
                        onChange={(e) => setProfDetails({...profDetails, experience: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5E6F58]/20 focus:border-[#5E6F58] transition-all"
                      >
                        <option value="" disabled>Select experience</option>
                        {role === 'trainer' ? (
                          <>
                            <option value="1-3">1-3 Years</option>
                            <option value="3-5">3-5 Years</option>
                            <option value="5-10">5-10 Years</option>
                            <option value="10+">10+ Years</option>
                          </>
                        ) : (
                          <>
                            <option value="none">None (Beginner)</option>
                            <option value="<1">Less than 1 Year</option>
                            <option value="1-2">1-2 Years</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">University / Institute</label>
                      <input 
                        type="text" 
                        value={profDetails.university}
                        onChange={(e) => setProfDetails({...profDetails, university: e.target.value})}
                        placeholder="Current or Past University" 
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5E6F58]/20 focus:border-[#5E6F58] transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Skills */}
            {step === 4 && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Expertise</h2>
                <p className="text-[#7dab52] mb-8">List the skills you excel at. Press Enter to add.</p>

                <div className="space-y-4">
                  <div className="relative">
                    <input 
                      type="text" 
                      value={currentSkill}
                      onChange={(e) => setCurrentSkill(e.target.value)}
                      onKeyDown={addSkill}
                      placeholder="Type a skill and press Enter (e.g. React.js, UI/UX)" 
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5E6F58]/20 focus:border-[#5E6F58] transition-all"
                    />
                  </div>

                  <div className="min-h-[120px] p-4 rounded-lg border border-gray-200 bg-gray-50 flex flex-wrap gap-2 content-start">
                    {skills.length === 0 ? (
                      <span className="text-[#1a6b2e] text-sm m-auto">No skills added yet.</span>
                    ) : (
                      skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="bg-[#5E6F58]/10 text-[#d94d19] border border-[#5E6F58]/20 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 animate-in fade-in zoom-in-95"
                        >
                          {skill}
                          <button 
                            onClick={() => removeSkill(skill)}
                            className="w-4 h-4 rounded-full hover:bg-[#5E6F58]/20 flex items-center justify-center transition-colors text-[#d94d19]"
                          >
                            &times;
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Documents (Trainer Only) */}
            {step === 5 && role === 'trainer' && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Documents</h2>
                <p className="text-[#7dab52] mb-8">Upload your professional documents to get verified.</p>

                <div className="space-y-4">
                  <input type="file" accept=".pdf,image/*" className="hidden" ref={cnicRef} onChange={(e) => e.target.files && setDocuments({...documents, cnic: e.target.files[0]})} />
                  <input type="file" accept=".pdf,image/*" className="hidden" ref={degreeRef} onChange={(e) => e.target.files && setDocuments({...documents, degree: e.target.files[0]})} />
                  <input type="file" accept=".pdf,image/*" className="hidden" ref={resumeRef} onChange={(e) => e.target.files && setDocuments({...documents, resume: e.target.files[0]})} />

                  {[
                    { id: 'cnic', label: 'CNIC / Identity Card', state: documents.cnic, ref: cnicRef },
                    { id: 'degree', label: 'Latest Degree', state: documents.degree, ref: degreeRef },
                    { id: 'resume', label: 'Professional Resume', state: documents.resume, ref: resumeRef }
                  ].map((doc) => (
                    <div 
                      key={doc.id}
                      onClick={() => doc.ref.current?.click()}
                      className={`cursor-pointer p-5 rounded-xl border-2 flex items-center justify-between transition-all duration-200 ${doc.state ? 'bg-[#5E6F58]/5 border-[#5E6F58]' : 'bg-white border-gray-200 hover:border-[#5E6F58]'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${doc.state ? 'bg-[#5E6F58]/20 text-[#d94d19]' : 'bg-gray-100 text-[#7dab52]'}`}>
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-md font-bold text-gray-900">{doc.label}</h4>
                          <p className="text-xs text-[#7dab52] mt-0.5">
                            {doc.state ? doc.state.name : 'PDF, JPG (Max 5MB)'}
                          </p>
                        </div>
                      </div>
                      {doc.state ? <CheckCircle2 className="text-[#d94d19] w-6 h-6" /> : <Upload className="text-[#1a6b2e] w-5 h-5" />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Demo Video (Trainer Only) */}
            {step === 6 && role === 'trainer' && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Demo Video</h2>
                <p className="text-[#7dab52] mb-6">Showcase your teaching style with a short demo video.</p>
                
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <h3 className="text-blue-800 font-bold text-sm mb-2 flex items-center gap-2"><Video className="w-4 h-4" /> Video Requirements</h3>
                    <ul className="text-sm text-blue-700 space-y-1 pl-5 list-disc">
                      <li>Duration must be between 3 to 10 minutes.</li>
                      <li>Video quality must be at least 720p (HD).</li>
                      <li>Audio must be clear without echo or background noise.</li>
                    </ul>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Video Link (YouTube / Google Drive)</label>
                    <input 
                      type="url" 
                      value={videoLink}
                      onChange={(e) => setVideoLink(e.target.value)}
                      placeholder="https://..." 
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5E6F58]/20 focus:border-[#5E6F58] transition-all"
                    />
                  </div>

                  <div className="flex items-center justify-center gap-4 text-xs text-[#1a6b2e] font-bold uppercase">
                    <hr className="flex-1 border-gray-200" /> OR <hr className="flex-1 border-gray-200" />
                  </div>

                  <input 
                    type="file" 
                    accept="video/mp4,video/webm" 
                    className="hidden" 
                    ref={videoRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setVideoFile(e.target.files[0]);
                      }
                    }}
                  />
                  <div 
                    onClick={() => videoRef.current?.click()}
                    className={`w-full p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer group ${videoFile ? 'border-[#5E6F58] bg-[#5E6F58]/5' : 'border-gray-300 bg-gray-50 hover:border-[#5E6F58]'}`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors mb-3 ${videoFile ? 'bg-[#5E6F58]/20 text-[#d94d19]' : 'bg-[#c8e6c9] text-[#7dab52] group-hover:text-[#d94d19]'}`}>
                      {videoFile ? <CheckCircle2 className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
                    </div>
                    <span className="font-semibold text-gray-900 mb-1">
                      {videoFile ? 'Video Uploaded Successfully' : 'Click to upload video file'}
                    </span>
                    <span className="text-[#7dab52] text-xs">
                      {videoFile ? videoFile.name : 'MP4, WebM (Max 500MB)'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Interview Booking (Trainer Only) */}
            {step === 7 && role === 'trainer' && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Interview Booking</h2>
                <p className="text-[#7dab52] mb-8">Schedule a quick verification call with our team.</p>

                <div className="space-y-6">
                  <div className="p-5 bg-purple-50 border border-purple-100 rounded-xl">
                    <h3 className="text-purple-800 font-bold text-sm mb-2">Mandatory Verification</h3>
                    <p className="text-sm text-purple-700">
                      To maintain NextGen-LMS's premium quality, all trainers must pass a 10-15 minute verification call. Please schedule a time below.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">Select Date</label>
                      <input 
                        type="date" 
                        value={interview.date}
                        onChange={(e) => setInterview({...interview, date: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5E6F58]/20 focus:border-[#5E6F58] transition-all"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">Select Time</label>
                      <input 
                        type="time" 
                        value={interview.time}
                        onChange={(e) => setInterview({...interview, time: e.target.value})}
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#5E6F58]/20 focus:border-[#5E6F58] transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Success Step (totalSteps + 1) */}
            {step > totalSteps && (
              <div className="animate-in fade-in zoom-in-95 duration-500 py-8 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  {role === 'trainer' ? 'Profile Ready!' : "You're All Set!"}
                </h1>
                
                <p className="text-[#7dab52] max-w-sm mx-auto mb-8">
                  {role === 'trainer' 
                    ? "Your application has been submitted successfully. We will review it shortly."
                    : "Welcome to NextGen-LMS! Start exploring courses and freelance opportunities."}
                </p>

                <button 
                  onClick={handleFinish}
                  className="bg-[#5E6F58] hover:bg-[#d94d19] text-[#0f3d1a] px-8 py-3 rounded-lg font-bold transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            )}

          </div>

          {/* Action Footer (Hidden on success screen) */}
          {step <= totalSteps && (
            <div className="bg-gray-50 px-6 sm:px-10 py-5 border-t border-gray-200 flex items-center justify-between">
              <button 
                onClick={handleBack}
                disabled={step === 1}
                className={`font-medium text-[#7dab52] hover:text-gray-900 transition-colors ${step === 1 ? 'opacity-0 cursor-default' : 'opacity-100'}`}
              >
                Back
              </button>
              
              <button 
                onClick={step === totalSteps ? handleComplete : handleNext}
                disabled={!canContinue || loading}
                className="flex items-center gap-2 bg-[#5E6F58] hover:bg-[#d94d19] disabled:opacity-50 disabled:cursor-not-allowed text-[#0f3d1a] px-6 py-2.5 rounded-lg font-semibold transition-colors"
              >
                {loading ? 'Please wait...' : (step === totalSteps ? 'Submit' : 'Continue')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
