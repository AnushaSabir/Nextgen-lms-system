import React from 'react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-mainBg text-pureWhite selection:bg-primaryBlue selection:text-[#0f3d1a]">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
