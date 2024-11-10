import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://localhost:5000', // Ensure HTTPS is set correctly
  withCredentials: true, // Allows cookies for cross-origin requests if needed
});

// User Authentication
export const loginUser = async (email, accountNumber, password) => {
  try {
    return await api.post('/api/auth/login', { email, accountNumber, password });
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const registerUser = async (name, surname, idNumber, email, password) => {
  try {
    return await api.post('/api/auth/register', { name, surname, idNumber, email, password });
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

// Customer Actions
export const createPayment = async (token, paymentData) => {
  try {
    return await api.post('/api/payments', paymentData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error('Payment creation failed:', error);
    throw error;
  }
};

export const getPaymentHistory = async (token) => {
  console.log("Using token:", token); // Debugging output
  try {
    return await api.get('/api/payments/history', {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error('Fetching payment history failed:', error);
    throw error;
  }
};



// Retrieve balance and transaction history (ensure the backend route combines these)
export const getBalanceAndTransactions = async (token) => {
  try {
    return await api.get('/api/user/balance', {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error('Fetching balance and transactions failed:', error);
    throw error;
  }
};

// Admin Actions
export const getPendingPayments = async (token) => {
  try {
    return await api.get('/api/admin/payments', {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error('Fetching pending payments failed:', error);
    throw error;
  }
};

export const approvePayment = async (token, paymentId) => {
  try {
    return await api.post(`/api/admin/payments/${paymentId}/approve`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error(`Approving payment ${paymentId} failed:`, error);
    throw error;
  }
};

export const rejectPayment = async (token, paymentId) => {
  try {
    return await api.post(`/api/admin/payments/${paymentId}/reject`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error(`Rejecting payment ${paymentId} failed:`, error);
    throw error;
  }
};

export default api;
