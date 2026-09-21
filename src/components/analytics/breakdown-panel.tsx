"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { StatsRow } from "@/lib/data/analytics";

const LOW_SAMPLE_THRESHOLD = 10;

function usd(n: number | null) {
  if (n == null) return "—";
  return `${n < 0 ? "-" : ""}$${Math.abs(n).toFixed(0)}`;
}

function rFmt(n: number | null) {
  if (n == null) return "—";
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}R`;
}

function ExpectancyTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: StatsRow }>;
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <div className="border-border/60 bg-popover rounded-lg border px-3 py-2 font-mono text-xs shadow-xl">
      <p className="text-foreground mb-1 font-medium">{row.dimension}</p>
      <p className="text-muted-foreground">
        n={row.n} · win rate {row.win_rate?.toFixed(0) ?? "—"}%
      </p>
      <p className={row.expectancy != null && row.expectancy >= 0 ? "text-profit" : "text-loss"}>
        {usd(row.expectancy)} expectancy
      </p>
    </div>
  );
}

export function BreakdownPanel({ rows }: { rows: StatsRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">No trades in this range yet.</p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
            <XAxis
              dataKey="dimension"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              interval={0}
              angle={rows.length > 6 ? -25 : 0}
              textAnchor={rows.length > 6 ? "end" : "middle"}
              height={rows.length > 6 ? 48 : 24}
            />
            <YAxis
              tick={{
                fontSize: 11,
                fill: "var(--muted-foreground)",
                fontFamily: "var(--font-mono)",
              }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => usd(v)}
              width={56}
            />
            <Tooltip cursor={{ fill: "var(--muted)" }} content={<ExpectancyTooltip />} />
            <Bar dataKey="expectancy" radius={[4, 4, 4, 4]} maxBarSize={40}>
              {rows.map((row) => (
                <Cell
                  key={row.dimension}
                  fill={
                    row.expectancy != null && row.expectancy >= 0 ? "var(--profit)" : "var(--loss)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Dimension</TableHead>
            <TableHead className="text-right">n</TableHead>
            <TableHead className="text-right">Win rate</TableHead>
            <TableHead className="text-right">Avg R</TableHead>
            <TableHead className="text-right">Expectancy</TableHead>
            <TableHead className="text-right">Total P&amp;L</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.dimension}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-1.5">
                  {row.dimension}
                  {row.n < LOW_SAMPLE_THRESHOLD ? (
                    <Badge variant="outline" className="text-muted-foreground gap-1 text-[10px]">
                      <AlertTriangle className="size-2.5" />
                      low n
                    </Badge>
                  ) : null}
                </div>
              </TableCell>
              <TableCell className="text-right font-mono tabular-nums">{row.n}</TableCell>
              <TableCell className="text-right font-mono tabular-nums">
                {row.win_rate != null ? `${row.win_rate.toFixed(0)}%` : "—"}
              </TableCell>
              <TableCell className="text-right font-mono tabular-nums">{rFmt(row.avg_r)}</TableCell>
              <TableCell
                className={`text-right font-mono tabular-nums ${row.expectancy != null && row.expectancy >= 0 ? "text-profit" : "text-loss"}`}
              >
                {usd(row.expectancy)}
              </TableCell>
              <TableCell
                className={`text-right font-mono tabular-nums ${row.total_pnl != null && row.total_pnl >= 0 ? "text-profit" : "text-loss"}`}
              >
                {usd(row.total_pnl)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
