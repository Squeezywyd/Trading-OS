"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { weeklyRecapFormSchema } from "@/lib/validation/weekly-recap";
import { WEEK_GRADES, WEEKLY_BIAS_CORRECT_VALUES } from "@/lib/constants/enums";
import { saveWeeklyRecapAction } from "@/app/(app)/recap/actions";
import type { WeeklyRecap, WeeklyRecapStats } from "@/lib/data/weekly-recaps";
import type { StatsRow } from "@/lib/data/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";

function draftText(stats: WeeklyRecapStats | null, modelStats: StatsRow[]) {
  if (!stats || stats.trade_count === 0) return { worked: "", failed: "" };
  const best = [...modelStats].sort((a, b) => (b.expectancy ?? 0) - (a.expectancy ?? 0))[0];
  const worst = [...modelStats].sort((a, b) => (a.expectancy ?? 0) - (b.expectancy ?? 0))[0];
  return {
    worked:
      best && best.expectancy != null && best.expectancy > 0
        ? `${best.dimension} performed best (${best.n} trades, ${best.win_rate?.toFixed(0)}% win rate, $${best.expectancy.toFixed(0)} avg).`
        : "",
    failed:
      worst && worst.expectancy != null && worst.expectancy < 0
        ? `${worst.dimension} was the weak spot (${worst.n} trades, ${worst.win_rate?.toFixed(0)}% win rate, $${worst.expectancy.toFixed(0)} avg).`
        : "",
  };
}

export function WeeklyRecapForm({
  weekStart,
  recap,
  stats,
  modelStats,
}: {
  weekStart: string;
  recap?: WeeklyRecap | null;
  stats: WeeklyRecapStats | null;
  modelStats: StatsRow[];
}) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(weeklyRecapFormSchema),
    defaultValues: {
      week_start: weekStart,
      week_grade: recap?.week_grade ?? null,
      process_score: recap?.process_score ?? null,
      rule_breaks: recap?.rule_breaks ?? 0,
      weekly_bias_correct: recap?.weekly_bias_correct ?? null,
      what_worked: recap?.what_worked ?? null,
      what_failed: recap?.what_failed ?? null,
      key_lessons: recap?.key_lessons ?? null,
      focus_next_week: recap?.focus_next_week ?? null,
    },
  });

  const { control, register, handleSubmit, formState, setValue } = form;

  async function onSubmit(values: Record<string, unknown>) {
    const res = await saveWeeklyRecapAction({ ...values, week_start: weekStart });
    if (!res.success) {
      toast.error(res.error ?? "Check the form for errors");
      return;
    }
    toast.success("Recap saved");
    router.refresh();
  }

  function applyDraft() {
    const draft = draftText(stats, modelStats);
    if (draft.worked) setValue("what_worked", draft.worked);
    if (draft.failed) setValue("what_failed", draft.failed);
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="glass-panel p-4">
          <p className="label-muted">Net P&amp;L</p>
          <p
            className={`mt-1 font-mono text-xl font-semibold tabular-nums ${stats && (stats.net_pnl ?? 0) >= 0 ? "text-profit" : "text-loss"}`}
          >
            {stats
              ? `${(stats.net_pnl ?? 0) >= 0 ? "+" : "-"}$${Math.abs(stats.net_pnl ?? 0).toFixed(0)}`
              : "—"}
          </p>
        </div>
        <div className="glass-panel p-4">
          <p className="label-muted">Trades</p>
          <p className="mt-1 font-mono text-xl font-semibold tabular-nums">
            {stats?.trade_count ?? 0}
          </p>
        </div>
        <div className="glass-panel p-4">
          <p className="label-muted">Total R</p>
          <p
            className={`mt-1 font-mono text-xl font-semibold tabular-nums ${stats && (stats.total_r ?? 0) >= 0 ? "text-profit" : "text-loss"}`}
          >
            {stats
              ? `${(stats.total_r ?? 0) >= 0 ? "+" : ""}${(stats.total_r ?? 0).toFixed(2)}R`
              : "—"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="glass-panel space-y-5 p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field>
              <FieldLabel>Week grade</FieldLabel>
              <FieldContent>
                <Controller
                  control={control}
                  name="week_grade"
                  render={({ field }) => (
                    <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="—" />
                      </SelectTrigger>
                      <SelectContent>
                        {WEEK_GRADES.map((v) => (
                          <SelectItem key={v} value={v}>
                            {v}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="process_score">Process score (1-10)</FieldLabel>
              <FieldContent>
                <Input
                  id="process_score"
                  type="number"
                  min={1}
                  max={10}
                  className="font-mono tabular-nums"
                  {...register("process_score")}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="rule_breaks">Rule breaks</FieldLabel>
              <FieldContent>
                <Input
                  id="rule_breaks"
                  type="number"
                  min={0}
                  className="font-mono tabular-nums"
                  {...register("rule_breaks")}
                />
              </FieldContent>
            </Field>
          </div>

          <Field>
            <FieldLabel>Weekly bias correct?</FieldLabel>
            <FieldContent className="max-w-40">
              <Controller
                control={control}
                name="weekly_bias_correct"
                render={({ field }) => (
                  <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="—" />
                    </SelectTrigger>
                    <SelectContent>
                      {WEEKLY_BIAS_CORRECT_VALUES.map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FieldContent>
          </Field>
        </div>

        <div className="glass-panel space-y-5 p-5">
          <div className="flex items-center justify-between">
            <p className="label-muted">Review</p>
            <Button type="button" variant="outline" size="sm" onClick={applyDraft}>
              <Sparkles />
              Draft from stats
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="what_worked">What worked</FieldLabel>
              <FieldContent>
                <Textarea id="what_worked" rows={3} {...register("what_worked")} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="what_failed">What failed</FieldLabel>
              <FieldContent>
                <Textarea id="what_failed" rows={3} {...register("what_failed")} />
              </FieldContent>
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="key_lessons">Key lessons</FieldLabel>
            <FieldContent>
              <Textarea id="key_lessons" rows={3} {...register("key_lessons")} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="focus_next_week">Focus next week</FieldLabel>
            <FieldContent>
              <Textarea id="focus_next_week" rows={3} {...register("focus_next_week")} />
            </FieldContent>
          </Field>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={formState.isSubmitting}>
            {formState.isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
            Save recap
          </Button>
        </div>
      </form>
    </div>
  );
}
