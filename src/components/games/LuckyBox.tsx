"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GameDef } from "@/lib/store";
import { rollReward } from "@/lib/rewardEngine";
import AquafinaArt from "@/components/brandart/AquafinaArt";

export default function LuckyBox({
  game,
  onResult
}: {
  game: GameDef;
  onResult: (points: number, bonus: boolean) => void;
}) {
  const [openedIndex, setOpenedIndex] = useState<number | null>(null);
  const [rolls] = useState(() => Array.from({ length: 4 }, () => rollReward(game)));

  const pick = (i: number) => {
    if (openedIndex !== null) return;
    setOpenedIndex(i);
    onResult(rolls[i].points, rolls[i].bonus);
  };

  const reset = () => {
    setOpenedIndex(null);
    // rolls stay fixed for this mount; parent re-key remounts for a fresh set
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="flex items-center gap-2">
        <AquafinaArt className="h-10 w-10" />
        <p className="text-sm text-apex-platinum/60">Pick a box. Every box hides an Aquafina points prize.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {rolls.map((r, i) => {
          const open = openedIndex === i;
          const dimmed = openedIndex !== null && !open;
          return (
            <motion.button
              key={i}
              onClick={() => pick(i)}
              whileTap={{ scale: 0.95 }}
              className={`flex h-28 w-28 flex-col items-center justify-center rounded-2xl shadow-neon transition ${
                open ? "bg-apex-aqua/20 ring-2 ring-apex-aqua" : "bg-apex-panelLight"
              } ${dimmed ? "opacity-40" : ""}`}
            >
              {open ? (
                <>
                  <span className="font-display text-xl font-extrabold text-apex-platinum">+{r.points}</span>
                  <span className="text-[10px] text-apex-platinum/60">{r.bonus ? "bonus!" : "points"}</span>
                </>
              ) : (
                <AquafinaArt className="h-16 w-16 opacity-90" />
              )}
            </motion.button>
          );
        })}
      </div>

      {openedIndex !== null && (
        <button
          key={openedIndex}
          onClick={reset}
          className="w-full max-w-sm rounded-xl border border-white/10 bg-white/5 py-3.5 font-semibold text-apex-platinum/80"
        >
          Reset boxes (remount for a new set)
        </button>
      )}
    </div>
  );
}
