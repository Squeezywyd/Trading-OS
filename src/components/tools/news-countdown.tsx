"use client";

import * as React from "react";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { Bell } from "lucide-react";
import { NY_TZ, formatMinutesAsHm } from "@/lib/trading/sessions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";

const STORAGE_KEY = "trading-os:news-countdown-time";

const PRESETS = [
  { label: "8:30 AM ET", time: "08:30" },
  { label: "10:00 AM ET", time: "10:00" },
  { label: "2:00 PM ET", time: "14:00" },
];

function todayNyAt(time: string): Date {
  const zonedNow = toZonedTime(new Date(), NY_TZ);
  const [h, m] = time.split(":").map(Number);
  const y = zonedNow.getFullYear();
  const mo = zonedNow.getMonth();
  const d = zonedNow.getDate();
  // Build a wall-clock NY time, then convert it to the correct UTC instant —
  // fromZonedTime handles the DST offset for that specific date.
  const wallClock = new Date(y, mo, d, h, m, 0);
  return fromZonedTime(wallClock, NY_TZ);
}

export function NewsCountdown() {
  const [targetTime, setTargetTime] = React.useState("08:30");
  const [now, setNow] = React.useState<Date | null>(null);

  React.useEffect(() => {
    // Client-only: localStorage read and the clock tick must not run during
    // SSR/hydration.
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setTargetTime(saved);
    } catch {
      // localStorage unavailable — keep default.
    }
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, targetTime);
    } catch {
      // per-viewer convenience only — safe to drop.
    }
  }, [targetTime]);

  if (!now) return <div className="glass-panel h-40 animate-pulse p-5" />;

  let target = todayNyAt(targetTime);
  if (target.getTime() <= now.getTime()) {
    target = new Date(target.getTime() + 24 * 60 * 60 * 1000);
  }
  const msRemaining = target.getTime() - now.getTime();
  const totalMinutes = Math.floor(msRemaining / 60000);
  const seconds = Math.floor((msRemaining % 60000) / 1000);

  return (
    <div className="glass-panel space-y-4 p-5">
      <p className="label-muted flex items-center gap-1.5">
        <Bell className="size-3.5" />
        News Day Countdown
      </p>

      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <Button
            key={p.time}
            type="button"
            size="sm"
            variant={targetTime === p.time ? "default" : "outline"}
            onClick={() => setTargetTime(p.time)}
          >
            {p.label}
          </Button>
        ))}
      </div>

      <Field>
        <FieldLabel htmlFor="news-time">Custom time (ET)</FieldLabel>
        <FieldContent className="max-w-32">
          <Input
            id="news-time"
            type="time"
            value={targetTime}
            onChange={(e) => setTargetTime(e.target.value)}
            className="font-mono tabular-nums"
          />
        </FieldContent>
      </Field>

      <div className="glass-panel-flat p-4 text-center">
        <p className="font-mono text-3xl font-semibold tabular-nums">
          {formatMinutesAsHm(totalMinutes)} {String(seconds).padStart(2, "0")}s
        </p>
        <p className="text-muted-foreground mt-1 text-xs">until {targetTime} ET</p>
      </div>
    </div>
  );
}
