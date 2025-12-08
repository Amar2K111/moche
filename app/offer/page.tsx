'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { UPLOADS_PACKAGE } from '@/lib/constants'
import { useAuth } from '@/contexts/AuthContext'
import { useUploads } from '@/hooks/useUploads'
import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'

function OfferContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading: authLoading } = useAuth()
  const { premiumData, loading: uploadsLoading, canGeneratePDF } = useUploads()
  const { t } = useLanguage()
  const hasWarning = searchParams.get('warning') === 'no-uploads'
  const [isLoading, setIsLoading] = useState(false)

  // Redirect to dashboard if user has premium access (has paid)
  useEffect(() => {
    // Wait for auth and premium data to load
    if (authLoading || uploadsLoading) return
    
    // If user is authenticated and has premium access, redirect to dashboard
    if (user && canGeneratePDF()) {
      router.push('/dashboard')
    }
  }, [user, premiumData, authLoading, uploadsLoading, router, canGeneratePDF])

  // Show loading while checking PDF access
  if (authLoading || uploadsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mx-auto mb-4"></div>
          <p className="text-gray-30">{t('offer.loading')}</p>
        </div>
      </div>
    )
  }

  const handlePayment = async () => {
    // Check if user is authenticated
    if (!user) {
      alert(t('offer.sign_in_to_purchase'))
      router.push('/auth/signin')
      return
    }

    setIsLoading(true)
    
    try {
      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success_url: `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/offer`,
          user_id: user?.uid || '',
        }),
      })

      const { sessionId } = await response.json()

      if (!sessionId) {
        throw new Error('Failed to create checkout session')
      }

      // Load Stripe and redirect to checkout
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      
      if (!stripe) {
        throw new Error('Failed to load Stripe')
      }

      const { error } = await stripe.redirectToCheckout({ sessionId })

      if (error) {
        throw new Error(error.message)
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert(t('offer.payment_failed'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50 via-white to-blue-50 p-4 py-12 sm:p-6 md:p-8">
      {/* Background decorative elements - Blue theme */}
      <div className="absolute top-0 right-0 h-96 w-96 animate-pulse rounded-full bg-primary-blue/20 blur-3xl"></div>
      <div className="absolute top-1/4 left-0 h-72 w-72 rounded-full bg-primary-blue/10 blur-3xl"></div>
      
      {/* Floating badges */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-4 -rotate-2 transform rounded-xl bg-white px-4 py-2 shadow-md md:left-12">
          <p className="text-sm font-medium text-primary-blue">Analyse IA précise</p>
        </div>
        <div className="absolute top-32 right-8 rotate-2 transform rounded-xl bg-white px-4 py-2 shadow-md md:right-20">
          <p className="text-sm font-medium text-primary-blue">Note sur 100</p>
        </div>
        <div className="absolute bottom-1/4 left-8 rotate-1 transform rounded-xl bg-white px-4 py-2 shadow-md md:left-24">
          <p className="text-sm font-medium text-primary-blue">100% Honnête</p>
        </div>
        <div className="absolute bottom-24 right-8 -rotate-1 transform rounded-xl bg-white px-4 py-2 shadow-md md:right-20 md:bottom-28">
          <p className="text-sm font-medium text-primary-blue">PDF personnalisé avec conseils d'amélioration</p>
        </div>
      </div>

      {/* Back Button */}
      <Link 
        href="/" 
        className="absolute top-4 left-4 z-10 flex items-center justify-center gap-1 text-sm text-primary-blue transition-colors hover:text-primary-blue/80 hover:underline focus:outline-none sm:top-6 sm:left-6"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
          <path d="m12 19-7-7 7-7"></path>
          <path d="M19 12H5"></path>
        </svg>
        Retour
      </Link>

      {/* Main Content */}
      <div className="relative z-10 flex w-full max-w-lg flex-col items-center">
        {/* Logo and Title */}
        <Link href="/" className="flex items-center gap-3 pb-2 transition-opacity hover:opacity-80">
          <h2 className="text-3xl font-bold text-gray-900">PasMoche</h2>
        </Link>
        
        <p className="mb-6 text-center text-sm font-medium text-balance text-gray-600 sm:text-xl">
          Analyse gratuite + PDF personnalisé avec conseils pour améliorer ton apparence
            </p>
            
        {/* Pricing Options */}
        <div className="w-full space-y-3">
          {/* Single Package Option */}
          <button 
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full transform rounded-xl border-2 p-6 transition-all duration-300 scale-[1.02] border-primary-blue bg-blue-50 shadow-lg shadow-primary-blue/20"
          >
            <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">
                    PDF illimité – €{UPLOADS_PACKAGE.price}
                </span>
            {UPLOADS_PACKAGE.oldPrice && (
                  <span className="animate-pulse rounded-full bg-primary-blue px-2 py-0.5 text-xs font-semibold text-white">
                    ÉCONOMISEZ {Math.round((1 - UPLOADS_PACKAGE.price / UPLOADS_PACKAGE.oldPrice) * 100)}%
                  </span>
                )}
              </div>
              {UPLOADS_PACKAGE.oldPrice && (
                <div className="text-sm text-gray-500 line-through">
                  €{UPLOADS_PACKAGE.oldPrice}
                </div>
              )}
              </div>
              <p className="text-sm text-gray-600 text-left">
                Génère un nombre illimité de PDF personnalisés de tes photos avec conseils d'amélioration
              </p>
            </div>
              </button>

          {/* CTA Button - Blue gradient */}
                <button
                  onClick={handlePayment}
                  disabled={isLoading}
            className="block w-full rounded-xl bg-gradient-to-r from-primary-blue to-[#5a8aff] py-4 text-center text-lg font-semibold text-white shadow-lg shadow-primary-blue/30 transition-all duration-300 hover:scale-[1.02] hover:from-[#3d6dd8] hover:to-[#4a7aff] hover:shadow-xl hover:shadow-primary-blue/40 focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 min-h-[56px] touch-manipulation"
                >
                  {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>{t('offer.processing')}</span>
                    </div>
                  ) : (
              `Obtenir mon PDF personnalisé`
                  )}
                </button>
          
          <p className="text-center text-sm text-gray-600">
            100% sécurisé avec Stripe
          </p>
          </div>

        {/* Footer Links */}
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
          <Link href="/terms-of-use" className="transition-colors hover:text-primary-blue hover:underline">
            Conditions
          </Link>
          <span className="text-gray-400">|</span>
          <Link href="/privacy-policy" className="transition-colors hover:text-primary-blue hover:underline">
            Confidentialité
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function OfferPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <OfferContent />
    </Suspense>
  )
}
