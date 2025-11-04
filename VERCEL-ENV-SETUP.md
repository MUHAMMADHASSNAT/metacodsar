# 🚀 Vercel Environment Variables Setup Guide

Yeh guide aapko Vercel mein environment variables setup karne mein help karega.

## 📋 Step 1: Backend (Server) Project mein Environment Variables

1. **Vercel Dashboard** mein jao
2. Apne **Backend project** (server) ko select karo
3. **Settings** tab click karo
4. **Environment Variables** section mein jao
5. Ye variables add karo:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/metacodsar
JWT_SECRET=your-super-secret-jwt-key-change-this-to-something-random
NODE_ENV=production
FRONTEND_URL=https://metacodsar.vercel.app
```

**Important Notes:**
- `MONGODB_URI`: MongoDB Atlas se connection string
- `JWT_SECRET`: Koi bhi random, strong string (minimum 32 characters)
- `FRONTEND_URL`: Apne frontend ka Vercel URL (jaisa: `https://metacodsar.vercel.app`)

## 📋 Step 2: Frontend (Client) Project mein Environment Variables

1. **Vercel Dashboard** mein jao
2. Apne **Frontend project** (client) ko select karo
3. **Settings** tab click karo
4. **Environment Variables** section mein jao
5. Ye variable add karo:

```
VITE_API_URL=https://metacodsar-api.vercel.app
```

**Important Notes:**
- `VITE_API_URL`: Apne backend ka Vercel URL (jaisa: `https://metacodsar-api.vercel.app`)
- Frontend URL ko backend ke saath replace karo

## 🔄 Step 3: Redeploy

Environment variables add karne ke baad:

1. **Deployments** tab mein jao
2. Latest deployment ke saamne **3 dots (⋯)** click karo
3. **Redeploy** select karo
4. Ya **git push** karo - Vercel automatically redeploy kar dega

## ✅ Verification

### Backend Check:
```
https://metacodsar-api.vercel.app/api/health
```
Expected response:
```json
{
  "status": "OK",
  "message": "MetaCodsar API is running"
}
```

### Frontend Check:
1. Browser console open karo (F12)
2. Network tab check karo
3. API calls successful honi chahiye
4. Agar CORS error aaye to backend CORS settings check karo

## 🐛 Common Issues

### Issue 1: CORS Error
**Solution**: Backend mein `FRONTEND_URL` environment variable check karo aur CORS settings verify karo.

### Issue 2: API Connection Failed
**Solution**: 
- Frontend mein `VITE_API_URL` check karo
- Backend URL correct hai ya nahi verify karo
- Browser console mein error messages check karo

### Issue 3: MongoDB Connection Failed
**Solution**:
- MongoDB Atlas mein network access allow karo (0.0.0.0/0 for all IPs)
- `MONGODB_URI` correct hai ya nahi verify karo
- MongoDB Atlas cluster running hai ya nahi check karo

## 📝 Quick Reference

### Backend URLs (Example):
- Production: `https://metacodsar-api.vercel.app`
- Preview: `https://metacodsar-api-git-branch-name.vercel.app`

### Frontend URLs (Example):
- Production: `https://metacodsar.vercel.app`
- Preview: `https://metacodsar-git-branch-name.vercel.app`

**Note**: Apne actual URLs use karo jo Vercel ne diye hain!

---

**Happy Deploying! 🎉**




