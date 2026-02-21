// @ts-nocheck
'use client'

import { createClient } from '@/lib/supabase/client'
import type { Message, MessageWithSender } from '@/types'

// ─── Fetch messages for a conversation ────────────────────────────────────────

export async function getMessages(matchId: string): Promise<MessageWithSender[]> {
    if (!matchId) return []
    const supabase = createClient()

    // 1. Fetch raw messages (no join)
    const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true })

    if (error) {
        console.error('[getMessages] error getting messages:', error.message)
        return []
    }

    if (!messages || messages.length === 0) return []

    // 2. Fetch profiles for all distinct sender_ids
    const senderIds = Array.from(new Set(messages.map(m => m.sender_id)))
    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, user_id, full_name, avatar_url')
        .in('user_id', senderIds)

    if (profilesError) {
        console.error('[getMessages] error getting profiles:', profilesError.message)
        // Return without sender profile if profiles fail, though type requires it
    }

    // 3. Map sender data into messages
    const profileMap = new Map(profiles?.map(p => [p.user_id, p]))

    return messages.map(msg => ({
        ...msg,
        sender: profileMap.get(msg.sender_id) || { id: msg.sender_id, full_name: 'Unknown', avatar_url: null }
    })) as MessageWithSender[]
}

// ─── Send a message ───────────────────────────────────────────────────────────

export async function sendMessage(
    matchId: string,
    senderId: string,
    content: string,
    type: 'text' | 'location' = 'text'
): Promise<{ data: Message | null; error: string | null }> {
    if (!matchId || !senderId || !content.trim()) {
        return { data: null, error: 'Paramètres manquants' }
    }
    const supabase = createClient()
    const { data, error } = await supabase
        .from('messages')
        .insert({ match_id: matchId, sender_id: senderId, content, type })
        .select()
        .single()

    return { data: data ?? null, error: error?.message ?? null }
}

// ─── Mark messages as read ────────────────────────────────────────────────────

export async function markMessagesAsRead(
    matchId: string,
    userId: string
): Promise<void> {
    if (!matchId || !userId) return
    const supabase = createClient()
    await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('match_id', matchId)
        .neq('sender_id', userId)
        .is('read_at', null)
}

// ─── Get unread count per match (for badge system) ────────────────────────────
// Returns: { [matchId]: unreadCount }

export async function getUnreadPerMatch(
    userId: string,
    profileId: string
): Promise<Record<string, number>> {
    if (!userId || !profileId) return {}
    const supabase = createClient()

    // 1. Get all matches the current user is part of
    const { data: matches, error: matchErr } = await supabase
        .from('matches')
        .select('id')
        .or(`user1_id.eq.${profileId},user2_id.eq.${profileId}`)

    if (matchErr || !matches?.length) return {}

    // 2. Fetch all unread messages in those matches in a single query
    const matchIds = matches.map((m) => m.id)
    const { data: unreadMsgs, error: msgErr } = await supabase
        .from('messages')
        .select('match_id, id')
        .in('match_id', matchIds)
        .neq('sender_id', userId)   // sent by someone else
        .is('read_at', null)         // not yet read

    if (msgErr) return {}

    // 3. Group by match_id
    const counts: Record<string, number> = {}
    for (const msg of unreadMsgs ?? []) {
        counts[msg.match_id] = (counts[msg.match_id] ?? 0) + 1
    }
    return counts
}

// ─── Get total unread count (legacy / navbar) ─────────────────────────────────

export async function getUnreadCount(userId: string): Promise<number> {
    if (!userId) return 0
    const supabase = createClient()
    const { data: matches } = await supabase
        .from('matches')
        .select('id')
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)

    if (!matches?.length) return 0
    const matchIds = matches.map((m) => m.id)
    const { count } = await supabase
        .from('messages')
        .select('id', { count: 'exact' })
        .in('match_id', matchIds)
        .neq('sender_id', userId)
        .is('read_at', null)

    return count ?? 0
}

// ─── Delete a specific message ────────────────────────────────────────────────

export async function deleteMessage(
    messageId: string,
    userId: string
): Promise<{ error: string | null }> {
    const supabase = createClient()
    const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)
        .eq('sender_id', userId)

    return { error: error?.message ?? null }
}

// ─── Client-side: purge messages older than 24h ───────────────────────────────
// Called on conversation mount. Fallback if pg_cron is not available.

export async function purgeExpiredMessages(matchId: string): Promise<void> {
    if (!matchId) return
    const supabase = createClient()
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    await supabase
        .from('messages')
        .delete()
        .eq('match_id', matchId)
        .lt('created_at', cutoff)
}
