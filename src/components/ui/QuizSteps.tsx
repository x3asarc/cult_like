'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FloatingOption } from '@/components/animations/FloatingOption'
import { FloatingLocationStep } from '@/components/ui/FloatingLocationStep'
import { FloatingInterestStep } from '@/components/ui/FloatingInterestStep'
import { FloatingMonthStep } from '@/components/ui/FloatingMonthStep'
import Link from 'next/link'

const quizData = {
  step1: {
    title: "Choose Your Location",
    subtitle: "Where would you like to discover cultural events?",
    options: [
      "Innere Stadt",
      "Leopoldstadt", 
      "Mariahilf",
      "Neubau",
      "Josefstadt",
      "Landstraße"
    ]
  },
  step2: {
    title: "What Interests You?",
    subtitle: "Select the types of cultural experiences you enjoy",
    options: [
      "Opera",
      "Theater",
      "Classical Music",
      "Contemporary Art",
      "Dance",
      "Film"
    ]
  },
  step3: {
    title: "When Do You Prefer?",
    subtitle: "Choose your ideal timing for cultural events",
    options: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June"
    ]
  }
}

export function QuizSteps() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selections, setSelections] = useState({
    location: '',
    interests: [] as string[],
    month: ''
  })

  const currentStepData = quizData[`step${currentStep}` as keyof typeof quizData]

  const handleLocationSelect = (location: string) => {
    setSelections(prev => ({ ...prev, location }))
    setTimeout(() => setCurrentStep(2), 500)
  }

  const handleInterestSelect = (interest: string) => {
    setSelections(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) 
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleMonthSelect = (month: string) => {
    setSelections(prev => ({ ...prev, month }))
    setTimeout(() => setCurrentStep(4), 500)
  }

  const buildResultsUrl = () => {
    const params = new URLSearchParams()
    if (selections.location) params.append('location', selections.location)
    if (selections.interests.length > 0) params.append('interests', selections.interests.join(','))
    if (selections.month) params.append('month', selections.month)
    return `/events?${params.toString()}`
  }

  if (currentStep === 4) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl"
        >
          <h1 className="text-5xl font-light text-gray-900 mb-8">
            Perfect!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            We found events that match your preferences
          </p>
          <Link
            href={buildResultsUrl()}
            className="inline-block bg-black text-white px-12 py-4 text-lg font-medium hover:bg-gray-800 transition-colors duration-200 rounded-sm"
          >
            View Your Events
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      {/* Back Link */}
      <div className="absolute top-8 left-8">
        <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">
          ← Back to Home
        </Link>
      </div>
      
      <div className="max-w-6xl mx-auto text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-tight">
              {currentStepData?.title}
            </h1>
            <p className="text-lg text-gray-600 mb-16 font-light">
              {currentStepData?.subtitle}
            </p>
            
            {/* Floating Options */}
            <div className="relative min-h-[400px] flex items-center justify-center">
              {currentStep === 1 ? (
                <FloatingLocationStep 
                  onLocationSelect={handleLocationSelect}
                  selectedLocation={selections.location}
                />
              ) : currentStep === 2 ? (
                <FloatingInterestStep 
                  onInterestSelect={handleInterestSelect}
                  selectedInterests={selections.interests}
                />
              ) : currentStep === 3 ? (
                <FloatingMonthStep 
                  onMonthSelect={handleMonthSelect}
                  selectedMonth={selections.month}
                />
              ) : null}
            </div>
            
            {/* Continue Button for Step 2 */}
            {currentStep === 2 && selections.interests.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12"
              >
                <button
                  onClick={() => setCurrentStep(3)}
                  className="bg-black text-white px-8 py-3 rounded-sm hover:bg-gray-800 transition-colors"
                >
                  Continue
                </button>
              </motion.div>
            )}
            
          </motion.div>
        </AnimatePresence>
        
        {/* Progress Indicator */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
          <div className="flex justify-center space-x-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-8 h-1 rounded ${
                  step <= currentStep ? 'bg-gray-900' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}