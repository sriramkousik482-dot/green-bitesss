import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../data/mockData';
import AdminDashboard from './AdminDashboard';
import DonorDashboard from './DonorDashboard';
import RecipientDashboard from './RecipientDashboard';
import AnalystDashboard from './AnalystDashboard';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Try to get user from localStorage (backend auth)
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    } else {
      // Fallback to mock data
      const mockUser = getCurrentUser();
      if (mockUser) {
        setUser(mockUser);
      }
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.5rem',
        color: '#4a7c2c'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Pass user data to child dashboards
  switch (user.role) {
    case 'admin':
      return <AdminDashboard user={user} />;
    case 'donor':
      return <DonorDashboard user={user} />;
    case 'recipient':
      return <RecipientDashboard user={user} />;
    case 'analyst':
      return <AnalystDashboard user={user} />;
    default:
      return (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center',
          fontSize: '1.2rem'
        }}>
          <h2>Welcome {user.fullName || user.username}!</h2>
          <p>Role: {user.role}</p>
          <p>Dashboard for role "{user.role}" is being developed.</p>
        </div>
      );
  }
}

export default Dashboard;
