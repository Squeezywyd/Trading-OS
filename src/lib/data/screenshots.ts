import "server-only";
import { createClient } from "@/lib/supabase/server";

export async function listScreenshots(tradeId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trade_screenshots")
    .select("*")
    .eq("trade_id", tradeId)
    .order("created_at", { ascending: true });
  if (error) throw error;

  // Private bucket — sign each path so the client can actually render it.
  const withUrls = await Promise.all(
    (data ?? []).map(async (row) => {
      const { data: signed } = await supabase.storage
        .from("screenshots")
        .createSignedUrl(row.storage_path, 60 * 60);
      return { ...row, url: signed?.signedUrl ?? null };
    }),
  );
  return withUrls;
}

export async function deleteScreenshot(id: string, storagePath: string) {
  const supabase = await createClient();
  const { error: storageError } = await supabase.storage.from("screenshots").remove([storagePath]);
  if (storageError) throw storageError;

  const { error } = await supabase.from("trade_screenshots").delete().eq("id", id);
  if (error) throw error;
}
