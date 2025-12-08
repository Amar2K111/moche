# Firestore Security Rules for Reviews

## Overview

This document explains the Firestore security rules needed for the reviews system.

## Security Rules

Add these rules to your Firestore security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Existing rules for users collection
    match /users/{userId} {
      // Users can read and write their own data
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Critiques subcollection
      match /critiques/{critiqueId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Reviews collection - NEW
    match /reviews/{reviewId} {
      // Anyone can read approved reviews (for public display)
      allow read: if resource.data.isApproved == true;
      
      // Only authenticated users can create reviews
      allow create: if request.auth != null
        && request.resource.data.userId == request.auth.uid
        && request.resource.data.rating is number
        && request.resource.data.rating >= 1
        && request.resource.data.rating <= 5
        && request.resource.data.comment is string
        && request.resource.data.comment.size() > 0
        && request.resource.data.comment.size() <= 500
        && request.resource.data.firstName is string
        && request.resource.data.isVerified is bool
        && request.resource.data.isApproved is bool
        && request.resource.data.createdAt is timestamp;
      
      // Users can update their own reviews (if not yet approved)
      allow update: if request.auth != null
        && resource.data.userId == request.auth.uid
        && resource.data.isApproved == false;
      
      // Users can delete their own reviews (if not yet approved)
      allow delete: if request.auth != null
        && resource.data.userId == request.auth.uid
        && resource.data.isApproved == false;
    }
  }
}
```

## Rule Explanation

### Reviews Collection Rules

#### Read Access
```javascript
allow read: if resource.data.isApproved == true;
```
- **Public can read approved reviews only**
- Unapproved reviews are hidden from public
- Used by `/api/reviews/stats` endpoint
- Prevents spam/inappropriate content from showing

#### Create Access
```javascript
allow create: if request.auth != null
  && request.resource.data.userId == request.auth.uid
  && // ... validation rules
```
- **Only authenticated users** can create reviews
- User ID must match authenticated user (prevents impersonation)
- **Rating validation**: Must be number between 1-5
- **Comment validation**: Must be string, 1-500 characters
- **Required fields**: firstName, isVerified, isApproved, createdAt
- All fields must be present and correct type

#### Update Access
```javascript
allow update: if request.auth != null
  && resource.data.userId == request.auth.uid
  && resource.data.isApproved == false;
```
- Users can **edit their own reviews**
- **Only unapproved reviews** can be edited
- Prevents editing after approval (maintains integrity)

#### Delete Access
```javascript
allow delete: if request.auth != null
  && resource.data.userId == request.auth.uid
  && resource.data.isApproved == false;
```
- Users can **delete their own reviews**
- **Only unapproved reviews** can be deleted
- Approved reviews are permanent (for consistency)

## Admin Access

For admin operations (approving reviews, moderation), you have two options:

### Option 1: Firebase Console (Manual)
- Go to Firestore Database in Firebase Console
- Navigate to `reviews` collection
- Manually set `isApproved: true` for each review
- This bypasses security rules (admin access)

### Option 2: Firebase Admin SDK (Programmatic)
- Use Firebase Admin SDK on server-side
- Admin SDK bypasses all security rules
- Example in `scripts/seedReviews.ts`
- Requires service account credentials

## Testing Security Rules

### Test 1: Public Read Approved Reviews
```javascript
// This should work (unauthenticated)
const approvedReviews = await getDocs(
  query(collection(db, 'reviews'), where('isApproved', '==', true))
)
```

### Test 2: Cannot Read Unapproved Reviews
```javascript
// This should return empty (unauthenticated)
const unapprovedReviews = await getDocs(
  query(collection(db, 'reviews'), where('isApproved', '==', false))
)
```

### Test 3: Create Review (Authenticated)
```javascript
// This should work (authenticated user)
await addDoc(collection(db, 'reviews'), {
  userId: currentUser.uid,
  rating: 5,
  comment: 'Great service!',
  firstName: 'John',
  isVerified: true,
  isApproved: false, // Starts unapproved
  createdAt: Timestamp.now()
})
```

### Test 4: Cannot Create Review for Someone Else
```javascript
// This should FAIL (userId doesn't match auth)
await addDoc(collection(db, 'reviews'), {
  userId: 'different-user-id', // ❌ Doesn't match auth
  rating: 5,
  // ... rest of fields
})
```

## Deployment Steps

1. **Open Firebase Console**
   - Go to https://console.firebase.google.com
   - Select your project

2. **Navigate to Firestore Database**
   - Click "Firestore Database" in left menu
   - Click "Rules" tab at top

3. **Update Rules**
   - Copy the rules from this document
   - Paste into the rules editor
   - Click "Publish" to deploy

4. **Test Rules**
   - Click "Rules Playground" tab
   - Test read/write operations
   - Verify security is working correctly

## Security Best Practices

### ✅ DO
- Always validate data types and ranges
- Require authentication for sensitive operations
- Use moderation flags (`isApproved`)
- Limit field sizes to prevent abuse
- Sanitize data on client and server
- Use server-side validation in addition to rules

### ❌ DON'T
- Allow public write access to reviews
- Trust client-side validation alone
- Allow unlimited field sizes
- Skip moderation for user-generated content
- Store sensitive PII in reviews

## Monitoring

### Set Up Alerts
1. Firebase Console → Firestore → Usage tab
2. Monitor for:
   - Unusual read/write spikes
   - Security rule violations
   - Failed authentication attempts

### Regular Audits
- Review approved content monthly
- Check for spam or inappropriate reviews
- Monitor user complaints
- Update rules as needed

## Troubleshooting

### "Missing or insufficient permissions" Error

**Cause**: Security rules blocking the operation

**Solutions**:
1. Verify user is authenticated
2. Check `userId` matches `auth.uid`
3. Ensure all required fields are present
4. Verify field types match rules
5. Check review is not already approved (for updates/deletes)

### Reviews Not Showing on Offer Page

**Cause**: Reviews not approved or security rules too restrictive

**Solutions**:
1. Check `isApproved: true` for reviews in Firestore
2. Verify security rules allow reading approved reviews
3. Check browser console for permission errors
4. Test API endpoint directly: `/api/reviews/stats`

### Cannot Create Review

**Cause**: Validation rules failing or missing fields

**Solutions**:
1. Ensure user is authenticated
2. Check all required fields are present:
   - `userId`, `rating`, `comment`, `firstName`
   - `isVerified`, `isApproved`, `createdAt`
3. Verify rating is 1-5
4. Verify comment is 1-500 characters
5. Check field types match rules (number, string, bool, timestamp)

## Related Files

- `types/reviews.ts` - TypeScript types
- `lib/reviewUtils.ts` - Sanitization utilities
- `app/api/reviews/stats/route.ts` - API endpoint
- `components/reviews/SocialProof.tsx` - Display component
- `REVIEWS_SYSTEM.md` - Full system documentation

## Support

For security rule issues:
1. Check Firebase Console → Firestore → Rules → Playground
2. Test specific operations
3. Review error messages in browser console
4. Verify authentication state
5. Check Firestore usage logs

