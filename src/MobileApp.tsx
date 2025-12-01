import { useState, useEffect } from 'react';
import { MobileHome } from './components/mobile/MobileHome';
import { MobileAddTask } from './components/mobile/MobileAddTask';
import { MobileTaskDetails } from './components/mobile/MobileTaskDetails';
import { MobileNavigation } from './components/mobile/MobileNavigation';
import { MobileAI } from './components/mobile/MobileAI';
import { MobileNotes } from './components/mobile/MobileNotes';
import { Login } from './components/Login';
import { apiService, Task } from './services/api';
import { authService } from './services/auth';

type Screen = 'home' | 'addTask' | 'taskDetails' | 'ai' | 'notes';

interface MobileAppProps {
  userId?: number;
  onLogout?: () => void;
}

interface TaskCompletionState {
  [taskId: number]: boolean;
}

export default function MobileApp({ userId: propUserId, onLogout: propOnLogout }: MobileAppProps) {
  const [userId, setUserId] = useState<number | null>(() => {
    if (propUserId) return propUserId;
    const user = authService.getCurrentUser();
    return user?.id ?? null;
  });
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskCompletions, setTaskCompletions] = useState<TaskCompletionState>({});

  // Fetch tasks on mount
  useEffect(() => {
    if (!userId) return;

    const fetchTasks = async () => {
      try {
        const fetchedTasks = await apiService.getTasks(userId);
        
        // Log fetched data to browser console
        console.log('Fetched tasks from API:', fetchedTasks);
        
        setTasks(fetchedTasks);
        
        const completions: TaskCompletionState = {};
        fetchedTasks.forEach(task => {
          completions[task.id] = task.completed;
        });
        setTaskCompletions(completions);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      }
    };

    fetchTasks();
  }, [userId]);

  const toggleTaskCompletion = async (taskId: number) => {
    try {
      // Capture current state BEFORE any updates
      const currentState = taskCompletions[taskId];
      const newState = !currentState;
      
      // Optimistic update
      setTaskCompletions(prev => ({
        ...prev,
        [taskId]: newState,
      }));

      // Call API
      await apiService.toggleTask(taskId, userId);
      
      // Update tasks array
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId ? { ...task, completed: newState } : task
        )
      );
    } catch (err) {
      console.error('Failed to toggle task:', err);
      // Revert optimistic update using CAPTURED currentState
      const currentState = taskCompletions[taskId];
      const previousState = !currentState; // Inverse of current to get original
      setTaskCompletions(prev => ({
        ...prev,
        [taskId]: previousState,
      }));
    }
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setCurrentScreen('taskDetails');
  };

  const handleLogout = () => {
    authService.logout();
    if (propOnLogout) {
      propOnLogout();
    } else {
      setUserId(null);
    }
  };

  // Show login if not authenticated
  if (!userId) {
    return <Login onLoginSuccess={(id) => setUserId(id)} />;
  }

  return (
    <div className="h-screen w-screen max-w-[390px] mx-auto bg-white flex flex-col overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-24">
        {currentScreen === 'home' && (
          <MobileHome
            currentMonth={currentMonth}
            onPreviousMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
            onTaskClick={handleTaskClick}
            taskCompletions={taskCompletions}
            onToggleTask={toggleTaskCompletion}
            tasks={tasks}
          />
        )}
        
        {currentScreen === 'addTask' && (
          <MobileAddTask 
            onClose={() => setCurrentScreen('home')} 
            userId={userId}
          />
        )}
        
        {currentScreen === 'taskDetails' && (
          <MobileTaskDetails
            task={selectedTask}
            onClose={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'ai' && (
          <MobileAI onClose={() => setCurrentScreen('home')} />
        )}

        {currentScreen === 'notes' && (
          <MobileNotes onClose={() => setCurrentScreen('home')} />
        )}
      </div>

      {/* Bottom Navigation */}
      <MobileNavigation
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
      />
    </div>
  );
}
