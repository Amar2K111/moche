# Firebase Key Rotation Guide

## ⚠️ IMMEDIATE ACTION REQUIRED

Your Firebase credentials were previously exposed in the codebase and need to be rotated immediately.

## Why Rotate Keys?

When Firebase credentials are committed to Git (even if later removed), they remain in Git history and should be considered compromised. Anyone with access to the repository history can extract these keys.

## Step-by-Step Key Rotation Process

### Step 1: Access Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **moche-a61ee**
3. Click the ⚙️ (Settings) icon → **Project Settings**

### Step 2: Create New Web App Configuration

**Option A: Create a New Web App (Recommended)**
1. In Project Settings, scroll to "Your apps" section
2. Click **"Add app"** → Select **Web** (</> icon)
3. Register app with a nickname like: "Moche Web App - New"
4. Copy the new `firebaseConfig` object that appears
5. **Save these values immediately** - you'll need them in Step 4

**Option B: Delete and Recreate Existing App**
1. In Project Settings → "Your apps" section
2. Find your existing web app
3. Click the app → Settings
4. Scroll down and click **"Delete this app"**
5. Confirm deletion
6. Click **"Add app"** → Select **Web**
7. Register new app with same or new nickname
8. Copy the new `firebaseConfig` object

### Step 3: Update Security Rules (If Needed)

If your Firestore security rules reference specific app IDs, update them:

1. Go to **Firestore Database** → **Rules** tab
2. Review rules for any hardcoded App IDs
3. Update if necessary (usually not required)
4. Click **Publish**

### Step 4: Update Environment Variables

#### A. Local Development (.env.local)

1. In your project root, create or update `.env.local`:
   ```bash
   # Copy from env.template
   cp env.template .env.local
   ```

2. Update with your NEW Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_NEW_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=moche-a61ee.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=moche-a61ee
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=moche-a61ee.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_NEW_sender_id_here
   NEXT_PUBLIC_FIREBASE_APP_ID=your_NEW_app_id_here
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_NEW_measurement_id_here
   ```

3. Verify `.env.local` is in `.gitignore` (✓ already configured)

#### B. Production Deployment (Vercel)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Update each Firebase variable with NEW values:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
5. Ensure they're set for all environments: Production, Preview, Development
6. Click **Save** for each variable

#### C. Other Deployment Platforms

If deploying elsewhere (Netlify, Railway, etc.), update environment variables in their respective dashboards.

### Step 5: Redeploy Application

1. **Local Testing:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Verify the app starts without errors and Firebase connections work

2. **Production Deployment:**
   - Vercel: Redeploy automatically triggers after env var updates
   - Other platforms: Trigger a new deployment manually

### Step 6: Verify Everything Works

Test critical Firebase functionality:
- [ ] User authentication (sign in/sign up)
- [ ] Google OAuth login
- [ ] Firestore read/write operations
- [ ] Analytics (if used)
- [ ] Storage operations (if used)

### Step 7: Clean Up Old Configuration (Optional)

If you created a NEW web app and want to remove the old one:

1. Go to Firebase Console → Project Settings → Your apps
2. Find the OLD web app
3. Click Settings → **Delete this app**
4. Confirm deletion

**⚠️ WARNING:** Only delete the old app AFTER confirming the new configuration works in production!

## Security Best Practices Going Forward

### ✅ DO
- ✅ Keep all credentials in `.env.local` (gitignored)
- ✅ Use environment variables in deployment platforms
- ✅ Review what's being committed before pushing
- ✅ Use `env.template` as a template for new developers
- ✅ Rotate keys immediately if accidentally committed

### ❌ DON'T
- ❌ Never commit `.env.local` or `.env` files
- ❌ Never hardcode credentials in source code
- ❌ Never share credentials in Slack, email, or documentation
- ❌ Never commit real API keys to version control

## Verification Checklist

Before considering rotation complete:

- [ ] New Firebase web app created in console
- [ ] New credentials copied and saved securely
- [ ] `.env.local` updated with new credentials
- [ ] Vercel (or deployment platform) environment variables updated
- [ ] Application deployed successfully
- [ ] Firebase authentication tested and working
- [ ] Firestore operations tested and working
- [ ] Old web app deleted (optional, after confirming new one works)
- [ ] Git history cleaned (optional, advanced - see below)

## Optional: Clean Git History (Advanced)

If you want to remove the exposed credentials from Git history entirely:

**⚠️ WARNING:** This is destructive and requires force-pushing. Coordinate with your team first!

```bash
# Use git-filter-repo (recommended) or BFG Repo-Cleaner
# See: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository

# After cleaning:
git push origin --force --all
```

**Note:** If your repository is public or was public at any time, assume the credentials are permanently compromised and rotation is the only solution.

## Questions or Issues?

If you encounter problems during rotation:
1. Check Firebase Console logs for authentication errors
2. Verify all environment variables are set correctly
3. Check browser console for specific error messages
4. Ensure `.env.local` is not being cached (restart dev server)

## Timeline

- **Immediate (Today):** Complete Steps 1-4
- **Within 24 hours:** Complete Steps 5-7 and verify production
- **Within 1 week:** Delete old Firebase web app configuration

---

**Last Updated:** October 15, 2025

