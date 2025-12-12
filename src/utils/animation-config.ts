export const ANIMATION_CONFIG = {
  // Base floating movement
  FLOAT_DURATION: 8,
  FLOAT_RANGE: {
    x: [-1, 2],
    y: [-2, 2],
    rotation: [-0.5, 0.5],
    scale: [0.99, 1.01]
  },
  
  // Hover interactions
  HOVER_SCALE: 1.05,
  HOVER_DURATION: 0.3,
  
  // Performance optimizations
  WILL_CHANGE: 'transform',
  
  // Accessibility
  REDUCED_MOTION_THRESHOLD: '(prefers-reduced-motion: reduce)',
  
  // Delays for staggered animations
  STAGGER_DELAY: 0.1,
  
  // Easing functions
  EASE: "easeInOut"
} as const