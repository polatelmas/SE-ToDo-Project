import { X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { apiService } from '../../services/api';

interface MobileAddTaskProps {
  onClose: () => void;
  userId: number;
  onTaskAdded?: () => void;
}

export function MobileAddTask({ onClose, userId, onTaskAdded }: MobileAddTaskProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('LOW');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Combine date and time if both provided
      let fullDateTime: string | null = null;
      if (dueDate) {
        fullDateTime = dueTime ? `${dueDate}T${dueTime}` : `${dueDate}T00:00`;
      }

      await apiService.createTask(userId, {
        title: title.trim(),
        description: description.trim(),
        priority,
        due_date: fullDateTime || null,
        color_code: '#3b82f6',
      });

      // Reset form
      setTitle('');
      setDescription('');
      setDueDate('');
      setDueTime('');
      setPriority('LOW');

      // Notify parent and close
      onTaskAdded?.();
      onClose();
    } catch (err) {
      console.error('Failed to create task:', err);
      setError('Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setDueTime('');
    setPriority('LOW');
    setError(null);
    onClose();
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header - Fixed */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-gray-900">New Task</h2>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors active:scale-95"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Form Content - Scrollable */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="px-4 py-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="mobile-task-title" className="text-gray-700">
              Task Title
            </Label>
            <Input
              id="mobile-task-title"
              placeholder="Enter task title..."
              className="border-gray-200 rounded-xl h-11"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile-task-description" className="text-gray-700">
              Description (Optional)
            </Label>
            <textarea
              id="mobile-task-description"
              placeholder="Add any additional details..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mobile-task-date" className="text-gray-700">
                Due Date
              </Label>
              <Input
                id="mobile-task-date"
                type="date"
                className="border-gray-200 rounded-xl h-11"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile-task-time" className="text-gray-700">
                Time
              </Label>
              <Input
                id="mobile-task-time"
                type="time"
                className="border-gray-200 rounded-xl h-11"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-gray-700">Priority</Label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 rounded-2xl border-2 border-gray-200 cursor-pointer hover:bg-gray-50 active:scale-[0.98] transition-all has-[:checked]:border-red-500 has-[:checked]:bg-red-50">
                <input
                  type="radio"
                  name="mobile-priority"
                  value="HIGH"
                  checked={priority === 'HIGH'}
                  onChange={() => setPriority('HIGH')}
                  disabled={isSubmitting}
                  className="w-5 h-5 text-red-500 border-gray-300 focus:ring-red-500"
                />
                <div className="flex items-center gap-2.5 flex-1">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-gray-900">High Priority</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 rounded-2xl border-2 border-gray-200 cursor-pointer hover:bg-gray-50 active:scale-[0.98] transition-all has-[:checked]:border-yellow-500 has-[:checked]:bg-yellow-50">
                <input
                  type="radio"
                  name="mobile-priority"
                  value="MEDIUM"
                  checked={priority === 'MEDIUM'}
                  onChange={() => setPriority('MEDIUM')}
                  disabled={isSubmitting}
                  className="w-5 h-5 text-yellow-500 border-gray-300 focus:ring-yellow-500"
                />
                <div className="flex items-center gap-2.5 flex-1">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-gray-900">Medium Priority</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 rounded-2xl border-2 border-gray-200 cursor-pointer hover:bg-gray-50 active:scale-[0.98] transition-all has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                <input
                  type="radio"
                  name="mobile-priority"
                  value="LOW"
                  checked={priority === 'LOW'}
                  onChange={() => setPriority('LOW')}
                  disabled={isSubmitting}
                  className="w-5 h-5 text-blue-500 border-gray-300 focus:ring-blue-500"
                />
                <div className="flex items-center gap-2.5 flex-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-gray-900">Low Priority</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions - Fixed */}
      <div className="px-4 py-4 border-t border-gray-200 bg-white space-y-2.5 flex-shrink-0">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3.5 rounded-xl shadow-sm active:scale-[0.98] transition-all"
        >
          {isSubmitting ? 'Saving...' : 'Save Task'}
        </Button>
        <Button
          variant="ghost"
          onClick={handleClose}
          disabled={isSubmitting}
          className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 py-3.5 rounded-xl active:scale-[0.98] transition-all"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}