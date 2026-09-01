'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, ShieldCheck, GraduationCap, Building2, Camera, Upload, Phone, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import { useToastStore } from '@/store/toast-store';
import { getErrorMessage } from '@/utils/errorParser';
import { useAuthStore } from '@/store/auth-store';
import { syncStudentProfileToSupabase } from '@/lib/supabaseClient';

const COURSE_TRACKS = [
  'Python for Data Science, Analytics & AI',
  'Next.js 15 & React 19 Full-Stack Mastery',
  'Applied Generative AI & Large Language Models',
  'Graphic Design Mastery (Photoshop & Figma)',
  'Digital Marketing & Social Growth',
  'Data Science with Python & Power BI',
  'Cloud Architecture & DevOps CI/CD',
  'Cybersecurity Analyst Bootcamp',
  'UI/UX Design Systems',
  'Mobile App Development (React Native)',
];

const AUTH_SLIDES = [
  {
    image: '/images/auth_login_bg.jpg',
    badge1: 'Welcome Back',
    badge1Desc: 'Continue your journey',
    badge2: 'Skill Path',
    badge2Desc: 'Resume Learning',
    title: 'Welcome Back to NextGen LMS',
    desc: 'Log in to continue building your skills, tracking your progress, and getting closer to your goals.'
  },
  {
    image: '/images/auth_register_bg.jpg',
    badge1: 'Join Us',
    badge1Desc: 'Start your journey',
    badge2: 'Get Certified',
    badge2Desc: 'Unlock potential',
    title: 'Join the NextGen Community',
    desc: 'Sign up today and get access to expert-led courses, practical tasks, and your official Student ID Card.'
  }
];

export default function DoubleSliderAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const courseParam = searchParams.get('course');
  const { showToast } = useToastStore();
  const { login: authLogin, register: authRegister } = useAuthStore();

  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Sign up fields
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpCourse, setSignUpCourse] = useState(COURSE_TRACKS[0]);
  const [signUpAvatar, setSignUpAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'signup') {
      setIsSignUp(true);
    }
    if (courseParam) {
      const idx = parseInt(courseParam) - 1;
      if (COURSE_TRACKS[idx]) {
        setSignUpCourse(COURSE_TRACKS[idx]);
      }
    }
  }, [mode, courseParam]);

  const togglePanel = () => setIsSignUp(!isSignUp);

  // Handle Photo File Selection
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WEBP).', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size must be less than 5MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setSignUpAvatar(base64);
      showToast('Photo uploaded successfully! 📸', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleQuickLogin = async (roleType: 'student' | 'admin' | 'school') => {
    setIsLoading(true);
    try {
      let email = 'student@nextgen.lms';
      if (roleType === 'admin') email = 'admin@nextgen.lms';
      if (roleType === 'school') email = 'school@nextgen.lms';

      const redirectTo = await authLogin({ email, password: 'password123' });
      showToast(`Logged in as ${roleType.toUpperCase()}! Redirecting...`, 'success');
      router.push(redirectTo);
    } catch (err) {
      showToast(getErrorMessage(err, 'Login failed.'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword) {
      showToast('Please fill in Name, Email and Password.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const generatedRollNo = `NXG-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

      await authRegister({
        name: signUpName.trim(),
        email: signUpEmail.trim(),
        password: signUpPassword,
        role: 'learner',
        avatar: signUpAvatar || undefined,
        studentId: generatedRollNo,
        rollNo: generatedRollNo,
        phone: signUpPhone.trim() || undefined,
        enrolledCourse: signUpCourse,
        batch: `Batch ${new Date().getFullYear()}-A`,
        department: 'School of Artificial Intelligence & Computing',
      });

      // Try Syncing to Supabase
      syncStudentProfileToSupabase({
        name: signUpName.trim(),
        email: signUpEmail.trim(),
        avatar_url: signUpAvatar,
        student_id: generatedRollNo,
        roll_no: generatedRollNo,
        phone: signUpPhone.trim(),
        enrolled_course: signUpCourse,
        batch: `Batch ${new Date().getFullYear()}-A`,
        department: 'School of Artificial Intelligence & Computing',
      }).catch(() => {});

      showToast('Account created & Student ID Card issued! 🎉', 'success');
      router.push('/student#id_card');
    } catch (err) {
      showToast(getErrorMessage(err, 'Registration failed. Please try again.'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailInput.trim();
    const password = passwordInput;

    if (!email || !password) {
      showToast('Please enter email and password.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const redirectTo = await authLogin({ email, password });
      showToast('Welcome back! Redirecting...', 'success');
      router.push(redirectTo);
    } catch (err) {
      showToast(getErrorMessage(err, 'Login failed. Check credentials.'), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-5xl min-h-[100dvh] sm:min-h-[670px] sm:h-[670px] bg-[#101010] border-0 sm:border border-[#50BED9]/20 rounded-none sm:rounded-[2.5rem] sm:shadow-2xl overflow-hidden flex flex-col sm:flex-row">

      {/* CSS FOR THE SLIDER ANIMATION */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .auth-container { position: relative; width: 100%; height: 100%; overflow: hidden; background-color: #101010; }
        .form-container { position: absolute; top: 0; height: 100%; transition: all 0.6s ease-in-out; background-color: #101010; }
        .sign-in-container { left: 0; width: 50%; z-index: 2; opacity: 1; visibility: visible; }
        .auth-container.right-panel-active .sign-in-container { transform: translateX(100%); opacity: 0; visibility: hidden; transition: opacity 0.3s, transform 0.6s, visibility 0.6s; }
        
        .sign-up-container { left: 0; width: 50%; opacity: 0; z-index: 1; visibility: hidden; }
        .auth-container.right-panel-active .sign-up-container { transform: translateX(100%); opacity: 1; z-index: 5; visibility: visible; animation: show 0.6s; }
        
        @keyframes show {
          0%, 49.99% { opacity: 0; z-index: 1; }
          50%, 100% { opacity: 1; z-index: 5; }
        }
        
        .overlay-container { position: absolute; top: 0; left: 50%; width: 50%; height: 100%; overflow: hidden; transition: transform 0.6s ease-in-out; z-index: 100; }
        .auth-container.right-panel-active .overlay-container { transform: translateX(-100%); }
        
        .overlay { background: transparent; color: #ffffff; position: relative; left: -100%; height: 100%; width: 200%; transform: translateX(0); transition: transform 0.6s ease-in-out; }
        .auth-container.right-panel-active .overlay { transform: translateX(50%); }
        
        .overlay-panel { position: absolute; display: flex; align-items: center; justify-content: center; flex-direction: column; text-align: center; top: 0; height: 100%; width: 50%; transform: translateX(0); transition: transform 0.6s ease-in-out; }
        .overlay-left { transform: translateX(-20%); }
        .auth-container.right-panel-active .overlay-left { transform: translateX(0); }
        .overlay-right { right: 0; transform: translateX(0); }
        .auth-container.right-panel-active .overlay-right { transform: translateX(20%); }
        
        @media (max-width: 639px) {
          .auth-container { display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100dvh; min-height: 100dvh; padding: 16px 0; }
          .overlay-container { display: none !important; }
          .overlay { display: none !important; }
          .overlay-panel { display: none !important; }
          .form-container { position: relative !important; width: calc(100% - 32px); max-width: 440px; height: auto; top: auto; left: auto !important; margin: 0 auto; padding: 28px 20px; background: #101010; border: 1px solid rgba(14, 165, 233, 0.2); border-radius: 24px; box-shadow: 0 8px 40px rgba(0, 0, 0, 0.6); z-index: 5; }
          .sign-in-container { opacity: 1; visibility: visible; transform: none !important; display: block; }
          .auth-container.right-panel-active .sign-in-container { opacity: 0; visibility: hidden; transform: none !important; display: none; }
          .sign-up-container { opacity: 0; visibility: hidden; transform: none !important; display: none; left: auto; width: 100%; }
          .auth-container.right-panel-active .sign-up-container { opacity: 1; visibility: visible; animation: none; transform: none !important; display: block; left: auto; width: 100%; }
        }
      `}} />

      <div className={`auth-container w-full h-full ${isSignUp ? 'right-panel-active' : ''}`}>

        {/* SIGN UP FORM */}
        <div className="form-container sign-up-container flex items-start sm:items-center justify-center p-2 sm:p-8 overflow-y-auto max-h-full">
          <form onSubmit={handleSignUpSubmit} className="flex flex-col items-center justify-center w-full sm:max-w-sm text-center py-2">
            <h1 className="text-xl sm:text-2xl font-black text-white mb-0.5 tracking-tight">Student Registration</h1>
            <p className="text-[11px] sm:text-xs text-[#50BED9] mb-3">Join NextGen LMS & get your Student ID Card</p>

            {/* Student Photo Upload with Live Preview */}
            <div className="flex flex-col items-center mb-3">
              <label className="relative group cursor-pointer">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-0.5 bg-gradient-to-tr from-[#50BED9] via-[#159BD7] to-[#33C6B6] shadow-lg shadow-[#50BED9]/25 group-hover:scale-105 transition-all">
                  <div className="w-full h-full rounded-[14px] bg-[#151515] overflow-hidden flex flex-col items-center justify-center relative">
                    {signUpAvatar ? (
                      <img src={signUpAvatar} alt="Student Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-[#50BED9] p-1">
                        <Camera className="w-6 h-6 mb-0.5 group-hover:scale-110 transition-transform" />
                        <span className="text-[8px] font-black text-[#D0D3D6] uppercase tracking-wider">Photo</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Floating upload badge */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#50BED9] text-[#101010] flex items-center justify-center shadow-md border-2 border-[#101010]">
                  {signUpAvatar ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Upload className="w-3 h-3" />}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
              <span className="text-[9px] font-bold text-[#D0D3D6]/70 mt-1">
                {signUpAvatar ? '✓ Photo selected for ID card' : 'Upload student picture (For ID Card)'}
              </span>
            </div>

            <div className="w-full space-y-2 text-left">
              {/* Full Name */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-3.5 w-3.5 text-[#50BED9]" />
                </div>
                <input
                  type="text"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  placeholder="Full Name"
                  required
                  className="block w-full pl-9 pr-3 py-2 bg-[#353638] border border-white/10 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#50BED9]/40 font-semibold"
                />
              </div>

              {/* Email */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-3.5 w-3.5 text-[#50BED9]" />
                </div>
                <input
                  type="email"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  className="block w-full pl-9 pr-3 py-2 bg-[#353638] border border-white/10 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#50BED9]/40 font-semibold"
                />
              </div>

              {/* Course Track Select */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BookOpen className="h-3.5 w-3.5 text-[#50BED9]" />
                </div>
                <select
                  value={signUpCourse}
                  onChange={(e) => setSignUpCourse(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 bg-[#353638] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#50BED9]/40 font-semibold appearance-none cursor-pointer"
                >
                  {COURSE_TRACKS.map((track) => (
                    <option key={track} value={track} className="bg-[#151515] text-white">
                      {track}
                    </option>
                  ))}
                </select>
              </div>

              {/* Password */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-3.5 w-3.5 text-[#50BED9]" />
                </div>
                <input
                  type={showSignUpPassword ? 'text' : 'password'}
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  placeholder="Create Password"
                  required
                  className="block w-full pl-9 pr-9 py-2 bg-[#353638] border border-white/10 rounded-xl text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#50BED9]/40 font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowSignUpPassword(p => !p)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#50BED9]/60 hover:text-white"
                >
                  {showSignUpPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-2.5 bg-gradient-to-r from-[#50BED9] to-[#159BD7] hover:brightness-110 text-[#101010] font-black text-xs rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-lg shadow-[#50BED9]/25 disabled:opacity-60"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-[#101010] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account & Issue ID Card</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            <div className="sm:hidden w-full text-center mt-3">
              <div className="text-[11px] text-[#D0D3D6]">
                Already a member? <button type="button" onClick={togglePanel} className="text-[#50BED9] font-black underline">Sign in here</button>
              </div>
            </div>
          </form>
        </div>

        {/* SIGN IN FORM */}
        <div className="form-container sign-in-container flex items-start sm:items-center justify-center p-0 sm:p-10">
          <div className="flex flex-col items-center justify-center w-full sm:max-w-sm text-center">
            
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-1 tracking-tight">Sign In</h1>
            <p className="text-xs sm:text-sm text-[#50BED9] mb-4">Choose your role or enter credentials</p>

            {/* 1-CLICK QUICK ROLE LOGIN BUTTONS */}
            <div className="w-full mb-4 space-y-1.5 text-left">
              <p className="text-[10px] font-black text-[#D0D3D6] uppercase tracking-wider mb-1">⚡ 1-Click Quick Access:</p>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('student')}
                  disabled={isLoading}
                  className="p-2 rounded-xl bg-[#353638] border border-white/10 hover:bg-[#50BED9] hover:border-[#50BED9] text-white transition-all text-center group shadow-sm active:scale-95"
                >
                  <GraduationCap className="w-4 h-4 mx-auto text-[#50BED9] group-hover:text-white mb-0.5" />
                  <span className="block text-[10px] font-black text-white leading-tight">Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  disabled={isLoading}
                  className="p-2 rounded-xl bg-[#353638] border border-[#50BED9]/30 hover:bg-[#50BED9] hover:border-[#50BED9] text-white transition-all text-center group shadow-sm active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4 mx-auto text-[#50BED9] group-hover:text-white mb-0.5" />
                  <span className="block text-[10px] font-black text-white leading-tight">Admin (Anusha)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('school')}
                  disabled={isLoading}
                  className="p-2 rounded-xl bg-[#353638] border border-white/10 hover:bg-[#50BED9] hover:border-[#50BED9] text-white transition-all text-center group shadow-sm active:scale-95"
                >
                  <Building2 className="w-4 h-4 mx-auto text-[#50BED9] group-hover:text-white mb-0.5" />
                  <span className="block text-[10px] font-black text-white leading-tight">Institute</span>
                </button>
              </div>
            </div>

            <div className="relative w-full flex items-center justify-center my-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
              <div className="relative bg-[#101010] px-2 text-[10px] font-bold text-[#50BED9] uppercase">or manual login</div>
            </div>

            {/* MANUAL LOGIN FORM */}
            <form onSubmit={handleSignInSubmit} className="w-full space-y-2.5">
              <div className="relative text-left">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-[#50BED9]" />
                </div>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="e.g. student@nextgen.lms / admin@nextgen.lms"
                  required
                  className="block w-full pl-10 pr-4 py-2.5 bg-[#353638] border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#50BED9]/40 font-semibold"
                />
              </div>

              <div className="relative text-left">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-[#50BED9]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Password (any password for demo)"
                  required
                  className="block w-full pl-10 pr-10 py-2.5 bg-[#353638] border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#50BED9]/40 font-semibold"
                />
                <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#50BED9]/60 hover:text-white">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <button type="submit" disabled={isLoading} className="w-full mt-3 py-3 bg-[#50BED9] hover:bg-[#159BD7] text-white font-bold text-sm rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md disabled:opacity-60">
                {isLoading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : (<>Sign In <ArrowRight className="w-4 h-4" /></>)}
              </button>
            </form>

            <div className="sm:hidden w-full text-center mt-3">
              <div className="text-xs text-[#D0D3D6]">Not a member? <button type="button" onClick={togglePanel} className="text-[#50BED9] font-black underline">Sign up here</button></div>
            </div>
          </div>
        </div>

        {/* OVERLAY CONTAINER */}
        <div className="overlay-container">
          <div className="overlay relative">
            {AUTH_SLIDES.map((slide, index) => (
              <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${(isSignUp ? 1 : 0) === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                <Image src={slide.image} alt={slide.title} fill className="object-cover" priority={index === 0} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#101010]/30 to-[#101010]/80" />

                <div className="absolute bottom-20 left-12 pr-6">
                  <h2 className="text-3xl font-black text-white mb-2 drop-shadow-lg">{slide.title}</h2>
                  <p className="text-white/80 text-sm max-w-sm drop-shadow-md">{slide.desc}</p>
                </div>
              </div>
            ))}

            <div className="overlay-panel overlay-left">
              <div className="hidden sm:flex flex-col items-center justify-center p-8 bg-[#101010] rounded-3xl border border-[#50BED9]/20 shadow-2xl" style={{ boxShadow: '0 0 30px rgba(14,165,233,0.15)' }}>
                <div className="mb-6 flex justify-center">
                  <div className="relative h-14 w-48 flex items-center">
                    <Image src="/logo.png" alt="NEXTGEN Studio" fill sizes="200px" className="object-contain filter drop-shadow-md" />
                  </div>
                </div>
                <h3 className="text-xl font-black text-white mb-2">Already have an account?</h3>
                <p className="text-sm text-[#50BED9] mb-6 text-center max-w-[220px]">Sign in to access your NextGen-LMS dashboard.</p>
                <button onClick={togglePanel} className="w-full py-3 bg-[#50BED9] hover:bg-[#159BD7] text-white font-bold rounded-xl transition-colors shadow-lg active:scale-95">
                  Sign In to Account
                </button>
              </div>
            </div>

            <div className="overlay-panel overlay-right">
              <div className="hidden sm:flex flex-col items-center justify-center p-8 bg-[#101010] rounded-3xl border border-[#50BED9]/20 shadow-2xl" style={{ boxShadow: '0 0 30px rgba(14,165,233,0.15)' }}>
                <div className="mb-6 flex justify-center">
                  <div className="relative h-14 w-48 flex items-center">
                    <Image src="/logo.png" alt="NEXTGEN Studio" fill sizes="200px" className="object-contain filter drop-shadow-md" />
                  </div>
                </div>
                <h3 className="text-xl font-black text-white mb-2">New to NextGen-LMS?</h3>
                <p className="text-sm text-[#50BED9] mb-6 text-center max-w-[220px]">Create an account to start learning and growing with us.</p>
                <button onClick={togglePanel} className="w-full py-3 bg-[#50BED9] hover:bg-[#159BD7] text-white font-bold rounded-xl transition-all shadow-lg active:scale-95">
                  Create an Account
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

