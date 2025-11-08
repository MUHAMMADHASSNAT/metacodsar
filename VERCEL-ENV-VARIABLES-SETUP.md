# 🔧 Vercel Environment Variables Setup Guide

## 📝 Required Environment Variables

### Server Project (Backend) - Vercel Environment Variables

Vercel Dashboard → Server Project → Settings → Environment Variables mein yeh add karein:

#### 1. MONGODB_URI ✅
```
Name: MONGODB_URI
Value: mongodb+srv://metacodsar:metacodsars@cluster0.7r3ulvb.mongodb.net/metacodsar?appName=Cluster0
Environment: Production, Preview, Development (sab mein add karein)
```

#### 2. FRONTEND_URL ✅
```
Name: FRONTEND_URL
Value: https://metacodsar-h3a4.vercel.app
Environment: Production, Preview, Development
```

#### 3. JWT_SECRET ✅
```
Name: JWT_SECRET
Value: metacodsar-secret-key-2024
Environment: Production, Preview, Development
```

---

### Client Project (Frontend) - Vercel Environment Variables

Vercel Dashboard → Client Project → Settings → Environment Variables mein yeh add karein:

#### 1. VITE_API_URL ✅
```
Name: VITE_API_URL
Value: https://metacodsar-2vf1.vercel.app
Environment: Production, Preview, Development
```

**⚠️ Important:** 
- Variable name exactly `VITE_API_URL` hona chahiye (typo nahi)
- Trailing slash nahi hona chahiye (`/` end mein nahi)
- Example: ✅ `https://metacodsar-2vf1.vercel.app` (correct)
- Example: ❌ `https://metacodsar-2vf1.vercel.app/` (wrong - trailing slash)

---

## 🚀 Setup Steps

### Step 1: Server Project Environment Variables

1. Vercel Dashboard mein jao
2. Server Project select karein
3. Settings → Environment Variables
4. Add karein:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://metacodsar:metacodsars@cluster0.7r3ulvb.mongodb.net/metacodsar?appName=Cluster0` | All |
| `FRONTEND_URL` | `https://metacodsar-h3a4.vercel.app` | All |
| `JWT_SECRET` | `metacodsar-secret-key-2024` | All |

### Step 2: Client Project Environment Variables

1. Vercel Dashboard mein jao
2. Client Project select karein
3. Settings → Environment Variables
4. Add karein:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `VITE_API_URL` | `https://metacodsar-2vf1.vercel.app` | All |

### Step 3: Redeploy

**⚠️ Important:** Environment variables add karne ke baad **dono projects ko redeploy karna zaroori hai!**

1. Server Project → Deployments → Latest → Redeploy
2. Client Project → Deployments → Latest → Redeploy

---

## ✅ Verification

### Server Project Check:

1. Server Project → Deployments → Latest → Logs
2. Check karein:
   ```
   ✅ MongoDB connected successfully
   ✅ FRONTEND_URL configured: https://metacodsar-h3a4.vercel.app
   ```

### Client Project Check:

1. Browser Console open karein (F12)
2. Check karein:
   ```
   ✅ Using VITE_API_URL: https://metacodsar-2vf1.vercel.app
   ```

---

## 📋 Complete Environment Variables List

### Server Project:
```env
MONGODB_URI=mongodb+srv://metacodsar:metacodsars@cluster0.7r3ulvb.mongodb.net/metacodsar?appName=Cluster0
FRONTEND_URL=https://metacodsar-h3a4.vercel.app
JWT_SECRET=metacodsar-secret-key-2024
```

### Client Project:
```env
VITE_API_URL=https://metacodsar-2vf1.vercel.app
```

---

## 🔒 Security Notes

1. **Never commit `.env` files** to git (already in `.gitignore`)
2. **Use strong JWT_SECRET** in production (random string)
3. **MongoDB credentials** ko secure rakhein
4. **Environment variables** ko Vercel Dashboard se directly set karein

---

## 🐛 Troubleshooting

### Issue: MongoDB connection fails
- ✅ Check: `MONGODB_URI` correctly set hai?
- ✅ Check: MongoDB Atlas Network Access (0.0.0.0/0)
- ✅ Check: Credentials correct hain?

### Issue: CORS errors
- ✅ Check: `FRONTEND_URL` correctly set hai?
- ✅ Check: Client URL matches `FRONTEND_URL`

### Issue: API calls fail
- ✅ Check: `VITE_API_URL` correctly set hai?
- ✅ Check: No trailing slash in URL
- ✅ Check: Variable name exactly `VITE_API_URL`

---

## ✅ Status

**Environment Variables Setup Complete!**

Ab Vercel Dashboard mein yeh variables add karein aur redeploy karein.

**Created:** 2025-11-07  
**MongoDB Credentials:** ✅ Set  
**Ready for:** Production Deployment


