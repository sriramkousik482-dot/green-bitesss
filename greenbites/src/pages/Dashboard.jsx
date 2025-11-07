import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../data/mockData';
import AdminDashboard from './AdminDashboard';
import DonorDashboard from './DonorDashboard';
import RecipientDashboard from './RecipientDashboard';
import AnalystDashboard from './AnalystDashboard';

function Dashboard() {
  const user = getCurrentUser();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'donor':
      return <DonorDashboard />;
    case 'recipient':
      return <RecipientDashboard />;
    case 'analyst':
      return <AnalystDashboard />;
    default:
      return <div>Unknown user role</div>;
  }
}

export default Dashboard;
