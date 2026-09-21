import { NextResponse } from "next/server";
import { listTradesForExport } from "@/lib/data/trades";
import { tradesToCsv } from "@/lib/trading/csv";

export async function GET() {
  const trades = await listTradesForExport();
  const csv = tradesToCsv(trades);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="trades-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
