'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect user's reduced motion preference for accessibility
 * Respects the prefers-reduced-motion CSS media query
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return;
    }
    
    // Check for prefers-reduced-motion media query
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Set initial state
    setPrefersReducedMotion(mediaQuery.matches);
    
    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
      
      // Log accessibility preference changes in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Reduced motion preference changed: ${event.matches ? 'enabled' : 'disabled'}`);
      }
      
      // Track analytics if available
      if (typeof window !== 'undefined' && (window as any).analytics) {
        (window as any).analytics.track('reduced_motion_preference_changed', {
          prefersReducedMotion: event.matches,
          timestamp: Date.now()
        });
      }
    };
    
    // Add event listener
    mediaQuery.addEventListener('change', handleChange);
    
    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  
  // Also check for explicit user preference in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPreference = localStorage.getItem('prefer-reduced-motion');
      if (savedPreference === 'true') {
        setPrefersReducedMotion(true);
      }
    }
  }, []);
  
  return prefersReducedMotion;
}

/**
 * Hook for providing safe animation durations based on motion preferences
 */
export function useSafeAnimationDuration(defaultDuration: number): number {
  const prefersReducedMotion = useReducedMotion();
  
  // Significantly reduce animation duration for users who prefer reduced motion
  // but don't eliminate it entirely for functional animations
  return prefersReducedMotion ? Math.max(defaultDuration * 0.1, 150) : defaultDuration;
}

/**
 * Utility function to check reduced motion preference synchronously
 * Useful for server-side rendering or initial renders
 */
export function getReducedMotionPreference(): boolean {
  if (typeof window === 'undefined') {
    return false; // Default to animations enabled on server
  }
  
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (error) {
    console.warn('Could not detect reduced motion preference:', error);
    return false;
  }
}