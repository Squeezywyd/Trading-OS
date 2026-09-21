import { CONTRACT_POINT_VALUES, type Instrument, type Result } from "@/lib/constants/enums";

/**
 * Risk in USD = contracts x |entry - stop| x USD-per-point for the instrument.
 * Returns null when the instrument has no fixed point value (ETH, Other) and
 * inputs can't otherwise be resolved — caller falls back to manual entry.
 */
export function calcRiskUsd(params: {
  instrument: Instrument;
  contracts: number | null | undefined;
  entryPrice: number | null | undefined;
  stopPrice: number | null | undefined;
}): number | null {
  const { instrument, contracts, entryPrice, stopPrice } = params;
  const pointValue = CONTRACT_POINT_VALUES[instrument];

  if (
    pointValue == null ||
    contracts == null ||
    entryPrice == null ||
    stopPrice == null ||
    !Number.isFinite(contracts) ||
    !Number.isFinite(entryPrice) ||
    !Number.isFinite(stopPrice)
  ) {
    return null;
  }

  const points = Math.abs(entryPrice - stopPrice);
  return round2(contracts * points * pointValue);
}

/** R multiple = pnl / risk. Never stored — always derived, matching the DB view. */
export function calcRMultiple(
  pnlUsd: number | null | undefined,
  riskUsd: number | null | undefined,
): number | null {
  if (pnlUsd == null || riskUsd == null || !Number.isFinite(pnlUsd) || !riskUsd) return null;
  return round4(pnlUsd / riskUsd);
}

/** Result auto-derives from realized P&L: > 0 Win, < 0 Loss, exactly 0 Break Even. */
export function calcResultFromPnl(pnlUsd: number | null | undefined): Result | null {
  if (pnlUsd == null || !Number.isFinite(pnlUsd)) return null;
  if (pnlUsd > 0) return "Win";
  if (pnlUsd < 0) return "Loss";
  return "Break Even";
}

export function calcExpectancyUsd(pnls: number[]): number | null {
  if (pnls.length === 0) return null;
  return round2(pnls.reduce((a, b) => a + b, 0) / pnls.length);
}

export function calcExpectancyR(rMultiples: Array<number | null>): number | null {
  const valid = rMultiples.filter((r): r is number => r != null && Number.isFinite(r));
  if (valid.length === 0) return null;
  return round4(valid.reduce((a, b) => a + b, 0) / valid.length);
}

export function calcWinRate(results: Array<Result | null | undefined>): number | null {
  const decisive = results.filter((r) => r === "Win" || r === "Loss");
  if (decisive.length === 0) return null;
  const wins = decisive.filter((r) => r === "Win").length;
  return round2((100 * wins) / decisive.length);
}

export function calcProfitFactor(pnls: number[]): number | null {
  const grossProfit = pnls.filter((p) => p > 0).reduce((a, b) => a + b, 0);
  const grossLoss = Math.abs(pnls.filter((p) => p < 0).reduce((a, b) => a + b, 0));
  if (grossLoss === 0) return null;
  return round4(grossProfit / grossLoss);
}

/** Position size for a target risk, given a stop distance in points. */
export function calcPositionSize(params: {
  instrument: Instrument;
  riskBudgetUsd: number;
  stopDistancePoints: number;
}): number | null {
  const { instrument, riskBudgetUsd, stopDistancePoints } = params;
  const pointValue = CONTRACT_POINT_VALUES[instrument];
  if (!pointValue || stopDistancePoints <= 0 || riskBudgetUsd <= 0) return null;
  return Math.floor(riskBudgetUsd / (stopDistancePoints * pointValue));
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function round4(n: number) {
  return Math.round(n * 10000) / 10000;
}
