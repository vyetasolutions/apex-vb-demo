"use client";

import { AnimatePresence, motion } from "framer-motion";

export default function PlayResultOverlay({
  open,
  points,
  bonus,
  onClose,
  onPlayAgain
}: {
  open: boolean;
  points: number;
  bonus: boolean;
  onClose: () => void;
  onPlayAgain: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-72 rounded-3xl glass p-6 text-center shadow-neon"
          >
            <p className="text-xs uppercase tracking-widest text-apex-aqua">
              {bonus ? "Bonus multiplier!" : "You won"}
            </p>
            <p className="mt-2 font-display text-4xl font-extrabold text-gradient-brand">+{points}</p>
            <p className="text-sm text-apex-platinum/50">points added to your wallet</p>

            <div className="mt-5 flex gap-2">
              <button
                onClick={onPlayAgain}
                className="flex-1 rounded-xl bg-apex-cobalt py-2.5 text-sm font-semibold text-white shadow-neon"
              >
                Play again
              </button>
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-semibold text-apex-platinum/80"
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
