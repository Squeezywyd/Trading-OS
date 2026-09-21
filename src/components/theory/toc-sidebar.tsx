import type { TocEntry } from "@/lib/trading/toc";

export function TocSidebar({ toc }: { toc: TocEntry[] }) {
  if (toc.length === 0) return null;

  return (
    <nav className="sticky top-20 hidden max-h-[calc(100vh-6rem)] w-48 shrink-0 overflow-y-auto lg:block">
      <p className="label-muted mb-2">On this page</p>
      <ul className="space-y-1 text-sm">
        {toc.map((entry) => (
          <li key={entry.id} className={entry.depth === 3 ? "pl-3" : ""}>
            <a
              href={`#${entry.id}`}
              className="text-muted-foreground hover:text-foreground block truncate py-0.5 transition-colors"
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
