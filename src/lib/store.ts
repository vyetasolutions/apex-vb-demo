"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase, isDemoMode } from "./supabaseClient";

export type TierId = "bronze" | "silver" | "gold" | "platinum";

export interface GameDef {
  slug: string;
  name: string;
  brand: string;
  minPoints: number;
  maxPoints: number;
  bonusChance: number; // 0..1
  color: string; // tailwind class fragment for accent
}

export const GAMES: GameDef[] = [
  { slug: "spin-the-wheel", name: "Pepsi Spin the Wheel", brand: "Pepsi", minPoints: 10, maxPoints: 150, bonusChance: 0.18, color: "cobalt" },
  { slug: "scratch-win", name: "Scratch & Win Card", brand: "Mirinda", minPoints: 10, maxPoints: 120, bonusChance: 0.15, color: "citrus" },
  { slug: "bottle-drop", name: "Bottle Drop Catch", brand: "7UP", minPoints: 10, maxPoints: 200, bonusChance: 0.12, color: "lime" },
  { slug: "can-stack", name: "Can Stack Challenge", brand: "Mountain Dew", minPoints: 10, maxPoints: 200, bonusChance: 0.12, color: "citrus" },
  { slug: "memory-flip", name: "Memory Flip Cards", brand: "Sting", minPoints: 10, maxPoints: 150, bonusChance: 0.15, color: "sting" },
  { slug: "lucky-box", name: "Lucky Box Picker", brand: "Aquafina", minPoints: 10, maxPoints: 130, bonusChance: 0.2, color: "aqua" }
];

export const TIER_THRESHOLDS: Record<TierId, number> = {
  bronze: 0,
  silver: 2000,
  gold: 8000,
  platinum: 20000
};

export function tierForPoints(lifetime: number): TierId {
  if (lifetime >= TIER_THRESHOLDS.platinum) return "platinum";
  if (lifetime >= TIER_THRESHOLDS.gold) return "gold";
  if (lifetime >= TIER_THRESHOLDS.silver) return "silver";
  return "bronze";
}

export function nextTierProgress(lifetime: number) {
  const order: TierId[] = ["bronze", "silver", "gold", "platinum"];
  const current = tierForPoints(lifetime);
  const idx = order.indexOf(current);
  if (idx === order.length - 1) {
    return { current, next: null as TierId | null, pct: 100, remaining: 0 };
  }
  const next = order[idx + 1];
  const floor = TIER_THRESHOLDS[current];
  const ceil = TIER_THRESHOLDS[next];
  const pct = Math.min(100, Math.round(((lifetime - floor) / (ceil - floor)) * 100));
  return { current, next, pct, remaining: ceil - lifetime };
}

export interface PlayResult {
  gameSlug: string;
  points: number;
  bonus: boolean;
  payload?: Record<string, unknown>;
  at: number;
}

interface WalletState {
  balance: number;
  lifetimePoints: number;
  history: PlayResult[];
  recordPlay: (slug: string, points: number, bonus: boolean, payload?: Record<string, unknown>) => void;
  redeem: (cost: number, rewardName: string) => boolean;
}

export const useWallet = create<WalletState>()(
  persist(
    (set, get) => ({
      balance: 0,
      lifetimePoints: 0,
      history: [],
      recordPlay: (slug, points, bonus, payload) => {
        const entry: PlayResult = { gameSlug: slug, points, bonus, payload, at: Date.now() };
        set((s) => ({
          balance: s.balance + points,
          lifetimePoints: s.lifetimePoints + points,
          history: [entry, ...s.history].slice(0, 200)
        }));

        // Production wiring: when demo mode is off, mirror the same event
        // into Supabase so the ledger (points_transactions) stays the
        // single source of truth server-side. See docs/ARCHITECTURE.md.
        if (!isDemoMode && supabase) {
          void supabase.from("game_sessions").insert({
            points_awarded: points,
            was_bonus: bonus,
            result_payload: payload ?? {}
          });
        }
      },
      redeem: (cost, rewardName) => {
        const { balance } = get();
        if (balance < cost) return false;
        set((s) => ({ balance: s.balance - cost }));
        if (!isDemoMode && supabase) {
          void supabase.from("redemptions").insert({ points_spent: cost, reward_id: rewardName });
        }
        return true;
      }
    }),
    { name: "apex-vb-wallet" }
  )
);
