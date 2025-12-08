/**
 * Script to seed sample reviews into Firestore
 * 
 * Usage:
 * 1. Ensure you have Firebase Admin SDK configured
 * 2. Run: npx ts-node scripts/seedReviews.ts
 * 
 * OR manually add reviews via Firebase Console using the sample data below
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'

// Sample reviews to seed
const SAMPLE_REVIEWS = [
  {
    userId: 'sample_user_001',
    rating: 5,
    comment: 'The brutal honesty was exactly what I needed. No sugarcoating, just real feedback that helped me improve my look.',
    firstName: 'Michael',
    location: 'London, UK',
    isVerified: true,
    isApproved: true,
  },
  {
    userId: 'sample_user_002',
    rating: 5,
    comment: 'Finally got the truth! The AI analysis was incredibly detailed and the styling tips were spot on.',
    firstName: 'Emma',
    location: 'Toronto, Canada',
    isVerified: true,
    isApproved: true,
  },
  {
    userId: 'sample_user_003',
    rating: 4,
    comment: 'Great service! The feedback was harsh but fair. Helped me understand what to work on.',
    firstName: 'Alex',
    location: 'Sydney, Australia',
    isVerified: true,
    isApproved: true,
  },
  {
    userId: 'sample_user_004',
    rating: 5,
    comment: 'Worth every penny. The detailed analysis gave me actionable steps to improve my appearance.',
    firstName: 'Sophie',
    location: 'Paris, France',
    isVerified: true,
    isApproved: true,
  },
  {
    userId: 'sample_user_005',
    rating: 5,
    comment: 'Finally, someone tells me the truth about my face! The score and feedback were eye-opening.',
    firstName: 'David',
    location: 'Berlin, Germany',
    isVerified: true,
    isApproved: true,
  },
  {
    userId: 'sample_user_006',
    rating: 4,
    comment: 'Honest feedback with practical advice. The AI really knows what it\'s talking about.',
    firstName: 'Lisa',
    location: 'Amsterdam, Netherlands',
    isVerified: true,
    isApproved: true,
  },
  {
    userId: 'sample_user_007',
    rating: 5,
    comment: 'This service exceeded my expectations. The critique was thorough and the improvement tips were helpful.',
    firstName: 'James',
    isVerified: true,
    isApproved: true,
  },
  {
    userId: 'sample_user_008',
    rating: 5,
    comment: 'Best money I\'ve spent on self-improvement. The brutal honesty is refreshing and useful.',
    firstName: 'Nina',
    location: 'Stockholm, Sweden',
    isVerified: true,
    isApproved: true,
  },
]

async function seedReviews() {
  try {
    // Initialize Firebase Admin if not already initialized
    if (getApps().length === 0) {
      console.error('Firebase Admin not initialized.')
      return
    }

    const db = getFirestore()
    const reviewsRef = db.collection('reviews')

    // Add each review with timestamps spread over the last 60 days
    for (let i = 0; i < SAMPLE_REVIEWS.length; i++) {
      const review = SAMPLE_REVIEWS[i]
      
      // Create timestamps spread over last 60 days
      const daysAgo = Math.floor(Math.random() * 60)
      const createdAt = Timestamp.fromDate(
        new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
      )

      const docRef = await reviewsRef.add({
        ...review,
        createdAt,
      })
    }
  } catch (error) {
    console.error('Error seeding reviews:', error)
  }
}

// Export for use as module or run directly
if (require.main === module) {
  seedReviews()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

export { seedReviews, SAMPLE_REVIEWS }

