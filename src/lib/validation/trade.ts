import { z } from "zod";
import {
  zAmdPhase,
  zBiasAlignment,
  zDirection,
  zEmotion,
  zInstrument,
  zMistake,
  zModel,
  zResult,
  zSession,
  zSetupGrade,
} from "./enums";

export const tradeFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  instrument: zInstrument,
  direction: zDirection,
  session: zSession,
  models: z.array(zModel).default([]),
  amd_phase: zAmdPhase.nullable().optional(),
  bias_alignment: zBiasAlignment.nullable().optional(),
  entry_price: z.coerce.number().finite().nullable().optional(),
  stop_price: z.coerce.number().finite().nullable().optional(),
  target_price: z.coerce.number().finite().nullable().optional(),
  exit_price: z.coerce.number().finite().nullable().optional(),
  contracts: z.coerce.number().positive().nullable().optional(),
  risk_usd: z.coerce.number().nonnegative().nullable().optional(),
  pnl_usd: z.coerce.number().nullable().optional(),
  result: zResult.nullable().optional(),
  setup_grade: zSetupGrade.nullable().optional(),
  followed_plan: z.boolean().default(false),
  emotion: zEmotion.nullable().optional(),
  mistakes: z.array(zMistake).default([]),
  entry_reasoning: z.string().max(5000).nullable().optional(),
  lesson: z.string().max(5000).nullable().optional(),
  chart_url: z.string().url().nullable().optional().or(z.literal("")),
  daily_prep_id: z.string().uuid().nullable().optional(),
  weekly_recap_id: z.string().uuid().nullable().optional(),
});

export type TradeFormValues = z.infer<typeof tradeFormSchema>;

/** Cross-field check kept separate from the schema — combining it via .refine()
 * degrades zodResolver's generic inference (ResolverOptions["names"] widens to
 * string[] and stops satisfying react-hook-form's Resolver<TradeFormValues>). */
export function validateTradeCrossFields(values: TradeFormValues): string | null {
  if (
    values.entry_price != null &&
    values.stop_price != null &&
    values.entry_price === values.stop_price
  ) {
    return "Entry and stop cannot be equal";
  }
  return null;
}
