'use client'

import { useUnreadCounts } from '@/hooks/useUnreadCounts'

/**
 * Invisible component mounted at layout level.
 * Seeds and maintains per-match unread counts in the global store.
 */
export function UnreadInitializer() {
    useUnreadCounts()
    return null
}
