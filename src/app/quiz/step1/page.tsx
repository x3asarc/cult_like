'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { NonOverlappingWordCloud, type WordCloudItem } from '../../../components/ui/NonOverlappingWordCloud';
import { ProgressIndicator } from '../../../components/ui/ProgressIndicator';
import { useQuizStore } from '../../../lib/stores/quizStore';

// Vienna districts with realistic event counts
const viennaLocations: WordCloudItem[] = [
  { id: 'innere-stadt', text: 'Innere Stadt', value: 45 },
  { id: 'leopoldstadt', text: 'Leopoldstadt', value: 28 },
  { id: 'landstrasse', text: 'Landstraße', value: 32 },
  { id: 'wieden', text: 'Wieden', value: 19 },
  { id: 'margareten', text: 'Margareten', value: 22 },
  { id: 'mariahilf', text: 'Mariahilf', value: 38 },
  { id: 'neubau', text: 'Neubau', value: 35 },
  { id: 'josefstadt', text: 'Josefstadt', value: 15 }
];

export default function LocationStep() {
  const router = useRouter();
  const { setLocation } = useQuizStore();

  const handleLocationSelect = (locationId: string) => {
    const selectedLocation = viennaLocations.find(loc => loc.id === locationId);
    
    if (selectedLocation) {
      // Update store
      setLocation(locationId);
      
      // Track analytics
      if (typeof window !== 'undefined' && (window as any).analytics) {
        (window as any).analytics.track('click_location', {
          locationId,
          locationName: selectedLocation.text,
          eventCount: selectedLocation.value,
          step: 'location_selection',
          autoAdvanced: true
        });
      }
      
      // Auto-advance to step 2 (no Continue button needed)
      setTimeout(() => {
        router.push('/quiz/step2');
      }, 300); // Short delay for visual feedback
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-center bg-white">
      <ProgressIndicator current={1} total={3} label="Location" />
      
      <section className="flex-1 flex flex-col justify-center px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl text-gray-900 mb-4 tracking-tight font-serif">
            Find cultural events that match your taste
          </h1>
          <p className="text-lg text-gray-600">
            Start by picking your area
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto w-full">
          <NonOverlappingWordCloud
            items={viennaLocations}
            onItemClick={handleLocationSelect}
            fontSizeRange={{ min: 1.1, max: 2.4 }}
            algorithm="spiral"
            minTapTarget={48}
            minSpacing={8}
            containerClassName="min-h-[500px]"
            showLegend={true}
            legendText="Larger words mean more events in that area"
            ariaLabel="Choose a location in Vienna"
          />
        </div>
        
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Click any district to continue
          </p>
        </div>
      </section>
    </main>
  );
}