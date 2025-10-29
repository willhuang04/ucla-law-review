# Clerk Webhook Setup Guide

## 🎯 Goal
Automatically add new users to your UCLA Undergrad Law Review organization when they sign up.

## 📋 Prerequisites
1. **Clerk Secret Key** - Get this from your Clerk Dashboard → API Keys
2. **Organization ID**: `org_34hyYshzU1Eo2wq6H4Q1uJmi36p` (already configured)

## 🚀 Steps to Set Up

### 1. Deploy the Webhook
You have a webhook handler in `/api/webhooks/clerk.ts`. Deploy this to:

**Option A: Vercel (Recommended)**
- Push your code to GitHub
- Connect to Vercel
- Deploy
- Your webhook URL will be: `https://your-app.vercel.app/api/webhooks/clerk`

**Option B: Netlify**
- Deploy to Netlify
- Enable Netlify Functions
- Your webhook URL will be: `https://your-app.netlify.app/api/webhooks/clerk`

### 2. Configure Environment Variables
Add to your deployment environment:
```
CLERK_SECRET_KEY=sk_live_... (or sk_test_... for development)
```

### 3. Set Up Webhook in Clerk Dashboard
1. Go to **Clerk Dashboard** → **Webhooks**
2. Click **"Add Endpoint"**
3. **Endpoint URL**: `https://your-deployed-app.com/api/webhooks/clerk`
4. **Events to listen for**: Select `user.created`
5. **Save**

### 4. Test the Setup
1. Create a new user account on your app
2. Check the webhook logs in your deployment platform
3. Verify the user appears in your UCLA organization

## 🔧 Troubleshooting

**If users aren't being added automatically:**
1. Check webhook logs in your deployment platform
2. Verify `CLERK_SECRET_KEY` is set correctly
3. Make sure the webhook URL is accessible
4. Check Clerk Dashboard webhook status

**Alternative: Manual Invite**
If webhooks are complex for now, you can manually invite users:
1. Clerk Dashboard → Organizations → UCLA Undergrad Law Review
2. Click "Invite Members"
3. Add user emails

## 🎉 Result
New users will be automatically added to your UCLA organization after signup - no more manual org creation!