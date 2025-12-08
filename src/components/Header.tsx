import { Search, ChevronLeft, ChevronRight, Plus, StickyNote, Calendar, Sparkles, LogOut, User, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { authService } from '../services/auth';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onAddTask: () => void;
  sidebarMode: 'notes' | 'events' | 'ai' | null;
  onSidebarToggle: (mode: 'notes' | 'events' | 'ai') => void;
  onLogout?: () => void;
  onProfileClick?: () => void;
}

export function Header({ currentMonth, onPreviousMonth, onNextMonth, onAddTask, sidebarMode, onSidebarToggle, onLogout, onProfileClick }: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { theme } = useTheme();
  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    setIsProfileOpen(false);
    onLogout?.();
  };

  const handleProfileClick = () => {
    setIsProfileOpen(false);
    onProfileClick?.();
  };

  return (
    <header className={`border-b sticky top-0 z-10 transition-colors ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
      <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-8 min-w-0">
          <h1 className={`text-sm sm:text-base lg:text-lg font-semibold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>ChronoTask</h1>
          
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
              onClick={() => onSidebarToggle('events')}
              className={`h-8 w-8 sm:h-9 sm:w-9 rounded-md flex items-center justify-center transition-all flex-shrink-0 ${
                sidebarMode === 'events'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
              title="Events Panel"
            >
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
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

          <Avatar className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity relative"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
            <AvatarFallback>{user?.username?.charAt(0).toUpperCase() || 'JD'}</AvatarFallback>
          </Avatar>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-16 right-4 bg-white rounded-lg shadow-xl border border-gray-200 w-56 z-50"
              >
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="font-semibold text-gray-900 text-sm">{user?.username || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={handleProfileClick}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                  >
                    <User className="h-4 w-4 text-blue-600" />
                    My Profile
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-gray-200 py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 flex items-center gap-2 transition-colors font-medium"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Backdrop to close dropdown */}
          {isProfileOpen && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsProfileOpen(false)}
            />
          )}
        </div>
      </div>
    </header>
  );
}