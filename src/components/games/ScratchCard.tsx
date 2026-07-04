"use client";

import { useEffect, useRef, useState } from "react";
import { GameDef } from "@/lib/store";
import { rollReward } from "@/lib/rewardEngine";

export default function ScratchCard({
  game,
  onResult
}: {
  game: GameDef;
  onResult: (points: number, bonus: boolean) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState<{ points: number; bonus: boolean } | null>(null);
  const scratchedPixels = useRef(0);
  const reported = useRef(false);

  useEffect(() => {
    setResult(rollReward(game));
    reported.current = false;
    setRevealed(false);
    scratchedPixels.current = 0;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#F2C400";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0D1220";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SCRATCH HERE", canvas.width / 2, canvas.height / 2 + 6);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.slug]);

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    scratchedPixels.current += 1;
    if (scratchedPixels.current > 18 && !reported.current && result) {
      reported.current = true;
      setRevealed(true);
      onResult(result.points, result.bonus);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="relative h-56 w-full max-w-sm overflow-hidden rounded-2xl">
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-apex-panelLight">
          <p className="text-xs uppercase tracking-widest text-apex-platinum/50">Mirinda reveal</p>
          <p className="font-display text-3xl font-extrabold text-gradient-brand">
            {result ? `+${result.points}` : "…"}
          </p>
          <p className="text-xs text-apex-platinum/50">{result?.bonus ? "Bonus multiplier!" : "points"}</p>
        </div>
        <canvas
          ref={canvasRef}
          width={360}
          height={224}
          className={`absolute inset-0 h-full w-full cursor-pointer touch-none transition-opacity duration-500 ${
            revealed ? "opacity-0" : "opacity-100"
          }`}
          onMouseMove={(e) => e.buttons === 1 && scratch(e.clientX, e.clientY)}
          onMouseDown={(e) => scratch(e.clientX, e.clientY)}
          onTouchMove={(e) => scratch(e.touches[0].clientX, e.touches[0].clientY)}
        />
      </div>
      <p className="text-sm text-apex-platinum/50">
        {revealed ? "Nice one! Tap play again below." : "Drag your finger across the gold card to scratch it off."}
      </p>
    </div>
  );
}
