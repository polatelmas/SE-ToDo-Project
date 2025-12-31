import { StickyNote, Sparkles, Calendar } from 'lucide-react';
import { useState } from 'react';
import { DayDetailCard } from './DayDetailCard';
import { Task, Event } from '../services/api';
import { getLocalDateString, getTodayString } from '../services/dateUtils';
import { useTheme } from '../context/ThemeContext';

interface DayData {
  date: number;
  dateStr: string; // YYYY-MM-DD format for task filtering
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: Task[];
  events: Event[];
  hasNote: boolean;
}

interface CalendarGridProps {
  currentMonth: Date;
  taskCompletions: { [key: number]: boolean } | { [key: string]: boolean };
  onToggleTask: (taskId: number | string) => void;
  recentlyCompleted: string | null;
  tasks?: Task[];
  events?: Event[];
  onAddTaskClick?: () => void;
  onAddEventClick?: () => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: number) => void;
  onEditEvent?: (event: Event) => void;
  onDeleteEvent?: (eventId: number) => void;
}

export function CalendarGrid({ currentMonth, taskCompletions, onToggleTask, recentlyCompleted, tasks = [], events = [], onAddTaskClick, onAddEventClick, onEditTask, onDeleteTask, onEditEvent, onDeleteEvent }: CalendarGridProps) {
  const days = generateCalendarDays(currentMonth, taskCompletions, tasks, events);
  const { theme } = useTheme();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [selectedDay, setSelectedDay] = useState<{ day: number; dateStr: string; tasks: Task[]; events: Event[] } | null>(null);

  const handleDayClick = (day: DayData) => {
    console.log('Day clicked:', day);
    console.log('Tasks for this day:', day.tasks);
    console.log('Events for this day:', day.events);
    setSelectedDay({ day: day.date, dateStr: day.dateStr, tasks: day.tasks, events: day.events });
  };

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <>
      <div className={`rounded-lg transition-colors ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`grid grid-cols-7 gap-px border rounded-lg overflow-hidden transition-colors ${theme === 'dark' ? 'bg-gray-700 border-gray-700' : 'bg-gray-200 border-gray-200'}`}>
          {/* Week day headers */}
          {weekDays.map((day) => (
            <div 
              key={day} 
              className={`py-3 text-center border-b transition-colors ${theme === 'dark' ? 'bg-gray-700 text-gray-400 border-gray-600' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => handleDayClick(day)}
              disabled={!day.isCurrentMonth}
              className={`min-h-[120px] p-3 relative transition-all duration-200 text-left ${
                !day.isCurrentMonth ? theme === 'dark' ? 'bg-gray-900 cursor-default' : 'bg-gray-50 cursor-default' : ''
              } ${
                day.isCurrentMonth
                  ? `cursor-pointer hover:shadow-lg hover:shadow-blue-500/20 hover:border-2 hover:border-blue-400 hover:-translate-y-0.5 hover:z-10 active:scale-[0.98] ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white'}`
                  : ''
              } transition-colors`}
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
                  const isRecentlyCompleted = recentlyCompleted === String(task.id);
                  
                  // Determine priority color - check both priority string and priority_id
                  let priorityClass = 'bg-blue-100 text-blue-700'; // Default: LOW
                  if (task.status === 'COMPLETED') {
                    priorityClass = 'bg-[#E6F4EA] text-[#1E7E34]';
                  } else if (task.priority === 'HIGH' || task.priority_id === 1) {
                    priorityClass = 'bg-red-100 text-gray-900';
                  } else if (task.priority === 'MEDIUM' || task.priority_id === 2) {
                    priorityClass = 'bg-orange-100 text-gray-900';
                  } else if (task.priority === 'LOW' || task.priority_id === 3) {
                    priorityClass = 'bg-blue-100 text-gray-900';
                  }
                  
                  return (
                    <div
                      key={task.id}
                      className={`relative text-xs px-2 py-1 rounded truncate transition-all duration-300 ${priorityClass}`}
                    >
                      {/* Sparkle effect for recently completed */}
                      {isRecentlyCompleted && (
                        <div className="absolute -top-1 -right-1 z-10">
                          <Sparkles className="h-3 w-3 text-[#34A853] animate-bounce" />
                        </div>
                      )}
                      
                      <span className={task.status === 'COMPLETED' ? 'line-through' : ''}>
                        {task.title}
                      </span>
                    </div>
                  );
                })}

                {day.events.map((event) => {
                  // Extract time from start_time
                  const startTime = new Date(event.start_time);
                  const timeStr = startTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  });
                  
                  return (
                    <div
                      key={event.id}
                      className="relative text-xs px-2 py-1 rounded truncate transition-all duration-300 flex items-center gap-1"
                      style={{
                        backgroundColor: event.color_code + '20',
                        color: event.color_code,
                        borderLeft: `3px solid ${event.color_code}`
                      }}
                    >
                      <Calendar className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{timeStr}</span>
                      <span className="truncate flex-1 ml-0.5">{event.title}</span>
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
        events={selectedDay?.events || []}
        onToggleTask={onToggleTask}
        taskCompletions={taskCompletions}
        onAddTaskClick={onAddTaskClick}
        onAddEventClick={onAddEventClick}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onEditEvent={onEditEvent}
        onDeleteEvent={onDeleteEvent}
      />
    </>
  );
}



function generateCalendarDays(currentMonth: Date, taskCompletions: { [key: string]: boolean }, apiTasks: Task[] = [], apiEvents: Event[] = []): DayData[] {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const days: DayData[] = [];
  const todayStr = getTodayString();
  
  // Group API tasks by YYYY-MM-DD date string - FIXED: Handle any date format
  const tasksByDay: { [key: string]: Task[] } = {};
  
  console.log('📋 Processing tasks:', apiTasks);
  
  apiTasks.forEach(task => {
    if (task.due_date) {
      // Safely convert any format to YYYY-MM-DD
      const taskDateStr = getLocalDateString(task.due_date);
      if (taskDateStr) {
        console.log(`✓ Task "${task.title}" due_date: ${task.due_date} → ${taskDateStr}`);
        if (!tasksByDay[taskDateStr]) {
          tasksByDay[taskDateStr] = [];
        }
        tasksByDay[taskDateStr].push(task);
      } else {
        console.warn(`✗ Task "${task.title}" has invalid due_date: ${task.due_date}`);
      }
    }
  });

  // Group API events by YYYY-MM-DD date string - FIXED: Handle ISO datetime properly
  const eventsByDay: { [key: string]: Event[] } = {};
  
  console.log('📅 Processing events:', apiEvents);
  
  apiEvents.forEach(event => {
    if (event.start_time) {
      // Safely convert ISO datetime to YYYY-MM-DD
      const eventDateStr = getLocalDateString(event.start_time);
      if (eventDateStr) {
        console.log(`✓ Event "${event.title}" start_time: ${event.start_time} → ${eventDateStr}`);
        if (!eventsByDay[eventDateStr]) {
          eventsByDay[eventDateStr] = [];
        }
        eventsByDay[eventDateStr].push(event);
      } else {
        console.warn(`✗ Event "${event.title}" has invalid start_time: ${event.start_time}`);
      }
    }
  });
  
  console.log('📊 Grouped tasks by day:', tasksByDay);
  console.log('📊 Grouped events by day:', eventsByDay);
  
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    const dayOfMonth = date.getDate();
    const isCurrentMonth = date.getMonth() === month;
    
    // Create YYYY-MM-DD string from local date
    const year = date.getFullYear();
    const month_num = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month_num}-${day}`;
    
    const isToday = dateStr === todayStr;
    
    // Get tasks for this specific date
    const dayTasks = tasksByDay[dateStr] || [];
    
    // Get events for this specific date
    const dayEvents = eventsByDay[dateStr] || [];
    
    // Map tasks with completion state from taskCompletions
    const tasksWithCompletion: Task[] = dayTasks.map(task => ({
      ...task,
      status: taskCompletions?.[task.id as any] ? 'COMPLETED' : 'PENDING'
    })) as Task[];
    
    days.push({
      date: dayOfMonth,
      dateStr: dateStr,
      isCurrentMonth,
      isToday,
      tasks: isCurrentMonth ? tasksWithCompletion : [],
      events: isCurrentMonth ? dayEvents : [],
      hasNote: false // Note functionality can be added later
    });
  }
  
  return days;
}