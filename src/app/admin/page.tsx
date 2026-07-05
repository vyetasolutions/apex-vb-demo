"use client";

import { useWallet, GAMES, uniqueActiveDays } from "@/lib/store";
import { computeEconomics, fmtZMW, COST_PER_POINT_ZMW, AVG_MARGIN_PER_INCREMENTAL_BOTTLE_ZMW, INCREMENTAL_PURCHASE_PROBABILITY } from "@/lib/economics";

export default function AdminPage() {
  const { history, balance, lifetimePoints, redemptions } = useWallet();

  const perGame = GAMES.map((g) => {
    const plays = history.filter((h) => h.gameSlug === g.slug);
    const pointsIssued = plays.reduce((acc, p) => acc + p.points, 0);
    return { ...g, plays: plays.length, pointsIssued };
  });

  const pointsRedeemed = redemptions.reduce((acc, r) => acc + r.pointsSpent, 0);
  const activeDays = uniqueActiveDays(history);

  const econ = computeEconomics({
    pointsIssued: lifetimePoints,
    pointsRedeemed,
    pointsOutstanding: balance,
    uniqueActiveDays: activeDays
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

      <section className="space-y-3">
        <div>
          <h2 className="font-display text-lg font-bold">Business economics</h2>
          <p className="text-xs text-apex-platinum/50">
            Illustrative model — every assumption below is editable in{" "}
            <code>src/lib/economics.ts</code>, not measured data. Replace with real Varun figures once available.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <EconStat label="Cost to serve" value={fmtZMW(econ.costToServeZMW)} hint="points issued × cost/point" />
          <EconStat
            label="Outstanding liability"
            value={fmtZMW(econ.outstandingLiabilityZMW)}
            hint="unredeemed balance × cost/point"
          />
          <EconStat
            label="Redemption cost realized"
            value={fmtZMW(econ.redemptionCostRealizedZMW)}
            hint={`${pointsRedeemed.toLocaleString()} pts redeemed`}
          />
          <EconStat
            label="Repeat-visit days"
            value={activeDays.toString()}
            hint="distinct days played — the retention signal"
          />
        </div>

        <div className="rounded-2xl glass p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Projected ROI</p>
            <p
              className={`font-display text-xl font-bold ${
                econ.roiPercent === null ? "text-apex-platinum/50" : econ.roiPercent >= 0 ? "text-apex-lime" : "text-apex-crimson"
              }`}
            >
              {econ.roiPercent === null ? "—" : `${econ.roiPercent >= 0 ? "+" : ""}${econ.roiPercent.toFixed(0)}%`}
            </p>
          </div>
          <p className="mt-1 text-xs text-apex-platinum/50">
            Projected incremental profit ({fmtZMW(econ.projectedIncrementalProfitZMW)}) vs. cost to serve, assuming a{" "}
            {(INCREMENTAL_PURCHASE_PROBABILITY * 100).toFixed(0)}% chance a repeat-visit day converts to one extra
            bottle at {fmtZMW(AVG_MARGIN_PER_INCREMENTAL_BOTTLE_ZMW)} margin, at {fmtZMW(COST_PER_POINT_ZMW)}/point cost
            to serve.
          </p>
        </div>
      </section>

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
        every user rather than just this device — see docs/ARCHITECTURE.md. The economics inputs
        (cost-per-point, incremental margin, conversion probability) should be replaced with figures from a real
        pilot as soon as they exist.
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

function EconStat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl glass p-3">
      <p className="text-[10px] uppercase tracking-wide text-apex-platinum/50">{label}</p>
      <p className="font-display text-lg font-bold">{value}</p>
      <p className="text-[10px] text-apex-platinum/40">{hint}</p>
    </div>
  );
}
