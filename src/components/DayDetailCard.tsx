import { X, Calendar as CalendarIcon, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TaskItem } from './TaskItem';
import { Event, Task } from '../services/api';

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
}

export function DayDetailCard({ isOpen, onClose, day, month, tasks, events = [], onToggleTask, taskCompletions = {}, onAddTaskClick, onAddEventClick }: DayDetailCardProps) {

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
                <p className="text-white/90 text-sm mb-4">{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} {events.length > 0 && `+ ${events.length} event${events.length === 1 ? '' : 's'}`} scheduled</p>
                
                {/* Add buttons - Semi-transparent */}
                <div className="flex gap-2">
                  <button
                    onClick={onAddTaskClick}
                    className="flex-1 py-2 px-3 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-lg transition-colors backdrop-blur-sm"
                  >
                    + Add Task
                  </button>
                  <button
                    onClick={onAddEventClick}
                    className="flex-1 py-2 px-3 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-lg transition-colors backdrop-blur-sm"
                  >
                    + Add Event
                  </button>
                </div>
              </div>
            </div>

            {/* Task List */}
            <div className="p-6 max-h-[500px] overflow-y-auto">
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
                    index={index}
                  />
                  );
                })}

                {/* Events List */}
                {events.map((event, index) => (
                  <div
                    key={event.id}
                    className="p-4 rounded-xl border transition-all duration-200 border-gray-200 bg-white"
                    style={{
                      borderLeftColor: event.color_code,
                      borderLeftWidth: '4px'
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: event.color_code }} />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-gray-900 font-medium">{event.title}</h3>
                        {event.location && (
                          <p className="text-sm text-gray-500 mt-1">📍 {event.location}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
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
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {tasks.length === 0 && events.length === 0 && (
                <div className="text-center py-12">
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