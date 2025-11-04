# 🚀 MetaCodsar - Quick Start Guide

## ✅ Server aur Client Ab Start Ho Gaye Hain!

Aapke paas ab **2 PowerShell windows** khuli hongi:

1. **Server Window** - Port 5001 par
2. **Client Window** - Port 5173 par

## 🔍 Server Check Karein:

Browser mein jao: **http://localhost:5001/api/health**

Agar yeh dikhe:
```json
{
  "status": "OK",
  "message": "MetaCodsar API is running"
}
```
Toh server **SAHI CHAL RAHA HAI!** ✅

## 📱 Client Check Karein:

Browser mein jao: **http://localhost:5173/login**

## 🔐 Login Credentials:

- **Email:** `admin@metacodsar.com`
- **Password:** `password`

## ❌ Agar Abhi Bhi Login Nahi Ho Raha:

### Step 1: Server Status Check
```
http://localhost:5001/api/health
```

### Step 2: Server Window Check Karein
Server window mein koi **red error** dikh raha hai?

### Step 3: Client Window Check Karein  
Client window mein koi error dikh raha hai?

### Step 4: Port Check
```powershell
netstat -ano | findstr :5001
netstat -ano | findstr :5173
```

## 🔧 Manual Start (Agar Window Band Ho Jaye):

### Server Start:
```powershell
cd server
npm start
```

### Client Start (Nayi Window):
```powershell
cd client
npm run dev
```

## 💡 Quick Fix Commands:

**Port Free Karne Ke Liye:**
```powershell
cd server
node free-port.js
```

**Server Check Karne Ke Liye:**
```powershell
node check-server.js
```

**Sab Kuch Restart:**
```powershell
# Sab Node processes kill karo
taskkill /F /IM node.exe

# Phir startup script run karo
.\start-app.bat
```

---

**Note:** Agar koi bhi error aaye, toh server/client windows mein exact error message share karein!

