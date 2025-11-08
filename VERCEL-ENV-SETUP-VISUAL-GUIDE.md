# 🎨 Vercel Environment Variables - Visual Step-by-Step Guide

## 📍 Your Projects

- **Frontend:** `metacodsar-h3a4` → `https://metacodsar-h3a4.vercel.app`
- **Backend:** `metacodsar-2vf1` → `https://metacodsar-2vf1.vercel.app`

---

## 🔧 Step 1: Backend Project Setup (`metacodsar-2vf1`)

### 1.1 Vercel Dashboard mein jao
- Vercel.com par login karein
- Project `metacodsar-2vf1` select karein

### 1.2 Environment Variables section mein jao
- Left sidebar se **"Settings"** click karein
- **"Environment Variables"** section mein jao

### 1.3 Pehla Variable Add Karein: MONGODB_URI

**"Add New"** section mein:
```
Key: MONGODB_URI
Value: mongodb+srv://metacodsar:metacodsars@cluster0.7r3ulvb.mongodb.net/metacodsar?appName=Cluster0
```

**Environment dropdown:**
- ✅ Production
- ✅ Preview  
- ✅ Development

**"Save"** button click karein

### 1.4 Doosra Variable Add Karein: FRONTEND_URL

**"Add Another"** button click karein, phir:
```
Key: FRONTEND_URL
Value: https://metacodsar-h3a4.vercel.app
```

**⚠️ Important:** 
- Trailing slash nahi (`/` end mein nahi)
- Exact value: `https://metacodsar-h3a4.vercel.app`

**Environment dropdown:**
- ✅ Production
- ✅ Preview
- ✅ Development

**"Save"** button click karein

### 1.5 Teesra Variable Add Karein: JWT_SECRET

**"Add Another"** button click karein, phir:
```
Key: JWT_SECRET
Value: metacodsar-secret-key-2024
```

**Environment dropdown:**
- ✅ Production
- ✅ Preview
- ✅ Development

**"Save"** button click karein

### 1.6 Verify Variables
Aapko yeh 3 variables dikhne chahiye:
- ✅ `MONGODB_URI` - Updated 3h ago (ya abhi)
- ✅ `FRONTEND_URL` - Updated just now
- ✅ `JWT_SECRET` - Updated just now

---

## 🎨 Step 2: Frontend Project Setup (`metacodsar-h3a4`)

### 2.1 Vercel Dashboard mein jao
- Project `metacodsar-h3a4` select karein

### 2.2 Environment Variables section mein jao
- Left sidebar se **"Settings"** click karein
- **"Environment Variables"** section mein jao

### 2.3 Variable Add Karein: VITE_API_URL

**"Add New"** section mein:
```
Key: VITE_API_URL
Value: https://metacodsar-2vf1.vercel.app
```

**⚠️ CRITICAL:** 
- Variable name exactly `VITE_API_URL` (typo nahi)
- Trailing slash nahi (`/` end mein nahi)
- Exact value: `https://metacodsar-2vf1.vercel.app`

**Environment dropdown:**
- ✅ Production
- ✅ Preview
- ✅ Development

**"Save"** button click karein

### 2.4 Verify Variable
Aapko yeh variable dikhna chahiye:
- ✅ `VITE_API_URL` - Updated just now

---

## 🚀 Step 3: Redeploy Both Projects

### 3.1 Backend Project Redeploy

1. **Backend Project** (`metacodsar-2vf1`) mein jao
2. **"Deployments"** tab click karein
3. Latest deployment ke right side mein **"..."** (three dots) menu click karein
4. **"Redeploy"** select karein
5. **"Redeploy"** button confirm karein
6. Deployment complete hone ka wait karein (1-2 minutes)

### 3.2 Frontend Project Redeploy

1. **Frontend Project** (`metacodsar-h3a4`) mein jao
2. **"Deployments"** tab click karein
3. Latest deployment ke right side mein **"..."** (three dots) menu click karein
4. **"Redeploy"** select karein
5. **"Redeploy"** button confirm karein
6. Deployment complete hone ka wait karein (1-2 minutes)

---

## ✅ Step 4: Verification

### 4.1 Backend Health Check

Browser mein yeh URL open karein:
```
https://metacodsar-2vf1.vercel.app/api/health
```

**Expected Response:**
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

Agar yeh response aaye, to backend theek hai! ✅

### 4.2 Frontend Console Check

1. Frontend URL open karein: `https://metacodsar-h3a4.vercel.app`
2. **F12** press karein (Browser Console open hoga)
3. **Console** tab mein yeh dikhna chahiye:
   ```
   ✅ Using VITE_API_URL: https://metacodsar-2vf1.vercel.app
   ```

Agar yeh message dikhe, to frontend theek hai! ✅

### 4.3 Login Test

1. Frontend URL open karein: `https://metacodsar-h3a4.vercel.app`
2. Login page par jao
3. Admin credentials se login try karein:
   - **Email:** `admin@metacodsar.com`
   - **Password:** `password`
4. Agar login successful ho, to sab theek hai! ✅

---

## 🐛 Agar Masla Aaye (Troubleshooting)

### Problem: "Login Failed!" ya "Connection Error!"

#### Solution 1: Environment Variables Double Check

**Backend Project:**
- Settings → Environment Variables
- Verify:
  - `MONGODB_URI` value correct hai?
  - `FRONTEND_URL` = `https://metacodsar-h3a4.vercel.app` (no `/` at end)
  - `JWT_SECRET` set hai?

**Frontend Project:**
- Settings → Environment Variables
- Verify:
  - `VITE_API_URL` = `https://metacodsar-2vf1.vercel.app` (no `/` at end)
  - Variable name exactly `VITE_API_URL` (typo nahi)

#### Solution 2: Redeploy Check

- Dono projects ko redeploy kiya hai?
- Latest deployment successful hai?
- Environment variables latest deployment mein available hain?

#### Solution 3: Vercel Logs Check

**Backend Logs:**
1. Backend Project → Deployments → Latest → **"Logs"** tab
2. Check karein:
   - `✅ MongoDB connected successfully`
   - `✅ FRONTEND_URL configured: https://metacodsar-h3a4.vercel.app`
   - Koi errors nahi hain?

**Frontend Logs:**
1. Frontend Project → Deployments → Latest → **"Logs"** tab
2. Check karein build successful hai?

#### Solution 4: MongoDB Connection

1. MongoDB Atlas Dashboard mein jao
2. **Network Access** section
3. Verify IP whitelist: `0.0.0.0/0` (all IPs allowed)
4. MongoDB credentials correct hain?

---

## 📋 Quick Reference Card

### Backend Project (`metacodsar-2vf1`):
```
MONGODB_URI = mongodb+srv://metacodsar:metacodsars@cluster0.7r3ulvb.mongodb.net/metacodsar?appName=Cluster0
FRONTEND_URL = https://metacodsar-h3a4.vercel.app
JWT_SECRET = metacodsar-secret-key-2024
```

### Frontend Project (`metacodsar-h3a4`):
```
VITE_API_URL = https://metacodsar-2vf1.vercel.app
```

---

**✅ Setup Complete!** Ab aapka application production mein ready hai!

