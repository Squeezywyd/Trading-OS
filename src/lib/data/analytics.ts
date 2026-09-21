import "server-only";
import { createClient } from "@/lib/supabase/server";

export interface DateRange {
  start?: string;
  end?: string;
}

export async function getDashboardKpis(range: DateRange = {}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("fn_dashboard_kpis", { p_start: range.start, p_end: range.end })
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getBiasAccuracy(range: DateRange = {}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("fn_bias_accuracy", { p_start: range.start, p_end: range.end })
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getEquityCurve(range: DateRange = {}) {
  const supabase = await createClient();
  let query = supabase.from("equity_curve").select("*").order("date", { ascending: true });
  if (range.start) query = query.gte("date", range.start);
  if (range.end) query = query.lte("date", range.end);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export interface StatsRow {
  dimension: string;
  n: number;
  wins: number;
  losses: number;
  win_rate: number | null;
  avg_r: number | null;
  expectancy: number | null;
  total_pnl: number | null;
}

export type StatsDimension =
  | "session"
  | "instrument"
  | "amd_phase"
  | "bias_alignment"
  | "emotion"
  | "grade"
  | "weekday"
  | "followed_plan"
  | "model"
  | "mistake";

const FN_BY_DIMENSION: Record<StatsDimension, string> = {
  session: "fn_stats_by_session",
  instrument: "fn_stats_by_instrument",
  amd_phase: "fn_stats_by_amd_phase",
  bias_alignment: "fn_stats_by_bias_alignment",
  emotion: "fn_stats_by_emotion",
  grade: "fn_stats_by_grade",
  weekday: "fn_stats_by_weekday",
  followed_plan: "fn_stats_by_followed_plan",
  model: "fn_stats_by_model",
  mistake: "fn_stats_by_mistake",
};

export async function getStatsBy(dimension: StatsDimension, range: DateRange = {}) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc(
    FN_BY_DIMENSION[dimension] as "fn_stats_by_session",
    { p_start: range.start, p_end: range.end },
  );
  if (error) throw error;
  return data;
}
