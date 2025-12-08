import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface MobileNotesProps {
  onClose: () => void;
}

interface Note {
  id: string;
  title: string;
  content: string;
  date: Date;
}

export function MobileNotes({ onClose }: MobileNotesProps) {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Proje Planı',
      content: 'Yeni proje için tasarımı tamamla ve geliştirmeye başla',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: '2',
      title: 'Toplantı Notları',
      content: 'Müşteri isteği: Arayüz iyileştirmesi ve mobil uyumluluğu',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  ]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  const handleAddNote = () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      title: newNoteTitle,
      content: newNoteContent,
      date: new Date(),
    };

    setNotes((prev) => [newNote, ...prev]);
    setNewNoteTitle('');
    setNewNoteContent('');
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header - Fixed */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200 flex-shrink-0 bg-white">
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-900 p-2 rounded-lg transition-all active:scale-95"
          aria-label="Geri"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-gray-900 flex-1 font-semibold">Notlar</h2>
      </div>

      {/* Notes List - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-semibold text-gray-900 flex-1">{note.title}</h3>
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="text-gray-400 hover:text-red-500 transition-colors active:scale-90 p-1"
                aria-label="Sil"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <p className="text-gray-600 text-sm mb-2 line-clamp-3">{note.content}</p>
            <p className="text-gray-400 text-xs">
              {note.date.toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        ))}
      </div>

      {/* Add Note Section - Fixed */}
      <div className="px-4 py-4 border-t border-gray-200 bg-white flex-shrink-0 space-y-3">
        <input
          type="text"
          value={newNoteTitle}
          onChange={(e) => setNewNoteTitle(e.target.value)}
          placeholder="Not başlığı..."
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-gray-50"
        />
        <textarea
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          placeholder="Not yazın..."
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent bg-gray-50 resize-none"
        />
        <button
          onClick={handleAddNote}
          disabled={!newNoteTitle.trim() || !newNoteContent.trim()}
          className="w-full bg-amber-400 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-semibold py-2.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Not Ekle
        </button>
      </div>
    </div>
  );
}
