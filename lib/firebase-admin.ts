import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

// Initialize Firebase Admin SDK
const getFirebaseConfig = () => {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  
  if (!serviceAccountKey) {
    console.warn('FIREBASE_SERVICE_ACCOUNT_KEY not found')
    return null
  }

  try {
    // Parse the JSON string
    const serviceAccount = JSON.parse(serviceAccountKey)
    return {
      credential: cert(serviceAccount),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    }
  } catch (error) {
    console.error('Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:', error)
    return null
  }
}

const firebaseAdminConfig = getFirebaseConfig()

// Initialize the app only if it doesn't exist and config is available
const adminApp = firebaseAdminConfig && getApps().length === 0 
  ? initializeApp(firebaseAdminConfig) 
  : getApps()[0]

// Get Firestore instance
export const adminDb = adminApp ? getFirestore(adminApp) : null

// Get Storage instance
export const adminStorage = adminApp ? getStorage(adminApp) : null

export default adminApp
