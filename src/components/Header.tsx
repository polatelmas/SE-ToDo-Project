import { Search, ChevronLeft, ChevronRight, Plus, StickyNote, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface HeaderProps {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onAddTask: () => void;
  sidebarMode: 'notes' | 'ai' | null;
  onSidebarToggle: (mode: 'notes' | 'ai') => void;
}

export function Header({ currentMonth, onPreviousMonth, onNextMonth, onAddTask, sidebarMode, onSidebarToggle }: HeaderProps) {
  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-8 min-w-0">
          <h1 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 truncate">ChronoTask</h1>
          
          <div className="hidden sm:flex items-center gap-1 sm:gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onPreviousMonth}
              className="h-8 w-8 flex-shrink-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <span className="text-gray-900 text-xs sm:text-sm min-w-fit text-center">{monthYear}</span>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onNextMonth}
              className="h-8 w-8 flex-shrink-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 flex-shrink-0">
          <div className="relative hidden lg:block flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Sidebar Toggle Buttons */}
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1 bg-white flex-shrink-0">
            <button
              onClick={() => onSidebarToggle('notes')}
              className={`h-8 w-8 sm:h-9 sm:w-9 rounded-md flex items-center justify-center transition-all flex-shrink-0 ${
                sidebarMode === 'notes'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
              title="Notes Panel"
            >
              <StickyNote className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            <button
              onClick={() => onSidebarToggle('ai')}
              className={`h-8 w-8 sm:h-9 sm:w-9 rounded-md flex items-center justify-center transition-all flex-shrink-0 ${
                sidebarMode === 'ai'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
              title="AI Copilot Panel"
            >
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          <Button 
            onClick={onAddTask}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 sm:px-4 py-2 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm flex-shrink-0"
          >
            <Plus className="h-4 w-4 flex-shrink-0" />
            <span className="hidden sm:inline">Add Task</span>
          </Button>

          <Avatar className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}