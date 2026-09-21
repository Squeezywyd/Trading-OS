import { BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";

export default function AnalyticsPage() {
  return (
    <>
      <PageHeader
        title="Analytics"
        description="Breakdowns by session, model, instrument, AMD phase, bias alignment, emotion, mistakes, weekday, and grade."
      />
      <EmptyState
        icon={BarChart3}
        title="Not enough data yet"
        description="Breakdowns need logged trades to compute win rate, avg R, expectancy, and P&L per dimension."
      />
    </>
  );
}
