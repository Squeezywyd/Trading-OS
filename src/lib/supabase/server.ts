import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

/**
 * Server Component / Server Action / Route Handler client. Reads the current
 * user's session from cookies via middleware-refreshed tokens.
 *
 * Cookie writes here can throw when called from a Server Component (cookies
 * are read-only there) — safe to ignore because middleware already refreshes
 * the session on every request.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a Server Component — middleware handles refresh.
          }
        },
      },
    },
  );
}
