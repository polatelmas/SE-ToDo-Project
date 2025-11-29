// API Configuration and Methods
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface Task {
  id: string;
  title: string;
  time: string;
  description: string;
  priority: 'high' | 'low';
  completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  priority: 'high' | 'low';
  time?: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  priority?: 'high' | 'low';
  time?: string;
  completed?: boolean;
}

class ApiService {
  private baseUrl = API_BASE_URL;

  // Get all tasks
  async getTasks(): Promise<Task[]> {
    try {
      const response = await fetch(`${this.baseUrl}/todos/`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  // Create new task
  async createTask(payload: CreateTaskPayload): Promise<Task> {
    try {
      const response = await fetch(`${this.baseUrl}/todos/create/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to create task');
      return await response.json();
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  // Update task
  async updateTask(id: string, payload: UpdateTaskPayload): Promise<Task> {
    try {
      const response = await fetch(`${this.baseUrl}/todos/${id}/update/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to update task');
      return await response.json();
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  // Delete task
  async deleteTask(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/todos/${id}/delete/`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete task');
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  // Toggle task completion
  async toggleTask(id: string, completed: boolean): Promise<Task> {
    return this.updateTask(id, { completed });
  }
}

export const apiService = new ApiService();
