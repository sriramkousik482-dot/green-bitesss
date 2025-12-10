# 🚨 BACKEND SETUP - ACTION REQUIRED

## Issue: MongoDB Not Installed

The backend needs MongoDB to run. You have **2 options**:

---

## ✅ OPTION 1: Use MongoDB Atlas (Cloud - RECOMMENDED & EASIEST)

**No installation needed! Works immediately!**

### Steps:

1. **Create Free Account**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up (it's free!)

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select a region close to you
   - Click "Create Cluster"

3. **Setup Database Access**
   - Go to "Database Access" in left menu
   - Click "Add New Database User"
   - Create username and password (remember these!)
   - Set "Database User Privileges" to "Read and write to any database"

4. **Setup Network Access**
   - Go to "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access From Anywhere" (for development)
   - Confirm

5. **Get Connection String**
   - Go back to "Database"
   - Click "Connect" on your cluster
   - Click "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@...`)

6. **Update Backend .env File**
   - Open: `backend\.env`
   - Replace the MONGODB_URI line with your connection string:
   ```
   MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/greenbites?retryWrites=true&w=majority
   ```
   - Replace `your_username` and `your_password` with your credentials
   - Replace `<password>` with your actual password

7. **Start Backend**
   ```
   cd backend
   cmd /c "node server.js"
   ```

---

## 🔧 OPTION 2: Install MongoDB Locally

### Steps:

1. **Download MongoDB**
   - Go to: https://www.mongodb.com/try/download/community
   - Download Windows version (MSI)

2. **Install MongoDB**
   - Run the installer
   - Choose "Complete" installation
   - Install as a Windows Service (check the box)
   - Uncheck "Install MongoDB Compass" (optional GUI)

3. **Verify Installation**
   ```
   mongod --version
   ```

4. **Start MongoDB Service**
   - Open Services (Win+R, type `services.msc`)
   - Find "MongoDB" service
   - Click "Start"

   OR run in terminal:
   ```
   net start MongoDB
   ```

5. **Start Backend**
   ```
   cd backend
   cmd /c "node server.js"
   ```

---

## 🚀 After Setup - Start Everything

### 1. Start Backend (Terminal 1)
```bash
cd backend
cmd /c "node server.js"
```

You should see:
```
Server running in development mode on port 5000
MongoDB Connected: ...
```

### 2. Seed Database (Optional - One Time Only)
```bash
cd backend
cmd /c "npm run seed"
```

This creates test accounts:
- admin / admin123
- donor1 / donor123
- recipient1 / recipient123

### 3. Start Frontend (Terminal 2)
```bash
npm run dev
```

### 4. Test It!
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Try registering a new account!

---

## ❓ Which Option Should I Choose?

**Choose MongoDB Atlas (Option 1) if:**
- ✅ You want the fastest setup
- ✅ You don't want to install anything
- ✅ You're just testing/learning
- ✅ You want it to work immediately

**Choose Local MongoDB (Option 2) if:**
- You want full control
- You're developing offline
- You need better performance
- You're experienced with databases

---

## 🆘 Troubleshooting

### Backend shows "Connection Refused"
- MongoDB is not running
- Check your MongoDB service is started
- Or verify your Atlas connection string is correct

### "npm: cannot be loaded"
Use `cmd /c` before npm commands:
```bash
cmd /c "npm install"
cmd /c "node server.js"
```

### Backend works but Register doesn't save users
- Check MongoDB is connected (look for "MongoDB Connected" message)
- Check your .env file has correct MONGODB_URI

---

## 📝 Quick Checklist

- [ ] MongoDB setup (Atlas or Local)
- [ ] Backend dependencies installed (`npm install`)
- [ ] `.env` file configured with MongoDB URI
- [ ] Backend server running (port 5000)
- [ ] Database seeded (optional, for demo accounts)
- [ ] Frontend running (port 5173)
- [ ] Can register new users
- [ ] Can login with created users

---

**Need Help?** Check the following files:
- `backend/README.md` - Full backend documentation
- `backend/QUICK_START.md` - Detailed setup guide
- `backend/API_DOCUMENTATION.md` - API reference

**I recommend MongoDB Atlas (Option 1) - it's free and takes 5 minutes!** 🚀
