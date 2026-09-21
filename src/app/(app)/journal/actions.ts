"use server";

import { revalidatePath } from "next/cache";
import { tradeFormSchema } from "@/lib/validation/trade";
import { createTrade, deleteTrade, updateTrade } from "@/lib/data/trades";

export interface ActionResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function createTradeAction(input: unknown): Promise<ActionResult> {
  const parsed = tradeFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await createTrade(parsed.data);
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to save trade" };
  }

  revalidatePath("/journal");
  revalidatePath("/dashboard");
  revalidatePath("/calendar");
  revalidatePath("/analytics");
  return { success: true };
}

export async function updateTradeAction(id: string, input: unknown): Promise<ActionResult> {
  const parsed = tradeFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await updateTrade(id, parsed.data);
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to update trade" };
  }

  revalidatePath("/journal");
  revalidatePath("/dashboard");
  revalidatePath("/calendar");
  revalidatePath("/analytics");
  return { success: true };
}

export async function deleteTradeAction(id: string): Promise<ActionResult> {
  try {
    await deleteTrade(id);
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete trade" };
  }

  revalidatePath("/journal");
  revalidatePath("/dashboard");
  revalidatePath("/calendar");
  revalidatePath("/analytics");
  return { success: true };
}
