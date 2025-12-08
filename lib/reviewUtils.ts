import { Review } from '@/types/reviews'

/**
 * Sanitizes user-generated review text to prevent XSS attacks
 * and ensure data privacy compliance
 */
export function sanitizeReviewText(text: string): string {
  if (!text) return ''
  
  // Remove HTML tags
  let sanitized = text.replace(/<[^>]*>/g, '')
  
  // Remove potentially dangerous characters
  sanitized = sanitized.replace(/[<>\"']/g, '')
  
  // Limit length
  const maxLength = 500
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength) + '...'
  }
  
  return sanitized.trim()
}

/**
 * Sanitizes first name for display (privacy compliance)
 */
export function sanitizeFirstName(name: string): string {
  if (!name) return 'Anonymous'
  
  // Remove any special characters and limit to reasonable length
  const sanitized = name.replace(/[^a-zA-Z\s-]/g, '').trim()
  
  // Take only first word and capitalize each part (handles hyphenated names)
  const firstName = sanitized.split(' ')[0]
  if (!firstName || firstName.length === 0) return 'Anonymous'
  
  // Capitalize first letter of each hyphen-separated part
  // Filter out empty parts to handle leading/trailing or consecutive hyphens
  const result = firstName
    .split('-')
    .filter(part => part.length > 0)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('-')
  
  return result.length > 0 ? result : 'Anonymous'
}
/**
 * Sanitizes location for display (privacy compliance)
 */
export function sanitizeLocation(location: string): string {
  if (!location) return ''

  // Remove potentially dangerous characters while preserving common location formatting
  const sanitized = location.replace(/[<>\"']/g, '').trim()
  const maxLength = 50

  if (sanitized.length > maxLength) {
    return sanitized.substring(0, maxLength)
  }

  return sanitized
}

/**
 * Validates rating is within acceptable range
 */
export function validateRating(rating: number): number {
  const numRating = Number(rating)
  if (isNaN(numRating) || numRating < 1 || numRating > 5) {
    return 3 // Default to neutral rating if invalid
  }
  return Math.round(numRating * 10) / 10 // Round to 1 decimal
}
/**
 * Formats date for review display
 */
export function formatReviewDate(date: Date): string {
  if (!date || !(date instanceof Date)) {
    return 'Recently'
  }
  
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

/**
 * Formats review count for display (e.g., "150+" instead of exact number)
 */
export function formatReviewCount(count: number): string {
  if (count === 0) return '0'
  if (count < 10) return `${count}`
  if (count < 50) return '10+'
  if (count < 100) return '50+'
  if (count < 500) return '100+'
  if (count < 1000) return '500+'
  return '1000+'
}

/**
 * Gets attribution text for a review (privacy-compliant)
 */
export function getReviewAttribution(review: {
  firstName: string
  location?: string
  isVerified: boolean
}): string {
  const name = sanitizeFirstName(review.firstName)
  const location = review.location ? sanitizeLocation(review.location) : null
  const verified = review.isVerified ? 'Verified buyer' : 'Customer'
  
  if (location) {
    return `${name} from ${location} · ${verified}`
  }
  return `${name} · ${verified}`
}

