'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FloatingFilter } from '@/components/animations/FloatingFilter'
import { FloatingCard } from '@/components/animations/FloatingCard'
import Link from 'next/link'

const filterData = {
  locations: ["All Locations", "Innere Stadt", "Leopoldstadt", "Mariahilf", "Neubau", "Josefstadt"],
  types: ["All Types", "Opera", "Theater", "Classical Concert", "Contemporary Art", "Dance"],
  months: ["All Months", "January", "February", "March", "April", "May"],
  prices: ["All Prices", "Under €50", "€50-€100", "€100+"]
}

const mockEvents = Array.from({ length: 12 }, (_, i) => {
  const eventNames = [
    "La Traviata", "Don Giovanni", "Carmen", "Tosca", "The Magic Flute",
    "Swan Lake", "The Nutcracker", "Giselle", "Hamlet", "Macbeth", 
    "The Tempest", "Romeo and Juliet"
  ]
  
  const venues = [
    "Wiener Staatsoper", "Burgtheater", "Musikverein", "Konzerthaus",
    "Theater an der Wien", "Volkstheater", "Akademietheater", "Raimund Theater"
  ]
  
  const dates = [
    "March 12", "March 18", "April 5", "April 22", "May 8", "May 15",
    "June 3", "June 20", "July 7", "July 25", "August 10", "August 28"
  ]
  
  return {
    id: i + 1,
    title: eventNames[i],
    venue: venues[i % venues.length],
    date: dates[i],
    price: 45 + (i * 12) + Math.floor(Math.random() * 25),
    type: ["Opera", "Ballet", "Theater", "Classical Concert"][i % 4],
    location: ["Innere Stadt", "Leopoldstadt", "Mariahilf", "Neubau", "Josefstadt", "Landstraße"][i % 6]
  }
})

export function EventGrid() {
  const [activeFilters, setActiveFilters] = useState({
    location: "All Locations",
    type: "All Types", 
    month: "All Months",
    price: "All Prices"
  })

  // Get URL params on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const location = params.get('location')
      const interests = params.get('interests')
      const timing = params.get('timing')
      
      if (location && filterData.locations.includes(location)) {
        setActiveFilters(prev => ({ ...prev, location }))
      }
      if (interests) {
        const interestArray = interests.split(',')
        if (interestArray.length > 0 && filterData.types.includes(interestArray[0])) {
          setActiveFilters(prev => ({ ...prev, type: interestArray[0] }))
        }
      }
    }
  }, [])

  const handleFilterChange = (category: keyof typeof activeFilters, value: string) => {
    setActiveFilters(prev => ({ ...prev, [category]: value }))
  }

  // Filter events based on active filters
  const filteredEvents = mockEvents.filter(event => {
    if (activeFilters.location !== "All Locations" && event.location !== activeFilters.location) {
      return false
    }
    if (activeFilters.type !== "All Types" && event.type !== activeFilters.type) {
      return false
    }
    if (activeFilters.price !== "All Prices") {
      if (activeFilters.price === "Under €50" && event.price >= 50) return false
      if (activeFilters.price === "€50-€100" && (event.price < 50 || event.price > 100)) return false
      if (activeFilters.price === "€100+" && event.price <= 100) return false
    }
    return true
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-light text-gray-900">
              Cultural Events
            </Link>
            <div className="flex space-x-6 text-sm">
              <Link href="/quiz" className="text-gray-600 hover:text-gray-900">
                Quiz
              </Link>
              <span className="text-gray-900 font-medium">Events</span>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Page Title */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-tight">
            All Events
          </h1>
          <p className="text-lg text-gray-600 font-light">
            Discover upcoming cultural events across Vienna
          </p>
        </div>
        
        {/* Floating Filters */}
        <div className="mb-16">
          <div className="space-y-6">
            {/* Location Filters */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Location</h3>
              <div className="flex flex-wrap gap-3">
                {filterData.locations.map((location, index) => (
                  <FloatingFilter
                    key={location}
                    delay={index * 0.1}
                    isActive={activeFilters.location === location}
                    onClick={() => handleFilterChange('location', location)}
                  >
                    {location}
                  </FloatingFilter>
                ))}
              </div>
            </div>
            
            {/* Type Filters */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Event Type</h3>
              <div className="flex flex-wrap gap-3">
                {filterData.types.map((type, index) => (
                  <FloatingFilter
                    key={type}
                    delay={index * 0.15}
                    isActive={activeFilters.type === type}
                    onClick={() => handleFilterChange('type', type)}
                  >
                    {type}
                  </FloatingFilter>
                ))}
              </div>
            </div>
            
            {/* Month Filters */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Month</h3>
              <div className="flex flex-wrap gap-3">
                {filterData.months.map((month, index) => (
                  <FloatingFilter
                    key={month}
                    delay={index * 0.2}
                    isActive={activeFilters.month === month}
                    onClick={() => handleFilterChange('month', month)}
                  >
                    {month}
                  </FloatingFilter>
                ))}
              </div>
            </div>
            
            {/* Price Filters */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Price Range</h3>
              <div className="flex flex-wrap gap-3">
                {filterData.prices.map((price, index) => (
                  <FloatingFilter
                    key={price}
                    delay={index * 0.25}
                    isActive={activeFilters.price === price}
                    onClick={() => handleFilterChange('price', price)}
                  >
                    {price}
                  </FloatingFilter>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event, index) => (
            <FloatingCard key={event.id} delay={index * 0.1}>
              <div className="aspect-video bg-gray-100 flex items-center justify-center text-4xl">
                🎭
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-medium text-gray-900">
                    {event.title}
                  </h3>
                  <span className="text-sm text-gray-500">€{event.price}</span>
                </div>
                <p className="text-gray-600 mb-1">{event.venue}</p>
                <p className="text-sm text-gray-500 mb-1">{event.location}</p>
                <p className="text-sm text-gray-500 mb-4">{event.date}, 2025</p>
                <button className="w-full bg-black text-white py-2 px-4 rounded-sm hover:bg-gray-800 transition-colors text-sm">
                  View Details
                </button>
              </div>
            </FloatingCard>
          ))}
        </div>
        
        {/* Load More */}
        <div className="text-center mt-12">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gray-100 text-gray-900 px-8 py-3 rounded-sm hover:bg-gray-200 transition-colors"
          >
            Load More Events
          </motion.button>
        </div>
      </main>
    </div>
  )
}