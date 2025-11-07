import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Reduce Food Waste, Improve Food Security</h1>
          <p className="hero-subtitle">
            Join our platform to track and reduce food waste. Connect donors with those in need and make a real impact on food security.
          </p>
          <Link to="/login" className="cta-button">Get Started</Link>
        </div>
        <div className="hero-image">
          <div className="hero-logo-placeholder">
            <div className="big-logo-circle">
              <span className="big-logo-letter">G</span>
              <span className="big-logo-leaf">🌿</span>
            </div>
            <p className="logo-subtitle">Green Bites</p>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Our Platform Supports</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👨‍💼</div>
            <h3>Admin</h3>
            <p>Manage platform content, oversee user interactions, and ensure data accuracy</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🍽️</div>
            <h3>Food Donors</h3>
            <p>List surplus food, coordinate donations, and track your positive impact</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🏢</div>
            <h3>Recipient Organizations</h3>
            <p>Request food donations, manage logistics, and distribute to those in need</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Data Analysts</h3>
            <p>Track food waste trends, analyze data, and generate reports to improve efficiency</p>
          </div>
        </div>
      </section>

      <section className="impact-section">
        <h2 className="section-title">Our Impact</h2>
        <div className="impact-stats">
          <div className="stat-card">
            <div className="stat-number">156</div>
            <div className="stat-label">Total Donations</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">2,340kg</div>
            <div className="stat-label">Food Saved</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">4,680</div>
            <div className="stat-label">Meals Provided</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">1,170kg</div>
            <div className="stat-label">CO₂ Saved</div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2025 Green Bites. All rights reserved. Fighting food waste, one meal at a time.</p>
      </footer>
    </div>
  );
}

export default Home;
