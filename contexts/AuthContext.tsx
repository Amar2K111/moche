'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, signInWithPopup, updateProfile as firebaseUpdateProfile } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db, googleProvider } from '@/lib/firebase'
import { handlePopupAuth, getPopupAuthErrorMessage } from '@/lib/popupAuth'
import { reportCriticalError } from '@/lib/errorUtils'

interface UserData {
  email: string
  displayName?: string
  photoURL?: string
  createdAt: Date
  onboardingCompleted: boolean
  onboardingData?: any
  provider?: string
  totalUploads?: number
  premium?: boolean // true if user has paid and can generate unlimited PDFs
  language?: 'en'
}

interface AuthContextType {
  user: (User & UserData) | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  markOnboardingCompleted: () => Promise<void>
  saveOnboardingProgress: (data: any) => Promise<void>
  isNewUser: boolean
  onboardingData: any
  updateTotalUploads: (newTotal: number) => Promise<void>
  updateUserData: (updates: Partial<UserData>) => void
  updateProfile: (updates: { displayName?: string; photoURL?: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<(User & UserData) | null>(null)
  const [loading, setLoading] = useState(true)
  const [isNewUser, setIsNewUser] = useState(false)
  const [onboardingData, setOnboardingData] = useState<any>(null)
  const [authProcessing, setAuthProcessing] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Prevent multiple rapid authentication state changes
      if (authProcessing) {
        return
      }
      
      setAuthProcessing(true)
      
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          
          if (!userDoc.exists()) {
            // Create user document for new users
            await setDoc(doc(db, 'users', user.uid), {
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              createdAt: new Date(),
              onboardingCompleted: false,
              onboarding: false, // New users start with onboarding: false
              provider: user.providerData[0]?.providerId || 'email',
              onboardingData: null,
              totalUploads: 0,
              premium: false, // Premium disabled until payment
              language: 'en'
            })
            
            setIsNewUser(true)
            setOnboardingData(null)
            setUser({
              ...user,
              totalUploads: 0,
              premium: false,
              language: 'en'
            } as User & UserData)
          } else {
            const userData = userDoc.data()
            // Check if onboarding is completed in Firestore
            const onboardingCompleted = userData?.onboardingCompleted === true
            const isNewUserValue = !onboardingCompleted
            
            setIsNewUser(isNewUserValue)
            setOnboardingData(userData?.onboardingData || null)
            
            // Merge Firebase Auth user with Firestore user data
            const mergedUser = {
              ...user,
              ...userData,
              onboardingCompleted: onboardingCompleted,
              totalUploads: userData?.totalUploads || 0,
              premium: userData?.premium === true, // Explicitly check for true
              language: userData?.language || 'en'
            } as User & UserData
            
            setUser(mergedUser)
          }
        } catch (error) {
          console.error('Error checking user document:', error)
          setIsNewUser(true)
          setOnboardingData(null)
          setUser({
            ...user,
            totalUploads: 0,
            premium: false,
            language: 'en'
          } as User & UserData)
        }
      } else {
        setUser(null)
        setIsNewUser(false)
        setOnboardingData(null)
      }
      
      setLoading(false)
      
      // Reset auth processing after a short delay
      setTimeout(() => {
        setAuthProcessing(false)
      }, 1000)
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      // User data will be loaded by onAuthStateChanged listener
    } catch (error) {
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      // User document will be created by onAuthStateChanged listener
    } catch (error) {
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      // Use signInWithPopup directly with better error handling
      await signInWithPopup(auth, googleProvider)
      
      // User data will be loaded by onAuthStateChanged listener
    } catch (error: any) {
      // Handle specific popup-related errors
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in was cancelled by user')
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Pop-up was blocked. Please allow pop-ups for this site.')
      } else if (error.message?.includes('Cross-Origin-Opener-Policy')) {
        console.warn('COOP policy warning, but authentication may still succeed')
        throw new Error('Authentication popup blocked by browser security policy. Please try again or use email/password sign-in.')
      } else if (error.message?.includes('window.closed') || error.message?.includes('window.close')) {
        // Handle COOP-related window.close errors - these might still succeed
        console.warn('COOP policy blocked window.close, but authentication may still succeed')
        throw new Error('Browser security policy blocked popup. Please try again or use email/password sign-in.')
      } else {
        throw error
      }
    }
  }

  const saveOnboardingProgress = async (data: any) => {
    if (!user) return
    
    // Check if all required fields are answered (including new fields)
    const allAnswered = data.dreamInterest && 
      data.obstacles && data.obstacles.length > 0 && 
      data.validation && 
      data.opportunity && 
      data.urgency && 
      data.selfImage && 
      data.socialMedia && 
      data.confidence && 
      data.comparison && 
      data.feedback && 
      data.expectations && 
      data.fears && 
      data.motivation &&
      data.skinImprovement &&
      data.futureConfidence &&
      data.lifeChange &&
      data.productHope &&
      data.readyToChange;
    
    if (!allAnswered) {
      // Save progress even if not all answered yet
      try {
        await setDoc(doc(db, 'users', user.uid), {
          onboardingData: data,
          onboarding: true,
          onboardingCompleted: false // Keep as false until all questions are answered
        }, { merge: true })
        setOnboardingData(data)
      } catch (error) {
        console.error('Error saving onboarding progress:', error)
        throw error
      }
      return;
    }
    
    // All questions answered, save progress
    try {
      await setDoc(doc(db, 'users', user.uid), {
        onboardingData: data,
        onboarding: true,
        onboardingCompleted: false // Will be set to true by markOnboardingCompleted
      }, { merge: true })
      setOnboardingData(data)
    } catch (error) {
      console.error('Error saving onboarding progress:', error)
      throw error
    }
  }

  const markOnboardingCompleted = async () => {
    if (!user) return
    
    try {
      await setDoc(doc(db, 'users', user.uid), {
        onboardingCompleted: true,
        onboarding: true // Ensure onboarding is set to true
      }, { merge: true })
      
      // Update local state immediately
      setIsNewUser(false)
      setUser(prev => prev ? { ...prev, onboardingCompleted: true } : null)
    } catch (error) {
      console.error('Error marking onboarding as completed:', error)
      throw error
    }
  }


  const updateTotalUploads = async (newTotal: number) => {
    if (!user) return
    
    try {
      await setDoc(doc(db, 'users', user.uid), {
        totalUploads: newTotal
      }, { merge: true })
      
      // Update local user state
      setUser(prev => prev ? { ...prev, totalUploads: newTotal } : null)
    } catch (error) {
      console.error('Error updating total uploads:', error)
      throw error
    }
  }

  const updateUserData = useCallback((updates: Partial<UserData>) => {
    setUser(prev => {
      if (!prev) return null
      const newUser = { ...prev, ...updates }
      return newUser
    })
  }, [])

  const updateProfile = async (updates: { displayName?: string; photoURL?: string }) => {
    if (!user || !auth.currentUser) {
      throw new Error('No user is currently logged in')
    }
    
    // Prepare updates and store previous values for potential rollback
    const authUpdates: { displayName?: string; photoURL?: string } = {}
    if (updates.displayName !== undefined) authUpdates.displayName = updates.displayName
    if (updates.photoURL !== undefined) authUpdates.photoURL = updates.photoURL

    if (Object.keys(authUpdates).length === 0) {
      return
    }

    // Store previous values for rollback
    const previousDisplayName = auth.currentUser.displayName
    const previousPhotoURL = auth.currentUser.photoURL

    try {
      // Step 1: Update Firebase Auth profile
      await firebaseUpdateProfile(auth.currentUser, authUpdates)

      try {
        // Step 2: Update Firestore document
        await setDoc(
          doc(db, 'users', user.uid),
          authUpdates,
          { merge: true }
        )

        // Step 3: Update local user state only after both operations succeed
        setUser(prev => {
          if (!prev) return null
          return {
            ...prev,
            displayName: authUpdates.displayName ?? prev.displayName,
            photoURL: authUpdates.photoURL ?? prev.photoURL
          }
        })
      } catch (firestoreError) {
        // Rollback: Revert Firebase Auth profile to previous values
        console.error('Firestore update failed, rolling back Auth profile:', firestoreError)
        
        // Check if user is still logged in before attempting rollback
        if (!auth.currentUser) {
          console.warn('Cannot rollback Auth profile: user is no longer authenticated')
          throw new Error('Failed to update profile in database. Please try again.')
        }
        
        // Prepare rollback updates before try block for error reporting
        const rollbackUpdates: { displayName?: string | null; photoURL?: string | null } = {}
        if (updates.displayName !== undefined) rollbackUpdates.displayName = previousDisplayName
        if (updates.photoURL !== undefined) rollbackUpdates.photoURL = previousPhotoURL
        
        try {
          await firebaseUpdateProfile(auth.currentUser, rollbackUpdates)
        } catch (rollbackError) {
          console.error('Failed to rollback Auth profile:', rollbackError)
          
          // **Enhanced Observability**: Report rollback failure to monitoring/alerting system
          // This critical error indicates data inconsistency between Auth and Firestore
          await reportCriticalError(rollbackError, {
            userId: user.uid,
            originalError: firestoreError,
            operation: 'profile_update_rollback_failed',
            timestamp: new Date(),
            context: {
              attemptedUpdates: authUpdates,
              rollbackUpdates,
              previousDisplayName,
              previousPhotoURL,
              userEmail: user.email,
              authProfileState: {
                displayName: auth.currentUser?.displayName,
                photoURL: auth.currentUser?.photoURL
              },
              // Include stack traces for debugging
              firestoreErrorMessage: firestoreError instanceof Error ? firestoreError.message : String(firestoreError),
              rollbackErrorMessage: rollbackError instanceof Error ? rollbackError.message : String(rollbackError)
            }
          }).catch(reportError => {
            // If error reporting itself fails, log it but don't let it block the flow
            console.error('Failed to report rollback error to monitoring system:', reportError)
          })
          
          // Even if rollback fails, we should still throw the original error
        }

        throw new Error('Failed to update profile in database. Please try again.')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      // Redirect to home page after logout
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    } catch (error) {
      throw error
    }
  }



  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    markOnboardingCompleted,
    saveOnboardingProgress,
    isNewUser,
    onboardingData,
    updateTotalUploads,
    updateUserData,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

