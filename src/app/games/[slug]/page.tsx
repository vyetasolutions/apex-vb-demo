"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { GAMES, useWallet } from "@/lib/store";
import { ACCENT_TEXT } from "@/lib/theme";
import { BRAND_ART } from "@/components/brandart";
import PlayResultOverlay from "@/components/PlayResultOverlay";
import SpinWheel from "@/components/games/SpinWheel";
import ScratchCard from "@/components/games/ScratchCard";
import BottleDrop from "@/components/games/BottleDrop";
import CanStack from "@/components/games/CanStack";
import MemoryFlip from "@/components/games/MemoryFlip";
import LuckyBox from "@/components/games/LuckyBox";

const COMPONENTS: Record<string, React.ComponentType<any>> = {
  "spin-the-wheel": SpinWheel,
  "scratch-win": ScratchCard,
  "bottle-drop": BottleDrop,
  "can-stack": CanStack,
  "memory-flip": MemoryFlip,
  "lucky-box": LuckyBox
};

export default function GamePage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const recordPlay = useWallet((s) => s.recordPlay);
  const [overlay, setOverlay] = useState<{ points: number; bonus: boolean; tier: "miss" | "win" | "bonus" } | null>(
    null
  );
  const [mountKey, setMountKey] = useState(0);

  const game = GAMES.find((g) => g.slug === slug);
  const GameComponent = game ? COMPONENTS[game.slug] : null;

  if (!game || !GameComponent) {
    return (
      <div className="py-10 text-center">
        <p className="text-apex-platinum/60">Game not found.</p>
        <button onClick={() => router.push("/games")} className="mt-4 text-apex-aqua">
          Back to arcade
        </button>
      </div>
    );
  }

  const handleResult = (points: number, bonus: boolean) => {
    recordPlay(game.slug, points, bonus);
    // Honest framing: a low-scoring play (near the consolation floor) is
    // labeled as a miss rather than dressed up as a win, so the skill
    // curve in src/lib/rewardEngine.ts is legible to the player.
    const tier: "miss" | "win" | "bonus" = bonus ? "bonus" : points <= game.minPoints ? "miss" : "win";
    setOverlay({ points, bonus, tier });
    confetti({
      particleCount: tier === "bonus" ? 160 : tier === "win" ? 70 : 0,
      spread: 90,
      origin: { y: 0.6 },
      colors: ["#0057FF", "#E4002B", "#3FD5FF", "#F2C400", "#7ED321"]
    });
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {(() => {
            const Art = BRAND_ART[game.brand];
            return <Art className="h-12 w-12 shrink-0 drop-shadow-lg" />;
          })()}
          <div>
            <p className={`text-xs font-semibold uppercase tracking-widest ${ACCENT_TEXT[game.color]}`}>{game.brand}</p>
            <h1 className="font-display text-xl font-bold">{game.name}</h1>
          </div>
        </div>
        <button onClick={() => router.push("/games")} className="text-sm text-apex-platinum/50">
          ← Arcade
        </button>
      </div>

      <div className="rounded-3xl glass p-4">
        <GameComponent key={mountKey} game={game} onResult={handleResult} />
      </div>

      <PlayResultOverlay
        open={!!overlay}
        points={overlay?.points ?? 0}
        tier={overlay?.tier ?? "win"}
        onClose={() => setOverlay(null)}
        onPlayAgain={() => {
          setOverlay(null);
          setMountKey((k) => k + 1);
        }}
      />
    </div>
  );
}
