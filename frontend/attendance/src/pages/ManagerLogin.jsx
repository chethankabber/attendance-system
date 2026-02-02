import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ManagerLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/manager/login', formData);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('manager', JSON.stringify(response.data.manager));
      
      navigate('/manager/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-darker via-dark to-darker flex items-center justify-center p-4">
      <div className="bg-card-dark rounded-2xl shadow-2xl p-8 w-full max-w-md border border-dark">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            <span className="text-white text-4xl">🔐</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Manager Login</h1>
          <p className="text-gray-400">Access your dashboard</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-400 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-darker border border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-gray-500"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-400 font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-3 bg-darker border border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-gray-500"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-900 bg-opacity-20 border border-red-800 rounded-lg p-4">
              <p className="text-red-400 text-sm text-center font-semibold">❌ {error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white font-bold py-4 rounded-lg transition duration-200 disabled:bg-gray-700 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? 'Logging in...' : '🔓 Login'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            User? <a href="/" className="text-primary hover:text-secondary transition">Check in here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManagerLogin;