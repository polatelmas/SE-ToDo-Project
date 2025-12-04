import { X } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { apiService } from "../services/api";
import { getPriorityId } from "../services/enums";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskAdded?: () => void;
  userId: number;
}

export function AddTaskModal({
  isOpen,
  onClose,
  onTaskAdded,
  userId,
}: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('LOW');
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [subtaskInput, setSubtaskInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await apiService.createTask(userId, {
        title: title.trim(),
        description: description.trim(),
        priority_id: getPriorityId(priority),
        due_date: dueDate || null,
        color_code: '#3b82f6',
      });

      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority('LOW');
      setSubtasks([]);
      setSubtaskInput("");
      
      onTaskAdded?.();
      onClose();
    } catch (err) {
      console.error("Failed to create task:", err);
      setError("Failed to create task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority('LOW');
    setSubtasks([]);
    setSubtaskInput("");
    setError(null);
    onClose();
  };

  const addSubtask = () => {
    if (subtaskInput.trim()) {
      setSubtasks([...subtasks, subtaskInput.trim()]);
      setSubtaskInput("");
    }
  };

  const removeSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubtaskKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSubtask();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-[500px] w-full max-h-[85vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">New Task</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Close dialog"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="task-title">Task Title <span className="text-red-600">*</span></Label>
            <Input
              id="task-title"
              placeholder="Enter task title..."
              className="border-gray-200"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              placeholder="Enter task description..."
              className="border-gray-200 min-h-[80px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-date">Due Date</Label>
            <Input
              id="task-date"
              type="datetime-local"
              className="border-gray-200"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-3">
            <Label>Priority</Label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  value="HIGH"
                  checked={priority === 'HIGH'}
                  onChange={() => setPriority('HIGH')}
                  disabled={isSubmitting}
                  className="w-4 h-4"
                />
                <span className="text-gray-700 text-sm">High</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  value="MEDIUM"
                  checked={priority === 'MEDIUM'}
                  onChange={() => setPriority('MEDIUM')}
                  disabled={isSubmitting}
                  className="w-4 h-4"
                />
                <span className="text-gray-700 text-sm">Medium</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  value="LOW"
                  checked={priority === 'LOW'}
                  onChange={() => setPriority('LOW')}
                  disabled={isSubmitting}
                  className="w-4 h-4"
                />
                <span className="text-gray-700 text-sm">Low</span>
              </label>
            </div>
          </div>

          <div className="space-y-3 border-t border-gray-200 pt-4">
            <Label>Subtasks</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a subtask..."
                className="border-gray-200 text-sm"
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                onKeyPress={handleSubtaskKeyPress}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={addSubtask}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                disabled={isSubmitting || !subtaskInput.trim()}
              >
                Add
              </button>
            </div>
            
            {subtasks.length > 0 && (
              <div className="space-y-2">
                {subtasks.map((subtask, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg group"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        disabled
                      />
                      <span className="text-sm text-gray-700 truncate">{subtask}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSubtask(index)}
                      className="opacity-0 group-hover:opacity-100 ml-2 text-gray-400 hover:text-red-600 transition-all text-sm"
                      disabled={isSubmitting}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Save Task'}
          </button>
        </div>
      </div>
    </div>
  );
}