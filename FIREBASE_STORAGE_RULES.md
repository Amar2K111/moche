# Firebase Storage Security Rules

## Overview

This document explains the Firebase Storage security rules needed for image uploads and access.

## Security Rules

Add these rules to your Firebase Storage security rules in Firebase Console:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Images uploaded by users
    match /images/{userId}/{imageId} {
      // Allow authenticated users to upload their own images
      allow write: if request.auth != null && request.auth.uid == userId;
      
      // Allow authenticated users to read their own images
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Allow public read access for images (needed for displaying in UI)
      allow read: if true;
    }
    
    // PDFs generated for users
    match /pdfs/{userId}/{pdfId} {
      // Allow authenticated users to read their own PDFs
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Server-side only writes (via Admin SDK)
      allow write: if false;
    }
  }
}
```

## Rule Explanation

### Images Path: `/images/{userId}/{imageId}`

#### Write Access
```javascript
allow write: if request.auth != null && request.auth.uid == userId;
```
- **Only authenticated users** can upload images
- Users can only upload to their own folder (`userId` must match `auth.uid`)
- Prevents users from uploading to other users' folders

#### Read Access
```javascript
allow read: if request.auth != null && request.auth.uid == userId;
allow read: if true;
```
- **Authenticated users** can read their own images
- **Public read access** allows images to be displayed in the UI
- This is necessary because images are displayed in the browser

### PDFs Path: `/pdfs/{userId}/{pdfId}`

#### Read Access
```javascript
allow read: if request.auth != null && request.auth.uid == userId;
```
- Users can only read their own PDFs
- Prevents unauthorized access to other users' PDFs

#### Write Access
```javascript
allow write: if false;
```
- **No client-side writes** allowed
- PDFs are only created server-side using Firebase Admin SDK
- This ensures security and prevents abuse

## Deployment Steps

1. **Open Firebase Console**
   - Go to https://console.firebase.google.com
   - Select your project

2. **Navigate to Storage**
   - Click "Storage" in left menu
   - Click "Rules" tab at top

3. **Update Rules**
   - Copy the rules from this document
   - Paste into the rules editor
   - Click "Publish" to deploy

4. **Test Rules**
   - Click "Rules Playground" tab
   - Test read/write operations
   - Verify security is working correctly

## Troubleshooting

### Images Not Loading in Production

**Possible Causes:**
1. Storage rules not allowing public read access
2. CORS issues with Firebase Storage
3. Images not uploaded to Storage (still using base64)

**Solutions:**
1. Verify storage rules allow public read for images
2. Check Firebase Console → Storage → Rules
3. Ensure images are uploaded to Storage (not stored as base64 in Firestore)
4. Check browser console for CORS or permission errors

### "Permission denied" Error

**Cause**: Storage rules blocking the operation

**Solutions:**
1. Verify user is authenticated
2. Check `userId` matches `auth.uid` in storage path
3. Ensure storage rules allow the operation
4. Test in Firebase Console → Storage → Rules Playground

### Images Not Uploading

**Cause**: Write permissions not configured correctly

**Solutions:**
1. Ensure user is authenticated
2. Verify storage rules allow write for authenticated users
3. Check storage path matches user's UID
4. Verify Firebase Storage is enabled in project

## Security Best Practices

### ✅ DO
- Use user-specific folders (`/images/{userId}/`)
- Require authentication for uploads
- Validate file types and sizes on client and server
- Use public read access only for images (not sensitive data)
- Restrict PDF access to owners only

### ❌ DON'T
- Allow public write access
- Store sensitive data in publicly readable locations
- Skip authentication checks
- Allow unlimited file sizes
- Trust client-side validation alone

## Related Files

- `hooks/useFaceCritique.ts` - Image upload logic
- `lib/firebase.ts` - Firebase Storage initialization
- `app/api/generate-pdf/route.ts` - PDF generation (uses Admin SDK)


