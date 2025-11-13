# StreamFinder

StreamFinder is a full-stack streaming discovery platform that unifies search, watchlist management, personalised recommendations, and availability data across movies and television. The project is built with Next.js 15, React 19, Supabase, Prisma, and the TMDB API, with a mobile-first interface powered by Tailwind CSS.

---

## Contents

- [Key Features](#key-features)
- [Architecture Overview](#architecture-overview)
- [Interface Highlights](#interface-highlights)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Configuration Reference](#configuration-reference)
- [Development Workflow](#development-workflow)
- [Deployment Guide](#deployment-guide)
- [Available Scripts](#available-scripts)
- [License](#license)

---

## Key Features

| Area                       | Capabilities                                                                                                  |
| -------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Search**                 | Instant search across movies, shows, and people with responsive pill-style input and mobile-friendly layouts. |
| **Home Experience**        | Curated hero rows for trending, top-rated, award contenders, comedy, family, anime, and more.                 |
| **Recommendations**        | Authenticated users receive personalised film and TV suggestions derived from their watched history.          |
| **Watchlist Management**   | Add or remove titles with one click, with season-aware grouping for episodic content.                         |
| **Watched Tracking**       | Mark films or individual seasons as completed; the interface aggregates seasons into intelligent ranges.      |
| **Streaming Availability** | Provider explorer with country selector, showing stream, rent, and buy options with official artwork.         |
| **Discovery Page**         | Genre-first explorer with media-type toggle and on-demand content refresh.                                    |
| **Authentication**         | Supabase-powered email/password and OAuth flows, hydrated across server and client via `@supabase/ssr`.       |
| **Responsive UI**          | Tailwind-driven components tuned for touch navigation, keyboard accessibility, and large displays.            |

---

## Architecture Overview

| Layer          | Technology                                    | Responsibility                                          |
| -------------- | --------------------------------------------- | ------------------------------------------------------- |
| Presentation   | Next.js 15 App Router, React 19, Tailwind CSS | Routing, UI composition, theming                        |
| Authentication | Supabase Auth (`@supabase/ssr`)               | Session creation, retrieval, and cookie synchronisation |
| Persistence    | Supabase Postgres, Prisma ORM                 | Watchlist and watched tables, recommendation seed data  |
| APIs           | TMDB REST APIs                                | Metadata, imagery, genres, providers                    |
| Data Fetching  | Server components, SWR hooks                  | SSR/CSR hybrid data loading and caching                 |

---

## Interface Highlights

- **Navbar** adapts navigation links and auth controls based on session state.
- **ScrollableSection** and **RecommendedRow** components expose wide-screen horizontal carousels with touch-friendly snapping on mobile devices.
- **Watchlist dashboard** groups TV entries by show and presents season ranges for clarity.
- **ProviderSection** surfaces availability providers per country with bundling across stream/rent/buy types.
- **AuthProvider** keeps Supabase sessions hydrated via `createBrowserClient`, syncing cookies through `/auth/callback` route handlers.

---

## Project Structure

```
streaming-search-app/
├─ prisma/
│  ├─ schema.prisma              # Prisma data model (watchlist & watched tables)
│  └─ migrations/
│     └─ recreate_tables.sql     # Supabase-compatible DDL for core tables
├─ public/                       # Static assets
└─ src/
  ├─ app/
  │  ├─ api/                    # Route handlers for auth-protected CRUD
  │  ├─ auth/                   # Sign-in & sign-up flows
  │  ├─ movie/[id]              # Movie detail page
  │  ├─ tv/[id]                 # TV detail page
  │  ├─ recommendations/        # Genre-driven discovery page
  │  ├─ search/                 # Universal search page
  │  └─ watchlist/              # Watchlist & watched dashboard
  ├─ components/                # Reusable UI elements and sections
  ├─ hooks/                     # SWR hooks for watchlist, watched, recommendations
  └─ lib/                       # Supabase, Prisma, and TMDB utilities
```

---

## Quick Start

Follow the steps below to run StreamFinder locally or in a new environment. Commands use `npm`; feel free to substitute `pnpm`, `yarn`, or `bun` if preferred.

1. **Clone the repository**

```bash
git clone https://github.com/"Your-Username"/streaming-search-app.git
cd streaming-search-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Provision Supabase**

1. Create a Supabase project (Postgres + Auth).
1. Retrieve the project URL, anon public key, pooled Postgres connection string (port `6543`), and optional direct connection string (port `5432`).
1. In the Supabase SQL Editor, execute [`prisma/migrations/recreate_tables.sql`](prisma/migrations/recreate_tables.sql) to create the `watchlist` and `watched` tables with foreign keys to `auth.users`.

1. **Create a TMDB API key**

- Register at [The Movie Database](https://www.themoviedb.org/), create a developer account, and generate a v3 API key.

5. **Configure environment variables**

Create `.env.local` in the project root:

```env
# Database (PgBouncer pooled connection recommended for Prisma in production)
DATABASE_URL="postgresql://<user>:<password>@<pooler-host>:6543/postgres?pgbouncer=true"

# Optional direct connection (useful for local introspection)
DIRECT_URL="postgresql://<user>:<password>@<direct-host>:5432/postgres"

# Supabase client configuration
NEXT_PUBLIC_SUPABASE_URL="https://<project-ref>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<anon-public-key>"

# TMDB
TMDB_API_KEY="<tmdb-api-key>"
```

> Replace the placeholders with the values from Supabase and TMDB. `.env.local` is ignored by Git by default.

6. **Generate the Prisma client**

```bash
npx prisma generate
```

7. **Start the development server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to verify the application.

---

## Configuration Reference

| Variable                        | Description                                                                      |
| ------------------------------- | -------------------------------------------------------------------------------- |
| `DATABASE_URL`                  | Supabase pooled connection string (include `?pgbouncer=true` for compatibility). |
| `DIRECT_URL`                    | Direct Postgres connection used by Prisma if available (optional).               |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL exposed to the browser.                                     |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anon key for client-side authentication.                         |
| `TMDB_API_KEY`                  | TMDB API key for metadata and artwork.                                           |

---

## Development Workflow

- **Authentication**: Sign up or sign in from `/auth/signup` or `/auth/signin`. Sessions are synced via a dedicated `/auth/callback` route.
- **Database updates**: Adjust `prisma/schema.prisma`, regenerate the Prisma client, and mirror the changes in Supabase (either via SQL migrations or manual SQL using the included scripts).
- **Watching & Watchlist**: Use the buttons on movie and TV detail pages; API routes at `/api/watchlist` and `/api/watched` handle persistence.
- **Recommendations**: Based on recent `watched` entries; consult `src/hooks/useRecommendations.ts` for the aggregation logic.

---

## Deployment Guide

1. **Environment variables**: Mirror `.env.local` values into the hosting provider (for example, Vercel → Project Settings → Environment Variables).
2. **Database readiness**: Ensure `watchlist` and `watched` tables exist in Supabase before the first deployment. The build script intentionally skips migrations to remain compatible with PgBouncer-only environments.
3. **Build command**: The default build script (`npm run build`) executes `prisma generate && next build`.
4. **Image domains**: `next.config.ts` already authorises `image.tmdb.org`; no additional configuration is required for TMDB assets.

---

## Available Scripts

```bash
npm run dev     # Start Next.js with Turbopack
npm run build   # Generate Prisma client and compile the production bundle
npm start       # Serve the production build
npm run lint    # Run ESLint with the Next.js configuration
```

Prisma utilities:

```bash
npx prisma generate   # Regenerate the typed Prisma client
npx prisma studio     # Launch the Prisma data browser
```

---

## License

StreamFinder is distributed under a proprietary license.

- **Personal Use**: Permitted for non-commercial projects.
- **Commercial Use**: Requires a separate written agreement with the copyright holder (Anish Kundu).

Refer to [`LICENSE.md`](LICENSE.md) for complete terms and conditions.
