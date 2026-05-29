"use client";

import { useEffect, useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { AUTH_CHANGE_EVENT, getStoredUser } from "@/lib/storage";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const sync = () => setLoggedIn(!!getStoredUser());
    sync();
    window.addEventListener(AUTH_CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
    <>
      <main
        className={`mx-auto min-h-screen max-w-lg ${loggedIn ? "pb-20" : ""}`}
      >
        {children}
      </main>
      {loggedIn && <BottomNav />}
    </>
  );
}
