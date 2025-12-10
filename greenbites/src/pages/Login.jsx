import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../data/mockData';
import '../styles/Login.css';

const API_URL = 'http://localhost:5000/api';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Trim whitespace from inputs
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    try {
      // Try backend API first
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: trimmedUsername,
          password: trimmedPassword
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store user data and token
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data));
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid username or password');
      }
    } catch (err) {
      // Fallback to mock data if backend is not available
      console.log('Backend not available, using mock data');
      const user = loginUser(trimmedUsername, trimmedPassword);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/dashboard');
      } else {
        setError('Invalid username or password. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (user, pass) => {
    setUsername(user);
    setPassword(pass);
    setError('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo-placeholder">
            <span className="login-logo-letter">G</span>
            <span className="login-logo-leaf">🌿</span>
          </div>
          <h2>Welcome to GreenBites</h2>
          <p>Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="demo-credentials">
          <h4>Demo Credentials (Click to auto-fill):</h4>
          <div className="credentials-grid">
            <div className="credential-item" onClick={() => quickLogin('admin', 'admin123')}>
              <strong>Admin:</strong> admin / admin123
            </div>
            <div className="credential-item" onClick={() => quickLogin('donor1', 'donor123')}>
              <strong>Donor:</strong> donor1 / donor123
            </div>
            <div className="credential-item" onClick={() => quickLogin('recipient1', 'recipient123')}>
              <strong>Recipient:</strong> recipient1 / recipient123
            </div>
            <div className="credential-item" onClick={() => quickLogin('analyst1', 'analyst123')}>
              <strong>Analyst:</strong> analyst1 / analyst123
            </div>
          </div>
        </div>

        <div className="register-link">
          <p>Don't have an account? <Link to="/register">Create Account</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
