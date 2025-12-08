'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'

export default function HomePage() {
  const { user, loading, isNewUser } = useAuth()
  const router = useRouter()
  const { t } = useLanguage()

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && user) {
      if (isNewUser) {
        router.push('/onboarding')
      } else {
        router.push('/dashboard')
      }
    }
  }, [user, loading, isNewUser, router])

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto mb-4"></div>
          <p className="text-gray-600">{t('home.loading')}</p>
        </div>
      </div>
    )
  }

  // Don't show home page if user is authenticated
  if (user) {
    return null
  }
  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden">
      <Header />
      
      <main className="flex-1 relative z-10">
        {/* Section 1: Hero Section - Mobile optimized */}
        <section className="relative py-16 sm:py-20 md:py-32 lg:py-40 overflow-hidden mb-0 min-h-[60vh] sm:min-h-[70vh] flex items-center">
          {/* Hero Background with Mountains - using downloaded image */}
          <div className="absolute inset-0 hero-mountain-background pointer-events-none" style={{ zIndex: 0 }}>
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${encodeURI('/images/selin-wanner-wU4iORvrGmA-unsplash.jpg')})`,
                backgroundPosition: 'bottom center',
                backgroundSize: 'cover'
              }}
            ></div>
            {/* Overlay sombre pour améliorer la lisibilité du texte */}
            <div className="absolute inset-0 bg-black/20"></div>
            {/* Gradient pour se fondre avec la section suivante */}
            <div className="absolute inset-0 hero-image-bottom-gradient"></div>
          </div>
          
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full" style={{ zIndex: 10 }}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-medium text-white leading-[1.1] mb-6 sm:mb-8 tracking-[-1px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] px-2">
              {t('home.hero.title')}
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto leading-[1.4] font-medium tracking-[-0.02em] drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] px-4">
              {t('home.hero.description')}
            </p>

            <Link href="/auth/signup" className="inline-block w-full sm:w-auto">
              <button className="blue-gradient-button rounded-[10px] flex items-center justify-center gap-[6px] w-full sm:w-fit text-white font-semibold text-base sm:text-lg md:text-xl lg:text-2xl tracking-[-0.13px] px-8 sm:px-12 md:px-14 py-4 sm:py-5 md:py-6 lg:py-7 min-h-[52px] sm:min-h-[56px] relative overflow-hidden mx-auto shadow-[0_4px_20px_rgba(73,126,233,0.5)]">
                <span className="absolute top-0 left-0 z-20 h-full w-full blur-[1px]" aria-hidden="true">
                  <span className="blurred-border absolute -top-px -left-px z-20 h-full w-full"></span>
                </span>
                <span className="relative z-10">{t('home.hero.cta')}</span>
              </button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
