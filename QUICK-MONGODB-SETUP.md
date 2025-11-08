# ⚡ Quick MongoDB Setup - Your Cluster

## 🎯 Your MongoDB Cluster
```
Cluster: cluster0.7r3ulvb.mongodb.net
```

---

## 📝 Step 1: .env File Banao

`server` folder mein `.env` file banao aur yeh add karo:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.7r3ulvb.mongodb.net/metacodsar?appName=Cluster0

JWT_SECRET=your-secret-key-here-change-this
PORT=5001
```

**Replace karo:**
- `YOUR_USERNAME` → Apne MongoDB Atlas username
- `YOUR_PASSWORD` → Apne MongoDB Atlas password

**Note**: Agar database name missing ho to automatically `metacodsar` add ho jayega.

---

## ✅ Step 2: Server Start Karo

```bash
cd server
npm start
```

Console mein dekho:
- ✅ `MongoDB Connected Successfully!` → Connection successful!
- ❌ `MongoDB Connection Failed!` → Error check karo

---

## 🔍 Step 3: Test Karo

Browser mein open karo:
```
http://localhost:5001/api/health
```

Response mein `"database": { "connected": true }` hona chahiye.

---

## ❌ Agar Connection Fail Ho

### Error 1: Authentication Failed
**Solution**: Username/password verify karo MongoDB Atlas dashboard mein

### Error 2: IP Whitelist Error  
**Solution**: MongoDB Atlas → Network Access → Add IP Address (0.0.0.0/0 for all)

### Error 3: Connection Timeout
**Solution**: Internet connection check karo, cluster status verify karo

---

## 📋 Complete Connection String Format

### Option 1: With Database Name (Recommended)
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.7r3ulvb.mongodb.net/metacodsar?appName=Cluster0
```

### Option 2: Without Database Name (Auto-added)
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.7r3ulvb.mongodb.net/?appName=Cluster0
```

---

## 🎉 Done!

Connection successful hone ke baad:
- ✅ Login features kaam karenge
- ✅ Projects save honge
- ✅ Team members manage ho sakte hain
- ✅ Admin user automatically create ho jayega

**Admin Credentials:**
- Email: `admin@metacodsar.com`
- Password: `password`

---

**Need Help?** Check `MONGODB-SETUP-GUIDE.md` for detailed instructions.



