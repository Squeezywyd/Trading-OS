import { z } from "zod";
import { zTheoryCategory, zTheoryPriority, zTheoryUseFor } from "./enums";

export const theoryDocFormSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "lowercase, hyphenated, no spaces"),
  title: z.string().trim().min(1).max(200),
  category: zTheoryCategory,
  priority: zTheoryPriority.default("Secondary"),
  use_for: z.array(zTheoryUseFor).default([]),
  summary: z.string().max(500).nullable().optional(),
  body_md: z.string().min(1),
});

export type TheoryDocFormValues = z.infer<typeof theoryDocFormSchema>;

export const checklistStateSchema = z.object({
  theory_doc_id: z.string().uuid(),
  item_key: z.string().min(1).max(200),
  checked: z.boolean(),
});
