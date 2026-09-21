/**
 * Seeds theory_docs from content/theory/*.md (always), and optionally demo
 * trades/preps/recaps when run as `npm run seed:demo`.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local — server/script only,
 * never shipped to the client. The service role bypasses RLS, so this script
 * assigns every row to the one signed-up user explicitly rather than relying
 * on auth.uid().
 *
 * Usage:
 *   npm run seed          # theory content only
 *   npm run seed:demo     # theory content + demo trades/preps/recaps
 */
import { config as loadEnv } from "dotenv";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import matter from "gray-matter";
import type { Database } from "../src/lib/supabase/database.types";
import {
  AMD_PHASES,
  BIAS_ALIGNMENTS,
  CONTRACT_POINT_VALUES,
  DIRECTIONS,
  EMOTIONS,
  MISTAKES,
  MODELS,
  SESSIONS,
  type Instrument,
} from "../src/lib/constants/enums";

loadEnv({ path: join(process.cwd(), ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local.\n" +
      "Get the service role key from Project Settings -> API in the Supabase dashboard.",
  );
  process.exit(1);
}

const supabase = createClient<Database>(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function getSoleUserId(): Promise<string> {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) throw error;

  if (data.users.length === 0) {
    console.error(
      "No users found. This is a single-user app with public sign-ups disabled —\n" +
        "create your account first: Supabase Dashboard -> Authentication -> Users -> Add user.",
    );
    process.exit(1);
  }
  if (data.users.length > 1) {
    console.error(
      `Found ${data.users.length} users; this seed script assumes exactly one. ` +
        "Delete extras in the Supabase dashboard, or edit this script to target a specific user id.",
    );
    process.exit(1);
  }
  return data.users[0].id;
}

async function seedTheory(userId: string) {
  const dir = join(process.cwd(), "content", "theory");
  const files = readdirSync(dir).filter((f) => f.endsWith(".md"));
  console.log(`Seeding ${files.length} theory docs...`);

  for (const file of files) {
    const raw = readFileSync(join(dir, file), "utf-8");
    const { data: fm, content } = matter(raw);

    const { error } = await supabase.from("theory_docs").upsert(
      {
        user_id: userId,
        slug: fm.slug,
        title: fm.title,
        category: fm.category,
        priority: fm.priority ?? "Secondary",
        use_for: fm.use_for ?? [],
        summary: fm.summary ?? null,
        body_md: content.trim(),
      },
      { onConflict: "slug" },
    );

    if (error) {
      console.error(`  ✗ ${file}: ${error.message}`);
    } else {
      console.log(`  ✓ ${fm.slug}`);
    }
  }
}

// ---------------------------------------------------------------------------
// Demo data (npm run seed:demo only) — plausible but clearly synthetic trades
// over the last ~8 weeks so the dashboard/analytics/calendar aren't empty.
// ---------------------------------------------------------------------------
function pick<T>(arr: readonly T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function mondayOf(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // shift Sunday back to the prior Monday
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

async function getOrCreateWeeklyRecapId(userId: string, weekStart: string, cache: Map<string, string>) {
  const cached = cache.get(weekStart);
  if (cached) return cached;

  const { data: existing } = await supabase
    .from("weekly_recaps")
    .select("id")
    .eq("user_id", userId)
    .eq("week_start", weekStart)
    .maybeSingle();

  if (existing) {
    cache.set(weekStart, existing.id);
    return existing.id;
  }

  const { data: created, error } = await supabase
    .from("weekly_recaps")
    .insert({ user_id: userId, week_start: weekStart })
    .select("id")
    .single();
  if (error) throw error;

  cache.set(weekStart, created.id);
  return created.id;
}

async function seedDemo(userId: string) {
  const rng = mulberry32(42);
  console.log("Seeding demo trades (last 8 weeks)...");

  const today = new Date();
  const demoInstruments: Instrument[] = ["MNQ", "NQ", "MES", "ES"];
  const weeklyRecapCache = new Map<string, string>();
  let inserted = 0;

  for (let daysAgo = 55; daysAgo >= 0; daysAgo--) {
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    const dow = date.getDay();
    if (dow === 0 || dow === 6) continue; // weekdays only
    if (rng() < 0.35) continue; // not every day has a trade

    const isoDate = date.toISOString().slice(0, 10);
    const instrument = pick(demoInstruments, rng);
    const pointValue = CONTRACT_POINT_VALUES[instrument] ?? 2;
    const direction = pick(DIRECTIONS, rng);
    const contracts = 1 + Math.floor(rng() * 3);
    const stopPoints = 8 + rng() * 12;
    const win = rng() < 0.52;
    const rMultiple = win ? 1 + rng() * 2.5 : -(0.6 + rng() * 0.6);
    const riskUsd = Math.round(contracts * stopPoints * pointValue * 100) / 100;
    const pnlUsd = Math.round(riskUsd * rMultiple * 100) / 100;
    const weeklyRecapId = await getOrCreateWeeklyRecapId(userId, mondayOf(date), weeklyRecapCache);

    const { error } = await supabase.from("trades").insert({
      user_id: userId,
      weekly_recap_id: weeklyRecapId,
      title: `${instrument} ${direction === "Long" ? "long" : "short"} — ${pick(MODELS, rng)}`,
      date: isoDate,
      instrument,
      direction,
      session: pick(SESSIONS, rng),
      models: [pick(MODELS, rng)],
      amd_phase: pick(AMD_PHASES, rng),
      bias_alignment: pick(BIAS_ALIGNMENTS, rng),
      contracts,
      risk_usd: riskUsd,
      pnl_usd: pnlUsd,
      result: pnlUsd > 0 ? "Win" : pnlUsd < 0 ? "Loss" : "Break Even",
      setup_grade: pick(["A+", "A", "B", "C"] as const, rng),
      followed_plan: rng() > 0.15,
      emotion: pick(EMOTIONS, rng),
      mistakes: rng() < 0.25 ? [pick(MISTAKES, rng)] : ["None"],
      entry_reasoning: "Demo data — generated by scripts/seed.ts --demo.",
      lesson: win ? "Kept size disciplined, let it run to target." : "Review entry timing against the checklist.",
    });

    if (!error) inserted += 1;
  }

  console.log(`  ✓ inserted ${inserted} demo trades`);
}

async function main() {
  const demo = process.argv.includes("--demo");
  const userId = await getSoleUserId();

  await seedTheory(userId);

  if (demo) {
    await seedDemo(userId);
  } else {
    console.log("Skipping demo data (run `npm run seed:demo` to include it).");
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
