"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Sunrise, NotebookPen, BookOpen } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { NAV_ITEMS } from "@/lib/nav";

const QUICK_ACTIONS = [
  { label: "New Trade", href: "/journal/new", icon: Plus },
  { label: "New Daily Prep", href: "/prep/new", icon: Sunrise },
  { label: "New Weekly Recap", href: "/recap/new", icon: NotebookPen },
  { label: "Search Theory Library", href: "/theory", icon: BookOpen },
];

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();

  const go = React.useCallback(
    (href: string) => {
      onOpenChange(false);
      router.push(href);
    },
    [router, onOpenChange],
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Jump to a page, start a new entry, search theory..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Quick actions">
          {QUICK_ACTIONS.map((action) => (
            <CommandItem key={action.href} onSelect={() => go(action.href)}>
              <action.icon />
              <span>{action.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Go to">
          {NAV_ITEMS.map((item) => (
            <CommandItem key={item.href} onSelect={() => go(item.href)}>
              <item.icon />
              <span>{item.label}</span>
              {item.shortcut ? <CommandShortcut>{item.shortcut}</CommandShortcut> : null}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
