import { ChevronLeft, ChevronRight, Search, Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { CalendarCell } from './CalendarCell';
import { TaskCard } from './TaskCard';
import { MobileDayDetail } from './MobileDayDetail';
import { useState } from 'react';

interface MobileHomeProps {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onTaskClick: (task: any) => void;
  taskCompletions: { [key: string]: boolean };
  onToggleTask: (taskId: string) => void;
}

export function MobileHome({ currentMonth, onPreviousMonth, onNextMonth, onTaskClick, taskCompletions, onToggleTask }: MobileHomeProps) {
  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long' });
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState<{ day: number; tasks: any[] } | null>(null);
  
  // Generate calendar days
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const startingDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const calendarDays = [];
  
  // Empty cells before first day
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Days of the month with mock tasks
  for (let day = 1; day <= daysInMonth; day++) {
    const tasks = [];
    const detailedTasks = [];
    
    if (day === 5) {
      tasks.push({ id: '1', priority: 'high' as const, completed: taskCompletions['1'] ?? false });
      tasks.push({ id: '2', priority: 'low' as const, completed: taskCompletions['2'] ?? false });
      detailedTasks.push(
        { id: '1', title: 'Team Meeting', time: '9:00 AM', description: 'Discuss Q4 roadmap and team progress.', priority: 'high' as const, completed: taskCompletions['1'] ?? false },
        { id: '2', title: 'Design Review', time: '2:00 PM', description: 'Review pending pull requests.', priority: 'low' as const, completed: taskCompletions['2'] ?? false }
      );
    }
    if (day === 12) {
      tasks.push({ id: '3', priority: 'high' as const, completed: taskCompletions['3'] ?? false });
      detailedTasks.push(
        { id: '3', title: 'Client Call', time: '11:00 AM', description: 'Important call with client to discuss project requirements.', priority: 'high' as const, completed: taskCompletions['3'] ?? false }
      );
    }
    if (day === 18) {
      tasks.push({ id: '4', priority: 'high' as const, completed: taskCompletions['4'] ?? false });
      tasks.push({ id: '5', priority: 'low' as const, completed: taskCompletions['5'] ?? false });
      tasks.push({ id: '6', priority: 'low' as const, completed: taskCompletions['6'] ?? false });
      detailedTasks.push(
        { id: '4', title: 'Sprint Planning', time: '11:00 AM', description: 'Plan upcoming sprint and assign tasks.', priority: 'high' as const, completed: taskCompletions['4'] ?? false },
        { id: '5', title: 'Code Review', time: '3:00 PM', description: 'Review team pull requests.', priority: 'low' as const, completed: taskCompletions['5'] ?? false },
        { id: '6', title: 'Update Docs', time: '4:30 PM', description: 'Update project documentation.', priority: 'low' as const, completed: taskCompletions['6'] ?? false }
      );
    }
    if (day === 24) {
      tasks.push({ id: '7', priority: 'low' as const, completed: taskCompletions['7'] ?? false });
      detailedTasks.push(
        { id: '7', title: 'Weekly Sync', time: '1:00 PM', description: 'Weekly team retrospective.', priority: 'low' as const, completed: taskCompletions['7'] ?? false }
      );
    }
    
    const isToday = 
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear();
    
    calendarDays.push({ day, tasks, detailedTasks, isToday });
  }

  const upcomingTasks = [
    { id: '1', title: 'Team Meeting', date: 'Today, 2:00 PM', priority: 'high' as const },
    { id: '2', title: 'Design Review', date: 'Today, 4:30 PM', priority: 'low' as const },
    { id: '3', title: 'Client Call', date: 'Tomorrow, 10:00 AM', priority: 'high' as const },
  ];

  const handleDayClick = (dayData: any) => {
    if (dayData && dayData.tasks.length > 0) {
      setSelectedDay({ day: dayData.day, tasks: dayData.detailedTasks });
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Mobile Header - Fixed */}
      <header className="px-4 pt-3 pb-4 bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-gray-900">ChronoTask</h1>
          <div className="flex items-center gap-3">
            <button className="text-gray-600 hover:text-gray-900 active:scale-95 transition-all">
              <Bell className="h-5 w-5" />
            </button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
          />
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={onPreviousMonth}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl active:scale-95 transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-gray-900">{monthYear}</span>
          <button
            onClick={onNextMonth}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl active:scale-95 transition-all"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Scrollable Content - Hide scrollbar */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="px-4 py-5 space-y-6">
          {/* Calendar Grid */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1.5 mb-3">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-gray-500 text-[11px] py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1.5">
              {calendarDays.map((dayData, index) => (
                <CalendarCell
                  key={index}
                  day={dayData?.day}
                  tasks={dayData?.tasks}
                  isToday={dayData?.isToday}
                  onClick={() => handleDayClick(dayData)}
                />
              ))}
            </div>
          </div>

          {/* Upcoming Tasks Section */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-gray-900">Upcoming Tasks</h2>
              <button className="text-blue-600 text-sm">View All</button>
            </div>
            
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  title={task.title}
                  date={task.date}
                  priority={task.priority}
                  onClick={() => onTaskClick(task)}
                  variant="default"
                />
              ))}
            </div>
          </div>

          {/* Bottom padding for FAB clearance */}
          <div className="h-4" />
        </div>
      </div>

      {/* Day Detail Modal */}
      <MobileDayDetail
        isOpen={selectedDay !== null}
        onClose={() => setSelectedDay(null)}
        day={selectedDay?.day || 0}
        month={monthName}
        tasks={selectedDay?.tasks || []}
        taskCompletions={taskCompletions}
        onToggleTask={onToggleTask}
      />
    </div>
  );
}