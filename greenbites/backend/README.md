# GreenBites Backend API

Backend API for the GreenBites Food Waste Management Platform built with Node.js, Express, and MongoDB.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Admin can manage all users
- **Donation Management**: Create, update, and track food donations
- **Request Management**: Recipients can request food, donors/admins can approve/reject
- **Analytics**: Comprehensive analytics for tracking food waste reduction
- **Real-time Updates**: Track donation and request statuses

## Tech Stack

- **Node.js** & **Express.js**: Server framework
- **MongoDB** & **Mongoose**: Database
- **JWT**: Authentication
- **bcryptjs**: Password hashing
- **express-validator**: Input validation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/greenbites
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

5. Start MongoDB (if running locally):
```bash
mongod
```

6. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PUT /api/users/:id/toggle-status` - Activate/deactivate user

### Donations
- `POST /api/donations` - Create donation (Donor/Admin)
- `GET /api/donations` - Get all donations
- `GET /api/donations/:id` - Get donation by ID
- `PUT /api/donations/:id` - Update donation
- `DELETE /api/donations/:id` - Delete donation
- `PUT /api/donations/:id/claim` - Claim donation (Recipient)
- `PUT /api/donations/:id/complete` - Mark as completed

### Requests
- `POST /api/requests` - Create request (Recipient)
- `GET /api/requests` - Get all requests
- `GET /api/requests/:id` - Get request by ID
- `PUT /api/requests/:id` - Update request
- `PUT /api/requests/:id/approve` - Approve request (Admin/Donor)
- `PUT /api/requests/:id/reject` - Reject request (Admin/Donor)
- `PUT /api/requests/:id/complete` - Complete request
- `DELETE /api/requests/:id` - Cancel request

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard stats
- `GET /api/analytics/food-waste` - Get food waste analytics (Admin/Analyst)
- `GET /api/analytics/impact` - Get impact metrics (Admin/Analyst)

## User Roles

1. **Admin**: Full access to all features, user management
2. **Donor**: Create and manage donations, approve/reject requests
3. **Recipient**: Request food, view available donations
4. **Analyst**: View analytics and reports

## Request/Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ /* validation errors if any */ ]
}
```

## Authentication

Protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

Get the token from the login/register response and include it in subsequent requests.

## Database Models

### User
- fullName, username, email, password
- role (admin/donor/recipient/analyst)
- phone, address, organization
- isActive, isVerified

### Donation
- donor (User reference)
- foodType, category, quantity
- expiryDate, pickupLocation, pickupTime
- status (available/claimed/completed/expired/cancelled)
- claimedBy, rating, feedback

### Request
- recipient (User reference)
- donation (Donation reference)
- requestedQuantity, deliveryMethod
- status (pending/approved/rejected/completed/cancelled)
- approvedBy, approvedAt, completedAt

## Development

### Running Tests
```bash
npm test
```

### Code Structure
```
backend/
├── config/          # Database configuration
├── controllers/     # Request handlers
├── middleware/      # Auth, validation middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── server.js        # Entry point
└── package.json
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/greenbites |
| JWT_SECRET | JWT secret key | - |
| JWT_EXPIRE | Token expiration | 7d |
| CLIENT_URL | Frontend URL for CORS | http://localhost:5173 |

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

ISC
