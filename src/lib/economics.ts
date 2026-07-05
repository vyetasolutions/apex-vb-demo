/**
 * APEX unit economics — illustrative assumptions for the pitch demo.
 *
 * These numbers are NOT measured data. They're editable placeholders so a
 * client conversation has real levers to pull ("what if cost-per-point
 * were lower", "what if conversion were higher") rather than the demo
 * pretending to know Varun Beverages' actual numbers. Swap these for real
 * inputs (retail margin, actual redemption cost, measured repeat-purchase
 * lift) once the client shares them.
 */

// Derived from the seed reward catalogue: 500 pts ≈ one free 500ml bottle,
// assumed to cost Varun roughly ZMW 6 at wholesale/production cost.
export const COST_PER_POINT_ZMW = 6 / 500; // ≈ ZMW 0.012 per point

// Assumed margin Varun earns on one *additional* bottle a customer buys
// because they came back to play/redeem (i.e. incremental, not baseline).
export const AVG_MARGIN_PER_INCREMENTAL_BOTTLE_ZMW = 4;

// Assumed probability that a customer returning on a distinct day to play
// converts into one incremental bottle purchase that week. This is the
// single most important number to replace with a real pilot measurement.
export const INCREMENTAL_PURCHASE_PROBABILITY = 0.35;

export interface EconomicsSnapshot {
  pointsIssued: number;
  pointsRedeemed: number;
  pointsOutstanding: number;
  uniqueActiveDays: number;
  costToServeZMW: number; // cost of all points ever issued
  redemptionCostRealizedZMW: number; // cost of points actually redeemed
  outstandingLiabilityZMW: number; // cost of points still sitting in wallets
  projectedIncrementalProfitZMW: number; // from repeat-day engagement
  roiPercent: number | null; // null when there's no cost basis yet
}

export function computeEconomics(input: {
  pointsIssued: number;
  pointsRedeemed: number;
  pointsOutstanding: number;
  uniqueActiveDays: number;
}): EconomicsSnapshot {
  const costToServeZMW = input.pointsIssued * COST_PER_POINT_ZMW;
  const redemptionCostRealizedZMW = input.pointsRedeemed * COST_PER_POINT_ZMW;
  const outstandingLiabilityZMW = input.pointsOutstanding * COST_PER_POINT_ZMW;
  const projectedIncrementalProfitZMW =
    input.uniqueActiveDays * INCREMENTAL_PURCHASE_PROBABILITY * AVG_MARGIN_PER_INCREMENTAL_BOTTLE_ZMW;

  const roiPercent =
    costToServeZMW > 0 ? ((projectedIncrementalProfitZMW - costToServeZMW) / costToServeZMW) * 100 : null;

  return {
    pointsIssued: input.pointsIssued,
    pointsRedeemed: input.pointsRedeemed,
    pointsOutstanding: input.pointsOutstanding,
    uniqueActiveDays: input.uniqueActiveDays,
    costToServeZMW,
    redemptionCostRealizedZMW,
    outstandingLiabilityZMW,
    projectedIncrementalProfitZMW,
    roiPercent
  };
}

export function fmtZMW(v: number): string {
  return `ZMW ${v.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}
