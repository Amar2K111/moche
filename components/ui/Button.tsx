'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'blue' | 'black'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseClasses = 'font-medium rounded-[10px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg touch-manipulation relative overflow-hidden'
  
  const variants = {
    primary: 'blue-gradient-button text-white focus:ring-blue-500 shadow-lg hover:shadow-xl',
    blue: 'blue-gradient-button text-white focus:ring-blue-500 shadow-lg hover:shadow-xl',
    black: 'black-gradient-button text-white focus:ring-gray-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-white hover:bg-white active:bg-white focus:bg-white text-black border border-gray-100 focus:ring-primary-blue shadow-sm hover:shadow-md',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 shadow-lg hover:shadow-xl',
    success: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500 shadow-lg hover:shadow-xl'
  }
  
  const sizes = {
    sm: 'px-4 py-2.5 text-sm min-h-[48px] sm:min-h-[44px]',
    md: 'px-6 py-3 text-base min-h-[48px] sm:min-h-[44px]',
    lg: 'px-6 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg min-h-[52px] sm:min-h-[48px]'
  }

  const needsGradientEffect = variant === 'primary' || variant === 'blue' || variant === 'black'

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {needsGradientEffect ? (
        <>
          <span className="absolute top-0 left-0 z-20 h-full w-full blur-[1px]" aria-hidden="true">
            <span className={cn(
              "absolute -top-px -left-px z-20 h-full w-full",
              variant === 'black' ? 'blurred-border-black' : 'blurred-border'
            )}></span>
          </span>
          <span className="relative z-10">{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}
