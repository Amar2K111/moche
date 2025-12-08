# Secure Firestore Rules for Production

## 🔒 **Production-Ready Firestore Rules**

Replace your current Firestore rules with these secure rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Allow users to update their onboarding status
      allow update: if request.auth != null && 
        request.auth.uid == userId && 
        request.resource.data.keys().hasAll(['onboarding']) &&
        request.resource.data.onboarding is bool;
    }
    
    // Allow users to read/write their own critiques
    match /users/{userId}/critiques/{critiqueId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow users to read their own payment records
    match /users/{userId}/payments/{paymentId} {
      allow read: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow admin (webhook) to read/write user data and payment records
    match /{document=**} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## 🛡️ **What These Rules Do**

1. **User Data Protection**: Users can only access their own data
2. **Admin Access**: Webhook with admin token can access all data
3. **Payment Records**: Users can read their own payment history, admin can create payment records
4. **Critiques**: Users can only access their own critiques

## 📋 **Setup Steps**

1. **Generate Service Account Key** (see instructions below)
2. **Add to Vercel Environment Variables**
3. **Update Firestore Rules** with the rules above
4. **Test the webhook** to ensure it still works

## 🔑 **Service Account Setup**

### Step 1: Generate Service Account Key
1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Download the JSON file
4. Copy the entire JSON content

### Step 2: Add to Vercel
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add new variable:
   - **Name**: `FIREBASE_SERVICE_ACCOUNT_KEY`
   - **Value**: Paste the entire JSON content
   - **Environment**: Production, Preview, Development

### Step 3: Update Rules
1. Go to Firebase Console → Firestore Database → Rules
2. Replace current rules with the secure rules above
3. Click "Publish"

## ✅ **Benefits**

- **Secure**: Only authenticated users and admin can access data
- **Scalable**: Works with Firebase Admin SDK
- **Production-Ready**: Proper security for live applications
- **Maintainable**: Clear separation of user and admin access
