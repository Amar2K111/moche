# Environment Variables for Vercel Deployment

Copy these environment variables to your Vercel project settings:

## Firebase Configuration
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id_here
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
```

**⚠️ SECURITY NOTE:** 
- **NEVER commit real Firebase credentials to Git**
- For local development: Add real values to `.env.local` (gitignored)
- For production: Add to your deployment platform's environment variables
- See `env.template` for a template (copy to `.env.local`)

## Google AI (Gemini) Configuration
```
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

## Stripe Configuration
```
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## App Configuration
```
NEXT_PUBLIC_BASE_URL=https://pasmoche.com
```

## Optional: Dispute Notification Configuration
```
ADMIN_EMAIL=admin@yourdomain.com                          # For email alerts on disputes
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...    # For Slack alerts on disputes
```
> Note: These are optional. Without them, dispute notifications will only be logged and stored in Firestore.

## How to Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add each variable above with the correct values
4. Make sure to set them for "Production", "Preview", and "Development" environments
5. Click "Save" after adding each variable

## Where to Get These Values

### Firebase
- Go to [Firebase Console](https://console.firebase.google.com/)
- Select your project → Project Settings (⚙️) → General → Your apps
- Scroll to "Your apps" → Select your web app
- Copy the config values from the `firebaseConfig` object
- **⚠️ If you previously exposed Firebase keys in Git, you MUST rotate them:**
  1. In Firebase Console → Project Settings → General
  2. Under "Your apps", find your web app
  3. Click "Delete this app" or "Regenerate" to create new credentials
  4. Or create a new web app configuration with fresh credentials
  5. Update `.env.local` and deployment environment variables with the new keys

### Google AI (Gemini)
- Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
- Create a new API key

### Stripe
- Go to Stripe Dashboard → Developers → API keys
- Use live keys for production, test keys for development

### Base URL
- This will be your production domain: `https://pasmoche.com`
- For development, use: `http://localhost:3000`
