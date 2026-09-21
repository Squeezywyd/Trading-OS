import { describe, expect, it } from "vitest";
import { computeDailyBias, pickInvalidationReference } from "../bias";

const base = {
  htfDraw: "Neutral" as const,
  premiumDiscount: "Equilibrium" as const,
  previousDayClose: "Inside Range" as const,
  wickRejection: "None" as const,
  dayType: "Normal" as const,
  highImpactNewsToday: false,
};

describe("computeDailyBias", () => {
  it("stacks bullish signals into a high-confidence Bullish call", () => {
    const result = computeDailyBias({
      ...base,
      htfDraw: "Bullish",
      premiumDiscount: "Discount",
      previousDayClose: "Above PDH",
      wickRejection: "Rejected Low",
    });
    expect(result.dailyBias).toBe("Bullish");
    expect(result.confidence).toBe("High");
  });

  it("stacks bearish signals into a high-confidence Bearish call", () => {
    const result = computeDailyBias({
      ...base,
      htfDraw: "Bearish",
      premiumDiscount: "Premium",
      previousDayClose: "Below PDL",
      wickRejection: "Rejected High",
    });
    expect(result.dailyBias).toBe("Bearish");
    expect(result.confidence).toBe("High");
  });

  it("caps confidence at Medium on high-impact news days even with a strong score", () => {
    const result = computeDailyBias({
      ...base,
      htfDraw: "Bullish",
      premiumDiscount: "Discount",
      previousDayClose: "Above PDH",
      wickRejection: "Rejected Low",
      highImpactNewsToday: true,
    });
    expect(result.confidence).toBe("Medium");
  });

  it("calls No Trade on an inside day with a weak/mixed score", () => {
    const result = computeDailyBias({ ...base, dayType: "Inside Day" });
    expect(result.dailyBias).toBe("No Trade");
  });

  it("is Neutral with Low confidence when nothing lines up", () => {
    const result = computeDailyBias(base);
    expect(result.dailyBias).toBe("Neutral");
    expect(result.confidence).toBe("Low");
  });
});

describe("pickInvalidationReference", () => {
  it("maps Bullish -> PDL and Bearish -> PDH", () => {
    expect(pickInvalidationReference("Bullish")).toBe("PDL");
    expect(pickInvalidationReference("Bearish")).toBe("PDH");
    expect(pickInvalidationReference("Neutral")).toBeNull();
  });
});
