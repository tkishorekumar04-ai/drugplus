"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { loginAction } from "@/lib/admin/actions";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(loginAction, undefined);
  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="next" value={next ?? "/admin"} />
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="username" required />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      {state?.error && <p role="alert" className="text-sm font-medium text-red-600">{state.error}</p>}
      <Button type="submit" className="w-full" disabled={pending}>{pending && <Loader2 className="animate-spin" />} Sign in</Button>
    </form>
  );
}
