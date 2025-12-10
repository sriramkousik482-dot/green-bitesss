# GreenBites - Development Guide

## Quick Start

1. **Add the Logo** (IMPORTANT!)
   - Save your GreenBites logo image as `logo.jpg`
   - Place it in the `public` folder: `public/logo.jpg`

2. **Run the Application**
   
   Option A - Using the batch file (Windows):
   - Double-click `start-dev.bat`
   
   Option B - Using terminal:
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - Open your browser
   - Navigate to: http://localhost:5173

## Login Credentials

### Admin Dashboard
- Username: `admin`
- Password: `admin123`
- Features: Manage users, approve requests, monitor platform

### Food Donor Dashboard  
- Username: `donor1`
- Password: `donor123`
- Features: Add food donations, track status, view impact

### Recipient Organization Dashboard
- Username: `recipient1`
- Password: `recipient123`
- Features: Browse donations, request food (with reason), track requests
- **Special**: Must provide 50+ character reason when requesting food

### Data Analyst Dashboard
- Username: `analyst1`
- Password: `analyst123`
- Features: View analytics, generate reports, track trends

## Project Features

✅ Complete role-based authentication
✅ Professional corporate-style design (no Tailwind CSS)
✅ Responsive layout for all devices
✅ Admin can approve/reject requests
✅ Donors can list and track donations
✅ Recipients must provide detailed reasons for food requests (50+ chars)
✅ Analysts can view comprehensive data and insights
✅ Real-time status updates
✅ Impact tracking (CO2 saved, meals provided, etc.)
✅ Clean, modern UI with green sustainability theme

## Testing the Application

### As Admin:
1. Login with admin credentials
2. View overview dashboard with statistics
3. Check "Pending Requests" tab
4. Review recipient reasons for food requests
5. Approve or reject requests
6. View all donations and users

### As Food Donor:
1. Login with donor credentials
2. Click "+ Add New Donation"
3. Fill in food details (type, quantity, expiry, location)
4. Submit donation
5. View your donations list with status updates

### As Recipient Organization:
1. Login with recipient credentials
2. Browse "Available Donations" tab
3. Click "Request This Donation" on any item
4. **Important**: Provide detailed reason (minimum 50 characters)
   - Example: "We run a community kitchen serving 100+ homeless people daily..."
5. Submit request
6. Check "My Requests" tab to see status

### As Data Analyst:
1. Login with analyst credentials
2. View impact metrics dashboard
3. Analyze donation status breakdown
4. Review food type distribution
5. Check user engagement statistics
6. Read insights and recommendations

## Customization

### Colors
The project uses a green sustainability theme:
- Primary: #2d5016 (Dark Green)
- Secondary: #4a7c2c (Medium Green)  
- Accent: #a8e063 (Light Green)

### Styling
All styles are in the `src/styles/` folder:
- `Navbar.css` - Navigation bar styles
- `Home.css` - Landing page styles
- `Login.css` - Login page styles
- `Dashboard.css` - All dashboard styles

## Troubleshooting

**Logo not showing?**
- Make sure logo.jpg is in the public folder
- Clear browser cache and refresh

**Can't login?**
- Use exact credentials from above
- Check console for errors

**Page not loading?**
- Make sure development server is running
- Check terminal for errors
- Try port 5173 in browser

## Build for Production

```bash
npm run build
```

The optimized files will be in the `dist` folder.

## Project Structure

```
greenbites/
├── public/
│   └── logo.jpg (⚠️ ADD THIS!)
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
│   └── main.jsx
└── package.json
```

---

**Enjoy using Green Bites! 🌱**
