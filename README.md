# 🚀 MetaCodsar - Professional Software Development Company

Modern web application built with React, Node.js, and MongoDB.

## 📁 Project Structure

```
metacodsar/
├── client/          # Frontend React application (Vite)
│   ├── src/         # Source files
│   ├── dist/        # Build output
│   └── vercel.json  # Vercel configuration
│
├── server/          # Backend Express API
│   ├── api/         # Vercel serverless entry point
│   ├── routes/      # API routes
│   ├── models/      # MongoDB models
│   ├── uploads/     # Uploaded files
│   └── vercel.json  # Vercel configuration
│
├── scripts/        # Development scripts
└── README.md       # This file
```

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd metacodsar
   ```

2. **Install dependencies**
   ```bash
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Setup Environment Variables**

   Create `server/.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/metacodsar
   JWT_SECRET=your-secret-key
   PORT=5001
   ```

   Create `client/.env`:
   ```env
   VITE_API_URL=http://localhost:5001
   ```

4. **Start Development Servers**

   **Option 1: Use startup scripts**
   ```bash
   # Windows
   start-app.bat
   
   # Or PowerShell
   start-app.ps1
   ```

   **Option 2: Manual start**
   ```bash
   # Terminal 1 - Server
   cd server
   npm start
   
   # Terminal 2 - Client
   cd client
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5001
   - Health Check: http://localhost:5001/api/health

## 🌐 Deployment to Vercel

Detailed deployment guide: [VERCEL-DEPLOYMENT.md](./VERCEL-DEPLOYMENT.md)

### Quick Steps:

1. **Deploy Server** (Backend API)
   - Root Directory: `server`
   - Framework: Other
   - Add MongoDB URI and JWT_SECRET in environment variables

2. **Deploy Client** (Frontend)
   - Root Directory: `client`
   - Framework: Vite
   - Add `VITE_API_URL` pointing to deployed server URL

## 📚 Features

- ✅ User Authentication (Admin & Team)
- ✅ Project Management
- ✅ Team Management
- ✅ Contact Form
- ✅ Statistics Dashboard
- ✅ File Upload (Images)
- ✅ Responsive Design

## 🔐 Default Credentials

**Admin Login:**
- Email: `admin@metacodsar.com`
- Password: `password`

*(Change password after first login in production!)*

## 🛠️ Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide Icons

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer (File Upload)

## 📝 Available Scripts

### Client
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Server
```bash
npm start        # Start production server
npm run dev      # Start with nodemon (auto-reload)
```

## 🐛 Troubleshooting

### Server won't start
- Check if port 5001 is available
- Run `node server/free-port.js` to free the port
- Check MongoDB connection

### Build errors
- Delete `node_modules` and reinstall
- Check TypeScript version compatibility
- Verify all environment variables are set

### Login issues
- Verify server is running: http://localhost:5001/api/health
- Check browser console for errors
- Verify JWT_SECRET is set in server

## 📄 License

This project is private and proprietary.

## 👥 Contributors

MetaCodsar Development Team

---

For detailed deployment instructions, see [VERCEL-DEPLOYMENT.md](./VERCEL-DEPLOYMENT.md)
