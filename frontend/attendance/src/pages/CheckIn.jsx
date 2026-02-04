import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, KeySquare } from 'lucide-react';

const CheckIn = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [checkInTime, setCheckInTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [action, setAction] = useState('');


  // Auto-reset message after 15 seconds
  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        resetForm();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  const resetForm = () => {
    setMessage('');
    setUserName('');
    setCheckInTime('');
    setPassword('');
    setShowMessage(false);
  };

  const handleAction = async (actionType) => {
    if (!password) {
      setMessage('Please enter your password');
      setShowMessage(true);
      return;
    }

    setAction(actionType);
    setMessage('');
    setLoading(true);
    setShowMessage(true);

    try {
      const response = await axios.post(`/api/attendance/${actionType}`, { password });

      setMessage(response.data.message);
      setUserName(response.data.user?.name || '');

      if (response.data.action === 'checkin' && response.data.user?.checkInTime) {
        setCheckInTime(new Date(response.data.user.checkInTime).toLocaleTimeString());
      }
    } catch (error) {
      setMessage(error.response?.data?.message || `Error processing ${actionType}`);
      setUserName('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-darker via-dark to-darker flex items-center justify-center p-4">
      <div className="bg-card-dark rounded-2xl shadow-2xl p-8 w-full max-w-2xl border border-dark">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            <img src="/logo2.png" alt="Logo" className="w-38 h-38" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Attendance System</h1>
          <p className="text-gray-400">Enter your passkey and select action</p>
          <span><KeySquare className="inline w-4 h-4 text-gray-400 mt-2" /></span>
        </div>

        {/* Password Input */}
        <div className="mb-8">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your passkey"
            className="w-full px-6 py-4 bg-darker border border-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-gray-500 text-center text-lg font-medium"
            disabled={loading}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAction('checkin');
              }
            }}
          />
        </div>

        {/* Two Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 ">
          {/* Check In Button */}
          <button
            type="button"
            onClick={() => handleAction('checkin')}
            disabled={loading}
            className="group relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-6 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-green-500/50 transform hover:scale-105"
          >
            <div className="flex flex-col items-center space-y-2">

              <span className="text-xl">CHECK IN</span>
            </div>
            {loading && (
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
          </button>

          {/* Check Out Button */}
          <button
            type="button"
            onClick={() => handleAction('checkout')}
            disabled={loading}
            className="group relative overflow-hidden bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-6 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-red-500/50 transform hover:scale-105"
          >
            <div className="flex flex-col items-center space-y-2">

              <span className="text-xl">CHECK OUT</span>
            </div>
            {loading && (
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
          </button>
        </div>

        {/* Success/Error Message */}
        {showMessage && message && (
          <div className={`border rounded-xl p-6 text-center transition-all duration-300 transform ${message.includes('Error') || message.includes('already') || message.includes('first') || message.includes('Invalid')
              ? 'bg-red-900 bg-opacity-20 border-red-800 text-red-400'
              : 'bg-primary bg-opacity-20 border-primary text-primary'
            }`}>
            <div className="flex flex-col items-center space-y-3">
              <div className="text-5xl">
                {message.includes('Error') || message.includes('already') || message.includes('first')}
              </div>
              <p className="text-lg font-semibold">{message}</p>
              {userName && action === 'checkin' && (
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-white">
                    Welcome, {userName}!
                  </p>
                  {checkInTime && (
                    <p className="text-gray-400 text-sm">
                      Check-in time: {checkInTime}
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center space-x-2 text-xs text-gray-500 mt-4">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Auto-resetting in 10 seconds...</span>
              </div>
            </div>
          </div>
        )}



        {/* Footer */}
        {/* <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Manager? <a href="/manager/login" className="text-primary hover:text-secondary transition font-semibold">Login here</a>
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default CheckIn;