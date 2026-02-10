import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, SquarePen, Eye, EyeOff, SquareUserRound, Mail, UserRoundPlus, Pencil, KeySquare } from 'lucide-react';

const AddUser = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);


  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/users/getall', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');

      if (editMode) {
        await axios.put(`/api/users/update/${editUserId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('User updated successfully!');
      } else {
        await axios.post('/api/users/adduser', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('User added successfully!');
      }

      setFormData({ name: '', email: '', password: '' });
      setEditMode(false);
      setEditUserId(null);
      fetchUsers();

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error processing request');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: ''
    });
    setEditMode(true);
    setEditUserId(user._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (userId) => {
    setDeleteUserId(userId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');

      await axios.delete(`/api/users/delete/${deleteUserId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('User deleted successfully!');
      fetchUsers();

    } catch (error) {
      setMessage('Error deleting user');
    } finally {
      setShowDeleteModal(false);
      setDeleteUserId(null);
      setTimeout(() => setMessage(''), 3000);
    }
  };




  const cancelEdit = () => {
    setFormData({ name: '', email: '', password: '' });
    setEditMode(false);
    setEditUserId(null);
  };

  const togglePasswordVisibility = (userId) => {
    setShowPasswords({
      ...showPasswords,
      [userId]: !showPasswords[userId]
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 mt-2">
        <h1 className="text-3xl font-bold text-white mb-2">Employee Management</h1>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-4 p-4 rounded-lg border ${message.includes('Error') || message.includes('deleted')
          ? 'bg-red-900 bg-opacity-20 border-red-800 text-red-400'
          : 'bg-primary bg-opacity-20 border-primary text-primary'
          }`}>
          {message}
        </div>
      )}

      {/* Add/Edit User Form */}
      <div className="bg-card-dark rounded-lg shadow-2xl p-6 mb-6 border border-dark">
        <h2 className="text-xl font-semibold mb-4 text-white">
          {editMode ? 'Edit Employee' : 'Add New Employee'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-400 font-medium mb-2"><Pencil className="inline mr-2 w-4 h-4" />Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter employee name"
                className="w-full px-4 py-3 bg-darker border border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-gray-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 font-medium mb-2"><Mail className="inline mr-2 w-4 h-4" />Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full px-4 py-3 bg-darker border border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-gray-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 font-medium mb-2">
                <KeySquare className="inline mr-1 w-4 h-4" /> Password {editMode && <span className="text-xs">(leave empty to keep current)</span>}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full px-4 py-3 bg-darker border border-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white placeholder-gray-500"
                required={!editMode}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white px-6 py-3 rounded-lg transition duration-200 disabled:bg-gray-700 disabled:cursor-not-allowed font-medium shadow-lg"
            >
              {loading ? 'Processing...' : (editMode ? 'Update Employee' : 'Add Employee')}
            </button>

            {editMode && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-dark hover:bg-darker text-gray-300 hover:text-white px-6 py-3 rounded-lg transition duration-200 border border-dark font-medium"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Users List */}
      <div className="bg-card-dark rounded-lg shadow-2xl overflow-hidden border border-dark">
        <div className="px-6 py-4 bg-darker border-b border-dark">
          <h2 className="text-xl font-semibold text-white">All Employee's ({users.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-darker border-b border-dark">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Password
                </th> */}
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-darker transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white"><SquareUserRound className="inline mr-2 text-blue-400" />{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300"><Mail className="inline mr-2" />{user.email}</div>
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-300 font-mono">
                        {showPasswords[user._id] ? user.password : '••••••••'}
                      </span>
                      <button
                        onClick={() => togglePasswordVisibility(user._id)}
                        className="text-primary hover:text-secondary transition"
                      >
                        {showPasswords[user._id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-primary hover:text-secondary mr-4 transition font-medium"
                    >
                      <SquarePen className="inline mr-2" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-400 hover:text-red-300 transition font-medium"
                    >
                      <Trash2 className="inline ml-4" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-5xl mb-4">📝</div>
            <p>No users found. Add your first user above.</p>
          </div>
        )}
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">

          <div className="bg-card-dark border border-dark rounded-lg shadow-2xl p-6 w-[350px] text-center">

            <h3 className="text-xl font-semibold text-white mb-3">
              Delete Employee
            </h3>

            <p className="text-gray-200 mb-6">
              Are you sure you want to delete this Emplooye?
            </p>

            <div className="flex justify-center gap-4">

              <button
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition"
              >
                Yes Delete
              </button>

              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-dark hover:bg-darker text-gray-300 px-5 py-2 rounded-lg border border-dark"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default AddUser;