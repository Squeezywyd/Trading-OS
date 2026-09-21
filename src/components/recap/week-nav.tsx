"use client";

import { useRouter } from "next/navigation";
import { addDays, format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WeekNav({ weekStart }: { weekStart: string }) {
  const router = useRouter();
  const date = new Date(`${weekStart}T00:00:00`);
  const weekEnd = format(addDays(date, 6), "MMM d");
  const prev = format(addDays(date, -7), "yyyy-MM-dd");
  const next = format(addDays(date, 7), "yyyy-MM-dd");

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon-sm" onClick={() => router.push(`/recap/${prev}`)} aria-label="Previous week">
        <ChevronLeft />
      </Button>
      <span className="font-mono text-sm tabular-nums">
        {format(date, "MMM d")} – {weekEnd}
      </span>
      <Button variant="outline" size="icon-sm" onClick={() => router.push(`/recap/${next}`)} aria-label="Next week">
        <ChevronRight />
      </Button>
    </div>
  );
}
