# APEX — Varun Beverages Consumer Engagement Platform (Demo)

A gamified loyalty/engagement demo across the Varun Beverages portfolio
(Pepsi, Mirinda, 7UP, Mountain Dew, Sting, Aquafina). Unlimited plays,
instant points, tier progression, and an admin console — pitch-ready.

📄 See also: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) ·
[`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) ·
[`docs/GAMES.md`](docs/GAMES.md) · [`supabase/schema.sql`](supabase/schema.sql)

---

## Quick start (runs with zero setup, demo mode)

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. That's it — demo mode (`NEXT_PUBLIC_DEMO_MODE=true`,
the default when no `.env.local` is present) uses an in-browser wallet, so no
Supabase project or API keys are required to try every game, the wallet, tier
progression, and the admin view.

## Option A — GitHub Codespaces (recommended for a live enterprise demo link)

1. Push this repo to GitHub.
2. On the repo page: **Code → Codespaces → Create codespace on main**.
3. Codespaces auto-detects Node and runs `npm install`. Once ready:
   ```bash
   npm run dev -- -p 3000
   ```
4. Codespaces will prompt to forward port 3000 — set visibility to
   **Public** if you want to share the link with stakeholders who don't
   have GitHub access. You'll get a URL like
   `https://<name>-3000.app.github.dev`.

## Option B — Deploy to Render (free tier, persistent URL)

1. Push this repo to GitHub.
2. In Render: **New → Web Service** → connect the repo.
3. Settings:
   - **Environment**: Node
   - **Build command**: `npm install && npm run build`
   - **Start command**: `npm run start`
   - **Instance type**: Free
4. Add environment variables (see below), then **Create Web Service**.
   Render will build and give you a `https://apex-vb.onrender.com`-style URL.

Free-tier Render web services spin down after inactivity and take ~30–60s
to wake on the next request — worth mentioning before a live pitch demo so
the first load isn't a surprise.

## Environment variables

Copy `.env.example` to `.env.local` (for local dev) or set the same keys in
Render's dashboard:

```
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Leave `NEXT_PUBLIC_DEMO_MODE=true` for the zero-setup demo. To go live
against real data, continue to the Supabase setup below and flip it to
`false`.

## Setting up Supabase (only needed once you leave demo mode)

1. Create a free project at [supabase.com](https://supabase.com).
2. **Project Settings → API**: copy the **Project URL** and **anon public
   key** into `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. **SQL Editor → New query**: paste the entire contents of
   `supabase/schema.sql` and run it. This creates all tables, the points
   ledger trigger, row-level security policies, and seeds the six games
   plus a starter reward catalogue.
4. **Authentication → Providers**: enable Phone (OTP) or Email, matching
   how field staff/consumers will log in at retail points.
5. Set `NEXT_PUBLIC_DEMO_MODE=false` and redeploy.

At that point `src/lib/store.ts` and `src/lib/supabaseClient.ts` start
writing every game session and redemption straight to Postgres — no other
code changes needed (see `docs/ARCHITECTURE.md` §5).

## Project structure

```
src/
  app/
    page.tsx              Home (hero + wallet + featured games)
    games/page.tsx         Arcade hub — all six games
    games/[slug]/page.tsx  Individual game runner
    wallet/page.tsx         Wallet, tier progress, redemption catalogue
    admin/page.tsx          Admin console (MVP)
  components/
    games/                 The six game implementations
    Navbar.tsx, WalletBar.tsx, TierBadge.tsx, PlayResultOverlay.tsx
  lib/
    store.ts               Zustand wallet/points/tier engine
    rewardEngine.ts         Shared points-roll formula
    supabaseClient.ts       Supabase client (demo-mode aware)
    theme.ts                Static Tailwind class maps for brand accents
supabase/
  schema.sql               Full Postgres schema, RLS, triggers, seed data
docs/
  ARCHITECTURE.md, DESIGN_SYSTEM.md, GAMES.md
```
