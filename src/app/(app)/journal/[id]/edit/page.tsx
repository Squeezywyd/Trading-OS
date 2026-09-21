import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { TradeForm } from "@/components/trades/trade-form";
import { getTradeForEdit } from "@/lib/data/trades";

export default async function EditTradePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trade = await getTradeForEdit(id);
  if (!trade) notFound();

  return (
    <>
      <PageHeader title={`Edit — ${trade.title}`} description={trade.date ?? undefined} />
      <TradeForm trade={trade} />
    </>
  );
}
