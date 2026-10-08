import { getSettings } from "@/lib/settings";
import { PageTitle } from "@/components/admin/ui";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function SettingsPage() {
  const s = await getSettings();
  return (
    <>
      <PageTitle title="Settings" description="Company details, contact numbers, WhatsApp, homepage content and SEO defaults." />
      <SettingsForm settings={s} />
      <p className="mt-6 text-xs text-ink-subtle">API keys and integrations (analytics, CRM, Turnstile) are configured through environment variables and are never stored in the database.</p>
    </>
  );
}
