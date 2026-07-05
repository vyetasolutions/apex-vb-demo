import { GameDef } from "./store";

export interface RollResult {
  points: number;
  bonus: boolean;
}

// -------------------------------------------------------------------
// CHANCE GAMES (Spin the Wheel, Scratch & Win, Lucky Box)
// -------------------------------------------------------------------
// A real prize table, not a flat uniform roll: most plays land a modest
// prize, a jackpot tier is rare. This keeps average cost-per-play
// predictable (see src/lib/economics.ts) while still preserving the
// occasional big win that makes a prize mechanic feel worth playing.
interface Tier {
  weight: number;
  multiplier: number; // fraction of the min..max range
  bonus: boolean;
}

const TIERS: Tier[] = [
  { weight: 55, multiplier: 0.22, bonus: false }, // common, small
  { weight: 28, multiplier: 0.5, bonus: false }, // occasional, medium
  { weight: 13, multiplier: 0.85, bonus: false }, // uncommon, large
  { weight: 4, multiplier: 1.8, bonus: true } // rare jackpot
];

function pickTier(): Tier {
  const total = TIERS.reduce((acc, t) => acc + t.weight, 0);
  let roll = Math.random() * total;
  for (const t of TIERS) {
    if (roll < t.weight) return t;
    roll -= t.weight;
  }
  return TIERS[0];
}

export function rollReward(game: GameDef): RollResult {
  const tier = pickTier();
  const points = Math.round(game.minPoints + tier.multiplier * (game.maxPoints - game.minPoints));
  return { points, bonus: tier.bonus };
}

// -------------------------------------------------------------------
// SKILL GAMES (Bottle Drop, Can Stack, Memory Flip)
// -------------------------------------------------------------------
// Reward scales on a steep curve against measured accuracy (0..1), so a
// careless play pays little and only genuinely precise play approaches
// the top of the range. A small flat consolation keeps a miss from
// feeling like nothing happened, per product decision: every play still
// earns something, but winning big requires real skill.
const CONSOLATION_POINTS = 8;
const SKILL_CURVE_EXPONENT = 2.4; // higher = harsher penalty for poor accuracy
const BONUS_ACCURACY_THRESHOLD = 0.93;

export function skillReward(game: GameDef, accuracy: number): RollResult {
  const clamped = Math.max(0, Math.min(1, accuracy));
  const curved = Math.pow(clamped, SKILL_CURVE_EXPONENT);
  const ceiling = Math.max(CONSOLATION_POINTS, game.maxPoints);
  const points = Math.round(CONSOLATION_POINTS + curved * (ceiling - CONSOLATION_POINTS));
  const bonus = clamped >= BONUS_ACCURACY_THRESHOLD;
  return { points, bonus };
}
