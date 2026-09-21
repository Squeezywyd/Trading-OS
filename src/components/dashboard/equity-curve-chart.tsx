"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";
import type { Tables } from "@/lib/supabase/database.types";

type EquityPoint = Tables<"equity_curve">;

function formatUsd(n: number) {
  const sign = n < 0 ? "-" : "";
  return `${sign}$${Math.abs(n).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ payload: EquityPoint }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;

  return (
    <div className="border-border/60 bg-popover rounded-lg border px-3 py-2 font-mono text-xs shadow-xl">
      <p className="text-muted-foreground mb-1">{label ? format(new Date(label), "EEE, MMM d") : ""}</p>
      <p className={(point.cumulative_pnl ?? 0) >= 0 ? "text-profit" : "text-loss"}>
        {formatUsd(point.cumulative_pnl ?? 0)}
      </p>
      <p className="text-muted-foreground">
        {point.cumulative_r != null ? `${point.cumulative_r >= 0 ? "+" : ""}${point.cumulative_r.toFixed(2)}R` : "—"}
      </p>
      {point.drawdown != null && point.drawdown < 0 ? (
        <p className="text-loss mt-1">{formatUsd(point.drawdown)} drawdown</p>
      ) : null}
    </div>
  );
}

export function EquityCurveChart({ data }: { data: EquityPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="text-muted-foreground flex h-64 items-center justify-center text-sm">
        No trades in this range yet
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
          <defs>
            <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.28} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(d: string) => format(new Date(d), "MMM d")}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            minTickGap={32}
          />
          <YAxis
            tickFormatter={(v: number) => formatUsd(v)}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}
            axisLine={false}
            tickLine={false}
            width={64}
          />
          <ReferenceLine y={0} stroke="var(--border)" strokeWidth={1} />
          <Area
            type="monotone"
            dataKey="cumulative_pnl"
            stroke="var(--primary)"
            strokeWidth={2}
            fill="url(#equityFill)"
            dot={false}
            activeDot={{ r: 3, strokeWidth: 0, fill: "var(--primary)" }}
            isAnimationActive
          />
          <Tooltip cursor={{ stroke: "var(--border)", strokeWidth: 1 }} content={<CustomTooltip />} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
