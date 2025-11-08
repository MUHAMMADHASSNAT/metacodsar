# 🔧 Troubleshooting Guide - Login/Connection Errors

## 🚨 Agar Abhi Bhi Error Aa Raha Hai

### Step 1: Environment Variables Double Check

#### Backend Project (`metacodsar-2vf1`):

1. **Vercel Dashboard → `metacodsar-2vf1` → Settings → Environment Variables**

2. **Verify yeh variables hain:**
   ```
   MONGODB_URI = mongodb+srv://metacodsar:metacodsars@cluster0.7r3ulvb.mongodb.net/metacodsar?appName=Cluster0
   FRONTEND_URL = https://metacodsar-h3a4.vercel.app
   JWT_SECRET = your-super-secret-jwt-key-change-this-in-production-metacodsar-2024
   NODE_ENV = production
   PORT = 5001
   ```

3. **Check karein:**
   - ❌ `VITE_API_URL` **NAHI** hona chahiye (delete karein agar hai)
   - ✅ `FRONTEND_URL` mein `@` nahi, trailing slash `/` nahi
   - ✅ Sab variables ke saamne **"All Environments"** selected hai

#### Frontend Project (`metacodsar-h3a4`):

1. **Vercel Dashboard → `metacodsar-h3a4` → Settings → Environment Variables**

2. **Verify yeh variable hai:**
   ```
   VITE_API_URL = https://metacodsar-2vf1.vercel.app
   ```

3. **Check karein:**
   - ✅ `@` symbol nahi hai
   - ✅ Trailing slash `/` nahi hai
   - ✅ Backend URL hai (`metacodsar-2vf1`), frontend URL nahi
   - ✅ Variable name exactly `VITE_API_URL` (typo nahi)
   - ✅ **"All Environments"** selected hai

---

### Step 2: Vercel Logs Check

#### Backend Logs:

1. **Vercel Dashboard → `metacodsar-2vf1` → Deployments**
2. **Latest deployment** click karein
3. **"Logs"** tab open karein
4. **Check karein yeh messages:**
   ```
   ✅ MongoDB connected successfully
   ✅ FRONTEND_URL configured: https://metacodsar-h3a4.vercel.app
   ```

5. **Agar errors hain:**
   - MongoDB connection error?
   - CORS error?
   - Environment variable missing?

#### Frontend Logs:

1. **Vercel Dashboard → `metacodsar-h3a4` → Deployments**
2. **Latest deployment** click karein
3. **"Logs"** tab open karein
4. **Check karein:**
   - Build successful hai?
   - Koi errors hain?

---

### Step 3: Health Endpoint Check

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

**Agar error aaye:**
- ❌ `"connected": false` → MongoDB connection issue
- ❌ `404 Not Found` → Server deploy nahi hua
- ❌ `500 Internal Server Error` → Server code mein issue
- ❌ CORS error → `FRONTEND_URL` galat hai

---

### Step 4: Browser Console Check

1. **Frontend URL open karein:** `https://metacodsar-h3a4.vercel.app`
2. **F12** press karein (Developer Tools)
3. **Console** tab open karein
4. **Check karein yeh message:**
   ```
   ✅ Using VITE_API_URL: https://metacodsar-2vf1.vercel.app
   ```

**Agar yeh message nahi dikhe:**
- ❌ `VITE_API_URL` set nahi hai
- ❌ Variable name galat hai
- ❌ Redeploy nahi kiya

5. **Network** tab open karein
6. **Login try karein**
7. **Check karein:**
   - Request URL: `https://metacodsar-2vf1.vercel.app/api/auth/login`
   - Status: `200 OK` (success) ya `401` (wrong credentials) ya `500` (server error)
   - CORS error?

---

### Step 5: MongoDB Connection Check

1. **MongoDB Atlas Dashboard** mein jao
2. **Network Access** section
3. **Check karein:**
   - IP whitelist: `0.0.0.0/0` (all IPs allowed) ✅
   - Ya aapka specific IP add hai? ✅

4. **Database Access** section
5. **Check karein:**
   - Username: `metacodsar` ✅
   - Password: `metacodsars` ✅
   - Permissions: Read and write ✅

---

### Step 6: Redeploy Process

**⚠️ IMPORTANT:** Environment variables change karne ke baad **dono projects ko redeploy karna zaroori hai!**

#### Backend Redeploy:

1. **Vercel Dashboard → `metacodsar-2vf1`**
2. **Deployments** tab
3. **Latest deployment** ke right side mein **"..."** (three dots)
4. **"Redeploy"** select karein
5. **"Redeploy"** confirm karein
6. **Wait** for deployment (1-2 minutes)

#### Frontend Redeploy:

1. **Vercel Dashboard → `metacodsar-h3a4`**
2. **Deployments** tab
3. **Latest deployment** ke right side mein **"..."** (three dots)
4. **"Redeploy"** select karein
5. **"Redeploy"** confirm karein
6. **Wait** for deployment (1-2 minutes)

---

### Step 7: Common Issues & Solutions

#### Issue 1: "Login Failed!" ya "Connection Error!"

**Possible Causes:**
- Environment variables set nahi hain
- Redeploy nahi kiya
- CORS error
- MongoDB connection fail

**Solution:**
1. Environment variables verify karein (Step 1)
2. Redeploy karein (Step 6)
3. Health endpoint check karein (Step 3)
4. Browser console check karein (Step 4)

---

#### Issue 2: CORS Error

**Error Message:**
```
Access to fetch at 'https://metacodsar-2vf1.vercel.app/api/auth/login' from origin 'https://metacodsar-h3a4.vercel.app' has been blocked by CORS policy
```

**Solution:**
1. **Backend Project** mein `FRONTEND_URL` verify karein:
   ```
   FRONTEND_URL = https://metacodsar-h3a4.vercel.app
   ```
   - `@` nahi hona chahiye
   - Trailing slash `/` nahi hona chahiye

2. **Redeploy** backend project

---

#### Issue 3: MongoDB Connection Failed

**Error Message:**
```
MongoDB connection error
database: { "connected": false }
```

**Solution:**
1. **MongoDB Atlas** → Network Access
   - IP whitelist: `0.0.0.0/0` add karein

2. **Backend Project** mein `MONGODB_URI` verify karein:
   ```
   MONGODB_URI = mongodb+srv://metacodsar:metacodsars@cluster0.7r3ulvb.mongodb.net/metacodsar?appName=Cluster0
   ```

3. **Redeploy** backend project

---

#### Issue 4: "VITE_API_URL not found"

**Error Message:**
```
⚠️ VITE_API_URL environment variable is missing!
```

**Solution:**
1. **Frontend Project** mein `VITE_API_URL` add karein:
   ```
   VITE_API_URL = https://metacodsar-2vf1.vercel.app
   ```
   - `@` nahi
   - Trailing slash `/` nahi
   - Variable name exactly `VITE_API_URL`

2. **Redeploy** frontend project

---

### Step 8: Final Verification

1. ✅ **Backend Health:** `https://metacodsar-2vf1.vercel.app/api/health` → `"connected": true`
2. ✅ **Frontend Console:** `✅ Using VITE_API_URL: https://metacodsar-2vf1.vercel.app`
3. ✅ **Login Test:** Admin credentials se login successful

---

## 📞 Agar Abhi Bhi Problem Hai

1. **Vercel Logs** share karein (Backend + Frontend)
2. **Browser Console** screenshot share karein
3. **Health endpoint** response share karein
4. **Environment Variables** list share karein (values hide karke)

---

**Last Updated:** 2025-11-08

