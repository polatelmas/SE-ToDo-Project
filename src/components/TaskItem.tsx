import { Clock, Flag } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Task } from '../services/api';

interface TaskItemProps {
  task: Omit<Task, 'created_at' | 'updated_at'>;
  isCompleted: boolean;
  onToggle: (taskId: string) => void;
  index: number;
}

/**
 * TaskItem Component - Refactored with Proper Toggle Pattern
 * 
 * FIXED: The toggle logic now properly uses the parent's state management
 * with inverse value logic (!prevValue) to ensure infinite toggle capability.
 * 
 * Key Improvements:
 * 1. Receives `isCompleted` as prop (single source of truth from parent)
 * 2. Uses callback to toggle state in parent (proper React pattern)
 * 3. Click target is the entire checkbox button (not just icon)
 * 4. Clear visual feedback for both states
 */
export function TaskItem({ task, isCompleted, onToggle, index }: TaskItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [showRipple, setShowRipple] = useState(false);

  /**
   * Toggle Handler - The Critical Fix
   * 
   * This function calls the parent's onToggle, which uses:
   * setTaskCompletions(prev => ({ ...prev, [taskId]: !prev[taskId] }))
   * 
   * This ensures:
   * - false → true (mark as complete)
   * - true → false (mark as incomplete)
   * - Infinite toggling capability
   */
  const handleToggle = () => {
    // Trigger ripple effect
    setShowRipple(true);
    setTimeout(() => setShowRipple(false), 600);
    
    // Call parent toggle function
    onToggle(task.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      className={`p-4 rounded-xl border transition-all duration-200 ${
        isCompleted
          ? 'border-gray-200 bg-[#E6F4EA]/50'
          : isHovered
          ? 'border-gray-300 bg-gray-50 shadow-md cursor-pointer'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox Container - Expanded Click Target */}
        <div className="relative mt-0.5">
          {/* Hover Glow Effect (Blue for uncompleted) */}
          {isHovered && !isCompleted && (
            <div className="absolute inset-0 -m-1 bg-blue-100 rounded-full animate-pulse" />
          )}
          
          {/* Ripple Effect on Click */}
          {showRipple && (
            <motion.div
              className="absolute inset-0 -m-3 bg-blue-200 rounded-full"
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          )}
          
          {/* The Checkbox Button - CRITICAL: This is the clickable element */}
          <motion.button
            onClick={handleToggle}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            animate={{
              scale: isPressed ? 0.9 : 1
            }}
            transition={{ duration: 0.1 }}
            className={`relative w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
              isCompleted
                ? 'bg-[#34A853] border-2 border-[#34A853]'
                : isHovered
                ? 'border-2 border-[#0055FF] bg-white shadow-lg shadow-blue-200'
                : 'border-2 border-gray-300 bg-white hover:border-[#0055FF]'
            }`}
            style={{ cursor: 'pointer' }}
            aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
            title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {/* Checkmark Icon - Only shown when completed */}
            {isCompleted && (
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
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
              </motion.svg>
            )}
          </motion.button>
        </div>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Priority Badge */}
          <div className="flex items-start justify-between gap-2 mb-2">
            {/* Task Title - Strikethrough when completed */}
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
}
