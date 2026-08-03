'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { login } from '@/services/trainerApi';
import { dashboardForRole } from '@/lib/routes';
import { useToastStore } from '@/store/toast-store';
import { getErrorMessage } from '@/utils/errorParser';

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

  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    if (mode === 'signup') {
      setIsSignUp(true);
    }
  }, [mode]);

  const togglePanel = () => setIsSignUp(!isSignUp);

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/onboarding');
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = (formData.get('email') as string) || (form.querySelector('input[type="email"]') as HTMLInputElement)?.value;
    const password = (formData.get('password') as string) || (form.querySelector('input[type="password"]') as HTMLInputElement)?.value;

    try {
      const res = await login({ email, password });
      const token = res?.token ?? res?.accessToken ?? res?.access_token;
      const user = res?.user;

      if (!token || !user) {
        throw new Error('Login response did not include token or user.');
      }

      localStorage.setItem('nextgen-lms_lms_token', token);
      localStorage.setItem('nextgen-lms_lms_user', JSON.stringify(user));
      router.push(dashboardForRole(user.role));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Login failed', err);
      showToast(getErrorMessage(err, 'Login failed. Check credentials.'), 'error');
    }
  };

  return (
    <div className="relative w-full max-w-5xl min-h-[100dvh] sm:min-h-[650px] sm:h-[650px] bg-black sm:bg-black border-0 sm:border border-[#1a6b2e]/30 rounded-none sm:rounded-[2.5rem] sm:shadow-2xl overflow-hidden flex flex-col sm:flex-row">

      {/* ─── CSS FOR THE SLIDER ANIMATION ─── */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .auth-container { position: relative; width: 100%; height: 100%; overflow: hidden; background-color: #000000; }
        .form-container { position: absolute; top: 0; height: 100%; transition: all 0.6s ease-in-out; background-color: #000000; }
        .sign-in-container { left: 0; width: 50%; z-index: 2; opacity: 1; visibility: visible; }
        .auth-container.right-panel-active .sign-in-container { transform: translateX(100%); opacity: 0; visibility: hidden; transition: opacity 0.3s, transform 0.6s, visibility 0.6s; }
        
        .sign-up-container { left: 0; width: 50%; opacity: 0; z-index: 1; visibility: hidden; }
        .auth-container.right-panel-active .sign-up-container { transform: translateX(100%); opacity: 1; z-index: 5; visibility: visible; animation: show 0.6s; }
        
        @keyframes show {
          0%, 49.99% { opacity: 0; z-index: 1; visibility: hidden; }
          50%, 100% { opacity: 1; z-index: 5; visibility: visible; }
        }

        .overlay-container { position: absolute; top: 0; left: 50%; width: 50%; height: 100%; overflow: hidden; transition: transform 0.6s ease-in-out; z-index: 100; }
        .auth-container.right-panel-active .overlay-container { transform: translateX(-100%); }
        
        .overlay { background: transparent; position: relative; left: -100%; height: 100%; width: 200%; transform: translateX(0); transition: transform 0.6s ease-in-out; }
        .auth-container.right-panel-active .overlay { transform: translateX(50%); }
        
        .overlay-panel { position: absolute; display: flex; align-items: center; justify-content: center; flex-direction: column; padding: 0 40px; text-align: center; top: 0; height: 100%; width: 50%; transform: translateX(0); transition: transform 0.6s ease-in-out; z-index: 20; }
        .overlay-left { transform: translateX(-20%); }
        .auth-container.right-panel-active .overlay-left { transform: translateX(0); }
        .overlay-right { right: 0; transform: translateX(0); }
        .auth-container.right-panel-active .overlay-right { transform: translateX(20%); }

        /* Mobile specific fixes - Premium Glass Card Overlap */
        @media (max-width: 768px) {
          .auth-container { min-height: 100vh; height: auto; overflow-y: auto; overflow-x: hidden; display: flex; flex-direction: column; background-color: #000000; justify-content: flex-start; align-items: center; }
          
          /* The Image Carousel Overlay takes up upper half */
          .overlay-container { display: block; position: relative !important; width: 100%; height: 350px; min-height: 350px; left: auto; top: auto; z-index: 1; transform: none !important; transition: none; overflow: hidden; flex-shrink: 0; }
          .auth-container.right-panel-active .overlay-container { transform: none !important; }
          
          .overlay { width: 100%; height: 100%; top: 0; left: 0; transform: none !important; transition: none; background: transparent; }
          .auth-container.right-panel-active .overlay { transform: none !important; }
          
          .overlay-panel { display: none !important; }
          
          /* The form overlaps the image beautifully as a glass card */
          .form-container { position: relative !important; width: calc(100% - 32px); max-width: 500px; height: auto; top: auto; left: auto !important; margin: -60px auto 40px auto; padding: 40px 24px; transition: opacity 0.4s ease-in-out; background: #c8e6c9; backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 1px solid rgba(26, 107, 46, 0.3); border-radius: 28px; box-shadow: 0 -20px 40px rgba(0, 0, 0, 0.5); z-index: 5; }
          
          .sign-in-container { opacity: 1; visibility: visible; transform: none !important; display: block; }
          .auth-container.right-panel-active .sign-in-container { opacity: 0; visibility: hidden; transform: none !important; display: none; }
          
          .sign-up-container { opacity: 0; visibility: hidden; transform: none !important; display: none; left: auto; width: 100%; }
          .auth-container.right-panel-active .sign-up-container { opacity: 1; visibility: visible; animation: none; transform: none !important; display: block; left: auto; width: 100%; }
        }
      `}} />

      <div className={`auth-container w-full h-full ${isSignUp ? 'right-panel-active' : ''}`}>

        {/* SIGN UP FORM */}
        <div className="form-container sign-up-container flex items-start sm:items-center justify-center p-0 sm:p-12">
          <form onSubmit={handleSignUpSubmit} className="flex flex-col items-center justify-center w-full sm:max-w-sm text-center sm:mt-0">
            {/* Mobile Title */}
            <div className="sm:hidden w-full text-left mb-6">
              <div className="flex items-center justify-start gap-2 mb-4">
                <Image src="/logo.png" alt="NextGen LMS" width={140} height={35} className="object-contain" style={{filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.4)) drop-shadow(-1px -2px 3px rgba(255,255,255,0.6))'}} />
              </div>
              <h1 className="text-3xl font-black text-[#0f3d1a] mb-2">Create account</h1>
              <p className="text-sm text-[#1a6b2e]">Sign up to NextGen LMS — Your Skill-to-Success Platform</p>
            </div>

            <h1 className="hidden sm:block text-2xl sm:text-3xl font-black text-[#0f3d1a] mb-1 sm:mb-2 tracking-tight">Create Account</h1>
            <p className="hidden sm:block text-xs sm:text-sm text-[#1a6b2e] mb-4 sm:mb-8">Join Pakistan's premier learning platform</p>

            <div className="w-full space-y-3 sm:space-y-4">
              <div className="relative group text-left">
                <label className="sm:hidden text-xs font-bold text-[#0f3d1a]/80 mb-1 ml-1 block uppercase tracking-wider">Full Name</label>
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none sm:top-0 top-6">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 group-focus-within:text-[#d94d19] transition-colors" />
                </div>
                <input type="text" placeholder="John Doe" required className="block w-full pl-9 sm:pl-11 pr-4 py-3 sm:py-3 bg-[#0f3d1a]/5 sm:bg-[#0f3d1a]/5 bg-transparent border border-[#0f3d1a]/20 rounded-xl text-sm sm:text-base text-[#0f3d1a] placeholder-[#0f3d1a]/50 focus:outline-none focus:border-[#5E6F58] focus:ring-1 focus:ring-[#5E6F58] transition-all" />
              </div>
              <div className="relative group text-left">
                <label className="sm:hidden text-xs font-bold text-[#0f3d1a]/80 mb-1 ml-1 block uppercase tracking-wider">Email</label>
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none sm:top-0 top-6">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 group-focus-within:text-[#d94d19] transition-colors" />
                </div>
                <input type="email" placeholder="you@example.com" required className="block w-full pl-9 sm:pl-11 pr-4 py-3 sm:py-3 bg-[#0f3d1a]/5 sm:bg-[#0f3d1a]/5 bg-transparent border border-[#0f3d1a]/20 rounded-xl text-sm sm:text-base text-[#0f3d1a] placeholder-[#0f3d1a]/50 focus:outline-none focus:border-[#5E6F58] focus:ring-1 focus:ring-[#5E6F58] transition-all" />
              </div>
              <div className="relative group text-left">
                <label className="sm:hidden text-xs font-bold text-[#0f3d1a]/80 mb-1 ml-1 block uppercase tracking-wider">Password</label>
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none sm:top-0 top-6">
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 group-focus-within:text-[#d94d19] transition-colors" />
                </div>
                <input type="password" placeholder="••••••••" required className="block w-full pl-9 sm:pl-11 pr-4 py-3 sm:py-3 bg-[#0f3d1a]/5 sm:bg-[#0f3d1a]/5 bg-transparent border border-[#0f3d1a]/20 rounded-xl text-sm sm:text-base text-[#0f3d1a] placeholder-[#0f3d1a]/50 focus:outline-none focus:border-[#5E6F58] focus:ring-1 focus:ring-[#5E6F58] transition-all" />
              </div>
            </div>

            <button type="submit" className="w-full mt-6 sm:mt-6 py-3.5 sm:py-4 bg-[#0f3d1a] text-white font-bold text-sm sm:text-base rounded-xl hover:bg-[#1a6b2e] hover:shadow-[0_0_20px_rgba(15,61,26,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2">
              Let's go <ArrowRight className="w-4 h-4" />
            </button>

            <div className="relative w-full flex items-center justify-center my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#0f3d1a]/20"></div></div>
              <div className="relative bg-[#c8e6c9] sm:bg-[#c8e6c9] backdrop-blur-md px-3 sm:px-4 text-[10px] sm:text-xs text-[#1a6b2e] lowercase tracking-wider rounded-full">or sign up with Google</div>
            </div>

            <div className="flex w-full mb-6 sm:mb-0">
              <button type="button" className="w-full flex items-center justify-center gap-2 py-3 sm:py-3 rounded-xl border border-[#0f3d1a]/20 bg-[#0f3d1a]/5 hover:bg-white/10 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                <span className="text-[#0f3d1a] font-bold text-sm">Sign up with Google</span>
              </button>
            </div>

            <div className="sm:hidden w-full text-center mt-2 mb-8">
              <div className="text-sm text-[#1a6b2e]">Already a member? <button type="button" onClick={togglePanel} className="text-[#d94d19] font-bold">Sign in here</button></div>
            </div>

          </form>
        </div>

        {/* SIGN IN FORM */}
        <div className="form-container sign-in-container flex items-start sm:items-center justify-center p-0 sm:p-12">
          <form onSubmit={handleSignInSubmit} className="flex flex-col items-center justify-center w-full sm:max-w-sm text-center sm:mt-0">

            {/* Mobile Title */}
            <div className="sm:hidden w-full text-left mb-6">
              <div className="flex items-center justify-start gap-2 mb-4">
                <Image src="/logo.png" alt="NextGen LMS" width={140} height={35} className="object-contain drop-shadow-md" />
              </div>
              <h1 className="text-3xl font-black text-[#0f3d1a] mb-2">Welcome back</h1>
              <p className="text-sm text-[#1a6b2e]">Sign in to NextGen LMS — Your Skill-to-Success Platform</p>
            </div>

            <h1 className="hidden sm:block text-2xl sm:text-3xl font-black text-[#0f3d1a] mb-1 sm:mb-2 tracking-tight">Sign In</h1>
            <p className="hidden sm:block text-xs sm:text-sm text-[#1a6b2e] mb-4 sm:mb-8">Access your NextGen-LMS LMS dashboard</p>

            <div className="w-full space-y-3 sm:space-y-4">
              <div className="relative group text-left">
                <label className="sm:hidden text-xs font-bold text-[#0f3d1a]/80 mb-1 ml-1 block uppercase tracking-wider">Email</label>
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none sm:top-0 top-6">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 group-focus-within:text-[#d94d19] transition-colors" />
                </div>
                <input type="email" placeholder="you@example.com" required className="block w-full pl-9 sm:pl-11 pr-4 py-3 sm:py-3 bg-[#0f3d1a]/5 sm:bg-[#0f3d1a]/5 bg-transparent border border-[#0f3d1a]/20 rounded-xl text-sm sm:text-base text-[#0f3d1a] placeholder-[#0f3d1a]/50 focus:outline-none focus:border-[#5E6F58] focus:ring-1 focus:ring-[#5E6F58] transition-all" />
              </div>
              <div className="relative group text-left">
                <label className="sm:hidden text-xs font-bold text-[#0f3d1a]/80 mb-1 ml-1 block uppercase tracking-wider">Password</label>
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none sm:top-0 top-6">
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500 group-focus-within:text-[#d94d19] transition-colors" />
                </div>
                <input type="password" placeholder="••••••••" required className="block w-full pl-9 sm:pl-11 pr-4 py-3 sm:py-3 bg-[#0f3d1a]/5 sm:bg-[#0f3d1a]/5 bg-transparent border border-[#0f3d1a]/20 rounded-xl text-sm sm:text-base text-[#0f3d1a] placeholder-[#0f3d1a]/50 focus:outline-none focus:border-[#5E6F58] focus:ring-1 focus:ring-[#5E6F58] transition-all" />
              </div>
            </div>

            <div className="w-full text-right mt-3 sm:mt-3 mb-2">
              <Link href="#" className="text-sm sm:text-sm text-[#d94d19] font-semibold hover:text-[#C6D6C0] transition-colors">Forgot password?</Link>
            </div>

            <button type="submit" className="w-full mt-2 sm:mt-6 py-3.5 sm:py-4 bg-[#0f3d1a] text-white font-bold text-sm sm:text-base rounded-xl hover:bg-[#1a6b2e] hover:shadow-[0_0_20px_rgba(15,61,26,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2">
              Let's go <ArrowRight className="w-4 h-4" />
            </button>

            <div className="relative w-full flex items-center justify-center my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#0f3d1a]/20"></div></div>
              <div className="relative bg-[#c8e6c9] sm:bg-[#c8e6c9] backdrop-blur-md px-3 sm:px-4 text-[10px] sm:text-xs text-[#1a6b2e] lowercase tracking-wider rounded-full">or sign in with Google</div>
            </div>

            <div className="flex w-full mb-6 sm:mb-0">
              <button type="button" className="w-full flex items-center justify-center gap-2 py-3 sm:py-3 rounded-xl border border-[#0f3d1a]/20 bg-[#0f3d1a]/5 hover:bg-white/10 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                <span className="text-[#0f3d1a] font-bold text-sm">Sign in with Google</span>
              </button>
            </div>

            <div className="sm:hidden w-full text-center mt-2 mb-8">
              <div className="text-sm text-[#1a6b2e]">Not a member? <button type="button" onClick={togglePanel} className="text-[#d94d19] font-bold">Sign up here</button></div>
            </div>

          </form>
        </div>

        {/* OVERLAY CONTAINER (Image Carousel) */}
        <div className="overlay-container">
          <div className="overlay relative">

            {/* Static Images Based on Auth State */}
            {AUTH_SLIDES.map((slide, index) => (
              <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${(isSignUp ? 1 : 0) === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                <Image src={slide.image} alt={slide.title} fill className="object-cover" priority={index === 0} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#c8e6c9]/20 to-[#c8e6c9] sm:to-[#c8e6c9]/60" />

                {/* Text Content */}
                <div className="absolute bottom-28 sm:bottom-20 left-6 sm:left-12 pr-6">
                  <h2 className="text-2xl sm:text-4xl font-black text-[#0f3d1a] mb-1 sm:mb-2 drop-shadow-lg">{slide.title}</h2>
                  <p className="text-[#0f3d1a]/80 text-xs sm:text-sm max-w-[280px] sm:max-w-sm drop-shadow-md">{slide.desc}</p>
                </div>
              </div>
            ))}



            {/* Desktop Overlay Panels (for toggle buttons) */}
            <div className="overlay-panel overlay-left">
              <div className="hidden sm:flex flex-col items-center justify-center p-8 bg-[#c8e6c9] rounded-3xl border border-[#1a6b2e]/30 shadow-2xl transform transition-transform hover:scale-105">
                <div className="mb-6 flex justify-center">
                  <Image src="/logo.png" alt="NextGen LMS" width={160} height={40} className="object-contain" style={{filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.4)) drop-shadow(-1px -2px 3px rgba(255,255,255,0.6))'}} />
                </div>
                <h3 className="text-xl font-black text-[#0f3d1a] mb-2">Already have an account?</h3>
                <p className="text-sm text-[#1a6b2e] mb-6 text-center max-w-[220px]">Sign in to access your NextGen-LMS dashboard and continue your journey.</p>
                <button onClick={togglePanel} className="w-full py-3 bg-[#0f3d1a] text-white font-bold rounded-xl hover:bg-[#1a6b2e] transition-colors shadow-lg active:scale-95">
                  Sign In to Account
                </button>
              </div>
            </div>

            <div className="overlay-panel overlay-right">
              <div className="hidden sm:flex flex-col items-center justify-center p-8 bg-[#c8e6c9] rounded-3xl border border-[#1a6b2e]/30 shadow-2xl transform transition-transform hover:scale-105">
                <div className="mb-6 flex justify-center">
                  <Image src="/logo.png" alt="NextGen LMS" width={160} height={40} className="object-contain" style={{filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.4)) drop-shadow(-1px -2px 3px rgba(255,255,255,0.6))'}} />
                </div>
                <h3 className="text-xl font-black text-[#0f3d1a] mb-2">New to NextGen-LMS?</h3>
                <p className="text-sm text-[#1a6b2e] mb-6 text-center max-w-[220px]">Create an account to start learning, earning, and growing with us.</p>
                <button onClick={togglePanel} className="w-full py-3 bg-[#d94d19] text-white font-bold rounded-xl hover:bg-[#c34516] transition-colors shadow-lg active:scale-95">
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
