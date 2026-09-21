"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const RANGES = [
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
  { value: "all", label: "All" },
];

export function DateRangeTabs({ value }: { value: string }) {
  const router = useRouter();

  return (
    <div className="bg-muted flex gap-0.5 rounded-lg p-0.5">
      {RANGES.map((r) => (
        <button
          key={r.value}
          type="button"
          onClick={() => router.push(`/dashboard?range=${r.value}`)}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
            value === r.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
