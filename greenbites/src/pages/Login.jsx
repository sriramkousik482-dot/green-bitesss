import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../data/mockData';
import '../styles/Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Trim whitespace from inputs
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    const user = loginUser(trimmedUsername, trimmedPassword);
    if (user) {
      navigate('/dashboard');
    } else {
      setError('Invalid username or password. Please check your credentials.');
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
          <h2>Welcome to Green Bites</h2>
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

          <button type="submit" className="login-button">Sign In</button>
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
      </div>
    </div>
  );
}

export default Login;
