import { useState, useEffect } from 'react';
import { getCurrentUser, getDonationsByDonor, addDonation } from '../data/mockData';
import '../styles/Dashboard.css';

function DonorDashboard() {
  const user = getCurrentUser();
  const [donations, setDonations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    foodType: '',
    quantity: '',
    unit: 'kg',
    expiryDate: '',
    pickupLocation: '',
    description: ''
  });

  useEffect(() => {
    setDonations(getDonationsByDonor(user.id));
  }, [user.id]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newDonation = {
      ...formData,
      donorId: user.id,
      donorName: user.name,
      quantity: parseFloat(formData.quantity)
    };
    addDonation(newDonation);
    setDonations(getDonationsByDonor(user.id));
    setShowForm(false);
    setFormData({
      foodType: '',
      quantity: '',
      unit: 'kg',
      expiryDate: '',
      pickupLocation: '',
      description: ''
    });
  };

  const totalDonated = donations.reduce((sum, d) => sum + d.quantity, 0);
  const availableDonations = donations.filter(d => d.status === 'available').length;
  const claimedDonations = donations.filter(d => d.status === 'claimed').length;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Food Donor Dashboard</h1>
        <p>List surplus food, coordinate donations, and track your impact</p>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <h3>{donations.length}</h3>
          <p>Total Donations</p>
        </div>
        <div className="stat-box">
          <h3>{totalDonated} kg</h3>
          <p>Total Food Donated</p>
        </div>
        <div className="stat-box">
          <h3>{availableDonations}</h3>
          <p>Available</p>
        </div>
        <div className="stat-box">
          <h3>{claimedDonations}</h3>
          <p>Claimed</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="section-header">
          <h2>My Donations</h2>
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add New Donation'}
          </button>
        </div>

        {showForm && (
          <div className="form-card">
            <h3>Add New Food Donation</h3>
            <form onSubmit={handleSubmit} className="donation-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="foodType">Food Type *</label>
                  <input
                    type="text"
                    id="foodType"
                    name="foodType"
                    value={formData.foodType}
                    onChange={handleInputChange}
                    placeholder="e.g., Prepared Meals, Fruits, Vegetables"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="quantity">Quantity *</label>
                  <div className="input-group">
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      placeholder="Enter quantity"
                      min="1"
                      step="0.1"
                      required
                    />
                    <select name="unit" value={formData.unit} onChange={handleInputChange}>
                      <option value="kg">kg</option>
                      <option value="servings">servings</option>
                      <option value="pieces">pieces</option>
                      <option value="liters">liters</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiryDate">Expiry Date *</label>
                  <input
                    type="date"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="pickupLocation">Pickup Location *</label>
                  <input
                    type="text"
                    id="pickupLocation"
                    name="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={handleInputChange}
                    placeholder="Enter pickup address"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Add any additional details about the food..."
                  rows="3"
                />
              </div>

              <button type="submit" className="btn-submit">Submit Donation</button>
            </form>
          </div>
        )}

        <div className="donations-list">
          {donations.length === 0 ? (
            <p className="empty-message">No donations yet. Click "Add New Donation" to get started!</p>
          ) : (
            donations.map(donation => (
              <div key={donation.id} className="donation-item">
                <div className="donation-main">
                  <div className="donation-info">
                    <h3>{donation.foodType}</h3>
                    <p className="donation-meta">
                      {donation.quantity} {donation.unit} • Expires: {donation.expiryDate}
                    </p>
                    <p className="donation-location">📍 {donation.pickupLocation}</p>
                    {donation.description && <p className="donation-desc">{donation.description}</p>}
                  </div>
                  <div className="donation-status">
                    <span className={`status-badge status-${donation.status}`}>
                      {donation.status}
                    </span>
                    {donation.claimedByName && (
                      <p className="claimed-by">Claimed by: {donation.claimedByName}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default DonorDashboard;
