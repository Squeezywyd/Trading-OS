import Link from "next/link";
import { format, subDays } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import {
  Activity,
  CalendarCheck,
  Flame,
  Percent,
  Scale,
  Sunrise,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { StatCard } from "@/components/dashboard/stat-card";
import { EquityCurveChart } from "@/components/dashboard/equity-curve-chart";
import { RiskGauge } from "@/components/dashboard/risk-gauge";
import { DateRangeTabs } from "@/components/dashboard/date-range-tabs";
import { Badge } from "@/components/ui/badge";
import { getBiasAccuracy, getDashboardKpis, getEquityCurve } from "@/lib/data/analytics";
import { getAccountSettings } from "@/lib/data/account-settings";
import { getDailyPrepByDate } from "@/lib/data/daily-preps";
import { getWeeklyRecapByWeekStart, getWeeklyRecapStats, weekStartForDate } from "@/lib/data/weekly-recaps";
import { NY_TZ } from "@/lib/trading/sessions";

const RANGE_DAYS: Record<string, number | null> = { "7d": 7, "30d": 30, "90d": 90, all: null };

const usd = (n: number) => `${n < 0 ? "-" : ""}$${Math.abs(n).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
const pct = (n: number) => `${n.toFixed(1)}%`;
const rMult = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(2)}R`;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range: rangeParam } = await searchParams;
  const range = rangeParam && rangeParam in RANGE_DAYS ? rangeParam : "30d";
  const days = RANGE_DAYS[range];
  const todayNy = format(toZonedTime(new Date(), NY_TZ), "yyyy-MM-dd");
  const start = days ? format(subDays(new Date(), days), "yyyy-MM-dd") : undefined;

  const [kpis, biasAccuracy, equityCurve, settings, todayPrep] = await Promise.all([
    getDashboardKpis({ start }),
    getBiasAccuracy({ start }),
    getEquityCurve({ start }),
    getAccountSettings(),
    getDailyPrepByDate(todayNy),
  ]);

  const weekStart = weekStartForDate(todayNy);
  const weekRecap = await getWeeklyRecapByWeekStart(weekStart);
  const weekStats = weekRecap ? await getWeeklyRecapStats(weekRecap.id) : null;

  const todayTrades = equityCurve.find((e) => e.date === todayNy);
  const todayLoss = todayTrades?.daily_pnl != null && todayTrades.daily_pnl < 0 ? Math.abs(todayTrades.daily_pnl) : 0;
  const latestDrawdown = equityCurve.length > 0 ? Math.abs(equityCurve[equityCurve.length - 1].drawdown ?? 0) : 0;

  const hasTrades = (kpis?.trade_count ?? 0) > 0;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Equity curve, KPIs, and today's prep status."
        actions={<DateRangeTabs value={range} />}
      />

      {!hasTrades ? (
        <EmptyState
          icon={Activity}
          title="No trades logged yet"
          description="Once you log trades and complete a daily prep, your equity curve, win rate, expectancy, and drawdown will show up here."
        />
      ) : (
        <div className="space-y-6">
          <div className="glass-panel p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="label-muted">Equity curve</p>
              <span className="text-muted-foreground font-mono text-xs tabular-nums">
                {kpis?.trade_count ?? 0} trades
              </span>
            </div>
            <EquityCurveChart data={equityCurve} />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <StatCard
              label="Net P&L"
              value={kpis?.net_pnl ?? 0}
              formatter={usd}
              icon={kpis && kpis.net_pnl >= 0 ? TrendingUp : TrendingDown}
              tone={kpis && kpis.net_pnl >= 0 ? "profit" : "loss"}
            />
            <StatCard label="Win rate" value={kpis?.win_rate ?? 0} formatter={pct} icon={Target} />
            <StatCard label="Expectancy" value={kpis?.expectancy_r ?? 0} formatter={rMult} icon={Scale} />
            <StatCard
              label="Profit factor"
              value={kpis?.profit_factor ?? 0}
              formatter={(n) => n.toFixed(2)}
              icon={Percent}
            />
            <StatCard
              label="Max drawdown"
              value={kpis?.max_drawdown ?? 0}
              formatter={usd}
              tone="loss"
              icon={TrendingDown}
            />
            <StatCard label="Avg win" value={kpis?.avg_win_r ?? 0} formatter={rMult} tone="profit" />
            <StatCard label="Avg loss" value={kpis?.avg_loss_r ?? 0} formatter={rMult} tone="loss" />
            <StatCard
              label="Streak"
              value={kpis?.current_streak ?? 0}
              formatter={(n) => `${n} ${kpis?.current_streak_type ?? ""}`}
              icon={Flame}
            />
            <StatCard
              label="Bias accuracy"
              value={biasAccuracy?.accuracy_pct ?? 0}
              formatter={pct}
              icon={CalendarCheck}
            />
            <StatCard label="Rule breaks" value={kpis?.rule_break_count ?? 0} formatter={(n) => `${n}`} tone={kpis && kpis.rule_break_count > 0 ? "loss" : "neutral"} />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <RiskGauge label="Today's loss vs daily limit" usedUsd={todayLoss} limitUsd={settings?.daily_loss_limit_usd ?? null} />
            <RiskGauge label="Current drawdown vs max" usedUsd={latestDrawdown} limitUsd={settings?.max_drawdown_usd ?? null} />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link href="/recap" className="glass-panel hover:border-border block p-4 transition-colors">
              <p className="label-muted">This week</p>
              <div className="mt-1.5 flex items-baseline gap-3">
                <span className={`font-mono text-xl font-semibold tabular-nums ${weekStats && weekStats.net_pnl != null && weekStats.net_pnl >= 0 ? "text-profit" : "text-loss"}`}>
                  {weekStats ? usd(weekStats.net_pnl ?? 0) : "—"}
                </span>
                <span className="text-muted-foreground text-xs">{weekStats?.trade_count ?? 0} trades</span>
              </div>
            </Link>

            <Link href="/prep" className="glass-panel hover:border-border block p-4 transition-colors">
              <p className="label-muted">Today&apos;s prep</p>
              <div className="mt-1.5 flex items-center gap-2">
                <Sunrise className="text-muted-foreground size-4" />
                {todayPrep ? (
                  <Badge variant="outline">{todayPrep.daily_bias ?? "Bias not set"}</Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">Not started</span>
                )}
              </div>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
