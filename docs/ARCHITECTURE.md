# APEX — System Architecture Overview

## 1. What this repo is

A single-repo Next.js application implementing the APEX consumer engagement
demo for Varun Beverages (Pepsi, Mirinda, 7UP, Mountain Dew, Sting, Aquafina).
It ships in **demo mode** by default: every game, wallet, and tier interaction
runs entirely client-side (Zustand + `localStorage`), so it opens and works
immediately with zero external setup. Flip one env var and it talks to a real
Supabase Postgres backend instead — the interfaces are already shaped for it.

## 2. High-level diagram

```
┌──────────────────────────────┐
│           Browser            │
│  Next.js App Router (React)  │
│                               │
│  Pages: /  /games  /games/:s │
│         /wallet  /admin      │
│                               │
│  ┌─────────────────────────┐ │
│  │   Zustand store          │ │
│  │  (wallet, tier, history)  │◄─── persisted to localStorage in demo mode
│  └───────────┬─────────────┘ │
└──────────────┼───────────────┘
               │  (isDemoMode === false)
               ▼
┌──────────────────────────────┐
│           Supabase            │
│  Postgres + Row Level Security│
│  Auth (phone / email)         │
│  Realtime (optional, for      │
│  live leaderboards)            │
│                                │
│  Tables: users, wallets,       │
│  points_transactions, games,   │
│  game_sessions, rewards,       │
│  redemptions, campaigns        │
└──────────────────────────────┘
               ▲
               │
┌──────────────┴───────────────┐
│   Render (Node web service)   │
│   Hosts the Next.js server     │
└───────────────────────────────┘
```

## 3. Why this stack

- **Next.js App Router**: file-based routing gives a clean 1:1 mapping
  between the six games and `/games/[slug]`, server components keep the
  bundle small, and it deploys to Render's free tier with no config.
- **Tailwind + Framer Motion**: fast to hand-tune a premium, highly-animated
  arcade feel without a heavy animation library.
- **Zustand**: a five-line store is enough for a wallet/points/tier engine —
  no need for Redux ceremony, and it persists to `localStorage` for free via
  its `persist` middleware, which is what lets the demo run with zero backend.
- **Supabase**: Postgres + Auth + Row Level Security in one free-tier
  service, so the same schema that powers the demo's "production wiring"
  comments in `src/lib/store.ts` can go live without a re-architecture.

## 4. The points ledger is the source of truth

`points_transactions` is append-only. A Postgres trigger
(`apply_points_transaction`, in `supabase/schema.sql`) recalculates
`wallets.balance` and `users.tier` on every insert. This means:

- Balances can never drift from the audit trail.
- Any dispute ("why do I have 3,400 points?") can be answered by replaying
  the ledger.
- Tier upgrades are a pure function of `lifetime_points`, defined once
  in SQL and mirrored in `src/lib/store.ts` (`tierForPoints`) for instant
  client-side feedback.

## 5. Demo mode vs. production mode

| | Demo mode (default) | Production mode |
|---|---|---|
| Env | `NEXT_PUBLIC_DEMO_MODE=true` | `NEXT_PUBLIC_DEMO_MODE=false` |
| Wallet storage | `localStorage` via Zustand `persist` | Postgres (`wallets`, `points_transactions`) |
| Auth | none — anonymous device session | Supabase Auth (phone OTP recommended for FMCG/retail) |
| Multi-device | no | yes |
| Admin dashboard scope | this device only | all users, via Supabase queries / views |

Switching modes touches exactly two files: `.env.local` and
`src/lib/supabaseClient.ts` (already reads the flag) — no page or game
component needs to change, because they only ever call `useWallet()`.

## 6. Extending to real QR / retail entry points

The brief's "mock QR entry" is intentionally left as a routing concern:
a QR code simply deep-links to `/games/[slug]?src=qr&campaign=<id>`. In
production mode, that `campaign` id should be looked up against the
`campaigns` table to apply `points_multiplier` (see schema) before the
reward roll in `src/lib/rewardEngine.ts`.

## 7. Known simplifications (by design, for a demo)

- No server-side anti-abuse/rate-limiting on plays — deliberate, per the
  brief's "no limit on plays" requirement.
- The admin dashboard aggregates only the current device's local history;
  wiring it to real cross-user data is a Supabase query away (see the note
  on the admin page itself).
- Reward redemption is recorded but not fulfilled against a real inventory
  or POS system — `rewards.stock` exists in the schema for when that's needed.
