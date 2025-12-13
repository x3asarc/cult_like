g# PRE-COMMIT CHECKLIST

**Use this before every `git commit`.**

## Code Quality (5 minutes)

- [ ] **TypeScript compiles**

  ```bash
  npm run type-check
  ```

  No red squiggles in IDE

- [ ] **No console errors**

  ```bash
  npm run dev  # Start server
  # Open http://localhost:3000
  # Press F12 → Console tab
  # Should be clean (no red errors, only info logs)
  ```

- [ ] **Code is formatted**

  ```bash
  npm run format
  ```

  Then review changes: `git diff`

- [ ] **Commit message is clear**

  ```
  ✅ Good:
  feat: add quiz location selection
  docs: update schema for locations
  fix: prevent duplicate event entries

  ❌ Bad:
  update stuff
  changes
  fix it
  ```

---

## Functionality (10 minutes)

- [ ] **Feature works locally**
  - Open http://localhost:3000
  - Navigate to changed page/feature
  - Click things, fill forms
  - Verify expected behavior

- [ ] **Mobile responsive**
  - Right-click → Inspect
  - Toggle device toolbar (top left)
  - Test at 375px width (iPhone SE)
  - UI should adapt, not break

- [ ] **No hardcoded secrets**

  ```bash
  grep -r "sk_" .  # Stripe keys
  grep -r "api_key" .  # API keys
  grep -r "password" .  # Passwords
  ```

  All secrets should be in `.env.local` or Vercel

- [ ] **Database changes documented**
  - If you modified schema, update `.docs/database/schema.md`
  - If you added migration, document in `.docs/database/migrations.md`

---

## SEO (If page/content changed) (5 minutes)

- [ ] **Meta tags present**

  ```
  Right-click → View Page Source
  <title>Event Name — Cultural Events</title>
  <meta name="description" content="...">
  <link rel="canonical" href="...">
  ```

- [ ] **Schema.org markup**

  ```
  View source → Look for:
  <script type="application/ld+json">
  { "@type": "Event", ... }
  </script>
  ```

- [ ] **Image alt text**
  - All images have `alt="..."` attribute
  - Alt text describes image, includes keywords if relevant

---

## Performance (Optional, but recommended) (5 minutes)

- [ ] **Page loads in < 2 seconds**
  - Open DevTools → Network tab
  - Hard refresh (Ctrl+Shift+R)
  - Watch load time (bottom of DevTools)
  - Slow? Check for: N+1 queries, large images, missing pagination

- [ ] **No console warnings**
  - F12 → Console
  - Should only see info logs, not yellow warnings

---

## Before git push

- [ ] **All changes staged and committed**

  ```bash
  git status  # Should show nothing
  ```

- [ ] **Commit message matches what you did**

  ```bash
  git log --oneline -5  # Review last 5 commits
  ```

- [ ] **No accidental files committed**
  ```bash
  # Should not have:
  .DS_Store
  node_modules/
  .env.local
  .next/
  .vercel/
  ```
  (These are in `.gitignore`)

---

## The Super Quick Version (2 minutes)

If you're in a hurry:

```bash
# 1. Check types
npm run type-check

# 2. Test in browser
npm run dev
# Click around for 1 minute

# 3. Commit
git add .
git commit -m "[your message]"

# 4. Push
git push origin main
```

---

## After git push

- [ ] **GitHub shows green checkmark** (tests pass)
- [ ] **Vercel preview deployed** (link in GitHub PR comments)
- [ ] **Review Vercel preview**
  - Click preview link
  - Verify changes look good
  - Check mobile view

---

## When Ready to Deploy

```bash
# 1. Tag this version
git tag v{N}  # e.g., v1, v2, v3

# 2. Push tag
git push origin --tags

# 3. In Vercel dashboard
# - Go to Project → Deployments
# - Click "Promote" on the preview
# - Or manually set branch to v{N} in Settings
```

---

## Common Mistakes to Avoid

❌ **Committing secrets**

```
❌ git commit -m "add API key to .env"
✅ git commit -m "update env vars in Vercel dashboard"
```

❌ **No TypeScript errors, but runtime errors**

```
❌ // This compiles but crashes at runtime
const obj: any = {};
const val = obj.nested.deep.value;

✅ // Type-safe
const obj: { nested?: { deep?: { value?: string } } } = {};
const val = obj.nested?.deep?.value;
```

❌ **Unrelated changes in one commit**

```
❌ "fix multiple things"
   - Fixed bug in event list
   - Updated styling
   - Added new field to schema

✅ "fix: prevent duplicate events in list"
   (Only this one change, nothing else)
```

---

## Checkl ist for Code Review (If reviewing someone else)

If you're reviewing Claude Code's output:

- [ ] It solves the problem stated
- [ ] It doesn't break existing features
- [ ] TypeScript is strict
- [ ] Database queries are efficient
- [ ] SEO tags for public pages
- [ ] No hardcoded secrets
- [ ] Mobile responsive
- [ ] Clear code comments for complex logic
- [ ] Follows project conventions (naming, structure)

Approve if all ✅, otherwise request changes.
