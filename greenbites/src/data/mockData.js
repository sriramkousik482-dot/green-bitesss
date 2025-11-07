// Mock data store for the application
export const mockData = {
  users: [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'Admin User' },
    { id: 2, username: 'donor1', password: 'donor123', role: 'donor', name: 'Green Restaurant', email: 'green@restaurant.com', phone: '123-456-7890' },
    { id: 3, username: 'recipient1', password: 'recipient123', role: 'recipient', name: 'Hope Foundation', email: 'hope@foundation.org', phone: '098-765-4321' },
    { id: 4, username: 'analyst1', password: 'analyst123', role: 'analyst', name: 'Data Analyst', email: 'analyst@greenbites.com' }
  ],
  
  foodDonations: [
    {
      id: 1,
      donorId: 2,
      donorName: 'Green Restaurant',
      foodType: 'Prepared Meals',
      quantity: 50,
      unit: 'servings',
      expiryDate: '2025-11-05',
      pickupLocation: '123 Green Street, Downtown',
      status: 'available',
      description: 'Fresh vegetarian meals',
      createdAt: '2025-11-01'
    },
    {
      id: 2,
      donorId: 2,
      donorName: 'Green Restaurant',
      foodType: 'Fruits',
      quantity: 20,
      unit: 'kg',
      expiryDate: '2025-11-06',
      pickupLocation: '123 Green Street, Downtown',
      status: 'claimed',
      description: 'Fresh seasonal fruits',
      createdAt: '2025-11-02',
      claimedBy: 3,
      claimedByName: 'Hope Foundation'
    }
  ],
  
  requests: [
    {
      id: 1,
      recipientId: 3,
      recipientName: 'Hope Foundation',
      donationId: 2,
      foodType: 'Fruits',
      reason: 'We run a community kitchen that feeds 100+ homeless people daily. These fruits will be used for nutritious meals.',
      status: 'approved',
      requestDate: '2025-11-02',
      approvedBy: 1
    }
  ],
  
  impactData: {
    totalDonations: 156,
    totalWeight: 2340,
    mealsProvided: 4680,
    co2Saved: 1170,
    donorsActive: 23,
    recipientsActive: 15
  }
};

let currentUser = null;

export const loginUser = (username, password) => {
  const user = mockData.users.find(u => u.username === username && u.password === password);
  if (user) {
    currentUser = { ...user };
    delete currentUser.password;
    return currentUser;
  }
  return null;
};

export const getCurrentUser = () => currentUser;

export const logoutUser = () => {
  currentUser = null;
};

export const addDonation = (donation) => {
  const newDonation = {
    ...donation,
    id: mockData.foodDonations.length + 1,
    createdAt: new Date().toISOString().split('T')[0],
    status: 'available'
  };
  mockData.foodDonations.push(newDonation);
  return newDonation;
};

export const addRequest = (request) => {
  const newRequest = {
    ...request,
    id: mockData.requests.length + 1,
    requestDate: new Date().toISOString().split('T')[0],
    status: 'pending'
  };
  mockData.requests.push(newRequest);
  return newRequest;
};

export const updateDonationStatus = (donationId, status, claimedBy = null) => {
  const donation = mockData.foodDonations.find(d => d.id === donationId);
  if (donation) {
    donation.status = status;
    if (claimedBy) {
      donation.claimedBy = claimedBy;
      const user = mockData.users.find(u => u.id === claimedBy);
      if (user) donation.claimedByName = user.name;
    }
  }
};

export const updateRequestStatus = (requestId, status, approvedBy = null) => {
  const request = mockData.requests.find(r => r.id === requestId);
  if (request) {
    request.status = status;
    if (approvedBy) request.approvedBy = approvedBy;
  }
};

export const getAvailableDonations = () => {
  return mockData.foodDonations.filter(d => d.status === 'available');
};

export const getDonationsByDonor = (donorId) => {
  return mockData.foodDonations.filter(d => d.donorId === donorId);
};

export const getRequestsByRecipient = (recipientId) => {
  return mockData.requests.filter(r => r.recipientId === recipientId);
};

export const getAllRequests = () => {
  return mockData.requests;
};

export const getAllDonations = () => {
  return mockData.foodDonations;
};
