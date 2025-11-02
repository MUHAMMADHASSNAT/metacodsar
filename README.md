# MetaCodsar - Complete Admin Dashboard

## 🚀 Quick Start

### Method 1: Using Startup Scripts (Recommended)

**Windows PowerShell:**
```powershell
.\start-app.ps1
```

**Windows Batch File:**
```cmd
start-app.bat
```

Ya double-click `start-app.bat` file.

Startup script automatically:
- ✅ Checks and frees port 5001 if needed
- ✅ Starts server on port 5001
- ✅ Tests server connection
- ✅ Starts client on port 5173

### Method 2: Manual Start

#### Start Server:
```bash
cd server
npm install
npm start
```
Server will run on: `http://localhost:5001`

#### Start Client (in new terminal):
```bash
cd client
npm install
npm run dev
```
Client will run on: `http://localhost:5173`

## 🔐 Login Credentials

**Admin Login:**
- Email: `admin@metacodsar.com`
- Password: `password`

**Team Login:**
- Use your team member credentials
- Or register through admin dashboard

## ✨ Features

### ✅ **Authentication System**
- JWT-based secure login
- Session persistence
- Protected admin routes
- Automatic logout functionality

### ✅ **Admin Dashboard**
- **Team Management**: Add, edit, remove team members
- **Profile Update**: Update your own profile (name, email, phone, designation)
- **Real-time Stats**: Dynamic team member count
- **Responsive Design**: Works on all devices

### ✅ **Team Management Features**
- **Add Team Member**: Complete form with validation
- **Edit Team Member**: Update existing member information
- **Remove Team Member**: Soft delete with confirmation
- **View Team List**: Table view with all member details

### ✅ **Profile Management**
- **Update Profile**: Change name, email, phone, designation
- **Real-time Updates**: Changes reflect immediately
- **Form Validation**: Proper input validation

## 🛠️ Technical Details

### **Frontend (React + TypeScript)**
- Authentication Context for state management
- Protected routes with role-based access
- Modern UI with Tailwind CSS
- Responsive design

### **Backend (Node.js + Express)**
- JWT authentication
- MongoDB database
- RESTful API endpoints
- Password hashing with bcrypt

### **API Endpoints**
- `POST /api/auth/login` - User login
- `PUT /api/auth/profile` - Update profile
- `GET /api/team` - Get team members
- `POST /api/team` - Add team member
- `PUT /api/team/:id` - Update team member
- `DELETE /api/team/:id` - Remove team member

## 📁 Project Structure

```
metacodsar/
├── client/                 # React frontend
│   ├── src/
│   │   ├── contexts/       # Authentication context
│   │   ├── components/     # Reusable components
│   │   └── pages/         # Page components
├── server/                 # Node.js backend
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   └── index.js           # Server entry point
└── start-app.bat          # Quick start script
```

## 🔧 Troubleshooting

### **Port 5001 Already in Use Error**

**Option 1: Use Free Port Script (Easiest)**
```bash
cd server
node free-port.js
```

**Option 2: Manual Port Cleanup**
```powershell
# Find process using port 5001
netstat -ano | findstr :5001

# Kill the process (replace <PID> with actual process ID)
taskkill /F /PID <PID> /T
```

**Option 3: Kill All Node Processes**
```bash
taskkill /F /IM node.exe
```

### **Server Connection Failed / Login Not Working**

1. **Check if Server is Running:**
   ```bash
   # Test server health
   curl http://localhost:5001/api/health
   # Ya browser mein open karein: http://localhost:5001/api/health
   ```

2. **Restart Server:**
   ```bash
   cd server
   npm start
   ```

3. **Check Browser Console:**
   - F12 press karein
   - Console tab check karein for errors
   - Network tab mein API calls check karein

4. **Verify Ports:**
   - Server: Port 5001
   - Client: Port 5173
   - Both should be accessible

### **MongoDB Connection Issues**
- MongoDB optional hai - server MongoDB ke bina bhi chalega
- Agar MongoDB chahiye, ensure it's running
- Check connection string in server/index.js

### **CORS Errors**
- Server already configured with proper CORS
- Agar issue ho, check `server/index.js` mein CORS origin settings

### **Client Not Connecting to Server**
1. Ensure both server and client are running
2. Check Vite proxy in `client/vite.config.ts`
3. Clear browser cache and restart
4. Try accessing server directly: `http://localhost:5001/api/health`

## 🎯 How to Use

1. **Login**: Use admin credentials to access dashboard
2. **Add Members**: Click "Add Team Member" button
3. **Edit Members**: Click "Edit" button next to any member
4. **Remove Members**: Click "Remove" button (with confirmation)
5. **Update Profile**: Click "Update Profile" button
6. **Logout**: Click "Logout" button

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🔒 Security Features

- JWT token authentication
- Password hashing
- Protected API routes
- Input validation
- CORS configuration

---

**Note**: Make sure MongoDB is running before starting the application. The admin user is automatically created when you run the seed script.

