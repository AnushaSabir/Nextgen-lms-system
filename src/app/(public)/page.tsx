import React from 'react';
import dynamic from 'next/dynamic';

// Above the fold - load normally
import HeroSection from '@/components/home/HeroSection';
import ScrollReveal from '@/components/home/ScrollReveal';

// Below the fold - lazy load for performance
const LmsIntroVideoSection = dynamic(() => import('@/components/home/LmsIntroVideoSection'), { ssr: true });
const SkillPathsSection = dynamic(() => import('@/components/home/SkillPathsSection'), { ssr: true });
const WhyChooseUsSection = dynamic(() => import('@/components/home/WhyChooseUsSection'), { ssr: true });
const LearningEcosystemSection = dynamic(() => import('@/components/home/LearningEcosystemSection'), { ssr: true });
const TrendingCoursesSection = dynamic(() => import('@/components/home/TrendingCoursesSection'), { ssr: true });
const ExploreCareersSection = dynamic(() => import('@/components/home/ExploreCareersSection'), { ssr: true });
const LmsStatsSection = dynamic(() => import('@/components/home/LmsStatsSection'), { ssr: true });
const FaqSection = dynamic(() => import('@/components/home/FaqSection'), { ssr: true });
const FinalCtaSection = dynamic(() => import('@/components/home/FinalCtaSection'), { ssr: true });

export const metadata = {
  title: 'NextGen LMS | AI-Powered Learning Management System',
  description: 'Master high-impact software, AI, and design skills with NextGen LMS.',
};

export default function HomePage() {
  return (
    <div className="overflow-hidden bg-[#323232] text-white">
      <ScrollReveal />
      
      <HeroSection />

      <LmsIntroVideoSection />
      
      <SkillPathsSection />
      
      <WhyChooseUsSection />
      
      <LearningEcosystemSection />
      
      <TrendingCoursesSection />
      
      <ExploreCareersSection />
      
      <LmsStatsSection />
      
      <FaqSection />
      
      <FinalCtaSection />
    </div>
  );
}
