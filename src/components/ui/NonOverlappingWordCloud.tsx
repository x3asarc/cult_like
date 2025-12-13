'use client';

import React, { useRef, useLayoutEffect, useState, useMemo, useEffect } from 'react';
import { WordCloudButton } from './WordCloudButton';
import { 
  spiralLayout, 
  calculateFontSizes,
  measureLayoutPerformance,
  validateNoOverlaps,
  type PlacedItem
} from '../../lib/layout/spiralLayout';
import { 
  forceDirectedLayout, 
  hybridLayout 
} from '../../lib/layout/forceLayout';
import { 
  WordCloudPerformanceMonitor,
  optimizeAnimationForDevice,
  createDebouncedLayoutCalculator,
  measureLayoutPerformance as measurePerformanceUtil,
  type PerformanceMetrics
} from '../../lib/performance/wordCloudOptimizer';
import { selectOptimalAlgorithm } from '../../lib/layout/forceLayout';

export interface WordCloudItem {
  id: string;
  text: string;
  value: number; // for sizing (event count, importance, etc.)
}

export interface NonOverlappingWordCloudProps {
  items: WordCloudItem[];
  onItemClick: (id: string) => void;
  fontSizeRange: { min: number; max: number };
  algorithm?: 'spiral' | 'force-directed' | 'hybrid' | 'auto';
  minTapTarget?: number; // pixels
  minSpacing?: number; // pixels
  containerClassName?: string;
  showLegend?: boolean;
  legendText?: string;
  ariaLabel?: string;
  isLoading?: boolean;
}

export function NonOverlappingWordCloud({
  items,
  onItemClick,
  fontSizeRange,
  algorithm = 'auto',
  minTapTarget = 48,
  minSpacing = 8,
  containerClassName = '',
  showLegend = true,
  legendText = 'Larger words mean more events',
  ariaLabel = 'Interactive word cloud',
  isLoading = false
}: NonOverlappingWordCloudProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [isLayoutComplete, setIsLayoutComplete] = useState(false);
  const [layoutError, setLayoutError] = useState<string | null>(null);
  const [layoutStats, setLayoutStats] = useState<{
    algorithm: string;
    duration: number;
    hasOverlaps: boolean;
    placedCount: number;
    totalCount: number;
  } | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const performanceMonitorRef = useRef<WordCloudPerformanceMonitor | null>(null);

  // Calculate font sizes and dimensions for items
  const itemsWithSizes = useMemo(() => {
    if (items.length === 0) return [];
    
    return calculateFontSizes(items, fontSizeRange, minTapTarget);
  }, [items, fontSizeRange, minTapTarget]);

  // Initialize performance monitor
  useEffect(() => {
    if (!performanceMonitorRef.current) {
      performanceMonitorRef.current = new WordCloudPerformanceMonitor();
    }
    
    // Start monitoring when items are rendered
    if (placedItems.length > 0 && isLayoutComplete) {
      performanceMonitorRef.current.startMonitoring();
      
      // Stop monitoring after 5 seconds and record metrics
      const timeout = setTimeout(() => {
        if (performanceMonitorRef.current) {
          const metrics = performanceMonitorRef.current.stopMonitoring();
          setPerformanceMetrics(metrics);
        }
      }, 5000);
      
      return () => clearTimeout(timeout);
    }
  }, [placedItems, isLayoutComplete]);

  // Device-specific optimization
  const animationSettings = useMemo(() => {
    if (!performanceMetrics) {
      return optimizeAnimationForDevice('desktop'); // Default
    }
    
    return optimizeAnimationForDevice(
      performanceMetrics.deviceType, 
      performanceMetrics.batteryLevel
    );
  }, [performanceMetrics]);

  // Determine optimal algorithm if set to 'auto'
  const selectedAlgorithm = useMemo(() => {
    if (algorithm !== 'auto') return algorithm;
    
    if (!containerRef.current) return 'spiral'; // Default fallback
    
    const containerArea = containerRef.current.offsetWidth * containerRef.current.offsetHeight;
    return selectOptimalAlgorithm(items.length, containerArea);
  }, [algorithm, items.length]);

  // Layout calculation
  useLayoutEffect(() => {
    if (!containerRef.current || itemsWithSizes.length === 0) {
      setIsLayoutComplete(true);
      return;
    }

    setIsLayoutComplete(false);
    setLayoutError(null);

    const performLayout = () => {
      const containerBounds = containerRef.current!.getBoundingClientRect();
      const bounds = {
        width: containerBounds.width,
        height: containerBounds.height,
        center: { 
          x: containerBounds.width / 2, 
          y: containerBounds.height / 2 
        }
      };

      try {
        let layoutFunction: () => PlacedItem[];
        let algorithmName = selectedAlgorithm;

        switch (selectedAlgorithm) {
          case 'spiral':
            layoutFunction = () => spiralLayout(itemsWithSizes, bounds, minSpacing);
            break;
          case 'force-directed':
            layoutFunction = () => forceDirectedLayout(itemsWithSizes, bounds, minSpacing);
            break;
          case 'hybrid':
            layoutFunction = () => hybridLayout(itemsWithSizes, bounds, minSpacing);
            algorithmName = 'hybrid';
            break;
          default:
            layoutFunction = () => spiralLayout(itemsWithSizes, bounds, minSpacing);
            algorithmName = 'spiral';
        }

        const { result: positioned, metrics } = measurePerformanceUtil(
          layoutFunction,
          algorithmName,
          itemsWithSizes.length
        );
        const durationMs = metrics.layoutDuration || 0;

        // Validate final layout
        const validation = validateNoOverlaps(positioned, minSpacing);
        
        if (validation.hasOverlaps) {
          console.error('Layout validation failed:', validation.overlapping);
        }

        setPlacedItems(positioned);
        setLayoutStats({
          algorithm: algorithmName,
          duration: durationMs,
          hasOverlaps: validation.hasOverlaps,
          placedCount: positioned.length,
          totalCount: itemsWithSizes.length
        });

        if (positioned.length < itemsWithSizes.length) {
          setLayoutError(`Could only place ${positioned.length} of ${itemsWithSizes.length} items`);
        }

      } catch (error) {
        console.error('Layout algorithm failed:', error);
        setLayoutError(error instanceof Error ? error.message : 'Layout failed');
      }

      setIsLayoutComplete(true);
    };

    // Use requestAnimationFrame to ensure container is properly rendered
    const timeoutId = setTimeout(performLayout, 10);
    return () => clearTimeout(timeoutId);
  }, [itemsWithSizes, selectedAlgorithm, minSpacing]);

  // Handle window resize
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const handleResize = () => {
      // Debounce resize events
      const timeoutId = setTimeout(() => {
        if (itemsWithSizes.length > 0) {
          setIsLayoutComplete(false);
        }
      }, 150);

      return () => clearTimeout(timeoutId);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [itemsWithSizes.length]);

  if (isLoading) {
    return (
      <div 
        className={`relative w-full min-h-[400px] flex items-center justify-center ${containerClassName}`}
        aria-label="Loading word cloud"
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="text-gray-600">Arranging words...</span>
        </div>
      </div>
    );
  }

  if (layoutError) {
    return (
      <div 
        className={`relative w-full min-h-[400px] flex items-center justify-center ${containerClassName}`}
        role="alert"
        aria-label="Word cloud error"
      >
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to arrange words</p>
          <p className="text-sm text-gray-500">{layoutError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${containerClassName}`}>
      {/* Main word cloud container */}
      <div 
        ref={containerRef}
        className="relative w-full min-h-[400px] overflow-hidden"
        role="list"
        aria-label={ariaLabel}
      >
        {isLayoutComplete && placedItems.map(item => (
          <WordCloudButton
            key={item.id}
            item={item}
            onClick={() => onItemClick(item.id)}
            minTapTarget={minTapTarget}
            animationSettings={animationSettings}
          />
        ))}
        
        {!isLayoutComplete && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
              <span>Arranging words...</span>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      {showLegend && legendText && isLayoutComplete && (
        <p className="text-center mt-4 text-sm text-gray-600" aria-hidden="true">
          {legendText}
        </p>
      )}

      {/* Debug information (development only) */}
      {process.env.NODE_ENV === 'development' && layoutStats && (
        <details className="mt-4 text-xs text-gray-500">
          <summary className="cursor-pointer">Layout Debug Info</summary>
          <div className="mt-2 space-y-1">
            <p>Algorithm: {layoutStats.algorithm}</p>
            <p>Duration: {layoutStats.duration.toFixed(2)}ms</p>
            <p>Items placed: {layoutStats.placedCount}/{layoutStats.totalCount}</p>
            <p>Has overlaps: {layoutStats.hasOverlaps ? '⚠️ Yes' : '✅ No'}</p>
            <p>Container: {containerRef.current?.offsetWidth}×{containerRef.current?.offsetHeight}px</p>
            {performanceMetrics && (
              <>
                <p>FPS: {performanceMetrics.frameRate} (Target: 60)</p>
                <p>Device: {performanceMetrics.deviceType}</p>
                <p>Memory: {performanceMetrics.memoryUsage?.toFixed(2)}MB</p>
                <p>Performance: {performanceMetrics.isOptimal ? '✅ Optimal' : '⚠️ Below Target'}</p>
                {performanceMetrics.batteryLevel && (
                  <p>Battery: {performanceMetrics.batteryLevel.toFixed(0)}%</p>
                )}
                <p>Animation Settings:</p>
                <p className="ml-2">- Amplitude: {animationSettings.amplitude.min}-{animationSettings.amplitude.max}px</p>
                <p className="ml-2">- Duration: {animationSettings.duration.min}-{animationSettings.duration.max}s</p>
                <p className="ml-2">- Item limit: {animationSettings.itemLimit}</p>
                <p className="ml-2">- Reduced motion: {animationSettings.shouldReduceMotion ? '✅' : '❌'}</p>
              </>
            )}
          </div>
        </details>
      )}
    </div>
  );
}

/**
 * Simplified word cloud for cases where you just want quick, collision-free layout
 */
export function SimpleWordCloud({
  items,
  onItemClick,
  className = ''
}: {
  items: WordCloudItem[];
  onItemClick: (id: string) => void;
  className?: string;
}) {
  return (
    <NonOverlappingWordCloud
      items={items}
      onItemClick={onItemClick}
      fontSizeRange={{ min: 1.1, max: 2.4 }}
      algorithm="auto"
      minTapTarget={48}
      minSpacing={8}
      containerClassName={className}
      showLegend={true}
      legendText="Larger words mean more events"
      ariaLabel="Choose from available options"
    />
  );
}

/**
 * Hook for tracking word cloud performance metrics
 */
export function useWordCloudMetrics() {
  const [metrics, setMetrics] = useState<{
    layoutDuration: number;
    hasOverlaps: boolean;
    algorithmUsed: string;
    itemsPlaced: number;
    totalItems: number;
  } | null>(null);

  const recordMetrics = (stats: {
    algorithm: string;
    duration: number;
    hasOverlaps: boolean;
    placedCount: number;
    totalCount: number;
  }) => {
    setMetrics({
      layoutDuration: stats.duration,
      hasOverlaps: stats.hasOverlaps,
      algorithmUsed: stats.algorithm,
      itemsPlaced: stats.placedCount,
      totalItems: stats.totalCount
    });

    // Log to analytics if available
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('wordcloud_layout_complete', {
        algorithm: stats.algorithm,
        layoutDurationMs: stats.duration,
        hasOverlaps: stats.hasOverlaps,
        itemCount: stats.totalCount,
        placedCount: stats.placedCount,
        successRate: (stats.placedCount / stats.totalCount) * 100
      });
    }
  };

  return { metrics, recordMetrics };
}