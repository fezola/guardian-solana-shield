# 🔧 Supabase Setup Guide - Fix Login/Signup Issues

## 🚨 **Current Issue**
The Supabase configuration is pointing to an incorrect project URL, causing login/signup failures.

## 📋 **Step-by-Step Fix**

### 1. **Get Your Correct Supabase Project Details**

1. Go to [supabase.com](https://supabase.com) and log in
2. Find your **"SDK"** project in the dashboard
3. Click on your project to open it
4. Go to **Settings** → **API** (in the left sidebar)
5. Copy these two values:
   - **Project URL** (looks like: `https://abcdefghijk.supabase.co`)
   - **anon public** key (long JWT token starting with `eyJ...`)

### 2. **Update Configuration Files**

#### A. Update `src/integrations/supabase/client.ts`
Replace the placeholder values with your actual project details:

```typescript
const SUPABASE_URL = "https://YOUR_ACTUAL_PROJECT_ID.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "YOUR_ACTUAL_ANON_PUBLIC_KEY";
```

#### B. Update `supabase/config.toml`
Replace with your actual project ID:

```toml
project_id = "YOUR_ACTUAL_PROJECT_ID"
```

### 3. **Run Database Migrations**

After updating the configuration, run the migrations to set up your database:

```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_ACTUAL_PROJECT_ID

# Push the database schema
supabase db push
```

### 4. **Verify Setup**

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Try to sign up/login - the errors should be resolved

3. Check that API keys can be generated in the documentation

## 🔍 **How to Find Your Project ID**

Your project ID is the subdomain in your Supabase URL:
- If your URL is `https://abcdefghijk.supabase.co`
- Then your project ID is `abcdefghijk`

## 🛠️ **Alternative: Create New Project**

If you can't find your "SDK" project or it doesn't exist:

1. Go to [supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Name it **"SDK"** or **"GuardianLayer"**
4. Choose your organization and region
5. Set a strong database password
6. Wait for the project to be created
7. Follow steps 1-4 above with the new project details

## 🚨 **Security Note**

- The **anon public** key is safe to use in client-side code
- Never use the **service_role** key in client-side code
- The **service_role** key should only be used in server-side code or edge functions

## ✅ **Expected Result**

After fixing the configuration:
- ✅ Login/signup will work
- ✅ API key generation will work
- ✅ All documentation features will be functional
- ✅ Recovery configuration will save to database
- ✅ Playground will connect to real APIs

## 🆘 **If You Still Have Issues**

1. **Check browser console** for any remaining errors
2. **Verify project exists** in your Supabase dashboard
3. **Confirm database is active** (not paused)
4. **Check API keys** are copied correctly (no extra spaces)
5. **Try incognito mode** to rule out browser cache issues

## 📞 **Need Help?**

If you're still having trouble:
1. Share your actual Supabase project URL (it's safe to share)
2. Confirm which project in your dashboard you want to use
3. Check if the project has any restrictions or is paused

Once this is fixed, all the production-ready features we implemented will work perfectly! 🚀
