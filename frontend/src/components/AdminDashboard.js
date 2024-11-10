import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { getPendingPayments, approvePayment, rejectPayment } from '../api';
import api from '../api';

const AdminDashboard = ({ token }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [adminForm, setAdminForm] = useState({ name: '', surname: '', email: '', password: '', idNumber: '' });
  const [addingAdmin, setAddingAdmin] = useState(false);

  useEffect(() => {
    fetchPendingPayments();
  }, [token]);

  const fetchPendingPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPendingPayments(token);
      setPayments(response.data);
    } catch (error) {
      console.error('Failed to fetch pending payments:', error);
      setError('Failed to fetch pending payments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setError(null);
    setMessage(null);
    setProcessing(id);
    try {
      await approvePayment(token, id);
      setMessage('Payment approved successfully.');
      fetchPendingPayments();
    } catch (error) {
      console.error('Failed to approve payment:', error);
      setError(error.response?.data.message || 'Failed to approve payment. Please try again.');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id) => {
    setError(null);
    setMessage(null);
    setProcessing(id);
    try {
      await rejectPayment(token, id);
      setMessage('Payment rejected successfully.');
      fetchPendingPayments();
    } catch (error) {
      console.error('Failed to reject payment:', error);
      setError(error.response?.data.message || 'Failed to reject payment. Please try again.');
    } finally {
      setProcessing(null);
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setAddingAdmin(true);
    setError(null);
    setMessage(null);

    try {
      const response = await api.post(
        '/api/admin/add-admin',
        adminForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('New admin added successfully.');
      setAdminForm({ name: '', surname: '', email: '', password: '', idNumber: '' });
    } catch (error) {
      console.error('Failed to add admin:', error);
      setError(error.response?.data.message || 'Failed to add admin. Please try again.');
    } finally {
      setAddingAdmin(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg">
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-t-2xl">
          <h2 className="text-3xl font-bold text-white text-center">Admin Dashboard</h2>
          <p className="text-white text-center">Manage Pending Payments & Add Admins</p>
        </div>

        {message && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 text-green-700 text-center">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="p-10 flex items-center justify-center">
            <Loader className="animate-spin text-yellow-500 w-10 h-10" />
          </div>
        ) : (
          <ul className="p-6 space-y-4">
            {payments.length === 0 ? (
              <p className="text-gray-500 text-center">No pending payments at the moment.</p>
            ) : (
              payments.map((payment) => (
                <li key={payment._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-md">
                  <div>
                    <p className="text-lg font-medium text-gray-700">
                      <strong>From:</strong> {payment.sender?.name || 'Unknown'} ({payment.sender?.email || 'N/A'})
                    </p>
                    <p className="text-lg font-medium text-gray-700">
                      <strong>To:</strong> {payment.recipient?.name || 'Unknown'} ({payment.recipient?.email || 'N/A'})
                    </p>
                    <p className="text-sm text-gray-500">
                      Amount: R{payment.amount} | SWIFT Code: {payment.swiftCode}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApprove(payment._id)}
                      className={`flex items-center bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-all ${processing === payment._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={processing === payment._id}
                    >
                      {processing === payment._id ? (
                        <Loader size={18} className="animate-spin mr-1" />
                      ) : (
                        <CheckCircle size={18} className="mr-1" />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(payment._id)}
                      className={`flex items-center bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all ${processing === payment._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={processing === payment._id}
                    >
                      {processing === payment._id ? (
                        <Loader size={18} className="animate-spin mr-1" />
                      ) : (
                        <XCircle size={18} className="mr-1" />
                      )}
                      Reject
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        )}

        <div className="p-6 bg-gray-100 rounded-b-2xl">
          <h3 className="text-xl font-semibold mb-4">Add New Admin</h3>
          <form onSubmit={handleAddAdmin} className="space-y-4">
            <input
              type="text"
              placeholder="First Name"
              value={adminForm.name}
              onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
              required
              className="w-full p-3 rounded-lg border border-gray-300"
            />
            <input
              type="text"
              placeholder="Surname"
              value={adminForm.surname}
              onChange={(e) => setAdminForm({ ...adminForm, surname: e.target.value })}
              required
              className="w-full p-3 rounded-lg border border-gray-300"
            />
            <input
              type="text"
              placeholder="ID Number"
              value={adminForm.idNumber}
              onChange={(e) => setAdminForm({ ...adminForm, idNumber: e.target.value })}
              required
              className="w-full p-3 rounded-lg border border-gray-300"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={adminForm.email}
              onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
              required
              className="w-full p-3 rounded-lg border border-gray-300"
            />
            <input
              type="password"
              placeholder="Password"
              value={adminForm.password}
              onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
              required
              className="w-full p-3 rounded-lg border border-gray-300"
            />
            <button
              type="submit"
              disabled={addingAdmin}
              className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all"
            >
              {addingAdmin ? <Loader className="animate-spin mx-auto" /> : 'Add Admin'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
