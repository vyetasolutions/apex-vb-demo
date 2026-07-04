import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// In demo mode (default) we deliberately avoid requiring real Supabase
// credentials so the app runs standalone. Once you flip
// NEXT_PUBLIC_DEMO_MODE=false and set real credentials in .env.local,
// every wallet/game/redemption action in src/lib/store.ts starts writing
// through to Postgres via the client below.
export const supabase: SupabaseClient | null =
  !isDemoMode && url && anonKey ? createClient(url, anonKey) : null;
