import { LoginForm } from "@/components/admin/login-form";
import { Logo } from "@/components/layout/logo";
import { getSettings } from "@/lib/settings";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const [s, sp] = await Promise.all([getSettings(), searchParams]);
  return (
    <main className="grid min-h-screen place-items-center bg-navy-950 px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-glow">
        <Logo name={s.company.name} logoUrl={s.company.logoUrl} />
        <h1 className="mt-8 text-2xl font-bold text-navy-950">Sign in</h1>
        <p className="mt-1 text-sm text-ink-muted">Website administration</p>
        <LoginForm next={sp.next} />
      </div>
    </main>
  );
}
