import { createClient } from "@supabase/supabase-js"

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  (import.meta.env.DEV ? "http://127.0.0.1:54321" : undefined)

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase environment variables are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or VITE_SUPABASE_PUBLISHABLE_KEY). For local Supabase, run `supabase status` and copy the local API URL and anon key."
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
