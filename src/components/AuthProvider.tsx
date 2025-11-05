"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient, Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  supabase: SupabaseClient;
  session: Session | null;
  status: AuthStatus;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    let mounted = true;

    const initialise = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      const currentSession = data.session ?? null;
      setSession(currentSession);
      setStatus(currentSession ? "authenticated" : "unauthenticated");
    };

    initialise();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, nextSession) => {
      setSession(nextSession);
      setStatus(nextSession ? "authenticated" : "unauthenticated");

      const shouldSyncCookie =
        event === "SIGNED_IN" ||
        event === "SIGNED_OUT" ||
        event === "TOKEN_REFRESHED";

      if (shouldSyncCookie) {
        try {
          await fetch("/auth/callback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ event, session: nextSession }),
          });
        } catch (error) {
          console.error("Failed to sync Supabase session cookie", error);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setStatus("unauthenticated");
  };

  const value = useMemo<AuthContextValue>(
    () => ({ supabase, session, status, signOut: handleSignOut }),
    [supabase, session, status]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
