import { describe, expect, it } from "vitest";
import { parseCsv, parseTradeCsv, tradesToCsv, TRADE_CSV_COLUMNS } from "../csv";
import type { TradeWithR } from "@/lib/data/trades";

describe("parseCsv", () => {
  it("splits simple rows on commas", () => {
    expect(parseCsv("a,b,c\n1,2,3")).toEqual([
      ["a", "b", "c"],
      ["1", "2", "3"],
    ]);
  });

  it("handles quoted fields containing commas and escaped quotes", () => {
    const text = 'title,note\n"NQ, long","he said ""go"""';
    expect(parseCsv(text)).toEqual([
      ["title", "note"],
      ["NQ, long", 'he said "go"'],
    ]);
  });

  it("handles quoted fields containing newlines", () => {
    const text = 'title,note\n"line one\nline two",ok';
    expect(parseCsv(text)).toEqual([
      ["title", "note"],
      ["line one\nline two", "ok"],
    ]);
  });
});

describe("parseTradeCsv", () => {
  const header = TRADE_CSV_COLUMNS.join(",");

  it("parses a valid row into TradeFormValues-shaped output", () => {
    const row = [
      "NQ long",
      "2026-01-15",
      "NQ",
      "Long",
      "NY AM",
      "Silver Bullet;Order Block",
      "Manipulation",
      "With Bias",
      "20000",
      "19990",
      "20030",
      "20025",
      "1",
      "200",
      "500",
      "Win",
      "A+",
      "true",
      "Calm",
      "None",
      "Swept lows then reversed",
      "Held for full target",
      "https://example.com/chart",
    ].join(",");

    const [result] = parseTradeCsv(`${header}\n${row}`);
    expect(result.errors).toEqual([]);
    expect(result.rowNumber).toBe(2);
    expect(result.values.title).toBe("NQ long");
    expect(result.values.models).toEqual(["Silver Bullet", "Order Block"]);
    expect(result.values.mistakes).toEqual(["None"]);
    expect(result.values.followed_plan).toBe(true);
    expect(result.values.entry_price).toBe(20000);
    expect(result.values.pnl_usd).toBe(500);
  });

  it("flags a missing title and a malformed date", () => {
    const row = [
      "",
      "01/15/2026",
      "NQ",
      "Long",
      "NY AM",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "false",
      "",
      "",
      "",
      "",
      "",
    ].join(",");

    const [result] = parseTradeCsv(`${header}\n${row}`);
    expect(result.errors).toContain("Missing title");
    expect(result.errors).toContain("date must be YYYY-MM-DD");
  });

  it("treats blank numeric cells as null, not zero", () => {
    const row = ["T", "2026-01-15", "NQ", "Long", "NY AM", "", "", "", "", "", "", "", "", "", "", "", "", "false", "", "", "", "", ""].join(
      ",",
    );
    const [result] = parseTradeCsv(`${header}\n${row}`);
    expect(result.values.entry_price).toBeNull();
    expect(result.values.pnl_usd).toBeNull();
  });

  it("returns an empty array for an empty file", () => {
    expect(parseTradeCsv("")).toEqual([]);
  });
});

describe("tradesToCsv", () => {
  it("round-trips models/mistakes as semicolon-joined lists and escapes commas", () => {
    const trade = {
      title: "NQ, long",
      date: "2026-01-15",
      instrument: "NQ",
      direction: "Long",
      session: "NY AM",
      models: ["Silver Bullet", "Order Block"],
      amd_phase: "Manipulation",
      bias_alignment: "With Bias",
      entry_price: 20000,
      stop_price: 19990,
      target_price: 20030,
      exit_price: 20025,
      contracts: 1,
      risk_usd: 200,
      pnl_usd: 500,
      result: "Win",
      setup_grade: "A+",
      followed_plan: true,
      emotion: "Calm",
      mistakes: ["None"],
      entry_reasoning: null,
      lesson: null,
      chart_url: null,
    } as unknown as TradeWithR;

    const csv = tradesToCsv([trade]);
    const lines = csv.split("\n");
    expect(lines[0]).toBe(TRADE_CSV_COLUMNS.join(","));
    expect(lines[1]).toContain('"NQ, long"');
    expect(lines[1]).toContain("Silver Bullet;Order Block");
  });
});
