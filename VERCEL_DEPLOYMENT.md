# Vercel Deployment Guide

This guide will help you deploy your hand critique application to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Firebase Project**: Set up and configured (see FIREBASE_SETUP.md)
4. **Stripe Account**: Set up and configured (see STRIPE_SETUP.md)
5. **Google AI API Key**: For Gemini AI integration

## Step 1: Prepare Your Repository

1. **Commit all changes** to your GitHub repository:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Verify your build** works locally:
   ```bash
   npm run build
   ```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure the project**:
   - Framework Preset: `Next.js`
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
5. **Click "Deploy"**

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

## Step 3: Configure Environment Variables

After deployment, you need to add environment variables in the Vercel dashboard:

### Required Environment Variables

1. **Go to your project dashboard** in Vercel
2. **Click "Settings"** → **"Environment Variables"**
3. **Add the following variables**:

#### Firebase Configuration
```
NEXT_PUBLIC_FIREBASE_API_KEY = your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID = your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID = your_measurement_id
```

#### Google AI (Gemini) Configuration
```
NEXT_PUBLIC_GEMINI_API_KEY = your_gemini_api_key
```

#### Stripe Configuration
```
STRIPE_SECRET_KEY = sk_live_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET = whsec_your_webhook_secret
```

#### App Configuration
```
NEXT_PUBLIC_BASE_URL = https://your-app-name.vercel.app
```

### Environment Variable Sources

- **Firebase**: Get from Firebase Console → Project Settings → General → Your apps
- **Gemini**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Stripe**: Get from Stripe Dashboard → Developers → API keys
- **Base URL**: Your Vercel deployment URL

## Step 4: Update Firebase Configuration

1. **Go to Firebase Console** → **Authentication** → **Settings** → **Authorized domains**
2. **Add your Vercel domain**: `your-app-name.vercel.app`
3. **Update Firestore rules** if needed for production

## Step 5: Update Stripe Webhooks

1. **Go to Stripe Dashboard** → **Developers** → **Webhooks**
2. **Update webhook endpoint** to: `https://your-app-name.vercel.app/api/webhook/stripe`
3. **Select events**: `checkout.session.completed`
4. **Copy the webhook secret** and add it to Vercel environment variables

## Step 6: Redeploy

After adding environment variables:

1. **Go to Vercel dashboard** → **Deployments**
2. **Click "Redeploy"** on the latest deployment
3. **Or trigger a new deployment** by pushing to your repository

## Step 7: Test Your Deployment

1. **Visit your deployed URL**
2. **Test user registration/login**
3. **Test image upload and critique generation**
4. **Test payment flow** (use Stripe test mode first)
5. **Check Firebase Console** for new users and data

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check that all dependencies are in `package.json`
   - Verify TypeScript compilation
   - Check for missing environment variables

2. **Runtime Errors**:
   - Verify all environment variables are set
   - Check browser console for errors
   - Check Vercel function logs

3. **Firebase Issues**:
   - Ensure authorized domains include your Vercel URL
   - Check Firestore rules
   - Verify API keys are correct

4. **Stripe Issues**:
   - Verify webhook URL is correct
   - Check webhook secret
   - Ensure using correct API keys (test vs live)

### Getting Help

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Deployment**: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- **Check Vercel Function Logs**: Project Dashboard → Functions tab

## Production Checklist

- [ ] All environment variables configured
- [ ] Firebase authorized domains updated
- [ ] Stripe webhooks configured
- [ ] Test user registration/login
- [ ] Test image upload and critique
- [ ] Test payment flow
- [ ] Switch to Stripe live keys (when ready)
- [ ] Set up custom domain (optional)
- [ ] Configure analytics (optional)

## Custom Domain (Optional)

1. **Go to Vercel Dashboard** → **Settings** → **Domains**
2. **Add your custom domain**
3. **Update DNS records** as instructed
4. **Update environment variables** with new domain
5. **Update Firebase authorized domains**
6. **Update Stripe webhook URL**

Your hand critique application should now be successfully deployed on Vercel! 🚀
