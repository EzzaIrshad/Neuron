import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export type Database = {
  public: {
    Tables: {
      visitors: {
        Row: {
          id: string
          created_at: string
          ip_address: string
        }
        Insert: {
          id?: string
          created_at?: string
          ip_address: string
        }
        Update: {
          id?: string
          created_at?: string
          ip_address?: string
        }
      }
    }
  }
}