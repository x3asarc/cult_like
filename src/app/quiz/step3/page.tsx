'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NonOverlappingWordCloud, type WordCloudItem } from '../../../components/ui/NonOverlappingWordCloud';
import { ProgressIndicator } from '../../../components/ui/ProgressIndicator';
import { FilterBreadcrumbs } from '../../../components/ui/FilterBreadcrumbs';
import { useQuizStore } from '../../../lib/stores/quizStore';

// Months with realistic event distribution
const months: WordCloudItem[] = [
  { id: 'january', text: 'January', value: 22 },
  { id: 'february', text: 'February', value: 28 },
  { id: 'march', text: 'March', value: 35 },
  { id: 'april', text: 'April', value: 38 },
  { id: 'may', text: 'May', value: 42 },
  { id: 'june', text: 'June', value: 31 }
];

export default function MonthStep() {
  const router = useRouter();
  const { filters, setMonth } = useQuizStore();

  // Route guard - redirect if incomplete
  useEffect(() => {
    if (!filters.location || !filters.category) {
      const missingStep = !filters.location ? 'step1' : 'step2';
      console.warn(`Incomplete quiz state, redirecting to ${missingStep}`);
      router.push(`/quiz/${missingStep}`);
    }
  }, [filters.location, filters.category, router]);

  const handleMonthSelect = (monthId: string) => {
    const selectedMonth = months.find(month => month.id === monthId);
    
    if (selectedMonth) {
      // Convert month name to number (for backend compatibility)
      const monthIndex = months.findIndex(m => m.id === monthId) + 1;
      
      // Update store
      setMonth(monthIndex);
      
      // Track analytics
      if (typeof window !== 'undefined' && (window as { analytics?: { track: (event: string, data: Record<string, unknown>) => void } }).analytics) {
        (window as { analytics: { track: (event: string, data: Record<string, unknown>) => void } }).analytics.track('click_month', {
          monthId,
          monthName: selectedMonth.text,
          monthIndex,
          eventCount: selectedMonth.value,
          step: 'month_selection',
          autoAdvanced: true,
          locationContext: filters.location,
          categoryContext: filters.category
        });
      }
      
      // Auto-advance to results (no Continue button needed)
      setTimeout(() => {
        router.push('/results');
      }, 300);
    }
  };

  const handleLocationEdit = () => {
    router.push('/quiz/step1');
  };

  const handleCategoryEdit = () => {
    router.push('/quiz/step2');
  };

  // Don't render if incomplete (route guard will redirect)
  if (!filters.location || !filters.category) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col justify-center bg-white">
      <ProgressIndicator current={3} total={3} label="Time" />
      
      <FilterBreadcrumbs 
        filters={{
          location: { 
            label: filters.location || 'Not selected', 
            editable: true, 
            onClick: handleLocationEdit 
          },
          eventType: { 
            label: filters.category || 'Not selected', 
            editable: true, 
            onClick: handleCategoryEdit 
          },
          month: { 
            label: 'None selected yet', 
            editable: false 
          }
        }}
      />
      
      <section className="flex-1 flex flex-col justify-center px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl text-gray-900 mb-4 tracking-tight font-serif">
            When would you like to go?
          </h1>
          <p className="text-lg text-gray-600">
            Pick your preferred month
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto w-full">
          <NonOverlappingWordCloud
            items={months}
            onItemClick={handleMonthSelect}
            fontSizeRange={{ min: 1.1, max: 2.4 }}
            algorithm="spiral"
            minTapTarget={48}
            minSpacing={8}
            containerClassName="min-h-[500px]"
            showLegend={true}
            legendText="Larger months mean more events available"
            ariaLabel="Choose a month"
          />
        </div>
        
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Click any month to see your events
          </p>
        </div>
      </section>
    </main>
  );
}