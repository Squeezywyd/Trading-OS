import type { TradeWithR } from "@/lib/data/trades";
import type { TradeFormValues } from "@/lib/validation/trade";

export const TRADE_CSV_COLUMNS = [
  "title",
  "date",
  "instrument",
  "direction",
  "session",
  "models",
  "amd_phase",
  "bias_alignment",
  "entry_price",
  "stop_price",
  "target_price",
  "exit_price",
  "contracts",
  "risk_usd",
  "pnl_usd",
  "result",
  "setup_grade",
  "followed_plan",
  "emotion",
  "mistakes",
  "entry_reasoning",
  "lesson",
  "chart_url",
] as const;

function csvEscape(value: unknown): string {
  if (value == null) return "";
  const s = String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function tradesToCsv(trades: TradeWithR[]): string {
  const header = TRADE_CSV_COLUMNS.join(",");
  const rows = trades.map((t) =>
    TRADE_CSV_COLUMNS.map((col) => {
      if (col === "models" || col === "mistakes") {
        return csvEscape((t[col] ?? []).join(";"));
      }
      return csvEscape(t[col as keyof TradeWithR]);
    }).join(","),
  );
  return [header, ...rows].join("\n");
}

/** Minimal RFC-4180 parser: handles quoted fields, escaped quotes, commas/newlines inside quotes. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
      continue;
    }

    if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.length > 1 || r[0] !== "");
}

export interface CsvImportRow {
  values: Partial<TradeFormValues>;
  rowNumber: number;
  errors: string[];
}

/** Parses raw CSV text (matching TRADE_CSV_COLUMNS header) into loosely-typed trade values for review before import. */
export function parseTradeCsv(text: string): CsvImportRow[] {
  const rows = parseCsv(text);
  if (rows.length === 0) return [];

  const header = rows[0].map((h) => h.trim());
  const dataRows = rows.slice(1);

  return dataRows.map((cells, idx) => {
    const errors: string[] = [];
    const record: Record<string, string> = {};
    header.forEach((col, i) => {
      record[col] = cells[i] ?? "";
    });

    const num = (v: string) => (v.trim() === "" ? null : Number(v));

    if (!record.title?.trim()) errors.push("Missing title");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(record.date ?? "")) errors.push("date must be YYYY-MM-DD");

    const values: Partial<TradeFormValues> = {
      title: record.title,
      date: record.date,
      instrument: record.instrument as TradeFormValues["instrument"],
      direction: record.direction as TradeFormValues["direction"],
      session: record.session as TradeFormValues["session"],
      models: record.models ? (record.models.split(";").filter(Boolean) as TradeFormValues["models"]) : [],
      amd_phase: (record.amd_phase || null) as TradeFormValues["amd_phase"],
      bias_alignment: (record.bias_alignment || null) as TradeFormValues["bias_alignment"],
      entry_price: num(record.entry_price ?? ""),
      stop_price: num(record.stop_price ?? ""),
      target_price: num(record.target_price ?? ""),
      exit_price: num(record.exit_price ?? ""),
      contracts: num(record.contracts ?? ""),
      risk_usd: num(record.risk_usd ?? ""),
      pnl_usd: num(record.pnl_usd ?? ""),
      result: (record.result || null) as TradeFormValues["result"],
      setup_grade: (record.setup_grade || null) as TradeFormValues["setup_grade"],
      followed_plan: record.followed_plan?.trim().toLowerCase() === "true",
      emotion: (record.emotion || null) as TradeFormValues["emotion"],
      mistakes: record.mistakes
        ? (record.mistakes.split(";").filter(Boolean) as TradeFormValues["mistakes"])
        : [],
      entry_reasoning: record.entry_reasoning || null,
      lesson: record.lesson || null,
      chart_url: record.chart_url || null,
    };

    return { values, rowNumber: idx + 2, errors };
  });
}
