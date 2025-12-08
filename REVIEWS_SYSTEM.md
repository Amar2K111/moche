# Reviews System Documentation

## Overview

The reviews system provides dynamic, verifiable social proof on the offer page. It fetches real user reviews from Firestore, displays aggregated ratings, and shows verified testimonials while maintaining privacy compliance.

## Features

✅ **Dynamic Data**: Fetches real reviews from Firestore
✅ **Privacy Compliant**: Sanitizes all user data before display
✅ **Fallback UI**: Hides section gracefully when no reviews exist
✅ **Caching**: API responses cached for 5 minutes for performance
✅ **Verified Buyers**: Displays verification badges
✅ **Security**: XSS protection and input sanitization
✅ **Responsive**: Optimized for all screen sizes

## Database Structure

### Reviews Collection

Reviews are stored in a top-level `reviews` collection in Firestore:

```
reviews/
├── {reviewId1}/
│   ├── userId: string
│   ├── rating: number (1-5)
│   ├── comment: string
│   ├── firstName: string
│   ├── location?: string (optional)
│   ├── isVerified: boolean
│   ├── isApproved: boolean
│   └── createdAt: Timestamp
├── {reviewId2}/
└── {reviewId3}/
```

### Review Document Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | string | Yes | User ID who left the review |
| `rating` | number | Yes | Rating from 1-5 stars |
| `comment` | string | Yes | Review text (max 500 chars after sanitization) |
| `firstName` | string | Yes | User's first name (sanitized) |
| `location` | string | No | User's location (city, country) |
| `isVerified` | boolean | Yes | Whether user is a verified buyer |
| `isApproved` | boolean | Yes | Moderation flag (only approved reviews shown) |
| `createdAt` | Timestamp | Yes | When review was created |

## Adding Reviews to Database

### Method 1: Firebase Console (Manual)

1. Go to Firebase Console → Firestore Database
2. Navigate to the `reviews` collection (create it if it doesn't exist)
3. Click "Add document" or "Start collection"
4. Add a review with the following structure:

```javascript
{
  userId: "user123",
  rating: 5,
  comment: "Finally, someone tells me the truth about my face! The analysis was spot on.",
  firstName: "Sarah",
  location: "New York, USA",
  isVerified: true,
  isApproved: true,
  createdAt: firebase.firestore.Timestamp.now()
}
```

### Method 2: Programmatically (Future Enhancement)

You can create an admin interface or API endpoint to add reviews:

```typescript
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

async function addReview(reviewData) {
  const reviewsRef = collection(db, 'reviews')
  await addDoc(reviewsRef, {
    ...reviewData,
    createdAt: Timestamp.now(),
    isApproved: false // Start as unapproved for moderation
  })
}
```

## How It Works

### 1. API Route (`/api/reviews/stats`)

- Queries Firestore for approved reviews
- Calculates average rating from all reviews
- Selects a featured review (4+ stars, has comment)
- Sanitizes all data before returning
- Caches response for 5 minutes
- Returns fallback data if no reviews exist

### 2. SocialProof Component

- Fetches review stats from API on mount
- Displays loading skeleton during fetch
- Shows star rating visualization
- Displays review count (formatted as "100+", "500+", etc.)
- Renders featured testimonial with attribution
- **Hides completely** if no reviews exist or on error

### 3. Data Sanitization

All user-generated content is sanitized:

- **Review text**: HTML stripped, special chars removed, length limited
- **Names**: Only first name shown, special chars removed, capitalized
- **Locations**: Special chars removed, length limited
- **Ratings**: Validated to be 1-5 range

### 4. Privacy Compliance

- Only first names shown (never full names)
- Locations are optional and sanitized
- User IDs never displayed publicly
- Review moderation via `isApproved` flag
- All data sanitized to prevent PII leakage

## Example Reviews Dataset

Here are some example reviews you can add to get started:

```javascript
// Review 1
{
  userId: "user_001",
  rating: 5,
  comment: "The brutal honesty was exactly what I needed. No sugarcoating, just real feedback that helped me improve my look.",
  firstName: "Michael",
  location: "London, UK",
  isVerified: true,
  isApproved: true,
  createdAt: firebase.firestore.Timestamp.now()
}

// Review 2
{
  userId: "user_002",
  rating: 5,
  comment: "Finally got the truth! The AI analysis was incredibly detailed and the styling tips were spot on.",
  firstName: "Emma",
  location: "Toronto, Canada",
  isVerified: true,
  isApproved: true,
  createdAt: firebase.firestore.Timestamp.now()
}

// Review 3
{
  userId: "user_003",
  rating: 4,
  comment: "Great service! The feedback was harsh but fair. Helped me understand what to work on.",
  firstName: "Alex",
  isVerified: true,
  isApproved: true,
  createdAt: firebase.firestore.Timestamp.now()
}

// Review 4
{
  userId: "user_004",
  rating: 5,
  comment: "Worth every penny. The detailed analysis gave me actionable steps to improve my appearance.",
  firstName: "Sophie",
  location: "Paris, France",
  isVerified: true,
  isApproved: true,
  createdAt: firebase.firestore.Timestamp.now()
}
```

## Display Logic

### When Reviews Exist

Shows:
- ⭐ Star rating (visual with filled/half/empty stars)
- Numeric rating (e.g., "4.8/5")
- Review count (e.g., "Based on 150+ reviews")
- Featured testimonial card with:
  - 5-star rating visualization
  - Review comment in quotes
  - Attribution (Name · Location · "Verified buyer")
  - Timestamp (e.g., "2 weeks ago")

### When No Reviews Exist

- **Entire section is hidden** (returns `null`)
- No "No reviews yet" message shown
- Graceful degradation for SEO

### During Loading

- Shows skeleton loader with animated placeholders
- Maintains layout to prevent content shift

## Security Features

### XSS Prevention

- All HTML tags stripped from user input
- Special characters (`<`, `>`, `"`, `'`) removed
- Content sanitized before rendering

### Input Validation

- Rating validated to 1-5 range
- Text length limits enforced
- Date validation for timestamps
- Type checking on all fields

### Moderation

- `isApproved` flag prevents spam/inappropriate content
- Reviews must be manually approved before showing
- Easy bulk approval via Firestore console

## Performance Optimization

- **API Caching**: 5-minute cache with stale-while-revalidate
- **Query Limits**: Only fetch last 100 reviews for stats
- **Client-side Caching**: React state prevents re-fetching
- **Lazy Loading**: Component only loads on offer page

## Testing the System

### 1. Test with No Reviews

- Start with empty `reviews` collection
- Load `/offer` page
- Verify social proof section is hidden (not shown at all)

### 2. Test with Sample Reviews

- Add 3-5 sample reviews to Firestore
- Set `isApproved: true` for all
- Reload `/offer` page
- Verify rating calculation is correct
- Verify featured review displays properly

### 3. Test Privacy/Sanitization

- Add review with HTML tags: `<script>alert('test')</script>`
- Add review with special chars: `Test "review" <test>`
- Verify all tags/chars are stripped in display

### 4. Test Caching

- Open browser DevTools → Network tab
- Load `/offer` page
- Check `/api/reviews/stats` request headers
- Verify `Cache-Control` header is present
- Reload page within 5 minutes
- Verify response served from cache

## Future Enhancements

Potential improvements:

1. **User Review Submission**: Allow verified buyers to submit reviews after purchase
2. **Review Moderation Dashboard**: Admin interface to approve/reject reviews
3. **Review Replies**: Allow business to respond to reviews
4. **Rating Breakdown**: Show distribution of 1-5 star ratings
5. **Review Filtering**: Filter by rating, date, verified status
6. **Pagination**: Support for thousands of reviews
7. **Third-party Integration**: Integrate with Trustpilot, Google Reviews, etc.
8. **Review Reminders**: Auto-email customers asking for reviews after purchase
9. **Photo Reviews**: Allow users to upload photos with reviews
10. **Helpful Votes**: Let visitors vote reviews as helpful

## Troubleshooting

### Reviews not showing

1. Check Firestore has `reviews` collection
2. Verify reviews have `isApproved: true`
3. Check browser console for API errors
4. Verify Firebase config is correct

### Wrong average rating

1. Ensure all ratings are numbers 1-5
2. Check for duplicate reviews
3. Verify `rating` field type is number (not string)

### Styling issues

1. Check Tailwind classes are compiling
2. Verify backdrop-blur is supported in browser
3. Test responsive breakpoints (sm/md/lg)

## Support

For issues or questions:
1. Check browser console for errors
2. Verify Firestore security rules allow read access
3. Test API endpoint directly: `GET /api/reviews/stats`
4. Check Firebase quota/billing limits

## Files Modified/Created

- ✅ `types/reviews.ts` - TypeScript types for reviews
- ✅ `lib/reviewUtils.ts` - Sanitization and formatting utilities  
- ✅ `app/api/reviews/stats/route.ts` - API route for review data
- ✅ `components/reviews/SocialProof.tsx` - Display component
- ✅ `app/offer/page.tsx` - Updated to use dynamic reviews
- ✅ `REVIEWS_SYSTEM.md` - This documentation file

