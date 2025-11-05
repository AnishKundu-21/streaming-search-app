import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function getSupabaseRouteClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}

export async function getRouteUser() {
  const supabase = await getSupabaseRouteClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return { supabase, user, error };
}
