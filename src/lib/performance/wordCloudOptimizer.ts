/**
 * Performance optimization utilities for word cloud components
 * Ensures 60fps performance and battery efficiency on mobile devices
 */

export interface PerformanceMetrics {
  frameRate: number;
  layoutDuration: number;
  memoryUsage: number;
  isOptimal: boolean;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  batteryLevel?: number;
}

/**
 * Monitor performance metrics for word cloud layouts
 */
export class WordCloudPerformanceMonitor {
  private frameCount = 0;
  private lastFrameTime = performance.now();
  private frameRates: number[] = [];
  private isMonitoring = false;
  private animationFrame?: number;
  
  constructor() {
    this.detectDeviceType = this.detectDeviceType.bind(this);
    this.measureFrameRate = this.measureFrameRate.bind(this);
  }
  
  /**
   * Detect device type for appropriate performance thresholds
   */
  detectDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (typeof window === 'undefined') return 'desktop';
    
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent);
    
    if (isMobile && !isTablet) return 'mobile';
    if (isTablet) return 'tablet';
    return 'desktop';
  }
  
  /**
   * Start monitoring frame rate during animations
   */
  startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.frameCount = 0;
    this.lastFrameTime = performance.now();
    this.frameRates = [];
    
    this.measureFrameRate();
  }
  
  /**
   * Stop monitoring and return results
   */
  stopMonitoring(): PerformanceMetrics {
    this.isMonitoring = false;
    
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    
    const avgFrameRate = this.frameRates.length > 0 
      ? this.frameRates.reduce((sum, rate) => sum + rate, 0) / this.frameRates.length
      : 60;
    
    const deviceType = this.detectDeviceType();
    const targetFPS = this.getTargetFPS(deviceType);
    
    return {
      frameRate: Math.round(avgFrameRate),
      layoutDuration: 0, // Set by caller
      memoryUsage: this.getMemoryUsage(),
      isOptimal: avgFrameRate >= targetFPS * 0.9, // 90% of target
      deviceType,
      batteryLevel: this.getBatteryLevel()
    };
  }
  
  /**
   * Measure frame rate continuously
   */
  private measureFrameRate() {
    if (!this.isMonitoring) return;
    
    this.frameCount++;
    const currentTime = performance.now();
    const elapsed = currentTime - this.lastFrameTime;
    
    // Calculate FPS every 1000ms
    if (elapsed >= 1000) {
      const fps = (this.frameCount * 1000) / elapsed;
      this.frameRates.push(fps);
      
      // Log performance warnings in development
      if (process.env.NODE_ENV === 'development' && fps < 55) {
        console.warn(`⚠️ Word cloud animation performance: ${fps.toFixed(1)}fps`);
      }
      
      this.frameCount = 0;
      this.lastFrameTime = currentTime;
      
      // Keep only last 10 measurements
      if (this.frameRates.length > 10) {
        this.frameRates.shift();
      }
    }
    
    this.animationFrame = requestAnimationFrame(this.measureFrameRate);
  }
  
  /**
   * Get target FPS based on device type
   */
  private getTargetFPS(deviceType: 'mobile' | 'tablet' | 'desktop'): number {
    switch (deviceType) {
      case 'mobile': return 30; // More forgiving for mobile
      case 'tablet': return 45;
      case 'desktop': return 60;
    }
  }
  
  /**
   * Get current memory usage (if available)
   */
  private getMemoryUsage(): number {
    if (typeof window === 'undefined') return 0;
    
    try {
      const memory = (performance as any).memory;
      return memory ? memory.usedJSHeapSize / 1024 / 1024 : 0; // MB
    } catch (error) {
      return 0;
    }
  }
  
  /**
   * Get battery level (if available)
   */
  private getBatteryLevel(): number | undefined {
    if (typeof window === 'undefined') return undefined;
    
    try {
      // Battery API is deprecated but still useful for optimization
      const battery = (navigator as any).battery;
      return battery ? battery.level * 100 : undefined;
    } catch (error) {
      return undefined;
    }
  }
}

/**
 * Optimize animation parameters based on device performance
 */
export function optimizeAnimationForDevice(
  deviceType: 'mobile' | 'tablet' | 'desktop',
  batteryLevel?: number
): {
  amplitude: { min: number; max: number };
  duration: { min: number; max: number };
  itemLimit: number;
  shouldReduceMotion: boolean;
} {
  // Reduce motion for low battery
  const lowBattery = batteryLevel !== undefined && batteryLevel < 20;
  
  switch (deviceType) {
    case 'mobile':
      return {
        amplitude: lowBattery ? { min: 2, max: 6 } : { min: 3, max: 10 },
        duration: lowBattery ? { min: 4, max: 8 } : { min: 4, max: 7 },
        itemLimit: 15, // Fewer items on mobile
        shouldReduceMotion: lowBattery
      };
      
    case 'tablet':
      return {
        amplitude: lowBattery ? { min: 3, max: 8 } : { min: 4, max: 14 },
        duration: lowBattery ? { min: 3, max: 7 } : { min: 3, max: 6 },
        itemLimit: 25,
        shouldReduceMotion: lowBattery
      };
      
    case 'desktop':
      return {
        amplitude: { min: 4, max: 16 }, // Full amplitude
        duration: { min: 3, max: 7 },
        itemLimit: 50, // Can handle more items
        shouldReduceMotion: false
      };
  }
}

/**
 * Measure layout algorithm performance
 */
export function measureLayoutPerformance<T>(
  layoutFunction: () => T,
  algorithmName: string,
  itemCount: number
): { result: T; metrics: Partial<PerformanceMetrics> } {
  const startTime = performance.now();
  const startMemory = (performance as any).memory?.usedJSHeapSize || 0;
  
  const result = layoutFunction();
  
  const endTime = performance.now();
  const endMemory = (performance as any).memory?.usedJSHeapSize || 0;
  
  const duration = endTime - startTime;
  const memoryIncrease = Math.max(0, endMemory - startMemory) / 1024 / 1024; // MB
  
  const metrics: Partial<PerformanceMetrics> = {
    layoutDuration: duration,
    memoryUsage: memoryIncrease,
    isOptimal: duration < 500 && memoryIncrease < 5 // < 500ms and < 5MB
  };
  
  // Log performance in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`${algorithmName} layout performance:`, {
      duration: `${duration.toFixed(2)}ms`,
      memoryIncrease: `${memoryIncrease.toFixed(2)}MB`,
      itemCount,
      isOptimal: metrics.isOptimal
    });
  }
  
  // Track analytics
  if (typeof window !== 'undefined' && (window as any).analytics) {
    (window as any).analytics.track('wordcloud_layout_performance', {
      algorithm: algorithmName,
      durationMs: duration,
      memoryMB: memoryIncrease,
      itemCount,
      isOptimal: metrics.isOptimal
    });
  }
  
  return { result, metrics };
}

/**
 * Debounce layout recalculations for better performance
 */
export function createDebouncedLayoutCalculator(
  layoutFunction: () => void,
  delay: number = 150
): () => void {
  let timeoutId: NodeJS.Timeout;
  
  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(layoutFunction, delay);
  };
}

/**
 * Memory-efficient word cloud item management
 */
export class WordCloudItemPool {
  private pool: HTMLElement[] = [];
  private inUse = new Set<HTMLElement>();
  private maxPoolSize: number;
  
  constructor(maxPoolSize: number = 50) {
    this.maxPoolSize = maxPoolSize;
  }
  
  /**
   * Get an element from the pool or create a new one
   */
  getElement(): HTMLElement {
    let element = this.pool.pop();
    
    if (!element) {
      element = document.createElement('button');
      element.className = 'word-cloud-button';
    }
    
    this.inUse.add(element);
    return element;
  }
  
  /**
   * Return an element to the pool
   */
  returnElement(element: HTMLElement) {
    if (!this.inUse.has(element)) return;
    
    this.inUse.delete(element);
    
    // Reset element state
    element.textContent = '';
    element.style.cssText = '';
    element.className = 'word-cloud-button';
    
    // Add to pool if not at capacity
    if (this.pool.length < this.maxPoolSize) {
      this.pool.push(element);
    }
  }
  
  /**
   * Clear the pool and free memory
   */
  clear() {
    this.pool.length = 0;
    this.inUse.clear();
  }
  
  /**
   * Get pool statistics
   */
  getStats() {
    return {
      poolSize: this.pool.length,
      inUse: this.inUse.size,
      total: this.pool.length + this.inUse.size
    };
  }
}

/**
 * Intersection observer for efficient animation management
 */
export function createAnimationIntersectionObserver(
  callback: (isVisible: boolean) => void,
  rootMargin: string = '50px'
): IntersectionObserver {
  return new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        callback(entry.isIntersecting);
      });
    },
    {
      rootMargin,
      threshold: 0.1
    }
  );
}

/**
 * Adaptive quality controller based on performance
 */
export class AdaptiveQualityController {
  private performanceHistory: number[] = [];
  private currentQualityLevel = 3; // 1 (low) to 5 (high)
  
  /**
   * Update performance history and adjust quality
   */
  updatePerformance(frameRate: number, targetFPS: number = 60) {
    this.performanceHistory.push(frameRate);
    
    // Keep only last 10 measurements
    if (this.performanceHistory.length > 10) {
      this.performanceHistory.shift();
    }
    
    const avgFPS = this.performanceHistory.reduce((sum, fps) => sum + fps, 0) / this.performanceHistory.length;
    const performanceRatio = avgFPS / targetFPS;
    
    // Adjust quality based on performance
    if (performanceRatio < 0.7) { // < 70% of target
      this.currentQualityLevel = Math.max(1, this.currentQualityLevel - 1);
    } else if (performanceRatio > 0.95) { // > 95% of target
      this.currentQualityLevel = Math.min(5, this.currentQualityLevel + 1);
    }
    
    // Log quality changes in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Animation quality level: ${this.currentQualityLevel}/5 (FPS: ${avgFPS.toFixed(1)})`);
    }
  }
  
  /**
   * Get optimized animation parameters for current quality level
   */
  getAnimationParams() {
    switch (this.currentQualityLevel) {
      case 1: // Low quality
        return {
          amplitude: { min: 2, max: 6 },
          duration: { min: 5, max: 8 },
          itemLimit: 10
        };
      case 2:
        return {
          amplitude: { min: 3, max: 8 },
          duration: { min: 4, max: 7 },
          itemLimit: 15
        };
      case 3: // Medium quality
        return {
          amplitude: { min: 4, max: 12 },
          duration: { min: 3, max: 6 },
          itemLimit: 25
        };
      case 4:
        return {
          amplitude: { min: 4, max: 14 },
          duration: { min: 3, max: 7 },
          itemLimit: 35
        };
      case 5: // High quality
        return {
          amplitude: { min: 4, max: 16 },
          duration: { min: 3, max: 7 },
          itemLimit: 50
        };
    }
  }
  
  /**
   * Get current quality level
   */
  getQualityLevel(): number {
    return this.currentQualityLevel;
  }
}