import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CalendarGrid } from './components/CalendarGrid';
import { Sidebar } from './components/Sidebar';
import { TasksCompletionPanel } from './components/TasksCompletionPanel';
import { AddTaskModal } from './components/AddTaskModal';
import { AddEventModal } from './components/AddEventModal';
import { Login } from './components/Login';
import { UserProfile } from './components/UserProfile';
import MobileApp from './MobileApp';
import { apiService, Task, Event } from './services/api';
import { authService } from './services/auth';

// Define task completion state type
interface TaskCompletionState {
  [taskId: number]: boolean;
}

export default function App() {
  const [userId, setUserId] = useState<number | null>(() => {
    const user = authService.getCurrentUser();
    return user?.id ?? null;
  });
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarMode, setSidebarMode] = useState<'notes' | 'events' | 'ai'>('events');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Centralized task completion state (derived from tasks)
  const [taskCompletions, setTaskCompletions] = useState<TaskCompletionState>({});

  // Track recently completed tasks for sparkle effect
  const [recentlyCompleted, setRecentlyCompleted] = useState<string | null>(null);

  // Fetch tasks on mount
  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const fetchedTasks = await apiService.getTasks(userId);
        const fetchedEvents = await apiService.getEvents(userId);
        
        // Log fetched data to browser console
        console.log('Fetched tasks from API:', fetchedTasks);
        console.log('Fetched events from API:', fetchedEvents);
        
        setTasks(fetchedTasks);
        setEvents(fetchedEvents);
        
        // Initialize task completions from fetched data
        const completions: TaskCompletionState = {};
        fetchedTasks.forEach(task => {
          completions[task.id] = task.status === 'COMPLETED';
        });
        setTaskCompletions(completions);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch tasks/events:', err);
        setError('Failed to load tasks/events. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [userId]);

  const toggleTaskCompletion = async (taskId: number | string) => {
    const numTaskId = typeof taskId === 'string' ? parseInt(taskId) : taskId;
    if (!userId || isNaN(numTaskId)) return;

    try {
      // Capture current state BEFORE any updates
      const currentState = taskCompletions[numTaskId];
      const newState = !currentState;
      
      // Optimistic update
      setTaskCompletions(prev => ({
        ...prev,
        [numTaskId]: newState,
      }));

      // If task is being completed (false -> true), trigger sparkle effect
      if (newState) {
        setRecentlyCompleted(String(numTaskId));
        setTimeout(() => setRecentlyCompleted(null), 1000);
      }

      // Call API
      await apiService.toggleTask(numTaskId, userId);
      
      // Update tasks array
      setTasks(prev => 
        prev.map(task => 
          task.id === numTaskId ? { ...task, status: newState ? 'COMPLETED' : 'PENDING' } : task
        )
      );
    } catch (err) {
      console.error('Failed to toggle task:', err);
      // Revert optimistic update
      const currentState = taskCompletions[numTaskId];
      const previousState = !currentState; // Inverse of current to get original
      setTaskCompletions(prev => ({
        ...prev,
        [taskId]: previousState,
      }));
      setError('Failed to update task. Please try again.');
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleSidebarToggle = (mode: 'notes' | 'events' | 'ai') => {
    if (isSidebarOpen && sidebarMode === mode) {
      setIsSidebarOpen(false);
    } else {
      setSidebarMode(mode);
      setIsSidebarOpen(true);
    }
  };

  // Show login if not authenticated
  if (!userId) {
    return <Login onLoginSuccess={(id) => setUserId(id)} />;
  }

  // Show mobile version on small screens
  if (isMobile) {
    return <MobileApp userId={userId} onLogout={() => {
      authService.logout();
      setUserId(null);
    }} />;
  }

  const handleTaskAdded = async () => {
    try {
      const fetchedTasks = await apiService.getTasks(userId);
      setTasks(fetchedTasks);
      
      const completions: TaskCompletionState = {};
      fetchedTasks.forEach(task => {
        completions[task.id] = task.status === 'COMPLETED';
      });
      setTaskCompletions(completions);
    } catch (err) {
      console.error('Failed to refresh tasks:', err);
    }
  };

  const handleEventAdded = async () => {
    try {
      const fetchedEvents = await apiService.getEvents(userId);
      setEvents(fetchedEvents);
    } catch (err) {
      console.error('Failed to refresh events:', err);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!userId) return;

    try {
      // Optimistic update - remove from UI immediately
      setTasks(prev => prev.filter(task => task.id !== taskId));
      
      // Remove from completions
      const newCompletions = { ...taskCompletions };
      delete newCompletions[taskId];
      setTaskCompletions(newCompletions);

      // Try to sync with backend
      await apiService.deleteTask(taskId, userId);
    } catch (err) {
      console.error('Failed to delete task:', err);
      // Silme başarısız olsa bile frontend'de silinmiş gibi göster
      console.log('⚠️ Task silindi ama backend senkronizasyonu başarısız. Mock datayı kontrol et.');
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!userId) return;

    try {
      // Optimistic update - remove from UI immediately
      setEvents(prev => prev.filter(event => event.id !== eventId));

      // Try to sync with backend
      await apiService.deleteEvent(eventId, userId);
    } catch (err) {
      console.error('Failed to delete event:', err);
      // Silme başarısız olsa bile frontend'de silinmiş gibi göster
      console.log('⚠️ Event silindi ama backend senkronizasyonu başarısız. Mock datayı kontrol et.');
    }
  };

  const handleEditTask = (task: Task) => {
    // TODO: Open edit modal for task
    console.log('Edit task:', task);
  };

  const handleEditEvent = (event: Event) => {
    // TODO: Open edit modal for event
    console.log('Edit event:', event);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin">⏳</div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {error && (
        <div className="bg-red-50 border-b border-red-200 text-red-700 px-6 py-3">
          {error}
          <button 
            onClick={() => setError(null)}
            className="ml-4 text-red-700 hover:text-red-900 font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      <Header 
        currentMonth={currentMonth}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
        onAddTask={() => setIsAddTaskModalOpen(true)}
        sidebarMode={isSidebarOpen ? sidebarMode : null}
        onSidebarToggle={handleSidebarToggle}
        onProfileClick={() => setIsProfileOpen(true)}
        onLogout={() => {
          authService.logout();
          setUserId(null);
        }}
      />
      
      {/* Profile Page */}
      {isProfileOpen && (
        <UserProfile onBack={() => setIsProfileOpen(false)} />
      )}

      {/* Main Layout */}
      {!isProfileOpen && (
      <main className="flex max-w-full">
        <div className="flex-1 p-8">
          <CalendarGrid 
            currentMonth={currentMonth} 
            taskCompletions={taskCompletions}
            onToggleTask={toggleTaskCompletion}
            recentlyCompleted={recentlyCompleted}
            tasks={tasks}
            events={events}
            onAddTaskClick={() => setIsAddTaskModalOpen(true)}
            onAddEventClick={() => setIsAddEventModalOpen(true)}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        </div>
        
        {/* Sidebar or Tasks Completion Panel */}
        {isSidebarOpen && (
          <div className="w-96 border-l border-gray-200 bg-white hidden lg:block">
            <Sidebar 
              mode={sidebarMode} 
              userId={userId}
              onClose={() => setIsSidebarOpen(false)}
              events={events}
              notes={[]} // Mock notes - backend notesendpointine ihtiyaç var
            />
          </div>
        )}
        
        {!isSidebarOpen && (
          <div className="border-l border-gray-200 bg-gray-50/30 p-4 hidden lg:block">
            <TasksCompletionPanel 
              userId={userId}
              taskCompletions={taskCompletions}
              tasks={tasks}
            />
          </div>
        )}
      </main>
      )}

      <AddTaskModal 
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onTaskAdded={handleTaskAdded}
        userId={userId}
      />

      <AddEventModal
        isOpen={isAddEventModalOpen}
        onClose={() => setIsAddEventModalOpen(false)}
        onEventAdded={handleEventAdded}
        userId={userId}
      />
    </div>
  );
}