# 🗄️ MongoDB Connection Setup Guide

## 📋 Overview
Yeh guide MongoDB connection setup karne ke liye hai. MongoDB database ke bina login, projects, aur team features kaam nahi karenge.

---

## 🔧 Setup Steps

### 1️⃣ MongoDB Atlas Setup (Cloud - Recommended)

#### Step 1: MongoDB Atlas Account Banao
1. https://www.mongodb.com/cloud/atlas pe jao
2. Free account banao (M0 cluster free hai)
3. Cluster create karo

#### Step 2: Database User Banao
1. Atlas Dashboard → **Database Access** → **Add New Database User**
2. Username aur password set karo
3. **Database User Privileges**: "Read and write to any database" select karo
4. **Add User** click karo

#### Step 3: Network Access Setup
1. Atlas Dashboard → **Network Access** → **Add IP Address**
2. **Add Current IP Address** click karo (development ke liye)
3. Ya **Allow Access from Anywhere** (0.0.0.0/0) - Production ke liye
4. **Confirm** click karo

#### Step 4: Connection String Copy Karo
1. Atlas Dashboard → **Database** → **Connect**
2. **Connect your application** select karo
3. Driver: **Node.js**, Version: **5.5 or later**
4. Connection string copy karo:
   ```
   mongodb+srv://<db_username>:<db_password>@cluster0.7r3ulvb.mongodb.net/?appName=Cluster0
   ```
5. `<db_username>` ko apne MongoDB username se replace karo
6. `<db_password>` ko apne MongoDB password se replace karo
7. Database name automatically add ho jayega (`metacodsar`) - ya manually add karo:
   ```
   mongodb+srv://username:password@cluster0.7r3ulvb.mongodb.net/metacodsar?appName=Cluster0
   ```

---

### 2️⃣ Local MongoDB Setup (Development)

Agar local MongoDB use karna hai:

1. MongoDB install karo: https://www.mongodb.com/try/download/community
2. MongoDB service start karo
3. Connection string:
   ```
   mongodb://localhost:27017/metacodsar
   ```

---

### 3️⃣ Environment Variable Setup

#### Development (Local)
1. `server` folder mein `.env` file banao
2. Add karo:
   ```env
   # MongoDB Atlas Connection (Your Cluster)
   MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.7r3ulvb.mongodb.net/metacodsar?appName=Cluster0
   
   # Ya simple format (database name automatically add ho jayega)
   # MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.7r3ulvb.mongodb.net/?appName=Cluster0
   
   # Ya local MongoDB
   # MONGODB_URI=mongodb://localhost:27017/metacodsar
   
   JWT_SECRET=your-secret-key-here
   PORT=5001
   ```
   
   **Important**: 
   - `your_username` ko apne MongoDB Atlas username se replace karo
   - `your_password` ko apne MongoDB Atlas password se replace karo
   - Database name (`metacodsar`) automatically add ho jayega agar missing ho

#### Production (Vercel)
1. Vercel Dashboard → Server Project → **Settings** → **Environment Variables**
2. Add karo:
   - **Name**: `MONGODB_URI`
   - **Value**: `mongodb+srv://your_username:your_password@cluster0.7r3ulvb.mongodb.net/metacodsar?appName=Cluster0`
   - **Environment**: Production (ya All)
3. **Save** click karo
4. **Redeploy** karo
   
   **Note**: `your_username` aur `your_password` ko apne actual credentials se replace karo

---

## ✅ Connection String Format

### MongoDB Atlas (Cloud) - Your Cluster
```
mongodb+srv://username:password@cluster0.7r3ulvb.mongodb.net/metacodsar?appName=Cluster0&retryWrites=true&w=majority
```

**Ya simple format** (database name automatically add ho jayega):
```
mongodb+srv://username:password@cluster0.7r3ulvb.mongodb.net/?appName=Cluster0
```

### Local MongoDB
```
mongodb://localhost:27017/database
```

### Important Notes:
- ✅ Username aur password mein special characters ho to URL encode karo
- ✅ Database name optional hai (default: `test`)
- ✅ `retryWrites=true&w=majority` recommended hai

---

## 🔍 Connection Testing

### Method 1: Server Start Karke Check Karo
```bash
cd server
npm start
```

Console mein dekho:
- ✅ `MongoDB Connected Successfully!` - Connection successful
- ❌ `MongoDB Connection Failed!` - Error check karo

### Method 2: Health Check API
```bash
# Browser ya Postman mein
GET http://localhost:5001/api/health
```

Response:
```json
{
  "status": "OK",
  "database": {
    "status": "connected",
    "connected": true,
    "name": "metacodsar",
    "host": "cluster.mongodb.net"
  }
}
```

---

## ❌ Common Errors aur Solutions

### Error 1: Authentication Failed
**Problem**: Username ya password galat hai

**Solution**:
1. MongoDB Atlas → Database Access
2. User credentials verify karo
3. Password mein special characters ho to URL encode karo
4. Connection string update karo

### Error 2: IP Whitelist Error
**Problem**: IP address allow nahi hai

**Solution**:
1. MongoDB Atlas → Network Access
2. **Add IP Address** → **Add Current IP Address**
3. Ya **Allow Access from Anywhere** (0.0.0.0/0)

### Error 3: ENOTFOUND / DNS Error
**Problem**: Cluster URL galat hai ya internet issue

**Solution**:
1. Internet connection check karo
2. Cluster URL verify karo
3. MongoDB Atlas cluster status check karo

### Error 4: Timeout Error
**Problem**: Server slow hai ya unreachable

**Solution**:
1. MongoDB Atlas cluster status check karo
2. Network access settings verify karo
3. Connection string format check karo
4. Retry karo (auto-retry 5 times hota hai)

### Error 5: Invalid URI Format
**Problem**: Connection string format galat hai

**Solution**:
- ✅ Correct: `mongodb+srv://user:pass@cluster.mongodb.net/db`
- ❌ Wrong: `mongodb://user:pass@cluster.mongodb.net/db` (Atlas ke liye)
- ✅ Local: `mongodb://localhost:27017/db`

---

## 🔄 Auto-Retry Mechanism

Server automatically retry karta hai:
- **Max Retries**: 5 times
- **Retry Delay**: 3 seconds
- **Auto-reconnect**: Disconnect hone pe automatically reconnect

---

## 📝 Connection String Examples

### Example 1: MongoDB Atlas (Your Cluster - Full Format)
```env
MONGODB_URI=mongodb+srv://myuser:mypassword123@cluster0.7r3ulvb.mongodb.net/metacodsar?appName=Cluster0&retryWrites=true&w=majority
```

### Example 2: MongoDB Atlas (Your Cluster - Simple Format)
```env
MONGODB_URI=mongodb+srv://myuser:mypassword123@cluster0.7r3ulvb.mongodb.net/?appName=Cluster0
```
**Note**: Database name (`metacodsar`) automatically add ho jayega agar missing ho

### Example 3: Local MongoDB
```env
MONGODB_URI=mongodb://localhost:27017/metacodsar
```

---

## 🎯 Quick Setup Checklist

- [ ] MongoDB Atlas account banao
- [ ] Cluster create karo
- [ ] Database user banao
- [ ] Network access setup karo (IP whitelist)
- [ ] Connection string copy karo
- [ ] `.env` file mein `MONGODB_URI` add karo
- [ ] Server start karo
- [ ] Health check karo: `http://localhost:5001/api/health`
- [ ] Console mein "✅ MongoDB Connected Successfully!" dekho

---

## 💡 Tips

1. **Development**: Local MongoDB use karo (faster)
2. **Production**: MongoDB Atlas use karo (reliable)
3. **Security**: Password strong rakho, IP whitelist use karo
4. **Performance**: Connection pooling automatically handle hota hai
5. **Monitoring**: MongoDB Atlas dashboard se connection monitor karo

---

## 🆘 Help

Agar connection nahi ho raha:
1. Server console check karo (detailed errors dikhenge)
2. MongoDB Atlas dashboard check karo
3. Network access settings verify karo
4. Connection string format check karo
5. Health check API test karo

---

**✅ Setup complete hone ke baad server restart karo aur connection verify karo!**

