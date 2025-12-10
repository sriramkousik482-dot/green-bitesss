# 🌱 GreenBites - Complete Full Stack Application

A comprehensive Food Waste Management Platform connecting food donors with recipients to reduce food waste and improve food security.

## 📋 Project Overview

GreenBites is a full-stack web application with:
- **Frontend**: React + Vite + React Router
- **Backend**: Node.js + Express + MongoDB
- **Authentication**: JWT-based with role-based access control
- **4 User Roles**: Admin, Donor, Recipient, Analyst

## ✨ Key Features

### For Donors
- 🍽️ List surplus food donations
- 📍 Specify pickup locations and times
- ✅ Approve/reject recipient requests
- 📊 Track donation history and impact

### For Recipients
- 🔍 Browse available food donations
- 📝 Request food items
- 🚚 Choose pickup or delivery
- ⭐ Rate and provide feedback

### For Admins
- 👥 Manage all users
- 📦 Oversee all donations and requests
- ✅ Approve/reject requests
- 📈 View platform statistics

### For Analysts
- 📊 Access detailed analytics
- 📈 Track food waste reduction
- 🌍 View environmental impact
- 📉 Generate reports

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
cd greenbites
```

### 2. Setup Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Configure environment (already done)
# The .env file is pre-configured

# Start MongoDB (if using local)
mongod

# Seed the database with test data
npm run seed

# Start the backend server
npm run dev
```

Backend will run on: `http://localhost:5000`

### 3. Setup Frontend

Open a new terminal:

```bash
# Navigate to frontend folder (root of greenbites)
cd greenbites

# Install dependencies (if not already installed)
npm install

# Start the frontend
npm run dev
```

Frontend will run on: `http://localhost:5173`

## 🧪 Test Accounts

After running `npm run seed` in the backend, you can login with:

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Donor | `donor1` | `donor123` |
| Donor | `donor2` | `donor123` |
| Recipient | `recipient1` | `recipient123` |
| Recipient | `recipient2` | `recipient123` |
| Analyst | `analyst1` | `analyst123` |

## 📁 Project Structure

```
greenbites/
├── src/                          # Frontend React app
│   ├── components/               # React components
│   ├── pages/                    # Page components
│   ├── data/                     # Mock data (for development)
│   └── styles/                   # CSS styles
├── backend/                      # Backend API
│   ├── config/                   # Configuration
│   ├── controllers/              # Business logic
│   ├── middleware/               # Custom middleware
│   ├── models/                   # Database models
│   ├── routes/                   # API routes
│   ├── server.js                 # Entry point
│   ├── seed.js                   # Database seeding
│   └── Documentation/            # API docs
├── public/                       # Static assets
└── package.json                  # Frontend dependencies
```

## 🔗 API Integration

The frontend is ready to connect to the backend API. To integrate:

1. **Create API service file** (`src/services/api.js`):
```javascript
const API_URL = 'http://localhost:5000/api';

export const api = {
  // Auth
  login: (credentials) => fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  }),
  
  // Add more API calls as needed
};
```

2. **Update pages to use real API** instead of mock data

3. **Store JWT token** in localStorage/sessionStorage

4. **Add authentication headers** to protected requests

## 📚 Documentation

### Backend Documentation
- [`backend/README.md`](backend/README.md) - Backend overview
- [`backend/API_DOCUMENTATION.md`](backend/API_DOCUMENTATION.md) - Complete API reference
- [`backend/QUICK_START.md`](backend/QUICK_START.md) - Setup guide
- [`backend/BACKEND_COMPLETE.md`](backend/BACKEND_COMPLETE.md) - Implementation details

### Frontend Documentation
- [`PROJECT_README.md`](PROJECT_README.md) - Frontend overview
- [`DEVELOPMENT_GUIDE.md`](DEVELOPMENT_GUIDE.md) - Development guide

## 🛠️ Development

### Running Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Backend:**
- `npm run dev` - Start with auto-reload (nodemon)
- `npm start` - Start production server
- `npm run seed` - Seed database with test data

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control (RBAC)
- Input validation and sanitization
- CORS configuration
- Protected API routes

## 📊 Technology Stack

### Frontend
- **React 18** - UI library
- **React Router v6** - Routing
- **Vite** - Build tool
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 🚀 Deployment

### Backend Deployment
Deploy to: Heroku, AWS EC2, DigitalOcean, Azure, Google Cloud

### Frontend Deployment
Deploy to: Vercel, Netlify, GitHub Pages, AWS S3

### Database
Use MongoDB Atlas for production

## 📈 Future Enhancements

- [ ] Real-time notifications (Socket.io)
- [ ] Email notifications (SendGrid/Nodemailer)
- [ ] SMS alerts (Twilio)
- [ ] Image uploads (AWS S3/Cloudinary)
- [ ] Advanced search with filters
- [ ] Geolocation-based matching
- [ ] Mobile app (React Native)
- [ ] Payment integration (Stripe)
- [ ] Export reports (PDF/Excel)
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

ISC License

## 👥 Support

For issues or questions:
- Check the documentation files
- Review the API documentation
- Test with Postman/Thunder Client

---

## 🎯 Current Status

✅ **Frontend**: Complete with all pages and routing  
✅ **Backend**: Complete with full API and authentication  
✅ **Database**: Models and seed data ready  
✅ **Documentation**: Comprehensive guides available  
🔄 **Integration**: Ready for API integration  

---

**🌱 GreenBites - Reducing Food Waste, One Donation at a Time**

Made with ❤️ for a better tomorrow
