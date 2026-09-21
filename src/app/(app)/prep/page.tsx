import { Sunrise } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";

export default function DailyPrepPage() {
  return (
    <>
      <PageHeader
        title="Daily Prep"
        description="HTF draw, key levels, news, and the bias wizard for today's session."
      />
      <EmptyState
        icon={Sunrise}
        title="No prep for today yet"
        description="Run the Bias Wizard to build today's HTF draw, premium/discount read, and game plan."
      />
    </>
  );
}
