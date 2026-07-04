"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { GameDef } from "@/lib/store";

const ROUNDS = 4;

export default function CanStack({
  game,
  onResult
}: {
  game: GameDef;
  onResult: (points: number, bonus: boolean) => void;
}) {
  const [round, setRound] = useState(0);
  const [position, setPosition] = useState(0);
  const [direction, setDirection] = useState(1);
  const [stack, setStack] = useState<number[]>([]); // offset per placed can, 0 = perfect center
  const [finished, setFinished] = useState(false);
  const frame = useRef<number>();

  useEffect(() => {
    if (finished) return;
    let last = performance.now();
    const speed = 80 + round * 12; // gets faster each round

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

    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction, round, finished]);

  const drop = () => {
    if (finished) return;
    const offset = position - 50; // -50..50, 0 = perfect
    setStack((s) => [...s, offset]);

    if (round + 1 >= ROUNDS) {
      const avgAccuracy =
        [...stack, offset].reduce((acc, o) => acc + Math.max(0, 1 - Math.abs(o) / 50), 0) / ROUNDS;
      const points = Math.round(game.minPoints + avgAccuracy * (game.maxPoints - game.minPoints));
      const bonus = avgAccuracy > 0.85;
      setFinished(true);
      onResult(points, bonus);
    } else {
      setRound((r) => r + 1);
      setPosition(0);
      setDirection(1);
    }
  };

  const reset = () => {
    setRound(0);
    setStack([]);
    setFinished(false);
    setPosition(0);
    setDirection(1);
  };

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <p className="text-sm text-apex-platinum/60">
        Tap DROP to place each can as close to center as you can — {ROUNDS} cans per round.
      </p>

      <div className="flex h-56 w-full max-w-sm flex-col-reverse items-center justify-start gap-1 rounded-2xl bg-apex-panelLight p-3">
        {stack.map((offset, i) => (
          <motion.div
            key={i}
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="h-8 w-16 rounded-md bg-apex-citrus shadow-neon"
            style={{ marginLeft: offset * 0.6 }}
          />
        ))}
      </div>

      {!finished ? (
        <>
          <div className="relative h-4 w-full max-w-sm rounded-full bg-white/5">
            <div className="absolute inset-y-0 left-[45%] right-[45%] rounded-full bg-apex-citrus/40" />
            <div
              className="absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-apex-citrus shadow-neon"
              style={{ left: `calc(${position}% - 12px)` }}
            />
          </div>
          <button
            onClick={drop}
            className="w-full max-w-sm rounded-xl bg-apex-citrus py-3.5 font-semibold text-apex-void shadow-neon"
          >
            Drop can ({round + 1}/{ROUNDS})
          </button>
        </>
      ) : (
        <button
          onClick={reset}
          className="w-full max-w-sm rounded-xl border border-white/10 bg-white/5 py-3.5 font-semibold text-apex-platinum/80"
        >
          Stack again
        </button>
      )}
    </div>
  );
}
