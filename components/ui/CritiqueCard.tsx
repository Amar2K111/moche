'use client'

import React from 'react'
import { Card } from './Card'
import { ScoreBar } from './ScoreBar'
import { Button } from './Button'
import { FaceCritique } from '@/hooks/useFaceCritique'

interface CritiqueCardProps {
  critique: FaceCritique
  onRetry?: () => void
  className?: string
}

export const CritiqueCard: React.FC<CritiqueCardProps> = ({
  critique,
  onRetry,
  className
}) => {
  return (
    <Card className={cn('max-w-2xl mx-auto p-4 md:p-6', className)}>
      <div className="space-y-6 md:space-y-8">
        {/* Score Section */}
        <ScoreBar score={critique.score} />

        {/* Analysis Section */}
        <div className="text-center space-y-3 md:space-y-4">
          <h3 className="text-lg md:text-xl font-black text-neon-red">The Brutal Truth</h3>
          <div className="text-lg md:text-xl text-text-gray italic px-4">
            "{critique.critique}"
          </div>
        </div>

        {/* Strengths Section */}
        {critique.strengths && critique.strengths.length > 0 && (
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-lg md:text-xl font-black text-green-600 text-center">
              ✨ Qualités
            </h3>
            <div className="space-y-2 md:space-y-3">
              {critique.strengths.map((strength, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-2 md:space-x-3 p-3 bg-green-50 rounded-lg"
                >
                  <span className="text-green-600 text-base md:text-lg">✨</span>
                  <span className="text-text-dark text-base md:text-lg font-black" style={{textShadow: '0.25px 0.25px 0 black, -0.25px -0.25px 0 black, 0.25px -0.25px 0 black, -0.25px 0.25px 0 black'}}>{strength}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Improvements Section */}
        {critique.improvements && critique.improvements.length > 0 && (
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-lg md:text-xl font-black text-orange-600 text-center">
              💡 Areas to Improve
            </h3>
            <div className="space-y-2 md:space-y-3">
              {critique.improvements.map((improvement, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-2 md:space-x-3 p-3 bg-orange-50 rounded-lg"
                >
                  <span className="text-orange-600 text-base md:text-lg">💡</span>
                  <span className="text-text-dark text-base md:text-lg font-black" style={{textShadow: '0.25px 0.25px 0 black, -0.25px -0.25px 0 black, 0.25px -0.25px 0 black, -0.25px 0.25px 0 black'}}>{improvement}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verdict Section */}
        <div className="text-center space-y-3 md:space-y-4">
          <h3 className="text-lg md:text-xl font-black text-neon-gold">Final Verdict</h3>
          <div className="text-xl md:text-2xl font-black text-neon-gold px-4">
            {critique.verdict}
          </div>
        </div>

        {/* Action Buttons */}
        {onRetry && (
          <div className="flex justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={onRetry}
              className="w-full max-w-sm"
            >
              <span className="hidden sm:inline">Think you can do better? Upload again →</span>
              <span className="sm:hidden">Try Again →</span>
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
