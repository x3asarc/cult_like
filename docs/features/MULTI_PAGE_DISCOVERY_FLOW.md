# Word-Cloud Discovery Flow Implementation Plan

## Overview
Fix critical overlapping issues in the current word-cloud based discovery flow and enhance the user experience with improved animations and streamlined navigation. The focus is on ensuring no interactive elements overlap while maintaining the playful floating typography aesthetic.

## Critical Problems to Solve

### 1. Word-Cloud Overlap Issues (HIGH PRIORITY)
- **Problem**: District, event type, and month words visually overlap, making items partially or completely unclickable
- **Impact**: Violates accessibility guidelines, breaks user interaction, creates frustration
- **Solution**: Implement collision-free layout algorithms with minimum 48x48px tap targets and 8px spacing

### 2. Duplicate Step 1 Screen (HIGH PRIORITY)
- **Problem**: Second page repeats district selection instead of progressing
- **Impact**: Users repeat same choice, creates confusion and friction
- **Solution**: Remove duplicate screen, make each step unique and auto-advancing

### 3. Subtle Animation (MEDIUM PRIORITY)
- **Problem**: Floating motion is barely perceptible, feels accidental
- **Impact**: Interface doesn't feel alive or intentionally animated
- **Solution**: Increase amplitude and add staggered motion while respecting reduced motion preferences

### 4. Inconsistent Continue Buttons (MEDIUM PRIORITY)
- **Problem**: Some steps require Continue button clicks, others auto-advance
- **Impact**: Inconsistent interaction patterns, unnecessary friction
- **Solution**: Auto-advance on all selections, remove Continue buttons

## Current State vs Target State

### Current Implementation
- Single `/quiz` page with step-based component switching
- State managed in `useQuizStore` with local progression
- No URL parameters for individual steps
- All steps rendered in one component tree

### Target Implementation
- **3-step streamlined flow**: Step 1 (Location) → Step 2 (Event Type) → Step 3 (Month) → Results
- **Non-overlapping word clouds** with collision-free layout algorithms
- **Auto-advancing steps** - no Continue buttons required
- **Enhanced floating animations** with 4-16px amplitude and staggered motion
- **Consistent progress indicators** across all 3 steps (1/3 → 2/3 → 3/3)
- **48x48px minimum tap targets** with 8px spacing for accessibility
- **Reduced motion support** for accessibility compliance

## Non-Overlapping Layout Algorithm Implementation

### Collision-Free Word Cloud System

#### Core Requirements
- **Minimum tap target**: 48x48px for all interactive words
- **Minimum spacing**: 8px between all word bounding boxes
- **No overlaps**: Zero tolerance for intersecting interactive elements
- **Responsive**: Layout adapts to container size while maintaining constraints

#### Algorithm Option 1: Spiral Placement
```typescript
// src/lib/layout/spiralLayout.ts
interface WordItem {
  id: string;
  text: string;
  fontSize: number;
  importance: number; // for sorting
  width: number;
  height: number;
}

function spiralLayout(items: WordItem[], containerBounds: Bounds): PlacedItem[] {
  // 1. Sort by importance (event count)
  const sortedItems = items.sort((a, b) => b.importance - a.importance);
  
  // 2. Place each item starting from center, spiraling out on collision
  const placed: PlacedItem[] = [];
  
  for (const item of sortedItems) {
    let position = findNonCollidingPosition(
      item,
      placed,
      containerBounds.center,
      MIN_SPACING = 8
    );
    
    placed.push({ ...item, x: position.x, y: position.y });
  }
  
  return placed;
}

function findNonCollidingPosition(
  item: WordItem,
  placed: PlacedItem[],
  startCenter: Point,
  minSpacing: number
): Point {
  let radius = 0;
  let angle = 0;
  const spiralIncrement = 5; // pixels per spiral step
  const angleIncrement = 0.1; // radians per step
  
  while (radius < MAX_SPIRAL_RADIUS) {
    const x = startCenter.x + radius * Math.cos(angle);
    const y = startCenter.y + radius * Math.sin(angle);
    
    const candidateBounds = {
      x: x - item.width/2,
      y: y - item.height/2,
      width: item.width + minSpacing*2,
      height: item.height + minSpacing*2
    };
    
    if (!hasCollision(candidateBounds, placed)) {
      return { x, y };
    }
    
    // Move along spiral
    angle += angleIncrement;
    radius += spiralIncrement * (angle / (2 * Math.PI));
  }
  
  throw new Error('Could not place item without collision');
}
```

#### Algorithm Option 2: Force-Directed Layout
```typescript
// src/lib/layout/forceLayout.ts
function forceDirectedLayout(
  items: WordItem[], 
  containerBounds: Bounds,
  maxIterations: number = 100
): PlacedItem[] {
  // 1. Initial random positions
  let positions = items.map(item => ({
    ...item,
    x: Math.random() * containerBounds.width,
    y: Math.random() * containerBounds.height,
    vx: 0, vy: 0 // velocity
  }));
  
  // 2. Iteratively resolve collisions
  for (let iter = 0; iter < maxIterations; iter++) {
    const forces = calculateRepulsionForces(positions);
    const centeringForces = calculateCenteringForces(positions, containerBounds);
    
    // Apply forces
    positions = positions.map((pos, i) => ({
      ...pos,
      vx: pos.vx + forces[i].x + centeringForces[i].x,
      vy: pos.vy + forces[i].y + centeringForces[i].y,
      x: pos.x + pos.vx * 0.1, // damping
      y: pos.y + pos.vy * 0.1
    }));
    
    // Check convergence
    if (hasConverged(positions)) break;
  }
  
  return positions;
}
```

## Step-by-Step Flow Implementation

### Step 1: Location Selection (No Duplicate Screen)

#### Purpose
Single, clear district selection with immediate progression - no secondary location screen.

#### Key Components
```typescript
// src/app/quiz/step1/page.tsx
export default function LocationStep() {
  const { setLocation } = useQuizStore();
  const router = useRouter();
  
  const handleLocationSelect = (locationId: string) => {
    setLocation(locationId);
    // Auto-advance - no Continue button
    router.push('/quiz/step2');
  };
  
  return (
    <main className="min-h-screen flex flex-col justify-center">
      <ProgressIndicator current={1} total={3} label="Location" />
      
      <section className="flex-1 flex flex-col justify-center px-4">
        <h1 className="text-center mb-4">Find cultural events that match your taste</h1>
        <p className="text-center mb-8">Start by picking your area</p>
        
        <NonOverlappingWordCloud
          items={locations}
          onItemClick={handleLocationSelect}
          fontSizeRange={{ min: 1.1, max: 2.4 }}
          algorithm="spiral" // or "force-directed"
          minTapTarget={48}
          minSpacing={8}
        />
        
        <p className="text-center mt-8 text-sm text-gray-600">
          Larger words mean more events in that area
        </p>
      </section>
    </main>
  );
}
```

### Step 2: Event Type Selection (Auto-Advancing)

#### Purpose
Event category selection with same visual language but auto-progression on click.

#### Key Components
```typescript
// src/app/quiz/step2/page.tsx
export default function EventTypeStep() {
  const { filters, setCategory } = useQuizStore();
  const router = useRouter();
  
  // Route guard - redirect if no location
  useEffect(() => {
    if (!filters.location) {
      router.push('/quiz/step1');
    }
  }, [filters.location]);
  
  const handleCategorySelect = (categoryId: string) => {
    setCategory(categoryId);
    // Auto-advance - no Continue button
    router.push('/quiz/step3');
  };
  
  return (
    <main className="min-h-screen flex flex-col justify-center">
      <ProgressIndicator current={2} total={3} label="Event Type" />
      
      <section className="flex-1 flex flex-col justify-center px-4">
        <h1 className="text-center mb-4">What type of cultural event?</h1>
        <p className="text-center mb-8">Pick what you're in the mood for</p>
        
        <NonOverlappingWordCloud
          items={eventTypes}
          onItemClick={handleCategorySelect}
          fontSizeRange={{ min: 1.0, max: 1.8 }} // Smaller range for readability
          algorithm="spiral"
          minTapTarget={48}
          minSpacing={8}
        />
      </section>
    </main>
  );
}
```

### Step 3: Month Selection (Final Step)

#### Purpose
Month selection with immediate progression to results - no confirmation screen.

#### Key Components
```typescript
// src/app/quiz/step3/page.tsx
export default function MonthStep() {
  const { filters, setMonth } = useQuizStore();
  const router = useRouter();
  
  // Route guard - redirect if incomplete
  useEffect(() => {
    if (!filters.location || !filters.category) {
      const missingStep = !filters.location ? 'step1' : 'step2';
      router.push(`/quiz/${missingStep}`);
    }
  }, [filters]);
  
  const handleMonthSelect = (monthIndex: number) => {
    setMonth(monthIndex);
    // Auto-advance to results - no Continue button
    router.push('/results');
  };
  
  return (
    <main className="min-h-screen flex flex-col justify-center">
      <ProgressIndicator current={3} total={3} label="Time" />
      
      <section className="flex-1 flex flex-col justify-center px-4">
        <h1 className="text-center mb-4">When would you like to go?</h1>
        <p className="text-center mb-8">Pick your preferred month</p>
        
        <NonOverlappingWordCloud
          items={months}
          onItemClick={handleMonthSelect}
          fontSizeRange={{ min: 1.1, max: 2.4 }}
          algorithm="spiral"
          minTapTarget={48}
          minSpacing={8}
        />
        
        <p className="text-center mt-8 text-sm text-gray-600">
          Larger months mean more events available
        </p>
      </section>
    </main>
  );
}
```

## Enhanced Floating Animation System

### Animation Requirements
- **Visible motion**: 4-16px translation amplitude (vs current 1-2px)
- **Staggered timing**: 0-1000ms delay offsets for organic feel
- **Duration variation**: 3-7 seconds per animation cycle
- **Reduced motion compliance**: Disable animations when user prefers reduced motion

### Implementation
```typescript
// src/components/animations/EnhancedFloatingText.tsx
interface FloatingTextProps {
  children: React.ReactNode;
  amplitude?: { min: number; max: number };
  duration?: { min: number; max: number };
  delay?: { min: number; max: number };
}

export function EnhancedFloatingText({ 
  children, 
  amplitude = { min: 4, max: 16 },
  duration = { min: 3000, max: 7000 },
  delay = { min: 0, max: 1000 }
}: FloatingTextProps) {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  
  if (prefersReducedMotion) {
    return <span>{children}</span>;
  }
  
  const animationProps = {
    x: [
      0,
      random(amplitude.min, amplitude.max) * (Math.random() > 0.5 ? 1 : -1),
      0
    ],
    y: [
      0, 
      random(amplitude.min, amplitude.max) * (Math.random() > 0.5 ? 1 : -1),
      0
    ],
    rotate: [
      0,
      random(-2, 2),
      0
    ],
    transition: {
      duration: random(duration.min, duration.max) / 1000,
      delay: random(delay.min, delay.max) / 1000,
      ease: "easeInOut",
      repeat: Infinity
    }
  };
  
  return (
    <motion.span animate={animationProps}>
      {children}
    </motion.span>
  );
}
```

## Non-Overlapping Word Cloud Component

### Core Component Implementation
```typescript
// src/components/ui/NonOverlappingWordCloud.tsx
interface WordCloudItem {
  id: string;
  text: string;
  value: number; // for sizing (event count)
  fontSize?: number; // calculated
  width?: number; // calculated
  height?: number; // calculated
}

interface NonOverlappingWordCloudProps {
  items: WordCloudItem[];
  onItemClick: (id: string) => void;
  fontSizeRange: { min: number; max: number };
  algorithm: 'spiral' | 'force-directed';
  minTapTarget: number; // pixels
  minSpacing: number; // pixels
  containerClassName?: string;
}

export function NonOverlappingWordCloud({
  items,
  onItemClick,
  fontSizeRange,
  algorithm,
  minTapTarget,
  minSpacing,
  containerClassName = ''
}: NonOverlappingWordCloudProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [placedItems, setPlacedItems] = useState<PlacedWordCloudItem[]>([]);
  const [isLayoutComplete, setIsLayoutComplete] = useState(false);
  
  // Calculate font sizes based on value range
  const itemsWithSizes = useMemo(() => {
    const values = items.map(item => item.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    
    return items.map(item => {
      const normalizedValue = (item.value - minValue) / (maxValue - minValue);
      const fontSize = fontSizeRange.min + normalizedValue * (fontSizeRange.max - fontSizeRange.min);
      
      // Estimate text dimensions (rough approximation)
      const width = Math.max(item.text.length * fontSize * 0.6, minTapTarget);
      const height = Math.max(fontSize * 1.2, minTapTarget);
      
      return { ...item, fontSize, width, height };
    });
  }, [items, fontSizeRange, minTapTarget]);
  
  // Layout calculation
  useLayoutEffect(() => {
    if (!containerRef.current || itemsWithSizes.length === 0) return;
    
    const containerBounds = containerRef.current.getBoundingClientRect();
    
    const layoutFunction = algorithm === 'spiral' ? spiralLayout : forceDirectedLayout;
    const positioned = layoutFunction(
      itemsWithSizes,
      {
        width: containerBounds.width,
        height: containerBounds.height,
        center: { x: containerBounds.width / 2, y: containerBounds.height / 2 }
      },
      minSpacing
    );
    
    setPlacedItems(positioned);
    setIsLayoutComplete(true);
  }, [itemsWithSizes, algorithm, minSpacing]);
  
  return (
    <div 
      ref={containerRef}
      className={`relative w-full min-h-[400px] ${containerClassName}`}
      role="list"
      aria-label="Interactive word cloud"
    >
      {isLayoutComplete && placedItems.map(item => (
        <WordCloudButton
          key={item.id}
          item={item}
          onClick={() => onItemClick(item.id)}
          minTapTarget={minTapTarget}
        />
      ))}
      
      {!isLayoutComplete && (
        <div className="flex items-center justify-center h-full">
          <span className="text-gray-500">Arranging words...</span>
        </div>
      )}
    </div>
  );
}
```

### Individual Word Button Component
```typescript
// src/components/ui/WordCloudButton.tsx
interface WordCloudButtonProps {
  item: PlacedWordCloudItem;
  onClick: () => void;
  minTapTarget: number;
}

function WordCloudButton({ item, onClick, minTapTarget }: WordCloudButtonProps) {
  const buttonStyle = {
    position: 'absolute' as const,
    left: `${item.x - item.width / 2}px`,
    top: `${item.y - item.height / 2}px`,
    width: `${Math.max(item.width, minTapTarget)}px`,
    height: `${Math.max(item.height, minTapTarget)}px`,
    fontSize: `${item.fontSize}rem`
  };
  
  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      className={
        "flex items-center justify-center " +
        "bg-transparent border-none cursor-pointer " +
        "text-gray-900 hover:text-blue-600 " +
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 " +
        "transition-colors duration-200 " +
        "font-serif"
      }
      role="listitem"
      aria-label={`${item.text}, ${item.value} events`}
      // Ensure minimum tap target for accessibility
      style={{
        ...buttonStyle,
        minWidth: `${minTapTarget}px`,
        minHeight: `${minTapTarget}px`
      }}
    >
      <EnhancedFloatingText>
        {item.text}
      </EnhancedFloatingText>
    </button>
  );
}
```

## Progress Indicator Component

### Consistent Progress Across All Steps
```typescript
// src/components/ui/ProgressIndicator.tsx
interface ProgressIndicatorProps {
  current: number; // 1, 2, or 3
  total: number; // always 3
  label: string; // 'Location', 'Event Type', 'Time'
}

export function ProgressIndicator({ current, total, label }: ProgressIndicatorProps) {
  const steps = [
    { number: 1, label: 'Location' },
    { number: 2, label: 'Event Type' },
    { number: 3, label: 'Time' }
  ];
  
  return (
    <div className="flex justify-center items-center py-6">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            {/* Step indicator dot */}
            <div className={
              `w-3 h-3 rounded-full transition-colors duration-200 ${
                step.number === current 
                  ? 'bg-blue-600' 
                  : step.number < current 
                    ? 'bg-green-600' 
                    : 'bg-gray-300'
              }`
            } />
            
            {/* Step label */}
            <span className={
              `ml-2 text-sm font-medium ${
                step.number === current 
                  ? 'text-blue-600' 
                  : step.number < current 
                    ? 'text-green-600' 
                    : 'text-gray-500'
              }`
            }>
              {step.label}
            </span>
            
            {/* Connector line (not after last step) */}
            {index < steps.length - 1 && (
              <div className={
                `w-8 h-px ml-4 transition-colors duration-200 ${
                  step.number < current ? 'bg-green-600' : 'bg-gray-300'
                }`
              } />
            )}
          </div>
        ))}
      </div>
      
      {/* Current step label */}
      <div className="mt-2 text-center">
        <span className="text-sm text-gray-600">
          Step {current} of {total}: {label}
        </span>
      </div>
    </div>
  );
}
```

## State Management Updates

### Enhanced Quiz Store for Auto-Advancing Flow
```typescript
// src/lib/stores/quizStore.ts
interface QuizState {
  // Core filter state
  filters: {
    location: string | null;
    category: string | null; // renamed from 'type'
    month: number | null;
  };
  
  // Step management
  currentStep: number; // 1, 2, or 3
  isComplete: boolean;
  
  // Actions for auto-advancing
  setLocation: (locationId: string) => void;
  setCategory: (categoryId: string) => void;
  setMonth: (monthIndex: number) => void;
  
  // Step navigation
  goToStep: (step: number) => void;
  reset: () => void;
  
  // Validation helpers
  canAccessStep: (step: number) => boolean;
  getNextStep: () => number | null;
}

export const useQuizStore = create<QuizState>()((set, get) => ({
  filters: {
    location: null,
    category: null,
    month: null
  },
  currentStep: 1,
  isComplete: false,
  
  setLocation: (locationId: string) => {
    set(state => ({
      filters: { ...state.filters, location: locationId },
      currentStep: 2 // Auto-advance to step 2
    }));
  },
  
  setCategory: (categoryId: string) => {
    set(state => ({
      filters: { ...state.filters, category: categoryId },
      currentStep: 3 // Auto-advance to step 3
    }));
  },
  
  setMonth: (monthIndex: number) => {
    set(state => ({
      filters: { ...state.filters, month: monthIndex },
      isComplete: true // Quiz complete, ready for results
    }));
  },
  
  goToStep: (step: number) => {
    const { canAccessStep } = get();
    if (canAccessStep(step)) {
      set({ currentStep: step });
    }
  },
  
  reset: () => {
    set({
      filters: { location: null, category: null, month: null },
      currentStep: 1,
      isComplete: false
    });
  },
  
  canAccessStep: (step: number) => {
    const { filters } = get();
    switch (step) {
      case 1: return true; // Always can access step 1
      case 2: return !!filters.location;
      case 3: return !!filters.location && !!filters.category;
      default: return false;
    }
  },
  
  getNextStep: () => {
    const { filters } = get();
    if (!filters.location) return 1;
    if (!filters.category) return 2;
    if (!filters.month) return 3;
    return null; // Complete
  }
}));
```

## Accessibility Implementation

### WCAG AA Compliance Requirements

#### Minimum Touch Targets
```typescript
// Touch target requirements
const ACCESSIBILITY_STANDARDS = {
  MIN_TAP_TARGET: 48, // pixels - WCAG AA standard
  MIN_SPACING: 8,     // pixels between interactive elements
  MIN_CONTRAST_RATIO: 4.5, // for normal text
  LARGE_TEXT_THRESHOLD: 18 // pixels (or 14pt bold)
};
```

#### Semantic HTML Structure
```html
<!-- Each step follows this pattern -->
<main role="main">
  <nav aria-label="Progress">
    <!-- ProgressIndicator with proper landmarks -->
  </nav>
  
  <section>
    <h1><!-- Step primary heading --></h1>
    <p><!-- Step instructions --></p>
    
    <div role="list" aria-label="Choose from available options">
      <!-- NonOverlappingWordCloud -->
      <button role="listitem" aria-label="Vienna Downtown, 24 events">
        <!-- Word content with floating animation -->
      </button>
      <!-- Repeat for each word -->
    </div>
  </section>
</main>
```

#### Keyboard Navigation
```typescript
// src/hooks/useKeyboardNavigation.ts
export function useKeyboardNavigation(items: WordCloudItem[], onSelect: (id: string) => void) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => (prev + 1) % items.length);
          break;
          
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => (prev - 1 + items.length) % items.length);
          break;
          
        case 'Enter':
        case ' ':
          e.preventDefault();
          onSelect(items[focusedIndex].id);
          break;
          
        case 'Home':
          e.preventDefault();
          setFocusedIndex(0);
          break;
          
        case 'End':
          e.preventDefault();
          setFocusedIndex(items.length - 1);
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [items, onSelect, focusedIndex]);
  
  return { focusedIndex, setFocusedIndex };
}
```

### Reduced Motion Compliance
```typescript
// src/hooks/useReducedMotion.ts
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return prefersReducedMotion;
}

// Usage in floating animation
function EnhancedFloatingText({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    // Return static text for users who prefer no motion
    return <span>{children}</span>;
  }
  
  // Return animated version for users who allow motion
  return (
    <motion.span
      animate={{
        x: [0, random(-16, 16), 0],
        y: [0, random(-16, 16), 0],
        rotate: [0, random(-2, 2), 0]
      }}
      transition={{
        duration: random(3, 7),
        ease: "easeInOut",
        repeat: Infinity,
        delay: random(0, 1)
      }}
    >
      {children}
    </motion.span>
  );
}
```

## State Management Updates

### Enhanced Zustand Store
```typescript
// src/lib/stores/quizStore.ts
interface QuizState {
  filters: {
    location: string | null;
    month: number | null;
    category: string | null;
  };
  
  // Cache loaded data to avoid re-fetching
  cachedData: {
    locations: Location[];
    months: Month[];
    categories: Category[];
  };
  
  // Actions
  setLocation: (locationId: string) => void;
  setMonth: (monthIndex: number) => void;
  setCategory: (categoryId: string) => void;
  reset: () => void;
  
  // Cache management
  setCachedLocations: (locations: Location[]) => void;
  setCachedMonths: (months: Month[]) => void;
  setCachedCategories: (categories: Category[]) => void;
}
```

### URL State Synchronization
```typescript
// src/hooks/useURLSync.ts
// Sync Zustand store with URL parameters
// Handle browser back/forward navigation
// Preserve state across page refreshes
```

## Animation System

### Page Transitions
```typescript
// src/components/animations/PageTransition.tsx
// Wrap each page with consistent enter/exit animations
// Respect prefers-reduced-motion preference
// Different animation per route transition:
// - location→month: scroll + fade
// - month→category: crossfade + scale  
// - category→results: slide up from bottom
```

### Framer Motion Implementation
```typescript
// Animation variants for each transition type
const pageVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.4, ease: "easeOut" }
  },
  slideUp: {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -50, opacity: 0 },
    transition: { duration: 0.3, ease: "easeOut" }
  }
};
```

## Accessibility Implementation

### Semantic HTML Structure
```html
<!-- Each page follows this pattern -->
<main>
  <nav aria-label="Filters">
    <!-- FilterBreadcrumbs with proper landmarks -->
  </nav>
  
  <section>
    <h1><!-- Page primary heading --></h1>
    <div role="list" aria-label="<!-- Descriptive text -->">
      <div role="listitem">
        <button aria-label="<!-- Item name + count -->">
          <!-- Cloud item content -->
        </button>
      </div>
    </div>
  </section>
</main>
```

### Keyboard Navigation
- Full tab order through all interactive elements
- Enter/Space to select cloud items
- Visible focus rings meeting contrast requirements
- Skip links for screen reader users

### ARIA Labels
```typescript
// Example for location items
<button aria-label={`${location.name}, ${location.eventCount} events`}>
  {location.name}
</button>
```

## Backend API Requirements

### New Endpoints Needed

#### 1. Locations Endpoint
```typescript
// GET /api/locations
// Returns all locations with event counts
```

#### 2. Filtered Months Endpoint  
```typescript
// GET /api/months?location={id}
// Returns months that have events in the specified location
```

#### 3. Filtered Categories Endpoint
```typescript
// GET /api/categories?location={id}&month={index}
// Returns categories available for location + month combination
```

#### 4. Enhanced Events Endpoint
```typescript
// GET /api/events (enhanced with all filter params)
// Supports location, month, category, radius, free, accessible filters
```

### Database Schema Updates
```sql
-- Add indexes for new query patterns
CREATE INDEX idx_events_location_month ON events(location_id, EXTRACT(month FROM date));
CREATE INDEX idx_events_category_location ON events(category_id, location_id);
CREATE INDEX idx_events_filters ON events(location_id, category_id, EXTRACT(month FROM date)) WHERE price = 0; -- Free events
```

## Migration Strategy

### Phase 1: Build New Pages (Parallel Development)
1. Create new route structure in `src/app/`
2. Build shared components (`FilterBreadcrumbs`, `CloudBase`)
3. Implement page-specific components
4. Add new API endpoints
5. Test each page in isolation

### Phase 2: Connect Flow
1. Implement state synchronization between pages
2. Add route guards and redirects
3. Connect analytics tracking
4. Add page transition animations

### Phase 3: Replace Existing
1. Update navigation links to point to new flow
2. Add redirects from old `/quiz` route to new `/` route
3. Remove old quiz components after testing
4. Update documentation

## File Structure Changes

```
src/
├── app/
│   └── quiz/
│       ├── step1/
│       │   └── page.tsx           # Location selection (no duplicate)
│       ├── step2/
│       │   └── page.tsx           # Event type selection
│       └── step3/
│           └── page.tsx           # Month selection
│
├── components/
│   ├── ui/
│   │   ├── NonOverlappingWordCloud.tsx  # Core collision-free component
│   │   ├── WordCloudButton.tsx          # Individual interactive word
│   │   └── ProgressIndicator.tsx        # 1/3 - 2/3 - 3/3 indicator
│   │
│   └── animations/
│       └── EnhancedFloatingText.tsx     # 4-16px amplitude animations
│
├── lib/
│   ├── layout/
│   │   ├── spiralLayout.ts              # Spiral placement algorithm
│   │   └── forceLayout.ts               # Force-directed layout algorithm
│   │
│   ├── stores/
│   │   └── quizStore.ts                 # Auto-advancing store
│   │
│   └── hooks/
│       ├── useReducedMotion.ts          # Accessibility compliance
│       └── useKeyboardNavigation.ts     # Arrow key navigation
│
└── pages/api/
    ├── locations.ts                     # Districts with event counts
    ├── eventTypes.ts                    # Categories by location
    └── months.ts                        # Months by location + category
```

## Testing Strategy

### Critical Overlap Testing
- [ ] **Zero overlaps**: No word bounding boxes intersect on any step
- [ ] **Minimum tap targets**: All words are at least 48x48px
- [ ] **Minimum spacing**: 8px clear space between all words
- [ ] **Container scaling**: Layout adapts when browser window resizes
- [ ] **Font size scaling**: Different sized words never overlap
- [ ] **Mobile touch targets**: All words easily tappable on mobile devices

### Flow Testing
- [ ] **No duplicate Step 1**: User never sees district selection twice
- [ ] **Auto-advancement**: Clicking any word immediately advances to next step
- [ ] **No Continue buttons**: No extra confirmation screens or buttons
- [ ] **Progress indicator**: 1/3 → 2/3 → 3/3 shows correctly on each step
- [ ] **Route guards**: Accessing incomplete step redirects to correct previous step

### Animation Testing
- [ ] **Visible motion**: Floating animation clearly perceptible (4-16px amplitude)
- [ ] **Staggered timing**: Words don't move in sync, create organic feel
- [ ] **Reduced motion**: Animation completely disabled when user prefers reduced motion
- [ ] **Performance**: Animations don't cause jank or frame drops on mobile

### Accessibility Testing
- [ ] **Screen reader**: All words announced with event counts
- [ ] **Keyboard navigation**: Tab, arrow keys, Enter/Space work correctly
- [ ] **Focus indicators**: Visible focus rings on all interactive elements
- [ ] **ARIA labels**: Proper role="list" and role="listitem" structure
- [ ] **Color contrast**: All text meets WCAG AA contrast ratios

### Layout Algorithm Testing
- [ ] **Spiral algorithm**: Words spiral outward from center without overlaps
- [ ] **Force-directed algorithm**: Collision detection and resolution works
- [ ] **Performance**: Layout calculation completes in <500ms
- [ ] **Edge cases**: Handles very long words, many items, small containers
- [ ] **Fallback behavior**: Graceful degradation if layout fails

### Browser Compatibility Testing
- [ ] **Desktop**: Chrome, Firefox, Safari, Edge
- [ ] **Mobile**: iOS Safari, Android Chrome
- [ ] **Touch devices**: iPad, Android tablets
- [ ] **Reduced motion**: prefers-reduced-motion media query support

## Analytics Implementation

### Word-Cloud Interaction Tracking
```typescript
// Track overlap issues and layout success
analytics.track('wordcloud_layout_complete', {
  step: 'location_selection', // or 'event_type', 'month'
  algorithm: 'spiral', // or 'force-directed'
  itemCount: 8,
  layoutDurationMs: 150,
  hasOverlaps: false // Critical metric
});

// Track user interactions
analytics.track('click_word', {
  step: 'location_selection',
  wordId: 'vienna_downtown',
  wordText: 'Downtown Vienna',
  eventCount: 42,
  fontSize: 1.8,
  positionX: 320,
  positionY: 240,
  autoAdvanced: true // vs requiring Continue button
});

// Track animation preferences
analytics.track('reduced_motion_detected', {
  prefersReducedMotion: true,
  animationsDisabled: true
});
```

### Critical Success Metrics
- **Zero overlap incidents**: Track any reported overlapping elements
- **Step completion rate**: % users who complete each step without errors
- **Auto-advancement success**: % selections that successfully auto-advance
- **Animation performance**: Frame rate during floating animations
- **Accessibility compliance**: Screen reader and keyboard navigation success rates
- **Layout algorithm performance**: Average layout calculation time per step
- **Touch target effectiveness**: Mobile tap success rate (should be >95%)
- **Reduced motion adoption**: % users with reduced motion preference served static version

## Performance Considerations

### Page Load Optimization
- Static generate location data at build time
- Cache API responses for repeated filter combinations
- Preload next likely page (e.g., preload month data when location selected)
- Optimize images for event listings

### Bundle Splitting
```typescript
// Code split by route
const MonthPage = lazy(() => import('./month/page'));
const CategoryPage = lazy(() => import('./category/page'));
const ResultsPage = lazy(() => import('./results/page'));
```

## Acceptance Criteria

All criteria must be met before considering implementation complete:

### Critical Overlap Prevention
- ✅ **No overlapping bounding boxes** for any clickable words across all steps
- ✅ **48x48px minimum tap targets** for all interactive elements
- ✅ **8px minimum spacing** between all word boundaries
- ✅ **Layout algorithm** successfully places all words without collisions
- ✅ **Responsive behavior** maintains non-overlap at all screen sizes

### Streamlined Flow Requirements
- ✅ **Single district selection**: User never sees duplicate location screen
- ✅ **Auto-advancement**: All selections immediately advance without Continue buttons
- ✅ **Consistent progress**: 1/3 → 2/3 → 3/3 indicator on every step
- ✅ **Route protection**: Accessing incomplete step redirects appropriately

### Enhanced Animation Requirements
- ✅ **Visible motion**: 4-16px amplitude clearly perceptible
- ✅ **Staggered timing**: Words move with 0-1000ms delay offsets
- ✅ **Reduced motion compliance**: Completely static when user prefers no motion
- ✅ **Performance**: Animations maintain 60fps on mobile devices

### Accessibility Requirements
- ✅ **WCAG AA compliance**: All interactive elements meet accessibility standards
- ✅ **Keyboard navigation**: Full arrow key navigation with visible focus
- ✅ **Screen reader support**: Proper ARIA labels and semantic structure
- ✅ **Touch accessibility**: All elements easily tappable on touch devices

### Performance Requirements
- ✅ **Layout speed**: Word positioning completes in <500ms
- ✅ **Animation performance**: No frame drops during floating motion
- ✅ **Touch responsiveness**: Tap-to-advance in <100ms
- ✅ **Memory usage**: No memory leaks from animation loops
- ✅ **Battery impact**: Animations don't drain mobile battery excessively

## Dependencies

### Required Libraries
```json
{
  "framer-motion": "^10.16.4",     // Page animations
  "zustand": "^4.4.1",           // State management
  "@radix-ui/react-slider": "^1.1.2", // Radius filter
  "next": "^14.0.0"               // App Router
}
```

### Optional Enhancements
```json
{
  "@vercel/analytics": "^1.1.1",  // User behavior tracking
  "react-hotkeys-hook": "^4.4.1", // Keyboard shortcuts
  "react-intersection-observer": "^9.5.2" // Scroll animations
}
```

## Risk Mitigation

### Potential Issues
1. **SEO Impact**: Multiple pages vs single page
   - **Mitigation**: Implement proper metadata, canonical URLs, structured data

2. **State Management Complexity**: Keeping filters synchronized
   - **Mitigation**: URL as source of truth, fallback redirect logic

3. **Performance**: Multiple page loads vs client-side transitions
   - **Mitigation**: Prefetch data, optimize bundle splitting, cache aggressively

4. **User Confusion**: More complex navigation
   - **Mitigation**: Clear breadcrumbs, obvious progress indicators, user testing

## Next Steps After Implementation

1. **A/B Testing**: Compare new multi-page flow vs current single page
2. **User Feedback**: Collect qualitative feedback on discovery experience  
3. **Analytics Review**: Analyze completion rates and drop-off points
4. **Performance Monitoring**: Track Core Web Vitals across all pages
5. **Accessibility Audit**: Professional screen reader testing

## Documentation Updates Needed

- [ ] Update `docs/architecture/overview.md` with new page structure
- [ ] Create `docs/features/01_discovery_flow.md` with implementation details
- [ ] Update `docs/setup/README.md` with new development workflow
- [ ] Add `docs/accessibility/TESTING.md` with specific test procedures
- [ ] Update `.docs/review/CHECKLIST.md` with multi-page testing steps