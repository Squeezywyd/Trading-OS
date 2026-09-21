import { describe, expect, it } from "vitest";
import { calcEquityCurve, calcMaxDrawdown, calcStreaks } from "../streaks";

describe("calcStreaks", () => {
  it("tracks current streak and best streaks, ignoring Break Even", () => {
    const results = calcStreaks(["Win", "Win", "Loss", "Break Even", "Win", "Win", "Win"]);
    expect(results.currentStreak).toBe(3);
    expect(results.currentStreakType).toBe("Win");
    expect(results.bestWinStreak).toBe(3);
    expect(results.bestLossStreak).toBe(1);
  });

  it("returns zeroed result for no decisive trades", () => {
    const results = calcStreaks([null, "Break Even"]);
    expect(results.currentStreak).toBe(0);
    expect(results.currentStreakType).toBeNull();
  });

  it("current streak resets when the run breaks", () => {
    const results = calcStreaks(["Win", "Loss", "Loss"]);
    expect(results.currentStreak).toBe(2);
    expect(results.currentStreakType).toBe("Loss");
    expect(results.bestWinStreak).toBe(1);
  });
});

describe("calcEquityCurve / calcMaxDrawdown", () => {
  const days = [
    { date: "2026-01-01", pnl: 100 },
    { date: "2026-01-02", pnl: -50 },
    { date: "2026-01-03", pnl: -30 },
    { date: "2026-01-04", pnl: 200 },
  ];

  it("computes running cumulative pnl and peak", () => {
    const curve = calcEquityCurve(days);
    expect(curve.map((c) => c.cumulativePnl)).toEqual([100, 50, 20, 220]);
    expect(curve.map((c) => c.runningPeak)).toEqual([100, 100, 100, 220]);
  });

  it("drawdown is cumulative minus running peak (<=0)", () => {
    const curve = calcEquityCurve(days);
    expect(curve.map((c) => c.drawdown)).toEqual([0, -50, -80, 0]);
  });

  it("max drawdown is the most negative drawdown value", () => {
    expect(calcMaxDrawdown(days)).toBe(-80);
  });

  it("is zero for an empty series", () => {
    expect(calcMaxDrawdown([])).toBe(0);
  });
});
