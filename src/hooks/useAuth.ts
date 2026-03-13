'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/store'
import { getProfile } from '@/services/profiles'

export function useAuth() {
    const { profile, isLoading, setProfile, setLoading, clearProfile } = useAuthStore()
    useEffect(() => {
        const supabase = createClient()

        async function initAuth() {
            setLoading(true)
            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (session?.user) {
                    const prof = await getProfile(session.user.id)
                    setProfile(prof) // prof might be null if not in DB
                } else {
                    clearProfile()
                }
            } catch (err) {
                console.error('Auth init error:', err)
                clearProfile()
            }
        }

        initAuth()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
                const prof = await getProfile(session.user.id)
                setProfile(prof)
            } else if (event === 'SIGNED_OUT') {
                clearProfile()
            }
        })

        return () => subscription.unsubscribe()
    }, [setProfile, clearProfile, setLoading])

    return { profile, isLoading }
}
