# 📝 Project Naming Guide - Easy Frontend-Backend Connection

## 🎯 Recommended Project Names

### Option 1: Simple & Clear (Recommended)

**Frontend Project:**
- **Vercel Project Name:** `metacodsar-frontend`
- **URL:** `https://metacodsar-frontend.vercel.app`

**Backend Project:**
- **Vercel Project Name:** `metacodsar-backend`
- **URL:** `https://metacodsar-backend.vercel.app`

**Benefits:**
- ✅ Easy to remember
- ✅ Clear naming
- ✅ Easy to identify

---

### Option 2: Current Names (Keep As Is)

**Frontend Project:**
- **Vercel Project Name:** `metacodsar-h3a4` (current)
- **URL:** `https://metacodsar-h3a4.vercel.app`

**Backend Project:**
- **Vercel Project Name:** `metacodsar-2vf1` (current)
- **URL:** `https://metacodsar-2vf1.vercel.app`

**Benefits:**
- ✅ Already deployed
- ✅ URLs already configured
- ⚠️ Less descriptive names

---

### Option 3: With Suffix

**Frontend Project:**
- **Vercel Project Name:** `metacodsar-client`
- **URL:** `https://metacodsar-client.vercel.app`

**Backend Project:**
- **Vercel Project Name:** `metacodsar-server`
- **URL:** `https://metacodsar-server.vercel.app`

---

## 🔧 Environment Variables Setup (Current Names)

### Backend Project (`metacodsar-2vf1`):

```
MONGODB_URI = mongodb+srv://metacodsar:metacodsars@cluster0.7r3ulvb.mongodb.net/metacodsar?appName=Cluster0
CLIENT_URL = https://metacodsar-h3a4.vercel.app
JWT_SECRET = your-super-secret-jwt-key-change-this-in-production-metacodsar-2024
NODE_ENV = production
PORT = 5001
```

### Frontend Project (`metacodsar-h3a4`):

```
VITE_API_URL = https://metacodsar-2vf1.vercel.app
```

---

## 📋 Quick Reference Table

| Project Type | Current Name | Current URL | Recommended Name | Recommended URL |
|--------------|--------------|-------------|------------------|------------------|
| **Frontend** | `metacodsar-h3a4` | `https://metacodsar-h3a4.vercel.app` | `metacodsar-frontend` | `https://metacodsar-frontend.vercel.app` |
| **Backend** | `metacodsar-2vf1` | `https://metacodsar-2vf1.vercel.app` | `metacodsar-backend` | `https://metacodsar-backend.vercel.app` |

---

## 🎯 Vercel Project Name Change (Optional)

Agar aap project names change karna chahte hain:

### Step 1: Vercel Dashboard

1. **Frontend Project:**
   - Vercel Dashboard → `metacodsar-h3a4` → Settings → General
   - Project Name: `metacodsar-frontend` (change karein)
   - Save karein

2. **Backend Project:**
   - Vercel Dashboard → `metacodsar-2vf1` → Settings → General
   - Project Name: `metacodsar-backend` (change karein)
   - Save karein

### Step 2: Update Environment Variables

**Backend Project:**
- `CLIENT_URL` = `https://metacodsar-frontend.vercel.app` (new URL)

**Frontend Project:**
- `VITE_API_URL` = `https://metacodsar-backend.vercel.app` (new URL)

### Step 3: Redeploy

- Dono projects ko redeploy karein

---

## ✅ Current Setup (Keep As Is - Recommended)

**Agar project names change nahi karna, to current names theek hain:**

### Backend Environment Variables:
```
CLIENT_URL = https://metacodsar-h3a4.vercel.app
```

### Frontend Environment Variables:
```
VITE_API_URL = https://metacodsar-2vf1.vercel.app
```

**Yeh already configured hai aur kaam kar raha hai!** ✅

---

## 📝 Summary

**Current Setup (Working):**
- Frontend: `metacodsar-h3a4` → `https://metacodsar-h3a4.vercel.app`
- Backend: `metacodsar-2vf1` → `https://metacodsar-2vf1.vercel.app`

**Environment Variables:**
- Backend: `CLIENT_URL` = Frontend URL
- Frontend: `VITE_API_URL` = Backend URL

**Recommendation:**
- Current names theek hain, change ki zaroorat nahi
- Agar change karna hai, to `metacodsar-frontend` aur `metacodsar-backend` use karein

---

**Last Updated:** 2025-11-08

