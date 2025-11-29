import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CalendarGrid } from './components/CalendarGrid';
import { Sidebar } from './components/Sidebar';
import { AddTaskModal } from './components/AddTaskModal';
import MobileApp from './MobileApp';
import { apiService, Task } from './services/api';

// Define task completion state type
interface TaskCompletionState {
  [taskId: string]: boolean;
}

export default function App() {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarMode, setSidebarMode] = useState<'notes' | 'ai'>('ai');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Centralized task completion state (derived from tasks)
  const [taskCompletions, setTaskCompletions] = useState<TaskCompletionState>({});

  // Track recently completed tasks for sparkle effect
  const [recentlyCompleted, setRecentlyCompleted] = useState<string | null>(null);

  // Fetch tasks on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const fetchedTasks = await apiService.getTasks();
        setTasks(fetchedTasks);
        
        // Initialize task completions from fetched data
        const completions: TaskCompletionState = {};
        fetchedTasks.forEach(task => {
          completions[task.id] = task.completed;
        });
        setTaskCompletions(completions);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
        setError('Failed to load tasks. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const toggleTaskCompletion = async (taskId: string) => {
    try {
      const currentState = taskCompletions[taskId];
      const newState = !currentState;
      
      // Optimistic update
      setTaskCompletions(prev => ({
        ...prev,
        [taskId]: newState,
      }));

      // If task is being completed (false -> true), trigger sparkle effect
      if (newState) {
        setRecentlyCompleted(taskId);
        setTimeout(() => setRecentlyCompleted(null), 1000);
      }

      // Call API
      await apiService.toggleTask(taskId, newState);
      
      // Update tasks array
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId ? { ...task, completed: newState } : task
        )
      );
    } catch (err) {
      console.error('Failed to toggle task:', err);
      // Revert optimistic update
      setTaskCompletions(prev => ({
        ...prev,
        [taskId]: taskCompletions[taskId],
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

  const handleSidebarToggle = (mode: 'notes' | 'ai') => {
    if (isSidebarOpen && sidebarMode === mode) {
      setIsSidebarOpen(false);
    } else {
      setSidebarMode(mode);
      setIsSidebarOpen(true);
    }
  };

  // Show mobile version on small screens
  if (isMobile) {
    return <MobileApp />;
  }

  const handleTaskAdded = async () => {
    try {
      const fetchedTasks = await apiService.getTasks();
      setTasks(fetchedTasks);
      
      const completions: TaskCompletionState = {};
      fetchedTasks.forEach(task => {
        completions[task.id] = task.completed;
      });
      setTaskCompletions(completions);
    } catch (err) {
      console.error('Failed to refresh tasks:', err);
    }
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
      />
      
      <main className="flex max-w-full">
        <div className="flex-1 p-8">
          <CalendarGrid 
            currentMonth={currentMonth} 
            taskCompletions={taskCompletions}
            onToggleTask={toggleTaskCompletion}
            recentlyCompleted={recentlyCompleted}
            tasks={tasks}
            onAddTaskClick={() => setIsAddTaskModalOpen(true)}
          />
        </div>
        
        {isSidebarOpen && (
          <div className="w-96 border-l border-gray-200 bg-white hidden lg:block">
            <Sidebar 
              mode={sidebarMode} 
              onClose={() => setIsSidebarOpen(false)} 
            />
          </div>
        )}
      </main>

      <AddTaskModal 
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onTaskAdded={handleTaskAdded}
      />
    </div>
  );
}