# 🚀 GreenBites Backend - Quick Start Guide

## Prerequisites Checklist

- ✅ Node.js installed (v14+)
- ✅ MongoDB installed (local) OR MongoDB Atlas account (cloud)
- ✅ npm or yarn package manager

## Setup Steps

### Step 1: Install Dependencies

Open a terminal in the `backend` folder and run:

```bash
cd backend
npm install
```

Or double-click: `setup-backend.bat`

### Step 2: Configure Environment

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file with your settings:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/greenbites
   JWT_SECRET=your_secret_key_change_this
   JWT_EXPIRE=7d
   CLIENT_URL=http://localhost:5173
   ```

### Step 3: Start MongoDB

**Option A: Local MongoDB**
```bash
mongod
```

**Option B: MongoDB Atlas (Cloud)**
- Create account at https://www.mongodb.com/cloud/atlas
- Create a cluster
- Get connection string
- Update `MONGODB_URI` in `.env`

### Step 4: Seed the Database (Optional)

Populate the database with test data:

```bash
npm run seed
```

This creates:
- Admin account: `admin` / `admin123`
- 2 Donor accounts: `donor1`, `donor2` / `donor123`
- 2 Recipient accounts: `recipient1`, `recipient2` / `recipient123`
- 1 Analyst account: `analyst1` / `analyst123`
- Sample donations

### Step 5: Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Or double-click: `start-backend.bat`

The server will start at: **http://localhost:5000**

## Testing the API

### 1. Using Browser
Visit: http://localhost:5000

You should see:
```json
{
  "message": "Welcome to GreenBites API",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

### 2. Using Postman/Thunder Client

**Test Login:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

Copy the `token` from the response.

**Test Protected Route:**
```
GET http://localhost:5000/api/auth/me
Authorization: Bearer <paste_token_here>
```

### 3. Using cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get current user (replace TOKEN)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

## Common Issues & Solutions

### Issue: "MongoDB connection error"
**Solution:** 
- Make sure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For local: `mongodb://localhost:27017/greenbites`
- For Atlas: Use the connection string from your cluster

### Issue: "Port 5000 already in use"
**Solution:**
- Change `PORT` in `.env` to another port (e.g., 5001)
- Or stop the process using port 5000

### Issue: "JWT must be provided"
**Solution:**
- Include the token in Authorization header
- Format: `Authorization: Bearer <token>`

### Issue: "npm: command not found"
**Solution:**
- Install Node.js from https://nodejs.org/
- Restart your terminal

## API Documentation

Full API documentation available in:
- `API_DOCUMENTATION.md` - Detailed endpoint documentation
- `README.md` - Project overview and setup

## Folder Structure

```
backend/
├── config/
│   └── db.js                    # Database configuration
├── controllers/
│   ├── authController.js        # Authentication logic
│   ├── donationController.js    # Donation management
│   ├── requestController.js     # Request handling
│   ├── userController.js        # User management
│   └── analyticsController.js   # Analytics & stats
├── middleware/
│   ├── auth.js                  # JWT authentication
│   └── validate.js              # Input validation
├── models/
│   ├── User.js                  # User schema
│   ├── Donation.js              # Donation schema
│   └── Request.js               # Request schema
├── routes/
│   ├── auth.js                  # Auth routes
│   ├── donations.js             # Donation routes
│   ├── requests.js              # Request routes
│   ├── users.js                 # User routes
│   └── analytics.js             # Analytics routes
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── server.js                    # Main server file
├── seed.js                      # Database seeding
├── package.json                 # Dependencies
└── README.md                    # Documentation
```

## Next Steps

1. ✅ Backend is running
2. 📱 Connect your frontend (update API URLs)
3. 🧪 Test all endpoints with Postman
4. 🎨 Customize as needed
5. 🚀 Deploy to production

## Production Deployment

Before deploying:

1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Enable HTTPS
4. Set up proper MongoDB connection (Atlas recommended)
5. Configure CORS properly for your domain
6. Add rate limiting (consider express-rate-limit)
7. Set up logging (consider winston or morgan)
8. Add monitoring (consider PM2)

## Support

For issues or questions:
- Check `API_DOCUMENTATION.md`
- Review `README.md`
- Check MongoDB connection
- Verify environment variables

---

**🌱 GreenBites Backend Ready!**

Happy coding! 🚀
