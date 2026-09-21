import { PageHeader } from "@/components/page-header";
import { TradesTable } from "@/components/trades/trades-table";
import { listTrades } from "@/lib/data/trades";

export default async function TradeJournalPage() {
  const trades = await listTrades();

  return (
    <>
      <PageHeader
        title="Trade Journal"
        description="Every logged trade, filterable by session, model, instrument, and result."
      />
      <TradesTable trades={trades} />
    </>
  );
}
