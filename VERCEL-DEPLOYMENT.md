# 🚀 Vercel Deployment Guide - MetaCodsar

## 📋 Prerequisites

1. **Vercel Account** - https://vercel.com/signup
2. **MongoDB Atlas Account** - https://www.mongodb.com/cloud/atlas (free tier available)
3. **GitHub Repository** - Code should be on GitHub

## 🎯 Deployment Strategy

Yeh project do parts mein deploy hoga:
- **Client (Frontend)** - Static site on Vercel
- **Server (Backend)** - Serverless API on Vercel

## 📦 Step 1: MongoDB Setup

1. MongoDB Atlas par account banao
2. Free cluster create karo
3. Database user create karo
4. Connection string copy karo (jaisa: `mongodb+srv://username:password@cluster.mongodb.net/metacodsar`)

## 🖥️ Step 2: Server Deployment (Backend)

### Vercel Dashboard se:

1. **New Project** click karo
2. GitHub repository select karo
3. **Root Directory** set karo: `server`
4. **Framework Preset**: Other
5. **Build Command**: Leave empty (ya `npm install`)
6. **Output Directory**: Leave empty
7. **Install Command**: `npm install`

### Environment Variables add karo:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/metacodsar
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=production
PORT=3000
```

### Deploy karo!

Server ka URL aayega jaisa: `https://metacodsar-api.vercel.app`

## 💻 Step 3: Client Deployment (Frontend)

### Vercel Dashboard se:

1. **New Project** click karo
2. Same GitHub repository select karo
3. **Root Directory** set karo: `client`
4. **Framework Preset**: Vite
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`
7. **Install Command**: `npm install`

### Environment Variables add karo:

```
VITE_API_URL=https://metacodsar-api.vercel.app
```

**Note**: Server ka actual URL use karo jo Step 2 mein mila.

### Deploy karo!

Client ka URL aayega jaisa: `https://metacodsar.vercel.app`

## 🔧 Step 4: CORS Configuration Update

Server deploy hone ke baad, server code mein CORS origin update karo:

`server/index.js` ya `server/api/index.js` mein:

```javascript
app.use(cors({
  origin: [
    'https://metacodsar.vercel.app',  // Your Vercel frontend URL
    'https://metacodsar-git-main.vercel.app',  // Preview URLs
    'http://localhost:5173'  // Local development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## ✅ Verification

1. **Server Health Check**: 
   ```
   https://metacodsar-api.vercel.app/api/health
   ```
   Should return: `{"status":"OK","message":"MetaCodsar API is running"}`

2. **Client**: 
   ```
   https://metacodsar.vercel.app
   ```
   Should show your website

3. **Login Test**:
   - Go to `/login`
   - Use admin credentials
   - Should work if server is connected

## 🐛 Troubleshooting

### Build Errors:

1. **TypeScript Errors**: 
   - Check `client/tsconfig.json`
   - Run `npm run build` locally first

2. **Module Not Found**:
   - Check `package.json` dependencies
   - Ensure all dependencies are in `dependencies`, not `devDependencies`

### Runtime Errors:

1. **API Connection Failed**:
   - Check `VITE_API_URL` environment variable
   - Verify server is deployed and accessible

2. **MongoDB Connection**:
   - Check `MONGODB_URI` is correct
   - Verify MongoDB Atlas network access (allow all IPs for testing)

3. **CORS Errors**:
   - Update CORS origin in server code
   - Include all Vercel preview URLs

## 📝 Important Notes

1. **File Uploads**: Vercel serverless functions mein file uploads handle karne ke liye memory storage use karein (already configured in `server/api/index.js`)

2. **Environment Variables**: Dono projects (client aur server) mein separately add karne honge

3. **Custom Domain**: Agar custom domain chahiye, Vercel settings se add kar sakte ho

4. **Preview Deployments**: Har git push par preview URL automatically banega - testing ke liye perfect!

## 🔄 Updates

Code update karne ke liye:
1. Git push karo
2. Vercel automatically deploy kar dega
3. Production URL update ho jayega

---

**Happy Deploying! 🎉**

