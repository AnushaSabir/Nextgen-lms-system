'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, ShieldCheck, GraduationCap, Building2 } from 'lucide-react';
import { useToastStore } from '@/store/toast-store';
import { getErrorMessage } from '@/utils/errorParser';
import { useAuthStore } from '@/store/auth-store';

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
    desc: 'Sign up today and get access to expert-led courses, practical tasks, and a direct path to success.'
  }
];

export default function DoubleSliderAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const { showToast } = useToastStore();
  const { login: authLogin, register: authRegister } = useAuthStore();

  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  useEffect(() => {
    if (mode === 'signup') {
      setIsSignUp(true);
    }
  }, [mode]);

  const togglePanel = () => setIsSignUp(!isSignUp);

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
    const form = e.target as HTMLFormElement;
    const name = (form.querySelector('input[type="text"]') as HTMLInputElement)?.value?.trim();
    const email = (form.querySelector('input[type="email"]') as HTMLInputElement)?.value?.trim();
    const password = (form.querySelector('input[type="password"]') as HTMLInputElement)?.value;

    if (!name || !email || !password) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await authRegister({ name, email, password, role: 'learner' });
      showToast('Account created! Setting up profile...', 'success');
      router.push('/onboarding');
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
        <div className="form-container sign-up-container flex items-start sm:items-center justify-center p-0 sm:p-10">
          <form onSubmit={handleSignUpSubmit} className="flex flex-col items-center justify-center w-full sm:max-w-sm text-center">
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-1 tracking-tight">Create Account</h1>
            <p className="text-xs sm:text-sm text-[#50BED9] mb-4">Join Pakistan&apos;s premier learning platform</p>

            <div className="w-full space-y-3">
              <div className="relative group text-left">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-[#50BED9]" />
                </div>
                <input type="text" placeholder="Full Name" required className="block w-full pl-10 pr-4 py-2.5 bg-[#353638] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#50BED9]/40 focus:border-[#50BED9]/60 font-semibold" />
              </div>
              <div className="relative group text-left">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-[#50BED9]" />
                </div>
                <input type="email" placeholder="Email address" required className="block w-full pl-10 pr-4 py-2.5 bg-[#353638] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#50BED9]/40 font-semibold" />
              </div>
              <div className="relative group text-left">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-[#50BED9]" />
                </div>
                <input type={showSignUpPassword ? 'text' : 'password'} placeholder="Create Password" required className="block w-full pl-10 pr-10 py-2.5 bg-[#353638] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#50BED9]/40 font-semibold" />
                <button type="button" onClick={() => setShowSignUpPassword(p => !p)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#50BED9]/60 hover:text-white">
                  {showSignUpPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full mt-4 py-3 bg-[#50BED9] hover:bg-[#159BD7] text-white font-bold text-sm rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md disabled:opacity-60">
              {isLoading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : (<>Create Account <ArrowRight className="w-4 h-4" /></>)}
            </button>

            <div className="sm:hidden w-full text-center mt-4">
              <div className="text-xs text-[#D0D3D6]">Already a member? <button type="button" onClick={togglePanel} className="text-[#50BED9] font-black underline">Sign in here</button></div>
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
              <p className="text-[10px] font-black text-[#D0D3D6] uppercase tracking-wider mb-1">⚡ 1-Click Quick Demo Login:</p>
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
                  className="p-2 rounded-xl bg-[#353638] border border-white/10 hover:bg-[#50BED9] hover:border-[#50BED9] text-white transition-all text-center group shadow-sm active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4 mx-auto text-[#50BED9] group-hover:text-white mb-0.5" />
                  <span className="block text-[10px] font-black text-white leading-tight">Admin</span>
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

