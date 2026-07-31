import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Toast } from '@/components/ui/Toast';

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  title: 'NextGen-LMS LMS System',
  description: 'Skill learning, assessments, certification, institutions, trainers, and freelance marketplace readiness.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={plusJakartaSans.variable}>
      <body className="font-sans" suppressHydrationWarning>
        {children}
        <Toast />
      </body>
    </html>
  );
}
