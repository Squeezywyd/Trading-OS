"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Search, Download, Upload } from "lucide-react";
import type { TradeWithR } from "@/lib/data/trades";
import {
  INSTRUMENTS,
  RESULTS,
  SESSIONS,
  type Instrument,
  type Result,
  type Session,
} from "@/lib/constants/enums";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/empty-state";
import { NotebookPen } from "lucide-react";

function resultVariant(result: Result | null) {
  if (result === "Win") return "text-profit";
  if (result === "Loss") return "text-loss";
  return "text-muted-foreground";
}

const ALL = "__all__";

export function TradesTable({ trades }: { trades: TradeWithR[] }) {
  const [search, setSearch] = React.useState("");
  const [instrument, setInstrument] = React.useState<Instrument | typeof ALL>(ALL);
  const [session, setSession] = React.useState<Session | typeof ALL>(ALL);
  const [result, setResult] = React.useState<Result | typeof ALL>(ALL);

  const filtered = React.useMemo(() => {
    return trades.filter((t) => {
      if (search && !t.title?.toLowerCase().includes(search.toLowerCase())) return false;
      if (instrument !== ALL && t.instrument !== instrument) return false;
      if (session !== ALL && t.session !== session) return false;
      if (result !== ALL && t.result !== result) return false;
      return true;
    });
  }, [trades, search, instrument, session, result]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[180px] flex-1">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
          <Input
            placeholder="Search title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        <Select
          value={instrument}
          onValueChange={(v) => setInstrument(v as Instrument | typeof ALL)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Instrument" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All instruments</SelectItem>
            {INSTRUMENTS.map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={session} onValueChange={(v) => setSession(v as Session | typeof ALL)}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Session" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All sessions</SelectItem>
            {SESSIONS.map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={result} onValueChange={(v) => setResult(v as Result | typeof ALL)}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Result" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All results</SelectItem>
            {RESULTS.map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" render={<a href="/api/trades/export" />}>
            <Download />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" render={<Link href="/journal/import" />}>
            <Upload />
            Import CSV
          </Button>
          <Button size="sm" render={<Link href="/journal/new" />}>
            <Plus />
            New trade
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={NotebookPen}
          title={trades.length === 0 ? "No trades yet" : "No trades match your filters"}
          description={
            trades.length === 0
              ? "Log your first trade to start tracking setup grade, R multiple, and lessons learned."
              : "Try clearing the search or filters."
          }
          action={
            trades.length === 0 ? (
              <Button size="sm" render={<Link href="/journal/new" />}>
                <Plus />
                Log your first trade
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="glass-panel overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border/60 text-muted-foreground border-b text-left text-xs">
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">Trade</th>
                <th className="px-3 py-2 font-medium">Instrument</th>
                <th className="px-3 py-2 font-medium">Session</th>
                <th className="px-3 py-2 font-medium">Result</th>
                <th className="px-3 py-2 text-right font-medium">R</th>
                <th className="px-3 py-2 text-right font-medium">P&amp;L</th>
                <th className="px-3 py-2 font-medium">Grade</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr
                  key={t.id}
                  className="border-border/40 hover:bg-muted/30 border-b transition-colors last:border-0"
                >
                  <td className="px-3 py-2 font-mono text-xs whitespace-nowrap tabular-nums">
                    {t.date}
                  </td>
                  <td className="px-3 py-2">
                    <Link
                      href={`/journal/${t.id}/edit`}
                      className="hover:text-primary hover:underline"
                    >
                      {t.title}
                    </Link>
                  </td>
                  <td className="px-3 py-2">{t.instrument}</td>
                  <td className="px-3 py-2">{t.session}</td>
                  <td className={`px-3 py-2 font-medium ${resultVariant(t.result)}`}>
                    {t.result ?? "—"}
                  </td>
                  <td
                    className={`px-3 py-2 text-right font-mono tabular-nums ${t.r_multiple != null ? (t.r_multiple >= 0 ? "text-profit" : "text-loss") : "text-muted-foreground"}`}
                  >
                    {t.r_multiple != null
                      ? `${t.r_multiple > 0 ? "+" : ""}${t.r_multiple.toFixed(2)}R`
                      : "—"}
                  </td>
                  <td
                    className={`px-3 py-2 text-right font-mono tabular-nums ${t.pnl_usd != null ? (t.pnl_usd >= 0 ? "text-profit" : "text-loss") : "text-muted-foreground"}`}
                  >
                    {t.pnl_usd != null
                      ? `${t.pnl_usd >= 0 ? "+" : "-"}$${Math.abs(t.pnl_usd).toFixed(2)}`
                      : "—"}
                  </td>
                  <td className="px-3 py-2">
                    {t.setup_grade ? <Badge variant="outline">{t.setup_grade}</Badge> : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
