import { ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";

export default function WeeklyRecapPage() {
  return (
    <>
      <PageHeader
        title="Weekly Recap"
        description="Pick a week, review auto-computed stats, and grade your process."
      />
      <EmptyState
        icon={ClipboardList}
        title="No recap for this week yet"
        description="Weekly recaps roll up net P&L, trade count, and total R automatically from your logged trades."
      />
    </>
  );
}
