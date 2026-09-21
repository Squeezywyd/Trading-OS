"use server";

import { revalidatePath } from "next/cache";
import { weeklyRecapFormSchema } from "@/lib/validation/weekly-recap";
import { upsertWeeklyRecap } from "@/lib/data/weekly-recaps";
import type { ActionResult } from "../journal/actions";

export async function saveWeeklyRecapAction(input: unknown): Promise<ActionResult> {
  const parsed = weeklyRecapFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    const { week_start, ...patch } = parsed.data;
    await upsertWeeklyRecap(week_start, patch);
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to save recap" };
  }

  revalidatePath("/recap");
  revalidatePath("/dashboard");
  return { success: true };
}
