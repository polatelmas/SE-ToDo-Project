import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { authService, RegisterPayload, LoginPayload } from '../services/auth';
import { ApiError } from '../services/api';
import { Mail, Lock, User, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onLoginSuccess: (userId: number) => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isRegistering) {
        if (!username || !email || !password || !birthDate) {
          setError('Please fill in all fields');
          return;
        }

        const response = await authService.register({
          username,
          email,
          birth_date: birthDate,
          password,
        } as RegisterPayload);

        onLoginSuccess(response.user_id);
      } else {
        if (!email || !password) {
          setError('Please fill in all fields');
          return;
        }

        const response = await authService.login({
          email,
          password,
        } as LoginPayload);

        onLoginSuccess(response.user_id);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError((err as ApiError).message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-1">
              ChronoTask
            </h1>
            <p className="text-gray-500 font-medium">Manage your time, organize your life</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setIsRegistering(false);
                setError(null);
              }}
              className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all ${
                !isRegistering
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            
            <button
              type="button"
              onClick={() => {
                setIsRegistering(true);
                setError(null);
              }}
              className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all ${
                isRegistering
                  ? 'bg-white text-purple-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium"
              >
                {error}
              </motion.div>
            )}

            {/* Username Field - Register only */}
            {isRegistering && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
                <label className="text-sm font-semibold text-gray-700">Username</label>
                <Input
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  className="w-full border-2 border-gray-200 focus:border-purple-500 focus:outline-none rounded-lg px-4 py-2.5"
                />
              </motion.div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Email Address</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none rounded-lg px-4 py-2.5"
              />
            </div>

            {/* Birth Date - Register only */}
            {isRegistering && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
                <label className="text-sm font-semibold text-gray-700">Birth Date</label>
                <Input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  disabled={isLoading}
                  className="w-full border-2 border-gray-200 focus:border-purple-500 focus:outline-none rounded-lg px-4 py-2.5"
                />
              </motion.div>
            )}

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none rounded-lg px-4 py-2.5"
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full text-white py-3 rounded-lg font-bold text-lg transition-all disabled:opacity-50 mt-6 ${
                isRegistering
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
              }`}
            >
              {isLoading ? 'Loading...' : (isRegistering ? 'Create Account' : 'Sign In')}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
