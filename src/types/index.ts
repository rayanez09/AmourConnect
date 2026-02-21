import type { Database } from './database.types'

// Profile types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

// Like types
export type Like = Database['public']['Tables']['likes']['Row']
export type LikeInsert = Database['public']['Tables']['likes']['Insert']

// Match types
export type Match = Database['public']['Tables']['matches']['Row']

// Message types
export type Message = Database['public']['Tables']['messages']['Row']
export type MessageInsert = Database['public']['Tables']['messages']['Insert']

// Subscription types
export type Subscription = Database['public']['Tables']['subscriptions']['Row']

// Report types
export type Report = Database['public']['Tables']['reports']['Row']
export type ReportInsert = Database['public']['Tables']['reports']['Insert']

// Block types
export type Block = Database['public']['Tables']['blocks']['Row']

// Extended types with relations
export type ProfileWithMatch = Profile & {
    match_id?: string
    is_liked?: boolean
    has_liked_me?: boolean
}

export type MatchWithProfiles = Match & {
    other_profile: Profile
    last_message?: Message | null
    unread_count?: number
}

export type MessageWithSender = Message & {
    sender: Pick<Profile, 'id' | 'full_name' | 'avatar_url'>
}

// Search filters
export interface SearchFilters {
    gender?: 'homme' | 'femme' | 'autre'
    min_age?: number
    max_age?: number
    city?: string
    radius_km?: number
}

// Auth types
export interface AuthUser {
    id: string
    email: string | undefined
    created_at: string
}

// Admin stats
export interface AdminStats {
    total_users: number
    premium_users: number
    total_matches: number
    total_messages: number
    new_users_today: number
    active_reports: number
}

// Pagination
export interface PaginatedResponse<T> {
    data: T[]
    count: number
    page: number
    per_page: number
    total_pages: number
}

// API Response wrapper
export interface ApiResponse<T = void> {
    data?: T
    error?: string
    success: boolean
}

// Plan features
export type PlanType = 'free' | 'premium' | 'premium_plus'

export interface PlanFeatures {
    can_see_who_liked: boolean
    can_use_advanced_filters: boolean
    daily_likes_limit: number | null
    can_see_read_receipts: boolean
    priority_search: boolean
}
