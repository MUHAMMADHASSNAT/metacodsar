# 🔧 Vercel Environment Variables - Complete Setup Guide

## 📍 Project URLs

- **Frontend Project:** `metacodsar-h3a4` → `https://metacodsar-h3a4.vercel.app`
- **Backend Project:** `metacodsar-2vf1` → `https://metacodsar-2vf1.vercel.app`

---

## 🎯 Step-by-Step Setup

### Step 1: Backend Project Environment Variables

1. **Vercel Dashboard mein jao:**
   - Project: `metacodsar-2vf1` (Backend/Server)
   - Settings → Environment Variables

2. **Tees variables add karein:**

   #### Variable 1: MONGODB_URI
   ```
   Key: MONGODB_URI
   Value: mongodb+srv://metacodsar:metacodsars@cluster0.7r3ulvb.mongodb.net/metacodsar?appName=Cluster0
   Environment: ✅ Production ✅ Preview ✅ Development (sab select karein)
   ```

   #### Variable 2: FRONTEND_URL
   ```
   Key: FRONTEND_URL
   Value: https://metacodsar-h3a4.vercel.app
   Environment: ✅ Production ✅ Preview ✅ Development
   ```
   **⚠️ Important:** Trailing slash nahi (`/` end mein nahi)

   #### Variable 3: JWT_SECRET
   ```
   Key: JWT_SECRET
   Value: metacodsar-secret-key-2024
   Environment: ✅ Production ✅ Preview ✅ Development
   ```

3. **Save karein** - Har variable ke baad "Save" button click karein

---

### Step 2: Frontend Project Environment Variables

1. **Vercel Dashboard mein jao:**
   - Project: `metacodsar-h3a4` (Frontend/Client)
   - Settings → Environment Variables

2. **Yeh variable add karein:**

   #### Variable: VITE_API_URL
   ```
   Key: VITE_API_URL
   Value: https://metacodsar-2vf1.vercel.app
   Environment: ✅ Production ✅ Preview ✅ Development
   ```
   **⚠️ Important:** 
   - Variable name exactly `VITE_API_URL` (typo nahi)
   - Trailing slash nahi (`/` end mein nahi)
   - Exact value: `https://metacodsar-2vf1.vercel.app`

3. **Save karein**

---

### Step 3: Redeploy Both Projects

**⚠️ CRITICAL:** Environment variables add karne ke baad **dono projects ko redeploy karna zaroori hai!**

#### Backend Project Redeploy:
1. Vercel Dashboard → `metacodsar-2vf1` project
2. Deployments tab
3. Latest deployment ke right side mein "..." menu
4. "Redeploy" select karein
5. Wait for deployment to complete

#### Frontend Project Redeploy:
1. Vercel Dashboard → `metacodsar-h3a4` project
2. Deployments tab
3. Latest deployment ke right side mein "..." menu
4. "Redeploy" select karein
5. Wait for deployment to complete

---

## ✅ Verification Steps

### 1. Backend Health Check

Browser mein yeh URL open karein:
```
https://metacodsar-2vf1.vercel.app/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "MetaCodsar API is running",
  "database": {
    "status": "connected",
    "connected": true
  }
}
```

### 2. Frontend Console Check

1. Frontend URL open karein: `https://metacodsar-h3a4.vercel.app`
2. Browser Console open karein (F12)
3. Console mein yeh dikhna chahiye:
   ```
   ✅ Using VITE_API_URL: https://metacodsar-2vf1.vercel.app
   ```

### 3. Login Test

1. Frontend URL open karein
2. Login page par jao
3. Admin credentials se login try karein:
   - Email: `admin@metacodsar.com`
   - Password: `password`
4. Agar login successful ho, to sab theek hai! ✅

---

## 🐛 Troubleshooting

### Issue: "Login Failed!" ya "Connection Error!"

#### Solution 1: Environment Variables Check
1. **Backend Project:**
   - Settings → Environment Variables
   - Verify:
     - `MONGODB_URI` set hai?
     - `FRONTEND_URL` = `https://metacodsar-h3a4.vercel.app` (no trailing slash)
     - `JWT_SECRET` set hai?

2. **Frontend Project:**
   - Settings → Environment Variables
   - Verify:
     - `VITE_API_URL` = `https://metacodsar-2vf1.vercel.app` (no trailing slash)
     - Variable name exactly `VITE_API_URL` (typo nahi)

#### Solution 2: Redeploy Check
- Dono projects ko redeploy kiya hai?
- Latest deployment successful hai?
- Environment variables latest deployment mein available hain?

#### Solution 3: Vercel Logs Check
1. **Backend Logs:**
   - Backend Project → Deployments → Latest → Logs
   - Check karein:
     - `✅ MongoDB connected successfully`
     - `✅ FRONTEND_URL configured: https://metacodsar-h3a4.vercel.app`
     - Koi errors nahi hain?

2. **Frontend Logs:**
   - Frontend Project → Deployments → Latest → Logs
   - Check karein koi build errors nahi hain?

#### Solution 4: MongoDB Connection
- MongoDB Atlas → Network Access
- IP whitelist check karein (0.0.0.0/0 for all IPs)
- MongoDB credentials correct hain?

---

## 📋 Complete Environment Variables Summary

### Backend Project (`metacodsar-2vf1`):
```env
MONGODB_URI=mongodb+srv://metacodsar:metacodsars@cluster0.7r3ulvb.mongodb.net/metacodsar?appName=Cluster0
FRONTEND_URL=https://metacodsar-h3a4.vercel.app
JWT_SECRET=metacodsar-secret-key-2024
```

### Frontend Project (`metacodsar-h3a4`):
```env
VITE_API_URL=https://metacodsar-2vf1.vercel.app
```

---

## 🎯 Quick Checklist

### Backend Project:
- [ ] `MONGODB_URI` added with correct value
- [ ] `FRONTEND_URL` = `https://metacodsar-h3a4.vercel.app` (no trailing slash)
- [ ] `JWT_SECRET` added
- [ ] All environments selected (Production, Preview, Development)
- [ ] Project redeployed after adding variables
- [ ] Health check successful: `https://metacodsar-2vf1.vercel.app/api/health`

### Frontend Project:
- [ ] `VITE_API_URL` = `https://metacodsar-2vf1.vercel.app` (no trailing slash)
- [ ] Variable name exactly `VITE_API_URL` (no typo)
- [ ] All environments selected
- [ ] Project redeployed after adding variable
- [ ] Console shows: `✅ Using VITE_API_URL: https://metacodsar-2vf1.vercel.app`
- [ ] Login working successfully

---

**Last Updated:** 2025-11-08  
**Status:** ✅ Ready for Setup

