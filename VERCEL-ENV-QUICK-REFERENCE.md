# ⚡ Vercel Environment Variables - Quick Reference

## 🚀 Copy-Paste Ready Values

### Server Project (Backend) - Vercel Dashboard

**Settings → Environment Variables → Add New:**

#### 1️⃣ MONGODB_URI
```
Variable Name: MONGODB_URI
Value: mongodb+srv://metacodsar:metacodsars@cluster0.7r3ulvb.mongodb.net/metacodsar?appName=Cluster0
Environment: ✅ Production ✅ Preview ✅ Development
```

#### 2️⃣ FRONTEND_URL
```
Variable Name: FRONTEND_URL
Value: https://metacodsar-h3a4.vercel.app
Environment: ✅ Production ✅ Preview ✅ Development
```

#### 3️⃣ JWT_SECRET
```
Variable Name: JWT_SECRET
Value: metacodsar-secret-key-2024
Environment: ✅ Production ✅ Preview ✅ Development
```

---

### Client Project (Frontend) - Vercel Dashboard

**Settings → Environment Variables → Add New:**

#### 1️⃣ VITE_API_URL
```
Variable Name: VITE_API_URL
Value: https://metacodsar-2vf1.vercel.app
Environment: ✅ Production ✅ Preview ✅ Development
```

**⚠️ Important:** 
- No trailing slash (`/` end mein nahi)
- Variable name exactly `VITE_API_URL`

---

## 📋 Complete Checklist

### Server Project:
- [ ] `MONGODB_URI` added
- [ ] `FRONTEND_URL` added
- [ ] `JWT_SECRET` added
- [ ] All environments selected (Production, Preview, Development)
- [ ] Redeployed after adding variables

### Client Project:
- [ ] `VITE_API_URL` added
- [ ] No trailing slash in URL
- [ ] All environments selected
- [ ] Redeployed after adding variables

---

## ✅ After Adding Variables

1. **Redeploy Server Project**
2. **Redeploy Client Project**
3. **Test Login** - Should work now!

---

**Last Updated:** 2025-11-07  
**MongoDB Credentials:** ✅ Configured


