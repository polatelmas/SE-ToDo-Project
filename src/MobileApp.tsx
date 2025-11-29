import { useState, useEffect } from 'react';
import { MobileHome } from './components/mobile/MobileHome';
import { MobileAddTask } from './components/mobile/MobileAddTask';
import { MobileTaskDetails } from './components/mobile/MobileTaskDetails';
import { MobileNavigation } from './components/mobile/MobileNavigation';
import { MobileAI } from './components/mobile/MobileAI';
import { MobileNotes } from './components/mobile/MobileNotes';
import { apiService, Task } from './services/api';

type Screen = 'home' | 'addTask' | 'taskDetails' | 'ai' | 'notes';

interface TaskCompletionState {
  [taskId: string]: boolean;
}

export default function MobileApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskCompletions, setTaskCompletions] = useState<TaskCompletionState>({});

  // Fetch tasks on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const fetchedTasks = await apiService.getTasks();
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
    }
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setCurrentScreen('taskDetails');
  };

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
          />
        )}
        
        {currentScreen === 'addTask' && (
          <MobileAddTask onClose={() => setCurrentScreen('home')} />
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
