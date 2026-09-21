"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { deleteScreenshotAction } from "@/app/(app)/journal/actions";

interface ScreenshotRow {
  id: string;
  kind: "before" | "after";
  storage_path: string;
  url: string | null;
}

function Slot({
  kind,
  tradeId,
  existing,
}: {
  kind: "before" | "after";
  tradeId: string;
  existing: ScreenshotRow[];
}) {
  const router = useRouter();
  const [uploading, setUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const shots = existing.filter((s) => s.kind === kind);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setUploading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const ext = file.name.split(".").pop() ?? "png";
      const path = `${user.id}/${tradeId}/${kind}-${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage.from("screenshots").upload(path, file, {
        contentType: file.type,
      });
      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase.from("trade_screenshots").insert({
        trade_id: tradeId,
        kind,
        storage_path: path,
      });
      if (insertError) throw insertError;

      toast.success(`${kind === "before" ? "Before" : "After"} screenshot uploaded`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onDelete(shot: ScreenshotRow) {
    const res = await deleteScreenshotAction(shot.id, shot.storage_path, tradeId);
    if (!res.success) {
      toast.error(res.error ?? "Failed to delete");
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <p className="label-muted mb-2">{kind === "before" ? "Before" : "After"}</p>
      <div className="grid grid-cols-2 gap-2">
        {shots.map((shot) => (
          <div key={shot.id} className="group relative aspect-video overflow-hidden rounded-lg border border-border/60">
            {shot.url ? (
              <Image src={shot.url} alt={`${kind} screenshot`} fill className="object-cover" unoptimized />
            ) : null}
            <button
              type="button"
              onClick={() => onDelete(shot)}
              className="bg-background/80 text-loss absolute top-1 right-1 rounded-md p-1 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"
              aria-label="Delete screenshot"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="border-border/60 hover:border-border text-muted-foreground hover:text-foreground flex aspect-video flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-xs transition-colors"
        >
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          {uploading ? "Uploading..." : "Add image"}
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
      </div>
    </div>
  );
}

export function ScreenshotUploader({
  tradeId,
  screenshots,
}: {
  tradeId: string;
  screenshots: ScreenshotRow[];
}) {
  // router.refresh() (called after every upload/delete) re-fetches the
  // server component above us, which passes fresh `screenshots` back down —
  // no local mirror of this prop needed.
  return (
    <div className="glass-panel space-y-4 p-5">
      <p className="label-muted">Screenshots</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Slot kind="before" tradeId={tradeId} existing={screenshots} />
        <Slot kind="after" tradeId={tradeId} existing={screenshots} />
      </div>
    </div>
  );
}

export function NewTradeScreenshotHint() {
  return (
    <div className="glass-panel p-5 text-center">
      <p className="text-muted-foreground text-sm">Save the trade first to attach before/after screenshots.</p>
    </div>
  );
}
