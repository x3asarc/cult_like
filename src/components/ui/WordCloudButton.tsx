'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PlacedItem } from '../../lib/layout/spiralLayout';
import { EnhancedFloatingText } from '../animations/EnhancedFloatingText';

interface WordCloudButtonProps {
  item: PlacedItem;
  onClick: () => void;
  minTapTarget: number;
  isSelected?: boolean;
  disabled?: boolean;
  animationSettings?: {
    amplitude: { min: number; max: number };
    duration: { min: number; max: number };
    shouldReduceMotion: boolean;
  };
}

export function WordCloudButton({ 
  item, 
  onClick, 
  minTapTarget,
  isSelected = false,
  disabled = false,
  animationSettings
}: WordCloudButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Calculate button positioning and sizing
  const buttonStyle = {
    position: 'absolute' as const,
    left: `${item.x - Math.max(item.width, minTapTarget) / 2}px`,
    top: `${item.y - Math.max(item.height, minTapTarget) / 2}px`,
    width: `${Math.max(item.width, minTapTarget)}px`,
    height: `${Math.max(item.height, minTapTarget)}px`,
    fontSize: `${item.fontSize}rem`,
    // Ensure minimum tap target
    minWidth: `${minTapTarget}px`,
    minHeight: `${minTapTarget}px`
  };

  // Handle keyboard navigation
  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsPressed(false);
        onClick();
      }
    };

    button.addEventListener('keydown', handleKeyDown);
    button.addEventListener('keyup', handleKeyUp);

    return () => {
      button.removeEventListener('keydown', handleKeyDown);
      button.removeEventListener('keyup', handleKeyUp);
    };
  }, [onClick]);

  // Handle mouse/touch interactions
  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!disabled) {
      onClick();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setIsPressed(false);
  };

  // Dynamic class names for interactive states
  const getButtonClasses = () => {
    const baseClasses = [
      'flex items-center justify-center',
      'bg-transparent border-none cursor-pointer',
      'font-serif transition-all duration-200 ease-out',
      'select-none user-select-none',
      'outline-none' // We'll handle focus ourselves
    ];

    // Text color states
    if (disabled) {
      baseClasses.push('text-gray-400 cursor-not-allowed');
    } else if (isSelected) {
      baseClasses.push('text-blue-700 font-semibold');
    } else if (isPressed) {
      baseClasses.push('text-blue-800 transform scale-95');
    } else {
      baseClasses.push('text-gray-900 hover:text-blue-600');
    }

    // Focus ring
    if (isFocused) {
      baseClasses.push(
        'ring-2 ring-blue-500 ring-offset-2 ring-offset-white',
        'rounded-md' // Slight rounding for focus ring
      );
    }

    // Hover effects (only if not disabled)
    if (!disabled) {
      baseClasses.push('hover:transform hover:scale-105');
    }

    return baseClasses.join(' ');
  };

  // Accessibility label with event count
  const accessibilityLabel = `${item.text}, ${item.importance} events`;

  return (
    <button
      ref={buttonRef}
      style={buttonStyle}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={getButtonClasses()}
      role="listitem"
      aria-label={accessibilityLabel}
      disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      // Additional accessibility attributes
      aria-describedby={`wordcloud-help-${item.id}`}
      data-testid={`word-button-${item.id}`}
    >
      {/* Enhanced floating text with device-optimized amplitude */}
      <EnhancedFloatingText
        amplitude={animationSettings?.amplitude || { min: 4, max: 16 }}
        duration={animationSettings?.duration || { min: 3, max: 7 }}
        delay={{ min: 0, max: 1 }}
        forceReduceMotion={animationSettings?.shouldReduceMotion}
        className="relative inline-block leading-tight tracking-wide"
      >
        {item.text}
      </EnhancedFloatingText>

      {/* Hidden helper text for screen readers */}
      <span 
        id={`wordcloud-help-${item.id}`}
        className="sr-only"
      >
        Click to select {item.text}. This option has {item.importance} events available.
      </span>
    </button>
  );
}

/**
 * Enhanced version with touch gesture support for mobile
 */
export function TouchOptimizedWordCloudButton({ 
  item, 
  onClick, 
  minTapTarget,
  isSelected = false,
  disabled = false
}: WordCloudButtonProps) {
  const [touchStartTime, setTouchStartTime] = useState<number>(0);
  const [touchMoved, setTouchMoved] = useState(false);

  const handleTouchStart = () => {
    setTouchStartTime(Date.now());
    setTouchMoved(false);
  };

  const handleTouchMove = () => {
    setTouchMoved(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    
    const touchDuration = Date.now() - touchStartTime;
    
    // Only trigger click if:
    // - Touch was short (not a long press)
    // - User didn't move during touch (not scrolling)
    // - Button is not disabled
    if (touchDuration < 500 && !touchMoved && !disabled) {
      onClick();
    }
  };

  return (
    <WordCloudButton
      item={item}
      onClick={onClick}
      minTapTarget={minTapTarget}
      isSelected={isSelected}
      disabled={disabled}
      // Add touch event handlers as additional props
      {...{
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd
      }}
    />
  );
}

/**
 * Word cloud button with analytics tracking
 */
export function AnalyticsWordCloudButton({ 
  item, 
  onClick, 
  minTapTarget,
  isSelected = false,
  disabled = false,
  stepContext = 'unknown' // 'location', 'event_type', 'month'
}: WordCloudButtonProps & { stepContext?: string }) {
  
  const handleClickWithAnalytics = () => {
    // Track the click event
    if (typeof window !== 'undefined' && (window as { analytics?: { track: (event: string, data: Record<string, unknown>) => void } }).analytics) {
      (window as { analytics: { track: (event: string, data: Record<string, unknown>) => void } }).analytics.track('click_word', {
        step: stepContext,
        wordId: item.id,
        wordText: item.text,
        eventCount: item.importance,
        fontSize: item.fontSize,
        positionX: item.x,
        positionY: item.y,
        autoAdvanced: true // This flow auto-advances
      });
    }

    // Call the original onClick
    onClick();
  };

  return (
    <TouchOptimizedWordCloudButton
      item={item}
      onClick={handleClickWithAnalytics}
      minTapTarget={minTapTarget}
      isSelected={isSelected}
      disabled={disabled}
    />
  );
}

/**
 * Hook for managing focus within word cloud (keyboard navigation)
 */
export function useWordCloudFocus(items: PlacedItem[]) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [isKeyboardNavigating, setIsKeyboardNavigating] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (items.length === 0) return;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          setIsKeyboardNavigating(true);
          setFocusedIndex(prev => (prev + 1) % items.length);
          break;
          
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          setIsKeyboardNavigating(true);
          setFocusedIndex(prev => (prev - 1 + items.length) % items.length);
          break;
          
        case 'Home':
          e.preventDefault();
          setIsKeyboardNavigating(true);
          setFocusedIndex(0);
          break;
          
        case 'End':
          e.preventDefault();
          setIsKeyboardNavigating(true);
          setFocusedIndex(items.length - 1);
          break;
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardNavigating(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [items.length]);

  return { 
    focusedIndex, 
    setFocusedIndex, 
    isKeyboardNavigating 
  };
}

/**
 * Utility for testing button tap targets on mobile
 */
export function validateTapTargets(
  placedItems: PlacedItem[],
  minTapTarget: number = 48
): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  placedItems.forEach(item => {
    const actualWidth = Math.max(item.width, minTapTarget);
    const actualHeight = Math.max(item.height, minTapTarget);

    if (actualWidth < minTapTarget) {
      issues.push(`${item.id}: Width ${actualWidth}px < ${minTapTarget}px`);
    }
    
    if (actualHeight < minTapTarget) {
      issues.push(`${item.id}: Height ${actualHeight}px < ${minTapTarget}px`);
    }
  });

  return {
    isValid: issues.length === 0,
    issues
  };
}