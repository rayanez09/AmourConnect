'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getMessages, markMessagesAsRead, purgeExpiredMessages } from '@/services/messages'
import { useNotificationStore } from '@/store'
import type { MessageWithSender } from '@/types'

export function useRealtimeMessages(matchId: string, currentUserId: string) {
    const [messages, setMessages] = useState<MessageWithSender[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { clearUnreadForMatch, setUnreadForMatch } = useNotificationStore()

    // Stable refs to avoid stale closures inside realtime callbacks
    const matchIdRef = useRef(matchId)
    const userIdRef = useRef(currentUserId)
    useEffect(() => { matchIdRef.current = matchId }, [matchId])
    useEffect(() => { userIdRef.current = currentUserId }, [currentUserId])

    // ── Initial load ──────────────────────────────────────────────────────────
    const loadMessages = useCallback(async () => {
        if (!matchId || !currentUserId) return
        setIsLoading(true)

        // 1. Client-side purge of messages older than 24h (fallback for pg_cron)
        await purgeExpiredMessages(matchId)

        // 2. Fetch remaining messages
        const data = await getMessages(matchId)
        setMessages(data)

        // 3. Mark as read + clear unread badge for this conversation
        await markMessagesAsRead(matchId, currentUserId)
        clearUnreadForMatch(matchId)

        setIsLoading(false)
    }, [matchId, currentUserId, clearUnreadForMatch])

    useEffect(() => {
        if (!matchId || !currentUserId) return
        loadMessages()
    }, [loadMessages, matchId, currentUserId])

    // ── Realtime subscription ─────────────────────────────────────────────────
    useEffect(() => {
        if (!matchId || !currentUserId) return
        const supabase = createClient()

        const channel = supabase
            .channel(`conv:${matchId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `match_id=eq.${matchId}`,
                },
                async (payload) => {
                    const newMsg = payload.new as MessageWithSender

                    // Enrich with sender profile
                    const { data: sender } = await supabase
                        .from('profiles')
                        .select('id, full_name, avatar_url')
                        .eq('user_id', newMsg.sender_id)
                        .single()

                    const enriched: MessageWithSender = { ...newMsg, sender: sender! }
                    setMessages((prev) => {
                        // Deduplicate (realtime can fire twice in strict mode)
                        if (prev.some((m) => m.id === enriched.id)) return prev
                        return [...prev, enriched]
                    })

                    // If message is from someone else: mark read immediately (we're in the convo)
                    if (newMsg.sender_id !== userIdRef.current) {
                        await markMessagesAsRead(matchIdRef.current, userIdRef.current)
                        clearUnreadForMatch(matchIdRef.current)
                    }
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'messages',
                    filter: `match_id=eq.${matchId}`,
                },
                (payload) => {
                    // Update read_at in place (for read receipts)
                    const updated = payload.new as MessageWithSender
                    setMessages((prev) =>
                        prev.map((m) => (m.id === updated.id ? { ...m, ...updated } : m))
                    )
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'messages',
                    filter: `match_id=eq.${matchId}`,
                },
                (payload) => {
                    // Remove expired/deleted messages from UI
                    const deleted = payload.old as { id: string }
                    setMessages((prev) => prev.filter((m) => m.id !== deleted.id))
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [matchId, currentUserId, clearUnreadForMatch])

    return { messages, isLoading, reload: loadMessages }
}
