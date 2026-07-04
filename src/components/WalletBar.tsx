"use client";

import { motion } from "framer-motion";
import { useWallet, nextTierProgress } from "@/lib/store";
import TierBadge, { tierLabel } from "./TierBadge";

export default function WalletBar() {
  const { balance, lifetimePoints } = useWallet();
  const progress = nextTierProgress(lifetimePoints);

  return (
    <div className="glass rounded-2xl p-4 shadow-glass">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TierBadge tier={progress.current} />
          <div>
            <p className="text-xs uppercase tracking-wide text-apex-platinum/50">{tierLabel(progress.current)} member</p>
            <motion.p
              key={balance}
              initial={{ scale: 1.15, color: "#3FD5FF" }}
              animate={{ scale: 1, color: "#E7ECF7" }}
              transition={{ duration: 0.4 }}
              className="font-display text-2xl font-bold"
            >
              {balance.toLocaleString()} pts
            </motion.p>
          </div>
        </div>
      </div>

      {progress.next && (
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-[11px] text-apex-platinum/50">
            <span>Progress to {tierLabel(progress.next)}</span>
            <span>{progress.remaining.toLocaleString()} pts to go</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-apex-cobalt via-apex-aqua to-apex-lime"
              initial={{ width: 0 }}
              animate={{ width: `${progress.pct}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
