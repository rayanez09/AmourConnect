// @ts-nocheck
'use client'

import { createClient } from '@/lib/supabase/client'
import type { Like, Match, MatchWithProfiles } from '@/types'

export async function sendLike(
    senderId: string,
    receiverId: string
): Promise<{ matched: boolean; error: string | null }> {
    const supabase = createClient()

    // Check if already liked
    const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('sender_id', senderId)
        .eq('receiver_id', receiverId)
        .single()

    if (existingLike) {
        return { matched: false, error: 'Vous avez dÃ©jÃ  likÃ© ce profil' }
    }

    // Insert like
    const { error: likeError } = await supabase
        .from('likes')
        .insert({ sender_id: senderId, receiver_id: receiverId })

    if (likeError) return { matched: false, error: likeError.message }

    // Check if mutual like (receiver liked sender before)
    const { data: mutualLike } = await supabase
        .from('likes')
        .select('id')
        .eq('sender_id', receiverId)
        .eq('receiver_id', senderId)
        .single()

    if (mutualLike) {
        // Create match
        const { error: matchError } = await supabase
            .from('matches')
            .insert({
                user1_id: senderId,
                user2_id: receiverId,
            })

        if (matchError) return { matched: false, error: matchError.message }
        return { matched: true, error: null }
    }

    return { matched: false, error: null }
}

export async function removeLike(
    senderId: string,
    receiverId: string
): Promise<{ error: string | null }> {
    const supabase = createClient()
    const { error } = await supabase
        .from('likes')
        .delete()
        .eq('sender_id', senderId)
        .eq('receiver_id', receiverId)

    return { error: error?.message ?? null }
}

export async function checkLikeStatus(
    senderId: string,
    receiverId: string
): Promise<{ liked: boolean; matched: boolean }> {
    const supabase = createClient()

    const [likeResult, matchResult] = await Promise.all([
        supabase
            .from('likes')
            .select('id')
            .eq('sender_id', senderId)
            .eq('receiver_id', receiverId)
            .single(),
        supabase
            .from('matches')
            .select('id')
            .or(
                `and(user1_id.eq.${senderId},user2_id.eq.${receiverId}),and(user1_id.eq.${receiverId},user2_id.eq.${senderId})`
            )
            .single(),
    ])

    return {
        liked: !!likeResult.data,
        matched: !!matchResult.data,
    }
}

export async function getMyLikes(userId: string): Promise<Like[]> {
    const supabase = createClient()
    const { data } = await supabase
        .from('likes')
        .select('*')
        .eq('sender_id', userId)
        .order('created_at', { ascending: false })

    return data ?? []
}

export async function getWhoLikedMe(userId: string): Promise<Like[]> {
    const supabase = createClient()
    const { data } = await supabase
        .from('likes')
        .select('*')
        .eq('receiver_id', userId)
        .order('created_at', { ascending: false })

    return data ?? []
}

export async function getMyMatches(userId: string): Promise<MatchWithProfiles[]> {
    const supabase = createClient()

    const { data: matches } = await supabase
        .from('matches')
        .select('*')
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .order('created_at', { ascending: false })

    if (!matches?.length) return []

    // Fetch other user profiles + last message + unread count
    const enriched = await Promise.all(
        matches.map(async (match) => {
            const otherId =
                match.user1_id === userId ? match.user2_id : match.user1_id

            const [profileRes, lastMsgRes, unreadRes] = await Promise.all([
                supabase.from('profiles').select('*').eq('user_id', otherId).single(),
                supabase
                    .from('messages')
                    .select('*')
                    .eq('match_id', match.id)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single(),
                supabase
                    .from('messages')
                    .select('id', { count: 'exact' })
                    .eq('match_id', match.id)
                    .neq('sender_id', userId)
                    .is('read_at', null),
            ])

            return {
                ...match,
                other_profile: profileRes.data!,
                last_message: lastMsgRes.data ?? null,
                unread_count: unreadRes.count ?? 0,
            } as MatchWithProfiles
        })
    )

    return enriched.filter((m) => m.other_profile !== null)
}

