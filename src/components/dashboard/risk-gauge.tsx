import { cn } from "@/lib/utils";

export function RiskGauge({
  label,
  usedUsd,
  limitUsd,
}: {
  label: string;
  usedUsd: number;
  limitUsd: number | null;
}) {
  if (limitUsd == null || limitUsd <= 0) {
    return (
      <div className="glass-panel p-4">
        <p className="label-muted">{label}</p>
        <p className="text-muted-foreground mt-2 text-xs">Set a limit in Settings to track this</p>
      </div>
    );
  }

  const pct = Math.min(100, Math.max(0, (usedUsd / limitUsd) * 100));
  const danger = pct >= 80;
  const warn = pct >= 50 && pct < 80;

  return (
    <div className="glass-panel p-4">
      <div className="flex items-baseline justify-between">
        <p className="label-muted">{label}</p>
        <p className="font-mono text-xs tabular-nums">
          <span className={cn(danger && "text-loss", warn && "text-amber-500")}>
            ${usedUsd.toFixed(0)}
          </span>
          <span className="text-muted-foreground"> / ${limitUsd.toFixed(0)}</span>
        </p>
      </div>
      <div className="bg-muted mt-2.5 h-1.5 w-full overflow-hidden rounded-full">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-500",
            danger ? "bg-loss" : warn ? "bg-amber-500" : "bg-primary",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
