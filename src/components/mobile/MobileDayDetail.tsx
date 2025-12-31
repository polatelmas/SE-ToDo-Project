import { X, Clock, Flag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Task {
  id: string;
  title: string;
  time: string;
  description: string;
  priority: 'high' | 'low';
  completed: boolean;
}

interface MobileDayDetailProps {
  isOpen: boolean;
  onClose: () => void;
  day: number;
  month: string;
  tasks: Task[];
  taskCompletions: { [key: string]: boolean };
  onToggleTask: (taskId: string) => void;
}

export function MobileDayDetail({ isOpen, onClose, day, month, tasks, taskCompletions, onToggleTask }: MobileDayDetailProps) {  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ 
              type: 'spring',
              damping: 30,
              stiffness: 300
            }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[85vh] flex flex-col"
          >
            {/* Handle Bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Header - Bright Blue #0055FF */}
            <div className="bg-[#0055FF] px-5 py-4 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12" />
              
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-white/80 text-sm mb-1">{month}</p>
                  <h2 className="text-white flex items-baseline gap-2">
                    <span className="text-3xl">{day}</span>
                    <span className="text-base">{getDaySuffix(day)}</span>
                  </h2>
                  <p className="text-white/90 text-sm mt-1">
                    {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/90 hover:text-white p-2 rounded-lg active:bg-white/20 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Task List - Scrollable */}
            <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-5">
              <div className="space-y-3 pb-6">
                {tasks.map((task, index) => {
                  const isCompleted = taskCompletions[task.id];
                  
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                      className={`p-4 rounded-2xl border transition-all ${
                        isCompleted
                          ? 'border-gray-200 bg-[#E6F4EA]/50'
                          : 'border-gray-200 bg-white active:scale-[0.98]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Checkbox - Critical Styling */}
                        <button
                          onClick={() => onToggleTask(task.id)}
                          className={`mt-0.5 w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
                            isCompleted
                              ? 'bg-[#34A853] border-2 border-[#34A853]'
                              : 'border-2 border-gray-300 bg-white active:border-[#0055FF]'
                          }`}
                          aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                        >
                          {isCompleted && (
                            <svg 
                              className="w-4 h-4 text-white" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                d="M5 13l4 4L19 7" 
                              />
                            </svg>
                          )}
                        </button>

                        {/* Task Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            {/* Task Title with Strikethrough */}
                            <h3 className={`transition-all duration-200 ${
                              isCompleted 
                                ? 'line-through text-gray-400' 
                                : 'text-gray-900'
                            }`}>
                              {task.title}
                            </h3>
                            
                            {/* Priority Badge - Dimmed when completed */}
                            <div className={`flex-shrink-0 px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all duration-200 ${
                              isCompleted
                                ? task.priority === 'high'
                                  ? 'bg-red-50/50 text-red-400'
                                  : 'bg-blue-50/50 text-blue-400'
                                : task.priority === 'high'
                                ? 'bg-red-50 text-red-600'
                                : 'bg-blue-50 text-[#0055FF]'
                            }`}>
                              <Flag className="h-3.5 w-3.5" />
                              <span className="text-xs capitalize">{task.priority}</span>
                            </div>
                          </div>

                          {/* Time */}
                          <div className={`flex items-center gap-1.5 text-sm mb-2 transition-all duration-200 ${
                            isCompleted ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            <Clock className="h-3.5 w-3.5" />
                            <span>{task.time}</span>
                          </div>

                          {/* Description */}
                          {task.description && (
                            <p className={`text-sm transition-all duration-200 ${
                              isCompleted ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {tasks.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No tasks for this day</p>
                  </div>
                )}
              </div>
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