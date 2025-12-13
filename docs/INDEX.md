# DOCUMENTATION INDEX

This file lists all the `.docs/` files you need. **You can scaffold these files now** (empty with headers), then fill them in as you build.

---

## ✅ CREATED (Ready to Use)

- [x] `.docs/MASTER_PROMPT.md` — The big one (comprehensive guide)
- [x] `.docs/SESSION_LOG.md` — Session tracking template
- [x] `.docs/architecture/overview.md` — System diagram + data flow
- [x] `.docs/integrations/SUPABASE.md` — Quick reference
- [x] `.docs/setup/local-dev.md` — 5-minute setup guide
- [x] `.docs/review/CHECKLIST.md` — Pre-commit checklist
- [x] `scripts/seed.ts` — TypeScript seed file
- [x] `git.workflow.md` — Git + versioning guide
- [x] `.docs/features/MULTI_PAGE_DISCOVERY_FLOW.md` — Word-cloud flow fixes implementation plan
- [x] `.docs/features/WORDCLOUD_ACTION_PLAN.md` — Prioritized action plan for overlap fixes

---

## 📋 SCAFFOLD THESE (Create empty, fill as you build)

### Core Architecture
```
.docs/architecture/
├── components.md           # Naming conventions, patterns
├── routing.md              # Next.js pages/routes explained
└── data-flow.md            # How data moves through app
```

**Components.md should include:**
- Atomic design pattern (atoms, molecules, organisms)
- Component naming convention
- Common patterns (lists, forms, filters)
- Props interface examples

**Routing.md should include:**
- Next.js App Router structure
- Dynamic routes [slug] pattern
- API route patterns
- File organization

**Data-flow.md should include:**
- Step-by-step data flow for quiz
- Event listing flow
- Auth flow
- Review submission flow

---

### Database
```
.docs/database/
├── schema.md               # Table definitions (created)
├── migrations.md           # How to modify schema
└── seed.md                 # Seeding strategy
```

**schema.md should include:**
- All table definitions (CREATED)
- Field types and constraints
- Indexes
- Relationships diagram
- Example queries

**migrations.md should include:**
- How to add new column
- How to add new table
- How to modify column type
- Supabase CLI workflow

**seed.md should include:**
- Initial data (locations, types)
- Test event structure
- How to reset database
- Manual CSV import process

---

### Integrations
```
.docs/integrations/
├── SUPABASE.md             # Quick reference (created)
├── NEXTJS.md               # Next.js patterns
├── VERCEL.md               # Deployment details
├── STRIPE.md               # Payment integration (Phase 2)
├── EVENTBRITE_API.md       # API schema + normalization
├── RESEND.md               # Email service
└── LEAFLET.md              # Mapping library
```

**NEXTJS.md should include:**
- App Router file structure
- SSR vs CSR decisions
- Image optimization
- Performance tips
- Common gotchas

**VERCEL.md should include:**
- Environment variables setup
- Preview deployments
- Production settings
- Monitoring/logs
- Scaling thresholds

**STRIPE.md should include:**
- Setup process
- Subscription integration
- Webhook handling
- Test mode vs live
- Error handling

**EVENTBRITE_API.md should include:**
- API endpoint reference
- Authentication
- Rate limits
- Response schemas
- Error codes
- Normalization logic (how to convert API response to your Event schema)

**RESEND.md should include:**
- Setup & API key
- Email template patterns
- Common use cases
- Testing emails
- Bounce handling

**LEAFLET.md should include:**
- Initialization
- Marker/radius drawing
- Events & interactions
- Mobile responsiveness

---

### Setup & Configuration
```
.docs/setup/
├── environment.md          # All env vars
├── local-dev.md            # Setup guide (created)
├── database-setup.md       # Creating tables + RLS
└── seeding.md              # Seed data + manual upload
```

**environment.md should include:**
- List of all env vars
- Where to get each one
- Local (.env.local) vs production (Vercel)
- Safe to commit vs secret
- Example values

**database-setup.md should include:**
- How to create tables in Supabase
- RLS policy setup
- Triggers creation
- Index creation
- Backup/restore process

**seeding.md should include:**
- Running `npm run seed:events`
- Manual CSV upload endpoint
- Clearing/resetting data
- Bulk import process

---

### Features
```
.docs/features/
├── MULTI_PAGE_DISCOVERY_FLOW.md # Word-cloud overlap fixes & flow improvements (CREATED)
├── WORDCLOUD_ACTION_PLAN.md    # 3-week prioritized action plan for fixes (CREATED)
├── 01_quiz-flow.md         # Location → Month → Type (legacy single-page)
├── 02_event-listing.md     # Event grid + filtering + radius
├── 03_event-detail.md      # Template page, schema.org
├── 04_user-auth.md         # Email signup, Supabase Auth
├── 05_reviews.md           # Post-event feedback
├── 06_venue-dashboard.md   # Free tier analytics
├── 07_blog-templates.md    # Auto-generated venue guides
└── FEATURE_FLAGS.md        # How Phase 2/3 features are gated
```

**Each feature file should include:**
- What it does (1 paragraph)
- Why Phase 1 vs Phase 2
- Key dependencies (tables, APIs, components)
- How it works (step-by-step)
- API contracts (if applicable)
- Testing checklist
- Common pitfalls

**FEATURE_FLAGS.md should include:**
- Why we use feature flags
- How to add new flag
- How to gate Phase 2 code
- Flag usage examples
- When to flip flag (Phase 2 start)

---

### Patterns & Best Practices
```
.docs/patterns/
├── error-handling.md       # Error boundary, logging
├── logging.md              # What to log, where, how
├── accessibility.md        # A11y requirements
├── performance.md          # Optimization targets
├── state-management.md     # Zustand patterns
├── api-calls.md            # How to structure API calls
└── forms.md                # Form handling patterns
```

**error-handling.md should include:**
- Error boundary component
- Client-side vs server-side errors
- Sentry setup (Phase 2)
- User-facing error messages
- Logging errors

**logging.md should include:**
- Debug logs (dev only)
- Info logs (important events)
- Error logs (bugs)
- Performance metrics
- User event tracking (analytics)

**accessibility.md should include:**
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Color contrast
- Touch targets
- Screen reader testing

**performance.md should include:**
- Page load targets
- Image optimization
- Query optimization
- Bundle size
- Lighthouse scores

**state-management.md should include:**
- Zustand store patterns
- Component state vs global state
- Store subscription patterns
- Debugging state

**api-calls.md should include:**
- Fetch vs axios
- Error handling
- Loading states
- Caching strategy
- Request deduplication

**forms.md should include:**
- React Hook Form setup
- Validation (Zod)
- Submission handling
- Error display
- Accessibility

---

### Code Review
```
.docs/review/
├── CHECKLIST.md            # Pre-commit checklist (created)
└── PERFORMANCE.md          # Metrics to track
```

**PERFORMANCE.md should include:**
- What to measure (page load, CLS, FCP)
- Tools to use (Lighthouse, DevTools)
- Thresholds (targets to hit)
- Common bottlenecks
- Optimization tips

---

### Reusable Claude Prompts
```
.claude-prompts/
├── new-page.md             # "Create a new event detail page"
├── new-feature.md          # "Add feature flag for X"
├── database-change.md      # "Add column to venues table"
├── debug-issue.md          # "Help debug this error"
├── generate-seed.md        # "Generate seed data for X events"
├── component-from-figma.md # "Create component from Figma design"
└── optimize-query.md       # "Optimize slow database query"
```

**Each .claude-prompts/ file should:**
- Describe the task (1-2 sentences)
- Include copy-paste template prompt
- Show expected output
- Link to relevant docs

---

## 📝 Example: What a Feature File Looks Like

```markdown
# Feature: Quiz Flow (Location → Month → Type Selection)

## What It Does
Users click through 3 steps to find events:
1. Select location (floating fonts sized by event count)
2. Select month (shows only months with events)
3. Select event type (shows only types with events)
4. See filtered event results

## Why Phase 1
This is the core UX. Users can't find events without it.

## Dependencies
- Database: `locations`, `event_types`, `months`, `events` tables
- State: Zustand `useQuizStore`
- Components: `LocationStep`, `MonthStep`, `TypeStep`
- API: GET `/api/events` to fetch by filter

## How It Works
1. Load /quiz page
2. Query locations, render floating fonts (sized by event_count)
3. User clicks location → store in Zustand
4. Query months WHERE location_id = selected, render grid
5. User clicks month → store in Zustand
6. Query types WHERE location_id = selected AND month = selected
7. User clicks type → navigate to /events?location=...&month=...&type=...
8. /events page fetches matching events, renders grid

## API Contracts
```
GET /api/events?location=loc_001&month=3&type=type_001&radius=5

Response:
{
  events: [
    {
      id, title, date, price, venue: { name, lat, long },
      reviews_count, avg_rating
    }
  ],
  total: 25
}
```

## Testing Checklist
- [ ] Floating fonts render
- [ ] Sizes match event counts
- [ ] Click location → filters months
- [ ] Months show zero-count months as disabled
- [ ] Click month → filters types
- [ ] Results page shows correct events
- [ ] Radius filter works (filters by distance)
- [ ] Mobile responsive
- [ ] Keyboard navigation works (Tab, Enter)

## Common Pitfalls
- Querying all events then filtering client-side (slow!)
  → Query in DB instead
- Showing all months even if location has 0 events
  → Filter to months_with_events only
- Not storing location/month in state
  → Next page won't know what user selected
```

---

## Quick Scaffold Command

Copy this into your terminal to create all empty files:

```bash
# Create .docs/ structure
mkdir -p .docs/{architecture,database,integrations,setup,features,patterns,review}
mkdir -p .claude-prompts
mkdir -p scripts

# Create empty files with headers
# (You'll add content as you build)

touch .docs/architecture/{components,routing,data-flow}.md
touch .docs/database/{schema,migrations,seed}.md
touch .docs/integrations/{NEXTJS,VERCEL,STRIPE,EVENTBRITE_API,RESEND,LEAFLET}.md
touch .docs/setup/{environment,database-setup,seeding}.md
touch .docs/features/{01_quiz-flow,02_event-listing,03_event-detail,04_user-auth,05_reviews,06_venue-dashboard,07_blog-templates,FEATURE_FLAGS}.md
touch .docs/patterns/{error-handling,logging,accessibility,performance,state-management,api-calls,forms}.md
touch .docs/review/PERFORMANCE.md
touch .claude-prompts/{new-page,new-feature,database-change,debug-issue,generate-seed,component-from-figma,optimize-query}.md
```

---

## How to Use This Index

1. **Read MASTER_PROMPT.md first** — It's your north star
2. **Scaffold all files** — Use command above
3. **Build one feature** — Read relevant feature doc
4. **Reference integration docs** — When using Supabase, Vercel, etc.
5. **Log your session** — Update SESSION_LOG.md
6. **Update docs as you build** — Keep them current

Each file is a tool. Use it when you need it.

---

## What Gets Updated Often

- `.docs/SESSION_LOG.md` — After every session
- `.docs/MASTER_PROMPT.md` — Project status section
- `.docs/features/*` — As you build each feature
- `.docs/database/schema.md` — When adding tables/columns

## What Gets Updated Rarely

- `.docs/architecture/*` — Set once, reference often
- `.docs/integrations/*` — Usually final form
- `.docs/setup/*` — Rarely changes after setup
- `.docs/patterns/*` — Established early

---

## Next Steps

1. Copy scaffold command above
2. Run it in terminal
3. Read `.docs/setup/local-dev.md`
4. Get local dev working
5. Read `MASTER_PROMPT.md`
6. Start building with Claude Code
7. Update docs as you go
