'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'

export default function SignUpPage() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const { signUp, signInWithGoogle, user, isNewUser } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && isNewUser) {
      // Add a small delay to prevent rapid redirects
      const redirectTimer = setTimeout(() => {
        router.push('/onboarding')
      }, 500)
      
      return () => clearTimeout(redirectTimer)
    }
  }, [user, isNewUser, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    const newErrors: Record<string, string> = {}
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('signup.error_password_mismatch')
    }
    
    if (formData.password.length < 6) {
      newErrors.password = t('signup.error_password_too_short')
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setIsLoading(true)
    setErrors({})

    try {
      await signUp(formData.email, formData.password)
      // Keep loading state true until navigation happens
      // Navigation will be handled by useEffect
    } catch (error: any) {
      setIsLoading(false) // Only reset loading on error
      if (error.code === 'auth/email-already-in-use') {
        setErrors({ email: t('signup.error_email_in_use') })
      } else if (error.code === 'auth/invalid-email') {
        setErrors({ email: t('signup.error_invalid_email') })
      } else if (error.code === 'auth/weak-password') {
        setErrors({ password: t('signup.error_weak_password') })
      } else {
        setErrors({ general: t('signup.error_general') })
      }
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    setErrors({})

    try {
      await signInWithGoogle()
      // Keep loading state true until navigation happens
      // Navigation will be handled by useEffect
    } catch (error: any) {
      setIsGoogleLoading(false) // Only reset loading on error
      setErrors({ general: error.message || t('signup.error_google_failed') })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }))
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-6 sm:py-8 md:py-12 px-4 relative z-10">
        <div className="w-full max-w-md">
          <Card className="p-5 sm:p-6 md:p-8">
            <div className="text-center mb-5 sm:mb-6">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-medium bg-gradient-to-r from-foreground to-dark-blue bg-clip-text text-transparent tracking-tight px-2">
                {t('signup.title')}
              </h1>
              <p className="text-gray-30 mt-2 text-sm sm:text-base px-2">
                {t('signup.subtitle')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {errors.general && (
                <div className="text-red-500 text-sm text-center">
                  {errors.general}
                </div>
              )}

              <Input
                label={t('signup.email_label')}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('signup.email_placeholder')}
                required
                error={errors.email}
                disabled={isGoogleLoading}
              />

              <Input
                label={t('signup.password_label')}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t('signup.password_placeholder')}
                required
                error={errors.password}
                disabled={isGoogleLoading}
              />

              <Input
                label={t('signup.confirm_password_label')}
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder={t('signup.confirm_password_placeholder')}
                required
                error={errors.confirmPassword}
                disabled={isGoogleLoading}
              />

              <Button
                type="submit"
                className="w-full rounded-[10px] min-h-[52px] touch-manipulation"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? t('signup.submitting') : t('signup.submit_button')}
              </Button>
             </form>

            {/* Divider */}
            <div className="relative my-5 sm:my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200/50" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-30">{t('signup.divider')}</span>
              </div>
            </div>

            {/* Google Sign Up - Mobile optimized */}
            <Button
              type="button"
              variant="secondary"
              className="w-full flex items-center justify-center space-x-2 min-h-[52px] touch-manipulation"
              size="lg"
              disabled={isLoading || isGoogleLoading}
              onClick={handleGoogleSignIn}
            >
               {isGoogleLoading ? (
                 <>
                   <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                     <circle cx="12" cy="12" r="10" stroke="#4285F4" strokeWidth="2" fill="none" strokeDasharray="31.416" strokeDashoffset="31.416">
                       <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                       <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                     </circle>
                   </svg>
                   <span>{t('signup.google_loading')}</span>
                 </>
               ) : (
                 <>
                   <svg className="w-5 h-5" viewBox="0 0 24 24">
                     <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                     <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                     <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                     <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                   </svg>
                   <span>{t('signup.google_button')}</span>
                 </>
               )}
             </Button>

            <div className="mt-6 text-center">
              <p className="text-gray-30 text-sm md:text-base">
                {t('signup.have_account')} {' '}
                <Link href="/auth/signin" className="text-primary-blue hover:text-primary-blue/80 hover:underline transition-colors duration-300">
                  {t('signup.signin_link')}
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
