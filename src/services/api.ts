// API Configuration and Task Service
// Backend Schema Compliant

import { authService } from './auth';
import { transformTaskToAPI, transformTaskFromAPI, getRecurrenceString, getRecurrenceId } from './enums';

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

// Task Types (from backend Todo/Task model)
export interface Task {
  id: number;
  user_id: number;
  category_id: number | null;
  title: string;
  description: string;
  priority_id: number;
  due_date: string | null;
  status_id: number;
  recurrence_type_id: number;
  recurrence_end_date: string | null;
  color_code: string;
  created_at?: string;
  updated_at?: string;
  // Convenience fields (for frontend display)
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  status?: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  recurrence_type?: string | null;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  priority_id: number;
  due_date?: string | null;
  category_id?: number | null;
  status_id?: number;
  recurrence_type_id?: number;
  recurrence_end_date?: string | null;
  color_code?: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  priority_id?: number;
  due_date?: string | null;
  status_id?: number;
  category_id?: number | null;
  recurrence_type_id?: number;
  recurrence_end_date?: string | null;
  color_code?: string;
}

// Event Types (from backend Event model)
export interface Event {
  id: number;
  user_id: number;
  title: string;
  description?: string | null;
  start_time: string;
  end_time: string;
  location?: string;
  color_code?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateEventPayload {
  title: string;
  start_time: string;
  end_time: string;
  location?: string;
  description?: string | null;
  color_code?: string;
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
        return result.map((item) => {
          const validated = this.validateTask(item);
          // Transform API response to frontend format
          return transformTaskFromAPI(validated);
        });
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
      // Transform frontend payload to API format (string -> IDs)
      const apiPayload = transformTaskToAPI(payload);
      
      const response = await fetch(`${this.baseUrl}/tasks/?user_id=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
        body: JSON.stringify(apiPayload),
        signal: AbortSignal.timeout(10000),
      });

      const data = await this.handleResponse(response, (result) => {
        const validated = this.validateTask(result);
        // Transform API response back to frontend format (IDs -> string)
        return transformTaskFromAPI(validated);
      });
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
      // Transform frontend payload to API format
      const apiPayload = transformTaskToAPI(payload);
      
      const response = await fetch(`${this.baseUrl}/tasks/${id}?user_id=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
        body: JSON.stringify(apiPayload),
        signal: AbortSignal.timeout(10000),
      });

      const data = await this.handleResponse(response, (result) => {
        const validated = this.validateTask(result);
        // Transform API response back to frontend format
        return transformTaskFromAPI(validated);
      });
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
    // Simple toggle: fetch task, check status, toggle and update
    const tasks = await this.getTasks(userId);
    const task = tasks.find(t => t.id === id);
    if (!task) throw new ApiError(404, 'Task not found');
    
    const newStatusId = task.status_id === 1 ? 2 : 1; // 1=PENDING, 2=COMPLETED
    return this.updateTask(id, userId, { status_id: newStatusId });
  }

  // ============= EVENTS METHODS =============

  // Get all events for a user
  async getEvents(userId: number): Promise<Event[]> {
    try {
      const response = await fetch(`${this.baseUrl}/events/?user_id=${userId}`, {
        headers: {
          ...authService.getAuthHeader(),
        },
        signal: AbortSignal.timeout(10000),
      });

      const data = await this.handleResponse(response, (result) => {
        if (!Array.isArray(result)) {
          throw new ApiError(500, 'Expected array response from getEvents, got ' + typeof result);
        }
        return result.map((item) => item as Event);
      });

      console.log('✅ Successfully fetched events for user', userId, ':', data);
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('❌ API Error fetching events:', error.statusCode, error.message);
        throw error;
      }
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError(408, 'Request timeout: Failed to fetch events');
        }
        console.error('❌ Network error fetching events:', error.message);
        throw new ApiError(0, 'Network error: ' + error.message);
      }
      throw new ApiError(0, 'Unknown error while fetching events');
    }
  }

  // Create new event
  async createEvent(userId: number, payload: CreateEventPayload): Promise<Event> {
    try {
      const response = await fetch(`${this.baseUrl}/events/?user_id=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000),
      });

      const data = await this.handleResponse(response, (result) => result as Event);
      console.log('✅ Successfully created event for user', userId, ':', data);
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('❌ API Error creating event:', error.statusCode, error.message);
        throw error;
      }
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError(408, 'Request timeout: Failed to create event');
        }
        console.error('❌ Network error creating event:', error.message);
        throw new ApiError(0, 'Network error: ' + error.message);
      }
      throw new ApiError(0, 'Unknown error while creating event');
    }
  }

  // ============= NOTES METHODS =============

  // Get all notes for a user
  async getNotes(userId: number): Promise<Note[]> {
    try {
      const response = await fetch(`${this.baseUrl}/notes/?user_id=${userId}`, {
        headers: {
          ...authService.getAuthHeader(),
        },
        signal: AbortSignal.timeout(10000),
      });

      const data = await this.handleResponse(response, (result) => {
        if (!Array.isArray(result)) {
          throw new ApiError(500, 'Expected array response from getNotes, got ' + typeof result);
        }
        return result.map((item) => item as Note);
      });

      console.log('✅ Successfully fetched notes for user', userId, ':', data);
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('❌ API Error fetching notes:', error.statusCode, error.message);
        throw error;
      }
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError(408, 'Request timeout: Failed to fetch notes');
        }
        console.error('❌ Network error fetching notes:', error.message);
        throw new ApiError(0, 'Network error: ' + error.message);
      }
      throw new ApiError(0, 'Unknown error while fetching notes');
    }
  }

  // Create new note
  async createNote(userId: number, payload: CreateNotePayload): Promise<Note> {
    try {
      const response = await fetch(`${this.baseUrl}/notes/?user_id=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000),
      });

      const data = await this.handleResponse(response, (result) => result as Note);
      console.log('✅ Successfully created note for user', userId, ':', data);
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('❌ API Error creating note:', error.statusCode, error.message);
        throw error;
      }
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError(408, 'Request timeout: Failed to create note');
        }
        console.error('❌ Network error creating note:', error.message);
        throw new ApiError(0, 'Network error: ' + error.message);
      }
      throw new ApiError(0, 'Unknown error while creating note');
    }
  }

  // ============= CATEGORIES METHODS =============

  // Get all categories for a user
  async getCategories(userId: number): Promise<Category[]> {
    try {
      const response = await fetch(`${this.baseUrl}/categories/?user_id=${userId}`, {
        headers: {
          ...authService.getAuthHeader(),
        },
        signal: AbortSignal.timeout(10000),
      });

      const data = await this.handleResponse(response, (result) => {
        if (!Array.isArray(result)) {
          throw new ApiError(500, 'Expected array response from getCategories, got ' + typeof result);
        }
        return result.map((item) => item as Category);
      });

      console.log('✅ Successfully fetched categories for user', userId, ':', data);
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('❌ API Error fetching categories:', error.statusCode, error.message);
        throw error;
      }
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError(408, 'Request timeout: Failed to fetch categories');
        }
        console.error('❌ Network error fetching categories:', error.message);
        throw new ApiError(0, 'Network error: ' + error.message);
      }
      throw new ApiError(0, 'Unknown error while fetching categories');
    }
  }

  // Create new category
  async createCategory(userId: number, payload: CreateCategoryPayload): Promise<Category> {
    try {
      const response = await fetch(`${this.baseUrl}/categories/?user_id=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000),
      });

      const data = await this.handleResponse(response, (result) => result as Category);
      console.log('✅ Successfully created category for user', userId, ':', data);
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('❌ API Error creating category:', error.statusCode, error.message);
        throw error;
      }
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError(408, 'Request timeout: Failed to create category');
        }
        console.error('❌ Network error creating category:', error.message);
        throw new ApiError(0, 'Network error: ' + error.message);
      }
      throw new ApiError(0, 'Unknown error while creating category');
    }
  }

  // ============= NOTES UPDATE/DELETE METHODS =============

  // Update a note
  async updateNote(id: number, userId: number, payload: Partial<CreateNotePayload>): Promise<Note> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${this.baseUrl}/notes/${id}?user_id=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(response.status, errorData.detail || 'Failed to update note', errorData);
      }

      const data: Note = await response.json();
      console.log('✅ Successfully updated note for user', userId, ':', data);
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('❌ API Error updating note:', error.statusCode, error.message);
        throw error;
      }
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError(408, 'Request timeout: Failed to update note');
        }
        console.error('❌ Network error updating note:', error.message);
        throw new ApiError(0, 'Network error: ' + error.message);
      }
      throw new ApiError(0, 'Unknown error while updating note');
    }
  }

  // Delete a note
  async deleteNote(id: number, userId: number): Promise<void> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${this.baseUrl}/notes/${id}?user_id=${userId}`, {
        method: 'DELETE',
        headers: authService.getAuthHeader(),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(response.status, errorData.detail || 'Failed to delete note', errorData);
      }

      console.log('✅ Successfully deleted note for user', userId);
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('❌ API Error deleting note:', error.statusCode, error.message);
        throw error;
      }
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError(408, 'Request timeout: Failed to delete note');
        }
        console.error('❌ Network error deleting note:', error.message);
        throw new ApiError(0, 'Network error: ' + error.message);
      }
      throw new ApiError(0, 'Unknown error while deleting note');
    }
  }

  // ============= EVENTS UPDATE/DELETE METHODS =============

  // Update an event
  async updateEvent(id: number, userId: number, payload: Partial<CreateEventPayload>): Promise<Event> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${this.baseUrl}/events/${id}?user_id=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(response.status, errorData.detail || 'Failed to update event', errorData);
      }

      const data: Event = await response.json();
      console.log('✅ Successfully updated event for user', userId, ':', data);
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('❌ API Error updating event:', error.statusCode, error.message);
        throw error;
      }
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError(408, 'Request timeout: Failed to update event');
        }
        console.error('❌ Network error updating event:', error.message);
        throw new ApiError(0, 'Network error: ' + error.message);
      }
      throw new ApiError(0, 'Unknown error while updating event');
    }
  }

  // Delete an event
  async deleteEvent(id: number, userId: number): Promise<void> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${this.baseUrl}/events/${id}?user_id=${userId}`, {
        method: 'DELETE',
        headers: authService.getAuthHeader(),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(response.status, errorData.detail || 'Failed to delete event', errorData);
      }

      console.log('✅ Successfully deleted event for user', userId);
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('❌ API Error deleting event:', error.statusCode, error.message);
        throw error;
      }
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError(408, 'Request timeout: Failed to delete event');
        }
        console.error('❌ Network error deleting event:', error.message);
        throw new ApiError(0, 'Network error: ' + error.message);
      }
      throw new ApiError(0, 'Unknown error while deleting event');
    }
  }

  // ============= CATEGORIES UPDATE/DELETE METHODS =============

  // Update a category
  async updateCategory(id: number, userId: number, payload: Partial<CreateCategoryPayload>): Promise<Category> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${this.baseUrl}/categories/${id}?user_id=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeader(),
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(response.status, errorData.detail || 'Failed to update category', errorData);
      }

      const data: Category = await response.json();
      console.log('✅ Successfully updated category for user', userId, ':', data);
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('❌ API Error updating category:', error.statusCode, error.message);
        throw error;
      }
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError(408, 'Request timeout: Failed to update category');
        }
        console.error('❌ Network error updating category:', error.message);
        throw new ApiError(0, 'Network error: ' + error.message);
      }
      throw new ApiError(0, 'Unknown error while updating category');
    }
  }

  // Delete a category
  async deleteCategory(id: number, userId: number): Promise<void> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${this.baseUrl}/categories/${id}?user_id=${userId}`, {
        method: 'DELETE',
        headers: authService.getAuthHeader(),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(response.status, errorData.detail || 'Failed to delete category', errorData);
      }

      console.log('✅ Successfully deleted category for user', userId);
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('❌ API Error deleting category:', error.statusCode, error.message);
        throw error;
      }
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError(408, 'Request timeout: Failed to delete category');
        }
        console.error('❌ Network error deleting category:', error.message);
        throw new ApiError(0, 'Network error: ' + error.message);
      }
      throw new ApiError(0, 'Unknown error while deleting category');
    }
  }
}

export const apiService = new ApiService();
