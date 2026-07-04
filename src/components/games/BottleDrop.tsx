"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { GameDef } from "@/lib/store";
import SevenUpArt from "@/components/brandart/SevenUpArt";

export default function BottleDrop({
  game,
  onResult
}: {
  game: GameDef;
  onResult: (points: number, bonus: boolean) => void;
}) {
  const [position, setPosition] = useState(0); // 0..100
  const [direction, setDirection] = useState(1);
  const [caught, setCaught] = useState<null | { points: number; bonus: boolean }>(null);
  const frame = useRef<number>();

  useEffect(() => {
    let last = performance.now();
    const speed = 65; // % per second

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setPosition((p) => {
        let next = p + direction * speed * dt;
        if (next >= 100) {
          next = 100;
          setDirection(-1);
        } else if (next <= 0) {
          next = 0;
          setDirection(1);
        }
        return next;
      });
      frame.current = requestAnimationFrame(tick);
    };

    if (!caught) frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction, caught]);

  const catchBottle = () => {
    if (caught) return;
    const sweetSpot = 50;
    const distance = Math.abs(position - sweetSpot);
    const accuracy = Math.max(0, 1 - distance / 50); // 1 = perfect, 0 = edge
    const points = Math.round(game.minPoints + accuracy * (game.maxPoints - game.minPoints));
    const bonus = accuracy > 0.92;
    setCaught({ points, bonus });
    onResult(points, bonus);
  };

  const reset = () => setCaught(null);

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <div className="flex items-center gap-2">
        <SevenUpArt className="h-10 w-10" />
        <p className="text-sm text-apex-platinum/60">Tap CATCH when the 7UP bottle lines up with the target zone.</p>
      </div>

      <div className="relative h-20 w-full max-w-sm rounded-full bg-apex-panelLight">
        <div className="absolute inset-y-0 left-[42%] right-[42%] rounded-full bg-apex-lime/25 ring-2 ring-apex-lime/50" />
        <motion.div
          className="absolute top-1/2 h-14 w-14 -translate-y-1/2 -translate-x-1/2"
          style={{ left: `${position}%` }}
        >
          <SevenUpArt className="h-14 w-14 drop-shadow-lg" />
        </motion.div>
      </div>

      {!caught ? (
        <button
          onClick={catchBottle}
          className="w-full max-w-sm rounded-xl bg-apex-lime py-3.5 font-semibold text-apex-void shadow-neon"
        >
          Catch!
        </button>
      ) : (
        <button
          onClick={reset}
          className="w-full max-w-sm rounded-xl border border-white/10 bg-white/5 py-3.5 font-semibold text-apex-platinum/80"
        >
          Reset target
        </button>
      )}
    </div>
  );
}
