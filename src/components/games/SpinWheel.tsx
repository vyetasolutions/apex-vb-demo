"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GameDef } from "@/lib/store";
import { rollReward } from "@/lib/rewardEngine";

const SEGMENT_COLORS = ["#0057FF", "#E4002B", "#0057FF", "#3FD5FF", "#0057FF", "#E4002B", "#0057FF", "#3FD5FF"];

export default function SpinWheel({
  game,
  onResult
}: {
  game: GameDef;
  onResult: (points: number, bonus: boolean) => void;
}) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const { points, bonus } = rollReward(game);
    const extraSpins = 5 + Math.floor(Math.random() * 3);
    const finalRotation = rotation + extraSpins * 360 + Math.floor(Math.random() * 360);
    setRotation(finalRotation);

    setTimeout(() => {
      setSpinning(false);
      onResult(points, bonus);
    }, 2600);
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="relative h-64 w-64">
        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1">
          <div className="h-0 w-0 border-l-[10px] border-r-[10px] border-t-[18px] border-l-transparent border-r-transparent border-t-apex-crimson drop-shadow" />
        </div>
        <motion.div
          className="h-64 w-64 rounded-full shadow-neon"
          style={{
            background: `conic-gradient(${SEGMENT_COLORS.map((c, i) => `${c} ${i * 45}deg ${(i + 1) * 45}deg`).join(",")})`
          }}
          animate={{ rotate: rotation }}
          transition={{ duration: 2.5, ease: [0.15, 0.8, 0.3, 1] }}
        />
        <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-apex-void ring-4 ring-white/10 flex items-center justify-center font-display text-xs font-bold">
          PEPSI
        </div>
      </div>

      <button
        onClick={spin}
        disabled={spinning}
        className="w-full rounded-xl bg-apex-cobalt py-3.5 font-semibold text-white shadow-neon disabled:opacity-60"
      >
        {spinning ? "Spinning…" : "Spin the wheel"}
      </button>
    </div>
  );
}
