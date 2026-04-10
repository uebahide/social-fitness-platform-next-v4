# Social Fitness Platform

A fitness tracking app with social features built with React / Next.js.
This repository is published as a **portfolio project for a React Junior Developer position**, while also being continuously improved as an active personal development project.

---

## ✨ Key Features

- **Authentication (Supabase Auth)**
  - Sign up / log in / log out with email
- **Activity Management**
  - Create, edit, and delete activities
  - Category-based inputs (distance / duration / location, etc.)
  - Paginated activity list
- **Analytics Dashboard**
  - Time-range summaries (7 / 30 / 60 / 90 days)
  - Visualization of distance, duration, and category trends
- **Social Features**
  - User search
  - Friend requests / approval / rejection
  - View friends’ activities
- **Messaging**
  - Create 1-on-1 chat rooms
  - Send and receive messages
  - Realtime subscriptions
- **Profile**
  - Edit profile
  - Upload avatar
- **Other**
  - Weather card (location-based)
  - Dashboard UI centered around a sidebar layout

---

## 🧱 Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling/UI**: Tailwind CSS v4, shadcn/ui, Radix UI
- **Backend/BaaS**: Supabase (Auth / Database / Storage / Realtime)
- **Charts**: Recharts
- **Validation**: Zod
- **Lint**: ESLint

---

## 🌐 Public Demo

The app is also available as a public deployment for portfolio review:

- https://social-fitness-platform-next-v4.vercel.app/

### Reviewer Access Notes

- Authentication is required. Unauthenticated access is redirected to `/login`.
- Use the public demo account for review:
  - Email: `hidekazu.ueba@example.com`
  - Password: `password`
- If sign-up is enabled in the current environment, reviewers can create an account from `/register`.
- After signing in, reviewers can inspect the main authenticated flows: activity tracking, analytics, friend search/requests, messaging, profile editing, and the weather card on the home screen.
- This repository does not store deployment-specific secrets. If you share the hosted app for review, only use demo-safe credentials and demo-safe data.

### Vercel Deployment Notes

To reproduce the public demo deployment on Vercel, configure these environment variables in the Vercel project:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_hosted_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_hosted_supabase_publishable_key
APP_URL=https://social-fitness-platform-next-v4.vercel.app
```

Notes:

- `NEXT_PUBLIC_SUPABASE_URL` should point to the hosted Supabase project used by the public demo.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` should be the publishable/anon key for that hosted Supabase project.
- `APP_URL` must match the public Vercel deployment URL so email auth redirects resolve correctly in production.
- Do not expose service role keys in client-facing Vercel environment variables.
- Only use demo-safe data and demo-safe credentials in the public deployment.

---

## 🏗 Reviewer Notes: Architecture and Performance

### Architecture at a glance

- **App Router separation**
  - Server-rendered routes handle auth-aware data loading and page composition.
  - Client components are used where browser APIs, form state, or live subscriptions are required.
- **Why Supabase is the backend**
  - Supabase keeps auth, relational data, storage, and realtime messaging in one stack, which keeps the project scope realistic for a solo portfolio app while still covering full-stack concerns.
- **Why React Query is used**
  - React Query is used selectively for client-only fetches that benefit from built-in loading/error state, request cancellation, retry handling, and short-lived caching.
  - In this project that mainly applies to browser-driven data such as weather/geolocation and user search, where server rendering is not the best fit.
- **Caching and invalidation strategy**
  - React Query provides a small client cache with a `30s` `staleTime` for those browser-driven queries.
  - Server Actions call `revalidatePath(...)` after writes so pages backed by server-rendered data refresh predictably after activity, friend, or profile mutations.
  - Messaging is handled differently: the app loads initial room data, then keeps it fresh through realtime events instead of polling-based refetch loops.
- **Why Supabase Realtime is used in messaging**
  - Messaging needs low-latency updates for new messages, edits, deletes, read state, and reactions.
  - Supabase Realtime private channels allow the UI to stay synchronized across participants without repeatedly polling the database.

### Home page Lighthouse notes

Mobile Lighthouse audit for the public demo home page on **April 10, 2026**:

- **Performance / Accessibility / Best Practices / SEO**: `83 / 92 / 96 / 63`
- **First Contentful Paint**: `1.4s`
- **Largest Contentful Paint**: `2.4s`
- **Speed Index**: `3.3s`
- **Time to Interactive**: `4.4s`
- **Total Blocking Time**: `530ms`
- **Server Response Time**: `90ms`
- **Cumulative Layout Shift**: `0`

Desktop Lighthouse audit for the same page on **April 10, 2026**:

- **Performance / Accessibility / Best Practices / SEO**: `99 / 92 / 96 / 63`
- **First Contentful Paint**: `0.5s`
- **Largest Contentful Paint**: `0.5s`
- **Speed Index**: `1.1s`
- **Time to Interactive**: `1.0s`
- **Total Blocking Time**: `70ms`
- **Server Response Time**: `61ms`
- **Cumulative Layout Shift**: `0`

Interpretation:

- The home page is already fast on desktop: server response, first paint, interactivity, and layout stability are all in a strong range.
- The mobile audit shows that the remaining cost is mostly front-end work after first paint, while the desktop audit shows that raw speed is no longer the main concern.
- The more important reviewer-facing gaps are now asset efficiency, runtime correctness, and a few accessibility / SEO issues.

Main improvement opportunities identified by the audits:

- Reduce home-page client JavaScript and main-thread work on mobile.
- Optimize oversized images, especially the Supabase-hosted avatar image and the oversized logo asset used on the home page.
- Investigate the production console error (`Minified React error #418`) reported during the desktop audit.
- Reduce DOM size and avoid forced reflow hotspots on the home screen.
- Fix accessibility issues found in the desktop audit, including low-contrast timestamp text and list markup where anchor tags are used directly under a `ul`.
- Review SEO defaults for the deployed demo, because the desktop audit reported `noindex`, which suppresses crawlability and lowers the SEO score.
- Increase cache lifetime for stable assets where appropriate; the desktop audit also flagged limited caching and back/forward cache blockers.

Audit caveat:

- The Lighthouse runs should be treated as reviewer-facing guidance rather than a final lab baseline, because browser extensions and deployment-level headers can influence a public-demo audit.

### Activity page Lighthouse notes

Mobile Lighthouse audit for the public demo activity page on **April 10, 2026**:

- **Performance / Accessibility / Best Practices / SEO**: `93 / 87 / 96 / 63`
- **First Contentful Paint**: `1.1s`
- **Largest Contentful Paint**: `1.7s`
- **Speed Index**: `4.3s`
- **Time to Interactive**: `3.8s`
- **Total Blocking Time**: `234ms`
- **Server Response Time**: `124ms`
- **Cumulative Layout Shift**: `0`

Desktop Lighthouse audit for the public demo activity page on **April 10, 2026**:

- **Performance / Accessibility / Best Practices / SEO**: `99 / 87 / 96 / 63`
- **First Contentful Paint**: `0.3s`
- **Largest Contentful Paint**: `0.4s`
- **Speed Index**: `1.1s`
- **Time to Interactive**: `0.4s`
- **Total Blocking Time**: `10ms`
- **Server Response Time**: `80ms`
- **Cumulative Layout Shift**: `0`

Interpretation:

- The `/activity` page is already very fast on desktop, with excellent paint, interactivity, and layout stability metrics.
- The mobile audit shows that the remaining cost is mostly client-side JavaScript and main-thread work after first paint, not server latency or layout instability.
- The remaining reviewer-facing issues are less about raw rendering speed and more about JavaScript efficiency, accessibility semantics, runtime correctness, and indexability.

Main improvement opportunities identified by the audits:

- Investigate the production console error (`Minified React error #418`) reported from the shared Next.js client bundle.
- Reduce mobile main-thread work and JavaScript execution cost on the activity screen, especially from the larger shared Next.js chunks.
- Trim unused JavaScript loaded on this route; the mobile audit estimated roughly `175 KiB` of avoidable script payload.
- Reduce oversized media on the activity screen, especially the Supabase avatar PNG and the oversized logo asset.
- Add accessible names to the icon-only category filter links.
- Add an accessible label for the date range `<select>` control.
- Improve contrast for low-contrast activity timestamp text.
- Review SEO defaults for the deployed demo, because the activity page also reported `noindex`, which suppresses crawlability and lowers the SEO score.
- Increase cache lifetime for stable avatar and media assets where appropriate; the activity audit also flagged limited caching and back/forward cache blockers.

### Friend list page Lighthouse notes

Mobile Lighthouse audit for the public demo friend list page on **April 10, 2026**:

- **Performance / Accessibility / Best Practices / SEO**: `93 / 89 / 100 / 60`
- **First Contentful Paint**: `1.2s`
- **Largest Contentful Paint**: `1.6s`
- **Speed Index**: `4.5s`
- **Time to Interactive**: `2.5s`
- **Total Blocking Time**: `220ms`
- **Server Response Time**: `70ms`
- **Cumulative Layout Shift**: `0`

Interpretation:

- The `/friend/friend-list` page remains strong on mobile, with fast first paint, stable layout, and a solid overall performance score.
- The mobile bottleneck is now clearly client-side work after first paint: JavaScript execution, main-thread work, and render delay dominate the remaining slowdown rather than server latency.
- Compared with the desktop run, this mobile audit is much more script-heavy than image-heavy, so the main reviewer-facing issues are JavaScript efficiency, accessibility semantics for chat actions, and crawlability.

Main improvement opportunities identified by the audit:

- Add accessible names to the icon-only chat buttons and their surrounding message links in the friend list.
- Add a `<main>` landmark so assistive technology can identify the primary content region.
- Reduce mobile main-thread work on this route, especially the larger shared Next.js chunks and post-render client work.
- Trim unused JavaScript loaded on the page; the mobile audit estimated roughly `254 KiB` of avoidable script payload.
- Review SEO defaults for the deployed demo, because the friend list page still reported `noindex`, which suppresses crawlability and lowers the SEO score.
- Review cache and navigation behavior for repeat visits, because the audit still flagged back/forward cache blockers caused by `no-store` responses.

Desktop Lighthouse audit for the public demo friend list page on **April 10, 2026**:

- **Performance / Accessibility / Best Practices / SEO**: `100 / 90 / 100 / 63`
- **First Contentful Paint**: `0.4s`
- **Largest Contentful Paint**: `0.5s`
- **Speed Index**: `1.1s`
- **Time to Interactive**: `0.5s`
- **Total Blocking Time**: `0ms`
- **Server Response Time**: `80ms`
- **Cumulative Layout Shift**: `0`

Interpretation:

- The `/friend/friend-list` page is already extremely fast on desktop, with excellent paint, interactivity, and layout stability metrics.
- The remaining performance work is mostly about payload efficiency rather than runtime responsiveness, because the route still transfers a large amount of image and JavaScript data despite near-instant interaction metrics.
- The remaining reviewer-facing issues are accessibility semantics for chat actions, image efficiency, and crawlability rather than raw desktop rendering speed.

Main improvement opportunities identified by the audit:

- Add accessible names to the icon-only chat buttons and their surrounding message links in the friend list.
- Add a `<main>` landmark so assistive technology can identify the primary content region.
- Reduce oversized media on this route, especially the Supabase avatar PNG and the oversized logo asset.
- Trim unused JavaScript loaded on the page; the desktop audit estimated roughly `255 KiB` of avoidable script payload.
- Review SEO defaults for the deployed demo, because the friend list page also reported `noindex`, which suppresses crawlability and lowers the SEO score.
- Increase cache lifetime for stable avatar assets where appropriate; the audit flagged limited caching and back/forward cache blockers.

### Friend search page Lighthouse notes

Mobile Lighthouse audit for the public demo friend search page on **April 10, 2026**:

- **Performance / Accessibility / Best Practices / SEO**: `96 / 98 / 100 / 60`
- **First Contentful Paint**: `1.0s`
- **Largest Contentful Paint**: `1.3s`
- **Speed Index**: `2.7s`
- **Time to Interactive**: `2.3s`
- **Total Blocking Time**: `200ms`
- **Server Response Time**: `70ms`
- **Cumulative Layout Shift**: `0`

Interpretation:

- The `/friend/search` page remains solid on mobile, with fast first paint, stable layout, and a strong overall Lighthouse profile.
- Compared with the desktop run, the mobile bottleneck is now clearly JavaScript work after first paint: script evaluation, parsing, and other main-thread activity dominate the remaining slowdown.
- The main reviewer-facing issues on this route are semantic structure, mobile JavaScript efficiency, and crawlability rather than server latency or layout instability.

Main improvement opportunities identified by the audit:

- Add a `<main>` landmark so assistive technology can identify the primary content region.
- Reduce mobile main-thread work on this route, especially the larger shared Next.js chunks and post-render client work.
- Trim unused JavaScript loaded on the page; the mobile audit estimated roughly `192 KiB` of avoidable script payload.
- Review the largest shared JavaScript bundles on this route, especially `_next/static/chunks/3a7ba59533961d35.js`, `_next/static/chunks/6e90ec01f2764c99.js`, and `_next/static/chunks/6916db1c387ba7c0.js`.
- Review SEO defaults for the deployed demo, because the search page still reported `noindex`, which suppresses crawlability and lowers the SEO score.
- Keep the route’s fast server response and zero layout shift, since those are already strong on mobile and should not regress.

Desktop Lighthouse audit for the public demo friend search page on **April 10, 2026**:

- **Performance / Accessibility / Best Practices / SEO**: `99 / 98 / 100 / 63`
- **First Contentful Paint**: `0.4s`
- **Largest Contentful Paint**: `0.5s`
- **Speed Index**: `1.4s`
- **Time to Interactive**: `0.5s`
- **Total Blocking Time**: `0ms`
- **Server Response Time**: `70ms`
- **Cumulative Layout Shift**: `0`

Interpretation:

- The `/friend/search` page is already very fast on desktop, with near-instant paint, zero blocking time, and stable layout.
- The remaining performance cost is dominated by asset weight rather than runtime responsiveness, especially oversized images and a few larger shared JavaScript chunks.
- The reviewer-facing issues on this route are mostly semantic structure, media efficiency, cache policy, and crawlability rather than interaction speed.

Main improvement opportunities identified by the audit:

- Add a `<main>` landmark so assistive technology can identify the primary content region.
- Reduce oversized images on this route, especially the Supabase avatar PNG and the oversized logo asset.
- Serve the avatar in a more efficient format or compression level and size it responsively for its displayed dimensions.
- Trim unused JavaScript loaded on the page; the desktop audit estimated roughly `173 KiB` of avoidable script payload.
- Review SEO defaults for the deployed demo, because the search page also reported `noindex`, which suppresses crawlability and lowers the SEO score.
- Increase cache lifetime for stable avatar assets where appropriate; the audit estimated roughly `292 KiB` in repeat-visit cache savings and also flagged back/forward cache blockers caused by `no-store` responses.

### Message page Lighthouse notes

Desktop Lighthouse audit for the public demo message page on **April 10, 2026**:

- **Performance / Accessibility / Best Practices / SEO**: `99 / 97 / 100 / 63`
- **First Contentful Paint**: `0.3s`
- **Largest Contentful Paint**: `0.5s`
- **Speed Index**: `1.3s`
- **Time to Interactive**: `0.5s`
- **Total Blocking Time**: `0ms`
- **Server Response Time**: `80ms`
- **Cumulative Layout Shift**: `0`

Interpretation:

- The `/message` page is already extremely fast on desktop, with near-instant paint, zero blocking time, and stable rendering.
- The remaining performance cost is dominated by payload efficiency rather than runtime responsiveness, especially oversized images and several large shared JavaScript bundles.
- The remaining reviewer-facing issues are accessibility semantics in the conversation list, image delivery, cache policy, and crawlability rather than raw desktop rendering speed.

Main improvement opportunities identified by the audit:

- Add a `<main>` landmark so assistive technology can identify the primary content region.
- Fix the heading hierarchy in the conversation list, where the sidebar currently skips heading order.
- Reduce oversized media on this route, especially the Supabase avatar PNG and the oversized logo asset.
- Serve the avatar in a more efficient format or compression level and size it responsively for its displayed dimensions.
- Trim unused JavaScript loaded on the page; the desktop audit estimated roughly `160 KiB` of avoidable script payload.
- Review SEO defaults for the deployed demo, because the message page also reported `noindex`, which suppresses crawlability and lowers the SEO score.
- Increase cache lifetime for stable avatar assets where appropriate; the audit estimated roughly `292 KiB` in repeat-visit cache savings and also flagged back/forward cache blockers related to `no-store` responses and WebSocket usage.

---

## 📁 Directory Structure (Excerpt)

```text
app/
  (auth)/        # Login / signup
  (home)/        # Home (profile / weather / friends' activity)
  activity/      # Activity list & analytics
  friend/        # Friend management & search
  message/       # Messaging features
  profile/       # Profile editing
  api/           # Some API routes
components/      # UI / forms / cards
contexts/        # User/Categories providers
hooks/           # Realtime hooks, etc.
lib/             # Supabase client, server helpers
types/           # API / domain types
```

---

## 🚀 Setup

### 1) Install dependencies

```bash
npm install
```

### 2) Create environment variables

Create `.env.local` at the project root and set the following values:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_or_publishable_key
APP_URL=http://127.0.0.1:3000
```

> `APP_URL` is used as the redirect destination for email authentication.

### 3) Start the development server

```bash
npm run dev
```

Open `http://127.0.0.1:3000` in your browser.

---

## 🛠 Available Commands

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run start  # Start production server
npm run lint   # Run ESLint
npm run seed:users      # Create demo auth users and profile rows
npm run seed:friends    # Create demo friendships between seeded users
npm run seed:activities # Create demo activities for seeded users
```

---

## 🗃 Supabase Schema and Seed Data

This repository now includes the database schema and base seed data required to run the app locally:

- `supabase/migrations/*`
  - Full database schema, RPC functions, RLS policies, and storage setup
- `supabase/seed.sql`
  - Base category seed data used by the app
- `scripts/seed-users.mjs`
  - Creates demo auth users and corresponding `profiles` rows
- `scripts/seed-friends.mjs`
  - Creates idempotent friendship records between seeded profiles
- `scripts/seed-activities.mjs`
  - Creates realistic demo activities for seeded users

The three Node seed scripts are intentionally separate from `supabase/seed.sql` because they rely on app-level Supabase access patterns instead of static SQL alone.

---

## 💻 Local Supabase Setup

### Prerequisites

- Node.js
- Docker Desktop (required by the Supabase CLI local stack)
- Supabase CLI

If you do not have the CLI yet:

```bash
brew install supabase/tap/supabase
```

### 1) Start local Supabase

```bash
supabase start
```

This project includes `supabase/config.toml`, so the local stack will use the repository's checked-in configuration.

### 2) Apply migrations and SQL seed data

For a clean local database:

```bash
supabase db reset
```

This applies all files in `supabase/migrations` and then runs `supabase/seed.sql`.

To apply bucket definitions from `supabase/config.toml` locally as well:

```bash
supabase seed buckets --local
```

### 3) Copy local Supabase credentials into `.env.local`

Run:

```bash
supabase status
```

Then set `.env.local` like this:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_local_publishable_key
APP_URL=http://127.0.0.1:3000
SEED_USER_PASSWORD=password
```

Notes:

- Use the `API URL` and `anon key`/`publishable key` shown by `supabase status`
- `SEED_USER_PASSWORD` is optional, but setting it explicitly makes the local demo login credentials clear
- Local auth confirmations are disabled in `supabase/config.toml`, so seeded users can sign in immediately

### 4) Seed demo users

```bash
npm run seed:users
```

This script:

- creates demo users in Supabase Auth
- creates or updates matching rows in `public.profiles`
- uses the shared password from `SEED_USER_PASSWORD` or falls back to `password`

Demo users use emails like:

- `hidekazu.ueba@example.com`
- `alex.walker@example.com`
- `mia.summers@example.com`

### 5) Seed demo friendships

```bash
npm run seed:friends
```

This script:

- reads the seeded `profiles` rows by email
- creates bidirectional rows in `public.friends`
- skips friendships that already exist, so it can be rerun safely
- ensures `hidekazu.ueba@example.com` has at least 10 seeded friends

### 6) Seed demo activities

```bash
npm run seed:activities
```

This script:

- reads seeded profiles and categories
- signs in as each demo user
- inserts up to 20 activities per user
- skips users who already have enough activity data

### 7) Start the app

```bash
npm run dev
```

Open `http://127.0.0.1:3000`.

---

## 🌱 Recommended Local Onboarding Flow

For anyone cloning this project and wanting a fully working local dataset, the recommended flow is:

```bash
npm install
supabase start
supabase db reset
supabase status
# update .env.local with the local URL and publishable key
npm run seed:users
npm run seed:friends
npm run seed:activities
npm run dev
```

If you want to rebuild the local dataset from scratch later, rerun:

```bash
supabase db reset
supabase seed buckets --local
npm run seed:users
npm run seed:friends
npm run seed:activities
```

---

## ☁️ Using a Hosted Supabase Project

If you prefer a hosted Supabase project instead of the local CLI stack, set `.env.local` to your hosted project's values:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
APP_URL=http://127.0.0.1:3000
SEED_USER_PASSWORD=password
```

Then:

1. Apply the schema from `supabase/migrations` to that project
2. Insert base categories from `supabase/seed.sql`
3. Run `npm run seed:users`
4. Run `npm run seed:activities`

The seed scripts only require a publishable key because they create demo users through normal auth flows and then insert data while signed in as those users.

---

## 🗃 Main Supabase Resources

This app assumes the following Supabase resources are set up:

- Authentication (Email/Password)
- Tables (examples)
  - `profiles`
  - `categories`
  - `activities`
  - `activity_details`
  - `friend_requests`
  - `friends`
  - `rooms`
  - `room_user`
  - `messages`
- Storage bucket
  - `avatars`
- RPC (example)
  - `are_users_in_same_room`

---

## 🎯 What to Focus on in This Portfolio

- Server/client responsibility separation with App Router
- Integrated authentication + CRUD + Realtime using Supabase
- UI component modularization and reusability
- Continuous feature expansion as an actively maintained solo project

---

## 📄 License

No license is currently set because this project is intended for personal development and portfolio purposes.
A license can be added as needed.
