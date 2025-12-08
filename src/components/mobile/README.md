# ChronoTask Mobile Component System

A comprehensive mobile design system following modern mobile UI/UX standards with Material Design principles.

## Component Architecture

### 1. Navigation Components

#### **NavigationTab**
- **Variants**: Default, Active, Pressed
- **States**: 
  - Active: Blue accent color (#2563eb), medium font weight, thicker stroke
  - Inactive: Gray (#9ca3af), normal font weight
  - Pressed: Scale down animation (0.95)
- **Specs**: 
  - Icon size: 24px (6 Tailwind units)
  - Label size: 11px
  - Padding: 8px vertical, 16px horizontal

#### **FloatingActionButton (FAB)**
- **Position**: Centered horizontally, 28px above navigation bar
- **Size**: 56px (14 Tailwind units) - Material Design standard
- **Elevation**: 
  - Default: 0_6px_20px_rgba(37,99,235,0.4)
  - Hover: 0_8px_24px_rgba(37,99,235,0.5)
  - Active: 0_4px_12px_rgba(37,99,235,0.3)
- **Colors**: 
  - Default: #2563eb (blue-600)
  - Hover: #1d4ed8 (blue-700)
  - Active: #1e40af (blue-800)
- **Icon**: Plus, 28px, stroke-width: 2.5
- **Animation**: Scale down to 0.95 on active

### 2. Content Components

#### **TaskCard**
- **Variants**: 
  - **Default**: Full featured with priority badge
  - **Compact**: Minimal version with dot indicator
- **Border Radius**: 
  - Default: 16px (rounded-2xl)
  - Compact: 12px (rounded-xl)
- **Shadow**: 
  - Default: shadow-sm
  - Hover: shadow-md
- **Priority Colors**:
  - High: Red (#ef4444 / red-500)
  - Low: Blue (#3b82f6 / blue-500)
- **Animation**: Scale to 0.98 on active

#### **CalendarCell**
- **Shape**: Square (aspect-square)
- **Border Radius**: 12px (rounded-xl)
- **States**:
  - Today: Blue border (#3b82f6), light blue background (#eff6ff)
  - Has Tasks: Gray border, white background, hover effects
  - Empty: Light gray border, white background
- **Task Indicators**: 
  - Horizontal bars, 4px height (h-1)
  - Max 3 visible, "+N" text for overflow
  - Colors match priority (red-400, blue-400)

### 3. Layout Principles

#### **Fixed Header Pattern**
- Header positioned at top with flex-shrink-0
- Contains branding, actions, search, navigation
- Border bottom: 1px solid gray-200
- Padding: 12px horizontal, 12-16px vertical

#### **Scrollable Content**
- flex-1 with overflow-y-auto
- scrollbar-hide class to remove visible scrollbar
- Padding: 16px horizontal, 20px vertical
- Space between sections: 24px (space-y-6)

#### **Fixed Footer**
- Footer at bottom with flex-shrink-0
- Border top: 1px solid gray-200
- Padding: 16px
- Buttons: Full width, 56px height (py-3.5)

### 4. Color System

#### **Primary Blue**
- Blue-600: #2563eb (Primary buttons, active states)
- Blue-700: #1d4ed8 (Hover states)
- Blue-800: #1e40af (Active/pressed states)
- Blue-500: #3b82f6 (Borders, accents)
- Blue-50: #eff6ff (Light backgrounds)

#### **Gray Scale**
- Gray-900: #111827 (Primary text)
- Gray-700: #374151 (Secondary text)
- Gray-600: #4b5563 (Icons)
- Gray-500: #6b7280 (Tertiary text)
- Gray-400: #9ca3af (Inactive icons)
- Gray-200: #e5e7eb (Borders)
- Gray-100: #f3f4f6 (Hover backgrounds)
- Gray-50: #f9fafb (Card backgrounds)

#### **Priority Colors**
- Red-500: #ef4444 (High priority)
- Red-50: #fef2f2 (High priority background)
- Blue-500: #3b82f6 (Low priority)
- Blue-50: #eff6ff (Low priority background)

#### **Warning/Notes**
- Amber-200: #fde68a (Note borders)
- Amber-50: #fffbeb (Note backgrounds)

### 5. Typography

#### **Font Family**
- Primary: Inter (Google Fonts)
- Fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif

#### **Font Sizes**
- H1: 24px (text-2xl)
- H2: 20px (text-xl)
- H3: 18px (text-lg)
- Body: 16px (text-base)
- Small: 14px (text-sm)
- Extra Small: 12px (text-xs)
- Micro: 11px (text-[11px])

#### **Font Weights**
- Medium: 500 (Headings, buttons, labels)
- Normal: 400 (Body text, inputs)

### 6. Spacing System

#### **Padding/Margin Scale**
- xs: 4px (1 unit)
- sm: 8px (2 units)
- md: 12px (3 units)
- base: 16px (4 units)
- lg: 20px (5 units)
- xl: 24px (6 units)

#### **Common Patterns**
- Card padding: 16px (p-4)
- Screen padding: 16px horizontal (px-4)
- Section spacing: 24px (space-y-6)
- Item spacing: 12px (space-y-3)
- Small gaps: 8px (gap-2)
- Medium gaps: 12px (gap-3)

### 7. Interaction Design

#### **Touch Targets**
- Minimum: 44x44px (iOS/Android standard)
- Buttons: 56px height for primary actions
- Navigation items: 48px minimum
- Form inputs: 44px height

#### **Animations**
- Duration: 200ms (duration-200)
- Easing: Default ease
- Scale down: 0.95-0.98 on active
- Transitions: all (transition-all)

#### **Hover States** (for hybrid devices)
- Background change
- Border color change
- Shadow increase
- No scale on hover (only on active)

### 8. Accessibility

#### **ARIA Labels**
- All icon-only buttons have aria-label
- Navigation items have aria-current when active
- Form inputs have associated labels

#### **Focus States**
- Ring: 2px solid blue-500
- Offset: 2px
- All interactive elements keyboard accessible

## Usage Examples

### Creating a New Screen

```tsx
import { TaskCard } from './components/mobile/TaskCard';
import { CalendarCell } from './components/mobile/CalendarCell';

function MyScreen() {
  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Fixed Header */}
      <header className="px-4 py-4 bg-white border-b border-gray-200 flex-shrink-0">
        <h1>My Screen</h1>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="px-4 py-5 space-y-6">
          {/* Content here */}
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="px-4 py-4 border-t border-gray-200 bg-white flex-shrink-0">
        {/* Footer actions */}
      </div>
    </div>
  );
}
```

### Using Components

```tsx
// Task Card
<TaskCard
  title="Team Meeting"
  date="Today, 2:00 PM"
  priority="high"
  onClick={() => {}}
  variant="default" // or "compact"
/>

// Calendar Cell
<CalendarCell
  day={15}
  tasks={[
    { id: '1', priority: 'high' },
    { id: '2', priority: 'low' }
  ]}
  isToday={true}
  onClick={() => {}}
/>

// Navigation Tab
<NavigationTab
  icon={Home}
  label="Home"
  isActive={true}
  onClick={() => {}}
/>
```

## Design System Files

- `/components/mobile/NavigationTab.tsx` - Navigation tab component
- `/components/mobile/FloatingActionButton.tsx` - FAB component
- `/components/mobile/TaskCard.tsx` - Task card component
- `/components/mobile/CalendarCell.tsx` - Calendar day cell component
- `/components/mobile/MobileNavigation.tsx` - Bottom navigation bar
- `/components/mobile/MobileHome.tsx` - Home screen
- `/components/mobile/MobileAddTask.tsx` - Add task screen
- `/components/mobile/MobileTaskDetails.tsx` - Task details screen
- `/MobileApp.tsx` - Mobile app container

## Responsive Behavior

The app automatically switches to mobile layout when viewport width < 768px (tablet breakpoint).

```tsx
// In App.tsx
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };
  
  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, []);

if (isMobile) {
  return <MobileApp />;
}
```
