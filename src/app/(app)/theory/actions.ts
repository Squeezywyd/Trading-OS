"use server";

import { revalidatePath } from "next/cache";
import { theoryDocFormSchema } from "@/lib/validation/theory";
import { setChecklistItem, updateTheoryDoc } from "@/lib/data/theory";
import type { ActionResult } from "../journal/actions";

export async function updateTheoryDocAction(id: string, slug: string, input: unknown): Promise<ActionResult> {
  const parsed = theoryDocFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await updateTheoryDoc(id, parsed.data);
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to save" };
  }

  revalidatePath("/theory");
  revalidatePath(`/theory/${slug}`);
  return { success: true };
}

export async function toggleChecklistItemAction(theoryDocId: string, itemKey: string, checked: boolean) {
  await setChecklistItem(theoryDocId, itemKey, checked);
}
