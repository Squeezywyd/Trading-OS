"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Search, Sun, Moon, LogOut } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/actions/auth-actions";

function pageTitle(pathname: string) {
  const match = NAV_ITEMS.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  return match?.label ?? "Trading OS";
}

export function Topbar({ onOpenPalette }: { onOpenPalette: () => void }) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    // Post-mount guard so the theme icon matches the client's resolved
    // theme without a server/client hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <header className="border-border/60 bg-background/70 sticky top-0 z-30 flex h-14 items-center gap-3 border-b px-4 backdrop-blur-xl md:px-6">
      <h1 className="truncate text-sm font-medium">{pageTitle(pathname)}</h1>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={onOpenPalette}
          className="border-border/60 bg-muted/40 text-muted-foreground hover:text-foreground hover:border-border flex h-8 items-center gap-2 rounded-lg border px-3 text-xs transition-colors"
        >
          <Search className="size-3.5" />
          <span className="hidden sm:inline">Search or jump to...</span>
          <span className="kbd-chip">⌘K</span>
        </button>

        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          aria-label="Toggle theme"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          {mounted && resolvedTheme === "light" ? (
            <Moon className="size-4" />
          ) : (
            <Sun className="size-4" />
          )}
        </Button>

        <form action={signOutAction}>
          <Button variant="ghost" size="icon" className="size-8" aria-label="Sign out" type="submit">
            <LogOut className="size-4" />
          </Button>
        </form>
      </div>
    </header>
  );
}
