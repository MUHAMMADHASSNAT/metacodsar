# 🚀 Vercel Deployment Setup Guide

## 📋 Complete Setup Steps

### Step 1: Server Project Setup

1. **Vercel Dashboard → Server Project → Settings → Environment Variables**

   Add these variables:
   
   ```
   MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/database
   JWT_SECRET = your-secret-key-here
   FRONTEND_URL = https://your-client-project.vercel.app
   NODE_ENV = production
   ```

2. **Deploy Server Project**
   - Push to GitHub
   - Vercel automatically deploys
   - Note the server URL (e.g., `https://metacodsar-api.vercel.app`)

### Step 2: Client Project Setup

1. **Vercel Dashboard → Client Project → Settings → Environment Variables**

   Add this variable:
   
   ```
   VITE_API_URL = https://your-server-project.vercel.app
   ```
   
   **Important:** Replace `your-server-project.vercel.app` with your actual server URL from Step 1.

2. **Redeploy Client Project**
   - Go to Deployments tab
   - Click "Redeploy" on latest deployment
   - Or push new code to trigger redeploy

### Step 3: Verify Setup

1. **Check Server URL:**
   - Go to Server Project → Overview
   - Copy the deployment URL
   - It should be something like: `https://metacodsar-h3a4.vercel.app`

2. **Check Client URL:**
   - Go to Client Project → Overview  
   - Copy the deployment URL
   - It should be something like: `https://metacodsar.vercel.app`

3. **Set Environment Variables:**
   - **Server Project:** `FRONTEND_URL` = Client URL
   - **Client Project:** `VITE_API_URL` = Server URL

## 🔍 Troubleshooting

### Issue: "Server Connection Failed"

**Solution:**
1. Check browser console (F12) for detailed error messages
2. Verify `VITE_API_URL` is set in Client Project
3. Verify server URL is correct (no trailing slash)
4. Check server is deployed and running
5. Redeploy both projects after setting environment variables

### Issue: "Invalid Credentials"

**Solution:**
- Admin user is auto-created on first server startup
- Credentials: `admin@metacodsar.com` / `password`
- If still not working, check server logs in Vercel

### Issue: CORS Errors

**Solution:**
- Verify `FRONTEND_URL` is set in Server Project
- Make sure it matches your client URL exactly
- No trailing slash in URL

## 📝 Quick Checklist

- [ ] Server Project: `MONGODB_URI` set
- [ ] Server Project: `JWT_SECRET` set  
- [ ] Server Project: `FRONTEND_URL` set (Client URL)
- [ ] Client Project: `VITE_API_URL` set (Server URL)
- [ ] Both projects redeployed after setting variables
- [ ] Server URL is accessible (check in browser)
- [ ] Client URL is accessible (check in browser)

## 🎯 Example Configuration

**Server Project:**
```
MONGODB_URI = mongodb+srv://metacodsar:password@cluster.mongodb.net/metacodsar
JWT_SECRET = my-secret-key-12345
FRONTEND_URL = https://metacodsar.vercel.app
```

**Client Project:**
```
VITE_API_URL = https://metacodsar-h3a4.vercel.app
```

## 💡 Tips

1. **Environment Variables:**
   - Always set for "Production" environment
   - Or use "All Environments" for both dev and prod

2. **Redeploy:**
   - After changing environment variables, redeploy is required
   - Vercel may auto-redeploy, but manual redeploy is safer

3. **URL Format:**
   - No trailing slash: ✅ `https://example.com`
   - With trailing slash: ❌ `https://example.com/`

4. **Testing:**
   - Use browser console (F12) to see detailed logs
   - Check Network tab to see API requests
   - Verify server health: `https://your-server-url/api/health`

