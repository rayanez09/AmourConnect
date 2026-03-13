'use client'

import { useAuth } from '@/hooks/useAuth'
import { useUnreadCounts } from '@/hooks/useUnreadCounts'

/**
 * Invisible component mounted at layout level.
 * Handles:
 * 1. Hydrating auth profile from session
 * 2. Seeding and maintaining per-match unread counts
 */
export function AppInitializer() {
    useAuth()
    useUnreadCounts()
    return null
}
