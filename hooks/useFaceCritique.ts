'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { convertFileToBase64 } from '@/lib/gemini'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface FaceCritique {
  id: string
  userId: string
  imageUrl: string
  score: number
  critique?: string // Optional - not used in UI anymore
  strengths?: string[] // Optional - not used in UI anymore
  improvements?: string[] // Optional - not used in UI anymore
  verdict: string
  pdfUrl?: string // URL du PDF stocké dans Firebase Storage
  noFaceDetected?: boolean // Flag indiquant qu'aucun visage n'a été détecté
  categoryScores?: {
    cheveux: number
    yeux: number
    nez: number
    bouche: number
    machoire: number
    peau: number
    symetrie: number
    potentiel: number
    // Scores détaillés de peau - tous positifs (plus haut = mieux)
    texture?: number
    uniformite?: number
    hydratation?: number
    eclat?: number
    finessePores?: number // Finesse des pores (plus haut = pores moins visibles)
    fermete?: number // Fermeté (plus haut = moins de rides)
    clarte?: number // Clarté (plus haut = moins d'imperfections)
    elasticite?: number
  }
  // Nouveaux champs pour le PDF
  skinType?: string
  skinSummary?: string
  allProblems?: string[]
  dayRoutine?: Array<{step: string, product: string, description: string}>
  nightRoutine?: Array<{step: string, product: string, description: string}>
  createdAt: Date
}


export const useFaceCritique = () => {
  const { user } = useAuth()
  const [isUploading, setIsUploading] = useState(false)
  const [currentCritique, setCurrentCritique] = useState<FaceCritique | null>(null)

  const uploadAndAnalyze = async (file: File): Promise<FaceCritique> => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    setIsUploading(true)

    try {
      // Photo rating is now FREE - no credit check or decrement needed
      // Credits are only required for PDF generation

      // Convert image to base64 for API
      const imageBase64 = await convertFileToBase64(file)

      // Generate critique using server-side API - always use French
      const response = await fetch('/api/generate-critique', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64,
          language: 'fr'
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error Response:', response.status, errorText)
        throw new Error(`Failed to generate critique: ${response.status} - ${errorText}`)
      }

      const critiqueData = await response.json()

      // Create critique object with all data from API
      const critique: FaceCritique = {
        id: `temp-${Date.now()}`, // Temporary ID for display
        userId: user.uid, // Keep for interface compatibility, but not needed in subcollection
        imageUrl: `data:image/jpeg;base64,${imageBase64}`, // Store as data URL (works in production)
        score: critiqueData.score,
        verdict: critiqueData.verdict,
        critique: critiqueData.critique,
        strengths: critiqueData.strengths,
        improvements: critiqueData.improvements,
        categoryScores: critiqueData.categoryScores, // Scores par catégorie depuis l'API
        noFaceDetected: critiqueData.noFaceDetected || false, // Flag indiquant qu'aucun visage n'a été détecté
        // Nouveaux champs pour le PDF
        skinType: critiqueData.skinType,
        skinSummary: critiqueData.skinSummary,
        allProblems: critiqueData.allProblems,
        dayRoutine: critiqueData.dayRoutine,
        nightRoutine: critiqueData.nightRoutine,
        createdAt: new Date()
      }

      // Try to save to Firestore (with fallback if it fails)
      let savedCritique = critique
      try {
        // Save critique as a subcollection under the user document
        const docRef = await addDoc(collection(db, 'users', user.uid, 'critiques'), critique)
        savedCritique = {
          ...critique,
          id: docRef.id
        }
      } catch (dbError) {
        console.warn('Failed to save critique to database, but continuing:', dbError)
        // Continue with the critique even if database save fails
      }

      // No credits needed for photo rating - it's free!

      setCurrentCritique(savedCritique) // Use savedCritique with real Firestore ID
      return savedCritique // Return savedCritique with real Firestore ID

    } catch (error) {
      console.error('Error uploading and analyzing:', error)
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  const resetCritique = () => {
    setCurrentCritique(null)
  }

  return {
    uploadAndAnalyze,
    isUploading,
    currentCritique,
    resetCritique
  }
}



