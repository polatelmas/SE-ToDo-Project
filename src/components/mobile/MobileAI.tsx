import { ArrowLeft, Send } from 'lucide-react';
import { useState } from 'react';

interface MobileAIProps {
  onClose: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export function MobileAI({ onClose }: MobileAIProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Merhaba! Ben AI asistanınız. Görevleriniz hakkında soru sorabilir veya tavsiye alabilirsiniz.',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulated AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Bu konuda yardımcı olmaktan memnun olacağım: "${inputValue.substring(0, 20)}..."`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 500);

    setInputValue('');
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header - Fixed */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200 flex-shrink-0 bg-gradient-to-r from-blue-500 to-blue-600">
        <button
          onClick={onClose}
          className="text-white hover:bg-white/20 p-2 rounded-lg transition-all active:scale-95"
          aria-label="Geri"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-white flex-1">AI Asistan</h2>
      </div>

      {/* Messages Area - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-3 rounded-2xl ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-900 rounded-bl-none'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}
              >
                {message.timestamp.toLocaleTimeString('tr-TR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area - Fixed */}
      <div className="px-4 py-3 border-t border-gray-200 bg-white flex-shrink-0 space-y-3">
        <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2.5 border border-gray-200">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Mesajınızı yazın..."
            className="flex-1 bg-transparent outline-none text-sm placeholder-gray-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="text-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed active:scale-90 transition-all p-1"
            aria-label="Gönder"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
