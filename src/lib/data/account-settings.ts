import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { TablesUpdate } from "@/lib/supabase/database.types";

export async function getAccountSettings() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("account_settings").select("*").maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertAccountSettings(patch: TablesUpdate<"account_settings">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("account_settings")
    .upsert({ ...patch, user_id: user.id }, { onConflict: "user_id" })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function listModelRules() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("model_rules").select("*").order("model");
  if (error) throw error;
  return data;
}

export async function upsertModelRule(patch: TablesUpdate<"model_rules"> & { model: string }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("model_rules")
    .upsert({ ...patch, user_id: user.id } as never, { onConflict: "user_id,model" })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteModelRule(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("model_rules").delete().eq("id", id);
  if (error) throw error;
}
