"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GAMES } from "@/lib/store";
import { BRAND_ART } from "@/components/brandart";

export default function GamesHub() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-bold">Game arcade</h1>
        <p className="text-sm text-apex-platinum/50">Unlimited plays in demo mode — pick a game to start.</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {GAMES.map((g, i) => (
          <motion.div
            key={g.slug}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
          >
            <Link
              href={`/games/${g.slug}`}
              className="flex items-center gap-4 rounded-2xl glass p-4 transition hover:-translate-y-0.5 hover:shadow-neon"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center animate-floaty">
                {(() => {
                  const Art = BRAND_ART[g.brand];
                  return <Art className="h-16 w-16 drop-shadow-lg" />;
                })()}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{g.name}</p>
                <p className="text-xs text-apex-platinum/50">
                  {g.brand} · {g.minPoints}–{g.maxPoints} pts per play
                </p>
              </div>
              <span className="text-apex-platinum/40">→</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
