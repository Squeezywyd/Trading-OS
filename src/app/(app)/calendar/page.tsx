import { CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";

export default function CalendarPage() {
  return (
    <>
      <PageHeader
        title="Calendar"
        description="Daily P&L, trade count, and bias outcome at a glance."
      />
      <EmptyState
        icon={CalendarDays}
        title="Nothing logged this month"
        description="Once you have preps and trades, each day here will show color-coded P&L and a bias-outcome marker."
      />
    </>
  );
}
