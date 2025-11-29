import { StickyNote, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { DayDetailCard } from './DayDetailCard';
import { Task } from '../services/api';

interface DayData {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: Task[];
  hasNote: boolean;
}

interface CalendarGridProps {
  currentMonth: Date;
  taskCompletions: { [key: string]: boolean };
  onToggleTask: (taskId: string) => void;
  recentlyCompleted: string | null;
  tasks?: Task[];
  onAddTaskClick?: () => void;
}

export function CalendarGrid({ currentMonth, taskCompletions, onToggleTask, recentlyCompleted, tasks = [], onAddTaskClick }: CalendarGridProps) {
  const days = generateCalendarDays(currentMonth, taskCompletions, tasks);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [selectedDay, setSelectedDay] = useState<{ day: number; tasks: Task[] } | null>(null);

  const handleDayClick = (day: DayData) => {
    if (day.isCurrentMonth && day.tasks.length > 0) {
      // Convert tasks to detailed format with completion state
      const detailedTasks = day.tasks.map(task => ({
        id: task.id,
        title: task.title,
        time: getTaskTime(task.id),
        description: getTaskDescription(task.id),
        priority: task.priority === 'completed' ? (getOriginalPriority(task.id)) : task.priority,
        completed: task.priority === 'completed'
      }));
      
      setSelectedDay({ day: day.date, tasks: detailedTasks });
    }
  };

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <>
      <div className="bg-white rounded-lg">
        <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
          {/* Week day headers */}
          {weekDays.map((day) => (
            <div 
              key={day} 
              className="bg-gray-50 py-3 text-center text-gray-600 border-b border-gray-200"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => handleDayClick(day)}
              disabled={!day.isCurrentMonth || day.tasks.length === 0}
              className={`bg-white min-h-[120px] p-3 relative transition-all duration-200 text-left ${
                !day.isCurrentMonth ? 'bg-gray-50' : ''
              } ${
                day.isCurrentMonth && day.tasks.length > 0
                  ? 'cursor-pointer hover:shadow-lg hover:shadow-blue-500/20 hover:border-2 hover:border-blue-400 hover:-translate-y-0.5 hover:z-10 active:scale-[0.98]'
                  : 'cursor-default'
              }`}
              style={{
                outline: 'none'
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div
                  className={`w-7 h-7 flex items-center justify-center rounded-full ${
                    day.isToday
                      ? 'bg-blue-500 text-white'
                      : day.isCurrentMonth
                      ? 'text-gray-900'
                      : 'text-gray-400'
                  }`}
                >
                  {day.date}
                </div>
                
                {day.hasNote && (
                  <StickyNote className="h-3.5 w-3.5 text-amber-500" />
                )}
              </div>

              <div className="space-y-1.5">
                {day.tasks.map((task) => {
                  const isRecentlyCompleted = recentlyCompleted === task.id;
                  
                  return (
                    <div
                      key={task.id}
                      className={`relative text-xs px-2 py-1 rounded truncate transition-all duration-300 ${
                        task.priority === 'completed'
                          ? 'bg-[#E6F4EA] text-[#1E7E34]'
                          : task.priority === 'high'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {/* Sparkle effect for recently completed */}
                      {isRecentlyCompleted && (
                        <div className="absolute -top-1 -right-1 z-10">
                          <Sparkles className="h-3 w-3 text-[#34A853] animate-bounce" />
                        </div>
                      )}
                      
                      <span className={task.priority === 'completed' ? 'line-through' : ''}>
                        {task.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Day Detail Modal */}
      <DayDetailCard
        isOpen={selectedDay !== null}
        onClose={() => setSelectedDay(null)}
        day={selectedDay?.day || 0}
        month={monthName}
        tasks={selectedDay?.tasks || []}
        onToggleTask={onToggleTask}
        taskCompletions={taskCompletions}
        onAddTaskClick={onAddTaskClick}
      />
    </>
  );
}

// Helper functions for mock data
function getTaskTime(taskId: string): string {
  const times: { [key: string]: string } = {
    '1': '9:00 AM',
    '2': '2:00 PM',
    '3': '10:30 AM',
    '4': '11:00 AM',
    '5': '2:00 PM',
    '6': '4:30 PM',
    '7': '3:00 PM',
    '8': '5:00 PM',
    '9': '3:30 PM',
    '10': '1:00 PM',
    '11': '10:00 AM'
  };
  return times[taskId] || '9:00 AM';
}

function getTaskDescription(taskId: string): string {
  const descriptions: { [key: string]: string } = {
    '1': 'Discuss Q4 roadmap and team progress on current sprint goals.',
    '2': 'Review pending pull requests and provide feedback to team members.',
    '3': 'Weekly design review with stakeholders to present new concepts.',
    '4': 'Plan upcoming sprint and assign tasks to team members.',
    '5': 'Important call with client to discuss project requirements and timeline.',
    '6': 'Update project documentation with latest API changes and examples.',
    '7': 'Refactor authentication module to improve code maintainability.',
    '8': 'Deploy latest release to production environment after QA approval.',
    '9': 'Complete QA testing for all new features in the release.',
    '10': 'Weekly team retrospective and progress review meeting.',
    '11': 'Kickoff meeting for new project initiative with stakeholders.'
  };
  return descriptions[taskId] || '';
}

function getOriginalPriority(taskId: string): 'high' | 'low' {
  const originalPriorities: { [key: string]: 'high' | 'low' } = {
    '1': 'high',
    '2': 'completed',
    '3': 'completed',
    '4': 'high',
    '5': 'high',
    '6': 'low',
    '7': 'completed',
    '8': 'completed',
    '9': 'completed',
    '10': 'low',
    '11': 'high'
  };
  return originalPriorities[taskId] || 'low';
}

function generateCalendarDays(currentMonth: Date, taskCompletions: { [key: string]: boolean }, apiTasks: Task[] = []): DayData[] {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const days: DayData[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Use API tasks if available, otherwise fallback to hardcoded data
  const tasksByDay: { [key: number]: Task[] } = {};
  
  if (apiTasks.length > 0) {
    // Group API tasks by day
    apiTasks.forEach(task => {
      // Extract day from created_at or use default
      const day = 1; // Default to first day (adjust based on your needs)
      if (!tasksByDay[day]) {
        tasksByDay[day] = [];
      }
      tasksByDay[day].push(task);
    });
  }

  // Fallback to hardcoded data
  const baseTasks: { [key: number]: { tasks: any[]; hasNote: boolean } } = {
    3: {
      tasks: [
        { id: '1', title: 'Team Meeting', basePriority: 'high' },
        { id: '2', title: 'Review PRs', basePriority: 'low' }
      ],
      hasNote: true
    },
    7: {
      tasks: [
        { id: '3', title: 'Design Review', basePriority: 'low' }
      ],
      hasNote: false
    },
    12: {
      tasks: [
        { id: '4', title: 'Sprint Planning', basePriority: 'high' }
      ],
      hasNote: true
    },
    15: {
      tasks: [
        { id: '5', title: 'Client Call', basePriority: 'high' },
        { id: '6', title: 'Update Docs', basePriority: 'low' }
      ],
      hasNote: false
    },
    18: {
      tasks: [
        { id: '7', title: 'Code Refactor', basePriority: 'low' }
      ],
      hasNote: true
    },
    21: {
      tasks: [
        { id: '8', title: 'Deploy to Prod', basePriority: 'high' },
        { id: '9', title: 'QA Testing', basePriority: 'low' }
      ],
      hasNote: false
    },
    24: {
      tasks: [
        { id: '10', title: 'Weekly Review', basePriority: 'low' }
      ],
      hasNote: false
    },
    28: {
      tasks: [
        { id: '11', title: 'Project Kickoff', basePriority: 'high' }
      ],
      hasNote: true
    }
  };
  
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    const dayOfMonth = date.getDate();
    const isCurrentMonth = date.getMonth() === month;
    const isToday = date.getTime() === today.getTime();
    
    const dayData = baseTasks[dayOfMonth] || { tasks: [], hasNote: false };
    
    // Map tasks with completion state
    const tasksWithCompletion: Task[] = dayData.tasks.map(task => ({
      id: task.id,
      title: task.title,
      priority: taskCompletions[task.id] ? 'completed' : task.basePriority
    }));
    
    days.push({
      date: dayOfMonth,
      isCurrentMonth,
      isToday,
      tasks: isCurrentMonth ? tasksWithCompletion : [],
      hasNote: isCurrentMonth && dayData.hasNote
    });
  }
  
  return days;
}