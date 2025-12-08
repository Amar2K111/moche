'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'

interface CreditCounterProps {
  credits: number
  className?: string
}

export const CreditCounter: React.FC<CreditCounterProps> = ({
  credits,
  className
}) => {
  const { t } = useLanguage()
  const hasCredits = credits > 0

  return (
    <div className={cn(
      'flex items-center space-x-3 p-4 rounded-lg border-2 transition-all duration-200',
      hasCredits 
        ? 'border-neon-green bg-green-900 bg-opacity-20' 
        : 'border-neon-red bg-red-900 bg-opacity-20',
      className
    )}>
      <div className={cn(
        'text-2xl',
        hasCredits ? 'text-neon-green' : 'text-neon-red'
      )}>
        {hasCredits ? '✅' : '❌'}
      </div>
      
      <div className="flex-1">
        <div className={cn(
          'text-lg font-bold',
          hasCredits ? 'text-neon-green' : 'text-neon-red'
        )}>
          {hasCredits ? t('credit_counter.credits_left', { credits }) : t('credit_counter.credits_left_zero')}
        </div>
        
        <div className="text-sm text-text-gray">
          {hasCredits 
            ? t('credit_counter.ready_for_roast')
            : t('credit_counter.unlock_critiques')
          }
        </div>
      </div>
    </div>
  )
}
