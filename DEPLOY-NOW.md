# 🚀 Vercel Par Deploy Kaise Karein - Step by Step

## 📋 Prerequisites (Pehle Ye Karein)

1. **GitHub Account** - Code GitHub par hona chahiye
2. **Vercel Account** - https://vercel.com/signup (GitHub se signup kar sakte ho)
3. **MongoDB Atlas Account** - https://www.mongodb.com/cloud/atlas (Free tier available)

---

## 🎯 Step 1: GitHub Par Code Push Karein

### Pehle check karein ke sab code push ho gaya hai:

```bash
# Git status check karein
git status

# Agar koi changes hain to:
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Verify karein:
- GitHub repository mein jao
- Latest commit check karo - sab files updated honi chahiye

---

## 🖥️ Step 2: Server Deploy Karein (Backend API)

### 2.1 Vercel Dashboard Mein:

1. **https://vercel.com** par jao
2. **"Add New..."** → **"Project"** click karo
3. GitHub repository select karo (metacodsar)
4. **"Import"** click karo

### 2.2 Project Configuration:

**IMPORTANT - Ye settings set karein:**

```
Framework Preset: Other
Root Directory: server
Build Command: (empty rakh dein)
Output Directory: (empty rakh dein)
Install Command: npm install
```

### 2.3 Environment Variables Add Karein:

**"Environment Variables"** section mein ye add karein:

```
Name: MONGODB_URI
Value: mongodb+srv://username:password@cluster.mongodb.net/metacodsar

Name: JWT_SECRET
Value: your-super-secret-jwt-key-change-this

Name: NODE_ENV
Value: production
```

**Note:** MongoDB Atlas se connection string copy karein

### 2.4 Deploy Karein:

- **"Deploy"** button click karo
- Wait karein build complete hone tak
- Server URL mil jayega: `https://metacodsar-api.vercel.app` (ya kuch aur)

**✅ Server URL note kar lein - yeh client deploy mein use hoga!**

---

## 💻 Step 3: Client Deploy Karein (Frontend)

### 3.1 Vercel Dashboard Mein:

1. **"Add New..."** → **"Project"** click karo
2. **Same GitHub repository** select karo (metacodsar)
3. **"Import"** click karo

### 3.2 Project Configuration:

**IMPORTANT - Ye settings set karein:**

```
Framework Preset: Vite
Root Directory: client
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 3.3 Environment Variables Add Karein:

**"Environment Variables"** section mein ye add karein:

```
Name: VITE_API_URL
Value: https://metacodsar-api.vercel.app
```

**⚠️ IMPORTANT:** Server ka actual URL paste karein jo Step 2 mein mila!

### 3.4 Deploy Karein:

- **"Deploy"** button click karo
- Wait karein build complete hone tak
- Client URL mil jayega: `https://metacodsar.vercel.app`

---

## ✅ Step 4: Verification (Check Karein)

### 4.1 Server Check:

Browser mein jao:
```
https://metacodsar-api.vercel.app/api/health
```

Should return:
```json
{
  "status": "OK",
  "message": "MetaCodsar API is running"
}
```

### 4.2 Client Check:

Browser mein jao:
```
https://metacodsar.vercel.app
```

- Website dikhni chahiye
- Login page kaam karna chahiye

---

## 🔧 Step 5: CORS Update (Agar Required Ho)

Agar CORS errors aayein, to server code update karein:

**File:** `server/api/index.js` ya `server/index.js`

CORS configuration mein apna frontend URL add karein:

```javascript
app.use(cors({
  origin: [
    'https://metacodsar.vercel.app',  // Your Vercel frontend URL
    'https://metacodsar-git-main.vercel.app',  // Preview URLs
    'http://localhost:5173'  // Local development
  ],
  // ... rest of config
}));
```

Phir code push karein aur redeploy karein.

---

## 📝 Important Notes

### MongoDB Atlas Setup:

1. **Free Cluster** create karo
2. **Database User** create karo (username/password)
3. **Network Access** mein **"Allow Access from Anywhere"** (0.0.0.0/0)
4. **Connection String** copy karo:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/metacodsar
   ```

### Environment Variables:

- **Server project** mein: `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV`
- **Client project** mein: `VITE_API_URL`

### Updates:

Code update karne ke liye:
1. Local changes karein
2. Git push karein
3. Vercel automatically deploy kar dega!

---

## 🐛 Troubleshooting

### Build Fails:

1. **Check logs** - Vercel dashboard mein "Logs" section check karein
2. **TypeScript errors** - Local build test karein: `cd client && npm run build`
3. **Dependencies** - Check karein `package.json` correct hai

### API Not Working:

1. **Check server URL** - Client mein `VITE_API_URL` correct hai?
2. **MongoDB connection** - MongoDB Atlas mein cluster running hai?
3. **CORS errors** - Server code mein CORS origin update karein

### 404 Errors:

1. **Client routing** - `client/vercel.json` mein rewrites check karein
2. **Server routes** - `server/vercel.json` mein routes check karein

---

## 🎉 Success!

Agar sab kuch sahi hai, to:
- ✅ Frontend: `https://metacodsar.vercel.app`
- ✅ Backend: `https://metacodsar-api.vercel.app`

**Happy Deploying! 🚀**

---

**Need Help?** 
- Vercel Docs: https://vercel.com/docs
- Check build logs in Vercel dashboard
- Verify all environment variables are set

