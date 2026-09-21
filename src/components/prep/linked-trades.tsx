import Link from "next/link";
import { NotebookPen, Plus } from "lucide-react";
import type { TradeWithR } from "@/lib/data/trades";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";

export function LinkedTrades({ trades }: { trades: TradeWithR[] }) {
  return (
    <div className="space-y-3">
      <p className="label-muted">Trades this day</p>
      {trades.length === 0 ? (
        <EmptyState
          icon={NotebookPen}
          title="No trades logged for this day"
          description="Trades you log with this date link here automatically."
          action={
            <Button size="sm" render={<Link href="/journal/new" />}>
              <Plus />
              Log a trade
            </Button>
          }
        />
      ) : (
        <div className="glass-panel divide-border/40 divide-y">
          {trades.map((t) => (
            <Link
              key={t.id}
              href={`/journal/${t.id}/edit`}
              className="hover:bg-muted/30 flex items-center justify-between px-4 py-3 text-sm transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium">{t.title}</span>
                <Badge variant="outline">{t.instrument}</Badge>
                <Badge variant="outline">{t.session}</Badge>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs tabular-nums">
                {t.r_multiple != null ? (
                  <span className={t.r_multiple >= 0 ? "text-profit" : "text-loss"}>
                    {t.r_multiple > 0 ? "+" : ""}
                    {t.r_multiple.toFixed(2)}R
                  </span>
                ) : null}
                <span
                  className={
                    t.result === "Win"
                      ? "text-profit"
                      : t.result === "Loss"
                        ? "text-loss"
                        : "text-muted-foreground"
                  }
                >
                  {t.result ?? "—"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
