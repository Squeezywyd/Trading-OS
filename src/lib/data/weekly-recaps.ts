import "server-only";
import { startOfWeek, format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import type { Tables, TablesUpdate } from "@/lib/supabase/database.types";

export type WeeklyRecap = Tables<"weekly_recaps">;
export type WeeklyRecapStats = Tables<"weekly_recap_stats">;

/** Monday of the week containing `isoDate` (YYYY-MM-DD), as YYYY-MM-DD. */
export function weekStartForDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd");
}

export async function listWeeklyRecaps() {
  const supabase = await createClient();
  const [{ data: recaps, error: recapsError }, { data: stats, error: statsError }] =
    await Promise.all([
      supabase.from("weekly_recaps").select("*").order("week_start", { ascending: false }),
      supabase.from("weekly_recap_stats").select("*"),
    ]);
  if (recapsError) throw recapsError;
  if (statsError) throw statsError;

  const statsByRecapId = new Map((stats ?? []).map((s) => [s.weekly_recap_id, s]));
  return (recaps ?? []).map((recap) => ({
    ...recap,
    stats: statsByRecapId.get(recap.id) ?? null,
  }));
}

export async function getWeeklyRecapByWeekStart(weekStart: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("weekly_recaps")
    .select("*")
    .eq("week_start", weekStart)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getWeeklyRecapStats(weeklyRecapId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("weekly_recap_stats")
    .select("*")
    .eq("weekly_recap_id", weeklyRecapId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/** Finds the recap for the week containing `isoDate`, creating a bare one if none exists. */
export async function findOrCreateWeeklyRecapForDate(isoDate: string) {
  const weekStart = weekStartForDate(isoDate);
  const supabase = await createClient();

  const existing = await getWeeklyRecapByWeekStart(weekStart);
  if (existing) return existing;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("weekly_recaps")
    .insert({ week_start: weekStart, user_id: user.id })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function upsertWeeklyRecap(weekStart: string, patch: TablesUpdate<"weekly_recaps">) {
  const recap = await findOrCreateWeeklyRecapForDate(weekStart);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("weekly_recaps")
    .update(patch)
    .eq("id", recap.id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}
