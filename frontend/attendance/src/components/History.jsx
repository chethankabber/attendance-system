import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { SquareUserRound, Mail, FileText, Sheet, Clock, CalendarDays } from 'lucide-react';


const History = () => {
  const [historyData, setHistoryData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sundays, setSundays] = useState(0);
  const [saturdays, setSaturdays] = useState(0);


  useEffect(() => {
    const now = new Date();
    setSelectedMonth(String(now.getMonth() + 1).padStart(2, '0'));
    setSelectedYear(String(now.getFullYear()));
  }, []);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchHistory();
    }
  }, [selectedMonth, selectedYear]);

  const fetchHistory = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/attendance/history', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          month: selectedMonth,
          year: selectedYear
        }
      });
      setHistoryData(response.data);
    } catch (error) {
      setError('Failed to load history data');
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthSettings = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('/api/attendance/month-settings', {
      headers: { Authorization: `Bearer ${token}` },
      params: { month: selectedMonth, year: selectedYear }
    });

    setSundays(res.data.sundays);
    setSaturdays(res.data.saturdays);
  };

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchMonthSettings();
    }
  }, [selectedMonth, selectedYear]);

  const saveMonthSettings = async () => {
    const token = localStorage.getItem('token');
    await axios.put(
      '/api/attendance/month-settings',
      { month: selectedMonth, year: selectedYear, sundays, saturdays },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };


  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Attendance Report', 14, 20);

    doc.setFontSize(12);
    doc.text(`Period: ${historyData.month}`, 14, 30);
    doc.text(`Total Working Days: ${historyData.totalDays}`, 14, 37);

    const tableData = historyData.history.map(record => [
      record.name,
      record.email,
      record.totalPresent,
      record.totalAbsent,
      record.avgWorkHours
    ]);

    doc.autoTable({
      head: [['Name', 'Email', 'Present', 'Absent', 'Avg Work Hours']],
      body: tableData,
      startY: 45,
      theme: 'grid',
      headStyles: { fillColor: [6, 182, 212] }
    });

    doc.save(`attendance-report-${selectedYear}-${selectedMonth}.pdf`);
  };

  const downloadExcel = () => {
    if (!historyData) return;

    let csv = 'Name,Email,Total Present,Total Absent,Average Work Hours\n';

    historyData.history.forEach(record => {
      csv += `${record.name},${record.email},${record.totalPresent},${record.totalAbsent},${record.avgWorkHours}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${selectedYear}-${selectedMonth}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div>
      {/* Header */}
      <div className="mb-6 mt-2">
        <h1 className="text-3xl font-bold text-white mb-2">Attendance History</h1>
        <p className="text-gray-400">View monthly attendance reports</p>
      </div>

      {/* Controls */}
      <div className="bg-card-dark rounded-lg shadow-2xl p-6 mb-6 border border-dark">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-gray-400 font-medium mb-2">Month<CalendarDays className="inline ml-2 w-4 h-4" /></label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-3 bg-darker border border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-gray-400 font-medium mb-2">Year<CalendarDays className="inline ml-2 w-4 h-4" /></label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-4 py-3 bg-darker border border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
            >
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            {/* <button
              onClick={downloadPDF}
              disabled={!historyData || loading}
              className="bg-secondary hover:bg-primary text-white px-6 py-3 rounded-lg transition duration-200 disabled:bg-gray-700 disabled:cursor-not-allowed font-medium shadow-lg flex items-center space-x-2"
            >
              <span><FileText className='w-4 h-4' /></span>
              <span>PDF</span>
            </button> */}
            <button
              onClick={downloadExcel}
              disabled={!historyData || loading}
              className="bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white px-6 py-3 rounded-lg transition duration-200 disabled:bg-gray-700 disabled:cursor-not-allowed font-medium shadow-lg flex items-center space-x-2"
            >
              <span><Sheet className='w-4 h-4' /></span>
              <span>CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-400">Loading...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900 bg-opacity-20 border border-red-800 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* History Table */}
      {!loading && !error && historyData && (
        <div className="bg-card-dark rounded-lg shadow-2xl overflow-hidden border border-dark">
          <div className="px-6 py-4 bg-darker border-b border-dark">
            <h2 className="text-xl font-semibold text-white">
              {historyData.month} - {historyData.totalDays} Working Days
            </h2>
            {/* {sundays || saturdays ? (
              <p className="text-gray-400 text-sm mt-1">
                (Including {sundays} Sundays and {saturdays} Saturdays)
              </p>
            ) : null} */}
            <div className="bg-darker p-4 rounded-lg mt-0">
              <div className="flex items-center gap-4 text-sm text-gray-300">

                <div>
                  weekends :
                  <input
                    type="number"
                    value={sundays}
                    onChange={(e) => setSundays(Number(e.target.value))}
                    className="w-14 ml-2 px-2 bg-black border border-dark rounded"
                  />
                </div>

                <div>
                  Extra-Holidays :
                  <input
                    type="number"
                    value={saturdays}
                    onChange={(e) => setSaturdays(Number(e.target.value))}
                    className="w-14 ml-2 px-2 bg-black border border-dark rounded"
                  />
                </div>

                <div className="font-semibold text-primary">
                  = {sundays + saturdays} Holidays
                </div>

                <button
                  onClick={saveMonthSettings}
                  className="ml-auto bg-primary px-4 py-1 rounded text-white"
                >
                  Save
                </button>

              </div>
            </div>
            {/* Month Settings */}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-darker border-b border-dark">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Employee Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Total Present
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Total Absent
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Avg Work Hours
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark">
                {historyData.history.map((record) => (
                  <tr key={record.userId} className="hover:bg-darker transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white"><SquareUserRound className="inline mr-2" />{record.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300"><Mail className="inline mr-2" />{record.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary bg-opacity-20 text-primary border border-primary">
                        {record.totalPresent} days
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-900 bg-opacity-20 text-red-400 border border-red-800">
                        {record.totalAbsent} days
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300 font-medium"><Clock className="inline mr-1 w-4 h-4" />{record.avgWorkHours}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>

          {historyData.history.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-5xl mb-4">📭</div>
              <p>No attendance records found for this period.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default History;