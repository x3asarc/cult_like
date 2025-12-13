/**
 * Analytics utilities for safe event tracking
 */

interface AnalyticsData {
  [key: string]: string | number | boolean | null | undefined;
}

interface Analytics {
  track: (event: string, data: AnalyticsData) => void;
}

declare global {
  interface Window {
    analytics?: Analytics;
  }
}

/**
 * Safely track analytics events
 */
export function trackEvent(event: string, data: AnalyticsData = {}): void {
  if (typeof window !== 'undefined' && window.analytics) {
    try {
      window.analytics.track(event, data);
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  }
}

/**
 * Check if analytics is available
 */
export function hasAnalytics(): boolean {
  return typeof window !== 'undefined' && Boolean(window.analytics);
}