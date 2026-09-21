import type { ConfidenceLevel, DailyBiasValue } from "@/lib/constants/enums";

/**
 * Inputs collected by the Bias Wizard (mirrors the "Daily Bias: Top-Down
 * Process" theory doc): HTF draw on liquidity, premium/discount location,
 * previous-day behavior, and news risk. Scoring is a simple weighted vote —
 * calibrate the weights in this file as the theory doc's rules are refined
 * in-app (Theory Library editor), since this is the one place bias logic
 * lives in code.
 */
export interface BiasWizardInputs {
  htfDraw: "Bullish" | "Bearish" | "Neutral";
  premiumDiscount: "Premium" | "Discount" | "Equilibrium";
  previousDayClose: "Above PDH" | "Below PDL" | "Inside Range";
  wickRejection: "None" | "Rejected High" | "Rejected Low";
  dayType: "Normal" | "Inside Day" | "Outside Day";
  highImpactNewsToday: boolean;
}

export interface BiasWizardResult {
  dailyBias: DailyBiasValue;
  confidence: ConfidenceLevel;
  score: number;
}

export function computeDailyBias(inputs: BiasWizardInputs): BiasWizardResult {
  let score = 0;

  if (inputs.htfDraw === "Bullish") score += 2;
  if (inputs.htfDraw === "Bearish") score -= 2;

  if (inputs.premiumDiscount === "Discount") score += 1;
  if (inputs.premiumDiscount === "Premium") score -= 1;

  if (inputs.previousDayClose === "Above PDH") score += 1;
  if (inputs.previousDayClose === "Below PDL") score -= 1;

  if (inputs.wickRejection === "Rejected Low") score += 1;
  if (inputs.wickRejection === "Rejected High") score -= 1;

  // Outside days resolve in either direction and inside days signal
  // consolidation — both erode conviction rather than adding directional
  // weight, so they only affect confidence below.

  let dailyBias: DailyBiasValue;
  if (inputs.dayType === "Inside Day" && Math.abs(score) <= 1) {
    dailyBias = "No Trade";
  } else if (score >= 1) {
    dailyBias = "Bullish";
  } else if (score <= -1) {
    dailyBias = "Bearish";
  } else {
    dailyBias = "Neutral";
  }

  const magnitude = Math.abs(score);
  let confidence: ConfidenceLevel = magnitude >= 4 ? "High" : magnitude >= 2 ? "Medium" : "Low";

  if (inputs.highImpactNewsToday && confidence === "High") confidence = "Medium";
  if (inputs.dayType === "Inside Day" && confidence === "High") confidence = "Medium";

  return { dailyBias, confidence, score };
}

/**
 * Invalidation level: the level that, if traded through, proves the bias
 * wrong. For a bullish bias that's typically the day's low / PDL; for
 * bearish, the day's high / PDH. Caller supplies the concrete price for
 * whichever reference the trader marked as their invalidation in Key Levels.
 */
export function pickInvalidationReference(dailyBias: DailyBiasValue): "PDL" | "PDH" | null {
  if (dailyBias === "Bullish") return "PDL";
  if (dailyBias === "Bearish") return "PDH";
  return null;
}
