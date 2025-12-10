import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
        
        {user ? (
          <div className="navbar-menu">
            <span className="navbar-user">Welcome, {user.fullName}</span>
            <Link to="/dashboard" className="navbar-link">Dashboard</Link>
            <button onClick={handleLogout} className="navbar-logout">Logout</button>
          </div>
        ) : (
          <div className="navbar-menu">
            <Link to="/login" className="navbar-link">Login</Link>
            <Link to="/register" className="navbar-link">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
