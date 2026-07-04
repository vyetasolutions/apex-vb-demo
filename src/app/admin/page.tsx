"use client";

import { useWallet, GAMES } from "@/lib/store";

export default function AdminPage() {
  const { history, balance, lifetimePoints } = useWallet();

  const perGame = GAMES.map((g) => {
    const plays = history.filter((h) => h.gameSlug === g.slug);
    const pointsIssued = plays.reduce((acc, p) => acc + p.points, 0);
    return { ...g, plays: plays.length, pointsIssued };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Admin console</h1>
        <p className="text-sm text-apex-platinum/50">Read-only demo view — this device only.</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Stat label="This wallet" value={balance.toLocaleString()} />
        <Stat label="Lifetime pts" value={lifetimePoints.toLocaleString()} />
        <Stat label="Total plays" value={history.length.toLocaleString()} />
      </div>

      <section>
        <h2 className="mb-3 font-display text-lg font-bold">Game activity</h2>
        <div className="space-y-2">
          {perGame.map((g) => (
            <div key={g.slug} className="flex items-center justify-between rounded-xl glass p-3 text-sm">
              <div>
                <p className="font-semibold">{g.name}</p>
                <p className="text-xs text-apex-platinum/50">{g.brand}</p>
              </div>
              <div className="text-right">
                <p>{g.plays} plays</p>
                <p className="text-xs text-apex-platinum/50">{g.pointsIssued.toLocaleString()} pts issued</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl glass p-4 text-sm text-apex-platinum/60">
        In production, this view reads from the <code>game_sessions</code>, <code>points_transactions</code> and{" "}
        <code>redemptions</code> tables in Supabase (aggregated server-side or via a materialized view), covering
        every user rather than just this device — see docs/ARCHITECTURE.md.
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl glass p-3 text-center">
      <p className="font-display text-lg font-bold">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-apex-platinum/50">{label}</p>
    </div>
  );
}
