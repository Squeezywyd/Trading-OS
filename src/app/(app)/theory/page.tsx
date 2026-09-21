import Link from "next/link";
import { Suspense } from "react";
import { BookOpen } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { TheoryFilters } from "@/components/theory/theory-filters";
import { Badge } from "@/components/ui/badge";
import { listTheoryDocs } from "@/lib/data/theory";
import type {
  TheoryCategory,
  TheoryPriority,
  TheoryUseFor,
} from "@/lib/constants/enums";

export default async function TheoryLibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; useFor?: string; priority?: string }>;
}) {
  const { q, category, useFor, priority } = await searchParams;
  const docs = await listTheoryDocs({
    search: q,
    category: category as TheoryCategory | undefined,
    useFor: useFor as TheoryUseFor | undefined,
    priority: priority as TheoryPriority | undefined,
  });

  return (
    <>
      <PageHeader title="Theory Library" description="ICT/SMC concepts, checklists, and rules." />
      <Suspense fallback={null}>
        <TheoryFilters />
      </Suspense>

      {docs.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No matching theory docs"
          description="Try a different search or clear the filters. If the library is empty, run `npm run seed`."
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((doc) => (
            <Link
              key={doc.id}
              href={`/theory/${doc.slug}`}
              className="glass-panel hover:border-border block p-4 transition-colors"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <Badge variant="outline" className="text-[10px]">{doc.category}</Badge>
                {doc.priority === "Core" ? <Badge className="text-[10px]">Core</Badge> : null}
              </div>
              <h3 className="mb-1 text-sm font-medium">{doc.title}</h3>
              {doc.summary ? (
                <p className="text-muted-foreground line-clamp-2 text-xs">{doc.summary}</p>
              ) : null}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
