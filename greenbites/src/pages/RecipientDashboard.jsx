import { useState, useEffect } from 'react';
import { getCurrentUser, getAvailableDonations, getRequestsByRecipient, addRequest, updateDonationStatus } from '../data/mockData';
import '../styles/Dashboard.css';

function RecipientDashboard() {
  const user = getCurrentUser();
  const [availableDonations, setAvailableDonations] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('available');
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [reason, setReason] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);

  useEffect(() => {
    setAvailableDonations(getAvailableDonations());
    setMyRequests(getRequestsByRecipient(user.id));
  }, [user.id]);

  const handleRequestFood = (donation) => {
    setSelectedDonation(donation);
    setShowRequestModal(true);
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    
    if (reason.trim().length < 50) {
      alert('Please provide a detailed reason (at least 50 characters) explaining why you need this food donation.');
      return;
    }

    const request = {
      recipientId: user.id,
      recipientName: user.name,
      donationId: selectedDonation.id,
      foodType: selectedDonation.foodType,
      reason: reason
    };

    addRequest(request);
    updateDonationStatus(selectedDonation.id, 'claimed', user.id);
    
    setAvailableDonations(getAvailableDonations());
    setMyRequests(getRequestsByRecipient(user.id));
    setShowRequestModal(false);
    setReason('');
    setSelectedDonation(null);
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
                <div key={donation.id} className="donation-card">
                  <div className="card-header">
                    <h3>{donation.foodType}</h3>
                    <span className="status-badge status-available">Available</span>
                  </div>
                  <div className="card-body">
                    <div className="info-row">
                      <span className="info-label">Donor:</span>
                      <span className="info-value">{donation.donorName}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Quantity:</span>
                      <span className="info-value">{donation.quantity} {donation.unit}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Expiry:</span>
                      <span className="info-value">{donation.expiryDate}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Location:</span>
                      <span className="info-value">📍 {donation.pickupLocation}</span>
                    </div>
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
                <div key={request.id} className="request-item">
                  <div className="request-header">
                    <h3>{request.foodType}</h3>
                    <span className={`status-badge status-${request.status}`}>
                      {request.status}
                    </span>
                  </div>
                  <div className="request-details">
                    <p><strong>Request Date:</strong> {request.requestDate}</p>
                    <p><strong>Your Reason:</strong></p>
                    <p className="request-reason">{request.reason}</p>
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
                <p>{selectedDonation?.quantity} {selectedDonation?.unit} from {selectedDonation?.donorName}</p>
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
                  <button type="submit" className="btn-submit">
                    Submit Request
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
