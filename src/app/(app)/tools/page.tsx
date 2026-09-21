import { PageHeader } from "@/components/page-header";
import { PositionSizeCalculator } from "@/components/tools/position-size-calculator";
import { SessionClock } from "@/components/tools/session-clock";
import { NewsCountdown } from "@/components/tools/news-countdown";

export default function ToolsPage() {
  return (
    <>
      <PageHeader title="Tools" description="Position sizing, session clock, and news countdown." />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <PositionSizeCalculator />
          <NewsCountdown />
        </div>
        <SessionClock />
      </div>
    </>
  );
}
