import { useState } from 'react';
import { Clock, StickyNote, Send, Bot, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface SidebarProps {
  mode: 'notes' | 'ai';
  onClose: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export function Sidebar({ mode, onClose }: SidebarProps) {
  return (
    <div className="h-full flex flex-col bg-blue-50/30 overflow-hidden">
      {/* Sidebar Header with Close Button */}
      <div className="p-4 border-b border-blue-200 bg-white flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-blue-600 rounded-full" />
          <h3 className="text-gray-900">
            {mode === 'notes' ? 'Notes' : 'AI Copilot'}
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
        {mode === 'notes' ? <NotesContent /> : <AIContent />}
      </div>
    </div>
  );
}

function NotesContent() {
  const upcomingTasks = [
    { id: '1', title: 'Team Meeting', date: 'Today, 2:00 PM', priority: 'high' },
    { id: '2', title: 'Review PRs', date: 'Today, 4:30 PM', priority: 'low' },
    { id: '3', title: 'Client Call', date: 'Tomorrow, 10:00 AM', priority: 'high' },
    { id: '4', title: 'Sprint Planning', date: 'Dec 12, 9:00 AM', priority: 'high' },
    { id: '5', title: 'Weekly Review', date: 'Dec 24, 3:00 PM', priority: 'low' }
  ];

  const quickNotes = [
    { id: '1', content: 'Remember to follow up with design team about the new landing page mockups', date: 'Nov 20' },
    { id: '2', content: 'Check analytics dashboard for monthly metrics', date: 'Nov 18' },
    { id: '3', content: 'Update project roadmap for Q1 2024', date: 'Nov 15' }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-8">
      {/* Upcoming Tasks Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-gray-600" />
          <h2 className="text-gray-900">Upcoming Tasks</h2>
        </div>
        
        <div className="space-y-3">
          {upcomingTasks.map((task) => (
            <div
              key={task.id}
              className="p-3 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow cursor-pointer"
            >
              <div className="flex items-start gap-2">
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    task.priority === 'high'
                      ? 'bg-red-500'
                      : 'bg-blue-500'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 truncate">{task.title}</p>
                  <p className="text-gray-500 text-xs mt-1">{task.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Notes Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <StickyNote className="h-4 w-4 text-gray-600" />
          <h2 className="text-gray-900">Quick Notes</h2>
        </div>
        
        <div className="space-y-3">
          {quickNotes.map((note) => (
            <div
              key={note.id}
              className="p-3 rounded-lg bg-amber-50 border border-amber-200 hover:shadow-sm transition-shadow cursor-pointer"
            >
              <p className="text-gray-700 text-sm leading-relaxed">{note.content}</p>
              <p className="text-gray-500 text-xs mt-2">{note.date}</p>
            </div>
          ))}
        </div>
      </div>
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