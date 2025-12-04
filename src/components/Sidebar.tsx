import { useState, useEffect } from 'react';
import { Clock, StickyNote, Send, Bot, ChevronRight, Calendar, X, Plus, Edit2 } from 'lucide-react';
import { Button } from './ui/button';
import { apiService } from '../services/api';
import type { Note, Event } from '../services/api';
import { AddNoteModal } from './AddNoteModal';
import { AddEventModal } from './AddEventModal';

interface SidebarProps {
  mode: 'notes' | 'events' | 'ai';
  onClose: () => void;
  userId: number;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export function Sidebar({ mode, onClose, userId }: SidebarProps) {
  return (
    <div className="h-full flex flex-col bg-blue-50/30 overflow-hidden">
      {/* Sidebar Header with Close Button */}
      <div className="p-4 border-b border-blue-200 bg-white flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-blue-600 rounded-full" />
          <h3 className="text-gray-900">
            {mode === 'notes' ? 'Notes' : mode === 'events' ? 'Events' : 'AI Copilot'}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100"
          title="Collapse Panel"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {mode === 'notes' && <NotesContent userId={userId} />}
        {mode === 'events' && <EventsContent userId={userId} />}
        {mode === 'ai' && <AIContent />}
      </div>
    </div>
  );
}

function NotesContent({ userId }: { userId: number }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchNotes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedNotes = await apiService.getNotes(userId);
        setNotes(fetchedNotes);
      } catch (err) {
        console.error('Failed to fetch notes:', err);
        setError('Failed to load notes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [userId]);

  const handleDeleteNote = async (noteId: number) => {
    try {
      setDeletingId(noteId);
      await apiService.deleteNote(noteId, userId);
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (err) {
      console.error('Failed to delete note:', err);
      setError('Failed to delete note');
    } finally {
      setDeletingId(null);
    }
  };

  const handleNoteAdded = (newNote: Note) => {
    setNotes([newNote, ...notes]);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Add Note Button - Always Visible */}
      <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
        <button
          onClick={() => setIsAddNoteModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Note
        </button>
      </div>

      {/* Notes List - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500 text-sm">Loading notes...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && notes.length === 0 && (
          <div className="text-center py-12">
            <StickyNote className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No notes yet</p>
            <p className="text-gray-400 text-xs mt-1">Create your first note</p>
          </div>
        )}

        {/* Notes List */}
        {!isLoading && !error && notes.length > 0 && (
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-3 rounded-lg border border-gray-200 hover:shadow-md transition-all cursor-pointer group"
                style={{ borderLeftColor: note.color_code || '#3b82f6', borderLeftWidth: '4px' }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-medium text-sm line-clamp-1">{note.title}</p>
                    <p className="text-gray-600 text-xs mt-1 line-clamp-2">{note.content}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implement edit functionality
                      }}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600 transition-all p-1"
                      title="Edit note"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note.id);
                      }}
                      disabled={deletingId === note.id}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-all disabled:opacity-50 p-1"
                      title="Delete note"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Note Modal */}
      <AddNoteModal
        isOpen={isAddNoteModalOpen}
        onClose={() => setIsAddNoteModalOpen(false)}
        onNoteAdded={handleNoteAdded}
        userId={userId}
      />
    </div>
  );
}

function AIContent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi! I'm your AI assistant. I can help you manage your schedule, organize tasks, and boost your productivity. How can I help you today?",
      timestamp: new Date(Date.now() - 10000)
    },
    {
      id: '2',
      type: 'user',
      content: 'What do I have scheduled for today?',
      timestamp: new Date(Date.now() - 8000)
    },
    {
      id: '3',
      type: 'ai',
      content: "You have 2 tasks scheduled for today:\n\n• Team Meeting at 2:00 PM (High Priority)\n• Review PRs at 4:30 PM (Low Priority)\n\nWould you like me to help you prepare for any of these?",
      timestamp: new Date(Date.now() - 6000)
    },
    {
      id: '4',
      type: 'user',
      content: 'Reschedule the team meeting to 3 PM',
      timestamp: new Date(Date.now() - 4000)
    },
    {
      id: '5',
      type: 'ai',
      content: "Done! I've rescheduled your Team Meeting to 3:00 PM today. I can send notifications to all attendees if you'd like.",
      timestamp: new Date(Date.now() - 2000)
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I understand. Let me help you with that right away...",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.type === 'ai' && (
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-1">
                <Bot className="h-4 w-4 text-blue-600" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-900 rounded-bl-sm'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
              <span
                className={`text-xs mt-1 block ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}
              >
                {message.timestamp.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-end gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask AI..."
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            size="icon"
            className="h-9 w-9 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function EventsContent({ userId }: { userId: number }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedEvents = await apiService.getEvents(userId);
        setEvents(fetchedEvents);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError('Failed to load events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [userId]);

  const handleDeleteEvent = async (eventId: number) => {
    try {
      setDeletingId(eventId);
      await apiService.deleteEvent(eventId, userId);
      setEvents(events.filter(event => event.id !== eventId));
    } catch (err) {
      console.error('Failed to delete event:', err);
      setError('Failed to delete event');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const formatDateRange = (startTime: string, endTime: string): string => {
    try {
      const start = new Date(startTime);
      const end = new Date(endTime);
      const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      return `${startStr} - ${endStr}`;
    } catch {
      return `${startTime} - ${endTime}`;
    }
  };

  const handleEventAdded = (newEvent: Event) => {
    setEvents([newEvent, ...events]);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Add Event Button - Always Visible */}
      <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
        <button
          onClick={() => setIsAddEventModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Event
        </button>
      </div>

      {/* Events List - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500 text-sm">Loading events...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && events.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No events scheduled</p>
        </div>
      )}

      {/* Fetched Events Section */}
      {!isLoading && !error && events.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-4 w-4 text-gray-600" />
            <h2 className="text-gray-900">Upcoming Events</h2>
          </div>
          
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="p-3 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow cursor-pointer group"
                style={{ borderLeftColor: event.color_code || '#3b82f6', borderLeftWidth: '4px' }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-medium text-sm">{event.title}</p>
                    <p className="text-gray-600 text-xs mt-1">{formatDateRange(event.start_time, event.end_time)}</p>
                    {event.description && (
                      <p className="text-gray-500 text-sm mt-2 leading-relaxed">{event.description}</p>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEvent(event.id);
                    }}
                    disabled={deletingId === event.id}
                    className="opacity-0 group-hover:opacity-100 flex-shrink-0 text-gray-400 hover:text-red-600 transition-all disabled:opacity-50 p-1"
                    title="Delete event"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>

      {/* Add Event Modal */}
      <AddEventModal
        isOpen={isAddEventModalOpen}
        onClose={() => setIsAddEventModalOpen(false)}
        onEventAdded={handleEventAdded}
        userId={userId}
      />
    </div>
  );
}