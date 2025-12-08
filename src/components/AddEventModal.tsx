import { X, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiService, type Event } from '../services/api';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventAdded: (event: Event) => void;
  userId: number | null;
}

const COLOR_OPTIONS = [
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#10b981', // Green
  '#f59e0b', // Amber
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#f97316', // Orange
];

export function AddEventModal({ isOpen, onClose, onEventAdded, userId }: AddEventModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setDescription('');
      setLocation('');
      setStartTime('');
      setEndTime('');
      setSelectedColor('#3b82f6');
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Event title is required');
      return;
    }

    if (!startTime) {
      setError('Start time is required');
      return;
    }

    if (!endTime) {
      setError('End time is required');
      return;
    }

    if (new Date(startTime) >= new Date(endTime)) {
      setError('End time must be after start time');
      return;
    }

    if (!userId) {
      setError('User not found');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const newEvent = await apiService.createEvent(userId, {
        title: title.trim(),
        description: description.trim() || undefined,
        location: location.trim() || '',
        start_time: startTime,
        end_time: endTime,
        color_code: selectedColor,
      });

      onEventAdded(newEvent);
      setTitle('');
      setDescription('');
      setLocation('');
      setStartTime('');
      setEndTime('');
      setSelectedColor('#3b82f6');
      onClose();
    } catch (err) {
      console.error('Failed to create event:', err);
      setError('Failed to create event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-[500px] w-full max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Create Event</h2>
              <p className="text-gray-600 text-sm mt-0.5">Add a new event to your calendar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Title Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
              autoFocus
            />
          </div>

          {/* Description Textarea */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter event description..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Location Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter event location..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          {/* Time Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                End Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Color
            </label>
            <div className="flex gap-3 flex-wrap">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-lg transition-all ${
                    selectedColor === color
                      ? 'ring-2 ring-offset-2 ring-gray-400 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
