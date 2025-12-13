/**
 * Force-Directed Layout Algorithm for Word Cloud Placement
 * 
 * Alternative to spiral layout. Uses physics simulation to resolve collisions
 * by applying repulsion forces between overlapping items.
 */

import { WordItem, PlacedItem, ContainerBounds, validateNoOverlaps, spiralLayout } from './spiralLayout';

interface ForceLayoutConfig {
  maxIterations: number;
  minSpacing: number;
  damping: number;
  repulsionStrength: number;
  centeringStrength: number;
  convergenceThreshold: number;
}

interface ForceItem extends PlacedItem {
  vx: number; // velocity x
  vy: number; // velocity y
  fx: number; // force x
  fy: number; // force y
}

const DEFAULT_FORCE_CONFIG: ForceLayoutConfig = {
  maxIterations: 100,
  minSpacing: 8,
  damping: 0.9, // Velocity damping factor
  repulsionStrength: 1000, // Strength of repulsion between overlapping items
  centeringStrength: 0.1, // Strength pulling items toward container center
  convergenceThreshold: 0.1 // Stop when total movement per iteration is below this
};

/**
 * Calculate repulsion forces between overlapping items
 */
function calculateRepulsionForces(
  items: ForceItem[],
  config: ForceLayoutConfig
): { fx: number; fy: number }[] {
  const forces = items.map(() => ({ fx: 0, fy: 0 }));

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const item1 = items[i];
      const item2 = items[j];

      // Calculate center-to-center distance
      const dx = item2.x - item1.x;
      const dy = item2.y - item1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Calculate minimum distance needed (including spacing)
      const minDistance = 
        (item1.width + item2.width) / 2 + 
        (item1.height + item2.height) / 2 + 
        config.minSpacing;

      // Apply repulsion if items are too close
      if (distance < minDistance && distance > 0) {
        const overlap = minDistance - distance;
        const force = (config.repulsionStrength * overlap) / distance;

        const fx = force * dx;
        const fy = force * dy;

        // Apply equal and opposite forces
        forces[i].fx -= fx;
        forces[i].fy -= fy;
        forces[j].fx += fx;
        forces[j].fy += fy;
      }
    }
  }

  return forces;
}

/**
 * Calculate centering forces to keep items within container
 */
function calculateCenteringForces(
  items: ForceItem[],
  container: ContainerBounds,
  config: ForceLayoutConfig
): { fx: number; fy: number }[] {
  return items.map(item => {
    // Force toward container center
    const dx = container.center.x - item.x;
    const dy = container.center.y - item.y;

    // Additional force if item is outside container bounds
    let boundaryFx = 0;
    let boundaryFy = 0;

    const itemLeft = item.x - item.width / 2;
    const itemRight = item.x + item.width / 2;
    const itemTop = item.y - item.height / 2;
    const itemBottom = item.y + item.height / 2;

    if (itemLeft < 0) boundaryFx = -itemLeft * config.repulsionStrength;
    if (itemRight > container.width) boundaryFx = (container.width - itemRight) * config.repulsionStrength;
    if (itemTop < 0) boundaryFy = -itemTop * config.repulsionStrength;
    if (itemBottom > container.height) boundaryFy = (container.height - itemBottom) * config.repulsionStrength;

    return {
      fx: dx * config.centeringStrength + boundaryFx,
      fy: dy * config.centeringStrength + boundaryFy
    };
  });
}

/**
 * Check if simulation has converged (items stopped moving significantly)
 */
function hasConverged(items: ForceItem[], threshold: number): boolean {
  const totalMovement = items.reduce((sum, item) => {
    const speed = Math.sqrt(item.vx * item.vx + item.vy * item.vy);
    return sum + speed;
  }, 0);

  const avgMovement = totalMovement / items.length;
  return avgMovement < threshold;
}

/**
 * Initialize items with random positions and zero velocity
 */
function initializeForceItems(
  items: WordItem[],
  container: ContainerBounds
): ForceItem[] {
  return items.map(item => ({
    ...item,
    // Start with random positions near center
    x: container.center.x + (Math.random() - 0.5) * 100,
    y: container.center.y + (Math.random() - 0.5) * 100,
    vx: 0,
    vy: 0,
    fx: 0,
    fy: 0
  }));
}

/**
 * Main force-directed layout function
 */
export function forceDirectedLayout(
  items: WordItem[],
  containerBounds: ContainerBounds,
  minSpacing: number = 8,
  maxIterations: number = 100
): PlacedItem[] {
  if (items.length === 0) return [];

  const config: ForceLayoutConfig = {
    ...DEFAULT_FORCE_CONFIG,
    minSpacing,
    maxIterations
  };

  console.log(`Starting force-directed layout with ${items.length} items`);

  // Initialize items with positions and velocities
  let forceItems = initializeForceItems(items, containerBounds);

  let iteration = 0;
  let converged = false;

  while (iteration < config.maxIterations && !converged) {
    // Calculate forces
    const repulsionForces = calculateRepulsionForces(forceItems, config);
    const centeringForces = calculateCenteringForces(forceItems, containerBounds, config);

    // Apply forces and update positions
    forceItems = forceItems.map((item, i) => {
      const totalFx = repulsionForces[i].fx + centeringForces[i].fx;
      const totalFy = repulsionForces[i].fy + centeringForces[i].fy;

      // Update velocity with damping
      const newVx = (item.vx + totalFx * 0.01) * config.damping;
      const newVy = (item.vy + totalFy * 0.01) * config.damping;

      // Update position
      const newX = item.x + newVx;
      const newY = item.y + newVy;

      return {
        ...item,
        x: newX,
        y: newY,
        vx: newVx,
        vy: newVy,
        fx: totalFx,
        fy: totalFy
      };
    });

    // Check convergence
    converged = hasConverged(forceItems, config.convergenceThreshold);
    iteration++;

    // Log progress every 20 iterations
    if (iteration % 20 === 0) {
      const validation = validateNoOverlaps(forceItems, minSpacing);
      console.log(`Force layout iteration ${iteration}: ${validation.overlapping.length} overlaps remaining`);
    }
  }

  // Convert back to PlacedItem format
  const placedItems: PlacedItem[] = forceItems.map(item => ({
    id: item.id,
    text: item.text,
    fontSize: item.fontSize,
    importance: item.importance,
    width: item.width,
    height: item.height,
    x: item.x,
    y: item.y
  }));

  // Final validation
  const finalValidation = validateNoOverlaps(placedItems, minSpacing);
  
  console.log('Force-Directed Layout Results:', {
    totalItems: items.length,
    iterations: iteration,
    converged,
    hasOverlaps: finalValidation.hasOverlaps,
    overlapping: finalValidation.overlapping
  });

  if (finalValidation.hasOverlaps) {
    console.warn(`⚠️ Force layout completed with ${finalValidation.overlapping.length} overlaps after ${iteration} iterations`);
  }

  return placedItems;
}

/**
 * Hybrid layout: Try spiral first, fall back to force-directed if needed
 */
export function hybridLayout(
  items: WordItem[],
  containerBounds: ContainerBounds,
  minSpacing: number = 8
): PlacedItem[] {
  console.log('Attempting hybrid layout approach');

  // Try spiral layout first (faster)
  const spiralResult = spiralLayout(items, containerBounds, minSpacing);
  
  // Check if spiral layout was successful
  const spiralValidation = validateNoOverlaps(spiralResult, minSpacing);
  
  if (!spiralValidation.hasOverlaps && spiralResult.length === items.length) {
    console.log('✅ Spiral layout successful, no need for force-directed');
    return spiralResult;
  }

  console.log('⚠️ Spiral layout had issues, falling back to force-directed');
  return forceDirectedLayout(items, containerBounds, minSpacing);
}

/**
 * Layout algorithm selection based on item count and container size
 */
export function selectOptimalAlgorithm(
  itemCount: number,
  containerArea: number
): 'spiral' | 'force-directed' | 'hybrid' {
  const density = itemCount / containerArea;

  if (itemCount <= 10) {
    return 'spiral'; // Fast and reliable for small sets
  } else if (density < 0.001) {
    return 'spiral'; // Plenty of space, spiral works well
  } else if (itemCount > 50 || density > 0.01) {
    return 'force-directed'; // High density or many items, force-directed handles better
  } else {
    return 'hybrid'; // Try spiral first, fall back to force-directed
  }
}

/**
 * Optimize force-directed layout parameters based on item characteristics
 */
export function optimizeForceConfig(
  items: WordItem[],
  containerBounds: ContainerBounds
): ForceLayoutConfig {
  const itemCount = items.length;
  const containerArea = containerBounds.width * containerBounds.height;
  const avgItemSize = items.reduce((sum, item) => sum + item.width * item.height, 0) / itemCount;
  const density = (itemCount * avgItemSize) / containerArea;

  return {
    ...DEFAULT_FORCE_CONFIG,
    // More iterations for complex layouts
    maxIterations: Math.min(200, 50 + itemCount * 2),
    // Stronger repulsion for high density
    repulsionStrength: 1000 * (1 + density * 5),
    // More centering for small containers
    centeringStrength: Math.max(0.05, 0.2 - containerArea / 1000000),
    // Looser convergence for many items
    convergenceThreshold: Math.max(0.05, 0.1 + itemCount / 1000)
  };
}