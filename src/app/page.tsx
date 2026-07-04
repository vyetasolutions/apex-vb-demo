"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import WalletBar from "@/components/WalletBar";
import { GAMES } from "@/lib/store";
import { ACCENT_BG } from "@/lib/theme";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl glass p-6 shadow-neon"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-apex-aqua">Scan. Play. Win. Repeat.</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight">
          Every bottle is a <span className="text-gradient-brand">ticket to play.</span>
        </h1>
        <p className="mt-2 text-sm text-apex-platinum/60">
          Six branded arcade games across the Varun Beverages portfolio — unlimited plays in this demo build.
        </p>
        <Link
          href="/games"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-apex-cobalt px-5 py-3 font-semibold text-white shadow-neon transition hover:brightness-110"
        >
          Play now
        </Link>
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-apex-crimson/30 blur-3xl" />
      </motion.section>

      <WalletBar />

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Featured games</h2>
          <Link href="/games" className="text-sm text-apex-aqua">See all</Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {GAMES.slice(0, 4).map((g, i) => (
            <motion.div
              key={g.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                href={`/games/${g.slug}`}
                className={`block rounded-2xl glass p-4 transition hover:-translate-y-1 hover:shadow-neon`}
              >
                <div className={`mb-3 h-10 w-10 rounded-xl ${ACCENT_BG[g.color]} animate-floaty`} />
                <p className="text-sm font-semibold">{g.name}</p>
                <p className="text-xs text-apex-platinum/50">{g.brand}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
