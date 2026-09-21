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

export interface ImportResult {
  imported: number;
  failed: Array<{ rowNumber: number; error: string }>;
}

export async function importTradesAction(
  rows: Array<{ rowNumber: number; values: unknown }>,
): Promise<ImportResult> {
  const failed: ImportResult["failed"] = [];
  let imported = 0;

  for (const row of rows) {
    const parsed = tradeFormSchema.safeParse(row.values);
    if (!parsed.success) {
      failed.push({
        rowNumber: row.rowNumber,
        error: parsed.error.issues.map((i) => i.message).join("; "),
      });
      continue;
    }
    try {
      await createTrade(parsed.data);
      imported += 1;
    } catch (err) {
      failed.push({
        rowNumber: row.rowNumber,
        error: err instanceof Error ? err.message : "Failed to save",
      });
    }
  }

  if (imported > 0) {
    revalidatePath("/journal");
    revalidatePath("/dashboard");
    revalidatePath("/calendar");
    revalidatePath("/analytics");
  }

  return { imported, failed };
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
