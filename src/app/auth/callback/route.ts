import { NextResponse, type NextRequest } from "next/server";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseRouteClient } from "@/lib/supabase-route";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";
  const errorDescription = requestUrl.searchParams.get("error_description");

  if (code) {
    const supabase = await getSupabaseRouteClient();
    try {
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error) {
      console.error("Supabase code exchange failed", error);
      const params = new URLSearchParams({ error: "auth-exchange-failed" });
      return NextResponse.redirect(
        new URL(`/auth/signin?${params}`, requestUrl.origin)
      );
    }
  }

  if (errorDescription) {
    const params = new URLSearchParams({ error: errorDescription });
    return NextResponse.redirect(
      new URL(`/auth/signin?${params}`, requestUrl.origin)
    );
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}

export async function POST(request: NextRequest) {
  const supabase = await getSupabaseRouteClient();
  const { event, session } = (await request.json()) as {
    event: string;
    session: Session | null;
  };

  if (event === "SIGNED_OUT") {
    await supabase.auth.signOut();
    return NextResponse.json({ ok: true });
  }

  if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
    if (session) {
      await supabase.auth.setSession(session);
    }
  }

  return NextResponse.json({ ok: true });
}
