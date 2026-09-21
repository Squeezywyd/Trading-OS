"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  tradeFormSchema,
  validateTradeCrossFields,
  type TradeFormValues,
} from "@/lib/validation/trade";
import {
  DIRECTIONS,
  EMOTIONS,
  INSTRUMENTS,
  MISTAKES,
  MODELS,
  RESULTS,
  SESSIONS,
  SETUP_GRADES,
  AMD_PHASES,
  BIAS_ALIGNMENTS,
} from "@/lib/constants/enums";
import { calcRiskUsd, calcRMultiple, calcResultFromPnl } from "@/lib/trading/risk";
import {
  createTradeAction,
  deleteTradeAction,
  updateTradeAction,
} from "@/app/(app)/journal/actions";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import type { Trade } from "@/lib/data/trades";
import type { Tables } from "@/lib/supabase/database.types";
import type { ChecklistItem } from "@/lib/trading/checklist";
import type { SetupGrade } from "@/lib/constants/enums";
import { SetupChecklistGate } from "@/components/trades/setup-checklist-gate";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function today() {
  return format(new Date(), "yyyy-MM-dd");
}

/** Watched RHF values are typed per the schema's *input* shape (unknown for
 * z.coerce fields, since they accept anything pre-coercion) — normalize to a
 * real number for the live risk/result/R calculations. */
function toNum(v: unknown): number | null {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function TradeForm({
  trade,
  modelRules = [],
  checklistItems = [],
}: {
  trade?: Trade;
  modelRules?: Tables<"model_rules">[];
  checklistItems?: ChecklistItem[];
}) {
  const router = useRouter();
  const isEdit = !!trade;

  const form = useForm({
    resolver: zodResolver(tradeFormSchema),
    defaultValues: trade
      ? {
          title: trade.title,
          date: trade.date,
          instrument: trade.instrument,
          direction: trade.direction,
          session: trade.session,
          models: trade.models ?? [],
          amd_phase: trade.amd_phase,
          bias_alignment: trade.bias_alignment,
          entry_price: trade.entry_price,
          stop_price: trade.stop_price,
          target_price: trade.target_price,
          exit_price: trade.exit_price,
          contracts: trade.contracts,
          risk_usd: trade.risk_usd,
          pnl_usd: trade.pnl_usd,
          result: trade.result,
          setup_grade: trade.setup_grade,
          followed_plan: trade.followed_plan,
          emotion: trade.emotion,
          mistakes: trade.mistakes ?? [],
          entry_reasoning: trade.entry_reasoning,
          lesson: trade.lesson,
          chart_url: trade.chart_url,
        }
      : {
          title: "",
          date: today(),
          instrument: "MNQ",
          direction: "Long",
          session: "NY AM",
          models: [],
          followed_plan: true,
          mistakes: [],
        },
  });

  const { watch, setValue, control, register, handleSubmit, formState } = form;
  const watched = watch([
    "instrument",
    "contracts",
    "entry_price",
    "stop_price",
    "pnl_usd",
    "risk_usd",
  ]);
  const instrument = watched[0] as TradeFormValues["instrument"];
  const contracts = toNum(watched[1]);
  const entryPrice = toNum(watched[2]);
  const stopPrice = toNum(watched[3]);
  const pnlUsd = toNum(watched[4]);
  const riskUsd = toNum(watched[5]);

  const [riskAuto, setRiskAuto] = React.useState(true);
  const [resultAuto, setResultAuto] = React.useState(true);

  React.useEffect(() => {
    if (!riskAuto) return;
    const computed = calcRiskUsd({ instrument, contracts, entryPrice, stopPrice });
    if (computed != null) setValue("risk_usd", computed, { shouldDirty: false });
  }, [riskAuto, instrument, contracts, entryPrice, stopPrice, setValue]);

  React.useEffect(() => {
    if (!resultAuto) return;
    const computed = calcResultFromPnl(pnlUsd);
    if (computed) setValue("result", computed, { shouldDirty: false });
  }, [resultAuto, pnlUsd, setValue]);

  const rMultiple = calcRMultiple(pnlUsd, riskUsd);

  const selectedModels = watch("models") ?? [];
  const selectedModelRules = modelRules.filter((r) => selectedModels.includes(r.model));

  async function onSubmit(values: TradeFormValues) {
    const crossFieldError = validateTradeCrossFields(values);
    if (crossFieldError) {
      form.setError("stop_price", { message: crossFieldError });
      return;
    }

    const res = isEdit
      ? await updateTradeAction(trade!.id, values)
      : await createTradeAction(values);

    if (!res.success) {
      toast.error(res.error ?? "Check the form for errors");
      return;
    }
    toast.success(isEdit ? "Trade updated" : "Trade logged");
    router.push("/journal");
    router.refresh();
  }

  async function onDelete() {
    if (!trade) return;
    const res = await deleteTradeAction(trade.id);
    if (!res.success) {
      toast.error(res.error ?? "Failed to delete");
      return;
    }
    toast.success("Trade deleted");
    router.push("/journal");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="glass-panel space-y-5 p-5">
        <FieldGroup>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field data-invalid={!!formState.errors.title}>
              <FieldLabel htmlFor="title">Trade title</FieldLabel>
              <FieldContent>
                <Input id="title" placeholder="e.g. NQ Judas reversal" {...register("title")} />
                <FieldError errors={[formState.errors.title]} />
              </FieldContent>
            </Field>

            <Field data-invalid={!!formState.errors.date}>
              <FieldLabel htmlFor="date">Date</FieldLabel>
              <FieldContent>
                <Input id="date" type="date" {...register("date")} />
                <FieldError errors={[formState.errors.date]} />
              </FieldContent>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Field>
              <FieldLabel>Instrument</FieldLabel>
              <FieldContent>
                <Controller
                  control={control}
                  name="instrument"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {INSTRUMENTS.map((v) => (
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
              <FieldLabel>Direction</FieldLabel>
              <FieldContent>
                <Controller
                  control={control}
                  name="direction"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DIRECTIONS.map((v) => (
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
              <FieldLabel>Session</FieldLabel>
              <FieldContent>
                <Controller
                  control={control}
                  name="session"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SESSIONS.map((v) => (
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
              <FieldLabel>AMD phase</FieldLabel>
              <FieldContent>
                <Controller
                  control={control}
                  name="amd_phase"
                  render={({ field }) => (
                    <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="—" />
                      </SelectTrigger>
                      <SelectContent>
                        {AMD_PHASES.map((v) => (
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
            <FieldLabel>Models / Setup</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="models"
                render={({ field }) => (
                  <ToggleGroup
                    multiple
                    variant="outline"
                    size="sm"
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex flex-wrap"
                  >
                    {MODELS.map((m) => (
                      <ToggleGroupItem key={m} value={m}>
                        {m}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                )}
              />
            </FieldContent>
          </Field>

          {selectedModelRules.length > 0 ? (
            <div className="space-y-1.5">
              {selectedModelRules.map((r) => (
                <div
                  key={r.id}
                  className="bg-primary/5 text-muted-foreground rounded-md px-3 py-1.5 text-xs"
                >
                  <span className="text-foreground font-medium">{r.model}:</span>{" "}
                  {r.default_contracts != null ? `${r.default_contracts} contracts, ` : ""}
                  {r.stop_min_points != null && r.stop_max_points != null
                    ? `${r.stop_min_points}–${r.stop_max_points}pt stop`
                    : ""}
                  {r.notes ? ` — ${r.notes}` : ""}
                </div>
              ))}
            </div>
          ) : null}
        </FieldGroup>
      </div>

      <div className="glass-panel space-y-5 p-5">
        <p className="label-muted">Execution</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Field>
            <FieldLabel htmlFor="entry_price">Entry</FieldLabel>
            <FieldContent>
              <Input
                id="entry_price"
                type="number"
                step="any"
                className="font-mono tabular-nums"
                {...register("entry_price")}
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="stop_price">Stop</FieldLabel>
            <FieldContent>
              <Input
                id="stop_price"
                type="number"
                step="any"
                className="font-mono tabular-nums"
                {...register("stop_price")}
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="target_price">Target</FieldLabel>
            <FieldContent>
              <Input
                id="target_price"
                type="number"
                step="any"
                className="font-mono tabular-nums"
                {...register("target_price")}
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="exit_price">Exit</FieldLabel>
            <FieldContent>
              <Input
                id="exit_price"
                type="number"
                step="any"
                className="font-mono tabular-nums"
                {...register("exit_price")}
              />
            </FieldContent>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Field>
            <FieldLabel htmlFor="contracts">Contracts</FieldLabel>
            <FieldContent>
              <Input
                id="contracts"
                type="number"
                step="any"
                className="font-mono tabular-nums"
                {...register("contracts")}
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="risk_usd" className="flex items-center justify-between">
              <span>Risk ($)</span>
            </FieldLabel>
            <FieldContent>
              <Input
                id="risk_usd"
                type="number"
                step="any"
                className="font-mono tabular-nums"
                {...register("risk_usd")}
                onChange={(e) => {
                  setRiskAuto(false);
                  form.setValue("risk_usd", e.target.value === "" ? null : Number(e.target.value));
                }}
              />
              <FieldError>
                {riskAuto ? (
                  <span className="text-muted-foreground">Auto from entry/stop/contracts</span>
                ) : (
                  <button
                    type="button"
                    className="text-primary underline"
                    onClick={() => setRiskAuto(true)}
                  >
                    Resume auto-calc
                  </button>
                )}
              </FieldError>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="pnl_usd">P&amp;L ($)</FieldLabel>
            <FieldContent>
              <Input
                id="pnl_usd"
                type="number"
                step="any"
                className="font-mono tabular-nums"
                {...register("pnl_usd")}
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>R multiple</FieldLabel>
            <FieldContent>
              <div
                className={
                  "border-input bg-muted/30 flex h-8 items-center rounded-lg border px-2.5 font-mono text-sm tabular-nums " +
                  (rMultiple == null
                    ? "text-muted-foreground"
                    : rMultiple >= 0
                      ? "text-profit"
                      : "text-loss")
                }
              >
                {rMultiple == null ? "—" : `${rMultiple > 0 ? "+" : ""}${rMultiple.toFixed(2)}R`}
              </div>
            </FieldContent>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field>
            <FieldLabel>Result</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="result"
                render={({ field }) => (
                  <Select
                    value={field.value ?? undefined}
                    onValueChange={(v) => {
                      setResultAuto(false);
                      field.onChange(v);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Auto from P&L" />
                    </SelectTrigger>
                    <SelectContent>
                      {RESULTS.map((v) => (
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
            <FieldLabel>Setup grade</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="setup_grade"
                render={({ field }) => (
                  <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="From checklist below" />
                    </SelectTrigger>
                    <SelectContent>
                      {SETUP_GRADES.map((v) => (
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
            <FieldLabel>Bias alignment</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="bias_alignment"
                render={({ field }) => (
                  <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="—" />
                    </SelectTrigger>
                    <SelectContent>
                      {BIAS_ALIGNMENTS.map((v) => (
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
          <FieldLabel htmlFor="followed_plan">Followed plan</FieldLabel>
          <Controller
            control={control}
            name="followed_plan"
            render={({ field }) => (
              <Switch id="followed_plan" checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
        </Field>
      </div>

      <SetupChecklistGate
        items={checklistItems}
        onGradeChange={(grade: SetupGrade | null) => setValue("setup_grade", grade, { shouldDirty: false })}
      />

      <div className="glass-panel space-y-5 p-5">
        <p className="label-muted">Psychology</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel>Emotion</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="emotion"
                render={({ field }) => (
                  <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="—" />
                    </SelectTrigger>
                    <SelectContent>
                      {EMOTIONS.map((v) => (
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
            <FieldLabel htmlFor="chart_url">Chart link</FieldLabel>
            <FieldContent>
              <Input id="chart_url" placeholder="https://..." {...register("chart_url")} />
            </FieldContent>
          </Field>
        </div>

        <Field>
          <FieldLabel>Mistakes</FieldLabel>
          <FieldContent>
            <Controller
              control={control}
              name="mistakes"
              render={({ field }) => (
                <ToggleGroup
                  multiple
                  variant="outline"
                  size="sm"
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex flex-wrap"
                >
                  {MISTAKES.map((m) => (
                    <ToggleGroupItem key={m} value={m}>
                      {m}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              )}
            />
          </FieldContent>
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="entry_reasoning">Entry reasoning</FieldLabel>
            <FieldContent>
              <Textarea id="entry_reasoning" rows={3} {...register("entry_reasoning")} />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="lesson">Lesson</FieldLabel>
            <FieldContent>
              <Textarea
                id="lesson"
                rows={3}
                placeholder="One line — what will you do differently?"
                {...register("lesson")}
              />
            </FieldContent>
          </Field>
        </div>
      </div>

      <div className="flex items-center justify-between">
        {isEdit ? (
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button type="button" variant="destructive" size="sm">
                  <Trash2 />
                  Delete
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this trade?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently removes the trade and its screenshots. This can&apos;t be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <span />
        )}

        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => router.push("/journal")}>
            Cancel
          </Button>
          <Button type="submit" disabled={formState.isSubmitting}>
            {formState.isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
            {isEdit ? "Save changes" : "Log trade"}
          </Button>
        </div>
      </div>
    </form>
  );
}
