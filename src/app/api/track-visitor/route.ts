import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

function getClientIP(request: NextRequest): string {
  // Try to get IP from various headers (for different deployment environments)
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")
  const cfConnectingIP = request.headers.get("cf-connecting-ip")

  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }

  if (realIP) {
    return realIP
  }

  if (cfConnectingIP) {
    return cfConnectingIP
  }

  // Fallback to connection remote address
  return "127.0.0.1"
}

export async function POST(request: NextRequest) {
  try {

    const ip_address = getClientIP(request)
    // const user_agent = request.headers.get("user-agent")
    // const referrer = request.headers.get("referer")

    const supabase = await createClient();
    // Insert visitor data
    const { data, error } = await supabase
      .from("visitors")
      .insert({
        created_at: new Date().toISOString(),
        ip_address,
        
      })
      .select()
      // user_agent,
        // referrer,
        // page_path: pagePath,

    if (error) {
      console.error("Error tracking visitor:", error)
      return NextResponse.json({ error: "Failed to track visitor" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error in track-visitor API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
