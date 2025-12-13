# Word-Cloud Flow Fix Action Plan

## Overview
This action plan provides specific, prioritized tasks for fixing the critical word-cloud overlap issues and streamlining the user flow. This document works hand-in-hand with `MULTI_PAGE_DISCOVERY_FLOW.md`, which contains the detailed technical implementation specifications.

**📋 Companion Document**: `docs/features/MULTI_PAGE_DISCOVERY_FLOW.md`
- Action Plan (this doc): What to do, when to do it, and in what order
- Implementation Plan: How to build it, technical specifications, and code examples

## 🤖 Claude Code Command Strategy

### **Essential Commands for This Project**
- **`/implement`** - Build components and algorithms following action plan tasks
- **`/debug`** - Solve complex collision detection and performance issues
- **`/review`** - Validate against acceptance criteria and accessibility standards
- **`/plan`** - Adapt strategy when facing implementation challenges
- **`/architect`** - Design system components and layout algorithms

### **Command Usage by Phase**

**Phase 1 (Overlap Fixes)**
```bash
/architect collision-free word placement system
/implement spiral layout algorithm with 48px tap targets
/debug layout convergence issues in tight spaces
/review word cloud component for zero overlaps
```

**Phase 2 (Flow Simplification)**
```bash
/architect auto-advancing quiz store with route guards
/implement auto-advancement removing Continue buttons
/debug route protection and step validation
/review complete flow for UX consistency
```

**Phase 3 (Animation Enhancement)**
```bash
/implement 4-16px floating animations with reduced motion support
/debug animation performance for 60fps on mobile
/review accessibility compliance for enhanced animations
/optimize animation system for battery performance
```

## 🚨 Critical Issues Priority Matrix

| Issue | Priority | Impact | Effort | Status |
|-------|----------|--------|---------|---------|
| Word overlaps making items unclickable | **HIGH** | Blocks user interaction | Medium | ⏳ Pending |
| Duplicate Step 1 confusing users | **HIGH** | Breaks user flow | Low | ⏳ Pending |
| Inconsistent Continue buttons | **MEDIUM** | UX friction | Low | ⏳ Pending |
| Barely visible animations | **MEDIUM** | Poor aesthetic | Low | ⏳ Pending |

## 📅 Implementation Phases

### Phase 1: Critical Overlap Fixes (Week 1)
**Goal**: Make all word-cloud items clickable without overlaps

#### Day 1-2: Layout Algorithm Foundation
- [ ] **Task 1.1**: Create `src/lib/layout/spiralLayout.ts`
  - Implement spiral placement algorithm from implementation plan
  - Add collision detection with 48px tap targets + 8px spacing
  - Test with Vienna districts data
  - **Deliverable**: Working spiral layout function
  - **Reference**: Implementation plan § "Algorithm Option 1: Spiral Placement"
  - **🤖 Commands**: 
    ```bash
    /architect spiral word placement algorithm for collision-free layout
    /implement spiralLayout.ts following implementation plan specifications
    /debug spiral convergence issues if algorithm doesn't place all words
    /review spiral algorithm against 48px tap target requirements
    ```

- [ ] **Task 1.2**: Create `src/lib/layout/forceLayout.ts`
  - Implement force-directed layout as backup algorithm
  - Add convergence detection and performance limits
  - Test with event types data
  - **Deliverable**: Alternative layout function
  - **Reference**: Implementation plan § "Algorithm Option 2: Force-Directed Layout"
  - **🤖 Commands**:
    ```bash
    /implement force-directed layout as backup to spiral algorithm
    /debug force calculation and collision resolution performance
    /review convergence detection for layout stability
    ```

#### Day 3-4: Core Word Cloud Component
- [ ] **Task 1.3**: Build `src/components/ui/NonOverlappingWordCloud.tsx`
  - Integrate both layout algorithms with algorithm selection
  - Add real-time collision validation
  - Implement responsive container sizing
  - **Deliverable**: Collision-free word cloud component
  - **Reference**: Implementation plan § "Core Component Implementation"
  - **🤖 Commands**:
    ```bash
    /implement NonOverlappingWordCloud component following Core Component Implementation section
    /debug real-time collision validation performance issues
    /review component integration with both spiral and force-directed algorithms
    /architect responsive container sizing for mobile and desktop
    ```

- [ ] **Task 1.4**: Create `src/components/ui/WordCloudButton.tsx`
  - Individual word buttons with proper tap targets
  - ARIA labels including event counts
  - Focus states for keyboard navigation
  - **Deliverable**: Accessible interactive word buttons
  - **Reference**: Implementation plan § "Individual Word Button Component"
  - **🤖 Commands**:
    ```bash
    /implement WordCloudButton with 48px minimum tap targets and ARIA labels
    /review button component against WCAG AA accessibility standards
    /debug focus state visibility and keyboard navigation
    ```

#### Day 5: Integration & Testing
- [ ] **Task 1.5**: Replace existing word clouds in all 3 quiz steps
  - Update Step 1 (locations), Step 2 (event types), Step 3 (months)
  - Verify zero overlaps across all screen sizes
  - Test tap targets on mobile devices
  - **Deliverable**: Overlap-free quiz steps
  - **Acceptance Criteria**: Zero overlapping bounding boxes, 48px min tap targets
  - **🤖 Commands**:
    ```bash
    /implement word cloud integration in quiz steps 1, 2, and 3
    /debug overlapping issues discovered during cross-device testing
    /review complete quiz integration against zero overlap acceptance criteria
    /review mobile tap target effectiveness on actual devices
    ```

### Phase 2: Flow Simplification (Week 2)
**Goal**: Remove duplicate screens and auto-advance on selections

#### Day 1-2: Remove Duplicate Step 1
- [ ] **Task 2.1**: Audit current quiz flow
  - Identify where duplicate district selection occurs
  - Map current step progression and identify redundancy
  - **Deliverable**: Flow audit document
  - **🤖 Commands**:
    ```bash
    /review current quiz flow to identify duplicate Step 1 screens
    /architect streamlined 3-step flow removing redundancy
    /plan consolidation strategy for single location selection step
    ```

- [ ] **Task 2.2**: Consolidate to single location step
  - Ensure Step 1 has proper heading, subtext, progress indicator
  - Remove secondary location selection screen
  - Update routing to go directly from location → event type
  - **Deliverable**: Single, clear location selection step
  - **Reference**: Implementation plan § "Step 1: Location Selection (No Duplicate Screen)"
  - **🤖 Commands**:
    ```bash
    /implement single location step with proper heading and progress indicator
    /debug routing issues when removing duplicate district screen
    /review Step 1 user experience for clarity and progression
    ```

#### Day 3-4: Auto-Advancing Implementation  
- [ ] **Task 2.3**: Update Quiz Store for auto-advancement
  - Implement auto-advancing state management from implementation plan
  - Add step validation and route protection
  - Remove dependency on Continue buttons
  - **Deliverable**: Enhanced quiz store with auto-progression
  - **Reference**: Implementation plan § "Enhanced Quiz Store for Auto-Advancing Flow"
  - **🤖 Commands**:
    ```bash
    /implement auto-advancing quiz store following Enhanced Quiz Store specifications
    /architect route protection logic for incomplete quiz steps
    /debug state management edge cases during auto-advancement
    /review quiz store against auto-progression requirements
    ```

- [ ] **Task 2.4**: Update all quiz step components
  - Modify Step 1, 2, 3 to auto-advance on word selection
  - Remove all Continue buttons and confirmation screens
  - Add route guards redirecting to incomplete steps
  - **Deliverable**: Auto-advancing quiz flow
  - **Reference**: Implementation plan § Step 1, 2, 3 component examples
  - **🤖 Commands**:
    ```bash
    /implement auto-advancement in quiz step components removing Continue buttons
    /debug route guard logic for preventing access to incomplete steps
    /review complete auto-advancing flow for user experience consistency
    ```

#### Day 5: Progress Indicator
- [ ] **Task 2.5**: Implement consistent progress indicator
  - Build `src/components/ui/ProgressIndicator.tsx`
  - Show 1/3 → 2/3 → 3/3 across all steps
  - Add step labels: Location, Event Type, Time
  - **Deliverable**: Consistent progress visualization
  - **Reference**: Implementation plan § "Progress Indicator Component"
  - **🤖 Commands**:
    ```bash
    /implement ProgressIndicator component with 1/3 - 2/3 - 3/3 step visualization
    /review progress indicator clarity and accessibility compliance
    /debug progress indicator state synchronization across quiz steps
    ```

### Phase 3: Enhanced Animations (Week 3)
**Goal**: Make floating motion clearly visible and accessible

#### Day 1-3: Enhanced Floating Animation
- [ ] **Task 3.1**: Build `src/components/animations/EnhancedFloatingText.tsx`
  - Increase amplitude to 4-16px range
  - Add staggered timing with 0-1000ms delays
  - Implement reduced motion detection and compliance
  - **Deliverable**: Visible, accessible floating animations
  - **Reference**: Implementation plan § "Enhanced Floating Animation System"
  - **🤖 Commands**:
    ```bash
    /implement EnhancedFloatingText with 4-16px amplitude and staggered timing
    /debug animation performance issues on low-end mobile devices
    /review reduced motion compliance for accessibility standards
    /optimize animation system for 60fps performance
    ```

- [ ] **Task 3.2**: Create reduced motion hook
  - Implement `src/hooks/useReducedMotion.ts`
  - Detect prefers-reduced-motion media query
  - Provide static alternatives for animation-sensitive users
  - **Deliverable**: Accessibility compliance for animations
  - **Reference**: Implementation plan § "Reduced Motion Compliance"
  - **🤖 Commands**:
    ```bash
    /implement useReducedMotion hook for accessibility compliance
    /debug media query detection across different browsers
    /review static animation alternatives for reduced motion users
    ```

#### Day 4-5: Animation Integration & Performance
- [ ] **Task 3.3**: Integrate enhanced animations into word clouds
  - Replace existing floating text with enhanced version
  - Test animation performance on mobile devices
  - Ensure 60fps performance and no memory leaks
  - **Deliverable**: Performant, visible animations across all steps
  - **🤖 Commands**:
    ```bash
    /implement enhanced animation integration in all word cloud components
    /debug memory leaks and performance bottlenecks in animation loops
    /review animation performance against 60fps target on mobile
    /optimize animation system for battery efficiency
    ```

## 🔧 Development Workflow

### Before Starting Each Task
1. **Read corresponding section** in `MULTI_PAGE_DISCOVERY_FLOW.md`
2. **Review acceptance criteria** for the specific feature
3. **Check current implementation** to understand what needs changing
4. **Set up testing environment** for the specific component/feature
5. **🤖 Use planning command** to get specific implementation guidance:
   ```bash
   /plan implementation of [task] following [implementation plan section]
   ```

### During Development
1. **Follow code examples** from implementation plan exactly
2. **🤖 Use implementation commands** for each major component:
   ```bash
   /implement [component] following [implementation plan specifications]
   ```
3. **Test against acceptance criteria** as you build
4. **🤖 Debug issues immediately**:
   ```bash
   /debug [specific issue] in [component/algorithm]
   ```
5. **Document any deviations** from the plan with reasoning
6. **Update this action plan** if priorities or timelines change

### After Completing Each Task
1. **🤖 Review implementation**:
   ```bash
   /review [completed component] against [specific acceptance criteria]
   ```
2. **Test thoroughly** according to testing strategy in implementation plan
3. **Check all acceptance criteria** are met
4. **Mark task complete** in this action plan
5. **Update team** on progress and any blockers

## 📊 Testing Checkpoints

### After Phase 1 (Overlap Fixes)
Run the "Critical Overlap Testing" checklist from implementation plan:
- [ ] Zero overlaps verified across all steps
- [ ] 48px minimum tap targets confirmed
- [ ] 8px spacing maintained between words
- [ ] Container scaling tested at multiple screen sizes
- [ ] Mobile touch targets verified on actual devices

### After Phase 2 (Flow Simplification)  
Run the "Flow Testing" checklist from implementation plan:
- [ ] No duplicate Step 1 confirmed
- [ ] Auto-advancement working on all selections
- [ ] No Continue buttons anywhere in flow
- [ ] Progress indicator accurate on each step
- [ ] Route guards working correctly

### After Phase 3 (Enhanced Animations)
Run the "Animation Testing" checklist from implementation plan:
- [ ] 4-16px amplitude clearly visible
- [ ] Staggered timing creating organic feel
- [ ] Reduced motion completely disabling animations
- [ ] 60fps performance maintained on mobile

## 🚀 Quick Start Guide

### For Immediate Impact (Day 1)
If you need to start fixing overlaps immediately:

1. **🤖 Plan the spiral algorithm**:
   ```bash
   /plan spiral layout algorithm implementation for collision-free word placement
   ```

2. **🤖 Implement the core layout**:
   ```bash
   /implement spiralLayout.ts following implementation plan Algorithm Option 1 specifications
   ```

3. **🤖 Debug any issues**:
   ```bash
   /debug spiral convergence problems if words still overlap
   ```

4. **🤖 Validate the result**:
   ```bash
   /review spiral algorithm against 48px tap targets and zero overlap requirements
   ```

5. **Quick manual validation**:
   ```typescript
   // Add this to any component to test layout
   console.log('Placed items:', placedItems);
   console.log('Has overlaps:', checkForOverlaps(placedItems));
   ```

### For Step-by-Step Approach
Follow the phases in order, completing each task before moving to the next.

#### Daily Command Workflow
```bash
# Morning: Plan the day
/plan today's tasks from action plan Phase [X] Day [Y]

# During development: Implement systematically
/implement [current task component] following [implementation plan section]
/debug [any issues encountered] 
/review [completed work] against acceptance criteria

# End of day: Validate progress
/review completed tasks against action plan deliverables
```

## 🤝 Team Coordination

### Daily Standups
- **Report progress** on current phase tasks
- **Identify blockers** early if layouts aren't working
- **🤖 Use debug commands** for team blockers:
  ```bash
  /debug [specific blocking issue] preventing [task completion]
  ```
- **Coordinate testing** across different devices/browsers

### Weekly Reviews
- **Demo completed phases** to stakeholders
- **🤖 Review phase completion**:
  ```bash
  /review Phase [X] completion against all acceptance criteria
  ```
- **Validate against acceptance criteria** from implementation plan
- **🤖 Plan adjustments** if needed:
  ```bash
  /plan Phase [X+1] adjustments based on Phase [X] learnings
  ```
- **Adjust timeline** if needed based on progress

## 📚 Reference Quick Links

### Implementation Plan Sections
- **Overlap Fixes**: § "Non-Overlapping Layout Algorithm Implementation"
- **Component Structure**: § "Non-Overlapping Word Cloud Component"  
- **Auto-Advancing Flow**: § "Step-by-Step Flow Implementation"
- **Animation System**: § "Enhanced Floating Animation System"
- **Accessibility**: § "Accessibility Implementation"
- **Testing Strategy**: § "Testing Strategy"

### Key Files to Create
```
src/lib/layout/spiralLayout.ts          # Core collision-free algorithm
src/components/ui/NonOverlappingWordCloud.tsx  # Main component
src/components/ui/ProgressIndicator.tsx # Consistent 1/3-2/3-3/3 indicator
src/hooks/useReducedMotion.ts           # Accessibility compliance
```

### Key Files to Modify
```
src/app/quiz/step1/page.tsx            # Remove duplicate screen
src/app/quiz/step2/page.tsx            # Add auto-advancement
src/app/quiz/step3/page.tsx            # Add auto-advancement
src/lib/stores/quizStore.ts            # Enhanced state management
```

## ⚠️ Common Pitfalls to Avoid

### During Overlap Fixes
- **Don't approximate collision detection** - use exact bounding box calculations
- **Don't skip mobile testing** - touch targets behave differently
- **Don't ignore edge cases** - test with very long words and small containers
- **🤖 Debug systematically**:
  ```bash
  /debug bounding box calculation accuracy in collision detection
  /debug mobile touch target effectiveness on actual devices
  /debug edge cases with very long words or small containers
  ```

### During Flow Simplification  
- **Don't break existing navigation** - ensure route guards work correctly
- **Don't remove all user control** - auto-advancement should feel natural, not jarring
- **Don't skip progress indicators** - users need to understand where they are
- **🤖 Review systematically**:
  ```bash
  /review route guard logic for proper navigation protection
  /review auto-advancement timing for natural user experience
  /review progress indicators for clarity and accessibility
  ```

### During Animation Enhancement
- **Don't ignore reduced motion** - accessibility is non-negotiable
- **Don't sacrifice performance** - animations must maintain 60fps
- **Don't make motion too aggressive** - 4-16px is visible but not distracting
- **🤖 Optimize systematically**:
  ```bash
  /review reduced motion compliance for WCAG AA standards
  /debug animation performance issues causing frame drops
  /optimize animation amplitude for visible but non-distracting motion
  ```

## 📋 Success Metrics Tracking

Track these metrics throughout implementation:

### Week 1 (Overlap Fixes)
- **Overlap incidents**: Target 0 across all steps
- **Layout calculation time**: Target <500ms
- **Touch target success rate**: Target >95% on mobile

### Week 2 (Flow Simplification)
- **Step completion rate**: Target >90% per step
- **User confusion reports**: Target 0 duplicate screen complaints
- **Auto-advancement success**: Target >98% selections advance correctly

### Week 3 (Animation Enhancement)
- **Animation performance**: Target 60fps sustained
- **Reduced motion adoption**: Track % users served static version
- **User satisfaction**: Target improved "playful feel" feedback

## 🎯 Definition of Done

### For Each Task
- [ ] Code implemented according to implementation plan specifications
- [ ] Relevant tests from testing strategy completed successfully
- [ ] Acceptance criteria verified and documented
- [ ] Performance benchmarks met
- [ ] Accessibility compliance confirmed
- [ ] Peer review completed
- [ ] Documentation updated if needed

### For Each Phase
- [ ] All phase tasks completed
- [ ] Testing checkpoint passed
- [ ] Demo-ready for stakeholder review
- [ ] Metrics tracking shows success
- [ ] Ready to proceed to next phase

## 🤖 Command Quick Reference

### Most Used Commands by Phase

**Phase 1: Overlap Fixes**
```bash
# Core layout work
/implement spiralLayout.ts with collision detection
/debug layout algorithm convergence issues
/review word cloud component for zero overlaps

# Component building
/implement NonOverlappingWordCloud with responsive sizing
/debug real-time collision validation performance
/review component accessibility compliance
```

**Phase 2: Flow Simplification**
```bash
# Flow restructuring
/architect auto-advancing quiz flow removing duplicate screens
/implement enhanced quiz store with route protection
/debug auto-advancement edge cases

# Component updates
/implement progress indicator with 1/3-2/3-3/3 visualization
/review complete flow for UX consistency
```

**Phase 3: Animation Enhancement**
```bash
# Animation system
/implement EnhancedFloatingText with 4-16px amplitude
/debug animation performance on mobile devices
/optimize animation system for 60fps and battery efficiency

# Accessibility
/implement useReducedMotion hook for accessibility
/review animation compliance with reduced motion preferences
```

### Emergency Debug Commands
```bash
# When layout completely fails
/debug spiral algorithm infinite loop or convergence failure
/architect alternative force-directed layout approach

# When animations cause performance issues
/debug memory leaks in animation loops
/optimize animation performance for low-end devices

# When accessibility fails
/review component against WCAG AA standards
/debug keyboard navigation and screen reader compatibility
```

### Validation Commands for Each Acceptance Criteria
```bash
# Zero overlap validation
/review word cloud layout for overlapping bounding boxes

# Tap target validation  
/review button components for 48px minimum tap targets

# Auto-advancement validation
/review quiz flow for consistent auto-progression

# Animation visibility validation
/review floating animations for 4-16px amplitude visibility

# Accessibility validation
/review complete system for WCAG AA compliance
```

---

**💡 Remember**: This action plan and the implementation plan work together. Use this document for task management and prioritization, and refer to the implementation plan for detailed technical specifications and code examples.

**🤖 Pro Tip**: Start each development session with `/plan` to get specific guidance, implement systematically with `/implement`, debug issues immediately with `/debug`, and validate progress with `/review`.