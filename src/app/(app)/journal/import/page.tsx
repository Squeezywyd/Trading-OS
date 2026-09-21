import { PageHeader } from "@/components/page-header";
import { ImportCsvClient } from "./import-client";

export default function ImportTradesPage() {
  return (
    <>
      <PageHeader
        title="Import trades"
        description={`CSV columns: ${"title,date,instrument,direction,session,models,amd_phase,bias_alignment,entry_price,stop_price,target_price,exit_price,contracts,risk_usd,pnl_usd,result,setup_grade,followed_plan,emotion,mistakes,entry_reasoning,lesson,chart_url"}`}
      />
      <ImportCsvClient />
    </>
  );
}
