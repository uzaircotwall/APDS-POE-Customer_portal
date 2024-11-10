import React, { useState } from 'react';
import api from '../api';

const Register = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleIdNumberChange = (e) => {
    const value = e.target.value;
    // Only set the value if it contains up to 13 digits and is numeric
    if (/^\d{0,13}$/.test(value)) {
      setIdNumber(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!name || !surname || !idNumber || !email || !password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/api/auth/register', { 
        name, 
        surname, 
        idNumber, 
        email, 
        password 
      });
      setMessage('Registration successful!');
      console.log('Registered:', response.data);
    } catch (error) {
      setError(error.response?.data.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-yellow-400 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 md:p-10">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
            <span className="text-3xl">✨</span>
          </div>

          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent mb-2">
            Create Account
          </h2>
          <p className="text-center text-gray-600 mb-8">Join us to access exclusive features</p>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md text-red-500 text-sm">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-md text-green-500 text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your first name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="surname" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                id="surname"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="Enter your last name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">ID Number</label>
              <input
                type="text"
                id="idNumber"
                value={idNumber}
                onChange={handleIdNumberChange}
                placeholder="Enter your ID number"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                maxLength="13"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a strong password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg shadow-lg hover:from-yellow-600 hover:to-yellow-700 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-yellow-600 font-medium hover:text-yellow-700 hover:underline transition-colors duration-200">
                Login Here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
