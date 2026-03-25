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
- `scripts/seed-activities.mjs`
  - Creates realistic demo activities for seeded users

The two Node seed scripts are intentionally separate from `supabase/seed.sql` because they rely on Supabase Auth and sign in as demo users before inserting app data.

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

- `hidekazu_ueba@example.com`
- `alex_walker@example.com`
- `mia_summers@example.com`

### 5) Seed demo activities

```bash
npm run seed:activities
```

This script:

- reads seeded profiles and categories
- signs in as each demo user
- inserts up to 20 activities per user
- skips users who already have enough activity data

### 6) Start the app

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
npm run seed:activities
npm run dev
```

If you want to rebuild the local dataset from scratch later, rerun:

```bash
supabase db reset
npm run seed:users
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

## 🔜 Roadmap

- [ ] Resolve ESLint warnings/errors
- [ ] Improve responsive design (mobile UI optimization)
- [ ] Enhance README (screenshots, architecture diagram)
- [ ] Introduce tests (unit / E2E)
- [ ] Improve messaging (notifications, read status, group chat, etc.)

---

## 📄 License

No license is currently set because this project is intended for personal development and portfolio purposes.
A license can be added as needed.
