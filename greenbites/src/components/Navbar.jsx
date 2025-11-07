import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../data/mockData';
import '../styles/Navbar.css';

function Navbar() {
  const user = getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={user ? '/dashboard' : '/'} className="navbar-logo">
          <div className="logo-placeholder">
            <span className="logo-letter">G</span>
            <span className="logo-leaf">🌿</span>
          </div>
          <span className="logo-text">Green Bites</span>
        </Link>
        
        {user && (
          <div className="navbar-menu">
            <span className="navbar-user">Welcome, {user.name}</span>
            <Link to="/dashboard" className="navbar-link">Dashboard</Link>
            <button onClick={handleLogout} className="navbar-logout">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
