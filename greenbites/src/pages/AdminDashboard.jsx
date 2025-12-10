import { useState, useEffect } from 'react';
import { getCurrentUser, getAllDonations, getAllRequests, updateRequestStatus, mockData } from '../data/mockData';
import '../styles/Dashboard.css';

const API_URL = 'http://localhost:5000/api';

function AdminDashboard({ user: propUser }) {
  const user = propUser || getCurrentUser();
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDonations();
      fetchRequests();
    }
  }, [user]);

  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/donations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setDonations(data.data);
      } else {
        setDonations(getAllDonations());
      }
    } catch (err) {
      setDonations(getAllDonations());
    }
  };

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/requests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setRequests(data.data);
      } else {
        setRequests(getAllRequests());
      }
    } catch (err) {
      setRequests(getAllRequests());
    }
  };

  const handleApproveRequest = async (requestId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/requests/${requestId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        await fetchRequests();
        await fetchDonations();
      } else {
        alert(data.message || 'Failed to approve request');
      }
    } catch (err) {
      console.error('Error approving request:', err);
      updateRequestStatus(requestId, 'approved', user.id);
      setRequests(getAllRequests());
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRequest = async (requestId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/requests/${requestId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        await fetchRequests();
      } else {
        alert(data.message || 'Failed to reject request');
      }
    } catch (err) {
      console.error('Error rejecting request:', err);
      updateRequestStatus(requestId, 'rejected', user.id);
      setRequests(getAllRequests());
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDonation = async (donationId) => {
    if (!window.confirm('Are you sure you want to delete this donation?')) {
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/donations/${donationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        alert('Donation deleted successfully');
        await fetchDonations();
        await fetchRequests();
      } else {
        alert(data.message || 'Failed to delete donation');
      }
    } catch (err) {
      console.error('Error deleting donation:', err);
      alert('Failed to delete donation');
    } finally {
      setLoading(false);
    }
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
                <div key={request._id || request.id} className="activity-item">
                  <div className="activity-icon">📋</div>
                  <div className="activity-details">
                    <strong>{request.recipient?.fullName || 'Recipient'}</strong> requested {request.donation?.foodType || 'Food'}
                    <span className={`status-badge status-${request.status}`}>{request.status}</span>
                  </div>
                  <div className="activity-date">{new Date(request.createdAt || request.requestDate).toLocaleDateString()}</div>
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {donations.map(donation => (
                  <tr key={donation._id || donation.id}>
                    <td>{donation.donor?.fullName || donation.donorName || 'Donor'}</td>
                    <td>{donation.foodType}</td>
                    <td>{donation.quantity?.amount || donation.quantity} {donation.quantity?.unit || donation.unit}</td>
                    <td>{new Date(donation.expiryDate).toLocaleDateString()}</td>
                    <td><span className={`status-badge status-${donation.status}`}>{donation.status}</span></td>
                    <td>{donation.pickupLocation?.address || donation.pickupLocation}, {donation.pickupLocation?.city}</td>
                    <td>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDeleteDonation(donation._id || donation.id)}
                        disabled={loading}
                        title="Delete donation"
                      >
                        🗑️ Delete
                      </button>
                    </td>
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
              <div key={request._id || request.id} className="request-card">
                <div className="request-header">
                  <h3>{request.recipient?.fullName || request.recipientName || 'Recipient'}</h3>
                  <span className={`status-badge status-${request.status}`}>{request.status}</span>
                </div>
                <div className="request-body">
                  <p><strong>Food Type:</strong> {request.donation?.foodType || request.foodType}</p>
                  <p><strong>Request Date:</strong> {new Date(request.createdAt || request.requestDate).toLocaleDateString()}</p>
                  <p><strong>Quantity:</strong> {request.requestedQuantity?.amount} {request.requestedQuantity?.unit}</p>
                  {request.message && (
                    <>
                      <p><strong>Message:</strong></p>
                      <p className="request-reason">{request.message}</p>
                    </>
                  )}
                </div>
                <div className="request-actions">
                  <button 
                    className="btn-approve"
                    onClick={() => handleApproveRequest(request._id || request.id)}
                    disabled={loading}
                  >
                    Approve
                  </button>
                  <button 
                    className="btn-reject"
                    onClick={() => handleRejectRequest(request._id || request.id)}
                    disabled={loading}
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
