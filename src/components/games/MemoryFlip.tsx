"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameDef } from "@/lib/store";
import { skillReward } from "@/lib/rewardEngine";
import { BRAND_ART } from "@/components/brandart";
import StingArt from "@/components/brandart/StingArt";

const PRODUCTS = ["Pepsi", "Mirinda", "7UP", "Mountain Dew", "Sting", "Aquafina"];

interface Card {
  id: number;
  label: string;
  flipped: boolean;
  matched: boolean;
}

function buildDeck(): Card[] {
  const deck = [...PRODUCTS, ...PRODUCTS]
    .map((label, i) => ({ id: i, label, flipped: false, matched: false }))
    .sort(() => Math.random() - 0.5);
  return deck;
}

export default function MemoryFlip({
  game,
  onResult
}: {
  game: GameDef;
  onResult: (points: number, bonus: boolean) => void;
}) {
  const [deck, setDeck] = useState<Card[]>(buildDeck);
  const [selected, setSelected] = useState<number[]>([]);
  const [misses, setMisses] = useState(0);
  const [reported, setReported] = useState(false);

  const matchedCount = deck.filter((c) => c.matched).length;
  const won = matchedCount === deck.length;

  useEffect(() => {
    if (selected.length !== 2) return;
    const [a, b] = selected;
    const cardA = deck[a];
    const cardB = deck[b];

    const timeout = setTimeout(() => {
      setDeck((d) =>
        d.map((c, i) => {
          if (i === a || i === b) {
            return cardA.label === cardB.label
              ? { ...c, matched: true, flipped: true }
              : { ...c, flipped: false };
          }
          return c;
        })
      );
      if (cardA.label !== cardB.label) setMisses((m) => m + 1);
      setSelected([]);
    }, 700);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  useEffect(() => {
    if (won && !reported) {
      // A miss now costs more against the curve than the original linear
      // version — 6 pairs from memory with zero misses is a genuinely
      // clean run; a handful of misses should visibly cost real points.
      const accuracy = Math.max(0, 1 - misses / 6);
      const { points, bonus } = skillReward(game, accuracy);
      setReported(true);
      onResult(points, bonus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [won]);

  const flip = (i: number) => {
    if (selected.length === 2 || deck[i].flipped || deck[i].matched) return;
    setDeck((d) => d.map((c, idx) => (idx === i ? { ...c, flipped: true } : c)));
    setSelected((s) => [...s, i]);
  };

  const reset = () => {
    setDeck(buildDeck());
    setSelected([]);
    setMisses(0);
    setReported(false);
  };

  return (
    <div className="flex flex-col items-center gap-5 py-4">
      <div className="flex items-center gap-2">
        <StingArt className="h-9 w-9" />
        <p className="text-sm text-apex-platinum/60">Match the pairs of Varun product cards. Misses: {misses}</p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {deck.map((card, i) => {
          const Art = BRAND_ART[card.label];
          return (
            <button key={card.id} onClick={() => flip(i)} className="relative h-16 w-16 [perspective:600px]">
              <motion.div
                className="relative h-full w-full rounded-lg [transform-style:preserve-3d]"
                animate={{ rotateY: card.flipped || card.matched ? 180 : 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-apex-sting/80 [backface-visibility:hidden] text-apex-void font-bold">
                  <StingArt className="h-8 w-8 opacity-60" />
                </div>
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center gap-0.5 rounded-lg px-1 [backface-visibility:hidden] ${
                    card.matched ? "bg-apex-lime/20 ring-2 ring-apex-lime" : "bg-apex-panelLight"
                  }`}
                  style={{ transform: "rotateY(180deg)" }}
                >
                  <Art className="h-9 w-9" />
                </div>
              </motion.div>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {won && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={reset}
            className="w-full max-w-sm rounded-xl border border-white/10 bg-white/5 py-3.5 font-semibold text-apex-platinum/80"
          >
            Play again
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
