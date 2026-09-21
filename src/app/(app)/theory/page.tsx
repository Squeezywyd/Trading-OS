import { BookOpen } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";

export default function TheoryLibraryPage() {
  return (
    <>
      <PageHeader
        title="Theory Library"
        description="ICT/SMC concepts, checklists, and rules — searchable and editable."
      />
      <EmptyState
        icon={BookOpen}
        title="Theory library is empty"
        description="Run the seed script to load the Theory Library content into Supabase."
      />
    </>
  );
}
