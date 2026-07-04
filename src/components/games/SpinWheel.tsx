"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GameDef } from "@/lib/store";
import { rollReward } from "@/lib/rewardEngine";
import PepsiArt from "@/components/brandart/PepsiArt";

// 8 sectors, strictly Pepsi's own blue/red/white so the wheel reads as
// the brand immediately rather than a generic rainbow wheel.
const SECTOR_COLORS = ["#0057FF", "#FFFFFF", "#E4002B", "#0057FF", "#FFFFFF", "#E4002B", "#0057FF", "#E4002B"];
const SECTOR_LABELS = ["50", "100", "150", "BONUS", "75", "125", "50", "100"];
const SIZE = 260;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2;
const SLICE = 360 / SECTOR_COLORS.length;

function polar(angleDeg: number, radius: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CENTER + radius * Math.cos(rad), y: CENTER + radius * Math.sin(rad) };
}

function sectorPath(index: number) {
  const start = index * SLICE;
  const end = start + SLICE;
  const p1 = polar(start, RADIUS);
  const p2 = polar(end, RADIUS);
  return `M ${CENTER} ${CENTER} L ${p1.x} ${p1.y} A ${RADIUS} ${RADIUS} 0 0 1 ${p2.x} ${p2.y} Z`;
}

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
      <div className="relative" style={{ height: SIZE, width: SIZE }}>
        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1">
          <div className="h-0 w-0 border-l-[10px] border-r-[10px] border-t-[18px] border-l-transparent border-r-transparent border-t-apex-crimson drop-shadow" />
        </div>

        <motion.svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="rounded-full shadow-neon"
          animate={{ rotate: rotation }}
          transition={{ duration: 2.5, ease: [0.15, 0.8, 0.3, 1] }}
        >
          {SECTOR_COLORS.map((color, i) => {
            const mid = i * SLICE + SLICE / 2;
            const labelPos = polar(mid, RADIUS * 0.68);
            const textColor = color === "#FFFFFF" ? "#002E9E" : "#FFFFFF";
            return (
              <g key={i}>
                <path d={sectorPath(i)} fill={color} stroke="#05070D" strokeWidth={1.5} />
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  fill={textColor}
                  fontSize={i === 3 ? 12 : 15}
                  fontWeight={700}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${mid}, ${labelPos.x}, ${labelPos.y})`}
                >
                  {SECTOR_LABELS[i]}
                </text>
              </g>
            );
          })}
          <circle cx={CENTER} cy={CENTER} r={RADIUS - 3} fill="none" stroke="#3FD5FF" strokeOpacity={0.4} strokeWidth={2} />
        </motion.svg>

        <div className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-apex-void ring-4 ring-white/10">
          <PepsiArt className="h-11 w-11" />
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
