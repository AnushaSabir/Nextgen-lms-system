import React, { Suspense } from 'react';
import DoubleSliderAuth from '@/components/auth/DoubleSliderAuth';

export const metadata = {
  title: 'Sign In | NextGen-LMS LMS',
  description: 'Sign in to access your NextGen-LMS LMS dashboard',
};

export default function LoginPage() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-0 sm:p-4">
      {/* Branding */}
      <div className="absolute top-6 left-6 md:top-10 md:left-10 z-50">
        <div className="text-xl font-black text-[#0f3d1a] flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5E6F58] to-[#C6D6C0] flex items-center justify-center shadow-lg shadow-[#5E6F58]/20">
            <span className="text-[#0f3d1a] font-bold text-sm">G</span>
          </div>
          NextGen-LMS<span className="text-[#d94d19]">.</span>
        </div>
      </div>
      <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#5E6F58] border-t-transparent rounded-full animate-spin"></div></div>}>
        <DoubleSliderAuth />
      </Suspense>
    </div>
  );
}
