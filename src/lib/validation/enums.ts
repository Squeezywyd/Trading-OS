import { z } from "zod";
import {
  AMD_PHASES,
  BIAS_ALIGNMENTS,
  BIAS_OUTCOMES,
  CONFIDENCE_LEVELS,
  DAILY_BIAS_VALUES,
  DIRECTIONS,
  DRAWDOWN_TYPES,
  EMOTIONS,
  EXPECTED_AMD_PROFILES,
  INSTRUMENTS,
  MISTAKES,
  MODELS,
  RESULTS,
  SESSIONS,
  SETUP_GRADES,
  THEORY_CATEGORIES,
  THEORY_PRIORITIES,
  THEORY_USE_FOR,
  WEEK_GRADES,
  WEEKLY_BIAS_CORRECT_VALUES,
  WEEKLY_BIAS_VALUES,
} from "@/lib/constants/enums";

/**
 * Passing the `as const` arrays straight through (no cast) lets zod infer the
 * literal union as the enum's type, so these line up exactly with the
 * Database["public"]["Enums"][...] types generated from Postgres — a
 * `string`-widening cast here would silently break that.
 */
export const zInstrument = z.enum(INSTRUMENTS);
export const zDirection = z.enum(DIRECTIONS);
export const zSession = z.enum(SESSIONS);
export const zModel = z.enum(MODELS);
export const zAmdPhase = z.enum(AMD_PHASES);
export const zBiasAlignment = z.enum(BIAS_ALIGNMENTS);
export const zResult = z.enum(RESULTS);
export const zSetupGrade = z.enum(SETUP_GRADES);
export const zEmotion = z.enum(EMOTIONS);
export const zMistake = z.enum(MISTAKES);
export const zWeeklyBias = z.enum(WEEKLY_BIAS_VALUES);
export const zDailyBias = z.enum(DAILY_BIAS_VALUES);
export const zConfidence = z.enum(CONFIDENCE_LEVELS);
export const zExpectedAmdProfile = z.enum(EXPECTED_AMD_PROFILES);
export const zBiasOutcome = z.enum(BIAS_OUTCOMES);
export const zWeekGrade = z.enum(WEEK_GRADES);
export const zWeeklyBiasCorrect = z.enum(WEEKLY_BIAS_CORRECT_VALUES);
export const zTheoryCategory = z.enum(THEORY_CATEGORIES);
export const zTheoryPriority = z.enum(THEORY_PRIORITIES);
export const zTheoryUseFor = z.enum(THEORY_USE_FOR);
export const zDrawdownType = z.enum(DRAWDOWN_TYPES);
