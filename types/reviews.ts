// Review data types for social proof
export interface Review {
  id: string
  userId: string
  rating: number // 1-5
  comment: string
  firstName: string
  location?: string
  isVerified: boolean
  createdAt: Date
  isApproved: boolean // For moderation
}

export interface AggregatedReviewData {
  averageRating: number
  totalReviews: number
  featuredReview?: {
    comment: string
    firstName: string
    location?: string
    isVerified: boolean
    rating: number
    createdAt: Date
  }
  lastUpdated: Date
}

export interface ReviewStats {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

