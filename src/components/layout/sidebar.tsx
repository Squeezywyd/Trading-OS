"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ChevronsRight, TrendingUp } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const COLLAPSE_KEY = "trading-os:sidebar-collapsed";

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Reading localStorage must happen post-mount to avoid a server/client
    // hydration mismatch — this is the one legitimate case for setState
    // directly in an effect (see next-themes' own "mounted" guard).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    try {
      setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {
      // localStorage unavailable — keep expanded.
    }
  }, []);

  function toggle() {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        // per-viewer convenience only — safe to drop.
      }
      return next;
    });
  }

  return (
    <aside
      className={cn(
        "border-border/60 bg-sidebar/70 sticky top-0 hidden h-dvh flex-col border-r backdrop-blur-xl transition-[width] duration-200 ease-out md:flex",
        collapsed ? "w-16" : "w-60",
        !mounted && "duration-0",
      )}
    >
      <div className="flex h-14 items-center gap-2 px-4">
        <div className="glow-primary bg-primary/10 flex size-7 shrink-0 items-center justify-center rounded-lg">
          <TrendingUp className="text-primary size-4" />
        </div>
        {!collapsed && (
          <span className="truncate text-sm font-semibold tracking-tight">Trading OS</span>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const link = (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex h-9 items-center gap-3 rounded-lg px-2.5 text-sm transition-colors",
                active
                  ? "bg-primary/10 text-foreground"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              )}
            >
              {active && (
                <span className="bg-primary absolute inset-y-1.5 left-0 w-0.5 rounded-full" />
              )}
              <item.icon className={cn("size-4 shrink-0", active && "text-primary")} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger render={link} />
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          }
          return link;
        })}
      </nav>

      <div className="border-border/60 border-t p-2">
        <button
          onClick={toggle}
          className="text-muted-foreground hover:bg-accent/60 hover:text-foreground flex h-9 w-full items-center justify-center gap-2 rounded-lg text-sm transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
