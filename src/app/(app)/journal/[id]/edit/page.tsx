import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { TradeForm } from "@/components/trades/trade-form";
import { getTradeForEdit } from "@/lib/data/trades";
import { listModelRules } from "@/lib/data/account-settings";

export default async function EditTradePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [trade, modelRules] = await Promise.all([getTradeForEdit(id), listModelRules()]);
  if (!trade) notFound();

  return (
    <>
      <PageHeader title={`Edit — ${trade.title}`} description={trade.date ?? undefined} />
      <TradeForm trade={trade} modelRules={modelRules} />
    </>
  );
}
