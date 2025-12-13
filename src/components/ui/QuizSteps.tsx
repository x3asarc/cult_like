'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NonOverlappingWordCloud, type WordCloudItem } from './NonOverlappingWordCloud'
import { ProgressIndicator } from './ProgressIndicator'
import Link from 'next/link'

// Vienna districts with realistic event counts - no overlapping
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

// Cultural event types - no overlapping
const eventTypes: WordCloudItem[] = [
  { id: 'opera', text: 'Opera', value: 25 },
  { id: 'theater', text: 'Theater', value: 38 },
  { id: 'classical-music', text: 'Classical Music', value: 42 },
  { id: 'contemporary-art', text: 'Contemporary Art', value: 31 },
  { id: 'dance', text: 'Dance', value: 19 },
  { id: 'film', text: 'Film', value: 28 }
];

// Months - no overlapping
const months: WordCloudItem[] = [
  { id: 'january', text: 'January', value: 22 },
  { id: 'february', text: 'February', value: 28 },
  { id: 'march', text: 'March', value: 35 },
  { id: 'april', text: 'April', value: 38 },
  { id: 'may', text: 'May', value: 42 },
  { id: 'june', text: 'June', value: 31 }
];

export function QuizSteps() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selections, setSelections] = useState({
    location: '',
    category: '',
    month: ''
  })

  // Auto-advancing handlers - no Continue buttons needed
  const handleLocationSelect = (locationId: string) => {
    const selectedLocation = viennaLocations.find(loc => loc.id === locationId)
    if (selectedLocation) {
      setSelections(prev => ({ ...prev, location: locationId }))
      
      // Track analytics
      if (typeof window !== 'undefined' && (window as { analytics?: { track: (event: string, data: Record<string, unknown>) => void } }).analytics) {
        (window as { analytics: { track: (event: string, data: Record<string, unknown>) => void } }).analytics.track('click_location', {
          locationId,
          locationName: selectedLocation.text,
          eventCount: selectedLocation.value,
          autoAdvanced: true
        })
      }
      
      // Auto-advance to step 2
      setTimeout(() => setCurrentStep(2), 300)
    }
  }

  const handleCategorySelect = (categoryId: string) => {
    const selectedCategory = eventTypes.find(type => type.id === categoryId)
    if (selectedCategory) {
      setSelections(prev => ({ ...prev, category: categoryId }))
      
      // Track analytics
      if (typeof window !== 'undefined' && (window as { analytics?: { track: (event: string, data: Record<string, unknown>) => void } }).analytics) {
        (window as { analytics: { track: (event: string, data: Record<string, unknown>) => void } }).analytics.track('click_category', {
          categoryId,
          categoryName: selectedCategory.text,
          eventCount: selectedCategory.value,
          autoAdvanced: true
        })
      }
      
      // Auto-advance to step 3
      setTimeout(() => setCurrentStep(3), 300)
    }
  }

  const handleMonthSelect = (monthId: string) => {
    const selectedMonth = months.find(month => month.id === monthId)
    if (selectedMonth) {
      setSelections(prev => ({ ...prev, month: monthId }))
      
      // Track analytics
      if (typeof window !== 'undefined' && (window as { analytics?: { track: (event: string, data: Record<string, unknown>) => void } }).analytics) {
        (window as { analytics: { track: (event: string, data: Record<string, unknown>) => void } }).analytics.track('click_month', {
          monthId,
          monthName: selectedMonth.text,
          eventCount: selectedMonth.value,
          autoAdvanced: true
        })
      }
      
      // Auto-advance to results
      setTimeout(() => setCurrentStep(4), 300)
    }
  }

  const buildResultsUrl = () => {
    const params = new URLSearchParams()
    if (selections.location) params.append('location', selections.location)
    if (selections.category) params.append('category', selections.category)
    if (selections.month) params.append('month', selections.month)
    return `/results?${params.toString()}`
  }

  if (currentStep === 4) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl"
        >
          <h1 className="text-5xl text-gray-900 mb-8 font-serif">
            Perfect!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            We found events that match your preferences
          </p>
          <Link
            href={buildResultsUrl()}
            className="inline-block bg-black text-white px-12 py-4 text-lg hover:bg-gray-800 transition-colors duration-200 rounded-sm"
          >
            View Your Events
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Back Link */}
      <div className="absolute top-8 left-8 z-10">
        <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">
          ← Back to Home
        </Link>
      </div>
      
      {/* Progress Indicator */}
      <ProgressIndicator 
        current={currentStep} 
        total={3} 
        label={
          currentStep === 1 ? 'Location' : 
          currentStep === 2 ? 'Event Type' : 
          'Time'
        }
      />
      
      <div className="max-w-6xl mx-auto px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            {/* Step-specific content */}
            {currentStep === 1 && (
              <>
                <h1 className="text-4xl md:text-5xl text-gray-900 mb-4 tracking-tight font-serif">
                  Find cultural events that match your taste
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Start by picking your area
                </p>
                
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
                
                <p className="text-sm text-gray-500 mt-8">
                  Click any district to continue
                </p>
              </>
            )}
            
            {currentStep === 2 && (
              <>
                <h1 className="text-4xl md:text-5xl text-gray-900 mb-4 tracking-tight font-serif">
                  What type of cultural event?
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Pick what you&apos;re in the mood for
                </p>
                
                <div className="max-w-6xl mx-auto w-full">
                  <NonOverlappingWordCloud
                    items={eventTypes}
                    onItemClick={handleCategorySelect}
                    fontSizeRange={{ min: 1.0, max: 1.8 }}
                    algorithm="spiral"
                    minTapTarget={48}
                    minSpacing={8}
                    containerClassName="min-h-[500px]"
                    showLegend={false}
                    ariaLabel="Choose an event type"
                  />
                </div>
                
                <p className="text-sm text-gray-500 mt-8">
                  Click any event type to continue
                </p>
              </>
            )}
            
            {currentStep === 3 && (
              <>
                <h1 className="text-4xl md:text-5xl text-gray-900 mb-4 tracking-tight font-serif">
                  When would you like to go?
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Pick your preferred month
                </p>
                
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
                
                <p className="text-sm text-gray-500 mt-8">
                  Click any month to see your events
                </p>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}