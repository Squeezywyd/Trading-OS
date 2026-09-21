"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { dailyPrepFormSchema } from "@/lib/validation/daily-prep";
import {
  BIAS_OUTCOMES,
  CONFIDENCE_LEVELS,
  DAILY_BIAS_VALUES,
  EXPECTED_AMD_PROFILES,
  WEEKLY_BIAS_VALUES,
} from "@/lib/constants/enums";
import { saveDailyPrepAction } from "@/app/(app)/prep/actions";
import type { DailyPrep } from "@/lib/data/daily-preps";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { BiasWizardDialog } from "@/components/prep/bias-wizard-dialog";

export function DailyPrepForm({ date, prep }: { date: string; prep?: DailyPrep | null }) {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(dailyPrepFormSchema),
    defaultValues: {
      date,
      weekly_bias: prep?.weekly_bias ?? null,
      daily_bias: prep?.daily_bias ?? null,
      confidence: prep?.confidence ?? null,
      htf_draw: prep?.htf_draw ?? null,
      key_levels: prep?.key_levels ?? null,
      news_events: prep?.news_events ?? null,
      high_impact_news: prep?.high_impact_news ?? false,
      expected_amd_profile: prep?.expected_amd_profile ?? null,
      invalidation_level: prep?.invalidation_level ?? null,
      game_plan: prep?.game_plan ?? null,
      bias_outcome: prep?.bias_outcome ?? null,
      eod_notes: prep?.eod_notes ?? null,
    },
  });

  const { control, register, handleSubmit, formState, setValue } = form;

  async function onSubmit(values: Record<string, unknown>) {
    const res = await saveDailyPrepAction({ ...values, date });
    if (!res.success) {
      toast.error(res.error ?? "Check the form for errors");
      return;
    }
    toast.success("Prep saved");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="glass-panel space-y-5 p-5">
        <div className="flex items-center justify-between">
          <p className="label-muted">Bias</p>
          <BiasWizardDialog
            onApply={(result) => {
              setValue("daily_bias", result.dailyBias);
              setValue("confidence", result.confidence);
              if (result.invalidationLevel != null) {
                setValue("invalidation_level", result.invalidationLevel);
              }
            }}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field>
            <FieldLabel>Weekly bias</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="weekly_bias"
                render={({ field }) => (
                  <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="—" />
                    </SelectTrigger>
                    <SelectContent>
                      {WEEKLY_BIAS_VALUES.map((v) => (
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
            <FieldLabel>Daily bias</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="daily_bias"
                render={({ field }) => (
                  <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="—" />
                    </SelectTrigger>
                    <SelectContent>
                      {DAILY_BIAS_VALUES.map((v) => (
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
            <FieldLabel>Confidence</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="confidence"
                render={({ field }) => (
                  <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="—" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONFIDENCE_LEVELS.map((v) => (
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="htf_draw">HTF draw on liquidity</FieldLabel>
            <FieldContent>
              <Textarea id="htf_draw" rows={2} {...register("htf_draw")} />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="key_levels">Key levels</FieldLabel>
            <FieldContent>
              <Textarea id="key_levels" rows={2} {...register("key_levels")} />
            </FieldContent>
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="invalidation_level">Invalidation level</FieldLabel>
          <FieldContent className="max-w-40">
            <Input
              id="invalidation_level"
              type="number"
              step="any"
              className="font-mono tabular-nums"
              {...register("invalidation_level")}
            />
          </FieldContent>
        </Field>
      </div>

      <div className="glass-panel space-y-5 p-5">
        <p className="label-muted">News &amp; Profile</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="news_events">News / events</FieldLabel>
            <FieldContent>
              <Textarea id="news_events" rows={2} {...register("news_events")} />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Expected AMD profile</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="expected_amd_profile"
                render={({ field }) => (
                  <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="—" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPECTED_AMD_PROFILES.map((v) => (
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

        <Field orientation="horizontal">
          <FieldLabel htmlFor="high_impact_news">High-impact news today</FieldLabel>
          <Controller
            control={control}
            name="high_impact_news"
            render={({ field }) => (
              <Switch
                id="high_impact_news"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="game_plan">Game plan</FieldLabel>
          <FieldContent>
            <Textarea id="game_plan" rows={4} {...register("game_plan")} />
          </FieldContent>
        </Field>
      </div>

      <div className="glass-panel space-y-5 p-5">
        <p className="label-muted">End of Day Review</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel>Bias outcome</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="bias_outcome"
                render={({ field }) => (
                  <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="—" />
                    </SelectTrigger>
                    <SelectContent>
                      {BIAS_OUTCOMES.map((v) => (
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

        <Field>
          <FieldLabel htmlFor="eod_notes">EOD notes</FieldLabel>
          <FieldContent>
            <Textarea id="eod_notes" rows={3} {...register("eod_notes")} />
            <FieldError errors={[formState.errors.eod_notes]} />
          </FieldContent>
        </Field>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
          Save prep
        </Button>
      </div>
    </form>
  );
}
