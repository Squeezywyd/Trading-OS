"use client";

import * as React from "react";
import { toZonedTime } from "date-fns-tz";
import {
  ALL_WINDOWS,
  KILLZONE_WINDOWS,
  NY_TZ,
  SILVER_BULLET_WINDOWS,
  ZURICH_TZ,
  activeWindows,
  formatMinutesAsHm,
  minutesUntilWindowOpens,
} from "@/lib/trading/sessions";
import { Badge } from "@/components/ui/badge";

function formatClock(date: Date, tz: string) {
  const zoned = toZonedTime(date, tz);
  return zoned.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
}

export function SessionClock() {
  const [now, setNow] = React.useState<Date | null>(null);

  React.useEffect(() => {
    // Client-only clock tick — Date() must not run during SSR/hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) {
    return <div className="glass-panel h-64 animate-pulse p-5" />;
  }

  const active = activeWindows(now);
  const nextKillzone = [...KILLZONE_WINDOWS]
    .map((w) => ({ w, mins: minutesUntilWindowOpens(now, w) }))
    .sort((a, b) => a.mins - b.mins)[0];
  const nextSilverBullet = [...SILVER_BULLET_WINDOWS]
    .map((w) => ({ w, mins: minutesUntilWindowOpens(now, w) }))
    .sort((a, b) => a.mins - b.mins)[0];

  return (
    <div className="glass-panel space-y-5 p-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="label-muted">New York</p>
          <p className="mt-1 font-mono text-2xl font-semibold tabular-nums">{formatClock(now, NY_TZ)}</p>
        </div>
        <div>
          <p className="label-muted">Zurich</p>
          <p className="mt-1 font-mono text-2xl font-semibold tabular-nums">{formatClock(now, ZURICH_TZ)}</p>
        </div>
      </div>

      <div>
        <p className="label-muted mb-2">Active now</p>
        {active.length === 0 ? (
          <p className="text-muted-foreground text-sm">No session or killzone active</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {active.map((w) => (
              <Badge
                key={w.key}
                variant={w.kind === "silver-bullet" ? "default" : "outline"}
                className={w.kind === "killzone" ? "border-primary/40 text-primary" : ""}
              >
                {w.label}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground text-xs">Next killzone</p>
          <p className="font-medium">
            {nextKillzone.w.label}
            <span className="text-muted-foreground font-mono text-xs tabular-nums"> · {formatMinutesAsHm(nextKillzone.mins)}</span>
          </p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Next Silver Bullet</p>
          <p className="font-medium">
            {nextSilverBullet.w.label}
            <span className="text-muted-foreground font-mono text-xs tabular-nums"> · {formatMinutesAsHm(nextSilverBullet.mins)}</span>
          </p>
        </div>
      </div>

      <div>
        <p className="label-muted mb-2">All windows (NY time)</p>
        <div className="space-y-1">
          {ALL_WINDOWS.map((w) => {
            const isActive = active.some((a) => a.key === w.key);
            const h = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
            return (
              <div
                key={w.key}
                className={`flex items-center justify-between rounded-md px-2 py-1 text-xs ${isActive ? "bg-primary/10 text-foreground" : "text-muted-foreground"}`}
              >
                <span>{w.label}</span>
                <span className="font-mono tabular-nums">{h(w.startMinute)}–{h(w.endMinute)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
