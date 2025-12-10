import { useState, useEffect } from 'react';
import { getAllDonations, mockData } from '../data/mockData';
import '../styles/Dashboard.css';

function AnalystDashboard({ user: propUser }) {
  const [donations, setDonations] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');

  useEffect(() => {
    setDonations(getAllDonations());
  }, []);

  const generateReport = () => {
    const reportData = {
      totalDonations: donations.length,
      totalWeight: donations.reduce((sum, d) => sum + d.quantity, 0),
      byStatus: {
        available: donations.filter(d => d.status === 'available').length,
        claimed: donations.filter(d => d.status === 'claimed').length,
        completed: donations.filter(d => d.status === 'completed').length
      },
      byFoodType: {}
    };

    donations.forEach(d => {
      if (reportData.byFoodType[d.foodType]) {
        reportData.byFoodType[d.foodType]++;
      } else {
        reportData.byFoodType[d.foodType] = 1;
      }
    });

    return reportData;
  };

  const report = generateReport();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Data Analyst Dashboard</h1>
        <p>Track food waste trends, analyze data, and generate reports to improve efficiency</p>
      </div>

      <div className="analyst-controls">
        <select 
          value={selectedTimeframe} 
          onChange={(e) => setSelectedTimeframe(e.target.value)}
          className="timeframe-select"
        >
          <option value="all">All Time</option>
          <option value="month">This Month</option>
          <option value="week">This Week</option>
        </select>
        <button className="btn-primary" onClick={() => window.print()}>
          📄 Export Report
        </button>
      </div>

      <div className="dashboard-content">
        <h2>Impact Metrics</h2>
        <div className="stats-grid">
          <div className="stat-box highlight">
            <h3>{mockData.impactData.totalDonations}</h3>
            <p>Total Donations</p>
            <span className="trend positive">↑ 12% from last month</span>
          </div>
          <div className="stat-box highlight">
            <h3>{mockData.impactData.totalWeight} kg</h3>
            <p>Food Saved</p>
            <span className="trend positive">↑ 8% from last month</span>
          </div>
          <div className="stat-box highlight">
            <h3>{mockData.impactData.mealsProvided}</h3>
            <p>Meals Provided</p>
            <span className="trend positive">↑ 15% from last month</span>
          </div>
          <div className="stat-box highlight">
            <h3>{mockData.impactData.co2Saved} kg</h3>
            <p>CO₂ Emissions Saved</p>
            <span className="trend positive">↑ 10% from last month</span>
          </div>
        </div>

        <div className="analysis-section">
          <h2>Donation Analysis</h2>
          <div className="analysis-grid">
            <div className="analysis-card">
              <h3>Status Breakdown</h3>
              <div className="chart-data">
                <div className="chart-item">
                  <span className="chart-label">Available</span>
                  <div className="chart-bar">
                    <div 
                      className="chart-fill available" 
                      style={{width: `${(report.byStatus.available / donations.length) * 100}%`}}
                    />
                  </div>
                  <span className="chart-value">{report.byStatus.available}</span>
                </div>
                <div className="chart-item">
                  <span className="chart-label">Claimed</span>
                  <div className="chart-bar">
                    <div 
                      className="chart-fill claimed" 
                      style={{width: `${(report.byStatus.claimed / donations.length) * 100}%`}}
                    />
                  </div>
                  <span className="chart-value">{report.byStatus.claimed}</span>
                </div>
                <div className="chart-item">
                  <span className="chart-label">Completed</span>
                  <div className="chart-bar">
                    <div 
                      className="chart-fill completed" 
                      style={{width: `${(report.byStatus.completed / donations.length) * 100}%`}}
                    />
                  </div>
                  <span className="chart-value">{report.byStatus.completed}</span>
                </div>
              </div>
            </div>

            <div className="analysis-card">
              <h3>Food Type Distribution</h3>
              <div className="chart-data">
                {Object.entries(report.byFoodType).map(([type, count]) => (
                  <div key={type} className="chart-item">
                    <span className="chart-label">{type}</span>
                    <div className="chart-bar">
                      <div 
                        className="chart-fill primary" 
                        style={{width: `${(count / donations.length) * 100}%`}}
                      />
                    </div>
                    <span className="chart-value">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="analysis-section">
          <h2>User Engagement</h2>
          <div className="stats-grid">
            <div className="stat-box">
              <h3>{mockData.impactData.donorsActive}</h3>
              <p>Active Donors</p>
            </div>
            <div className="stat-box">
              <h3>{mockData.impactData.recipientsActive}</h3>
              <p>Active Recipients</p>
            </div>
            <div className="stat-box">
              <h3>{(mockData.impactData.totalWeight / mockData.impactData.donorsActive).toFixed(1)} kg</h3>
              <p>Avg. per Donor</p>
            </div>
            <div className="stat-box">
              <h3>{((report.byStatus.claimed / donations.length) * 100).toFixed(0)}%</h3>
              <p>Claim Rate</p>
            </div>
          </div>
        </div>

        <div className="analysis-section">
          <h2>Key Insights & Recommendations</h2>
          <div className="insights-list">
            <div className="insight-item">
              <div className="insight-icon success">✓</div>
              <div className="insight-content">
                <h4>High Donation Rate</h4>
                <p>The platform is seeing consistent growth in food donations, with an average of 6.8 donations per donor.</p>
              </div>
            </div>
            <div className="insight-item">
              <div className="insight-icon warning">⚠</div>
              <div className="insight-content">
                <h4>Improve Claim Rate</h4>
                <p>Currently {report.byStatus.available} donations are unclaimed. Consider promoting these to more recipient organizations.</p>
              </div>
            </div>
            <div className="insight-item">
              <div className="insight-icon info">ℹ</div>
              <div className="insight-content">
                <h4>Environmental Impact</h4>
                <p>The platform has saved {mockData.impactData.co2Saved} kg of CO₂ emissions, equivalent to planting {(mockData.impactData.co2Saved / 22).toFixed(0)} trees annually.</p>
              </div>
            </div>
            <div className="insight-item">
              <div className="insight-icon success">✓</div>
              <div className="insight-content">
                <h4>Food Security Impact</h4>
                <p>With {mockData.impactData.mealsProvided} meals provided, the platform is making a significant impact on local food security.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="analysis-section">
          <h2>Recent Donations Data</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Donor</th>
                  <th>Food Type</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Days to Expiry</th>
                </tr>
              </thead>
              <tbody>
                {donations.map(donation => {
                  const daysToExpiry = Math.ceil((new Date(donation.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                  return (
                    <tr key={donation.id}>
                      <td>{donation.createdAt}</td>
                      <td>{donation.donorName}</td>
                      <td>{donation.foodType}</td>
                      <td>{donation.quantity} {donation.unit}</td>
                      <td><span className={`status-badge status-${donation.status}`}>{donation.status}</span></td>
                      <td className={daysToExpiry < 2 ? 'urgent' : ''}>{daysToExpiry} days</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalystDashboard;
