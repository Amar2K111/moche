'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface PremiumData {
  premium: boolean // true if user has paid and can generate unlimited PDFs
}

export const useUploads = () => {
  const { user } = useAuth()
  const [premiumData, setPremiumData] = useState<PremiumData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setPremiumData(null)
      setLoading(false)
      return
    }

    // Set up real-time listener for user document
    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid),
      (userDoc) => {
        if (userDoc.exists()) {
          const data = userDoc.data()
          const newPremiumData = {
            premium: data.premium === true // Explicitly check for true
          }
          setPremiumData(newPremiumData)
        } else {
          // Set default values if document doesn't exist
          const defaultData = {
            premium: false
          }
          setPremiumData(defaultData)
        }
        setLoading(false)
      },
      (error) => {
        console.error('useUploads: Real-time listener error:', error)
        const errorData = {
          premium: false
        }
        setPremiumData(errorData)
        setLoading(false)
      }
    )

    // Cleanup listener on unmount or user change
    return () => {
      unsubscribe()
    }
  }, [user])

  // Check if user can generate PDFs (has paid)
  const canGeneratePDF = () => {
    return premiumData ? premiumData.premium === true : false
    }

  // Alias for compatibility
  const hasAvailableCredits = () => {
    return canGeneratePDF()
  }

  // Refetch premium data
  const refetchUploadsData = useCallback(async () => {
    if (!user) return
    
    try {
      // Force a fresh read from Firebase - real-time listener will update automatically
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        // Real-time listener will update automatically
      }
    } catch (error) {
      console.error('Error refetching premium data:', error)
    }
  }, [user])


  return {
    premiumData,
    loading,
    canGeneratePDF,
    hasAvailableCredits,
    refetchUploadsData
  }
}
