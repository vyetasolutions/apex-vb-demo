# APEX — Game Designs

All six games funnel their outcome through `rollReward()` or an equivalent
accuracy-based formula in `src/lib/rewardEngine.ts`, so the points economy
is consistent: every game pays `minPoints`–`maxPoints`, with a
brand-specific `bonusChance` of a ~2.5x multiplier. This keeps the six very
different play mechanics feeling like one coherent reward system rather
than six unrelated mini-apps.

## 1. Pepsi Spin the Wheel (`spin-the-wheel`)
**Mechanic**: tap to spin an 8-segment conic-gradient wheel; a random
5–8 extra rotations plus a random offset determine where it lands.
**Feel**: the classic prize-wheel dopamine loop, instantly recognizable.
**File**: `src/components/games/SpinWheel.tsx`

## 2. Scratch & Win Card (`scratch-win`)
**Mechanic**: an HTML canvas is painted gold with "SCRATCH HERE"; dragging
(mouse or touch) uses `destination-out` compositing to reveal the prize
underneath. Result is rolled up-front so the reveal is just paint removal.
**Feel**: tactile, satisfying — the closest analog to a real scratch card.
**File**: `src/components/games/ScratchCard.tsx`

## 3. Bottle Drop Catch (`bottle-drop`)
**Mechanic**: a bottle icon bounces left-right along a track; tapping
"Catch!" scores based on proximity to a highlighted center zone — a
reflex/timing game rather than literal falling objects, which keeps it
fast and thumb-friendly on mobile.
**Feel**: quick reflex challenge, replayable in under 5 seconds.
**File**: `src/components/games/BottleDrop.tsx`

## 4. Can Stack Challenge (`can-stack`)
**Mechanic**: four rounds of the same timing mechanic as Bottle Drop, but
each drop visually stacks a can (with a horizontal offset proportional to
the miss distance) — literal can-stack visual feedback — and speed
increases each round. Final reward is the average accuracy across all four
drops.
**Feel**: escalating difficulty, visually builds a tower as you play.
**File**: `src/components/games/CanStack.tsx`

## 5. Memory Flip Cards (`memory-flip`)
**Mechanic**: classic 4×3 memory-match grid using the six Varun product
names as pairs (Pepsi, Mirinda, 7UP, Mountain Dew, Sting, Aquafina) —
reinforces brand recall while playing. Reward scales inversely with the
number of mismatched attempts.
**Feel**: the only game requiring sustained attention — best-suited to
users who've already engaged once and want a longer session.
**File**: `src/components/games/MemoryFlip.tsx`

## 6. Lucky Box Picker (`lucky-box`)
**Mechanic**: four boxes are rolled up-front (hidden); tapping one reveals
that box's prize immediately, the rest stay hidden (loss-aversion framing
without an actual loss, since every box still has a real reward).
**Feel**: the fastest, lowest-effort game — good for a QR-scan-and-go
moment at a point of sale.
**File**: `src/components/games/LuckyBox.tsx`

## Adding a seventh game

1. Add an entry to `GAMES` in `src/lib/store.ts` (slug, brand, point range,
   bonus chance, accent color — reuse a token from `src/lib/theme.ts` or
   add a new one there).
2. Build `src/components/games/YourGame.tsx` accepting `{ game, onResult }`.
3. Register it in the `COMPONENTS` map in `src/app/games/[slug]/page.tsx`.
4. Add the matching row to `supabase/schema.sql`'s seed `insert into games`.

No other file needs to change — the arcade hub, routing, wallet, and
admin dashboard all read from the single `GAMES` array.
