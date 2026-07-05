# APEX — Points Economics & Difficulty Model

## Why this exists

The first pass of this demo made every play a guaranteed win with flat,
uniform point ranges — fine to prove the interaction loop, but it didn't
demonstrate two things a real client conversation needs: that the games
have a genuine skill ceiling, and that the points program has a real,
defensible unit economics model behind it (not just "give away points").

## Reward logic (`src/lib/rewardEngine.ts`)

**Chance games** (Spin the Wheel, Scratch & Win, Lucky Box) use a weighted
prize table instead of a flat random range:

| Tier | Odds | Payout (of game's max range) |
|---|---|---|
| Common | 55% | ~22% |
| Medium | 28% | ~50% |
| Large | 13% | ~85% |
| Jackpot (bonus) | 4% | ~180% |

This keeps the average cost-per-play predictable for budgeting while
preserving the rare big win that makes a prize mechanic exciting.

**Skill games** (Bottle Drop, Can Stack, Memory Flip) score on a curved
function of measured accuracy (`accuracy^2.4`), with a small flat
consolation floor (8 pts) so a miss never feels like literally nothing —
but only accuracy above ~93% earns the bonus multiplier. A careless play
now visibly under-performs a precise one; the original version paid close
to the full range regardless of how well you actually played.

The result overlay (`PlayResultOverlay.tsx`) reflects this honestly: a
low-scoring play is labeled **"So close"**, not dressed up as a win.

## Unit economics (`src/lib/economics.ts`)

Three editable assumptions drive the whole model:

- `COST_PER_POINT_ZMW` — cost to Varun of one point issued, derived from
  the reward catalogue (500 pts ≈ one free bottle ≈ ZMW 6 cost).
- `AVG_MARGIN_PER_INCREMENTAL_BOTTLE_ZMW` — assumed margin on one *extra*
  bottle sold because a customer came back to engage.
- `INCREMENTAL_PURCHASE_PROBABILITY` — assumed odds that a repeat-visit
  day converts into that incremental purchase. **This is the single
  number most worth replacing with a real pilot measurement** — everything
  downstream scales off it.

From those three, the admin console (`/admin`) computes, live, from
actual play data in the current wallet:

- **Cost to serve** — total points ever issued × cost/point
- **Outstanding liability** — unredeemed balance × cost/point (what the
  program still owes)
- **Redemption cost realized** — points actually redeemed × cost/point
- **Repeat-visit days** — distinct calendar days with at least one
  play, i.e. the retention signal, not raw play count. Someone who plays
  40 times in one sitting still counts as 1 active day, which is
  deliberate: grinding a single session isn't the same business signal as
  a customer returning tomorrow.
- **Projected ROI** — projected incremental profit from repeat-visit days,
  against cost to serve, expressed as a percentage.

Everything here is clearly framed in the UI as an illustrative model, not
a claim about Varun Beverages' actual numbers — the point is to give a
client something they can plug real figures into, not a number to take at
face value.

## What would need to change for a real pilot

1. Replace the three constants in `economics.ts` with measured figures.
2. Feed "incremental purchase probability" from actual repeat-purchase
   data (e.g. matching loyalty IDs against POS/distributor sell-through),
   not an assumption.
3. Move `uniqueActiveDays` from a per-device local calculation to a
   Supabase query across `game_sessions`, scoped by campaign or region.
