import React, { Suspense } from 'react';
import DoubleSliderAuth from '@/components/auth/DoubleSliderAuth';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Sign In | NextGen-LMS LMS',
  description: 'Sign in to access your NextGen-LMS LMS dashboard',
};

export default function LoginPage() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-0 sm:p-4">
      {/* Branding */}
      <div className="absolute top-6 left-6 md:top-10 md:left-10 z-50">
        <Link href="/">
          <Image src="/logo.png" alt="NextGen LMS" width={180} height={45} className="object-contain drop-shadow-md hover:scale-105 transition-transform" />
        </Link>
      </div>
      <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#5E6F58] border-t-transparent rounded-full animate-spin"></div></div>}>
        <DoubleSliderAuth />
      </Suspense>
    </div>
  );
}
