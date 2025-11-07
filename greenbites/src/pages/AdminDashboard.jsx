import { useState, useEffect } from 'react';
import { getCurrentUser, getAllDonations, getAllRequests, updateRequestStatus, mockData } from '../data/mockData';
import '../styles/Dashboard.css';

function AdminDashboard() {
  const user = getCurrentUser();
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setDonations(getAllDonations());
    setRequests(getAllRequests());
  }, []);

  const handleApproveRequest = (requestId) => {
    updateRequestStatus(requestId, 'approved', user.id);
    setRequests(getAllRequests());
    setDonations(getAllDonations());
  };

  const handleRejectRequest = (requestId) => {
    updateRequestStatus(requestId, 'rejected', user.id);
    setRequests(getAllRequests());
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage platform content, oversee user interactions, and ensure data accuracy</p>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'overview' ? 'tab-active' : 'tab'}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'donations' ? 'tab-active' : 'tab'}
          onClick={() => setActiveTab('donations')}
        >
          All Donations
        </button>
        <button 
          className={activeTab === 'requests' ? 'tab-active' : 'tab'}
          onClick={() => setActiveTab('requests')}
        >
          Pending Requests
        </button>
        <button 
          className={activeTab === 'users' ? 'tab-active' : 'tab'}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="dashboard-content">
          <div className="stats-grid">
            <div className="stat-box">
              <h3>{mockData.impactData.totalDonations}</h3>
              <p>Total Donations</p>
            </div>
            <div className="stat-box">
              <h3>{mockData.impactData.donorsActive}</h3>
              <p>Active Donors</p>
            </div>
            <div className="stat-box">
              <h3>{mockData.impactData.recipientsActive}</h3>
              <p>Active Recipients</p>
            </div>
            <div className="stat-box">
              <h3>{requests.filter(r => r.status === 'pending').length}</h3>
              <p>Pending Requests</p>
            </div>
          </div>

          <div className="recent-activity">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              {requests.slice(0, 5).map(request => (
                <div key={request.id} className="activity-item">
                  <div className="activity-icon">📋</div>
                  <div className="activity-details">
                    <strong>{request.recipientName}</strong> requested {request.foodType}
                    <span className={`status-badge status-${request.status}`}>{request.status}</span>
                  </div>
                  <div className="activity-date">{request.requestDate}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'donations' && (
        <div className="dashboard-content">
          <h2>All Donations</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Donor</th>
                  <th>Food Type</th>
                  <th>Quantity</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {donations.map(donation => (
                  <tr key={donation.id}>
                    <td>{donation.donorName}</td>
                    <td>{donation.foodType}</td>
                    <td>{donation.quantity} {donation.unit}</td>
                    <td>{donation.expiryDate}</td>
                    <td><span className={`status-badge status-${donation.status}`}>{donation.status}</span></td>
                    <td>{donation.pickupLocation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="dashboard-content">
          <h2>Pending Requests</h2>
          <div className="requests-grid">
            {requests.filter(r => r.status === 'pending').map(request => (
              <div key={request.id} className="request-card">
                <div className="request-header">
                  <h3>{request.recipientName}</h3>
                  <span className={`status-badge status-${request.status}`}>{request.status}</span>
                </div>
                <div className="request-body">
                  <p><strong>Food Type:</strong> {request.foodType}</p>
                  <p><strong>Request Date:</strong> {request.requestDate}</p>
                  <p><strong>Reason:</strong></p>
                  <p className="request-reason">{request.reason}</p>
                </div>
                <div className="request-actions">
                  <button 
                    className="btn-approve"
                    onClick={() => handleApproveRequest(request.id)}
                  >
                    Approve
                  </button>
                  <button 
                    className="btn-reject"
                    onClick={() => handleRejectRequest(request.id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
            {requests.filter(r => r.status === 'pending').length === 0 && (
              <p className="empty-message">No pending requests</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="dashboard-content">
          <h2>Platform Users</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {mockData.users.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.username}</td>
                    <td><span className={`role-badge role-${user.role}`}>{user.role}</span></td>
                    <td>{user.email || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
