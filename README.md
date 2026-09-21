# Trading OS

A single-user operating system for an ICT/SMC futures trading workflow: daily bias, trade
journal, calendar, analytics, weekly recaps, and a theory library — built on Next.js (App
Router) and Supabase, deployed to Vercel.

## Stack

- **Frontend**: Next.js 16 (App Router, Turbopack), TypeScript strict, Tailwind CSS v4,
  shadcn/ui (base-ui primitives), Geist Sans/Mono, Framer Motion, Recharts, TanStack Query,
  Zod, react-hook-form, react-markdown + remark-gfm, cmdk
- **Backend**: Supabase (Postgres, Auth, Storage, Row Level Security), accessed via
  `@supabase/ssr`
- **Tests**: Vitest (unit + one live RLS integration test), Playwright (e2e smoke tests)

Notion was used only as a one-time, build-time content source (`content/theory/*.md`, already
exported and committed). The running app has **zero runtime dependency on Notion** — no SDK,
no API calls, no Notion env vars anywhere in `src/`.

---

## 1. Prerequisites

- Node.js 20+
- A Supabase account and (recommended) the [Supabase CLI](https://supabase.com/docs/guides/cli)
- A Vercel account, for deployment

## 2. Supabase project

This repo is already wired to a live project (`trading-os`, ref `ypfrgpanegzmclnbygbl`,
region `eu-central-2`) with all migrations applied. To point at a **different** project
(e.g. your own, for a clean deploy):

1. Create a new project at [supabase.com/dashboard](https://supabase.com/dashboard).
2. Apply every migration in `supabase/migrations/` **in filename order** — either:
   - Via the Supabase CLI: `supabase link --project-ref <your-ref>` then
     `supabase db push`, or
   - Via the SQL Editor in the dashboard: paste and run each file's contents in order.
3. Confirm the schema with `supabase gen types typescript --project-id <your-ref>` and diff
   it against `src/lib/supabase/database.types.ts` — regenerate that file if it drifts
   (`npm run db:types`, after updating the `--project-id` in the script).

### What the migrations set up

- 20 Postgres enums mirroring `src/lib/constants/enums.ts` exactly
- 8 tables (`account_settings`, `model_rules`, `weekly_recaps`, `daily_preps`, `trades`,
  `trade_screenshots`, `theory_docs`, `theory_checklist_state`), every user-owned row
  defaulting `user_id` to `auth.uid()`
- RLS enabled and enforced on every table (owner-only CRUD; `theory_docs` is
  readable by any authenticated user, writable by its owner)
- Analytics views/functions that do the heavy math in the database:
  `trades_r` (adds the derived `r_multiple` — never stored), `equity_curve`,
  `weekly_recap_stats`, `fn_dashboard_kpis`, `fn_bias_accuracy`, and one
  `fn_stats_by_<dimension>` function per breakdown dimension
- A private `screenshots` Storage bucket, path-scoped to `{user_id}/...`
- `handle_new_user` trigger: auto-provisions a blank `account_settings` row for
  each new auth user (no numbers pre-filled)

## 3. Auth: create your one user, disable sign-ups

This is a single-user app. Public sign-ups must be **off**, and you create your own account
directly in the dashboard:

1. Supabase Dashboard → **Authentication → Providers → Email** → turn **off** "Allow new
   users to sign up".
2. Supabase Dashboard → **Authentication → Users → Add user** → create your account with
   your real email + a password (check "Auto Confirm User").
3. (Optional, for magic-link sign-in) Under **Authentication → URL Configuration**, add your
   deployed domain and `http://localhost:3000` to the redirect allow-list — the app calls back
   to `/auth/callback`.

## 4. Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project Settings → API → anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API → service_role key (**secret** — server/script only, never shipped to the client, never committed) |

## 5. Install, seed, run

```bash
npm install
npm run seed          # loads content/theory/*.md into theory_docs (requires SUPABASE_SERVICE_ROLE_KEY,
                       # and your one user must already exist — see step 3)
npm run dev            # http://localhost:3000
```

Optional demo data (off by default, adds ~50 synthetic trades over the last 8 weeks so the
dashboard/analytics/calendar aren't empty while you evaluate the app):

```bash
npm run seed:demo
```

## 6. Verification commands

```bash
npm run typecheck   # tsc --noEmit
npm run lint         # eslint
npm run test          # vitest — unit tests + one skipped-without-credentials RLS integration test
npm run build         # production build
npm run test:e2e     # playwright — set PLAYWRIGHT_TEST_EMAIL/PASSWORD to run the authenticated specs
```

## 7. Deploy to Vercel

1. Push this repo to GitHub (or GitLab/Bitbucket).
2. [vercel.com/new](https://vercel.com/new) → import the repo. Framework preset:
   Next.js (auto-detected).
3. Add the three environment variables from step 4 in **Project Settings → Environment
   Variables** (all three, for Production and Preview).
4. Deploy. Vercel builds with `next build` and serves the App Router + middleware
   (`src/proxy.ts`) automatically — no extra config needed.
5. Add the deployed domain to Supabase **Authentication → URL Configuration** (Site URL +
   Redirect URLs) so magic-link sign-in's `/auth/callback` round-trip works in production.

### Keeping the schema in sync

Whenever you add a migration file to `supabase/migrations/`, apply it to the linked project
(`supabase db push`, or paste it into the SQL Editor) **before or immediately after**
deploying the code that depends on it — there's no automatic migration-on-deploy step in
this setup.

## 8. Backups

Supabase takes automatic daily backups on paid plans (Point-in-Time Recovery on the Pro
plan and above); on the Free plan, backups are not automatic. Either way, don't rely solely
on the dashboard:

- **Schema**: already versioned as SQL in `supabase/migrations/` — a full schema rebuild is
  just replaying those files in order.
- **Data**: run `supabase db dump --data-only -f backup.sql` periodically (or via a scheduled
  GitHub Action) if you're on the Free plan, or restore from PITR on paid plans. Theory
  content also lives in `content/theory/*.md` in this repo, so `theory_docs` is always
  reproducible from `npm run seed` even if the database were wiped.

---

## Project structure

```
content/theory/*.md       Theory Library content (exported from Notion, build-time only)
scripts/seed.ts            Loads theory content (+ optional demo trades) into Supabase
supabase/migrations/       SQL migrations, applied in filename order
src/app/(app)/              Authenticated routes (dashboard, journal, prep, calendar, ...)
src/app/login, /auth        Auth routes (outside the (app) layout, no sidebar)
src/components/            UI, grouped by feature (trades/, prep/, calendar/, analytics/, ...)
src/lib/constants/enums.ts  Single source of truth for every enum (mirrors the Postgres enums)
src/lib/validation/         Zod schemas, derived from the enum constants
src/lib/data/                Server-only data-access layer (one file per domain)
src/lib/trading/            Pure, unit-tested math: risk/sizing, R/streaks/drawdown, sessions,
                            grading, bias-wizard scoring, CSV import/export, TOC extraction
src/proxy.ts                 Route protection (Next.js 16's replacement for middleware.ts)
e2e/                          Playwright smoke tests
```

## What's verified vs. unverified

**Verified**: full test suite (44 unit tests + 1 live-Supabase RLS test, skipped without
credentials), typecheck, lint, and production build all pass; the login flow (route
protection, both auth modes, error handling) was exercised end-to-end with Playwright against
the real Supabase project; every page's markup and the design system were visually
spot-checked via a screenshot.

**Not yet verified** (needs your real Supabase user to exist first): the authenticated
Playwright specs (`journal`, `prep`, `calendar`, `analytics`) — run `npm run test:e2e` with
`PLAYWRIGHT_TEST_EMAIL`/`PLAYWRIGHT_TEST_PASSWORD` set once your account is created; and a
visual pass over the authenticated pages with real data in them (dashboard charts, calendar
cells, analytics breakdowns) — the empty/loading states were built and reviewed in code but
not screenshotted with live data.
