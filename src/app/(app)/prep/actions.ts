"use server";

import { revalidatePath } from "next/cache";
import { dailyPrepFormSchema } from "@/lib/validation/daily-prep";
import { deleteDailyPrep, upsertDailyPrep } from "@/lib/data/daily-preps";
import type { ActionResult } from "../journal/actions";

export async function saveDailyPrepAction(input: unknown): Promise<ActionResult> {
  const parsed = dailyPrepFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    const { date, ...patch } = parsed.data;
    await upsertDailyPrep(date, patch);
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to save prep" };
  }

  revalidatePath("/prep");
  revalidatePath("/dashboard");
  revalidatePath("/calendar");
  return { success: true };
}

export async function deleteDailyPrepAction(id: string): Promise<ActionResult> {
  try {
    await deleteDailyPrep(id);
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete prep" };
  }
  revalidatePath("/prep");
  revalidatePath("/calendar");
  return { success: true };
}
