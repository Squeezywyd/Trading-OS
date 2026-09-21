import { PageHeader } from "@/components/page-header";
import { TradeForm } from "@/components/trades/trade-form";
import { NewTradeScreenshotHint } from "@/components/trades/screenshot-uploader";
import { listModelRules } from "@/lib/data/account-settings";
import { getSetupChecklistItems } from "@/lib/data/theory";

export default async function NewTradePage() {
  const [modelRules, checklistItems] = await Promise.all([
    listModelRules(),
    getSetupChecklistItems(),
  ]);

  return (
    <>
      <PageHeader title="Log a trade" description="Fast entry — risk and result auto-compute as you type." />
      <div className="space-y-6">
        <TradeForm modelRules={modelRules} checklistItems={checklistItems} />
        <NewTradeScreenshotHint />
      </div>
    </>
  );
}
