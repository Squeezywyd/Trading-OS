import { NotebookPen } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";

export default function TradeJournalPage() {
  return (
    <>
      <PageHeader
        title="Trade Journal"
        description="Every logged trade, filterable by session, model, instrument, and result."
      />
      <EmptyState
        icon={NotebookPen}
        title="No trades yet"
        description="Log your first trade to start tracking setup grade, R multiple, and lessons learned."
      />
    </>
  );
}
