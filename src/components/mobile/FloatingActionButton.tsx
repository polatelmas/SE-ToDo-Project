import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white flex items-center justify-center shadow-[0_8px_24px_rgba(37,99,235,0.4)] hover:shadow-[0_10px_28px_rgba(37,99,235,0.5)] active:shadow-[0_4px_12px_rgba(37,99,235,0.3)] transition-all duration-300 active:scale-95 z-50 border-4 border-white"
      aria-label="Add new task"
    >
      <Plus className="h-7 w-7" strokeWidth={3} />
    </button>
  );
}