import React from 'react';
import OnboardingFlow from '@/components/auth/OnboardingFlow';

export const metadata = {
  title: 'Setup Profile | NextGen-LMS LMS',
  description: 'Set up your NextGen-LMS profile to get started',
};

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#c8e6c9] overflow-hidden">
      <OnboardingFlow />
    </div>
  );
}
