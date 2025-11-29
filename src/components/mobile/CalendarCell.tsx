interface CalendarCellProps {
  day?: number;
  tasks?: Array<{ id: string; priority: 'high' | 'low'; completed?: boolean }>;
  isToday?: boolean;
  onClick?: () => void;
}

export function CalendarCell({ day, tasks = [], isToday, onClick }: CalendarCellProps) {
  if (!day) {
    return <div className="aspect-square" />;
  }

  return (
    <button
      onClick={onClick}
      className={`aspect-square p-2 rounded-xl border transition-all duration-200 active:scale-95 ${
        isToday
          ? 'border-blue-500 bg-blue-50'
          : tasks.length > 0
          ? 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
          : 'border-gray-100 bg-white hover:bg-gray-50'
      }`}
    >
      <div className="h-full flex flex-col">
        <span className={`text-xs mb-1 ${
          isToday ? 'text-blue-600' : 'text-gray-900'
        }`}>
          {day}
        </span>
        
        {tasks.length > 0 && (
          <div className="flex-1 flex flex-col gap-1 justify-start">
            {tasks.slice(0, 3).map((task, index) => (
              <div
                key={task.id}
                className={`w-full h-1 rounded-full ${
                  task.completed
                    ? 'bg-green-400'
                    : task.priority === 'high'
                    ? 'bg-red-400'
                    : 'bg-blue-400'
                }`}
              />
            ))}
            {tasks.length > 3 && (
              <span className="text-[9px] text-gray-400 mt-0.5">+{tasks.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}
