"use client";

import * as React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { Checkbox } from "@/components/ui/checkbox";
import { toggleChecklistItemAction } from "@/app/(app)/theory/actions";
import { cn } from "@/lib/utils";

function slugifyItemKey(text: string, seen: Map<string, number>): string {
  const base = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
  const count = seen.get(base) ?? 0;
  seen.set(base, count + 1);
  return count === 0 ? base : `${base}-${count}`;
}

function extractText(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    if (node.type === "input") return "";
    return extractText(node.props.children);
  }
  return "";
}

function TaskListItem({
  theoryDocId,
  itemKey,
  defaultChecked,
  children,
  className,
}: {
  theoryDocId: string;
  itemKey: string;
  defaultChecked: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const [checked, setChecked] = React.useState(defaultChecked);
  const [pending, startTransition] = React.useTransition();

  return (
    <li className={cn(className, "flex items-start gap-2 [&::marker]:content-none")}>
      <Checkbox
        checked={checked}
        disabled={pending}
        className="mt-0.5"
        onCheckedChange={(v) => {
          const next = v === true;
          setChecked(next);
          startTransition(() => {
            toggleChecklistItemAction(theoryDocId, itemKey, next);
          });
        }}
      />
      <span className={cn(checked && "text-muted-foreground line-through")}>{children}</span>
    </li>
  );
}

export function TheoryMarkdown({
  content,
  theoryDocId,
  initialChecklistState,
}: {
  content: string;
  theoryDocId: string;
  initialChecklistState: Record<string, boolean>;
}) {
  // Recreated fresh each render — the whole tree below renders synchronously
  // in this pass, so a plain local Map (not a ref) dedupes slugs correctly
  // without violating the no-ref-mutation-during-render rule.
  const seenKeys = new Map<string, number>();

  const components: Components = {
    li(props) {
      const { children, className, ...rest } = props;
      const isTask = typeof className === "string" && className.includes("task-list-item");
      if (!isTask) {
        return (
          <li className={className} {...rest}>
            {children}
          </li>
        );
      }

      const childArray = React.Children.toArray(children);
      const checkboxEl = childArray.find(
        (c): c is React.ReactElement<{ checked?: boolean }> =>
          React.isValidElement(c) && c.type === "input",
      );
      const defaultChecked = checkboxEl?.props.checked ?? false;
      const textChildren = childArray.filter((c) => c !== checkboxEl);
      const text = extractText(textChildren);
      const itemKey = slugifyItemKey(text, seenKeys);
      const checked =
        itemKey in initialChecklistState ? initialChecklistState[itemKey] : defaultChecked;

      return (
        <TaskListItem
          theoryDocId={theoryDocId}
          itemKey={itemKey}
          defaultChecked={checked}
          className={className}
        >
          {textChildren}
        </TaskListItem>
      );
    },
    a(props) {
      return <a {...props} target="_blank" rel="noopener noreferrer" />;
    },
  };

  return (
    <div className="prose-theory">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
