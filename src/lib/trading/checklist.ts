export interface ChecklistItem {
  key: string;
  text: string;
  section: string | null;
}

/** Extracts `- [ ]` / `- [x]` GFM task items from Markdown, grouped by the
 * nearest preceding heading. Used to render the A+ Setup Checklist inline on
 * the trade form (theory_docs.body_md is the single source of truth for the
 * checklist content — this never hardcodes item text). */
export function extractChecklistItems(markdown: string): ChecklistItem[] {
  const items: ChecklistItem[] = [];
  let section: string | null = null;
  let index = 0;

  for (const line of markdown.split("\n")) {
    const heading = /^#{1,6}\s+(.+)$/.exec(line);
    if (heading) {
      section = heading[1].trim();
      continue;
    }

    const task = /^\s*-\s+\[( |x|X)\]\s+(.+)$/.exec(line);
    if (task) {
      const text = task[2].trim();
      items.push({ key: `item-${index++}`, text, section });
    }
  }

  return items;
}
