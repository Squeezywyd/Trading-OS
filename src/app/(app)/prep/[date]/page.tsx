import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { DailyPrepForm } from "@/components/prep/daily-prep-form";
import { LinkedTrades } from "@/components/prep/linked-trades";
import { getDailyPrepByDate } from "@/lib/data/daily-preps";
import { listTrades } from "@/lib/data/trades";

export default async function DailyPrepDatePage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) notFound();

  const [prep, trades] = await Promise.all([
    getDailyPrepByDate(date),
    listTrades({ start: date, end: date }),
  ]);

  return (
    <>
      <PageHeader title="Daily Prep" description={date} />
      <div className="space-y-6">
        <DailyPrepForm date={date} prep={prep} />
        <LinkedTrades trades={trades} />
      </div>
    </>
  );
}
