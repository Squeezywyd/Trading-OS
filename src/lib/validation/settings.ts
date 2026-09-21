import { z } from "zod";
import { zDrawdownType, zModel } from "./enums";

// No defaults on prop-firm numbers here on purpose — the user enters their
// real LucidFlex 50K values via the Settings page; nothing is hardcoded.
// Per-model defaults (including "10am Powell (ATM)") live exclusively in
// model_rules, not duplicated here.
export const accountSettingsFormSchema = z.object({
  account_name: z.string().trim().max(100).nullable().optional(),
  starting_balance_usd: z.coerce.number().positive().nullable().optional(),
  profit_target_usd: z.coerce.number().nonnegative().nullable().optional(),
  daily_loss_limit_usd: z.coerce.number().nonnegative().nullable().optional(),
  max_drawdown_usd: z.coerce.number().nonnegative().nullable().optional(),
  drawdown_type: zDrawdownType.nullable().optional(),
  consistency_rule_pct: z.coerce.number().min(0).max(100).nullable().optional(),
  max_contracts: z.coerce.number().int().positive().nullable().optional(),
  timezone: z.string().default("America/New_York"),
});

export type AccountSettingsFormValues = z.infer<typeof accountSettingsFormSchema>;

export const modelRuleFormSchema = z.object({
  model: zModel,
  default_contracts: z.coerce.number().int().positive().nullable().optional(),
  stop_min_points: z.coerce.number().positive().nullable().optional(),
  stop_max_points: z.coerce.number().positive().nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
});

export type ModelRuleFormValues = z.infer<typeof modelRuleFormSchema>;
