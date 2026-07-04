import { GameDef } from "./store";

export interface RollResult {
  points: number;
  bonus: boolean;
}

/**
 * Every game funnels its outcome through this single function so the
 * points economy stays consistent and auditable across six very
 * different play mechanics (a wheel spin and a memory match should not
 * secretly have different reward curves).
 */
export function rollReward(game: GameDef): RollResult {
  const bonus = Math.random() < game.bonusChance;
  const base = Math.round(game.minPoints + Math.random() * (game.maxPoints - game.minPoints));
  const points = bonus ? Math.round(base * 2.5) : base;
  return { points, bonus };
}
