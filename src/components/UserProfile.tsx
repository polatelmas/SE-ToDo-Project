import { motion } from 'motion/react';
import { ArrowLeft, Mail, Calendar, User, Edit2, Save, Lock, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { authService } from '../services/auth';
import { useTheme } from '../context/ThemeContext';

interface UserProfileProps {
  onBack: () => void;
}

export function UserProfile({ onBack }: UserProfileProps) {
  const user = authService.getCurrentUser();
  const { theme, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const handleSave = () => {
    setIsEditing(false);
    console.log('Profile updated:', formData);
  };

  const handlePasswordChange = () => {
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!passwordForm.currentPassword) {
      setPasswordError('Current password is required');
      return;
    }
    if (!passwordForm.newPassword) {
      setPasswordError('New password is required');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    console.log('Password change requested');
    setPasswordSuccess('Password changed successfully!');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setTimeout(() => {
      setShowPasswordForm(false);
      setPasswordSuccess(null);
    }, 2000);
  };

  return (
    <div className={`min-h-screen transition-colors ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 to-gray-100'
    }`}>
      {/* Header */}
      <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-10 transition-colors`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className={`h-10 w-10 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} flex items-center justify-center transition-colors`}
          >
            <ArrowLeft className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>My Profile</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-2xl shadow-lg p-8 transition-colors`}
        >
          {/* Profile Avatar & Header */}
          <div className={`flex items-start justify-between mb-8 pb-8 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-4xl font-bold text-white">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-1">
                  {user?.username || 'User'}
                </h2>
                <p className="text-gray-500 text-sm">ID: #{user?.id || '999'}</p>
              </div>
            </div>

            {!isEditing && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </motion.button>
            )}
          </div>

          {/* Profile Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-blue-600" />
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              ) : (
                <p className="text-gray-900 font-medium">{user?.email || 'Not set'}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-blue-600" />
                Username
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
              ) : (
                <p className="text-gray-900 font-medium">{user?.username || 'Not set'}</p>
              )}
            </div>

            {/* Member Since */}
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                Member Since
              </label>
              <p className="text-gray-900 font-medium">
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            {/* Account Status */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Status</label>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <p className="text-gray-900 font-medium">Active</p>
              </div>
            </div>
          </div>

          {/* Edit Actions */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 border-t border-gray-200 pt-6 mb-8"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </motion.button>

              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    username: user?.username || '',
                    email: user?.email || '',
                  });
                }}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          )}

          {/* Change Password Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Lock className="h-5 w-5 text-blue-600" />
                Security
              </h3>
              {!showPasswordForm && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPasswordForm(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors text-sm"
                >
                  Change Password
                </motion.button>
              )}
            </div>

            {showPasswordForm && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 rounded-xl p-6 space-y-4"
              >
                {/* Error Message */}
                {passwordError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
                    {passwordError}
                  </div>
                )}

                {/* Success Message */}
                {passwordSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm font-medium">
                    ✓ {passwordSuccess}
                  </div>
                )}

                {/* Current Password */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      placeholder="Enter current password"
                      className="w-full px-4 py-2 pr-10 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      placeholder="Enter new password"
                      className="w-full px-4 py-2 pr-10 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-2 pr-10 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePasswordChange}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    Update Password
                  </motion.button>

                  <button
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordForm({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                      });
                      setPasswordError(null);
                    }}
                    className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Stats Section */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">0</div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Tasks Completed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">0</div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Active Tasks</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">0%</div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Completion Rate</p>
            </div>
          </div>

          {/* Theme Toggle Section */}
          <div className={`mt-8 pt-8 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {theme === 'dark' ? (
                  <Moon className="h-5 w-5 text-yellow-400" />
                ) : (
                  <Sun className="h-5 w-5 text-blue-600" />
                )}
                Theme
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                  theme === 'dark'
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
