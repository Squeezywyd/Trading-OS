import { Settings } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Prop account rules and per-model defaults."
      />
      <EmptyState
        icon={Settings}
        title="No account settings yet"
        description="Enter your LucidFlex 50K profit target, daily loss limit, max drawdown, and consistency rule."
      />
    </>
  );
}
