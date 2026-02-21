'use client'

/**
 * useUnreadCounts
 *
 * Global hook mounted once at layout level.
 * - On mount: fetches per-match unread counts and seeds the store
 * - Sets up a Realtime subscription on ALL matches the user is in
 * - When a new message arrives from someone else: bumps that match's unread in the store
 * - When entering a conversation, the conversation page clears its own count
 */

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getUnreadPerMatch } from '@/services/messages'
import { useNotificationStore } from '@/store'
import { useAuthStore } from '@/store'

export function useUnreadCounts() {
    const { profile } = useAuthStore()
    const { setAllUnread, incrementUnreadForMatch } = useNotificationStore()

    // Track the list of match IDs the user is in (for realtime filter)
    const matchIdsRef = useRef<string[]>([])

    useEffect(() => {
        if (!profile?.user_id || !profile?.id) return

        const userId = profile.user_id
        const profileId = profile.id
        const supabase = createClient()
        let channel: ReturnType<typeof supabase.channel> | null = null

        async function init() {
            // 1. Get all match IDs for this user
            const { data: matches } = await supabase
                .from('matches')
                .select('id')
                .or(`user1_id.eq.${profileId},user2_id.eq.${profileId}`)

            const matchIds = (matches ?? []).map((m: { id: string }) => m.id)
            matchIdsRef.current = matchIds

            // 2. Seed the store with current unread counts
            const counts = await getUnreadPerMatch(userId, profileId)
            setAllUnread(counts)

            if (!matchIds.length) return

            // 3. Subscribe to new messages on ALL user's matches
            channel = supabase
                .channel(`global-unread:${userId}`)
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'messages',
                    },
                    (payload) => {
                        const msg = payload.new as {
                            match_id: string
                            sender_id: string
                            read_at: string | null
                        }

                        // Only care about messages in our matches, from someone else
                        if (
                            matchIdsRef.current.includes(msg.match_id) &&
                            msg.sender_id !== userId &&
                            !msg.read_at
                        ) {
                            incrementUnreadForMatch(msg.match_id)
                        }
                    }
                )
                .subscribe()
        }

        init()

        return () => {
            if (channel) {
                supabase.removeChannel(channel)
            }
        }
    }, [profile?.user_id, profile?.id, setAllUnread, incrementUnreadForMatch])
}
