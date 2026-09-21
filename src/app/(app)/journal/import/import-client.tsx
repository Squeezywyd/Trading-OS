"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Upload, FileWarning } from "lucide-react";
import { parseTradeCsv, type CsvImportRow } from "@/lib/trading/csv";
import { importTradesAction } from "../actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ImportCsvClient() {
  const router = useRouter();
  const [rows, setRows] = React.useState<CsvImportRow[]>([]);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [importing, setImporting] = React.useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const text = await file.text();
    setRows(parseTradeCsv(text));
  }

  const validRows = rows.filter((r) => r.errors.length === 0);
  const invalidRows = rows.filter((r) => r.errors.length > 0);

  async function onImport() {
    setImporting(true);
    try {
      const result = await importTradesAction(
        validRows.map((r) => ({ rowNumber: r.rowNumber, values: r.values })),
      );
      if (result.imported > 0) {
        toast.success(`Imported ${result.imported} trade${result.imported === 1 ? "" : "s"}`);
      }
      if (result.failed.length > 0) {
        toast.error(`${result.failed.length} row(s) failed — see console for details`);
        console.error("Import failures", result.failed);
      }
      if (result.imported > 0) {
        router.push("/journal");
        router.refresh();
      }
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="glass-panel flex flex-col items-center gap-3 p-8 text-center">
        <Upload className="text-muted-foreground size-8" />
        <div>
          <p className="text-sm font-medium">{fileName ?? "Choose a CSV file"}</p>
          <p className="text-muted-foreground text-xs">
            Exported from Trade Journal or hand-built with matching column headers
          </p>
        </div>
        <label>
          <input type="file" accept=".csv,text/csv" className="hidden" onChange={onFile} />
          <span className="border-input bg-background hover:bg-muted inline-flex h-8 cursor-pointer items-center rounded-lg border px-3 text-sm transition-colors">
            Browse files
          </span>
        </label>
      </div>

      {rows.length > 0 ? (
        <div className="glass-panel p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="text-profit">{validRows.length} ready</Badge>
              {invalidRows.length > 0 ? (
                <Badge variant="outline" className="text-loss">
                  <FileWarning className="mr-1 size-3" />
                  {invalidRows.length} invalid
                </Badge>
              ) : null}
            </div>
            <Button onClick={onImport} disabled={importing || validRows.length === 0}>
              {importing ? <Loader2 className="size-4 animate-spin" /> : null}
              Import {validRows.length} trade{validRows.length === 1 ? "" : "s"}
            </Button>
          </div>

          {invalidRows.length > 0 ? (
            <div className="max-h-64 overflow-y-auto text-xs">
              {invalidRows.map((r) => (
                <div key={r.rowNumber} className="text-loss border-border/40 border-b py-1">
                  Row {r.rowNumber}: {r.errors.join(", ")}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
