# GreenBites API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_token>
```

---

## 1. Authentication Endpoints

### 1.1 Register User
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "role": "donor",
  "phone": "+1234567890",
  "organization": {
    "name": "Acme Restaurant",
    "type": "Restaurant"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "6547abc123def456",
    "fullName": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "donor",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 1.2 Login
**POST** `/auth/login`

Authenticate user and get token.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "6547abc123def456",
    "fullName": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "donor",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 1.3 Get Current User
**GET** `/auth/me`

Get authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "6547abc123def456",
    "fullName": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "donor",
    "phone": "+1234567890",
    "isActive": true
  }
}
```

### 1.4 Update Profile
**PUT** `/auth/profile`

Update user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "fullName": "John Smith",
  "phone": "+1234567899",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  }
}
```

---

## 2. Donation Endpoints

### 2.1 Create Donation
**POST** `/donations`

Create a new food donation (Donor/Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "foodType": "Fresh Vegetables",
  "category": "Vegetables",
  "quantity": {
    "amount": 50,
    "unit": "kg"
  },
  "expiryDate": "2025-12-31T23:59:59.000Z",
  "pickupLocation": {
    "address": "123 Restaurant St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "coordinates": {
      "lat": 40.7128,
      "lng": -74.0060
    }
  },
  "pickupTime": {
    "from": "2025-12-01T10:00:00.000Z",
    "to": "2025-12-01T18:00:00.000Z"
  },
  "description": "Fresh organic vegetables from farm"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Donation created successfully",
  "data": {
    "_id": "6547donation123",
    "foodType": "Fresh Vegetables",
    "category": "Vegetables",
    "status": "available",
    "donor": "6547abc123def456",
    "createdAt": "2025-11-30T10:00:00.000Z"
  }
}
```

### 2.2 Get All Donations
**GET** `/donations`

Get all donations with optional filters.

**Query Parameters:**
- `status` - Filter by status (available, claimed, completed, expired, cancelled)
- `category` - Filter by food category
- `city` - Filter by city

**Example:** `/donations?status=available&city=NewYork`

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "6547donation123",
      "foodType": "Fresh Vegetables",
      "category": "Vegetables",
      "quantity": {
        "amount": 50,
        "unit": "kg"
      },
      "status": "available",
      "donor": {
        "_id": "6547abc123def456",
        "fullName": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

### 2.3 Get Single Donation
**GET** `/donations/:id`

Get detailed information about a specific donation.

### 2.4 Update Donation
**PUT** `/donations/:id`

Update donation details (Owner/Admin only).

### 2.5 Delete Donation
**DELETE** `/donations/:id`

Delete a donation (Owner/Admin only).

### 2.6 Claim Donation
**PUT** `/donations/:id/claim`

Claim an available donation (Recipient only).

### 2.7 Complete Donation
**PUT** `/donations/:id/complete`

Mark donation as completed.

**Request Body:**
```json
{
  "rating": 5,
  "feedback": "Great donation, helped many people!"
}
```

---

## 3. Request Endpoints

### 3.1 Create Request
**POST** `/requests`

Create a food request (Recipient only).

**Request Body:**
```json
{
  "donation": "6547donation123",
  "requestedQuantity": {
    "amount": 25,
    "unit": "kg"
  },
  "deliveryMethod": "pickup",
  "message": "We need this for our community kitchen",
  "preferredPickupTime": "2025-12-01T14:00:00.000Z"
}
```

### 3.2 Get All Requests
**GET** `/requests`

Get all requests (filtered by user role).

**Query Parameters:**
- `status` - Filter by status (pending, approved, rejected, completed, cancelled)

### 3.3 Get Single Request
**GET** `/requests/:id`

Get detailed information about a specific request.

### 3.4 Update Request
**PUT** `/requests/:id`

Update request details (Owner/Admin only).

### 3.5 Approve Request
**PUT** `/requests/:id/approve`

Approve a pending request (Admin/Donor only).

### 3.6 Reject Request
**PUT** `/requests/:id/reject`

Reject a pending request (Admin/Donor only).

**Request Body:**
```json
{
  "reason": "Food already claimed by another recipient"
}
```

### 3.7 Complete Request
**PUT** `/requests/:id/complete`

Mark request as completed.

### 3.8 Cancel Request
**DELETE** `/requests/:id`

Cancel a request (Owner/Admin only).

---

## 4. User Management Endpoints (Admin Only)

### 4.1 Get All Users
**GET** `/users`

Get all users with optional filters.

**Query Parameters:**
- `role` - Filter by role (admin, donor, recipient, analyst)
- `isActive` - Filter by active status (true/false)

### 4.2 Get User by ID
**GET** `/users/:id`

Get detailed user information.

### 4.3 Update User
**PUT** `/users/:id`

Update user information.

### 4.4 Delete User
**DELETE** `/users/:id`

Delete a user account.

### 4.5 Toggle User Status
**PUT** `/users/:id/toggle-status`

Activate or deactivate a user account.

---

## 5. Analytics Endpoints

### 5.1 Dashboard Analytics
**GET** `/analytics/dashboard`

Get role-based dashboard statistics.

**Response (Admin/Analyst):**
```json
{
  "success": true,
  "data": {
    "totalDonations": 150,
    "totalUsers": 75,
    "totalRequests": 200,
    "totalFoodSaved": 2500,
    "donationsByStatus": [
      { "_id": "available", "count": 30 },
      { "_id": "completed", "count": 100 }
    ],
    "recentDonations": [...],
    "recentRequests": [...]
  }
}
```

### 5.2 Food Waste Analytics
**GET** `/analytics/food-waste`

Get detailed food waste analytics (Admin/Analyst only).

**Response:**
```json
{
  "success": true,
  "data": {
    "foodByCategory": [
      {
        "_id": "Vegetables",
        "totalAmount": 1200,
        "count": 45
      }
    ],
    "monthlyTrends": [...],
    "cityDistribution": [...]
  }
}
```

### 5.3 Impact Metrics
**GET** `/analytics/impact`

Get environmental and social impact metrics (Admin/Analyst only).

**Response:**
```json
{
  "success": true,
  "data": {
    "totalFoodSaved": 2500,
    "totalDonations": 150,
    "totalDonors": 30,
    "totalRecipients": 40,
    "estimatedPeopleFed": 5000,
    "estimatedCO2Saved": 6250
  }
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

### Validation Error Example

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding in production.

## CORS

CORS is enabled for the frontend URL specified in `.env` file (`CLIENT_URL`).

## File Uploads

Image upload for donations is currently stored as URLs. To implement file uploads, integrate with services like AWS S3 or Cloudinary.
