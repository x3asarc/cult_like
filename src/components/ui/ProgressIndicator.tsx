'use client';

import React from 'react';

interface ProgressIndicatorProps {
  current: number; // 1, 2, or 3
  total: number; // always 3
  label: string; // 'Location', 'Event Type', 'Time'
}

export function ProgressIndicator({ current, total, label }: ProgressIndicatorProps) {
  const steps = [
    { number: 1, label: 'Location' },
    { number: 2, label: 'Event Type' },
    { number: 3, label: 'Time' }
  ];

  return (
    <div className="flex justify-center items-center py-6">
      <div className="flex flex-col items-center space-y-4">
        {/* Step indicators */}
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              {/* Step indicator dot */}
              <div 
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  step.number === current 
                    ? 'bg-blue-600' 
                    : step.number < current 
                      ? 'bg-green-600' 
                      : 'bg-gray-300'
                }`}
                aria-current={step.number === current ? 'step' : undefined}
                role="presentation"
              />
              
              {/* Step label */}
              <span 
                className={`ml-2 text-sm font-medium transition-colors duration-200 ${
                  step.number === current 
                    ? 'text-blue-600' 
                    : step.number < current 
                      ? 'text-green-600' 
                      : 'text-gray-500'
                }`}
              >
                {step.label}
              </span>
              
              {/* Connector line (not after last step) */}
              {index < steps.length - 1 && (
                <div 
                  className={`w-8 h-px ml-4 transition-colors duration-200 ${
                    step.number < current ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                  role="presentation"
                />
              )}
            </div>
          ))}
        </div>
        
        {/* Current step label */}
        <div className="text-center">
          <span 
            className="text-sm text-gray-600"
            aria-live="polite"
            aria-label={`Currently on step ${current} of ${total}: ${label}`}
          >
            Step {current} of {total}: {label}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Simplified progress bar for minimal UI
 */
export function SimpleProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${(current / total) * 100}%` }}
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Step ${current} of ${total}`}
      />
    </div>
  );
}

/**
 * Vertical progress indicator for sidebar layouts
 */
export function VerticalProgressIndicator({ current, total, steps }: {
  current: number;
  total: number;
  steps: string[];
}) {
  return (
    <nav className="flex flex-col space-y-4" aria-label="Quiz progress">
      {steps.map((stepLabel, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === current;
        const isCompleted = stepNumber < current;
        
        return (
          <div key={stepNumber} className="flex items-center space-x-3">
            {/* Step number */}
            <div 
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white' 
                  : isCompleted 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-300 text-gray-600'
              }`}
              aria-current={isActive ? 'step' : undefined}
            >
              {isCompleted ? '✓' : stepNumber}
            </div>
            
            {/* Step label */}
            <span 
              className={`text-sm font-medium transition-colors duration-200 ${
                isActive 
                  ? 'text-blue-600' 
                  : isCompleted 
                    ? 'text-green-600' 
                    : 'text-gray-500'
              }`}
            >
              {stepLabel}
            </span>
          </div>
        );
      })}
    </nav>
  );
}