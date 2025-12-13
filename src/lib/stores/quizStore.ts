import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface QuizState {
  // Core filter state
  filters: {
    location: string | null;
    category: string | null; // renamed from 'type' to match backend
    month: number | null; // 1-12 for backend compatibility
  };
  
  // Step management
  currentStep: number; // 1, 2, or 3
  isComplete: boolean;
  
  // Cache for loaded data to avoid re-fetching
  cachedData: {
    locations: Array<{ id: string; name: string; eventCount: number }>;
    eventTypes: Array<{ id: string; name: string; eventCount: number }>;
    months: Array<{ id: string; name: string; eventCount: number }>;
  };
  
  // Actions for auto-advancing
  setLocation: (locationId: string) => void;
  setCategory: (categoryId: string) => void;
  setMonth: (monthIndex: number) => void;
  
  // Step navigation
  goToStep: (step: number) => void;
  reset: () => void;
  
  // Cache management
  setCachedLocations: (locations: Array<{ id: string; name: string; eventCount: number }>) => void;
  setCachedEventTypes: (eventTypes: Array<{ id: string; name: string; eventCount: number }>) => void;
  setCachedMonths: (months: Array<{ id: string; name: string; eventCount: number }>) => void;
  
  // Validation helpers
  canAccessStep: (step: number) => boolean;
  getNextStep: () => number | null;
  getIncompleteStep: () => number;
  
  // URL sync helpers
  syncFromURL: (searchParams: URLSearchParams) => void;
  getURLParams: () => URLSearchParams;
}

const initialState = {
  filters: {
    location: null,
    category: null,
    month: null
  },
  currentStep: 1,
  isComplete: false,
  cachedData: {
    locations: [],
    eventTypes: [],
    months: []
  }
};

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setLocation: (locationId: string) => {
        console.log('QuizStore: Setting location:', locationId);
        set(state => ({
          filters: { ...state.filters, location: locationId },
          currentStep: 2 // Auto-advance to step 2
        }));
        
        // Track analytics
        if (typeof window !== 'undefined' && (window as { analytics?: { track: (event: string, data: Record<string, unknown>) => void } }).analytics) {
          (window as { analytics: { track: (event: string, data: Record<string, unknown>) => void } }).analytics.track('quiz_step_completed', {
            step: 1,
            stepName: 'location',
            selection: locationId,
            nextStep: 2
          });
        }
      },
      
      setCategory: (categoryId: string) => {
        console.log('QuizStore: Setting category:', categoryId);
        set(state => ({
          filters: { ...state.filters, category: categoryId },
          currentStep: 3 // Auto-advance to step 3
        }));
        
        // Track analytics
        if (typeof window !== 'undefined' && (window as { analytics?: { track: (event: string, data: Record<string, unknown>) => void } }).analytics) {
          (window as { analytics: { track: (event: string, data: Record<string, unknown>) => void } }).analytics.track('quiz_step_completed', {
            step: 2,
            stepName: 'category',
            selection: categoryId,
            nextStep: 3
          });
        }
      },
      
      setMonth: (monthIndex: number) => {
        console.log('QuizStore: Setting month:', monthIndex);
        set(state => ({
          filters: { ...state.filters, month: monthIndex },
          isComplete: true // Quiz complete, ready for results
        }));
        
        // Track analytics
        if (typeof window !== 'undefined' && (window as { analytics?: { track: (event: string, data: Record<string, unknown>) => void } }).analytics) {
          (window as { analytics: { track: (event: string, data: Record<string, unknown>) => void } }).analytics.track('quiz_completed', {
            step: 3,
            stepName: 'month',
            selection: monthIndex,
            finalFilters: {
              location: get().filters.location,
              category: get().filters.category,
              month: monthIndex
            }
          });
        }
      },
      
      goToStep: (step: number) => {
        const { canAccessStep } = get();
        if (canAccessStep(step)) {
          console.log('QuizStore: Navigating to step:', step);
          set({ 
            currentStep: step,
            isComplete: step === 4 || (step === 3 && get().filters.month !== null)
          });
        } else {
          console.warn(`QuizStore: Cannot access step ${step}, prerequisites not met`);
        }
      },
      
      reset: () => {
        console.log('QuizStore: Resetting quiz state');
        set(initialState);
        
        // Track analytics
        if (typeof window !== 'undefined' && (window as { analytics?: { track: (event: string, data: Record<string, unknown>) => void } }).analytics) {
          (window as { analytics: { track: (event: string, data: Record<string, unknown>) => void } }).analytics.track('quiz_reset', {
            previousStep: get().currentStep,
            hadCompletedSteps: Object.values(get().filters).some(filter => filter !== null)
          });
        }
      },
      
      setCachedLocations: (locations) => {
        console.log('QuizStore: Caching locations:', locations.length);
        set(state => ({
          cachedData: { ...state.cachedData, locations }
        }));
      },
      
      setCachedEventTypes: (eventTypes) => {
        console.log('QuizStore: Caching event types:', eventTypes.length);
        set(state => ({
          cachedData: { ...state.cachedData, eventTypes }
        }));
      },
      
      setCachedMonths: (months) => {
        console.log('QuizStore: Caching months:', months.length);
        set(state => ({
          cachedData: { ...state.cachedData, months }
        }));
      },
      
      canAccessStep: (step: number) => {
        const { filters } = get();
        switch (step) {
          case 1: 
            return true; // Always can access step 1
          case 2: 
            return !!filters.location;
          case 3: 
            return !!filters.location && !!filters.category;
          case 4: // Results
            return !!filters.location && !!filters.category && !!filters.month;
          default: 
            return false;
        }
      },
      
      getNextStep: () => {
        const { filters } = get();
        if (!filters.location) return 1;
        if (!filters.category) return 2;
        if (!filters.month) return 3;
        return null; // Complete
      },
      
      getIncompleteStep: () => {
        const nextStep = get().getNextStep();
        return nextStep || 1; // Default to step 1 if complete
      },
      
      syncFromURL: (searchParams: URLSearchParams) => {
        const location = searchParams.get('location');
        const category = searchParams.get('category') || searchParams.get('type');
        const monthParam = searchParams.get('month');
        const month = monthParam ? parseInt(monthParam, 10) : null;
        
        console.log('QuizStore: Syncing from URL:', { location, category, month });
        
        set(state => ({
          filters: {
            location: location || state.filters.location,
            category: category || state.filters.category,
            month: month || state.filters.month
          },
          isComplete: !!(location && category && month),
          currentStep: !location ? 1 : !category ? 2 : !month ? 3 : 4
        }));
      },
      
      getURLParams: () => {
        const { filters } = get();
        const params = new URLSearchParams();
        
        if (filters.location) params.set('location', filters.location);
        if (filters.category) params.set('category', filters.category);
        if (filters.month) params.set('month', filters.month.toString());
        
        return params;
      }
    }),
    {
      name: 'quiz-store', // Persist key
      partialize: (state) => ({
        // Only persist filters and current step, not cached data
        filters: state.filters,
        currentStep: state.currentStep,
        isComplete: state.isComplete
      })
    }
  )
);

/**
 * Hook for route guards - ensures user can't access incomplete steps
 */
export function useQuizRouteGuard() {
  const { canAccessStep, getIncompleteStep } = useQuizStore();
  
  const checkStepAccess = (requestedStep: number): { 
    canAccess: boolean; 
    redirectTo?: string 
  } => {
    if (canAccessStep(requestedStep)) {
      return { canAccess: true };
    }
    
    const redirectStep = getIncompleteStep();
    return { 
      canAccess: false, 
      redirectTo: `/quiz/step${redirectStep}` 
    };
  };
  
  return { checkStepAccess };
}

/**
 * Hook for building results URL with all filters
 */
export function useQuizResultsURL() {
  const { filters, isComplete } = useQuizStore();
  
  const getResultsURL = () => {
    if (!isComplete) {
      console.warn('Quiz not complete, cannot build results URL');
      return '/quiz/step1';
    }
    
    const params = new URLSearchParams();
    if (filters.location) params.set('location', filters.location);
    if (filters.category) params.set('category', filters.category);
    if (filters.month) params.set('month', filters.month.toString());
    
    return `/results?${params.toString()}`;
  };
  
  return { getResultsURL, isComplete };
}

/**
 * Development helper for debugging quiz state
 */
export function useQuizDebug() {
  const state = useQuizStore();
  
  if (process.env.NODE_ENV === 'development') {
    return {
      logState: () => console.log('Quiz State:', state),
      logFilters: () => console.log('Quiz Filters:', state.filters),
      logValidation: () => {
        const canAccess1 = state.canAccessStep(1);
        const canAccess2 = state.canAccessStep(2);
        const canAccess3 = state.canAccessStep(3);
        const nextStep = state.getNextStep();
        
        console.log('Quiz Validation:', {
          canAccess: { step1: canAccess1, step2: canAccess2, step3: canAccess3 },
          nextStep,
          isComplete: state.isComplete,
          currentStep: state.currentStep
        });
      }
    };
  }
  
  return {
    logState: () => {},
    logFilters: () => {},
    logValidation: () => {}
  };
}