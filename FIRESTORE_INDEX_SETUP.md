# Firestore Index Setup Guide

## Problem
The `/api/reviews/stats` endpoint returns a 500 error because Firestore requires a composite index for queries that combine `where()` and `orderBy()` clauses on different fields.

## Required Index

The reviews stats API needs the following composite index:

**Collection:** `reviews`
**Fields:**
- `isApproved` (Ascending)
- `createdAt` (Descending)

## Setup Methods

### Method 1: Using the Firebase Console (Recommended)

1. **Go to Firebase Console:**
   - Visit https://console.firebase.google.com/
   - Select your project: `moche-a61ee`

2. **Navigate to Firestore Database:**
   - Click on "Firestore Database" in the left sidebar
   - Click on the "Indexes" tab

3. **Create Composite Index:**
   - Click "Create Index"
   - Collection ID: `reviews`
   - Add fields:
     - Field 1: `isApproved` → Mode: `Ascending`
     - Field 2: `createdAt` → Mode: `Descending`
   - Query scope: `Collection`
   - Click "Create Index"

4. **Wait for Index to Build:**
   - The index will take a few minutes to build
   - Status will change from "Building" to "Enabled"
   - Once enabled, the API will work correctly

### Method 2: Using the Firebase CLI

1. **Install Firebase CLI (if not installed):**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**
   ```bash
   firebase login
   ```

3. **Create `firestore.indexes.json` file:**
   Create a file in your project root with the following content:
   ```json
   {
     "indexes": [
       {
         "collectionGroup": "reviews",
         "queryScope": "COLLECTION",
         "fields": [
           {
             "fieldPath": "isApproved",
             "order": "ASCENDING"
           },
           {
             "fieldPath": "createdAt",
             "order": "DESCENDING"
           }
         ]
       }
     ],
     "fieldOverrides": []
   }
   ```

4. **Deploy the index:**
   ```bash
   firebase deploy --only firestore:indexes
   ```

### Method 3: Using the Error Link

1. **Trigger the error in development:**
   - Run your app and navigate to a page that uses the `SocialProof` component
   - Check the browser console and server logs

2. **Look for the index URL:**
   - Firestore errors often include a direct link to create the required index
   - The error message will contain a URL like:
     ```
     https://console.firebase.google.com/v1/r/project/moche-a61ee/firestore/indexes?create_composite=...
     ```
   - Click this link to automatically create the index

## Verification

After creating the index, verify it works:

1. **Check Index Status:**
   - Go to Firebase Console → Firestore Database → Indexes
   - Ensure the index status shows "Enabled"

2. **Test the API:**
   - Visit your app and check if the reviews load correctly
   - Open browser console - there should be no 500 errors
   - The `SocialProof` component should display review statistics

3. **Check Server Logs:**
   - No error messages about missing indexes
   - Successful API responses with status 200

## Alternative Solution: Simplified Query

If you don't want to create an index, you can modify the query to not use `orderBy`:

```typescript
// In app/api/reviews/stats/route.ts
const q = query(
  reviewsRef,
  where('isApproved', '==', true),
  limit(100)
)

const querySnapshot = await getDocs(q)

// Sort manually after fetching
const reviews: Review[] = []
querySnapshot.forEach((doc) => {
  // ... existing code
})

// Sort reviews by createdAt in JavaScript
reviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
```

**Note:** This approach is less efficient and should only be used temporarily or for small datasets.

## Troubleshooting

### Error persists after creating index
- Wait 5-10 minutes for the index to fully build
- Clear your browser cache
- Restart your development server
- Check that the index fields and order match exactly

### Index creation fails
- Verify you have Owner/Editor permissions in Firebase
- Check that the collection name is correct (`reviews`)
- Ensure field names match your data structure

### Performance issues
- The index should handle up to millions of documents efficiently
- Monitor index usage in Firebase Console
- Consider adding pagination for very large datasets

## Related Files

- API Route: `app/api/reviews/stats/route.ts`
- Component: `components/reviews/SocialProof.tsx`
- Types: `types/reviews.ts`
- Utils: `lib/reviewUtils.ts`

## Additional Resources

- [Firestore Indexes Documentation](https://firebase.google.com/docs/firestore/query-data/indexing)
- [Composite Index Limits](https://firebase.google.com/docs/firestore/quotas#indexes)
- [Index Best Practices](https://firebase.google.com/docs/firestore/best-practices)

