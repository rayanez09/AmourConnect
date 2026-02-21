// @ts-nocheck
'use client'

import { createClient } from '@/lib/supabase/client'
import type { ReportInsert } from '@/types'

export async function reportUser(
    report: ReportInsert
): Promise<{ error: string | null }> {
    const supabase = createClient()

    // 1. Insert the new report
    const { error: insertError } = await supabase.from('reports').insert(report)
    if (insertError) return { error: insertError.message }

    // 2. Count distinct reporters for this reported user
    // Since Supabase doesn't easily return COUNT(DISTINCT) via simple select, 
    // we fetch all unique reporter IDs for this reported person
    const { data: reportsData } = await supabase
        .from('reports')
        .select('reporter_id')
        .eq('reported_id', report.reported_id)

    if (reportsData) {
        // Create a Set to count unique reporters
        const uniqueReporters = new Set(reportsData.map(r => r.reporter_id))

        // 3. Auto-ban logic: if 3 or more distinct users reported this person
        if (uniqueReporters.size >= 3) {
            await supabase
                .from('profiles')
                .update({ is_active: false })
                .eq('user_id', report.reported_id)
        }
    }

    return { error: null }
}

export async function blockUser(
    blockerId: string,
    blockedId: string
): Promise<{ error: string | null }> {
    const supabase = createClient()

    // Insert block
    const { error } = await supabase
        .from('blocks')
        .insert({ blocker_id: blockerId, blocked_id: blockedId })

    if (error && !error.message.includes('duplicate')) {
        return { error: error.message }
    }

    // We no longer remove matches between them, so the conversation history
    // and the "Match" block are preserved, allowing them to unblock if needed.

    return { error: null }
}

export async function unblockUser(
    blockerId: string,
    blockedId: string
): Promise<{ error: string | null }> {
    const supabase = createClient()
    const { error } = await supabase
        .from('blocks')
        .delete()
        .eq('blocker_id', blockerId)
        .eq('blocked_id', blockedId)

    return { error: error?.message ?? null }
}

export async function isBlocked(
    userId: string,
    targetId: string
): Promise<boolean> {
    const supabase = createClient()
    const { data } = await supabase
        .from('blocks')
        .select('id')
        .or(
            `and(blocker_id.eq.${userId},blocked_id.eq.${targetId}),and(blocker_id.eq.${targetId},blocked_id.eq.${userId})`
        )
        .limit(1)
        .single()

    return !!data
}

export async function getBlockStatus(
    currentUserId: string,
    targetUserId: string
): Promise<{ isBlockedByMe: boolean; isBlockedByThem: boolean }> {
    const supabase = createClient()
    const { data } = await supabase
        .from('blocks')
        .select('blocker_id, blocked_id')
        .or(
            `and(blocker_id.eq.${currentUserId},blocked_id.eq.${targetUserId}),and(blocker_id.eq.${targetUserId},blocked_id.eq.${currentUserId})`
        )

    if (!data || data.length === 0) {
        return { isBlockedByMe: false, isBlockedByThem: false }
    }

    const isBlockedByMe = data.some(b => b.blocker_id === currentUserId)
    const isBlockedByThem = data.some(b => b.blocker_id === targetUserId)

    return { isBlockedByMe, isBlockedByThem }
}

export async function getBlockedUsers(userId: string): Promise<string[]> {
    const supabase = createClient()
    const { data } = await supabase
        .from('blocks')
        .select('blocked_id')
        .eq('blocker_id', userId)

    return data?.map((b) => b.blocked_id) ?? []
}

