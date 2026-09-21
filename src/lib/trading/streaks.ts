import type { Result } from "@/lib/constants/enums";

export interface StreakResult {
  currentStreak: number;
  currentStreakType: "Win" | "Loss" | null;
  bestWinStreak: number;
  bestLossStreak: number;
}

/**
 * Mirrors the gaps-and-islands logic in fn_dashboard_kpis (SQL). Trades must
 * already be ordered chronologically. Break Even trades are skipped — they
 * neither extend nor break a streak.
 */
export function calcStreaks(results: Array<Result | null | undefined>): StreakResult {
  const decisive = results.filter((r): r is "Win" | "Loss" => r === "Win" || r === "Loss");

  let currentStreak = 0;
  let currentStreakType: "Win" | "Loss" | null = null;
  let bestWinStreak = 0;
  let bestLossStreak = 0;
  let runLength = 0;
  let runType: "Win" | "Loss" | null = null;

  for (const result of decisive) {
    if (result === runType) {
      runLength += 1;
    } else {
      runType = result;
      runLength = 1;
    }

    if (runType === "Win") bestWinStreak = Math.max(bestWinStreak, runLength);
    if (runType === "Loss") bestLossStreak = Math.max(bestLossStreak, runLength);

    currentStreak = runLength;
    currentStreakType = runType;
  }

  return { currentStreak, currentStreakType, bestWinStreak, bestLossStreak };
}

export interface EquityPoint {
  date: string;
  pnl: number;
}

export interface DrawdownPoint {
  date: string;
  dailyPnl: number;
  cumulativePnl: number;
  runningPeak: number;
  drawdown: number;
}

/** Mirrors the public.equity_curve SQL view — one row per day, running peak/drawdown. */
export function calcEquityCurve(dailyPnls: EquityPoint[]): DrawdownPoint[] {
  let cumulative = 0;
  let peak = 0;
  return dailyPnls.map(({ date, pnl }) => {
    cumulative += pnl;
    peak = Math.max(peak, cumulative);
    return {
      date,
      dailyPnl: pnl,
      cumulativePnl: cumulative,
      runningPeak: peak,
      drawdown: cumulative - peak,
    };
  });
}

export function calcMaxDrawdown(dailyPnls: EquityPoint[]): number {
  const curve = calcEquityCurve(dailyPnls);
  if (curve.length === 0) return 0;
  return Math.min(...curve.map((c) => c.drawdown));
}
