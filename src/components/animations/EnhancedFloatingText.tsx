'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface EnhancedFloatingTextProps {
  children: React.ReactNode;
  amplitude?: { min: number; max: number }; // pixels
  duration?: { min: number; max: number }; // seconds
  delay?: { min: number; max: number }; // seconds
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  forceReduceMotion?: boolean; // Override for performance optimization
}

/**
 * Enhanced floating text with 4-16px amplitude and reduced motion compliance
 */
export function EnhancedFloatingText({
  children,
  amplitude = { min: 4, max: 16 },
  duration = { min: 3, max: 7 },
  delay = { min: 0, max: 1 },
  className = '',
  as = 'span',
  forceReduceMotion = false
}: EnhancedFloatingTextProps) {
  const prefersReducedMotion = useReducedMotion();
  
  // Generate stable random values that won't change on re-renders
  const animationProps = useMemo(() => {
    // Create deterministic "random" values based on children content
    const seed = typeof children === 'string' ? children.length : Math.random();
    const random1 = Math.sin(seed * 12.9898) * 43758.5453;
    const random2 = Math.sin(seed * 78.233) * 43758.5453;
    const random3 = Math.sin(seed * 39.7834) * 43758.5453;
    const random4 = Math.sin(seed * 17.6543) * 43758.5453;
    
    // Normalize to 0-1 range
    const norm1 = Math.abs(random1 - Math.floor(random1));
    const norm2 = Math.abs(random2 - Math.floor(random2));
    const norm3 = Math.abs(random3 - Math.floor(random3));
    const norm4 = Math.abs(random4 - Math.floor(random4));
    
    // Calculate animation parameters
    const xAmplitude = amplitude.min + norm1 * (amplitude.max - amplitude.min);
    const yAmplitude = amplitude.min + norm2 * (amplitude.max - amplitude.min);
    const animDuration = duration.min + norm3 * (duration.max - duration.min);
    const animDelay = delay.min + norm4 * (delay.max - delay.min);
    
    return {
      x: [
        0,
        xAmplitude * (norm1 > 0.5 ? 1 : -1),
        0,
        xAmplitude * (norm2 > 0.5 ? -1 : 1),
        0
      ],
      y: [
        0,
        yAmplitude * (norm2 > 0.5 ? 1 : -1),
        0,
        yAmplitude * (norm1 > 0.5 ? -1 : 1),
        0
      ],
      rotate: [
        0,
        2 * (norm3 > 0.5 ? 1 : -1),
        0,
        1.5 * (norm4 > 0.5 ? -1 : 1),
        0
      ],
      scale: [
        1,
        1 + 0.02 * norm4, // Very subtle breathing effect
        1,
        1 + 0.015 * norm3,
        1
      ],
      transition: {
        duration: animDuration,
        delay: animDelay,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop" as const
      }
    };
  }, [amplitude, duration, delay, children]);
  
  // Return static version for users who prefer reduced motion or when forced
  if (prefersReducedMotion || forceReduceMotion) {
    const Element = as;
    return (
      <Element className={className}>
        {children}
      </Element>
    );
  }
  
  // Return animated version
  const MotionElement = motion(as as keyof JSX.IntrinsicElements);
  
  return (
    <MotionElement
      {...(className && { className })}
      animate={animationProps}
      style={{
        display: 'inline-block',
        willChange: 'transform', // Optimize for animations
        backfaceVisibility: 'hidden' // Prevent flickering
      }}
    >
      {children}
    </MotionElement>
  );
}

/**
 * Staggered floating text for multiple items
 */
export function StaggeredFloatingText({
  items,
  className = '',
  itemClassName = '',
  staggerDelay = 0.1 // seconds between each item start
}: {
  items: React.ReactNode[];
  className?: string;
  itemClassName?: string;
  staggerDelay?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    return (
      <div className={className}>
        {items.map((item, index) => (
          <span key={index} className={itemClassName}>
            {item}
          </span>
        ))}
      </div>
    );
  }
  
  return (
    <div className={className}>
      {items.map((item, index) => (
        <EnhancedFloatingText
          key={index}
          delay={{ min: index * staggerDelay, max: index * staggerDelay + 0.5 }}
          className={itemClassName}
        >
          {item}
        </EnhancedFloatingText>
      ))}
    </div>
  );
}

/**
 * Floating text with hover pause functionality
 */
export function InteractiveFloatingText({
  children,
  amplitude = { min: 4, max: 16 },
  duration = { min: 3, max: 7 },
  delay = { min: 0, max: 1 },
  className = '',
  pauseOnHover = true
}: EnhancedFloatingTextProps & { pauseOnHover?: boolean }) {
  const [isPaused, setIsPaused] = React.useState(false);
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    return (
      <span className={className}>
        {children}
      </span>
    );
  }
  
  const handleMouseEnter = () => {
    if (pauseOnHover) setIsPaused(true);
  };
  
  const handleMouseLeave = () => {
    if (pauseOnHover) setIsPaused(false);
  };
  
  return (
    <motion.span
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={isPaused ? {} : {
        x: [0, amplitude.max * 0.5, 0],
        y: [0, amplitude.max * 0.5, 0],
        rotate: [0, 2, 0]
      }}
      transition={{
        duration: duration.min + 1,
        delay: delay.min,
        ease: "easeInOut",
        repeat: isPaused ? 0 : Infinity
      }}
      style={{
        display: 'inline-block',
        willChange: 'transform',
        backfaceVisibility: 'hidden'
      }}
    >
      {children}
    </motion.span>
  );
}

/**
 * Floating text optimized for performance with minimal DOM updates
 */
export function PerformantFloatingText({
  children,
  amplitude = { min: 6, max: 12 },
  duration = { min: 4, max: 6 },
  className = ''
}: {
  children: React.ReactNode;
  amplitude?: { min: number; max: number };
  duration?: { min: number; max: number };
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    return (
      <span className={className}>
        {children}
      </span>
    );
  }
  
  // Simpler animation for better performance
  return (
    <motion.span
      className={className}
      animate={{
        y: [0, -amplitude.max * 0.5, 0, amplitude.max * 0.5, 0],
        x: [0, amplitude.max * 0.3, 0, -amplitude.max * 0.3, 0]
      }}
      transition={{
        duration: duration.min + Math.random() * (duration.max - duration.min),
        ease: "easeInOut",
        repeat: Infinity,
        delay: Math.random() * 2
      }}
      style={{
        display: 'inline-block',
        transform: 'translateZ(0)', // Force hardware acceleration
        willChange: 'transform'
      }}
    >
      {children}
    </motion.span>
  );
}

/**
 * Hook for tracking floating animation performance
 */
export function useFloatingAnimationMetrics() {
  const [metrics, setMetrics] = React.useState({
    frameRate: 0,
    isOptimal: true,
    reducedMotionEnabled: false
  });
  
  const prefersReducedMotion = useReducedMotion();
  
  React.useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;
    
    const measureFrameRate = () => {
      frameCount++;
      const currentTime = performance.now();
      
      // Calculate FPS every second
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        setMetrics({
          frameRate: fps,
          isOptimal: fps >= 55, // Target 60fps with some tolerance
          reducedMotionEnabled: prefersReducedMotion
        });
        
        frameCount = 0;
        lastTime = currentTime;
        
        // Log performance warnings in development
        if (process.env.NODE_ENV === 'development' && fps < 55) {
          console.warn(`⚠️ Floating animation performance: ${fps}fps (target: 60fps)`);
        }
      }
      
      animationId = requestAnimationFrame(measureFrameRate);
    };
    
    if (!prefersReducedMotion) {
      animationId = requestAnimationFrame(measureFrameRate);
    }
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [prefersReducedMotion]);
  
  return metrics;
}