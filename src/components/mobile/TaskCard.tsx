import { Clock, Flag } from 'lucide-react';

interface TaskCardProps {
  title: string;
  date: string;
  priority: 'high' | 'low';
  onClick: () => void;
  variant?: 'default' | 'compact';
}

export function TaskCard({ title, date, priority, onClick, variant = 'default' }: TaskCardProps) {
  const priorityConfig = {
    high: {
      color: 'bg-red-500',
      label: 'High',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    low: {
      color: 'bg-blue-500',
      label: 'Low',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  };

  const config = priorityConfig[priority];

  if (variant === 'compact') {
    return (
      <button
        onClick={onClick}
        className="w-full p-3 rounded-xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm active:scale-[0.98] transition-all duration-200 text-left"
      >
        <div className="flex items-start gap-3">
          <div className={`w-1.5 h-1.5 rounded-full ${config.color} mt-2 flex-shrink-0`} />
          <div className="flex-1 min-w-0">
            <p className="text-gray-900 truncate">{title}</p>
            <p className="text-gray-500 text-xs mt-1">{date}</p>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="w-full p-4 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-md active:scale-[0.98] transition-all duration-200 text-left shadow-sm"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-gray-900 flex-1">{title}</h3>
        <div className={`px-2 py-1 rounded-lg ${config.bgColor} flex items-center gap-1`}>
          <Flag className={`h-3 w-3 ${config.textColor}`} />
          <span className={`text-xs ${config.textColor}`}>{config.label}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-gray-500">
        <Clock className="h-3.5 w-3.5" />
        <span className="text-xs">{date}</span>
      </div>
    </button>
  );
}
