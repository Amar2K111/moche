'use client'

import React, { useId } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className,
  id,
  ...props
}) => {
  const generatedId = useId()
  const inputId = id || generatedId
  
  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={inputId}
          className={cn(
            "block text-sm font-medium tracking-tight text-[#000000]",
            props.disabled && "text-gray-400 cursor-not-allowed"
          )}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full px-4 py-3 !bg-white border border-gray-200 rounded-lg text-[#000000] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue focus:!bg-white transition-all duration-200 min-h-[44px] text-base',
          error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
          props.disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200' : 'cursor-text !bg-white',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
