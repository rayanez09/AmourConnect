'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store'
import { getProfile } from '@/services/profiles'

export function useAuth() {
    const { profile, isLoading, setProfile, setLoading, clearProfile } = useAuthStore()
    const initialized = useRef(false)

    useEffect(() => {
        if (initialized.current) return
        initialized.current = true

        const supabase = createClient()

        // Initial session check
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (session?.user) {
                const prof = await getProfile(session.user.id)
                setProfile(prof)
            } else {
                clearProfile()
            }
        })

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                const prof = await getProfile(session.user.id)
                setProfile(prof)
            } else if (event === 'SIGNED_OUT') {
                clearProfile()
            } else if (event === 'TOKEN_REFRESHED' && session?.user) {
                const prof = await getProfile(session.user.id)
                setProfile(prof)
            }
        })

        return () => subscription.unsubscribe()
    }, [setProfile, clearProfile])

    return { profile, isLoading }
}
