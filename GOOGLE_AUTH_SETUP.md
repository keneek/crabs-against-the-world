# 🔐 Google OAuth Setup for Crabs Against the World

## Step 1: Enable Google Auth in Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Find **Google** in the list
5. Click to expand Google settings

---

## Step 2: Create Google OAuth Credentials

### A. Go to Google Cloud Console

1. Visit: https://console.cloud.google.com
2. Sign in with your Google account
3. Create a new project or select existing one:
   - Click project dropdown at top
   - Click **"New Project"**
   - Name it: "Crabs Against the World"
   - Click **"Create"**

### B. Enable Google+ API

1. In Google Cloud Console, go to **"APIs & Services"** → **"Library"**
2. Search for: **"Google+ API"**
3. Click on it and click **"Enable"**

### C. Create OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Choose **External** (unless you have Google Workspace)
3. Click **"Create"**
4. Fill in required fields:
   - **App name:** Crabs Against the World
   - **User support email:** your-email@gmail.com
   - **Developer contact:** your-email@gmail.com
5. Click **"Save and Continue"**
6. **Scopes:** Skip this, click **"Save and Continue"**
7. **Test users:** Skip this, click **"Save and Continue"**
8. Click **"Back to Dashboard"**

### D. Create OAuth Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ Create Credentials"** → **"OAuth client ID"**
3. Choose **"Web application"**
4. Fill in:
   - **Name:** Crabs Against the World Web Client
   - **Authorized JavaScript origins:**
     ```
     http://localhost:3000
     https://crabsagainsttheworld.com
     https://your-project.vercel.app
     ```
   - **Authorized redirect URIs:**
     ```
     http://localhost:3000/auth/callback
     https://crabsagainsttheworld.com/auth/callback
     https://your-project.vercel.app/auth/callback
     https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback
     ```
     (Get your Supabase callback URL from the Google provider settings)

5. Click **"Create"**
6. Copy your **Client ID** and **Client Secret**

---

## Step 3: Configure Supabase

1. Back in **Supabase** → **Authentication** → **Providers** → **Google**
2. Toggle **"Enable Sign in with Google"** to ON
3. Paste your **Google Client ID**
4. Paste your **Google Client Secret**
5. Click **"Save"**

---

## Step 4: Update Environment Variables (if deploying)

In your Vercel dashboard, these are already handled by Supabase, but verify:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## Step 5: Test Locally

1. Make sure your dev server is running:
   ```bash
   npm run dev
   ```

2. Click **"Login for Leaderboard"**
3. Click **"Sign in with Google"**
4. You should be redirected to Google
5. After signing in, you'll be redirected back to the game!

---

## Step 6: Deploy to Production

After deploying to Vercel, make sure your redirect URIs in Google Cloud Console include:

```
https://crabsagainsttheworld.com/auth/callback
```

---

## Troubleshooting

### "redirect_uri_mismatch" error

**Problem:** The redirect URI doesn't match Google's settings

**Solution:**
1. Check the exact error message for the URI being used
2. Add that EXACT URI to Google Cloud Console → Credentials
3. Wait a few minutes for changes to propagate
4. Try again

### "Error 400: invalid_request"

**Problem:** OAuth consent screen not properly configured

**Solution:**
1. Go back to OAuth consent screen
2. Make sure all required fields are filled
3. Publish the app (change from Testing to Production if needed)

### User redirects but not logged in

**Problem:** Supabase callback not working

**Solution:**
1. Check Supabase logs: Dashboard → Logs
2. Verify your Supabase callback URL is in Google's redirect URIs
3. Check browser console for errors

### "Access blocked: This app's request is invalid"

**Problem:** Missing required scope or API not enabled

**Solution:**
1. Make sure Google+ API is enabled
2. Check OAuth consent screen has correct information
3. Try creating new OAuth credentials

---

## Security Notes

- ✅ Never commit Google Client Secret to git
- ✅ Use different OAuth credentials for dev/production
- ✅ Regularly rotate credentials
- ✅ Monitor usage in Google Cloud Console

---

## How It Works

1. User clicks "Sign in with Google"
2. Redirected to Google's OAuth page
3. User approves access
4. Google redirects to Supabase with auth code
5. Supabase exchanges code for session
6. User redirected back to your app at `/auth/callback`
7. Callback route creates/updates user in database
8. User redirected to game with credentials
9. Game starts! 🦀

---

## Testing

Test with multiple Google accounts to verify:
- ✅ First-time user creation works
- ✅ Returning user login works  
- ✅ Username displays correctly
- ✅ Scores save to leaderboard
- ✅ Logout and re-login works

---

**You're all set! 🎉**

Users can now sign in with:
- 🔵 Google Account
- 👤 Username (no password needed)

Both methods save to the same leaderboard! 🏆

