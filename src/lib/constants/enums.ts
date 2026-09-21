/**
 * Single source of truth for every enumerated value in the app.
 * Postgres enums (supabase/migrations), Zod schemas (src/lib/validation),
 * and UI option lists all derive from these arrays. Change a value here,
 * then mirror it in a new SQL migration — Postgres enums cannot be
 * generated from this file automatically.
 */

export const INSTRUMENTS = ["MNQ", "NQ", "MES", "ES", "ETH", "Other"] as const;
export type Instrument = (typeof INSTRUMENTS)[number];

export const DIRECTIONS = ["Long", "Short"] as const;
export type Direction = (typeof DIRECTIONS)[number];

export const SESSIONS = ["Asia", "London", "NY AM", "NY Lunch", "NY PM"] as const;
export type Session = (typeof SESSIONS)[number];

export const MODELS = [
  "10am Powell (ATM)",
  "Rejection Block",
  "Order Block",
  "Breaker Block",
  "FVG / IFVG",
  "Liquidity Sweep + MSS",
  "Double Sweep",
  "SMT Divergence",
  "Silver Bullet",
  "Judas Swing",
  "Other",
] as const;
export type Model = (typeof MODELS)[number];

export const AMD_PHASES = ["Accumulation", "Manipulation", "Distribution", "Unclear"] as const;
export type AmdPhase = (typeof AMD_PHASES)[number];

export const BIAS_ALIGNMENTS = ["With Bias", "Against Bias", "No Bias"] as const;
export type BiasAlignment = (typeof BIAS_ALIGNMENTS)[number];

export const RESULTS = ["Win", "Loss", "Break Even"] as const;
export type Result = (typeof RESULTS)[number];

export const SETUP_GRADES = ["A+", "A", "B", "C"] as const;
export type SetupGrade = (typeof SETUP_GRADES)[number];

export const EMOTIONS = [
  "Calm",
  "Confident",
  "FOMO",
  "Revenge",
  "Fear",
  "Hesitant",
  "Overconfident",
] as const;
export type Emotion = (typeof EMOTIONS)[number];

export const MISTAKES = [
  "Early entry",
  "Late entry",
  "Moved stop",
  "Oversized",
  "Skipped confirmation",
  "Traded against bias",
  "Cut winner early",
  "Overtraded",
  "None",
] as const;
export type Mistake = (typeof MISTAKES)[number];

export const WEEKLY_BIAS_VALUES = ["Bullish", "Bearish", "Neutral"] as const;
export type WeeklyBiasValue = (typeof WEEKLY_BIAS_VALUES)[number];

export const DAILY_BIAS_VALUES = ["Bullish", "Bearish", "Neutral", "No Trade"] as const;
export type DailyBiasValue = (typeof DAILY_BIAS_VALUES)[number];

export const CONFIDENCE_LEVELS = ["High", "Medium", "Low"] as const;
export type ConfidenceLevel = (typeof CONFIDENCE_LEVELS)[number];

export const EXPECTED_AMD_PROFILES = [
  "Classic (Judas then reversal)",
  "Continuation (no reversal)",
  "Reversal of prior day",
  "Consolidation / Chop",
] as const;
export type ExpectedAmdProfile = (typeof EXPECTED_AMD_PROFILES)[number];

export const BIAS_OUTCOMES = ["Correct", "Partial", "Wrong", "No Trade Day"] as const;
export type BiasOutcome = (typeof BIAS_OUTCOMES)[number];

export const WEEK_GRADES = ["A", "B", "C", "D", "F"] as const;
export type WeekGrade = (typeof WEEK_GRADES)[number];

export const WEEKLY_BIAS_CORRECT_VALUES = ["Yes", "Partial", "No"] as const;
export type WeeklyBiasCorrect = (typeof WEEKLY_BIAS_CORRECT_VALUES)[number];

export const THEORY_CATEGORIES = [
  "Framework",
  "Time & Session",
  "PD Arrays",
  "Liquidity",
  "Structure",
  "Bias Process",
  "Risk & Psychology",
] as const;
export type TheoryCategory = (typeof THEORY_CATEGORIES)[number];

export const THEORY_PRIORITIES = ["Core", "Secondary", "Advanced"] as const;
export type TheoryPriority = (typeof THEORY_PRIORITIES)[number];

export const THEORY_USE_FOR = [
  "Daily Bias",
  "Entry Model",
  "Confirmation",
  "Targeting",
  "Invalidation",
] as const;
export type TheoryUseFor = (typeof THEORY_USE_FOR)[number];

/** USD value per 1.00 index point, per contract. null = no fixed multiplier (manual risk entry). */
export const CONTRACT_POINT_VALUES: Record<Instrument, number | null> = {
  MNQ: 2,
  NQ: 20,
  MES: 5,
  ES: 50,
  ETH: null,
  Other: null,
};
