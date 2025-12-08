'use client';

import { Button } from '@/components/ui/Button';

interface OnboardingBackButtonProps {
  onClick: () => void;
}

export default function OnboardingBackButton({ onClick }: OnboardingBackButtonProps) {
  return (
    <div className="relative">
      <Button 
        onClick={onClick} 
        className="absolute -top-10 sm:-top-12 -left-2 sm:-left-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 px-2 sm:px-3 py-1 text-xs focus:outline-none focus:ring-0 shadow-lg hover:shadow-xl min-h-[28px] sm:min-h-[32px] rounded-xl"
      >
        Retour
      </Button>
    </div>
  );
}
