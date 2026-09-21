import { LayoutDashboard } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Equity curve, KPIs, and today's prep status."
      />
      <EmptyState
        icon={LayoutDashboard}
        title="No trades logged yet"
        description="Once you log trades and complete a daily prep, your equity curve, win rate, expectancy, and drawdown will show up here."
      />
    </>
  );
}
