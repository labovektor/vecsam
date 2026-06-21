import { createBrowserClient } from "@supabase/ssr"

let cachedPromise: Promise<ReturnType<typeof createBrowserClient>> | null = null

export async function createClient() {
  if (!cachedPromise) {
    cachedPromise = (async () => {
      const res = await fetch("/api/config")
      const { supabaseUrl, supabaseKey } = await res.json()
      return createBrowserClient(supabaseUrl, supabaseKey)
    })()
  }
  return cachedPromise
}
