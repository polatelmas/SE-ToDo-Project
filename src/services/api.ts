// API Configuration and Task Service
// Backend Schema Compliant

import { authService } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// ============= ERROR HANDLING =============
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ============= TYPES & INTERFACES =============

// Task Types
export type TaskPriority = 'HIGH' | 'MEDIUM' | 'LOW';
export type TaskStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';
export type RecurrenceType = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | null;

export interface Task {
  id: number;
  user_id: number;
  category_id: number | null;
  title: string;
  description: string;
  priority: TaskPriority;
  due_date: string | null;
  status: TaskStatus;
  recurrence_type: RecurrenceType;
  recurrence_end_date: string | null;
  color_code: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  priority: TaskPriority;
  due_date?: string | null;
  category_id?: number | null;
  color_code?: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  due_date?: string | null;
  status?: TaskStatus;
  category_id?: number | null;
  color_code?: string;
}

// Event Types
export interface Event {
  id: number;
  user_id: number;
  title: string;
  start_time: string;
  end_time: string;
  location: string;
  color_code: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateEventPayload {
  title: string;
  start_time: string;
  end_time: string;
  location: string;
  color_code: string;
}

// Note Types
export interface Note {
  id: number;
  user_id: number;
  category_id: number | null;
  event_id: number | null;
  title: string;
  content: string;
  color_code: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  category_id?: number | null;
  event_id?: number | null;
  color_code?: string;
}

// Category Types
export interface Category {
  id: number;
  user_id: number;
  name: string;
  color_code: string;
  created_at?: string;
}

export interface CreateCategoryPayload {
  name: string;
  color_code: string;
}

class ApiService {
  private baseUrl = API_BASE_URL;

  /**
   * Validate task object structure
   */
  private validateTask(data: unknown): Task {
    if (!data || typeof data !== 'object') {
      throw new ApiError(400, 'Invalid task data: expected object');
    }

    const task = data as Record<string, unknown>;
    
    // Validate required fields
    if (!task.id || typeof task.id !== 'number') {
      throw new ApiError(400, 'Task missing required field: id (must be number)');
    }
    if (!task.title || typeof task.title !== 'string') {
      throw new ApiError(400, 'Task missing required field: title');
    }
    if (!task.user_id || typeof task.user_id !== 'number') {
      throw new ApiError(400, 'Task missing required field: user_id');
    }
    if (task.priority && !['HIGH', 'MEDIUM', 'LOW'].includes(task.priority as string)) {
      throw new ApiError(400, 'Task has invalid priority value. Expected: HIGH, MEDIUM, or LOW');
    }
    if (task.status && !['PENDING', 'COMPLETED', 'CANCELLED'].includes(task.status as string)) {
      throw new ApiError(400, 'Task has invalid status value. Expected: PENDING, COMPLETED, or CANCELLED');
    }

    return data as Task;
  }

  /**
   * Handle API response with proper error handling
   */
  private async handleResponse<T>(
    response: Response,
    validator: (data: unknown) => T
  ): Promise<T> {
    // Handle different HTTP status codes
    if (response.status === 401) {
      throw new ApiError(401, 'Unauthorized: Please log in again');
    }
    if (response.status === 403) {
      throw new ApiError(403, 'Forbidden: You do not have permission');
    }
    if (response.status === 404) {
      throw new ApiError(404, 'Not found: Resource does not exist');
    }
    if (response.status === 429) {
      throw new ApiError(429, 'Too many requests: Please try again later');
    }
    if (response.status >= 500) {
      throw new ApiError(response.status, 'Server error: Please try again later');
    }

    if (!response.ok) {
      const errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      throw new ApiError(response.status, errorMessage);
    }

    // Parse response
    let data: unknown;
    try {
      data = await response.json();
    } catch (error) {
      throw new ApiError(500, 'Failed to parse API response: Invalid JSON');
    }

    // Validate and return data
    return validator(data);
  }

  // Get all tasks for a user
  async getTasks(userId: number): Promise<Task[]> {
    try {
      const response = await fetch(`${this.baseUrl}/tasks/?user_id=${userId}`, {
        headers: {
          ...authService.getAuthHeader(),
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      const data = await this.handleResponse(response, (result) => {
        if (!Array.isArray(result)) {
          throw new ApiError(500, 'Expected array response from getTasks, got ' + typeof result);
        }
        return result.map((item) => this.validateTask(item));
      });

      console.log('✅ Successfully fetched tasks for user', userId, ':', data);
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('❌ API Error fetching tasks:', error.statusCode, error.message);
        throw error;
      }
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError(408, 'Request timeout: API server took too long to respond');
        }
        console.error('❌ Network error fetching tasks:', error.message);
        throw new ApiError(0, 'Network error: ' + error.message);
      }
      throw new ApiError(0, 'Unknown error while fetching tasks');
    }
  }

  // Create new task
  async createTask(userId: number, payload: CreateTaskPayload): Promise<Task> {
    try {
      const response = await fetch(`${this.baseUrl}/tasks/?user_id=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000),
      });

      const data = await this.handleResponse(response, (result) => this.validateTask(result));
      console.log('✅ Successfully created task for user', userId, ':', data);
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('❌ API Error creating task:', error.statusCode, error.message);
        throw error;
      }
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError(408, 'Request timeout: Failed to create task');
        }
        console.error('❌ Network error creating task:', error.message);
        throw new ApiError(0, 'Network error: ' + error.message);
      }
      throw new ApiError(0, 'Unknown error while creating task');
    }
  }

  // Update task
  async updateTask(id: number, userId: number, payload: UpdateTaskPayload): Promise<Task> {
    try {
      const response = await fetch(`${this.baseUrl}/tasks/${id}?user_id=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000),
      });

      const data = await this.handleResponse(response, (result) => this.validateTask(result));
      console.log('✅ Successfully updated task', id, 'for user', userId, ':', data);
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('❌ API Error updating task:', error.statusCode, error.message);
        throw error;
      }
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError(408, 'Request timeout: Failed to update task');
        }
        console.error('❌ Network error updating task:', error.message);
        throw new ApiError(0, 'Network error: ' + error.message);
      }
      throw new ApiError(0, 'Unknown error while updating task');
    }
  }

  // Delete task
  async deleteTask(id: number, userId: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/tasks/${id}?user_id=${userId}`, {
        method: 'DELETE',
        headers: {
          ...authService.getAuthHeader(),
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new ApiError(404, 'Task not found');
        }
        throw new ApiError(response.status, `Failed to delete task: HTTP ${response.status}`);
      }

      console.log('✅ Successfully deleted task', id, 'for user', userId);
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('❌ API Error deleting task:', error.statusCode, error.message);
        throw error;
      }
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError(408, 'Request timeout: Failed to delete task');
        }
        console.error('❌ Network error deleting task:', error.message);
        throw new ApiError(0, 'Network error: ' + error.message);
      }
      throw new ApiError(0, 'Unknown error while deleting task');
    }
  }

  // Toggle task completion
  async toggleTask(id: number, userId: number): Promise<Task> {
    return this.updateTask(id, userId, { status: 'COMPLETED' });
  }
}

export const apiService = new ApiService();
