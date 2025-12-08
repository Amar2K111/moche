'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface ScoreBarProps {
  score: number
  className?: string
}

export const ScoreBar: React.FC<ScoreBarProps> = ({ score, className }) => {
  const [displayScore, setDisplayScore] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [randomLabel, setRandomLabel] = useState('')

  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => {
      setDisplayScore(score)
      setIsAnimating(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [score])

  // Generate random label based on score range
  useEffect(() => {
    const getRandomLabel = (score: number) => {
      if (score >= 90) {
        const labels = ['Elite Hand Model', 'Hand Model Royalty', 'Crown-Worthy Hands', 'Hand Model Legend', 'Absolute Perfection', 'Chef\'s Kiss Hands', 'Hand Model Supreme']
        return labels[Math.floor(Math.random() * labels.length)]
      } else if (score >= 80) {
        const labels = ['Hand Model Material', 'Model Ready', 'Hand Model Vibes', 'This Slaps', 'Hand Goals', 'Model Material', 'Absolutely Fire', 'Hand Model Potential']
        return labels[Math.floor(Math.random() * labels.length)]
      } else if (score >= 60) {
        const labels = ['Potential Hand Model', 'Getting There', 'Not Bad', 'Could Work', 'Maybe Someday', 'Mid at Best', 'This Hits Different', 'Handsome Hands']
        return labels[Math.floor(Math.random() * labels.length)]
      } else if (score >= 40) {
        const labels = ['Maybe With Practice', 'Needs Work', 'This Ain\'t It', 'Keep Trying', 'Room for Improvement', 'Not Today Satan', 'Mid Hands', 'Could Be Better']
        return labels[Math.floor(Math.random() * labels.length)]
      } else {
        const labels = ['Don\'t Quit Your Day Job', 'Nah Fam', 'Ugly Ahh Hands', 'Chop Chop', 'Nah Bruh', 'This is Cursed', 'Straight Trash', 'Absolutely Not', 'Cursed Hands']
        return labels[Math.floor(Math.random() * labels.length)]
      }
    }
    
    setRandomLabel(getRandomLabel(score))
  }, [score])

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-neon-gold'
    if (score >= 80) return 'text-neon-green'
    if (score >= 60) return 'text-yellow-400'
    if (score >= 40) return 'text-orange-400'
    return 'text-neon-red'
  }

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return '👑'
    if (score >= 80) return '✅'
    if (score >= 60) return '🤔'
    if (score >= 40) return '😬'
    return '❌'
  }

  const getBarColor = (score: number) => {
    if (score >= 90) return 'bg-neon-gold'
    if (score >= 80) return 'bg-neon-green'
    if (score >= 60) return 'bg-yellow-400'
    if (score >= 40) return 'bg-orange-400'
    return 'bg-neon-red'
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Score Display */}
      <div className="text-center">
                 <div className={cn(
           'text-6xl font-bold transition-all duration-1000',
           getScoreColor(score),
           isAnimating && 'animate-pulse-slow'
         )}>
          {displayScore}
        </div>
        <div className="text-2xl text-text-gray mt-2">
          /100 {getScoreEmoji(score)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-1000 ease-out',
            getBarColor(score)
          )}
          style={{ width: `${displayScore}%` }}
        />
      </div>

      {/* Score Label */}
      <div className="text-center">
        <span className={cn(
          'text-lg font-semibold',
          getScoreColor(score)
        )}>
          {randomLabel}
        </span>
      </div>
    </div>
  )
}
