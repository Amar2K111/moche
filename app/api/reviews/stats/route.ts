import { NextResponse } from 'next/server'
import { collection, query, where, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { AggregatedReviewData, Review } from '@/types/reviews'
import {
  sanitizeReviewText,
  sanitizeFirstName,
  sanitizeLocation,
  validateRating
} from '@/lib/reviewUtils'

// Cache duration in seconds (5 minutes)
const CACHE_DURATION = 300

export async function GET() {
  try {
    // Query approved reviews from Firestore
    const reviewsRef = collection(db, 'reviews')
    
    // Check if db is properly initialized
    if (!db) {
      throw new Error('Firestore database not initialized')
    }
    
    let querySnapshot
    let reviews: Review[] = []

    try {
      // Try the complex query first (requires composite index)
      const q = query(
        reviewsRef,
        where('isApproved', '==', true),
        orderBy('createdAt', 'desc'),
        limit(100) // Get last 100 reviews for stats
      )
      querySnapshot = await getDocs(q)
    } catch (indexError) {
      console.warn('Composite index not found, falling back to simple query:', indexError)
      
      try {
        // Fallback: Simple query without orderBy (no index required)
        const simpleQuery = query(
          reviewsRef,
          where('isApproved', '==', true),
          limit(100)
        )
        querySnapshot = await getDocs(simpleQuery)
      } catch (permissionError) {
        console.warn('Permission denied for reviews query, returning empty data:', permissionError)
        // Return empty data if we can't access reviews
        const fallbackData: AggregatedReviewData = {
          averageRating: 0,
          totalReviews: 0,
          lastUpdated: new Date()
        }

        return NextResponse.json(fallbackData, {
          headers: {
            'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate`
          }
        })
      }
    }

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      reviews.push({
        id: doc.id,
        userId: data.userId || '',
        rating: data.rating || 5,
        comment: data.comment || '',
        firstName: data.firstName || 'Anonymous',
        location: data.location,
        isVerified: data.isVerified || false,
        createdAt: data.createdAt instanceof Timestamp 
          ? data.createdAt.toDate() 
          : new Date(data.createdAt),
        isApproved: data.isApproved || false
      })
    })

    // Sort reviews by createdAt in descending order if we used the fallback query
    reviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    // If no reviews exist in database, return fallback data
    if (reviews.length === 0) {
      const fallbackData: AggregatedReviewData = {
        averageRating: 0,
        totalReviews: 0,
        lastUpdated: new Date()
      }

      return NextResponse.json(fallbackData, {
        headers: {
          'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate`
        }
      })
    }

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = validateRating(totalRating / reviews.length)

    // Get a featured review (highest rated, most recent, with comment)
    const featuredReviewData = reviews.find(
      r => r.rating >= 4 && r.comment && r.comment.trim().length > 20
    )

    let featuredReview = undefined
    if (featuredReviewData) {
      featuredReview = {
        comment: sanitizeReviewText(featuredReviewData.comment),
        firstName: sanitizeFirstName(featuredReviewData.firstName),
        location: featuredReviewData.location 
          ? sanitizeLocation(featuredReviewData.location) 
          : undefined,
        isVerified: featuredReviewData.isVerified,
        rating: validateRating(featuredReviewData.rating),
        createdAt: featuredReviewData.createdAt
      }
    }

    const aggregatedData: AggregatedReviewData = {
      averageRating,
      totalReviews: reviews.length,
      featuredReview,
      lastUpdated: new Date()
    }

    return NextResponse.json(aggregatedData, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate`
      }
    })
  } catch (error) {
    // Enhanced error logging for debugging
    console.error('Error fetching review stats:', error)
    
    // Check for specific Firestore errors
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      
      // Check if it's an index error
      if (error.message.includes('index') || error.message.includes('FAILED_PRECONDITION')) {
        console.error('⚠️ FIRESTORE INDEX REQUIRED: You need to create a composite index for the query.')
        console.error('Index needed for: collection(reviews) where(isApproved == true) orderBy(createdAt desc)')
      }
    }
    
    // Return proper error status for monitoring
    return NextResponse.json(
      { 
        error: 'Failed to fetch review statistics',
        message: error instanceof Error ? error.message : 'Unable to retrieve review data at this time',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : String(error)) : undefined
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-cache'
        }
      }
    )
  }
}

