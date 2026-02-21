import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Profile } from '@/types'

// ─── Auth Store ───────────────────────────────────────────────────────────────

interface AuthState {
    profile: Profile | null
    isLoading: boolean
    setProfile: (profile: Profile | null) => void
    setLoading: (loading: boolean) => void
    clearProfile: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            profile: null,
            isLoading: true,
            setProfile: (profile) => set({ profile, isLoading: false }),
            setLoading: (isLoading) => set({ isLoading }),
            clearProfile: () => set({ profile: null, isLoading: false }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ profile: state.profile }),
        }
    )
)

// ─── Notification Store ───────────────────────────────────────────────────────
// unreadPerMatch: map of matchId → unread message count for that conversation

interface NotificationState {
    unreadPerMatch: Record<string, number>
    newMatches: number

    // Total unread across all conversations
    totalUnread: () => number

    // Set all unread counts at once (from initial fetch)
    setAllUnread: (counts: Record<string, number>) => void

    // Set/clear unread for a specific match
    setUnreadForMatch: (matchId: string, count: number) => void
    clearUnreadForMatch: (matchId: string) => void

    // Bump unread +1 for a specific match (realtime insert)
    incrementUnreadForMatch: (matchId: string) => void

    // Legacy helpers (still used in some places)
    setNewMatches: (count: number) => void
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    unreadPerMatch: {},
    newMatches: 0,

    totalUnread: () =>
        Object.values(get().unreadPerMatch).reduce((sum, n) => sum + n, 0),

    setAllUnread: (counts) => set({ unreadPerMatch: counts }),

    setUnreadForMatch: (matchId, count) =>
        set((state) => ({
            unreadPerMatch: { ...state.unreadPerMatch, [matchId]: count },
        })),

    clearUnreadForMatch: (matchId) =>
        set((state) => {
            const next = { ...state.unreadPerMatch }
            delete next[matchId]
            return { unreadPerMatch: next }
        }),

    incrementUnreadForMatch: (matchId) =>
        set((state) => ({
            unreadPerMatch: {
                ...state.unreadPerMatch,
                [matchId]: (state.unreadPerMatch[matchId] ?? 0) + 1,
            },
        })),

    setNewMatches: (newMatches) => set({ newMatches }),
}))
