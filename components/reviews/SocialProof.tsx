'use client'

import { useEffect, useState } from 'react'
import { AggregatedReviewData } from '@/types/reviews'
import { formatReviewCount, formatReviewDate, getReviewAttribution } from '@/lib/reviewUtils'

export function SocialProof() {
  const [reviewData, setReviewData] = useState<AggregatedReviewData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchReviewStats = async () => {
      try {
        setIsLoading(true)
        setError(false)
        
        const response = await fetch('/api/reviews/stats')
        
        if (!response.ok) {
          // Try to get error details from response
          const errorData = await response.json().catch(() => null)
          
          if (response.status === 500) {
            console.warn('Server error fetching reviews - this is expected if no reviews exist yet')
            if (errorData) {
              console.warn('Error details:', errorData)
            }
            // Don't treat 500 as a fatal error - just hide the component
            setError(true)
            return
          }
          throw new Error(errorData?.message || 'Failed to fetch reviews')
        }

        const data: AggregatedReviewData = await response.json()
        
        // Only set data if we have actual reviews
        if (data.totalReviews > 0) {
          setReviewData(data)
          setError(false)
        } else {
          // No reviews available, hide the component
          setError(true)
        }
      } catch (err) {
        console.warn('Error fetching review stats (this is normal if no reviews exist):', err)
        setError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReviewStats()
  }, [])

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto mb-8 animate-pulse">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="h-4 w-32 bg-gray-700/50 rounded"></div>
          </div>
          <div className="h-4 w-64 bg-gray-700/50 rounded mx-auto"></div>
        </div>
      </div>
    )
  }

  // Error state or no reviews - hide the section completely
  if (error || !reviewData || reviewData.totalReviews === 0) {
    return null
  }

  // Calculate star display
  const fullStars = Math.floor(reviewData.averageRating)
  const hasHalfStar = reviewData.averageRating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="text-center space-y-4">
        {/* Rating Display */}
        <div className="flex items-center justify-center space-x-3">
          <div className="flex items-center space-x-1 text-yellow-400">
            {/* Full Stars */}
            {Array.from({ length: fullStars }).map((_, i) => (
              <span key={`full-${i}`} className="text-xl">⭐</span>
            ))}
            {/* Half Star */}
            {hasHalfStar && <span className="text-xl">⭐</span>}
            {/* Empty Stars */}
            {Array.from({ length: emptyStars }).map((_, i) => (
              <span key={`empty-${i}`} className="text-xl opacity-30">⭐</span>
            ))}
          </div>
          <div className="text-gray-300">
            <span className="font-semibold text-white">{reviewData.averageRating.toFixed(1)}</span>
            <span className="text-sm">/5</span>
          </div>
        </div>

        {/* Review Count */}
        <p className="text-sm text-gray-400">
          Based on{' '}
          <span className="font-semibold text-gray-300">
            {formatReviewCount(reviewData.totalReviews)}
          </span>
          {' '}reviews
        </p>

        {/* Featured Testimonial */}
        {reviewData.featuredReview && (
          <div className="mt-6 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 max-w-2xl mx-auto">
            <div className="flex items-start space-x-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <span 
                  key={i} 
                  className={`text-sm ${
                    i < reviewData.featuredReview!.rating 
                      ? 'text-yellow-400' 
                      : 'text-gray-600'
                  }`}
                >
                  ⭐
                </span>
              ))}
            </div>
            
            <blockquote className="text-gray-200 text-sm md:text-base mb-4 italic">
              "{reviewData.featuredReview.comment}"
            </blockquote>
            
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center space-x-2">
                <span className="text-gray-300 font-medium">
                  {getReviewAttribution({
                    firstName: reviewData.featuredReview.firstName,
                    location: reviewData.featuredReview.location,
                    isVerified: reviewData.featuredReview.isVerified
                  })}
                </span>
              </div>
              <time className="text-gray-500">
                {formatReviewDate(new Date(reviewData.featuredReview.createdAt))}
              </time>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

