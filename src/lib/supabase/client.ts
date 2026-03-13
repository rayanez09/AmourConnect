'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Module-level singleton to avoid LockManager timeouts
export const supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        // @ts-ignore - Bypassing NavigatorLock to avoid persistent timeouts in dev/browser environments
        lock: (name: string, acquireTimeout: number, fn: () => Promise<any>) => fn(),
    },
})

export function createClient() {
    return supabase
}
