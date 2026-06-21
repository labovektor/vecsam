import { env } from "@/env"

export async function GET() {
  return Response.json({
    supabaseUrl: env.SUPABASE_URL,
    supabaseKey: env.SUPABASE_PUBLISHABLE_KEY,
  })
}
