import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert, TablesUpdate } from "@/lib/supabase/database.types";
import type { TheoryCategory, TheoryPriority, TheoryUseFor } from "@/lib/constants/enums";

export interface TheoryFilters {
  category?: TheoryCategory;
  useFor?: TheoryUseFor;
  priority?: TheoryPriority;
  search?: string;
}

export async function listTheoryDocs(filters: TheoryFilters = {}) {
  const supabase = await createClient();

  if (filters.search && filters.search.trim().length > 0) {
    // websearch_to_tsquery via the search_vector column isn't directly
    // filterable through PostgREST's query builder, so use textSearch().
    let query = supabase
      .from("theory_docs")
      .select("id, slug, title, category, priority, use_for, summary, updated_at")
      .textSearch("search_vector", filters.search, { type: "websearch", config: "english" });
    if (filters.category) query = query.eq("category", filters.category);
    if (filters.priority) query = query.eq("priority", filters.priority);
    if (filters.useFor) query = query.contains("use_for", [filters.useFor]);
    const { data, error } = await query.order("title");
    if (error) throw error;
    return data;
  }

  let query = supabase
    .from("theory_docs")
    .select("id, slug, title, category, priority, use_for, summary, updated_at")
    .order("category")
    .order("title");
  if (filters.category) query = query.eq("category", filters.category);
  if (filters.priority) query = query.eq("priority", filters.priority);
  if (filters.useFor) query = query.contains("use_for", [filters.useFor]);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getTheoryDocBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("theory_docs")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateTheoryDoc(id: string, patch: TablesUpdate<"theory_docs">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("theory_docs")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function createTheoryDoc(doc: TablesInsert<"theory_docs">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("theory_docs")
    .insert({ ...doc, user_id: user.id })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function getChecklistState(theoryDocId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("theory_checklist_state")
    .select("item_key, checked")
    .eq("theory_doc_id", theoryDocId);
  if (error) throw error;
  return Object.fromEntries((data ?? []).map((r) => [r.item_key, r.checked]));
}

export async function setChecklistItem(theoryDocId: string, itemKey: string, checked: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("theory_checklist_state")
    .upsert(
      { user_id: user.id, theory_doc_id: theoryDocId, item_key: itemKey, checked },
      { onConflict: "user_id,theory_doc_id,item_key" },
    );
  if (error) throw error;
}
