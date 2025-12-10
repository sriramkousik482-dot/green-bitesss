import { useState, useEffect } from 'react';
import { getCurrentUser, getAvailableDonations, getRequestsByRecipient, addRequest, updateDonationStatus } from '../data/mockData';
import '../styles/Dashboard.css';

const API_URL = 'http://localhost:5000/api';

function RecipientDashboard({ user: propUser }) {
  const user = propUser || getCurrentUser();
  const [availableDonations, setAvailableDonations] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('available');
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [reason, setReason] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAvailableDonations();
      fetchMyRequests();
    }
  }, [user]);

  const fetchAvailableDonations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/donations?status=available`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setAvailableDonations(data.data);
      } else {
        setAvailableDonations(getAvailableDonations());
      }
    } catch (err) {
      setAvailableDonations(getAvailableDonations());
    }
  };

  const fetchMyRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/requests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setMyRequests(data.data);
      } else {
        setMyRequests(getRequestsByRecipient(user.id));
      }
    } catch (err) {
      setMyRequests(getRequestsByRecipient(user.id));
    }
  };

  const handleRequestFood = (donation) => {
    setSelectedDonation(donation);
    setShowRequestModal(true);
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    
    if (reason.trim().length < 50) {
      alert('Please provide a detailed reason (at least 50 characters) explaining why you need this food donation.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const requestData = {
        donation: selectedDonation._id || selectedDonation.id,
        requestedQuantity: {
          amount: selectedDonation.quantity?.amount || selectedDonation.quantity,
          unit: selectedDonation.quantity?.unit || selectedDonation.unit
        },
        message: reason,
        deliveryMethod: 'pickup'
      };

      const response = await fetch(`${API_URL}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();
      if (data.success) {
        await fetchAvailableDonations();
        await fetchMyRequests();
        setShowRequestModal(false);
        setReason('');
        setSelectedDonation(null);
      } else {
        alert(data.message || 'Failed to submit request');
      }
    } catch (err) {
      console.error('Error submitting request:', err);
      alert('Unable to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const approvedRequests = myRequests.filter(r => r.status === 'approved').length;
  const pendingRequests = myRequests.filter(r => r.status === 'pending').length;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Recipient Organization Dashboard</h1>
        <p>Request food donations, manage logistics, and distribute to those in need</p>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <h3>{myRequests.length}</h3>
          <p>Total Requests</p>
        </div>
        <div className="stat-box">
          <h3>{approvedRequests}</h3>
          <p>Approved</p>
        </div>
        <div className="stat-box">
          <h3>{pendingRequests}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-box">
          <h3>{availableDonations.length}</h3>
          <p>Available Donations</p>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'available' ? 'tab-active' : 'tab'}
          onClick={() => setActiveTab('available')}
        >
          Available Donations
        </button>
        <button 
          className={activeTab === 'requests' ? 'tab-active' : 'tab'}
          onClick={() => setActiveTab('requests')}
        >
          My Requests
        </button>
      </div>

      {activeTab === 'available' && (
        <div className="dashboard-content">
          <h2>Available Food Donations</h2>
          {availableDonations.length === 0 ? (
            <p className="empty-message">No available donations at the moment. Check back later!</p>
          ) : (
            <div className="donations-grid">
              {availableDonations.map(donation => (
                <div key={donation._id || donation.id} className="donation-card">
                  <div className="card-header">
                    <h3>{donation.foodType}</h3>
                    <span className="status-badge status-available">Available</span>
                  </div>
                  <div className="card-body">
                    <div className="info-row">
                      <span className="info-label">Category:</span>
                      <span className="info-value">{donation.category}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Quantity:</span>
                      <span className="info-value">
                        {donation.quantity?.amount || donation.quantity} {donation.quantity?.unit || donation.unit}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Expiry:</span>
                      <span className="info-value">{new Date(donation.expiryDate).toLocaleDateString()}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Location:</span>
                      <span className="info-value">
                        📍 {donation.pickupLocation?.address || donation.pickupLocation}, {donation.pickupLocation?.city}
                      </span>
                    </div>
                    {donation.pickupTime && (
                      <div className="info-row">
                        <span className="info-label">Pickup Time:</span>
                        <span className="info-value">
                          {new Date(donation.pickupTime.from).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {donation.description && (
                      <p className="donation-description">{donation.description}</p>
                    )}
                  </div>
                  <div className="card-footer">
                    <button 
                      className="btn-request"
                      onClick={() => handleRequestFood(donation)}
                    >
                      Request This Donation
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="dashboard-content">
          <h2>My Requests</h2>
          {myRequests.length === 0 ? (
            <p className="empty-message">You haven't made any requests yet.</p>
          ) : (
            <div className="requests-list">
              {myRequests.map(request => (
                <div key={request._id || request.id} className="request-item">
                  <div className="request-header">
                    <h3>{request.donation?.foodType || 'Food Donation'}</h3>
                    <span className={`status-badge status-${request.status}`}>
                      {request.status}
                    </span>
                  </div>
                  <div className="request-details">
                    <p><strong>Request Date:</strong> {new Date(request.createdAt || request.requestDate).toLocaleDateString()}</p>
                    <p><strong>Quantity:</strong> {request.requestedQuantity?.amount || request.quantity} {request.requestedQuantity?.unit || request.unit}</p>
                    <p><strong>Delivery Method:</strong> {request.deliveryMethod || 'pickup'}</p>
                    {request.message && (
                      <>
                        <p><strong>Your Message:</strong></p>
                        <p className="request-reason">{request.message}</p>
                      </>
                    )}
                    {request.approvedAt && (
                      <p className="approved-note">✅ Approved on {new Date(request.approvedAt).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showRequestModal && (
        <div className="modal-overlay" onClick={() => setShowRequestModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Request Food Donation</h2>
              <button className="modal-close" onClick={() => setShowRequestModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="donation-summary">
                <h3>{selectedDonation?.foodType}</h3>
                <p>
                  {selectedDonation?.quantity?.amount || selectedDonation?.quantity} {selectedDonation?.quantity?.unit || selectedDonation?.unit}
                </p>
                <p>{selectedDonation?.category}</p>
              </div>
              <form onSubmit={handleSubmitRequest}>
                <div className="form-group">
                  <label htmlFor="reason">
                    Please explain why you need this food donation *
                    <span className="helper-text">
                      (Minimum 50 characters - describe your organization's purpose and how this food will help)
                    </span>
                  </label>
                  <textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Example: We run a community kitchen that serves 100+ homeless people daily. This food will help us prepare nutritious meals for those in need. Our organization focuses on..."
                    rows="6"
                    required
                    minLength={50}
                  />
                  <div className="character-count">
                    {reason.length} / 50 characters minimum
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowRequestModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecipientDashboard;
