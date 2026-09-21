import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { PageHeader } from "@/components/page-header";
import { WeekNav } from "@/components/recap/week-nav";
import { WeeklyRecapForm } from "@/components/recap/weekly-recap-form";
import {
  getWeeklyRecapByWeekStart,
  getWeeklyRecapStats,
  weekStartForDate,
} from "@/lib/data/weekly-recaps";
import { getStatsBy } from "@/lib/data/analytics";
import { NY_TZ } from "@/lib/trading/sessions";
import { addDays } from "date-fns";

export default async function WeeklyRecapPage() {
  const todayNy = format(toZonedTime(new Date(), NY_TZ), "yyyy-MM-dd");
  const weekStart = weekStartForDate(todayNy);
  const weekEnd = format(addDays(new Date(`${weekStart}T00:00:00`), 6), "yyyy-MM-dd");

  const recap = await getWeeklyRecapByWeekStart(weekStart);
  const [stats, modelStats] = await Promise.all([
    recap ? getWeeklyRecapStats(recap.id) : null,
    getStatsBy("model", { start: weekStart, end: weekEnd }),
  ]);

  return (
    <>
      <PageHeader
        title="Weekly Recap"
        description="This week"
        actions={<WeekNav weekStart={weekStart} />}
      />
      <WeeklyRecapForm weekStart={weekStart} recap={recap} stats={stats} modelStats={modelStats} />
    </>
  );
}
