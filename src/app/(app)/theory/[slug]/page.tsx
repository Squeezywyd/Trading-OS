import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TheoryMarkdown } from "@/components/theory/theory-markdown";
import { TocSidebar } from "@/components/theory/toc-sidebar";
import { TheoryEditor } from "@/components/theory/theory-editor";
import { getChecklistState, getTheoryDocBySlug } from "@/lib/data/theory";
import { extractToc } from "@/lib/trading/toc";

export default async function TheoryDocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = await getTheoryDocBySlug(slug);
  if (!doc) notFound();

  const [checklistState, toc] = await Promise.all([
    getChecklistState(doc.id),
    Promise.resolve(extractToc(doc.body_md)),
  ]);

  return (
    <div>
      <Link
        href="/theory"
        className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1.5 text-sm"
      >
        <ArrowLeft className="size-3.5" />
        Theory Library
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">{doc.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <Badge variant="outline">{doc.category}</Badge>
            <Badge variant={doc.priority === "Core" ? "default" : "outline"}>{doc.priority}</Badge>
            {doc.use_for.map((u) => (
              <Badge key={u} variant="secondary">
                {u}
              </Badge>
            ))}
          </div>
        </div>
        <TheoryEditor doc={doc} />
      </div>

      <div className="flex gap-8">
        <div className="min-w-0 flex-1">
          <TheoryMarkdown
            content={doc.body_md}
            theoryDocId={doc.id}
            initialChecklistState={checklistState}
          />
        </div>
        <TocSidebar toc={toc} />
      </div>
    </div>
  );
}
