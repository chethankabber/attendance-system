import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, SquareUserRound, RotateCcw, CalendarDays} from 'lucide-react';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/attendance/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardData(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const formatTime = (time) => {
    if (!time) return '—';
    return new Date(time).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-400">Loading..💿</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900 bg-opacity-20 border border-red-800 rounded-lg p-4">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-card-dark rounded-lg shadow-2xl p-6 mb-6 border border-dark mt-2">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Today's Attendance</h1>
            <p className="text-gray-400">
             <CalendarDays className="inline text-blue-400 w-4 h-4 mr-1" /> {dashboardData?.date} • {dashboardData?.day}
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white px-6 py-3 rounded-lg transition duration-200 font-medium shadow-lg flex items-center space-x-2"
          >
            <span><RotateCcw className="w-4 h-4" /></span>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Present Card */}
        <div className="bg-card-dark border border-primary rounded-lg p-6 shadow-xl hover:shadow-primary/20 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary text-sm font-medium mb-2">Present</p>
              <p className="text-4xl font-bold text-white">
                {dashboardData?.attendance.filter(a => a.status === 'Present').length}
              </p>
            </div>
          </div>
        </div>

        {/* Absent Card */}
        <div className="bg-card-dark border border-red-500 rounded-lg p-6 shadow-xl hover:shadow-red-500/20 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-400 text-sm font-medium mb-2">Absent</p>
              <p className="text-4xl font-bold text-white">
                {dashboardData?.attendance.filter(a => a.status === 'Absent').length}
              </p>
            </div>
          </div>
        </div>

        {/* Total Card */}
        <div className="bg-card-dark border border-secondary rounded-lg p-6 shadow-xl hover:shadow-secondary/20 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary text-sm font-medium mb-2">Total Employee's</p>
              <p className="text-4xl font-bold text-white">
                {dashboardData?.attendance.length}
              </p>
            </div>
           
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-card-dark rounded-lg shadow-2xl overflow-hidden border border-dark">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-darker border-b border-dark">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                  Employee Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                  Check In
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                  Check Out
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark">
              {dashboardData?.attendance.map((record) => (
                <tr key={record.userId} className="hover:bg-darker transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white"><SquareUserRound className="inline text-blue-400 mr-2 w-4 h-4" />{record.name}</div>
                    <div className="text-sm text-gray-400">{record.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{formatTime(record.checkIn)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{formatTime(record.checkOut)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        record.status === 'Present'
                          ? 'bg-primary bg-opacity-20 text-primary border border-primary'
                          : 'bg-red-900 bg-opacity-20 text-red-400 border border-red-800'
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;