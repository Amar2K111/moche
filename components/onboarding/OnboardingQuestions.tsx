'use client';

import { Button } from '@/components/ui/Button';

interface OnboardingQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
}

export default function OnboardingQuestions({ questions, onSelect }: OnboardingQuestionsProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      {questions.map((question) => (
        <Button
          key={question}
          onClick={() => onSelect(question)}
          className="w-full py-3 sm:py-4 text-sm sm:text-base md:text-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-white/30 hover:text-white transition-all duration-300 min-h-[48px] sm:min-h-[56px] md:min-h-[64px] text-center leading-tight rounded-2xl shadow-lg hover:shadow-xl hover:scale-105"
        >
          {question}
        </Button>
      ))}
    </div>
  );
}
