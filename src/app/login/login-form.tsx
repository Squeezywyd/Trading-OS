"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Mail, KeyRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";

const passwordSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const magicLinkSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
});

type Mode = "password" | "magic-link";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";

  const [mode, setMode] = React.useState<Mode>("password");
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = React.useState(false);

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { email: "", password: "" },
  });

  const magicLinkForm = useForm<z.infer<typeof magicLinkSchema>>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: { email: "" },
  });

  async function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
    setServerError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword(values);
    if (error) {
      setServerError(error.message);
      return;
    }
    router.push(next);
    router.refresh();
  }

  async function onMagicLinkSubmit(values: z.infer<typeof magicLinkSchema>) {
    setServerError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: values.email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      setServerError(error.message);
      return;
    }
    setMagicLinkSent(true);
  }

  return (
    <div className="space-y-5">
      <div className="bg-muted flex gap-1 rounded-lg p-1">
        <button
          type="button"
          onClick={() => setMode("password")}
          className={cn(
            "flex-1 rounded-md py-1.5 text-sm font-medium transition-colors",
            mode === "password"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <KeyRound className="mr-1.5 inline size-3.5" />
          Password
        </button>
        <button
          type="button"
          onClick={() => setMode("magic-link")}
          className={cn(
            "flex-1 rounded-md py-1.5 text-sm font-medium transition-colors",
            mode === "magic-link"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Mail className="mr-1.5 inline size-3.5" />
          Magic Link
        </button>
      </div>

      {mode === "password" ? (
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!passwordForm.formState.errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <FieldContent>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...passwordForm.register("email")}
                />
                <FieldError errors={[passwordForm.formState.errors.email]} />
              </FieldContent>
            </Field>

            <Field data-invalid={!!passwordForm.formState.errors.password}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <FieldContent>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...passwordForm.register("password")}
                />
                <FieldError errors={[passwordForm.formState.errors.password]} />
              </FieldContent>
            </Field>

            {serverError ? <p className="text-destructive text-sm">{serverError}</p> : null}

            <Button type="submit" className="w-full" disabled={passwordForm.formState.isSubmitting}>
              {passwordForm.formState.isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              Sign in
            </Button>
          </FieldGroup>
        </form>
      ) : magicLinkSent ? (
        <div className="py-4 text-center">
          <p className="text-sm font-medium">Check your inbox</p>
          <FieldDescription className="mt-1">
            We sent a sign-in link to your email. It expires shortly, so use it soon.
          </FieldDescription>
        </div>
      ) : (
        <form onSubmit={magicLinkForm.handleSubmit(onMagicLinkSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!magicLinkForm.formState.errors.email}>
              <FieldLabel htmlFor="magic-email">Email</FieldLabel>
              <FieldContent>
                <Input
                  id="magic-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...magicLinkForm.register("email")}
                />
                <FieldError errors={[magicLinkForm.formState.errors.email]} />
              </FieldContent>
            </Field>

            {serverError ? <p className="text-destructive text-sm">{serverError}</p> : null}

            <Button
              type="submit"
              className="w-full"
              disabled={magicLinkForm.formState.isSubmitting}
            >
              {magicLinkForm.formState.isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              Send magic link
            </Button>
          </FieldGroup>
        </form>
      )}
    </div>
  );
}
