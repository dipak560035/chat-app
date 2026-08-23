import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Profile = ({ onBackToChat }) => {
  const { user, logout, setUser } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setIsLoading(true);

    try {
      const updateData = { username, email };
      if (password) updateData.password = password;

      const { data } = await userAPI.updateProfile(updateData);
      
      // Update local storage and context
      const updatedUser = { ...user, ...data };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setPassword(''); // Clear password field after success
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to update profile.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    try {
      await userAPI.deleteAccount(user._id);
      logout();
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to delete account.' 
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-xl rounded-2xl my-8">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h2 className="text-3xl font-bold text-gray-800">User Profile</h2>
        <button 
          onClick={onBackToChat}
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
        >
          <span>&larr;</span> Back to Chat
        </button>
      </div>

      {message.text && (
        <div className={`p-4 mb-6 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            New Password <span className="text-gray-400 font-normal">(Leave blank to keep current)</span>
          </label>
          <input
            type="password"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="submit"
            className={`flex-1 py-3 px-6 rounded-xl text-white font-bold transition duration-200 shadow-md ${
              isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:transform active:scale-95'
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Saving Changes...' : 'Update Profile'}
          </button>
          
          <button
            type="button"
            onClick={logout}
            className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition duration-200"
            disabled={isLoading}
          >
            Logout
          </button>
        </div>
      </form>

      <div className="mt-12 pt-8 border-t border-red-100">
        <h3 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h3>
        <p className="text-gray-500 mb-6 text-sm">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          onClick={handleDelete}
          className={`py-3 px-8 rounded-xl border-2 border-red-600 text-red-600 font-bold hover:bg-red-600 hover:text-white transition duration-300 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Deleting Account...' : 'Delete My Account'}
        </button>
      </div>
    </div>
  );
};

export default Profile;
