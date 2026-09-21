import { subDays, format } from "date-fns";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { DateRangeTabs } from "@/components/dashboard/date-range-tabs";
import { BreakdownPanel } from "@/components/analytics/breakdown-panel";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { getStatsBy, type StatsDimension } from "@/lib/data/analytics";
import { listTrades } from "@/lib/data/trades";
import { BarChart3 } from "lucide-react";

const RANGE_DAYS: Record<string, number | null> = { "7d": 7, "30d": 30, "90d": 90, all: null };

const DIMENSIONS: Array<{ key: StatsDimension; label: string }> = [
  { key: "session", label: "Session" },
  { key: "model", label: "Model" },
  { key: "instrument", label: "Instrument" },
  { key: "amd_phase", label: "AMD Phase" },
  { key: "bias_alignment", label: "Bias Alignment" },
  { key: "followed_plan", label: "Followed Plan" },
  { key: "emotion", label: "Emotion" },
  { key: "mistake", label: "Mistakes" },
  { key: "grade", label: "Grade" },
  { key: "weekday", label: "Weekday" },
];

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range: rangeParam } = await searchParams;
  const range = rangeParam && rangeParam in RANGE_DAYS ? rangeParam : "30d";
  const days = RANGE_DAYS[range];
  const start = days ? format(subDays(new Date(), days), "yyyy-MM-dd") : undefined;

  const [trades, ...allStats] = await Promise.all([
    listTrades({ start }),
    ...DIMENSIONS.map((d) => getStatsBy(d.key, { start })),
  ]);

  if (trades.length === 0) {
    return (
      <>
        <PageHeader title="Analytics" description="Breakdowns by session, model, instrument, and more." />
        <EmptyState
          icon={BarChart3}
          title="Nothing to analyze yet"
          description="Log a few trades and breakdowns by session, model, instrument, AMD phase, and more will show up here."
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Bars colored by expectancy sign. Rows under 10 trades are flagged low-sample."
        actions={<DateRangeTabs value={range} />}
      />

      <Tabs defaultValue={DIMENSIONS[0].key}>
        <TabsList className="mb-4 flex-wrap">
          {DIMENSIONS.map((d) => (
            <TabsTrigger key={d.key} value={d.key}>{d.label}</TabsTrigger>
          ))}
        </TabsList>
        {DIMENSIONS.map((d, i) => (
          <TabsContent key={d.key} value={d.key}>
            <BreakdownPanel rows={allStats[i] ?? []} />
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
