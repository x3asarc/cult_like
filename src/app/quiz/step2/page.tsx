'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NonOverlappingWordCloud, type WordCloudItem } from '../../../components/ui/NonOverlappingWordCloud';
import { ProgressIndicator } from '../../../components/ui/ProgressIndicator';
import { FilterBreadcrumbs } from '../../../components/ui/FilterBreadcrumbs';
import { useQuizStore } from '../../../lib/stores/quizStore';

// Cultural event types with realistic distribution
const eventTypes: WordCloudItem[] = [
  { id: 'opera', text: 'Opera', value: 25 },
  { id: 'theater', text: 'Theater', value: 38 },
  { id: 'classical-music', text: 'Classical Music', value: 42 },
  { id: 'contemporary-art', text: 'Contemporary Art', value: 31 },
  { id: 'dance', text: 'Dance', value: 19 },
  { id: 'film', text: 'Film', value: 28 },
  { id: 'jazz', text: 'Jazz', value: 22 },
  { id: 'gallery', text: 'Gallery', value: 35 }
];

export default function EventTypeStep() {
  const router = useRouter();
  const { filters, setCategory } = useQuizStore();

  // Route guard - redirect if no location selected
  useEffect(() => {
    if (!filters.location) {
      console.warn('No location selected, redirecting to step 1');
      router.push('/quiz/step1');
    }
  }, [filters.location, router]);

  const handleCategorySelect = (categoryId: string) => {
    const selectedCategory = eventTypes.find(type => type.id === categoryId);
    
    if (selectedCategory) {
      // Update store
      setCategory(categoryId);
      
      // Track analytics
      if (typeof window !== 'undefined' && (window as { analytics?: { track: (event: string, data: Record<string, unknown>) => void } }).analytics) {
        (window as { analytics: { track: (event: string, data: Record<string, unknown>) => void } }).analytics.track('click_category', {
          categoryId,
          categoryName: selectedCategory.text,
          eventCount: selectedCategory.value,
          step: 'event_type_selection',
          autoAdvanced: true,
          locationContext: filters.location
        });
      }
      
      // Auto-advance to step 3 (no Continue button needed)
      setTimeout(() => {
        router.push('/quiz/step3');
      }, 300);
    }
  };

  const handleLocationEdit = () => {
    router.push('/quiz/step1');
  };

  // Don't render if no location (route guard will redirect)
  if (!filters.location) {
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
      <ProgressIndicator current={2} total={3} label="Event Type" />
      
      <FilterBreadcrumbs 
        filters={{
          location: { 
            label: filters.location || 'Not selected', 
            editable: true, 
            onClick: handleLocationEdit 
          },
          eventType: { 
            label: 'None selected yet', 
            editable: false 
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
            What type of cultural event?
          </h1>
          <p className="text-lg text-gray-600">
            Pick what you&apos;re in the mood for
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto w-full">
          <NonOverlappingWordCloud
            items={eventTypes}
            onItemClick={handleCategorySelect}
            fontSizeRange={{ min: 1.0, max: 1.8 }} // Smaller range for readability
            algorithm="spiral"
            minTapTarget={48}
            minSpacing={8}
            containerClassName="min-h-[500px]"
            showLegend={false} // Users understand the pattern by step 2
            ariaLabel="Choose an event type"
          />
        </div>
        
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Click any event type to continue
          </p>
        </div>
      </section>
    </main>
  );
}