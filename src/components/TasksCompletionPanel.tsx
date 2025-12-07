import { useState, useEffect, useMemo } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { Task } from '../services/api';

interface TasksCompletionPanelProps {
  userId: number;
  taskCompletions: Record<number, boolean>;
  tasks?: Task[];
}

export function TasksCompletionPanel({ userId, taskCompletions, tasks: allTasks = [] }: TasksCompletionPanelProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use tasks from props (from App.tsx) - no API call needed
  useEffect(() => {
    if (!userId || !allTasks || allTasks.length === 0) {
      setTasks([]);
      return;
    }

    // Filter incomplete tasks
    const incompleteTasks = allTasks.filter(task => !taskCompletions[task.id]);
    
    // Sort by due date (will be reordered in groupedByDate)
    const sortedTasks = incompleteTasks.sort((a, b) => {
      if (!a.due_date || !b.due_date) return 0;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });
    
    // Debug log
    console.log('TasksCompletionPanel - Tasks with due_dates:', sortedTasks.map(t => ({ id: t.id, title: t.title, due_date: t.due_date })));
    
    setTasks(sortedTasks);
    setError(null);
  }, [userId, allTasks, taskCompletions]);

  // Calculate completion percentage
  const completionData = useMemo(() => {
    const allTasks = Object.keys(taskCompletions).length;
    const completedTasks = Object.values(taskCompletions).filter(Boolean).length;
    const percentage = allTasks > 0 ? Math.round((completedTasks / allTasks) * 100) : 0;
    return { completedTasks, allTasks, percentage };
  }, [taskCompletions]);

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    try {
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
      
      // Check if today
      if (dateString === todayStr) {
        return 'Today';
      }
      // Check if tomorrow
      if (dateString === tomorrowStr) {
        return 'Tomorrow';
      }
      
      // For other dates, parse and format
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      
      return date.toLocaleDateString('en-US', { 
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const groupedByDate = useMemo(() => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const groups: Record<string, Task[]> = {};
    
    tasks.forEach(task => {
      const dateKey = task.due_date ? task.due_date : 'No Date';
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(task);
    });
    
    // Custom sort: Today first, then past dates (newest first), then future dates (oldest first)
    const sortedKeys = Object.keys(groups).sort((a, b) => {
      // Today comes first
      if (a === todayStr) return -1;
      if (b === todayStr) return 1;
      if (a === 'No Date') return 1;
      if (b === 'No Date') return -1;
      
      // String comparison for dates (YYYY-MM-DD format works correctly)
      // Both in past
      if (a < todayStr && b < todayStr) {
        return b.localeCompare(a); // Newest first (reverse)
      }
      
      // Both in future
      if (a > todayStr && b > todayStr) {
        return a.localeCompare(b); // Oldest first
      }
      
      // One past, one future - past comes first
      return a < todayStr ? -1 : 1;
    });
    
    const result: Array<[string, Task[]]> = sortedKeys.map(key => [key, groups[key]]);
    return result;
  }, [tasks]);

  // SVG for circular progress
  const renderCircleChart = () => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (completionData.percentage / 100) * circumference;
    
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-32 h-32">
          <svg width="128" height="128" viewBox="0 0 128 128" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="#3b82f6"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">{completionData.percentage}%</span>
            <span className="text-xs text-gray-500 mt-1">Complete</span>
          </div>
        </div>
        
        {/* Stats below chart */}
        <div className="text-center">
          <p className="text-sm font-medium text-gray-900">
            {completionData.completedTasks} of {completionData.allTasks}
          </p>
          <p className="text-xs text-gray-500">tasks completed</p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-80 bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100/50 flex-shrink-0">
        <h3 className="text-gray-900 font-semibold text-sm">My Tasks</h3>
      </div>

      {/* Circular Chart Section - Fixed Height */}
      <div className="p-6 border-b border-gray-100 flex-shrink-0 flex justify-center">
        {renderCircleChart()}
      </div>

      {/* Tasks List Section - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500 text-sm">Loading tasks...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {!isLoading && !error && tasks.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-2" />
            <p className="text-gray-600 text-sm font-medium">All tasks completed!</p>
            <p className="text-gray-500 text-xs mt-1">Great job! 🎉</p>
          </div>
        )}

        {!isLoading && !error && tasks.length > 0 && (
          <div className="space-y-4">
            {groupedByDate.map(([dateKey, tasksForDate]) => (
              <div key={dateKey}>
                {/* Date Header */}
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-2">
                  {formatDate(dateKey)}
                </h4>
                
                {/* Tasks for this date */}
                <div className="space-y-2">
                  {tasksForDate.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-blue-50 transition-colors group cursor-pointer"
                    >
                      <Circle className="h-4 w-4 mt-0.5 text-blue-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                          {task.title}
                        </p>
                        {task.priority && (
                          <span className={`inline-block mt-1 text-xs px-1.5 py-0.5 rounded-full font-medium ${
                            task.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                            task.priority === 'MEDIUM' ? 'bg-orange-100 text-orange-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {task.priority}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
