# Port 5001 Fix Guide - हिंदी/Urdu में

## ⚠️ Agar Port 5001 Already in Use Error Aa Raha Hai

### तरीका 1: Automatic Fix (सबसे आसान) ✅

```bash
cd server
node free-port.js
```

Ye script automatically:
- Port 5001 check karega
- Agar koi process use kar raha hai, usko kill kar dega
- Port ko free kar dega

### तरीका 2: Manual Fix

**Step 1: Port Check Karein**
```powershell
netstat -ano | findstr :5001
```

Ye command aapko dikhayega konsi process port 5001 use kar rahi hai.

**Step 2: Process Kill Karein**
```powershell
taskkill /F /PID <PID_NUMBER> /T
```

`<PID_NUMBER>` ki jagah wo number likhein jo pehle command ne dikhaya.

**Example:**
Agar output aaya:
```
TCP    0.0.0.0:5001    0.0.0.0:0    LISTENING    12345
```

Toh command hoga:
```powershell
taskkill /F /PID 12345 /T
```

### तरीका 3: Sab Node Processes Kill Karo

```bash
taskkill /F /IM node.exe
```

⚠️ **Warning**: Ye sab Node processes ko kill kar dega. Agar aap koi aur Node app chal rahe hain, wo bhi band ho jayenge.

## 🚀 Server Ko Start Karne Ka Sahi Tarika

### Option 1: Startup Script Use Karein (Recommended)

```powershell
.\start-app.ps1
```

Ya
```cmd
start-app.bat
```

### Option 2: Manual Start

**Terminal 1 - Server:**
```bash
cd server
npm start
```

**Terminal 2 - Client:**
```bash
cd client
npm run dev
```

## ✅ Server Running Hai Ya Nahi - Check Kaise Karein

**Browser Mein:**
```
http://localhost:5001/api/health
```

Agar response aaye:
```json
{
  "status": "OK",
  "message": "MetaCodsar API is running"
}
```

Toh server theek chal raha hai! ✅

**PowerShell/Command Prompt Se:**
```powershell
curl http://localhost:5001/api/health
```

## 🔧 Common Issues aur Solutions

### Issue 1: "Cannot GET /api/health"
**Solution:** Server start nahi hua. `cd server` karke `npm start` karein.

### Issue 2: "Connection Refused"
**Solution:** 
1. Server running hai ya nahi check karein
2. Port 5001 free hai ya nahi check karein
3. Firewall settings check karein

### Issue 3: "Login Failed - Server Connection"
**Solution:**
1. Server terminal check karein - koi error hai?
2. Browser console (F12) mein errors check karein
3. `http://localhost:5001/api/health` browser mein open karein

### Issue 4: Port 5001 Ka Error, Lekin Server Start Ho Gaya
**Solution:** Kisi aur terminal mein koi purana server process chal raha hoga. Sab Node processes ko kill karein:
```bash
taskkill /F /IM node.exe
```

## 📞 Agar Abhi Bhi Problem Ho

1. **Server Terminal Check Karein** - Koi error message hai?
2. **Client Terminal Check Karein** - Koi error message hai?
3. **Browser Console (F12)** - Errors check karein
4. **Port Status Check:**
   ```powershell
   netstat -ano | findstr :5001
   netstat -ano | findstr :5173
   ```

## 💡 Quick Fix Commands Summary

```bash
# Port free karne ke liye
cd server && node free-port.js

# Server start karne ke liye
cd server && npm start

# Client start karne ke liye
cd client && npm run dev

# Sab kuch ek saath start karne ke liye
.\start-app.ps1
```

---

**Note:** Startup scripts automatically port ko check aur fix karti hain. Agar aap regularly use kar rahe hain, toh startup scripts use karein - wo reliable hain!

