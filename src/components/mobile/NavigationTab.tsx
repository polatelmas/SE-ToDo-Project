import { LucideIcon } from 'lucide-react';

interface NavigationTabProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

export function NavigationTab({ icon: Icon, label, isActive = false, onClick }: NavigationTabProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-xl transition-all duration-200 active:scale-95 ${
        isActive
          ? 'text-blue-600'
          : 'text-gray-400 hover:text-gray-600 active:text-gray-700'
      }`}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon 
        className={`h-6 w-6 transition-all duration-200 ${
          isActive ? 'stroke-[2.5]' : 'stroke-[2]'
        }`} 
      />
      <span className={`text-[11px] transition-all duration-200 ${
        isActive ? 'font-medium' : ''
      }`}>
        {label}
      </span>
    </button>
  );
}
