# ✅ Vercel Environment Variables - Setup Summary

## 🎯 Quick Setup (5 Minutes)

### 📦 Backend Project: `metacodsar-2vf1`

**Vercel → Settings → Environment Variables → Add:**

1. **MONGODB_URI**
   ```
   mongodb+srv://metacodsar:metacodsars@cluster0.7r3ulvb.mongodb.net/metacodsar?appName=Cluster0
   ```

2. **FRONTEND_URL**
   ```
   https://metacodsar-h3a4.vercel.app
   ```
   ⚠️ No trailing slash

3. **JWT_SECRET**
   ```
   metacodsar-secret-key-2024
   ```

**All Environments:** ✅ Production ✅ Preview ✅ Development

---

### 🎨 Frontend Project: `metacodsar-h3a4`

**Vercel → Settings → Environment Variables → Add:**

1. **VITE_API_URL**
   ```
   https://metacodsar-2vf1.vercel.app
   ```
   ⚠️ No trailing slash  
   ⚠️ Variable name exactly `VITE_API_URL`

**All Environments:** ✅ Production ✅ Preview ✅ Development

---

## 🚀 After Adding Variables

1. **Redeploy Backend Project** (`metacodsar-2vf1`)
2. **Redeploy Frontend Project** (`metacodsar-h3a4`)
3. **Test:** `https://metacodsar-h3a4.vercel.app` - Login should work!

---

## ✅ Verification

### Backend Health:
```
https://metacodsar-2vf1.vercel.app/api/health
```
Should show: `"status": "OK"` and `"database": { "connected": true }`

### Frontend Console (F12):
Should show: `✅ Using VITE_API_URL: https://metacodsar-2vf1.vercel.app`

---

## 📚 Detailed Guides

- **Quick Reference:** `VERCEL-ENV-QUICK-REFERENCE.md`
- **Complete Guide:** `VERCEL-ENV-SETUP-COMPLETE.md`
- **Visual Guide:** `VERCEL-ENV-SETUP-VISUAL-GUIDE.md`

---

**Last Updated:** 2025-11-08

