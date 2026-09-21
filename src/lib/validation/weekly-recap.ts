import { z } from "zod";
import { zWeekGrade, zWeeklyBiasCorrect } from "./enums";

export const weeklyRecapFormSchema = z.object({
  week_start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  week_grade: zWeekGrade.nullable().optional(),
  process_score: z.coerce.number().int().min(1).max(10).nullable().optional(),
  rule_breaks: z.coerce.number().int().min(0).default(0),
  weekly_bias_correct: zWeeklyBiasCorrect.nullable().optional(),
  what_worked: z.string().max(4000).nullable().optional(),
  what_failed: z.string().max(4000).nullable().optional(),
  key_lessons: z.string().max(4000).nullable().optional(),
  focus_next_week: z.string().max(4000).nullable().optional(),
});

export type WeeklyRecapFormValues = z.infer<typeof weeklyRecapFormSchema>;
