"use client";

import { useEffect, useRef, useState } from "react";
import { GameDef } from "@/lib/store";
import { rollReward } from "@/lib/rewardEngine";
import MirindaArt from "@/components/brandart/MirindaArt";

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

    // Mirinda-branded scratch foil: orange base + a diagonal citrus
    // texture instead of a flat gold rectangle.
    ctx.fillStyle = "#F2740C";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(255, 220, 150, 0.35)";
    ctx.lineWidth = 6;
    for (let x = -canvas.height; x < canvas.width; x += 22) {
      ctx.beginPath();
      ctx.moveTo(x, canvas.height);
      ctx.lineTo(x + canvas.height, 0);
      ctx.stroke();
    }
    ctx.fillStyle = "#FFF4DC";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SCRATCH THE MIRINDA CARD", canvas.width / 2, canvas.height / 2 + 6);
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
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-apex-panelLight">
          <MirindaArt className="h-16 w-16 drop-shadow-lg" />
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
        {revealed ? "Nice one! Tap play again below." : "Drag your finger across the orange foil to scratch it off."}
      </p>
    </div>
  );
}
