// TypeScript types for Cultural Events Platform
// Based on database schema from MASTER_PROMPT.md

export interface Database {
  public: {
    Tables: {
      locations: {
        Row: Location
        Insert: Omit<Location, 'id' | 'created_at' | 'event_count'>
        Update: Partial<Omit<Location, 'id' | 'created_at'>>
      }
      event_types: {
        Row: EventType
        Insert: Omit<EventType, 'id' | 'created_at' | 'event_count'>
        Update: Partial<Omit<EventType, 'id' | 'created_at'>>
      }
      venues: {
        Row: Venue
        Insert: Omit<Venue, 'id' | 'created_at' | 'avg_rating' | 'total_reviews'>
        Update: Partial<Omit<Venue, 'id' | 'created_at'>>
      }
      events: {
        Row: Event
        Insert: Omit<Event, 'id' | 'created_at'>
        Update: Partial<Omit<Event, 'id' | 'created_at'>>
      }
      users: {
        Row: User
        Insert: Omit<User, 'created_at'>
        Update: Partial<Omit<User, 'id' | 'created_at'>>
      }
      reviews: {
        Row: Review
        Insert: Omit<Review, 'id' | 'created_at'>
        Update: Partial<Omit<Review, 'id' | 'created_at'>>
      }
    }
  }
}

// Core database entities
export interface Location {
  id: string
  name: string
  city: string
  lat?: number
  long?: number
  event_count: number
  created_at: string
}

export interface EventType {
  id: string
  name: string
  icon?: string
  event_count: number
  created_at: string
}

export interface Venue {
  id: string
  name: string
  slug: string
  location_id: string
  type?: string
  capacity?: number
  address?: string
  city: string
  lat?: number
  long?: number
  website?: string
  phone?: string
  avg_rating: number
  total_reviews: number
  created_at: string
}

export interface Event {
  id: string
  title: string
  venue_id: string
  type_id: string
  location_id: string
  date: string
  time?: string
  price?: number
  description?: string
  ticket_url?: string
  source: string
  created_at: string
}

export interface User {
  id: string
  email?: string
  quiz_responses?: QuizResponses
  subscription_tier: 'free' | 'basic' | 'premium'
  created_at: string
}

export interface Review {
  id: string
  user_id: string
  event_id: string
  would_attend_again: boolean
  review_text?: string
  rating?: number
  created_at: string
}

// Quiz-related types
export interface QuizResponses {
  era?: string[]
  venue_size?: 'intimate' | 'medium' | 'large'
  budget?: 'low' | 'medium' | 'high'
  genres?: string[]
  discovery_mode?: 'popular' | 'hidden_gems' | 'mixed'
}

export interface QuizState {
  location: string | null
  month: number | null
  type: string | null
  step: 1 | 2 | 3 | 4
}

// API response types
export interface EventWithDetails extends Event {
  venues: Venue
  event_types: EventType
  locations: Location
}

export interface VenueWithEvents extends Venue {
  events: Event[]
  locations: Location
}

export interface LocationWithCount extends Location {
  event_count: number
}

export interface EventTypeWithCount extends EventType {
  event_count: number
}

// Filter types for event listing
export interface EventFilters {
  locationId?: string
  month?: number
  typeId?: string
  priceMin?: number
  priceMax?: number
  radius?: number // in km
  userLat?: number
  userLng?: number
}

// Form validation types (Zod schemas)
export interface ReviewFormData {
  would_attend_again: boolean
  review_text?: string
  rating?: number
}

export interface UserSignupData {
  email: string
}

export interface QuizFormData {
  location: string
  month: number
  type: string
}

// Feature flag types
export interface FeatureFlags {
  RECOMMENDATIONS: boolean
  MEMBERSHIP_PAYWALL: boolean
  VENUE_ANALYTICS_PAID: boolean
  COMMUNITY_FEATURES: boolean
  INFLUENCER_PROGRAM: boolean
}

// Utility types
export type EventWithRelations = Event & {
  venues: Venue
  event_types: EventType
  locations: Location
}

export type VenueWithLocation = Venue & {
  locations: Location
}

export type ReviewWithEvent = Review & {
  events: EventWithRelations
}

// API error types
export interface ApiError {
  message: string
  code?: string
  details?: Record<string, unknown>
}

export interface ApiResponse<T> {
  data?: T
  error?: ApiError
  success: boolean
}