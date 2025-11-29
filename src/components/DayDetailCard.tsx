import { X, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TaskItem } from './TaskItem';

interface Task {
  id: string;
  title: string;
  time: string;
  description: string;
  priority: 'high' | 'low';
  completed: boolean;
}

interface DayDetailCardProps {
  isOpen: boolean;
  onClose: () => void;
  day: number;
  month: string;
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  taskCompletions?: { [key: string]: boolean };
  onAddTaskClick?: () => void;
}

export function DayDetailCard({ isOpen, onClose, day, month, tasks, onToggleTask, taskCompletions = {}, onAddTaskClick }: DayDetailCardProps) {

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur and dim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Expanded Detail Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              duration: 0.3, 
              ease: [0.34, 1.56, 0.64, 1] // Bouncy easing
            }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header - Bright Blue #0055FF */}
            <div className="bg-[#0055FF] px-6 py-5 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
              
              <div className="relative">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-white/80 text-sm mb-1">{month}</p>
                    <h2 className="text-white flex items-baseline gap-2">
                      <span className="text-4xl">{day}</span>
                      <span className="text-lg">{getDaySuffix(day)}</span>
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-white/90 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-white/90 text-sm">{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} scheduled</p>
              </div>
            </div>

            {/* Task List */}
            <div className="p-6 max-h-[500px] overflow-y-auto">
              <div className="space-y-3">
                {tasks.map((task, index) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    isCompleted={taskCompletions[task.id] ?? task.completed}
                    onToggle={onToggleTask}
                    index={index}
                  />
                ))}
              </div>

              {/* Empty State */}
              {tasks.length === 0 && (
                <div className="text-center py-12">
                  <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No tasks scheduled for this day</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <button 
                onClick={onAddTaskClick}
                className="w-full py-2.5 px-4 bg-[#0055FF] hover:bg-[#0044CC] text-white rounded-lg transition-colors"
              >
                Add New Task
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function getDaySuffix(day: number): string {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}