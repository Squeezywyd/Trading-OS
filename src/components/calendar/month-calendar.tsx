"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DayData {
  pnl: number;
  count: number;
  biasOutcome: string | null;
}

const BIAS_DOT: Record<string, string> = {
  Correct: "bg-profit",
  Partial: "bg-amber-500",
  Wrong: "bg-loss",
  "No Trade Day": "bg-muted-foreground",
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function MonthCalendar({
  month,
  prevMonth,
  nextMonth,
  days,
}: {
  month: string;
  prevMonth: string;
  nextMonth: string;
  days: Record<string, DayData>;
}) {
  const router = useRouter();
  const anchor = new Date(`${month}-01`);
  const gridStart = startOfWeek(startOfMonth(anchor), { weekStartsOn: 1 });
  const gridEnd = endOfWeek(endOfMonth(anchor), { weekStartsOn: 1 });
  const cells = eachDayOfInterval({ start: gridStart, end: gridEnd });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold tracking-tight">{format(anchor, "MMMM yyyy")}</h3>
        <div className="flex gap-1">
          <Button variant="outline" size="icon-sm" onClick={() => router.push(`/calendar?month=${prevMonth}`)} aria-label="Previous month">
            <ChevronLeft />
          </Button>
          <Button variant="outline" size="icon-sm" onClick={() => router.push(`/calendar?month=${nextMonth}`)} aria-label="Next month">
            <ChevronRight />
          </Button>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="border-border/60 text-muted-foreground grid grid-cols-7 border-b text-center text-xs font-medium">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((date) => {
            const key = format(date, "yyyy-MM-dd");
            const data = days[key];
            const inMonth = isSameMonth(date, anchor);
            return (
              <Link
                key={key}
                href={`/prep/${key}`}
                className={cn(
                  "border-border/30 hover:bg-muted/40 flex min-h-20 flex-col gap-1 border-r border-b p-1.5 text-left transition-colors last:border-r-0 sm:min-h-24 sm:p-2",
                  !inMonth && "opacity-30",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn("text-xs tabular-nums", isToday(date) && "text-primary font-semibold")}>
                    {format(date, "d")}
                  </span>
                  {data?.biasOutcome ? (
                    <span
                      className={cn("size-1.5 rounded-full", BIAS_DOT[data.biasOutcome] ?? "bg-muted-foreground")}
                      title={data.biasOutcome}
                    />
                  ) : null}
                </div>
                {data && data.count > 0 ? (
                  <div className="mt-auto space-y-0.5">
                    <p
                      className={cn(
                        "font-mono text-xs font-medium tabular-nums",
                        data.pnl > 0 ? "text-profit" : data.pnl < 0 ? "text-loss" : "text-muted-foreground",
                      )}
                    >
                      {data.pnl >= 0 ? "+" : "-"}${Math.abs(data.pnl).toFixed(0)}
                    </p>
                    <p className="text-muted-foreground text-[10px]">
                      {data.count} trade{data.count === 1 ? "" : "s"}
                    </p>
                  </div>
                ) : null}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
