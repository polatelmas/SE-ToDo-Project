import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface MobileAddTaskProps {
  onClose: () => void;
}

export function MobileAddTask({ onClose }: MobileAddTaskProps) {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header - Fixed */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-gray-900">New Task</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors active:scale-95"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Form Content - Scrollable */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="px-4 py-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="mobile-task-title" className="text-gray-700">
              Task Title
            </Label>
            <Input
              id="mobile-task-title"
              placeholder="Enter task title..."
              className="border-gray-200 rounded-xl h-11"
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
                  value="high"
                  className="w-5 h-5 text-red-500 border-gray-300 focus:ring-red-500"
                />
                <div className="flex items-center gap-2.5 flex-1">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-gray-900">High Priority</span>
                </div>
              </label>
              
              <label className="flex items-center gap-3 p-4 rounded-2xl border-2 border-gray-200 cursor-pointer hover:bg-gray-50 active:scale-[0.98] transition-all has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                <input
                  type="radio"
                  name="mobile-priority"
                  value="low"
                  defaultChecked
                  className="w-5 h-5 text-blue-500 border-gray-300 focus:ring-blue-500"
                />
                <div className="flex items-center gap-2.5 flex-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-gray-900">Low Priority</span>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile-task-notes" className="text-gray-700">
              Notes (Optional)
            </Label>
            <textarea
              id="mobile-task-notes"
              placeholder="Add any additional details..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>
      </div>

      {/* Footer Actions - Fixed */}
      <div className="px-4 py-4 border-t border-gray-200 bg-white space-y-2.5 flex-shrink-0">
        <Button className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3.5 rounded-xl shadow-sm active:scale-[0.98] transition-all">
          Save Task
        </Button>
        <Button
          variant="ghost"
          onClick={onClose}
          className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 py-3.5 rounded-xl active:scale-[0.98] transition-all"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}