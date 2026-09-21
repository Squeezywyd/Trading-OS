"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { accountSettingsFormSchema } from "@/lib/validation/settings";
import { DRAWDOWN_TYPES } from "@/lib/constants/enums";
import { saveAccountSettingsAction } from "@/app/(app)/settings/actions";
import type { Tables } from "@/lib/supabase/database.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";

const DRAWDOWN_LABELS: Record<string, string> = {
  static: "Static",
  trailing: "Trailing",
  eod_trailing: "End-of-day trailing",
};

export function AccountSettingsForm({ settings }: { settings: Tables<"account_settings"> | null }) {
  const form = useForm({
    resolver: zodResolver(accountSettingsFormSchema),
    defaultValues: {
      account_name: settings?.account_name ?? null,
      starting_balance_usd: settings?.starting_balance_usd ?? null,
      profit_target_usd: settings?.profit_target_usd ?? null,
      daily_loss_limit_usd: settings?.daily_loss_limit_usd ?? null,
      max_drawdown_usd: settings?.max_drawdown_usd ?? null,
      drawdown_type: settings?.drawdown_type ?? null,
      consistency_rule_pct: settings?.consistency_rule_pct ?? null,
      max_contracts: settings?.max_contracts ?? null,
      timezone: settings?.timezone ?? "America/New_York",
    },
  });

  const { control, register, handleSubmit, formState } = form;

  async function onSubmit(values: Record<string, unknown>) {
    const res = await saveAccountSettingsAction(values);
    if (!res.success) {
      toast.error(res.error ?? "Check the form for errors");
      return;
    }
    toast.success("Settings saved");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="glass-panel space-y-5 p-5">
      <div>
        <p className="label-muted">Prop Account Rules</p>
        <p className="text-muted-foreground mt-1 text-xs">
          Enter your real numbers — nothing here is pre-filled.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="account_name">Account name</FieldLabel>
          <FieldContent>
            <Input id="account_name" placeholder="e.g. LucidFlex 50K" {...register("account_name")} />
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel htmlFor="starting_balance_usd">Starting balance ($)</FieldLabel>
          <FieldContent>
            <Input id="starting_balance_usd" type="number" step="any" className="font-mono tabular-nums" {...register("starting_balance_usd")} />
          </FieldContent>
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field>
          <FieldLabel htmlFor="profit_target_usd">Profit target ($)</FieldLabel>
          <FieldContent>
            <Input id="profit_target_usd" type="number" step="any" className="font-mono tabular-nums" {...register("profit_target_usd")} />
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel htmlFor="daily_loss_limit_usd">Daily loss limit ($)</FieldLabel>
          <FieldContent>
            <Input id="daily_loss_limit_usd" type="number" step="any" className="font-mono tabular-nums" {...register("daily_loss_limit_usd")} />
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel htmlFor="max_drawdown_usd">Max drawdown ($)</FieldLabel>
          <FieldContent>
            <Input id="max_drawdown_usd" type="number" step="any" className="font-mono tabular-nums" {...register("max_drawdown_usd")} />
          </FieldContent>
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field>
          <FieldLabel>Drawdown type</FieldLabel>
          <FieldContent>
            <Controller
              control={control}
              name="drawdown_type"
              render={({ field }) => (
                <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="—" /></SelectTrigger>
                  <SelectContent>
                    {DRAWDOWN_TYPES.map((v) => (
                      <SelectItem key={v} value={v}>{DRAWDOWN_LABELS[v]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel htmlFor="consistency_rule_pct">Consistency rule (%)</FieldLabel>
          <FieldContent>
            <Input id="consistency_rule_pct" type="number" step="any" className="font-mono tabular-nums" {...register("consistency_rule_pct")} />
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel htmlFor="max_contracts">Max contracts</FieldLabel>
          <FieldContent>
            <Input id="max_contracts" type="number" step="1" className="font-mono tabular-nums" {...register("max_contracts")} />
          </FieldContent>
        </Field>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
          Save
        </Button>
      </div>
    </form>
  );
}
