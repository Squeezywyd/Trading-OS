import { describe, expect, it } from "vitest";
import { extractChecklistItems } from "../checklist";

const sample = `# A+ Setup Checklist

## Context
- [ ] Daily bias written with invalidation level
- [ ] Trade direction matches bias

## Time
- [ ] Inside a killzone or Silver Bullet window

Some prose that isn't a checklist item.
- Not a task item, just a bullet.
`;

describe("extractChecklistItems", () => {
  it("extracts task items with their section heading", () => {
    const items = extractChecklistItems(sample);
    expect(items).toHaveLength(3);
    expect(items[0]).toEqual({
      key: "item-0",
      text: "Daily bias written with invalidation level",
      section: "Context",
    });
    expect(items[2].section).toBe("Time");
  });

  it("ignores plain bullets that aren't task-list items", () => {
    const items = extractChecklistItems(sample);
    expect(items.some((i) => i.text.includes("Not a task item"))).toBe(false);
  });

  it("returns an empty array for markdown with no checklist", () => {
    expect(extractChecklistItems("# Title\n\nJust prose.")).toEqual([]);
  });
});
