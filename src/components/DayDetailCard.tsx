import { X, Calendar as CalendarIcon, Calendar, Plus, Clock, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TaskItem } from './TaskItem';
import { Event, Task } from '../services/api';
import { useTheme } from '../context/ThemeContext';

interface DayDetailCardProps {
  isOpen: boolean;
  onClose: () => void;
  day: number;
  month: string;
  tasks: Task[];
  events?: Event[];
  onToggleTask: (taskId: number | string) => void;
  taskCompletions?: { [key: number]: boolean } | { [key: string]: boolean };
  onAddTaskClick?: () => void;
  onAddEventClick?: () => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: number) => void;
  onEditEvent?: (event: Event) => void;
  onDeleteEvent?: (eventId: number) => void;
}

export function DayDetailCard({ isOpen, onClose, day, month, tasks, events = [], onToggleTask, taskCompletions = {}, onAddTaskClick, onAddEventClick, onEditTask, onDeleteTask, onEditEvent, onDeleteEvent }: DayDetailCardProps) {
  const { theme } = useTheme();

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
            className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg mx-4 rounded-2xl shadow-2xl z-50 overflow-hidden transition-colors ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
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
                <p className="text-white/90 text-sm mb-4">{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} {events.length > 0 && `+ ${events.length} event${events.length === 1 ? '' : 's'}`} scheduled</p>
                
                {/* Add buttons - Semi-transparent */}
                <div className="flex gap-2">
                  <motion.button
                    onClick={onAddTaskClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-2 px-3 bg-white/20 text-white text-sm font-medium rounded-lg transition-all duration-200 backdrop-blur-sm flex items-center justify-center gap-2 group"
                  >
                    <Plus className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>Add Task</span>
                  </motion.button>
                  <motion.button
                    onClick={onAddEventClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-2 px-3 bg-white/20 text-white text-sm font-medium rounded-lg transition-all duration-200 backdrop-blur-sm flex items-center justify-center gap-2 group"
                  >
                    <Clock className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>Add Event</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Task List */}
            <div className={`p-6 max-h-[500px] overflow-y-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="space-y-3">
                {tasks.map((task, index) => {
                  const taskCompletion = taskCompletions as Record<string | number, boolean>;
                  const isCompleted = taskCompletion?.[task.id] ?? (task.status === 'COMPLETED');
                  return (
                  <TaskItem
                    key={task.id}
                    task={task}
                    isCompleted={isCompleted}
                    onToggle={onToggleTask}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                    index={index}
                  />
                  );
                })}

                {/* Events List */}
                {events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md group ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
                    style={{
                      borderLeftColor: event.color_code,
                      borderLeftWidth: '4px'
                    }}
                  >
                    <div className="flex items-start gap-3 justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Calendar className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: event.color_code }} />
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{event.title}</h3>
                          {event.location && (
                            <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>📍 {event.location}</p>
                          )}
                          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {new Date(event.start_time).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })} - {new Date(event.end_time).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onEditEvent?.(event)}
                          className={`p-1.5 rounded-lg transition-colors ${theme === 'dark' ? 'text-blue-400 hover:bg-blue-500/20' : 'text-blue-600 hover:bg-blue-50'}`}
                          title="Edit event"
                        >
                          <Edit2 className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onDeleteEvent?.(event.id as number)}
                          className={`p-1.5 rounded-lg transition-colors ${theme === 'dark' ? 'text-red-400 hover:bg-red-500/20' : 'text-red-600 hover:bg-red-50'}`}
                          title="Delete event"
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Empty State */}
              {tasks.length === 0 && events.length === 0 && (
                <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No tasks or events scheduled for this day</p>
                </div>
              )}
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