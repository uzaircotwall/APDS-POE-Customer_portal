import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import UserHome from './components/UserHome';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null); // 'user' or 'admin'

  const handleLogin = (userToken, userRole) => {
    setToken(userToken);
    setRole(userRole);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken(null);
    setRole(null);
  };

  return (
    <Router>
      <div className="App relative min-h-screen">
        {/* Logout Button in Top Right Corner */}
        {isAuthenticated && (
          <div className="absolute top-4 right-4">
            <button
              onClick={handleLogout}
              className="p-2 bg-yellow-500 text-black rounded hover:bg-yellow-600 transition duration-300"
            >
              Logout
            </button>
          </div>
        )}

        <Routes>
          {/* Homepage Route */}
          <Route path="/" element={!isAuthenticated ? <Home /> : <Navigate to={role === 'admin' ? "/admin" : "/user-home"} />} />
          
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to={role === 'admin' ? "/admin" : "/user-home"} /> : <Login onLogin={handleLogin} />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to={role === 'admin' ? "/admin" : "/user-home"} /> : <Register onRegister={handleLogin} />}
          />

          {/* Admin Route */}
          {isAuthenticated && role === 'admin' && (
            <Route path="/admin" element={<AdminDashboard token={token} />} />
          )}

          {/* User Route */}
          {isAuthenticated && role === 'user' && (
            <Route path="/user-home" element={<UserHome token={token} />} />
          )}

          {/* Fallback for undefined routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
