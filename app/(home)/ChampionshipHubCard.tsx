import { Card } from "@/components/Card";

export const ChampionshipHubCard = () => {
  return (
    <Card className="relative flex h-[372px] flex-col justify-between overflow-hidden rounded-[28px] border-white/70 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 text-white shadow-sm">
      <div className="absolute -right-12 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-brand-primary-300/15 blur-2xl" />

      <div className="relative z-10 space-y-3">
        <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">
          Coming Soon
        </span>
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight">
            Championship Hub
          </h2>
          <p className="max-w-sm text-sm leading-6 text-white/70">
            Seasonal competitions, leaderboards, and challenge signups will live
            here soon.
          </p>
        </div>
      </div>

      <div className="relative z-10 flex items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">
            Next rollout
          </p>
          <p className="text-lg font-medium">Community race season</p>
        </div>
        <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-right shrink-0">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">
            Status
          </p>
          <p className="text-sm font-medium ">In planning</p>
        </div>
      </div>
    </Card>
  );
};
