import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Helper function to create client (consistent with MASTER_PROMPT pattern)
export const createSupabaseClient = () => supabase

// Mock data helpers for v1 deployment (will be replaced with real Supabase queries)
export const supabaseHelpers = {
  // Mock locations for quiz
  async getLocations() {
    return [
      { id: '1', name: 'Innere Stadt', event_count: 25 },
      { id: '2', name: 'Leopoldstadt', event_count: 18 },
      { id: '3', name: 'Mariahilf', event_count: 12 },
      { id: '4', name: 'Neubau', event_count: 8 },
      { id: '5', name: 'Josefstadt', event_count: 6 }
    ]
  },

  // Mock months for quiz
  async getMonthsForLocation() {
    return [1, 2, 3, 4, 5, 6] // Jan-June 2025
  },

  // Mock event types for quiz
  async getEventTypesForLocationAndMonth() {
    return [
      { id: '1', name: 'Opera', icon: '🎭' },
      { id: '2', name: 'Classical Concert', icon: '🎼' },
      { id: '3', name: 'Theater', icon: '🎪' },
      { id: '4', name: 'Ballet', icon: '🩰' },
      { id: '5', name: 'Jazz', icon: '🎷' }
    ]
  },

  // Mock events for results
  async getEventsForQuiz() {
    const eventNames = [
      "La Traviata", "Don Giovanni", "The Magic Flute", 
      "Carmen", "Tosca", "Rigoletto",
      "Swan Lake", "The Nutcracker", "Giselle",
      "Hamlet", "Macbeth", "The Tempest"
    ]
    
    const venues = [
      "Wiener Staatsoper", "Burgtheater", "Musikverein", 
      "Konzerthaus", "Theater an der Wien", "Volkstheater",
      "Akademietheater", "Raimund Theater"
    ]
    
    const months = ["March", "April", "May", "June", "July", "August"]
    
    return Array.from({ length: 12 }, (_, i) => ({
      id: `event-${i + 1}`,
      title: eventNames[i % eventNames.length],
      venue: venues[i % venues.length],
      date: `${months[i % months.length]} ${Math.floor(Math.random() * 28) + 1}, 2025`,
      price: 35 + (i * 15) + Math.floor(Math.random() * 20),
      description: 'An extraordinary cultural experience in the heart of Vienna.',
      image: null
    }))
  }
}