import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Tables, TablesInsert } from "@/lib/supabase/database.types";
import type { TradeFormValues } from "@/lib/validation/trade";
import type { Instrument, Session, Result } from "@/lib/constants/enums";
import { calcResultFromPnl, calcRiskUsd } from "@/lib/trading/risk";
import { getDailyPrepByDate } from "./daily-preps";
import { findOrCreateWeeklyRecapForDate } from "./weekly-recaps";

export type Trade = Tables<"trades">;
export type TradeWithR = Tables<"trades_r">;

export interface TradeFilters {
  start?: string;
  end?: string;
  session?: Session;
  instrument?: Instrument;
  result?: Result;
  search?: string;
}

export async function listTrades(filters: TradeFilters = {}) {
  const supabase = await createClient();
  let query = supabase.from("trades_r").select("*").order("date", { ascending: false });

  if (filters.start) query = query.gte("date", filters.start);
  if (filters.end) query = query.lte("date", filters.end);
  if (filters.session) query = query.eq("session", filters.session);
  if (filters.instrument) query = query.eq("instrument", filters.instrument);
  if (filters.result) query = query.eq("result", filters.result);
  if (filters.search) query = query.ilike("title", `%${filters.search}%`);

  const { data, error } = await query;
  if (error) throw error;
  return data as TradeWithR[];
}

export async function getTrade(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("trades_r").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as TradeWithR | null;
}

/** Raw row from the base table (all columns non-null as declared) — used to seed edit forms. */
export async function getTradeForEdit(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("trades").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

/** Shared payload builder: recomputes risk/result server-side and resolves auto-links. */
async function buildTradePayload(values: TradeFormValues, userId: string) {
  const riskUsd =
    values.risk_usd ??
    calcRiskUsd({
      instrument: values.instrument,
      contracts: values.contracts,
      entryPrice: values.entry_price,
      stopPrice: values.stop_price,
    });

  const result = values.result ?? calcResultFromPnl(values.pnl_usd ?? null);

  const [dailyPrep, weeklyRecap] = await Promise.all([
    getDailyPrepByDate(values.date),
    findOrCreateWeeklyRecapForDate(values.date),
  ]);

  const payload: TablesInsert<"trades"> = {
    user_id: userId,
    title: values.title,
    date: values.date,
    instrument: values.instrument,
    direction: values.direction,
    session: values.session,
    models: values.models,
    amd_phase: values.amd_phase ?? null,
    bias_alignment: values.bias_alignment ?? null,
    entry_price: values.entry_price ?? null,
    stop_price: values.stop_price ?? null,
    target_price: values.target_price ?? null,
    exit_price: values.exit_price ?? null,
    contracts: values.contracts ?? null,
    risk_usd: riskUsd,
    pnl_usd: values.pnl_usd ?? null,
    result,
    setup_grade: values.setup_grade ?? null,
    followed_plan: values.followed_plan,
    emotion: values.emotion ?? null,
    mistakes: values.mistakes,
    entry_reasoning: values.entry_reasoning || null,
    lesson: values.lesson || null,
    chart_url: values.chart_url || null,
    daily_prep_id: dailyPrep?.id ?? null,
    weekly_recap_id: weeklyRecap.id,
  };

  return payload;
}

export async function createTrade(values: TradeFormValues) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const payload = await buildTradePayload(values, user.id);
  const { data, error } = await supabase.from("trades").insert(payload).select("*").single();
  if (error) throw error;
  return data;
}

export async function updateTrade(id: string, values: TradeFormValues) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const payload = await buildTradePayload(values, user.id);
  const { data, error } = await supabase
    .from("trades")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTrade(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("trades").delete().eq("id", id);
  if (error) throw error;
}

export async function listTradesForExport() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trades_r")
    .select("*")
    .order("date", { ascending: true });
  if (error) throw error;
  return data as TradeWithR[];
}
