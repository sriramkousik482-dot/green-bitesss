import { useState, useEffect } from 'react';
import { getCurrentUser, getDonationsByDonor, addDonation } from '../data/mockData';
import '../styles/Dashboard.css';

const API_URL = 'http://localhost:5000/api';

function DonorDashboard({ user: propUser }) {
  // Use prop user if available, otherwise fallback to getCurrentUser
  const user = propUser || getCurrentUser();
  const [donations, setDonations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    foodType: '',
    category: 'Other',
    quantity: '',
    unit: 'kg',
    expiryDate: '',
    pickupLocation: '',
    pickupCity: '',
    pickupState: '',
    pickupZipCode: '',
    pickupTimeFrom: '',
    pickupTimeTo: '',
    description: '',
    storageInstructions: ''
  });

  useEffect(() => {
    if (user) {
      fetchDonations();
    }
  }, [user]);

  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/donations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setDonations(data.data);
      } else {
        // Fallback to mock data
        setDonations(getDonationsByDonor(user.id));
      }
    } catch (err) {
      console.error('Error fetching donations:', err);
      // Fallback to mock data
      setDonations(getDonationsByDonor(user.id));
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const donationData = {
        foodType: formData.foodType,
        category: formData.category,
        quantity: {
          amount: parseFloat(formData.quantity),
          unit: formData.unit
        },
        expiryDate: formData.expiryDate,
        pickupLocation: {
          address: formData.pickupLocation,
          city: formData.pickupCity,
          state: formData.pickupState,
          zipCode: formData.pickupZipCode
        },
        pickupTime: {
          from: formData.pickupTimeFrom,
          to: formData.pickupTimeTo
        },
        description: formData.description,
        storageInstructions: formData.storageInstructions
      };

      const response = await fetch(`${API_URL}/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(donationData)
      });

      const data = await response.json();

      if (data.success) {
        await fetchDonations();
        setShowForm(false);
        setFormData({
          foodType: '',
          category: 'Other',
          quantity: '',
          unit: 'kg',
          expiryDate: '',
          pickupLocation: '',
          pickupCity: '',
          pickupState: '',
          pickupZipCode: '',
          pickupTimeFrom: '',
          pickupTimeTo: '',
          description: '',
          storageInstructions: ''
        });
      } else {
        setError(data.message || 'Failed to create donation');
      }
    } catch (err) {
      console.error('Error creating donation:', err);
      setError('Unable to create donation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalDonated = donations.reduce((sum, d) => {
    const amount = d.quantity?.amount || d.quantity || 0;
    return sum + amount;
  }, 0);
  
  // Get the most common unit from donations or default to 'kg'
  const primaryUnit = donations.length > 0 
    ? (donations[0]?.quantity?.unit || 'kg')
    : 'kg';
    
  const availableDonations = donations.filter(d => d.status === 'available').length;
  const claimedDonations = donations.filter(d => d.status === 'claimed').length;
  const completedDonations = donations.filter(d => d.status === 'completed').length;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Food Donor Dashboard</h1>
        <p>List surplus food, coordinate donations, and track your impact</p>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <h3>{donations.length}</h3>
          <p>Total Donations Made</p>
        </div>
        <div className="stat-box">
          <h3>{totalDonated.toFixed(1)} {primaryUnit}</h3>
          <p>Total Quantity Donated</p>
        </div>
        <div className="stat-box">
          <h3>{availableDonations}</h3>
          <p>Available</p>
        </div>
        <div className="stat-box">
          <h3>{completedDonations}</h3>
          <p>Completed</p>
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
            {error && <div className="error-message">{error}</div>}
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
                    placeholder="e.g., Fresh Apples, Cooked Rice"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select 
                    id="category"
                    name="category" 
                    value={formData.category} 
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Fruits">Fruits</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Grains">Grains</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Meat">Meat</option>
                    <option value="Prepared Food">Prepared Food</option>
                    <option value="Baked Goods">Baked Goods</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
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
                      min="0.1"
                      step="0.1"
                      required
                    />
                    <select name="unit" value={formData.unit} onChange={handleInputChange}>
                      <option value="kg">kg</option>
                      <option value="lbs">lbs</option>
                      <option value="servings">servings</option>
                      <option value="items">items</option>
                      <option value="liters">liters</option>
                    </select>
                  </div>
                </div>
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
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="pickupLocation">Pickup Address *</label>
                  <input
                    type="text"
                    id="pickupLocation"
                    name="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={handleInputChange}
                    placeholder="Street address"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="pickupCity">City *</label>
                  <input
                    type="text"
                    id="pickupCity"
                    name="pickupCity"
                    value={formData.pickupCity}
                    onChange={handleInputChange}
                    placeholder="City"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="pickupState">State</label>
                  <input
                    type="text"
                    id="pickupState"
                    name="pickupState"
                    value={formData.pickupState}
                    onChange={handleInputChange}
                    placeholder="State"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="pickupZipCode">Zip Code</label>
                  <input
                    type="text"
                    id="pickupZipCode"
                    name="pickupZipCode"
                    value={formData.pickupZipCode}
                    onChange={handleInputChange}
                    placeholder="Zip Code"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="pickupTimeFrom">Pickup Available From *</label>
                  <input
                    type="datetime-local"
                    id="pickupTimeFrom"
                    name="pickupTimeFrom"
                    value={formData.pickupTimeFrom}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="pickupTimeTo">Pickup Available Until *</label>
                  <input
                    type="datetime-local"
                    id="pickupTimeTo"
                    name="pickupTimeTo"
                    value={formData.pickupTimeTo}
                    onChange={handleInputChange}
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
                  placeholder="Additional details about the food donation"
                  rows="3"
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="storageInstructions">Storage Instructions</label>
                <textarea
                  id="storageInstructions"
                  name="storageInstructions"
                  value={formData.storageInstructions}
                  onChange={handleInputChange}
                  placeholder="How should this food be stored? (e.g., refrigerate, keep frozen)"
                  rows="2"
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Donation'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="donations-list">
          {donations.length === 0 ? (
            <p className="empty-message">No donations yet. Click "Add New Donation" to get started!</p>
          ) : (
            donations.map(donation => (
              <div key={donation._id || donation.id} className="donation-item">
                <div className="donation-main">
                  <div className="donation-info">
                    <h3>{donation.foodType}</h3>
                    <p className="donation-meta">
                      {donation.quantity?.amount || donation.quantity} {donation.quantity?.unit || donation.unit} • 
                      Category: {donation.category} • 
                      Expires: {new Date(donation.expiryDate).toLocaleDateString()}
                    </p>
                    <p className="donation-location">
                      📍 {donation.pickupLocation?.address || donation.pickupLocation}, {donation.pickupLocation?.city}
                    </p>
                    {donation.pickupTime && (
                      <p className="donation-time">
                        🕒 Pickup: {new Date(donation.pickupTime.from).toLocaleString()} - {new Date(donation.pickupTime.to).toLocaleString()}
                      </p>
                    )}
                    {donation.description && <p className="donation-desc">{donation.description}</p>}
                    {donation.storageInstructions && <p className="donation-storage">🧊 {donation.storageInstructions}</p>}
                  </div>
                  <div className="donation-status">
                    <span className={`status-badge status-${donation.status}`}>
                      {donation.status}
                    </span>
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
