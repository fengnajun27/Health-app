"use client";

import { useEffect, useState } from "react";
import { LoginForm } from "@/components/LoginForm";
import { HomeDashboard } from "@/components/HomeDashboard";
import { AUTH_CHANGE_EVENT, getStoredUser } from "@/lib/storage";
import type { StoredUser } from "@/lib/types";

export default function HomePage() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setUser(getStoredUser());
    sync();
    setReady(true);
    window.addEventListener(AUTH_CHANGE_EVENT, sync);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, sync);
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-400">加载中…</p>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onSuccess={setUser} />;
  }

  return <HomeDashboard user={user} onLogout={() => setUser(null)} />;
}
