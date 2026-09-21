import { addMonths, endOfMonth, format, startOfMonth } from "date-fns";
import { PageHeader } from "@/components/page-header";
import { MonthCalendar } from "@/components/calendar/month-calendar";
import { listDailyPreps } from "@/lib/data/daily-preps";
import { listTrades } from "@/lib/data/trades";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month: monthParam } = await searchParams;
  const anchor =
    monthParam && /^\d{4}-\d{2}$/.test(monthParam) ? new Date(`${monthParam}-01`) : new Date();
  const monthStart = startOfMonth(anchor);
  const monthEnd = endOfMonth(anchor);
  const start = format(monthStart, "yyyy-MM-dd");
  const end = format(monthEnd, "yyyy-MM-dd");

  const [trades, preps] = await Promise.all([
    listTrades({ start, end }),
    listDailyPreps({ start, end }),
  ]);

  const byDate = new Map<string, { pnl: number; count: number; biasOutcome: string | null }>();
  for (const t of trades) {
    if (!t.date) continue;
    const entry = byDate.get(t.date) ?? { pnl: 0, count: 0, biasOutcome: null };
    entry.pnl += t.pnl_usd ?? 0;
    entry.count += 1;
    byDate.set(t.date, entry);
  }
  for (const p of preps) {
    const entry = byDate.get(p.date) ?? { pnl: 0, count: 0, biasOutcome: null };
    entry.biasOutcome = p.bias_outcome;
    byDate.set(p.date, entry);
  }

  return (
    <>
      <PageHeader
        title="Calendar"
        description="Daily P&L, trade count, and bias outcome at a glance."
      />
      <MonthCalendar
        month={format(monthStart, "yyyy-MM")}
        prevMonth={format(addMonths(monthStart, -1), "yyyy-MM")}
        nextMonth={format(addMonths(monthStart, 1), "yyyy-MM")}
        days={Object.fromEntries(byDate)}
      />
    </>
  );
}
