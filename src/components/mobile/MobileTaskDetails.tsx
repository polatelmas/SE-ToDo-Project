import { ArrowLeft, Calendar, Clock, Flag, Trash2, Edit } from 'lucide-react';
import { Button } from '../ui/button';

interface MobileTaskDetailsProps {
  task: any;
  onClose: () => void;
}

export function MobileTaskDetails({ task, onClose }: MobileTaskDetailsProps) {
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header - Fixed */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200 flex-shrink-0">
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-900 active:scale-95 transition-all"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-gray-900 flex-1">Task Details</h2>
        <button
          className="text-gray-600 hover:text-gray-900 active:scale-95 transition-all"
          aria-label="Edit"
        >
          <Edit className="h-5 w-5" />
        </button>
      </div>

      {/* Task Content - Scrollable */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="px-4 py-6 space-y-6">
          {/* Task Title */}
          <div>
            <div className="flex items-start gap-3">
              <button className="mt-1 w-6 h-6 rounded-lg border-2 border-gray-300 hover:border-blue-500 active:scale-95 transition-all flex-shrink-0" />
              <div className="flex-1">
                <h1 className="text-gray-900">{task?.title || 'Team Meeting'}</h1>
                <p className="text-gray-500 text-sm mt-1">Created on Nov 20, 2024</p>
              </div>
            </div>
          </div>

          {/* Task Metadata Cards */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-0.5">Due Date</p>
                <p className="text-gray-900">December 5, 2024</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-0.5">Time</p>
                <p className="text-gray-900">2:00 PM - 3:00 PM</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                <Flag className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-0.5">Priority</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    task?.priority === 'high' ? 'bg-red-500' : 'bg-blue-500'
                  }`} />
                  <p className="text-gray-900">
                    {task?.priority === 'high' ? 'High Priority' : 'Low Priority'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <h3 className="text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Discuss Q4 roadmap and review team progress on current sprint goals. 
              Prepare presentation slides and gather feedback from stakeholders.
            </p>
          </div>

          {/* Notes */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <h3 className="text-gray-900 mb-2">Notes</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Remember to invite the design team and send the meeting agenda at least 
              30 minutes before the meeting starts.
            </p>
          </div>

          {/* Subtasks */}
          <div>
            <h3 className="text-gray-900 mb-3">Subtasks</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-4 rounded-2xl border border-gray-200 hover:bg-gray-50 cursor-pointer active:scale-[0.98] transition-all">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500" 
                />
                <span className="text-gray-900 flex-1">Prepare presentation slides</span>
              </label>
              
              <label className="flex items-center gap-3 p-4 rounded-2xl border border-gray-200 bg-gray-50 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked 
                  className="w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500" 
                />
                <span className="text-gray-400 line-through flex-1">Send meeting invite</span>
              </label>
              
              <label className="flex items-center gap-3 p-4 rounded-2xl border border-gray-200 hover:bg-gray-50 cursor-pointer active:scale-[0.98] transition-all">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500" 
                />
                <span className="text-gray-900 flex-1">Review previous meeting notes</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions - Fixed */}
      <div className="px-4 py-4 border-t border-gray-200 bg-white space-y-2.5 flex-shrink-0">
        <Button className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3.5 rounded-xl shadow-sm active:scale-[0.98] transition-all">
          Mark as Complete
        </Button>
        <Button
          variant="ghost"
          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          <Trash2 className="h-4 w-4" />
          Delete Task
        </Button>
      </div>
    </div>
  );
}