import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client with the SERVICE ROLE key – full power, SERVER ONLY.
 * Used only to create login accounts for new team members.
 * The key must never start with NEXT_PUBLIC_ (that would expose it).
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
