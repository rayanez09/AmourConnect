// @ts-nocheck
'use client'

import { createClient } from '@/lib/supabase/client'
import type { Profile, ProfileUpdate, SearchFilters, PaginatedResponse } from '@/types'
import imageCompression from 'browser-image-compression'

const ITEMS_PER_PAGE = 20

export async function getProfile(userId: string): Promise<Profile | null> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

    if (error) return null
    return data
}

export async function getProfileById(profileId: string): Promise<Profile | null> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .eq('is_active', true)
        .single()

    if (error) return null
    return data
}

export async function updateProfile(
    profileId: string,
    updates: ProfileUpdate
): Promise<{ error: string | null }> {
    const supabase = createClient()
    const { error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', profileId)

    return { error: error?.message ?? null }
}

export async function searchProfiles(
    currentUserId: string,
    filters: SearchFilters,
    page = 1
): Promise<PaginatedResponse<Profile>> {
    const supabase = createClient()
    const from = (page - 1) * ITEMS_PER_PAGE
    const to = from + ITEMS_PER_PAGE - 1

    // 1. Get current profile ID
    const { data: currentProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', currentUserId)
        .single()

    let likedProfileIds: string[] = []

    if (currentProfile) {
        // 2. Get IDs of profiles already liked
        const { data: likes } = await supabase
            .from('likes')
            .select('receiver_id')
            .eq('sender_id', currentProfile.id)

        if (likes && likes.length > 0) {
            likedProfileIds = likes.map(l => l.receiver_id)
        }
    }

    let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .neq('user_id', currentUserId)
        .eq('is_active', true)
        .neq('visibility', 'private')

    // 3. Exclude liked profiles
    if (likedProfileIds.length > 0) {
        query = query.not('id', 'in', `(${likedProfileIds.join(',')})`)
    }

    if (filters.gender) {
        query = query.eq('gender', filters.gender)
    }
    if (filters.min_age) {
        query = query.gte('age', filters.min_age)
    }
    if (filters.max_age) {
        query = query.lte('age', filters.max_age)
    }
    if (filters.city) {
        query = query.ilike('city', `%${filters.city}%`)
    }

    const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to)

    if (error) {
        return { data: [], count: 0, page, per_page: ITEMS_PER_PAGE, total_pages: 0 }
    }

    return {
        data: data ?? [],
        count: count ?? 0,
        page,
        per_page: ITEMS_PER_PAGE,
        total_pages: Math.ceil((count ?? 0) / ITEMS_PER_PAGE),
    }
}

export async function uploadAvatar(
    userId: string,
    file: File
): Promise<{ url: string | null; error: string | null }> {
    try {
        const supabase = createClient()

        // Compress image
        const compressed = await imageCompression(file, {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 800,
            useWebWorker: true,
        })

        const fileExt = file.name.split('.').pop()
        const fileName = `${userId}/avatar.${fileExt}`

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, compressed, { upsert: true })

        if (uploadError) return { url: null, error: uploadError.message }

        const { data } = supabase.storage.from('avatars').getPublicUrl(fileName)

        // Add cache-busting to force refresh
        const url = `${data.publicUrl}?t=${Date.now()}`

        return { url, error: null }
    } catch (err) {
        return { url: null, error: 'Erreur lors du tÃ©lÃ©chargement' }
    }
}

export async function deleteProfile(userId: string): Promise<{ error: string | null }> {
    const supabase = createClient()
    const { error } = await supabase
        .from('profiles')
        .update({ is_active: false })
        .eq('user_id', userId)

    return { error: error?.message ?? null }
}

