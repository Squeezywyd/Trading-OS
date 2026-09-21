"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { modelRuleFormSchema } from "@/lib/validation/settings";
import { MODELS } from "@/lib/constants/enums";
import { deleteModelRuleAction, saveModelRuleAction } from "@/app/(app)/settings/actions";
import type { Tables } from "@/lib/supabase/database.types";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function ModelRuleDialog({ rule, trigger }: { rule?: Tables<"model_rules">; trigger: React.ReactElement }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(modelRuleFormSchema),
    defaultValues: {
      model: rule?.model ?? MODELS[0],
      default_contracts: rule?.default_contracts ?? null,
      stop_min_points: rule?.stop_min_points ?? null,
      stop_max_points: rule?.stop_max_points ?? null,
      notes: rule?.notes ?? null,
    },
  });

  async function onSubmit(values: Record<string, unknown>) {
    const res = await saveModelRuleAction(values);
    if (!res.success) {
      toast.error(res.error ?? "Check the form for errors");
      return;
    }
    toast.success("Model rule saved");
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{rule ? `Edit — ${rule.model}` : "Add model rule"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel>Model</FieldLabel>
            <FieldContent>
              <Controller
                control={form.control}
                name="model"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange} disabled={!!rule}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {MODELS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
            </FieldContent>
          </Field>

          <div className="grid grid-cols-3 gap-3">
            <Field>
              <FieldLabel htmlFor="default_contracts">Contracts</FieldLabel>
              <FieldContent>
                <Input id="default_contracts" type="number" className="font-mono tabular-nums" {...form.register("default_contracts")} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="stop_min_points">Stop min</FieldLabel>
              <FieldContent>
                <Input id="stop_min_points" type="number" className="font-mono tabular-nums" {...form.register("stop_min_points")} />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="stop_max_points">Stop max</FieldLabel>
              <FieldContent>
                <Input id="stop_max_points" type="number" className="font-mono tabular-nums" {...form.register("stop_max_points")} />
              </FieldContent>
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="notes">Notes</FieldLabel>
            <FieldContent>
              <Textarea id="notes" rows={2} {...form.register("notes")} />
            </FieldContent>
          </Field>

          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ModelRulesManager({ rules }: { rules: Tables<"model_rules">[] }) {
  const router = useRouter();

  async function onDelete(id: string) {
    const res = await deleteModelRuleAction(id);
    if (!res.success) {
      toast.error(res.error ?? "Failed to delete");
      return;
    }
    toast.success("Rule removed");
    router.refresh();
  }

  return (
    <div className="glass-panel space-y-4 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="label-muted">Model Rules</p>
          <p className="text-muted-foreground mt-1 text-xs">
            Shown on the trade form when that model is selected.
          </p>
        </div>
        <ModelRuleDialog trigger={<Button size="sm" variant="outline"><Plus />Add rule</Button>} />
      </div>

      {rules.length === 0 ? (
        <p className="text-muted-foreground py-6 text-center text-sm">No model rules yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Model</TableHead>
              <TableHead className="text-right">Contracts</TableHead>
              <TableHead className="text-right">Stop range</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.model}</TableCell>
                <TableCell className="text-right font-mono tabular-nums">{r.default_contracts ?? "—"}</TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  {r.stop_min_points ?? "—"}–{r.stop_max_points ?? "—"}
                </TableCell>
                <TableCell className="flex justify-end gap-1">
                  <ModelRuleDialog rule={r} trigger={<Button size="icon-sm" variant="ghost"><Pencil className="size-3.5" /></Button>} />
                  <Button size="icon-sm" variant="ghost" onClick={() => onDelete(r.id)}>
                    <Trash2 className="text-loss size-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
