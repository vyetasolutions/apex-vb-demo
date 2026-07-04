"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import WalletBar from "@/components/WalletBar";
import { useWallet } from "@/lib/store";

const REWARDS = [
  { name: "Free 500ml Pepsi", brand: "Pepsi", cost: 500 },
  { name: "Free 500ml Mirinda", brand: "Mirinda", cost: 500 },
  { name: "Free 500ml 7UP", brand: "7UP", cost: 500 },
  { name: "Mountain Dew Cap", brand: "Mountain Dew", cost: 1500 },
  { name: "Sting Gym Bag", brand: "Sting", cost: 4000 },
  { name: "Aquafina Hamper (12pk)", brand: "Aquafina", cost: 8000 }
];

export default function WalletPage() {
  const { balance, history, redeem } = useWallet();
  const [toast, setToast] = useState<string | null>(null);

  const handleRedeem = (name: string, cost: number) => {
    const ok = redeem(cost, name);
    setToast(ok ? `Redeemed: ${name}` : "Not enough points yet");
    setTimeout(() => setToast(null), 2200);
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Your wallet</h1>
      <WalletBar />

      <section>
        <h2 className="mb-3 font-display text-lg font-bold">Reward catalogue</h2>
        <div className="grid grid-cols-1 gap-2">
          {REWARDS.map((r) => (
            <div key={r.name} className="flex items-center justify-between rounded-2xl glass p-3">
              <div>
                <p className="text-sm font-semibold">{r.name}</p>
                <p className="text-xs text-apex-platinum/50">{r.brand} · {r.cost.toLocaleString()} pts</p>
              </div>
              <button
                onClick={() => handleRedeem(r.name, r.cost)}
                disabled={balance < r.cost}
                className="rounded-lg bg-apex-cobalt px-3 py-2 text-xs font-semibold text-white disabled:opacity-30"
              >
                Redeem
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-bold">Recent activity</h2>
        {history.length === 0 ? (
          <p className="text-sm text-apex-platinum/50">No plays yet — go win some points.</p>
        ) : (
          <div className="space-y-2">
            {history.slice(0, 20).map((h, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-sm">
                <span className="text-apex-platinum/70">{h.gameSlug.replace(/-/g, " ")}</span>
                <span className={h.bonus ? "text-apex-citrus" : "text-apex-lime"}>+{h.points}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 rounded-xl bg-apex-panelLight px-4 py-2 text-sm shadow-glass"
        >
          {toast}
        </motion.div>
      )}
    </div>
  );
}
