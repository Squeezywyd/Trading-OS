import { Wrench } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";

export default function ToolsPage() {
  return (
    <>
      <PageHeader
        title="Tools"
        description="Position-size calculator, session clock, and news-day countdown."
      />
      <EmptyState
        icon={Wrench}
        title="Tools coming online"
        description="Position sizing, the NY/Zurich session clock with killzones, and news countdown will live here."
      />
    </>
  );
}
