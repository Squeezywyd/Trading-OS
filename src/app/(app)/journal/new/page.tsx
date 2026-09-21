import { PageHeader } from "@/components/page-header";
import { TradeForm } from "@/components/trades/trade-form";

export default function NewTradePage() {
  return (
    <>
      <PageHeader title="Log a trade" description="Fast entry — risk and result auto-compute as you type." />
      <TradeForm />
    </>
  );
}
