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

### Issue: "Client aur Server Connect Nahi Ho Rahay" (Client and Server Not Connecting)

**Ye sabse common problem hai! Isko step-by-step fix karein:**

#### Step 1: Environment Variable Check Karo

1. **Client Project mein `VITE_API_URL` check karo:**
   - Vercel Dashboard → Client Project → Settings → Environment Variables
   - Variable name exactly `VITE_API_URL` hona chahiye (typo nahi)
   - Value mein server URL hona chahiye: `https://your-server.vercel.app`
   - **IMPORTANT:** Trailing slash (`/`) nahi hona chahiye
   - Environment "Production" ya "All Environments" select karo

2. **Server Project mein `FRONTEND_URL` check karo:**
   - Vercel Dashboard → Server Project → Settings → Environment Variables
   - Variable name: `FRONTEND_URL`
   - Value: Client URL (e.g., `https://your-client.vercel.app`)
   - Trailing slash nahi hona chahiye

#### Step 2: Redeploy Zaroori Hai!

**⚠️ IMPORTANT:** Environment variable add karne ke baad **HAMESHA redeploy karo!**

1. **Client Project Redeploy:**
   - Deployments tab → Latest deployment → "Redeploy" button
   - Ya naya commit push karo

2. **Server Project Redeploy:**
   - Same process - Redeploy karo

#### Step 3: Browser Console Check Karo

1. Browser mein F12 press karo (Developer Tools)
2. Console tab mein dekho:
   - `✅ Using VITE_API_URL: https://...` dikhna chahiye
   - Agar `⚠️ VITE_API_URL environment variable is missing!` dikhe, to variable set nahi hua
3. Network tab mein API requests check karo:
   - Request URL sahi hai ya nahi?
   - CORS error aa raha hai?

#### Step 4: Server Health Check

Browser mein ye URL open karo:
```
https://your-server-url.vercel.app/api/health
```

Agar response aaye:
```json
{"status":"OK","message":"MetaCodsar API is running",...}
```
To server theek kaam kar raha hai!

#### Step 5: Common Mistakes

- ❌ **Wrong:** `VITE_API_URL = https://server.vercel.app/` (trailing slash)
- ✅ **Correct:** `VITE_API_URL = https://server.vercel.app`

- ❌ **Wrong:** Variable name typo (`VITE_API_UR` instead of `VITE_API_URL`)
- ✅ **Correct:** `VITE_API_URL` exactly

- ❌ **Wrong:** Environment variable set kiya but redeploy nahi kiya
- ✅ **Correct:** Variable set karne ke baad redeploy karo

- ❌ **Wrong:** Development environment mein variable set kiya (Production mein nahi)
- ✅ **Correct:** "All Environments" ya "Production" select karo

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

## 🎯 Example Configuration (Actual URLs)

**Server Project (Backend - https://metacodsar-2vf1.vercel.app):**
```
MONGODB_URI = mongodb+srv://metacodsar:password@cluster.mongodb.net/metacodsar
JWT_SECRET = my-secret-key-12345
FRONTEND_URL = https://metacodsar-h3a4.vercel.app
NODE_ENV = production
```

**Client Project (Frontend - https://metacodsar-h3a4.vercel.app):**
```
VITE_API_URL = https://metacodsar-2vf1.vercel.app
```

**⚠️ Important:** 
- Server URL: `https://metacodsar-2vf1.vercel.app` (no trailing slash)
- Client URL: `https://metacodsar-h3a4.vercel.app` (no trailing slash)

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

## 🔧 Quick Diagnostic Steps

Agar aapka client aur server connect nahi ho raha, ye steps follow karo:

### Step 1: Browser Console Check (F12)
1. Browser mein F12 press karo
2. Console tab mein dekho kya messages aa rahe hain:
   - ✅ `✅ Using VITE_API_URL: https://...` → Variable sahi set hai
   - ⚠️ `⚠️ VITE_API_URL environment variable is missing!` → Variable set nahi hai ya redeploy nahi hua

### Step 2: Network Tab Check
1. Network tab open karo
2. Koi API request try karo (e.g., login)
3. Failed request par click karo
4. Dekho:
   - **Request URL:** Kya sahi server URL hai?
   - **Status:** CORS error (403/404) ya network error?
   - **Response:** Kya error message hai?

### Step 3: Server Health Check
Browser mein directly server URL open karo:
```
https://your-server-url.vercel.app/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "MetaCodsar API is running",
  "timestamp": "...",
  "environment": "production"
}
```

Agar ye response nahi aata, to server deploy nahi hua ya issue hai.

### Step 4: Vercel Environment Variables Verify
1. **Client Project:**
   - Settings → Environment Variables
   - Check: `VITE_API_URL` exists
   - Value: Server URL (no trailing slash)
   - Environment: Production ya All Environments

2. **Server Project:**
   - Settings → Environment Variables  
   - Check: `FRONTEND_URL` exists
   - Value: Client URL (no trailing slash)
   - Environment: Production ya All Environments

### Step 5: Redeploy Dono Projects
**⚠️ IMPORTANT:** Environment variables change karne ke baad redeploy zaroori hai!

1. Client Project → Deployments → Latest → Redeploy
2. Server Project → Deployments → Latest → Redeploy

### Step 6: Vercel Logs Check Karo
1. Server Project → Deployments → Latest deployment → Logs
2. Dekho kya errors aa rahe hain:
   - MongoDB connection error?
   - CORS warnings?
   - Environment variable missing warnings?

