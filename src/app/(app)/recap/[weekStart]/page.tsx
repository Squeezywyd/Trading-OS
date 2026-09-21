import { notFound } from "next/navigation";
import { addDays, format } from "date-fns";
import { PageHeader } from "@/components/page-header";
import { WeekNav } from "@/components/recap/week-nav";
import { WeeklyRecapForm } from "@/components/recap/weekly-recap-form";
import { getWeeklyRecapByWeekStart, getWeeklyRecapStats } from "@/lib/data/weekly-recaps";
import { getStatsBy } from "@/lib/data/analytics";

export default async function WeeklyRecapWeekPage({
  params,
}: {
  params: Promise<{ weekStart: string }>;
}) {
  const { weekStart } = await params;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(weekStart)) notFound();

  const weekEnd = format(addDays(new Date(`${weekStart}T00:00:00`), 6), "yyyy-MM-dd");

  const recap = await getWeeklyRecapByWeekStart(weekStart);
  const [stats, modelStats] = await Promise.all([
    recap ? getWeeklyRecapStats(recap.id) : null,
    getStatsBy("model", { start: weekStart, end: weekEnd }),
  ]);

  return (
    <>
      <PageHeader title="Weekly Recap" actions={<WeekNav weekStart={weekStart} />} />
      <WeeklyRecapForm weekStart={weekStart} recap={recap} stats={stats} modelStats={modelStats} />
    </>
  );
}
