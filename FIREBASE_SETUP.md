# Firebase Setup Guide

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter your project name and follow the setup wizard

## 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" authentication
5. **Enable "Google" authentication:**
   - Click on "Google" in the sign-in providers list
   - Click "Enable"
   - Add your authorized domain (localhost for development)
   - Click "Save"

## 3. Create Firestore Database

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location for your database

## 4. Get Configuration

1. Click the gear icon next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web app icon (</>) to add a web app
5. Register your app and copy the config object

## 5. Environment Variables

Create a `.env.local` file in your project root with:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

## 6. Firestore Rules

Update your Firestore rules to allow authenticated users to read/write their own data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write their own critiques
    match /critiques/{critiqueId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

**Important:** Make sure to update these rules in your Firebase Console:
1. Go to Firebase Console → Firestore Database → Rules
2. Replace the existing rules with the rules above
3. Click "Publish" to apply the changes

## 7. Test the Setup

1. Run `npm run dev`
2. Try to sign up with a new account using email/password
3. Try to sign in with Google
4. You should be redirected to onboarding for new users
5. Check Firebase Console to see the new user and document

## 8. Google Sign-In Notes

- Google sign-in uses popup authentication
- Users may need to allow pop-ups for your domain
- New Google users will automatically have a user document created
- The `provider` field will be set to "google" for Google users

## 9. Production Deployment (Vercel)

### Update Authorized Domains

1. Go to Firebase Console → Authentication → Settings
2. In "Authorized domains" section, add your Vercel domain:
   - `your-app-name.vercel.app`
   - If using custom domain: `your-custom-domain.com`

### Update Firestore Rules for Production

For production, you may want to tighten security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write their own critiques
    match /critiques/{critiqueId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Prevent unauthorized access to other collections
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Environment Variables for Production

Make sure to set these in your Vercel project settings:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
