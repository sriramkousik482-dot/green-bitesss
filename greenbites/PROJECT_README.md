# GreenBites - Food Waste Management Platform

## Project Overview

GreenBites is a comprehensive food waste management platform designed to reduce food wastage and improve food security. The platform connects food donors with recipient organizations, enables data tracking and analysis, and provides administrative oversight.

## Features

### 🔐 User Roles

1. **Admin**
   - Manage platform content
   - Oversee user interactions
   - Review and approve/reject food requests
   - Monitor all donations and users
   - Ensure data accuracy

2. **Food Donor**
   - List surplus food donations
   - Specify food type, quantity, expiry date, and pickup location
   - Track donation status (available/claimed)
   - View donation impact and history
   - Coordinate food pickups

3. **Recipient Organization**
   - Browse available food donations
   - Request food donations with detailed justification
   - **Special Feature**: Required to provide a minimum 50-character reason explaining why they need the food
   - Manage logistics for food collection
   - Track request status (pending/approved/rejected)
   - Distribute food to those in need

4. **Data Analyst**
   - Track food waste trends over time
   - Analyze donation patterns and metrics
   - Generate comprehensive reports
   - View environmental impact (CO₂ saved)
   - Access insights and recommendations
   - Export data for further analysis

## Special Features

### Reason Requirement for Recipients ⭐
When recipient organizations request food donations, they must provide a detailed explanation (minimum 50 characters) explaining:
- Why they need the food
- Who will benefit from it
- How it aligns with their organization's mission

This ensures transparency and helps admins make informed approval decisions.

## Technology Stack

- **Frontend**: React 19.1.1
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Styling**: Pure CSS (No Tailwind)
- **Language**: JavaScript

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd greenbites
```

2. Install dependencies:
```bash
npm install
```

3. **Add the Logo**:
   - Save the Green Bites logo image as `logo.jpg`
   - Place it in the `public` folder: `public/logo.jpg`
   - The logo will be displayed throughout the application

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Demo Credentials

### Admin
- Username: `admin`
- Password: `admin123`

### Food Donor
- Username: `donor1`
- Password: `donor123`

### Recipient Organization
- Username: `recipient1`
- Password: `recipient123`

### Data Analyst
- Username: `analyst1`
- Password: `analyst123`

## Project Structure

```
greenbites/
├── public/
│   └── logo.jpg (add your logo here)
├── src/
│   ├── components/
│   │   └── Navbar.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── DonorDashboard.jsx
│   │   ├── RecipientDashboard.jsx
│   │   └── AnalystDashboard.jsx
│   ├── styles/
│   │   ├── Navbar.css
│   │   ├── Home.css
│   │   ├── Login.css
│   │   └── Dashboard.css
│   ├── data/
│   │   └── mockData.js
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── package.json
└── README.md
```

## Key Functionalities

### Admin Dashboard
- View platform statistics and metrics
- Manage all donations (view status, donor info, quantities)
- Review pending requests with detailed reasons
- Approve or reject requests
- Monitor all users on the platform
- Track recent activity

### Donor Dashboard
- Create new food donations with full details
- Track all submitted donations
- View donation status (available/claimed)
- See which organizations claimed their donations
- Monitor total impact (donations made, weight donated)

### Recipient Dashboard
- Browse all available food donations
- Request donations with mandatory reason (50+ characters)
- View request history and status
- See approved and pending requests
- Access donor and pickup information

### Analyst Dashboard
- View comprehensive impact metrics
- Analyze donation status breakdown
- Track food type distribution
- Monitor user engagement statistics
- View donation claim rates
- Access key insights and recommendations
- Export reports
- Track environmental impact (CO₂ savings)

## Design Philosophy

The application features a **professional, corporate-grade design** with:

- **Color Scheme**: Green-based palette representing sustainability
  - Primary: `#2d5016` (Dark Green)
  - Secondary: `#4a7c2c` (Medium Green)
  - Accent: `#a8e063` (Light Green)
  
- **Modern UI Elements**:
  - Gradient backgrounds
  - Card-based layouts
  - Smooth animations and transitions
  - Responsive design for all devices
  - Professional typography
  - Intuitive navigation
  - Clear visual hierarchy

- **User Experience**:
  - Role-based dashboards
  - Clear call-to-action buttons
  - Form validation
  - Status indicators
  - Interactive data visualizations
  - Modal dialogs for important actions

## Environmental Impact Tracking

The platform calculates and displays:
- Total food saved (kg)
- Meals provided to communities
- CO₂ emissions prevented
- Equivalent trees planted

## Future Enhancements

- Real-time notifications
- Email integration
- Google Maps integration for pickup locations
- Mobile application
- Advanced analytics with charts
- Payment gateway for donations
- Multi-language support

## License

This project is created for educational purposes as part of the FEDF-PS09 problem statement.

## Support

For any issues or questions, please contact the development team.

---

**Green Bites** - Fighting food waste, one meal at a time. 🌱
