import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { TradeForm } from "@/components/trades/trade-form";
import { ScreenshotUploader } from "@/components/trades/screenshot-uploader";
import { getTradeForEdit } from "@/lib/data/trades";
import { listModelRules } from "@/lib/data/account-settings";
import { listScreenshots } from "@/lib/data/screenshots";
import { getSetupChecklistItems } from "@/lib/data/theory";

export default async function EditTradePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [trade, modelRules, screenshots, checklistItems] = await Promise.all([
    getTradeForEdit(id),
    listModelRules(),
    listScreenshots(id),
    getSetupChecklistItems(),
  ]);
  if (!trade) notFound();

  return (
    <>
      <PageHeader title={`Edit — ${trade.title}`} description={trade.date ?? undefined} />
      <div className="space-y-6">
        <TradeForm trade={trade} modelRules={modelRules} checklistItems={checklistItems} />
        <ScreenshotUploader tradeId={trade.id} screenshots={screenshots} />
      </div>
    </>
  );
}
