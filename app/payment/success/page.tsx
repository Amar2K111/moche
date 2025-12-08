'use client'

import React, { useEffect, useState, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { useUploads } from '@/hooks/useUploads'
import { UPLOADS_PACKAGE } from '@/lib/constants'

function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { refetchUploadsData } = useUploads()
  const [isProcessing, setIsProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasProcessedPayment = useRef(false)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    
    if (sessionId && user && !hasProcessedPayment.current) {
      hasProcessedPayment.current = true
      
      // With real-time listener, we can reduce the wait time
      // The webhook should process quickly and the real-time listener will update the UI
      setTimeout(async () => {
        try {
          // Manual refresh as backup (real-time listener should handle it automatically)
          await refetchUploadsData()
          setIsProcessing(false)
        } catch (err) {
          console.error('Error refreshing payment status:', err)
          setError('Le paiement a réussi, mais il y a eu un problème lors de l\'actualisation de vos crédits. Veuillez vérifier votre tableau de bord ou contacter le support si les crédits manquent.')
          setIsProcessing(false)
        }
      }, 2000) // Reduced wait time since we have real-time updates
    } else if (!sessionId) {
      setError('Aucune session de paiement trouvée.')
      setIsProcessing(false)
    }
  }, [searchParams, user, refetchUploadsData])

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <Card className="text-center py-8 sm:py-12 px-6 sm:px-8 max-w-md w-full">
          <div className="space-y-4 sm:space-y-6">
            <div className="text-5xl sm:text-6xl">⏳</div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 px-2">
              Traitement de votre paiement
            </h2>
            <p className="text-sm sm:text-base text-gray-600 px-2">
              Veuillez patienter pendant que nous confirmons votre achat et traitons vos crédits...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-blue mx-auto"></div>
          </div>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <Card className="text-center py-8 sm:py-12 px-6 sm:px-8 max-w-md w-full">
          <div className="space-y-4 sm:space-y-6">
            <div className="text-5xl sm:text-6xl">❌</div>
            <h2 className="text-xl sm:text-2xl font-bold text-red-600 px-2">
              Erreur de paiement
            </h2>
            <p className="text-sm sm:text-base text-gray-600 px-2">
              {error}
            </p>
            <Button
              onClick={() => router.push('/offer')}
              className="w-full min-h-[52px] touch-manipulation"
            >
              Réessayer
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="text-center py-8 sm:py-12 px-6 sm:px-8 max-w-md w-full">
        <div className="space-y-4 sm:space-y-6">
          <div className="text-5xl sm:text-6xl">🎉</div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 px-2">
            Paiement réussi !
          </h2>
          <p className="text-sm sm:text-base text-gray-600 px-2">
            Votre paiement a été traité avec succès ! Vos crédits ont été ajoutés à votre compte.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
            <p className="text-green-800 text-sm sm:text-base">
              ✅ {UPLOADS_PACKAGE.amount} crédits ont été ajoutés à votre compte
            </p>
            <p className="text-green-700 text-xs sm:text-sm mt-1">
              Les crédits sont traités de manière sécurisée via webhook et peuvent prendre quelques instants pour apparaître.
            </p>
          </div>
          <Button
            onClick={() => router.push('/dashboard')}
            className="w-full min-h-[52px] touch-manipulation"
          >
            Aller au tableau de bord
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  )
}



