"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { theoryDocFormSchema } from "@/lib/validation/theory";
import { updateTheoryDocAction } from "@/app/(app)/theory/actions";
import type { Tables } from "@/lib/supabase/database.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";

export function TheoryEditor({ doc }: { doc: Tables<"theory_docs"> }) {
  const [open, setOpen] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(theoryDocFormSchema),
    defaultValues: {
      slug: doc.slug,
      title: doc.title,
      category: doc.category,
      priority: doc.priority,
      use_for: doc.use_for,
      summary: doc.summary,
      body_md: doc.body_md,
    },
  });

  const { register, handleSubmit, formState } = form;

  async function onSubmit(values: Record<string, unknown>) {
    const res = await updateTheoryDocAction(doc.id, doc.slug, values);
    if (!res.success) {
      toast.error(res.error ?? "Check the form for errors");
      return;
    }
    toast.success("Saved");
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="outline" size="sm">
            <Pencil />
            Edit
          </Button>
        }
      />
      <SheetContent side="right" className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Edit — {doc.title}</SheetTitle>
          <SheetDescription>Changes save to your Theory Library immediately.</SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col gap-4 overflow-y-auto px-4"
        >
          <Field>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <FieldContent>
              <Input id="title" {...register("title")} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="summary">Summary</FieldLabel>
            <FieldContent>
              <Textarea id="summary" rows={2} {...register("summary")} />
            </FieldContent>
          </Field>

          <Field className="flex-1">
            <FieldLabel htmlFor="body_md">Body (Markdown)</FieldLabel>
            <FieldContent className="flex-1">
              <Textarea
                id="body_md"
                rows={20}
                className="min-h-[50vh] font-mono text-xs"
                {...register("body_md")}
              />
            </FieldContent>
          </Field>
        </form>

        <SheetFooter>
          <SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
          <Button onClick={handleSubmit(onSubmit)} disabled={formState.isSubmitting}>
            {formState.isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
            Save
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
