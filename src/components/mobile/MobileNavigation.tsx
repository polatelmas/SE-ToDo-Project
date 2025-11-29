import { Home, Sparkles, StickyNote, User } from 'lucide-react';
import { FloatingActionButton } from './FloatingActionButton';

interface MobileNavigationProps {
  currentScreen: string;
  onNavigate: (screen: 'home' | 'addTask' | 'ai' | 'notes') => void;
}

interface NavItem {
  id: 'home' | 'ai' | 'notes' | 'profile';
  icon: React.ElementType;
  label: string;
}

const navItems: NavItem[] = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'ai', icon: Sparkles, label: 'AI' },
  { id: 'notes', icon: StickyNote, label: 'Notes' },
  { id: 'profile', icon: User, label: 'Profile' },
];

export function MobileNavigation({ currentScreen, onNavigate }: MobileNavigationProps) {
  return (
    <nav className="relative">
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-[390px] border-t border-gray-200/50 bg-gradient-to-t from-white via-white/98 to-white/95 backdrop-blur-xl px-2 py-4 rounded-t-3xl shadow-2xl">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = 
              (item.id === 'home' && currentScreen === 'home') ||
              (item.id === 'ai' && currentScreen === 'ai') ||
              (item.id === 'notes' && currentScreen === 'notes') ||
              (item.id === 'profile' && currentScreen === 'profile');

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'profile') return;
                  onNavigate(item.id as 'home' | 'ai' | 'notes');
                }}
                className="relative flex flex-col items-center gap-1.5 px-5 py-2.5 rounded-2xl transition-all duration-300 active:scale-95"
              >
                {/* Animated background pill when active */}
                {isActive && (
                  <>
                    <div className="absolute inset-0 bg-blue-50 rounded-2xl" />
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-100/60 to-blue-50/40 rounded-2xl" />
                  </>
                )}

                {/* Icon container */}
                <div className={`relative z-10 h-6 w-6 flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? 'text-blue-600'
                    : 'text-gray-500'
                }`}>
                  <Icon 
                    className={`h-6 w-6 transition-all duration-300 ${
                      isActive ? 'stroke-[2.5] scale-110' : 'stroke-[2] scale-100'
                    }`}
                  />
                  
                  {/* Active indicator dot */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 bg-blue-600 rounded-full" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-xs font-medium transition-all duration-300 z-10 ${
                    isActive
                      ? 'text-blue-600 opacity-100'
                      : 'text-gray-500 opacity-60'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Floating Action Button for Add Task */}
        <div className="absolute -top-7 left-1/2 transform -translate-x-1/2">
          <FloatingActionButton onClick={() => onNavigate('addTask')} />
        </div>
      </div>

      {/* Spacer to prevent content overlap */}
      <div className="h-24" />
    </nav>
  );
}