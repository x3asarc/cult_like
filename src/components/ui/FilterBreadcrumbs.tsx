'use client';

import React from 'react';

interface FilterBreadcrumbsProps {
  filters: {
    location?: { 
      label: string; 
      editable: boolean; 
      onClick?: () => void 
    };
    eventType?: { 
      label: string; 
      editable: boolean; 
      onClick?: () => void 
    };
    month?: { 
      label: string; 
      editable: boolean; 
      onClick?: () => void 
    };
  };
}

export function FilterBreadcrumbs({ filters }: FilterBreadcrumbsProps) {
  const breadcrumbItems = [
    { key: 'location', label: 'Location', ...filters.location },
    { key: 'eventType', label: 'Event Type', ...filters.eventType },
    { key: 'month', label: 'Month', ...filters.month }
  ].filter(item => item.label !== undefined);

  if (breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <nav 
      className="flex justify-center py-4 px-4"
      aria-label="Quiz filter selections"
    >
      <div className="flex items-center space-x-2 text-sm">
        {breadcrumbItems.map((item, index) => (
          <div key={item.key} className="flex items-center space-x-2">
            {/* Filter category */}
            <span className="text-gray-500 font-medium">
              {item.key === 'location' ? 'Location' : 
               item.key === 'eventType' ? 'Type' : 
               'Month'}:
            </span>
            
            {/* Filter value */}
            {item.editable && item.onClick ? (
              <button
                onClick={item.onClick}
                className="text-blue-600 hover:text-blue-800 underline decoration-dotted underline-offset-2 transition-colors duration-200"
                aria-label={`Change ${item.key}: currently ${item.label}`}
              >
                {item.label}
              </button>
            ) : (
              <span 
                className={`${
                  item.label === 'None selected yet' || item.label === 'Not selected'
                    ? 'text-gray-400 italic' 
                    : 'text-gray-900 font-medium'
                }`}
              >
                {item.label}
              </span>
            )}
            
            {/* Separator (not after last item) */}
            {index < breadcrumbItems.length - 1 && (
              <span className="text-gray-300" aria-hidden="true">
                →
              </span>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}

/**
 * Compact version for mobile or tight spaces
 */
export function CompactFilterBreadcrumbs({ filters }: FilterBreadcrumbsProps) {
  const activeFilters = Object.entries(filters)
    .filter(([, filter]) => filter && filter.label !== 'None selected yet' && filter.label !== 'Not selected')
    .map(([key, filter]) => ({ key, ...filter }));

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex justify-center py-2">
      <div className="flex items-center space-x-1 text-xs text-gray-600">
        <span>Selections:</span>
        {activeFilters.map((filter, index) => (
          <span key={filter.key}>
            {filter.editable && filter.onClick ? (
              <button
                onClick={filter.onClick}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {filter.label}
              </button>
            ) : (
              <span className="font-medium">{filter.label}</span>
            )}
            {index < activeFilters.length - 1 && ', '}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Breadcrumbs with reset functionality
 */
export function ResettableFilterBreadcrumbs({ 
  filters, 
  onReset 
}: FilterBreadcrumbsProps & { 
  onReset: () => void 
}) {
  const hasActiveFilters = Object.values(filters).some(
    filter => filter && filter.label !== 'None selected yet' && filter.label !== 'Not selected'
  );

  return (
    <div className="flex justify-center items-center py-4 px-4">
      <FilterBreadcrumbs filters={filters} />
      
      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="ml-4 text-sm text-red-600 hover:text-red-800 underline decoration-dotted underline-offset-2"
          aria-label="Reset all quiz selections"
        >
          Reset
        </button>
      )}
    </div>
  );
}