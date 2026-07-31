import React from 'react';
import dynamic from 'next/dynamic';

// Above the fold - load normally
import HeroSection from '@/components/home/HeroSection';
import ScrollReveal from '@/components/home/ScrollReveal';

// Below the fold - lazy load for performance
const SkillPathsSection = dynamic(() => import('@/components/home/SkillPathsSection'), { ssr: true });
const WhyChooseUsSection = dynamic(() => import('@/components/home/WhyChooseUsSection'), { ssr: true });
const LearningEcosystemSection = dynamic(() => import('@/components/home/LearningEcosystemSection'), { ssr: true });
const TrendingCoursesSection = dynamic(() => import('@/components/home/TrendingCoursesSection'), { ssr: true });
const ExploreCareersSection = dynamic(() => import('@/components/home/ExploreCareersSection'), { ssr: true });
const LmsStatsSection = dynamic(() => import('@/components/home/LmsStatsSection'), { ssr: true });
const FaqSection = dynamic(() => import('@/components/home/FaqSection'), { ssr: true });
const FinalCtaSection = dynamic(() => import('@/components/home/FinalCtaSection'), { ssr: true });

export const metadata = {
  title: 'NextGen-LMS LMS | Pakistan\'s #1 Skill-to-Earn Platform',
  description: 'Learn high-income digital skills and launch your freelance career directly from NextGen-LMS LMS.',
};

export default function HomePage() {
  return (
    <div className="overflow-hidden bg-[#c8e6c9] text-[#0f3d1a]">
      <ScrollReveal />
      
      <HeroSection />
      
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
