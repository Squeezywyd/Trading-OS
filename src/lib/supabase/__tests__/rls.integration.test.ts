/**
 * Integration test proving RLS actually isolates users — this is the one
 * test in the suite that talks to the real Supabase project instead of pure
 * functions. It creates two throwaway users, writes a trade as one, and
 * asserts the other can neither read nor write it, then deletes both users.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local (same key the seed script
 * needs). Skips itself entirely — not a failure — when that key is absent,
 * so `npm test` stays green in environments that haven't configured it yet
 * (e.g. CI without secrets, or before the project owner has created their
 * Supabase project). Run locally with the key set to actually exercise it.
 */
import { config as loadEnv } from "dotenv";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database } from "../database.types";

loadEnv({ path: join(process.cwd(), ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const hasCredentials = Boolean(SUPABASE_URL && ANON_KEY && SERVICE_ROLE_KEY);

describe.skipIf(!hasCredentials)("RLS: cross-user isolation", () => {
  let admin: SupabaseClient<Database>;
  let userAId: string;
  let userBId: string;
  let clientB: SupabaseClient<Database>;
  let tradeId: string;

  const emailA = `rls-test-a-${randomUUID()}@example.com`;
  const emailB = `rls-test-b-${randomUUID()}@example.com`;
  const password = `Test-${randomUUID()}!`;

  beforeAll(async () => {
    admin = createClient<Database>(SUPABASE_URL!, SERVICE_ROLE_KEY!, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const [{ data: a, error: aErr }, { data: b, error: bErr }] = await Promise.all([
      admin.auth.admin.createUser({ email: emailA, password, email_confirm: true }),
      admin.auth.admin.createUser({ email: emailB, password, email_confirm: true }),
    ]);
    if (aErr || !a.user) throw aErr ?? new Error("failed to create user A");
    if (bErr || !b.user) throw bErr ?? new Error("failed to create user B");
    userAId = a.user.id;
    userBId = b.user.id;

    const { data: trade, error: tradeErr } = await admin
      .from("trades")
      .insert({
        user_id: userAId,
        title: "RLS isolation probe",
        date: "2026-01-15",
        instrument: "MNQ",
        direction: "Long",
        session: "NY AM",
      })
      .select("id")
      .single();
    if (tradeErr || !trade) throw tradeErr ?? new Error("failed to seed trade");
    tradeId = trade.id;

    clientB = createClient<Database>(SUPABASE_URL!, ANON_KEY!, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { error: signInErr } = await clientB.auth.signInWithPassword({ email: emailB, password });
    if (signInErr) throw signInErr;
  }, 30_000);

  afterAll(async () => {
    if (userAId) await admin.auth.admin.deleteUser(userAId);
    if (userBId) await admin.auth.admin.deleteUser(userBId);
  });

  it("user B cannot see user A's trade in a list query", async () => {
    const { data, error } = await clientB.from("trades").select("id").eq("id", tradeId);
    expect(error).toBeNull();
    expect(data).toEqual([]);
  });

  it("user B gets no row fetching user A's trade by id directly", async () => {
    const { data, error } = await clientB.from("trades").select("*").eq("id", tradeId).maybeSingle();
    expect(error).toBeNull();
    expect(data).toBeNull();
  });

  it("user B cannot update user A's trade", async () => {
    const { data, error } = await clientB
      .from("trades")
      .update({ title: "hijacked" })
      .eq("id", tradeId)
      .select();
    // RLS makes the row invisible to the UPDATE's own USING clause, so it
    // matches zero rows rather than raising — assert nothing changed.
    expect(error).toBeNull();
    expect(data).toEqual([]);

    const { data: stillA } = await admin.from("trades").select("title").eq("id", tradeId).single();
    expect(stillA?.title).toBe("RLS isolation probe");
  });

  it("user B cannot delete user A's trade", async () => {
    const { error } = await clientB.from("trades").delete().eq("id", tradeId);
    expect(error).toBeNull();

    const { data: stillExists } = await admin.from("trades").select("id").eq("id", tradeId).maybeSingle();
    expect(stillExists?.id).toBe(tradeId);
  });

  it("user B cannot insert a trade claiming user A's id", async () => {
    const { error } = await clientB.from("trades").insert({
      user_id: userAId,
      title: "spoofed",
      date: "2026-01-15",
      instrument: "MNQ",
      direction: "Long",
      session: "NY AM",
    });
    // The insert WITH CHECK clause (auth.uid() = user_id) rejects this.
    expect(error).not.toBeNull();
  });
});
