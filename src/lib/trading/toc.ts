import GithubSlugger from "github-slugger";

export interface TocEntry {
  id: string;
  text: string;
  depth: 2 | 3;
}

/** Extracts h2/h3 headings from raw Markdown, slugged the same way rehype-slug
 * IDs the rendered headings, so TOC links (#slug) land correctly. */
export function extractToc(markdown: string): TocEntry[] {
  const slugger = new GithubSlugger();
  const entries: TocEntry[] = [];
  const lines = markdown.split("\n");
  let inCodeFence = false;

  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) continue;

    const match = /^(##|###)\s+(.+?)\s*#*$/.exec(line);
    if (!match) continue;

    const depth = match[1].length as 2 | 3;
    const text = match[2].replace(/[*_`]/g, "");
    entries.push({ id: slugger.slug(text), text, depth });
  }

  return entries;
}
