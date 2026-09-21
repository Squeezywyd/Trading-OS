"use server";

import { revalidatePath } from "next/cache";
import { accountSettingsFormSchema, modelRuleFormSchema } from "@/lib/validation/settings";
import {
  deleteModelRule,
  upsertAccountSettings,
  upsertModelRule,
} from "@/lib/data/account-settings";
import type { ActionResult } from "../journal/actions";

export async function saveAccountSettingsAction(input: unknown): Promise<ActionResult> {
  const parsed = accountSettingsFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await upsertAccountSettings(parsed.data);
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to save" };
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function saveModelRuleAction(input: unknown): Promise<ActionResult> {
  const parsed = modelRuleFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await upsertModelRule(parsed.data);
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to save" };
  }

  revalidatePath("/settings");
  return { success: true };
}

export async function deleteModelRuleAction(id: string): Promise<ActionResult> {
  try {
    await deleteModelRule(id);
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete" };
  }

  revalidatePath("/settings");
  return { success: true };
}
