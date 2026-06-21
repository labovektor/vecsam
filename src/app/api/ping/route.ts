import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function GET() {
  const c = await cookies()
  const supabase = createClient(c)
  try {
    await supabase.storage.listBuckets()
    return Response.json({
      status: "Success",
    })
  } catch (error) {
    return Response.json({
      status: "Failed",
    })
  }
}
