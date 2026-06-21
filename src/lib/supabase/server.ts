import { env } from "@/env"
import { createServerClient } from "@supabase/ssr"
import { createClient as createDefaultClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

const supabaseUrl = env.SUPABASE_URL
const supabaseKey = env.SUPABASE_PUBLISHABLE_KEY
const supabaseRoleKey = env.SUPABASE_SERVICE_ROLE_KEY

export const createClient = (
  cookieStore: Awaited<ReturnType<typeof cookies>>,
) => {
  return createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(
        cookiesToSet: {
          name: string
          value: string
          options?: { [key: string]: unknown }
        }[],
      ) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          )
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

export const supabaseAdminClient = createDefaultClient(
  supabaseUrl!,
  supabaseRoleKey!,
)
