import React, { useState } from 'react';
import api from '../api';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/api/auth/login', { email, password });
      const token = response.data.token;
      const role = response.data.user.role;

      // Save token to localStorage
      localStorage.setItem('token', token);

      // Trigger onLogin function passed down from the parent
      onLogin(token, role);
    } catch (error) {
      setError(error.response?.data.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-100 flex items-center justify-center p-4">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-yellow-400 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 md:p-10">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
            <span className="text-3xl">🔒</span>
          </div>

          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent mb-2">
            Welcome Back!
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Please login to access your account
          </p>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
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
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg shadow-lg
                hover:from-yellow-600 hover:to-yellow-700 transform hover:-translate-y-0.5 transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="flex items-center justify-center">
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </span>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <a 
                href="/register" 
                className="text-yellow-600 font-medium hover:text-yellow-700 hover:underline transition-colors duration-200"
              >
                Register Here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
