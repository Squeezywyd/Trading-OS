import { PageHeader } from "@/components/page-header";
import { AccountSettingsForm } from "@/components/settings/account-settings-form";
import { ModelRulesManager } from "@/components/settings/model-rules-manager";
import { getAccountSettings, listModelRules } from "@/lib/data/account-settings";

export default async function SettingsPage() {
  const [settings, rules] = await Promise.all([getAccountSettings(), listModelRules()]);

  return (
    <>
      <PageHeader title="Settings" description="Prop account rules and per-model defaults." />
      <div className="space-y-6">
        <AccountSettingsForm settings={settings} />
        <ModelRulesManager rules={rules} />
      </div>
    </>
  );
}
