'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CritiqueCard } from '@/components/ui/CritiqueCard'
import { useFaceCritique } from '@/hooks/useFaceCritique'
import { getRandomCritique, Critique } from '@/lib/dummyCritiques'
import { FaceCritique } from '@/hooks/useFaceCritique'

// Helper function to convert old Critique format to FaceCritique format
const convertCritiqueToFaceCritique = (oldCritique: Critique): FaceCritique => {
  return {
    id: `converted-${Date.now()}`,
    userId: 'demo-user',
    imageUrl: '',
    score: oldCritique.score,
    critique: oldCritique.roast,
    strengths: [], // No strengths in old format
    improvements: oldCritique.tips,
    verdict: oldCritique.verdict,
    createdAt: new Date()
  }
}

export default function CritiquePage() {
  const router = useRouter()
  const { currentCritique, resetCritique } = useFaceCritique()
  const [critique, setCritique] = useState<FaceCritique | any>(currentCritique)

  useEffect(() => {
    // First check if there's a selected critique in localStorage
    const selectedCritique = localStorage.getItem('selectedCritique')
    if (selectedCritique) {
      try {
        const parsedCritique = JSON.parse(selectedCritique)
        setCritique(parsedCritique)
        return
      } catch (error) {
        console.error('Error parsing selected critique:', error)
      }
    }

    // If no critique in context, generate a random one (for demo purposes)
    if (!currentCritique) {
      const randomCritique = getRandomCritique()
      setCritique(convertCritiqueToFaceCritique(randomCritique))
    } else {
      setCritique(currentCritique)
    }
  }, [currentCritique])

  const handleRetry = () => {
    // Clear selected critique from localStorage
    localStorage.removeItem('selectedCritique')
    resetCritique()
    router.push('/dashboard')
  }

  if (!critique) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
                         <p className="text-text-gray">No critique available</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-neon-blue hover:underline mt-2"
            >
              Go back to dashboard
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-6 sm:py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CritiqueCard
            critique={critique}
            onRetry={handleRetry}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
