import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { authService, RegisterPayload, LoginPayload } from '../services/auth';
import { ApiError } from '../services/api';

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

  const handleDemoLogin = () => {
    setError(null);
    setIsLoading(true);

    try {
      // Create mock demo user without backend
      const demoUser = {
        id: 999,
        username: 'demo_user',
        email: 'demo@example.com',
      };

      const demoToken = 'demo_token_' + Date.now();

      // Store in localStorage (same as auth service does)
      localStorage.setItem('auth_token', demoToken);
      localStorage.setItem('auth_user', JSON.stringify(demoUser));

      console.log('✅ Demo mode activated:', demoUser.username);
      onLoginSuccess(demoUser.id);
    } catch (err) {
      setError('Demo login failed');
      console.error('❌ Demo login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          📋 TODO App
        </h1>
        <p className="text-center text-gray-600 mb-8">
          {isRegistering ? 'Create your account' : 'Welcome back'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {isRegistering && (
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="border-gray-200"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="border-gray-200"
            />
          </div>

          {isRegistering && (
            <div className="space-y-2">
              <Label htmlFor="birthDate">Birth Date</Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                disabled={isLoading}
                className="border-gray-200"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="border-gray-200"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium"
          >
            {isLoading ? 'Loading...' : isRegistering ? 'Create Account' : 'Login'}
          </Button>

          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError(null);
            }}
            disabled={isLoading}
            className="w-full text-center text-blue-600 hover:text-blue-700 font-medium py-2"
          >
            {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or try demo</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2.5 rounded-lg font-medium transition-all disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : '🎯 Demo Login'}
          </button>

          <p className="text-center text-xs text-gray-500 mt-2">
            Demo: demo@example.com / password123
          </p>
        </form>
      </div>
    </div>
  );
}
