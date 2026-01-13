import { useRuntimeConfig } from '#imports'
import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client (admin) bypasses RLS; use service key
export function useSupabaseAdmin() {
  const cfg = useRuntimeConfig()
  const url = cfg.public?.SUPABASE_URL as string
  const key = process.env.SUPABASE_SERVICE_KEY as string
  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY')
  }
  return createClient(String(url), String(key))
}

// Optional: client-side/anon client (respects RLS). Only use in server with anon key when needed.
export function useSupabaseAnon() {
  const cfg = useRuntimeConfig() as any
  const url = cfg.public?.SUPABASE_URL as string
  const key = cfg.public?.SUPABASE_ANON_KEY as string
  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY')
  }
  return createClient(String(url), String(key))
}
