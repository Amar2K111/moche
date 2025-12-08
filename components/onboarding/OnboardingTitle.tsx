'use client';

interface OnboardingTitleProps {
  title: string;
}

export default function OnboardingTitle({ title }: OnboardingTitleProps) {
  return (
    <div className="relative mb-6">
      <h2 className="text-sm sm:text-base md:text-lg font-bold text-black text-center px-2 leading-tight">
        {title}
      </h2>
    </div>
  );
}
