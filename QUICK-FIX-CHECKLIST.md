# ✅ Quick Fix Checklist

## 🔍 Step-by-Step Verification

### 1️⃣ Backend Environment Variables (`metacodsar-2vf1`)

- [ ] `MONGODB_URI` = `mongodb+srv://metacodsar:metacodsars@cluster0.7r3ulvb.mongodb.net/metacodsar?appName=Cluster0`
- [ ] `FRONTEND_URL` = `https://metacodsar-h3a4.vercel.app` (no `@`, no `/`)
- [ ] `JWT_SECRET` = set hai
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `5001`
- [ ] `VITE_API_URL` **NAHI** hai (delete karein agar hai)
- [ ] Sab variables ke liye **"All Environments"** selected

---

### 2️⃣ Frontend Environment Variables (`metacodsar-h3a4`)

- [ ] `VITE_API_URL` = `https://metacodsar-2vf1.vercel.app` (no `@`, no `/`)
- [ ] Variable name exactly `VITE_API_URL` (typo nahi)
- [ ] **"All Environments"** selected

---

### 3️⃣ Redeploy

- [ ] Backend project redeployed
- [ ] Frontend project redeployed
- [ ] Dono deployments successful

---

### 4️⃣ Health Check

- [ ] `https://metacodsar-2vf1.vercel.app/api/health` → `"connected": true`
- [ ] Browser console: `✅ Using VITE_API_URL: https://metacodsar-2vf1.vercel.app`

---

### 5️⃣ MongoDB Atlas

- [ ] Network Access: `0.0.0.0/0` whitelisted
- [ ] Database Access: Username/password correct

---

## 🚨 Common Mistakes

- ❌ `@` symbol URLs mein
- ❌ Trailing slash `/` end mein
- ❌ Server mein `VITE_API_URL` present
- ❌ Frontend `VITE_API_URL` mein frontend URL (should be backend URL)
- ❌ Environment variables change karne ke baad redeploy nahi kiya

---

**Sab check karne ke baad phir se login try karein!** 🚀

