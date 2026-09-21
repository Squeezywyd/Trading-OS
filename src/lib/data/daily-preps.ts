import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Tables, TablesInsert, TablesUpdate } from "@/lib/supabase/database.types";
import { findOrCreateWeeklyRecapForDate } from "./weekly-recaps";

export type DailyPrep = Tables<"daily_preps">;

export async function getDailyPrepByDate(date: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("daily_preps")
    .select("*")
    .eq("date", date)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listDailyPreps(range?: { start?: string; end?: string }) {
  const supabase = await createClient();
  let query = supabase.from("daily_preps").select("*").order("date", { ascending: false });
  if (range?.start) query = query.gte("date", range.start);
  if (range?.end) query = query.lte("date", range.end);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

/** Creates or updates the prep for `date`, auto-linking it to that week's recap. */
export async function upsertDailyPrep(
  date: string,
  patch: Omit<TablesUpdate<"daily_preps">, "date" | "user_id">,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const weeklyRecap = await findOrCreateWeeklyRecapForDate(date);

  const payload: TablesInsert<"daily_preps"> = {
    ...patch,
    date,
    user_id: user.id,
    weekly_recap_id: weeklyRecap.id,
  };

  const { data, error } = await supabase
    .from("daily_preps")
    .upsert(payload, { onConflict: "user_id,date" })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteDailyPrep(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("daily_preps").delete().eq("id", id);
  if (error) throw error;
}
