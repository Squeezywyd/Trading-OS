import { describe, expect, it } from "vitest";
import {
  calcExpectancyR,
  calcExpectancyUsd,
  calcPositionSize,
  calcProfitFactor,
  calcResultFromPnl,
  calcRiskUsd,
  calcRMultiple,
  calcWinRate,
} from "../risk";

describe("calcRiskUsd", () => {
  it("computes risk from contracts x points x point value", () => {
    // MNQ point value = 2. Entry 20000, stop 19990 -> 10 pts x 2 contracts x $2 = $40.
    expect(calcRiskUsd({ instrument: "MNQ", contracts: 2, entryPrice: 20000, stopPrice: 19990 })).toBe(
      40,
    );
  });

  it("is direction-agnostic (uses absolute distance)", () => {
    expect(calcRiskUsd({ instrument: "ES", contracts: 1, entryPrice: 5000, stopPrice: 5010 })).toBe(
      calcRiskUsd({ instrument: "ES", contracts: 1, entryPrice: 5010, stopPrice: 5000 }),
    );
  });

  it("returns null for instruments with no fixed point value", () => {
    expect(calcRiskUsd({ instrument: "ETH", contracts: 1, entryPrice: 100, stopPrice: 90 })).toBeNull();
  });

  it("returns null when required inputs are missing", () => {
    expect(calcRiskUsd({ instrument: "NQ", contracts: null, entryPrice: 100, stopPrice: 90 })).toBeNull();
  });
});

describe("calcRMultiple", () => {
  it("divides pnl by risk", () => {
    expect(calcRMultiple(200, 100)).toBe(2);
    expect(calcRMultiple(-50, 100)).toBe(-0.5);
  });

  it("returns null when risk is zero or missing", () => {
    expect(calcRMultiple(100, 0)).toBeNull();
    expect(calcRMultiple(100, null)).toBeNull();
    expect(calcRMultiple(null, 100)).toBeNull();
  });
});

describe("calcResultFromPnl", () => {
  it("maps sign of pnl to Win/Loss/Break Even", () => {
    expect(calcResultFromPnl(150)).toBe("Win");
    expect(calcResultFromPnl(-1)).toBe("Loss");
    expect(calcResultFromPnl(0)).toBe("Break Even");
    expect(calcResultFromPnl(null)).toBeNull();
  });
});

describe("calcExpectancyUsd / calcExpectancyR", () => {
  it("averages pnl across trades", () => {
    expect(calcExpectancyUsd([100, -50, 25])).toBeCloseTo(25, 5);
    expect(calcExpectancyUsd([])).toBeNull();
  });

  it("averages R, ignoring nulls", () => {
    expect(calcExpectancyR([1, -1, 2, null])).toBeCloseTo(2 / 3, 3);
    expect(calcExpectancyR([null, null])).toBeNull();
  });
});

describe("calcWinRate", () => {
  it("computes win rate over decisive trades only", () => {
    expect(calcWinRate(["Win", "Win", "Loss", "Break Even"])).toBe(66.67);
  });

  it("returns null when there are no decisive trades", () => {
    expect(calcWinRate(["Break Even", null])).toBeNull();
  });
});

describe("calcProfitFactor", () => {
  it("divides gross profit by gross loss", () => {
    expect(calcProfitFactor([100, 100, -50])).toBe(4);
  });

  it("returns null when there are no losses", () => {
    expect(calcProfitFactor([100, 50])).toBeNull();
  });
});

describe("calcPositionSize", () => {
  it("floors to whole contracts within the risk budget", () => {
    // MNQ $2/pt, 10pt stop -> $20/contract risk. $45 budget -> 2 contracts.
    expect(calcPositionSize({ instrument: "MNQ", riskBudgetUsd: 45, stopDistancePoints: 10 })).toBe(2);
  });

  it("returns null for non-positive inputs", () => {
    expect(calcPositionSize({ instrument: "MNQ", riskBudgetUsd: 0, stopDistancePoints: 10 })).toBeNull();
  });
});
