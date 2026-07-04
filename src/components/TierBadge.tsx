"use client";

import { TierId } from "@/lib/store";

const TIER_STYLES: Record<TierId, { label: string; gradient: string; ring: string }> = {
  bronze: { label: "Bronze", gradient: "from-[#8C5A34] to-[#C58F5A]", ring: "ring-[#C58F5A]/40" },
  silver: { label: "Silver", gradient: "from-[#8E97A8] to-[#D9E1EE]", ring: "ring-[#D9E1EE]/40" },
  gold: { label: "Gold", gradient: "from-[#B8860B] to-[#F2C400]", ring: "ring-apex-citrus/40" },
  platinum: { label: "Platinum", gradient: "from-apex-cobalt to-apex-aqua", ring: "ring-apex-aqua/50" }
};

export default function TierBadge({ tier, size = "md" }: { tier: TierId; size?: "sm" | "md" | "lg" }) {
  const style = TIER_STYLES[tier];
  const dims = size === "lg" ? "h-16 w-16 text-sm" : size === "sm" ? "h-8 w-8 text-[10px]" : "h-11 w-11 text-xs";

  return (
    <div
      className={`flex ${dims} items-center justify-center rounded-full bg-gradient-to-br ${style.gradient} font-display font-bold text-apex-void ring-4 ${style.ring}`}
      title={`${style.label} tier`}
    >
      {style.label.slice(0, 2).toUpperCase()}
    </div>
  );
}

export function tierLabel(tier: TierId) {
  return TIER_STYLES[tier].label;
}
