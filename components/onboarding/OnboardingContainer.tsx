'use client';

import { Card } from '@/components/ui/Card';

interface OnboardingContainerProps {
  children: React.ReactNode;
}

export default function OnboardingContainer({ children }: OnboardingContainerProps) {
  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 max-w-4xl mx-auto shadow-2xl">
      {children}
    </div>
  );
}
