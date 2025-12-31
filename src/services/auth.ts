import { ApiError } from './api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface RegisterPayload {
  username: string;
  email: string;
  birth_date: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user_id: number;
  username: string;
  email: string;
  access_token: string;
  refresh_token?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  birth_date?: string;
  created_at?: string;
}

class AuthService {
  private baseUrl = API_BASE_URL;
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';

  /**
   * Register a new user
   */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          response.status,
          errorData.message || `Registration failed: HTTP ${response.status}`
        );
      }

      const data = (await response.json()) as AuthResponse;

      // Store token and user info
      if (data.access_token) {
        localStorage.setItem(this.tokenKey, data.access_token);
        localStorage.setItem(
          this.userKey,
          JSON.stringify({
            id: data.user_id,
            username: data.username,
            email: data.email,
          })
        );
      }

      console.log('✅ Successfully registered user:', data.username);
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('❌ API Error during registration:', (error as ApiError).statusCode, (error as ApiError).message);
        throw error;
      }
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError(408, 'Request timeout: Registration took too long');
        }
        console.error('❌ Network error during registration:', error.message);
        throw new ApiError(0, 'Network error: ' + error.message);
      }
      throw new ApiError(0, 'Unknown error during registration');
    }
  }

  /**
   * Login user
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          throw new ApiError(401, 'Invalid email or password');
        }
        throw new ApiError(
          response.status,
          errorData.message || `Login failed: HTTP ${response.status}`
        );
      }

      const data = (await response.json()) as AuthResponse;

      // Store token and user info
      if (data.access_token) {
        localStorage.setItem(this.tokenKey, data.access_token);
        localStorage.setItem(
          this.userKey,
          JSON.stringify({
            id: data.user_id,
            username: data.username,
            email: data.email,
          })
        );
      }

      console.log('✅ Successfully logged in user:', data.username);
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('❌ API Error during login:', (error as ApiError).statusCode, (error as ApiError).message);
        throw error;
      }
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError(408, 'Request timeout: Login took too long');
        }
        console.error('❌ Network error during login:', error.message);
        throw new ApiError(0, 'Network error: ' + error.message);
      }
      throw new ApiError(0, 'Unknown error during login');
    }
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): User | null {
    try {
      const userJson = localStorage.getItem(this.userKey);
      if (!userJson) return null;
      return JSON.parse(userJson) as User;
    } catch (error) {
      console.error('Failed to parse stored user:', error);
      return null;
    }
  }

  /**
   * Get auth token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null && this.getCurrentUser() !== null;
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    console.log('✅ Successfully logged out');
  }

  /**
   * Get Authorization header for API requests
   */
  getAuthHeader(): { Authorization: string } | {} {
    const token = this.getToken();
    if (!token) return {};
    return {
      Authorization: `Bearer ${token}`,
    };
  }
}

export const authService = new AuthService();
