import { z } from "zod";
import { zBiasOutcome, zConfidence, zDailyBias, zExpectedAmdProfile, zWeeklyBias } from "./enums";

export const dailyPrepFormSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  weekly_bias: zWeeklyBias.nullable().optional(),
  daily_bias: zDailyBias.nullable().optional(),
  confidence: zConfidence.nullable().optional(),
  htf_draw: z.string().max(2000).nullable().optional(),
  key_levels: z.string().max(2000).nullable().optional(),
  news_events: z.string().max(2000).nullable().optional(),
  high_impact_news: z.boolean().default(false),
  expected_amd_profile: zExpectedAmdProfile.nullable().optional(),
  invalidation_level: z.coerce.number().finite().nullable().optional(),
  game_plan: z.string().max(4000).nullable().optional(),
  bias_outcome: zBiasOutcome.nullable().optional(),
  eod_notes: z.string().max(4000).nullable().optional(),
});

export type DailyPrepFormValues = z.infer<typeof dailyPrepFormSchema>;
