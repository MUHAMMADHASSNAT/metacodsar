# 🚀 Quick Start - MongoDB Setup & Run

## ⚡ Fastest Way (Interactive Setup)

### Step 1: Run Setup Script
```bash
npm run setup
```

Ya directly:
```bash
node setup-and-run.js
```

### Step 2: Enter Credentials
Script aap se puchenga:
- MongoDB Atlas Username
- MongoDB Atlas Password

### Step 3: Done!
Script automatically:
- ✅ .env file create/update karega
- ✅ Server start kar dega
- ✅ MongoDB connect ho jayega

---

## 📝 Manual Setup (If Needed)

### Step 1: Edit .env File
`server/.env` file mein yeh add karo:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.7r3ulvb.mongodb.net/metacodsar?appName=Cluster0
JWT_SECRET=metacodsar-secret-key-2024
PORT=5001
```

Replace:
- `YOUR_USERNAME` → MongoDB Atlas username
- `YOUR_PASSWORD` → MongoDB Atlas password

### Step 2: Start Server
```bash
npm start
```

---

## ✅ Success Indicators

Console mein yeh dikhega:
```
✅ MongoDB Connected Successfully!
📊 Database: metacodsar
🖥️  Host: cluster0.7r3ulvb.mongodb.net
```

---

## 🆘 Troubleshooting

### Error: Credentials Required
- `.env` file check karo
- Username/password verify karo MongoDB Atlas mein

### Error: Connection Failed
- Internet connection check karo
- MongoDB Atlas Network Access verify karo (0.0.0.0/0)
- Cluster status check karo

---

**🎉 Setup complete hone ke baad server automatically run hoga!**





