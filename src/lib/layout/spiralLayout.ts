/**
 * Spiral Layout Algorithm for Collision-Free Word Cloud Placement
 * 
 * Places words in a spiral pattern starting from center, ensuring no overlaps
 * and maintaining minimum tap targets (48px) and spacing (8px) requirements.
 */

export interface WordItem {
  id: string;
  text: string;
  fontSize: number;
  importance: number; // for sorting priority
  width: number;
  height: number;
}

export interface PlacedItem extends WordItem {
  x: number;
  y: number;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ContainerBounds {
  width: number;
  height: number;
  center: { x: number; y: number };
}

interface SpiralConfig {
  minSpacing: number;
  maxRadius: number;
  angleIncrement: number;
  radiusIncrement: number;
}

const DEFAULT_SPIRAL_CONFIG: SpiralConfig = {
  minSpacing: 8, // 8px minimum spacing
  maxRadius: 500, // Maximum spiral radius before giving up
  angleIncrement: 0.1, // Radians per spiral step
  radiusIncrement: 5 // Pixels per spiral increment
};

/**
 * Check if two bounding boxes intersect with minimum spacing
 */
function hasCollision(
  bounds1: Bounds, 
  bounds2: Bounds, 
  minSpacing: number = 0
): boolean {
  const expandedBounds1 = {
    x: bounds1.x - minSpacing,
    y: bounds1.y - minSpacing,
    width: bounds1.width + minSpacing * 2,
    height: bounds1.height + minSpacing * 2
  };

  return !(
    expandedBounds1.x + expandedBounds1.width < bounds2.x ||
    bounds2.x + bounds2.width < expandedBounds1.x ||
    expandedBounds1.y + expandedBounds1.height < bounds2.y ||
    bounds2.y + bounds2.height < expandedBounds1.y
  );
}

/**
 * Check if a bounding box collides with any placed items
 */
function hasCollisionWithPlaced(
  candidateBounds: Bounds,
  placedItems: PlacedItem[],
  minSpacing: number
): boolean {
  return placedItems.some(item => {
    const itemBounds = {
      x: item.x - item.width / 2,
      y: item.y - item.height / 2,
      width: item.width,
      height: item.height
    };
    return hasCollision(candidateBounds, itemBounds, minSpacing);
  });
}

/**
 * Check if bounding box is within container bounds
 */
function isWithinContainer(bounds: Bounds, container: ContainerBounds): boolean {
  return (
    bounds.x >= 0 &&
    bounds.y >= 0 &&
    bounds.x + bounds.width <= container.width &&
    bounds.y + bounds.height <= container.height
  );
}

/**
 * Find a collision-free position for an item using spiral placement
 */
function findNonCollidingPosition(
  item: WordItem,
  placedItems: PlacedItem[],
  container: ContainerBounds,
  config: SpiralConfig
): { x: number; y: number } | null {
  let radius = 0;
  let angle = 0;
  const startCenter = container.center;

  // Try center position first
  const centerBounds = {
    x: startCenter.x - item.width / 2,
    y: startCenter.y - item.height / 2,
    width: item.width,
    height: item.height
  };

  if (
    !hasCollisionWithPlaced(centerBounds, placedItems, config.minSpacing) &&
    isWithinContainer(centerBounds, container)
  ) {
    return startCenter;
  }

  // Spiral outward from center
  while (radius < config.maxRadius) {
    const x = startCenter.x + radius * Math.cos(angle);
    const y = startCenter.y + radius * Math.sin(angle);

    const candidateBounds = {
      x: x - item.width / 2,
      y: y - item.height / 2,
      width: item.width,
      height: item.height
    };

    if (
      isWithinContainer(candidateBounds, container) &&
      !hasCollisionWithPlaced(candidateBounds, placedItems, config.minSpacing)
    ) {
      return { x, y };
    }

    // Move along spiral
    angle += config.angleIncrement;
    radius += config.radiusIncrement * (angle / (2 * Math.PI));
  }

  // Could not place item without collision
  return null;
}

/**
 * Validate all placed items have no overlaps (for testing)
 */
export function validateNoOverlaps(
  placedItems: PlacedItem[], 
  minSpacing: number = 8
): { hasOverlaps: boolean; overlapping: string[] } {
  const overlapping: string[] = [];

  for (let i = 0; i < placedItems.length; i++) {
    for (let j = i + 1; j < placedItems.length; j++) {
      const item1 = placedItems[i];
      const item2 = placedItems[j];

      const bounds1 = {
        x: item1.x - item1.width / 2,
        y: item1.y - item1.height / 2,
        width: item1.width,
        height: item1.height
      };

      const bounds2 = {
        x: item2.x - item2.width / 2,
        y: item2.y - item2.height / 2,
        width: item2.width,
        height: item2.height
      };

      if (hasCollision(bounds1, bounds2, minSpacing)) {
        overlapping.push(`${item1.id} overlaps with ${item2.id}`);
      }
    }
  }

  return {
    hasOverlaps: overlapping.length > 0,
    overlapping
  };
}

/**
 * Main spiral layout function
 * Places items in order of importance, spiraling out from center
 */
export function spiralLayout(
  items: WordItem[],
  containerBounds: ContainerBounds,
  minSpacing: number = 8
): PlacedItem[] {
  const config: SpiralConfig = {
    ...DEFAULT_SPIRAL_CONFIG,
    minSpacing
  };

  // Sort by importance (highest first)
  const sortedItems = [...items].sort((a, b) => b.importance - a.importance);
  
  const placedItems: PlacedItem[] = [];
  const failedPlacements: string[] = [];

  for (const item of sortedItems) {
    const position = findNonCollidingPosition(
      item, 
      placedItems, 
      containerBounds, 
      config
    );

    if (position) {
      placedItems.push({
        ...item,
        x: position.x,
        y: position.y
      });
    } else {
      failedPlacements.push(item.id);
      console.warn(`Could not place item without collision: ${item.id}`);
    }
  }

  // Log placement results
  const validation = validateNoOverlaps(placedItems, minSpacing);
  console.log('Spiral Layout Results:', {
    totalItems: items.length,
    placedItems: placedItems.length,
    failedPlacements: failedPlacements.length,
    hasOverlaps: validation.hasOverlaps,
    overlapping: validation.overlapping
  });

  if (validation.hasOverlaps) {
    console.error('CRITICAL: Spiral layout produced overlapping items!', validation.overlapping);
  }

  return placedItems;
}

/**
 * Calculate optimal font sizes for items based on importance/value
 */
export function calculateFontSizes(
  items: { id: string; value: number; text: string }[],
  fontSizeRange: { min: number; max: number },
  minTapTarget: number = 48
): WordItem[] {
  const values = items.map(item => item.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue || 1; // Prevent division by zero

  return items.map(item => {
    // Normalize value to 0-1 range
    const normalizedValue = (item.value - minValue) / valueRange;
    
    // Calculate font size
    const fontSize = fontSizeRange.min + normalizedValue * (fontSizeRange.max - fontSizeRange.min);
    
    // Estimate text dimensions (rough approximation)
    // This is a simplified calculation - in practice you'd measure actual text
    const charWidth = fontSize * 0.6; // Approximate character width
    const textWidth = item.text.length * charWidth;
    const textHeight = fontSize * 1.2; // Line height
    
    // Ensure minimum tap target size
    const width = Math.max(textWidth, minTapTarget);
    const height = Math.max(textHeight, minTapTarget);
    
    return {
      id: item.id,
      text: item.text,
      fontSize,
      importance: item.value, // Use value as importance
      width,
      height
    };
  });
}

/**
 * Performance monitoring for layout algorithm
 */
export function measureLayoutPerformance<T>(
  layoutFunction: () => T,
  algorithmName: string = 'spiral'
): { result: T; durationMs: number } {
  const startTime = performance.now();
  const result = layoutFunction();
  const endTime = performance.now();
  const durationMs = endTime - startTime;
  
  console.log(`${algorithmName} layout completed in ${durationMs.toFixed(2)}ms`);
  
  if (durationMs > 500) {
    console.warn(`⚠️ Layout algorithm slow: ${durationMs.toFixed(2)}ms (target: <500ms)`);
  }
  
  return { result, durationMs };
}