# ARCHITECTURE OVERVIEW

## System Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     BROWSER (User)                       │
├─────────────────────────────────────────────────────────┤
│  React Components (Next.js App Router)                  │
│  ├── Multi-Page Discovery Flow                          │
│  │   ├── Home (/) - Location Selection                  │
│  │   ├── Month (/month) - Month Selection               │
│  │   ├── Category (/category) - Event Type Selection    │
│  │   └── Results (/results) - Event Listing + Filters  │
│  ├── Event Detail Page (/event/[id]) - Template-based   │
│  └── Venue Dashboard (Analytics)                        │
│                                                          │
│  State Management (Zustand)                             │
│  ├── quizStore (location, month, type)                  │
│  ├── authStore (user, token)                            │
│  └── filterStore (radius, sorting)                      │
└──────────────┬──────────────────────────────────────────┘
               │ HTTP / WebSocket
               ▼
┌─────────────────────────────────────────────────────────┐
│         VERCEL (Next.js Backend)                        │
├─────────────────────────────────────────────────────────┤
│  API Routes (/api/*)                                    │
│  ├── /api/locations       → GET locations with counts   │
│  ├── /api/months          → GET months filtered by loc  │
│  ├── /api/categories      → GET categories filtered     │
│  ├── /api/events          → GET events, all filters     │
│  ├── /api/reviews         → POST new review             │
│  ├── /api/auth            → Supabase Auth bridge        │
│  ├── /api/sync            → Manual Eventbrite sync      │
│  └── /api/seed            → CSV upload endpoint         │
│                                                          │
│  Server-Side Rendering (SSR)                           │
│  ├── Event detail pages (SEO)                           │
│  ├── Venue detail pages (schema.org markup)             │
│  └── Blog/venue guides (auto-generated)                 │
└──────────────┬──────────────────────────────────────────┘
               │ HTTPS
               ▼
┌─────────────────────────────────────────────────────────┐
│     SUPABASE (Postgres Database + Auth)                 │
├─────────────────────────────────────────────────────────┤
│  Tables:                                                │
│  ├── users              → Email, quiz responses         │
│  ├── locations          → Cities/neighborhoods          │
│  ├── event_types        → Theater, opera, concert       │
│  ├── venues             → Theaters, concert halls       │
│  ├── events             → Individual shows              │
│  ├── reviews            → User feedback                 │
│  ├── months             → January-December             │
│  └── event_count_* (views) → Aggregates for quiz       │
│                                                          │
│  Auth:                                                  │
│  ├── Magic link signup/signin                           │
│  ├── Session management (JWT)                           │
│  └── Row-Level Security (RLS) policies                  │
│                                                          │
│  Storage:                                               │
│  ├── Event images                                       │
│  ├── Venue photos                                       │
│  └── Blog post assets                                   │
│                                                          │
│  Edge Functions (Serverless):                           │
│  ├── Daily Eventbrite sync (cron)                       │
│  └── Review sentiment analysis (webhook)                │
└──────────────┬──────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────┐
│     EXTERNAL INTEGRATIONS                               │
├─────────────────────────────────────────────────────────┤
│  ├── Eventbrite API      → Event data sync              │
│  ├── Ticketmaster API    → Ticketed events              │
│  ├── Affiliate links     → Eventbrite, Ticketmaster     │
│  ├── Resend/SendGrid     → Email notifications          │
│  ├── Vercel Analytics    → User behavior tracking       │
│  └── PostHog             → Product events (optional)    │
└─────────────────────────────────────────────────────────┘
```

---

## DATA FLOW (Multi-Page Discovery Flow)

### Home Page (/) - Location Selection

```
User visits /
  ↓
GET /api/locations
  ↓
SELECT id, name, COUNT(events.id) as event_count
FROM locations
LEFT JOIN events ON locations.id = events.location_id
GROUP BY locations.id
  ↓
Render floating location cloud (sized by event_count)
  ↓
User clicks "Downtown"
  ↓
Store in Zustand: quizStore.setLocation('loc_001')
  ↓
Navigate to /month with smooth animation
```

### Month Page (/month) - Month Selection

```
Route guard: redirect to / if no location selected
  ↓
GET /api/months?location=loc_001
  ↓
SELECT EXTRACT(month FROM date) as month_index,
       to_char(date, 'Month') as month_label,
       COUNT(*) as event_count
FROM events
WHERE location_id = 'loc_001'
GROUP BY month_index, month_label
  ↓
Render month cloud + breadcrumbs (location editable)
  ↓
User clicks "March"
  ↓
Store in Zustand: quizStore.setMonth(3)
  ↓
Navigate to /category with crossfade animation
```

### Category Page (/category) - Event Type Selection

```
Route guard: redirect to appropriate step if incomplete
  ↓
GET /api/categories?location=loc_001&month=3
  ↓
SELECT categories.id, categories.name, COUNT(*) as event_count
FROM categories
JOIN events ON categories.id = events.category_id
WHERE events.location_id = 'loc_001'
  AND EXTRACT(month FROM events.date) = 3
GROUP BY categories.id, categories.name
  ↓
Render category cloud + breadcrumbs (location & month editable)
  ↓
User clicks "Theater"
  ↓
Store in Zustand: quizStore.setCategory('theater')
  ↓
Navigate to /results with slide-up animation
```

### Results Page (/results) - Event Listing + Filters

```
Route guard: redirect to incomplete step if any filter missing
  ↓
GET /api/events?location=loc_001&month=3&category=theater&radius=10&free=false&accessible=false
  ↓
SELECT events.*, venues.name as venue_name, venues.lat, venues.lng
FROM events
JOIN venues ON events.venue_id = venues.id
WHERE events.location_id = 'loc_001'
  AND EXTRACT(month FROM events.date) = 3
  AND events.category_id = 'theater'
  AND ST_DWithin(venues.location, user_location, radius_km)
  -- Additional filters applied as needed
  ↓
Render event grid + filters panel + breadcrumbs (all editable)
  ↓
User applies filters → real-time updates via same API
  ↓
User clicks event → Navigate to /event/[id]
```

### Event Detail Page (/event/[id])

```
Server-side render for SEO
  ↓
SELECT events.*, venues.*, categories.name as category_name
FROM events
JOIN venues ON events.venue_id = venues.id
JOIN categories ON events.category_id = categories.id
WHERE events.id = 'event_123'
  ↓
Generate metadata (title, description, schema.org)
  ↓
Render event detail with booking CTA
  ↓
User clicks "Book on official site" → external link + analytics
```

---

## Component Hierarchy (Atomic Design)

### Multi-Page Discovery Flow Structure

```
src/app/
├── page.tsx (Home - Location Selection)
│   ├── HeroSection (Organism)
│   └── LocationCloud (Organism)
│       └── CloudBase (Molecule)
│           └── CloudItem (Atom) × N
│
├── month/page.tsx (Month Selection)
│   ├── FilterBreadcrumbs (Molecule)
│   └── MonthCloud (Organism)
│       └── CloudBase (Molecule)
│           └── CloudItem (Atom) × N
│
├── category/page.tsx (Category Selection)
│   ├── FilterBreadcrumbs (Molecule)
│   └── CategoryCloud (Organism)
│       └── CloudBase (Molecule)
│           └── CloudItem (Atom) × N
│
├── results/page.tsx (Event Listing + Filters)
│   ├── FilterBreadcrumbs (Molecule)
│   ├── FiltersPanel (Organism)
│   │   ├── RangeSlider (Atom)
│   │   └── Toggle (Atom) × N
│   └── ResultsList (Organism)
│       └── EventCard (Molecule) × N
│           ├── EventImage (Atom)
│           ├── EventTitle (Atom)
│           ├── EventMeta (Atom)
│           └── EventPrice (Atom)
│
└── event/[id]/page.tsx (Event Detail)
    ├── EventHeader (Organism)
    ├── EventDetails (Organism)
    ├── EventMeta (Molecule)
    └── EventActions (Molecule)
        ├── BookButton (Atom)
        └── SecondaryActions (Molecule)
```

### Shared Components Library

```
src/components/
├── animations/
│   ├── PageTransition.tsx (Page route animations)
│   └── CloudAnimation.tsx (Cloud item animations)
│
├── ui/
│   ├── CloudBase.tsx (Abstract cloud component)
│   ├── FilterBreadcrumbs.tsx (Navigation breadcrumbs)
│   ├── Button.tsx (Atom)
│   ├── Card.tsx (Atom)
│   ├── Modal.tsx (Organism)
│   └── ErrorBoundary.tsx (Organism)
│
└── layout/
    ├── Header.tsx (Organism)
    └── Footer.tsx (Organism)
```

---

## State Management Strategy

### Global State (Zustand)

```typescript
// Enhanced Quiz state (needed across multiple pages)
useQuizStore
├── filters: { location: string | null, month: number | null, category: string | null }
├── cachedData: { locations: Location[], months: Month[], categories: Category[] }
├── actions: setLocation(), setMonth(), setCategory(), reset()
├── cache actions: setCachedLocations(), setCachedMonths(), setCachedCategories()
└── URL sync: syncWithURL(), loadFromURL()

// Results filters state (for /results page)
useResultsStore
├── radius: number (1-50km, default 10)
├── freeEventsOnly: boolean
├── accessibleOnly: boolean
└── actions: setRadius(), toggleFreeEvents(), toggleAccessible()

// Auth state (needed everywhere)
useAuthStore
├── user: User | null
├── isLoading: boolean
└── actions: login(), logout(), signup()

// UI state (needed across components)
useUIStore
├── isMobileMenuOpen: boolean
├── isFiltersPanelOpen: boolean
└── actions: toggleMenu(), toggleFilters()
```

### Component-Level State (React useState)

```typescript
// Only use useState for local component concerns:
// - Form inputs
// - Toggles
// - Temporary UI state (loading, errors)

const [formData, setFormData] = useState({});
const [isSubmitting, setIsSubmitting] = useState(false);
const [error, setError] = useState(null);
```

---

## Rendering Strategy

### Server-Side Rendering (SSR) — For SEO

- Event detail pages (`/event/[id]`)
- Venue detail pages (`/venues/[slug]`)
- Blog/venue guides

**Why:** Google needs to see `<title>`, `<meta>` tags, and schema.org markup in HTML.

```typescript
// src/app/event/[id]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const event = await fetchEvent(params.id); // Server-side
  return {
    title: `${event.title} — Cultural Events`,
    description: event.description,
    openGraph: { ... },
    // Schema.org structured data for Google rich snippets
  };
}

export default async function EventPage({ params }) {
  const event = await fetchEvent(params.id);
  return <EventDetail event={event} />; // Rendered on server
}
```

### Client-Side Rendering (CSR) — For Interactivity

- Multi-page discovery flow (clicks, state changes, route guards)
- Results page filters (radius slider, toggles)
- Forms (signup, review)

```typescript
// src/app/month/page.tsx
'use client'; // Mark as client component

export default function MonthPage() {
  const { filters, setMonth } = useQuizStore();

  // Route guard: redirect if location not selected
  useEffect(() => {
    if (!filters.location) {
      router.push('/');
    }
  }, [filters.location]);

  return (
    <>
      <FilterBreadcrumbs filters={filters} />
      <MonthCloud
        selectedMonth={filters.month}
        onMonthSelect={setMonth}
      />
    </>
  );
}
```

---

## Error Boundaries

```
App Root
└── ErrorBoundary (catches React errors)
    ├── Header
    ├── Layout
    │   └── Page-specific ErrorBoundary
    │       └── Page content
    └── Footer
```

When error occurs:

1. React Error Boundary catches it
2. Shows fallback UI (nice message instead of white screen)
3. Logs to Vercel/Sentry (later, Phase 2)
4. User can still navigate

See `.docs/patterns/error-handling.md`

---

## Performance Targets

- Home page (/) load: < 1s
- Month/Category pages: < 1s (cached data helps)
- Results page render: < 2s
- Event detail page: < 1.5s (SSR helps)
- Page transitions: < 400ms (animation duration)
- Mobile interactive: < 2.5s
- Lighthouse score: > 90

Measured via Vercel Analytics + Lighthouse CI

### Optimization Strategies

- Static generation for location data at build time
- API response caching for repeated filter combinations
- Prefetch next likely page data on user interaction
- Code splitting by route for smaller initial bundles
- Image optimization for event and venue photos

---

## Deployment Flow

```
Code change in main branch
  ↓
Push to GitHub
  ↓
Vercel auto-builds
  ↓
Preview URL generated (shared in PR)
  ↓
When happy: git tag v{N}
  ↓
Option A: Deploy main (latest code)
Option B: Deploy v{N} (old version you prefer)
  ↓
Vercel switches to that ref
  ↓
Live on production
```

See `.docs/integrations/VERCEL.md`
