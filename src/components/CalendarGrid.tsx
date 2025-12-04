import { StickyNote, Sparkles, Calendar } from 'lucide-react';
import { useState } from 'react';
import { DayDetailCard } from './DayDetailCard';
import { Task, Event } from '../services/api';

interface DayData {
  date: number;
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
}

export function CalendarGrid({ currentMonth, taskCompletions, onToggleTask, recentlyCompleted, tasks = [], events = [], onAddTaskClick, onAddEventClick }: CalendarGridProps) {
  const days = generateCalendarDays(currentMonth, taskCompletions, tasks, events);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [selectedDay, setSelectedDay] = useState<{ day: number; tasks: Task[]; events: Event[] } | null>(null);

  const handleDayClick = (day: DayData) => {
    setSelectedDay({ day: day.date, tasks: day.tasks, events: day.events });
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
              disabled={!day.isCurrentMonth}
              className={`bg-white min-h-[120px] p-3 relative transition-all duration-200 text-left ${
                !day.isCurrentMonth ? 'bg-gray-50 cursor-default' : ''
              } ${
                day.isCurrentMonth
                  ? 'cursor-pointer hover:shadow-lg hover:shadow-blue-500/20 hover:border-2 hover:border-blue-400 hover:-translate-y-0.5 hover:z-10 active:scale-[0.98]'
                  : ''
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
                  const isRecentlyCompleted = recentlyCompleted === String(task.id);
                  
                  return (
                    <div
                      key={task.id}
                      className={`relative text-xs px-2 py-1 rounded truncate transition-all duration-300 ${
                        task.status === 'COMPLETED'
                          ? 'bg-[#E6F4EA] text-[#1E7E34]'
                          : task.priority === 'HIGH'
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
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Group API tasks by day from their due_date field
  const tasksByDay: { [key: number]: Task[] } = {};
  
  apiTasks.forEach(task => {
    if (task.due_date) {
      const taskDate = new Date(task.due_date);
      const dayOfMonth = taskDate.getDate();
      
      if (!tasksByDay[dayOfMonth]) {
        tasksByDay[dayOfMonth] = [];
      }
      tasksByDay[dayOfMonth].push(task);
    }
  });

  // Group API events by day from their start_time field
  const eventsByDay: { [key: number]: Event[] } = {};
  
  apiEvents.forEach(event => {
    if (event.start_time) {
      const eventDate = new Date(event.start_time);
      const dayOfMonth = eventDate.getDate();
      
      if (!eventsByDay[dayOfMonth]) {
        eventsByDay[dayOfMonth] = [];
      }
      eventsByDay[dayOfMonth].push(event);
    }
  });
  
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    const dayOfMonth = date.getDate();
    const isCurrentMonth = date.getMonth() === month;
    const isToday = date.getTime() === today.getTime();
    
    // Get tasks for this day from API data only
    const dayTasks = tasksByDay[dayOfMonth] || [];
    
    // Get events for this day from API data only
    const dayEvents = eventsByDay[dayOfMonth] || [];
    
    // Map tasks with completion state
    const tasksWithCompletion: Task[] = dayTasks.map(task => ({
      ...task,
      status: taskCompletions?.[task.id as any] ? 'COMPLETED' : 'PENDING'
    })) as Task[];
    
    days.push({
      date: dayOfMonth,
      isCurrentMonth,
      isToday,
      tasks: isCurrentMonth ? tasksWithCompletion : [],
      events: isCurrentMonth ? dayEvents : [],
      hasNote: false // Note functionality can be added later
    });
  }
  
  return days;
}