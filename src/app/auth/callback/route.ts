// @ts-nocheck
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const token_hash = requestUrl.searchParams.get('token_hash')
    const type = requestUrl.searchParams.get('type')
    const origin = requestUrl.origin

    const supabase = await createClient()

    let authUser = null

    if (token_hash && type) {
        const { data, error } = await supabase.auth.verifyOtp({ token_hash, type })
        if (!error && data?.user) {
            authUser = data.user
        }
    } else if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error && data?.user) {
            authUser = data.user
        }
    }

    if (authUser) {
        // Check if profile exists, if not create one
        const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('user_id', authUser.id)
            .single()

        if (!existingProfile) {
            await supabase.from('profiles').insert({
                user_id: authUser.id,
                is_active: true,
                is_premium: false,
                is_verified: true, // Mark verified since email is verified
                visibility: 'public',
            })
        }

        // Redirect to profile setup if new user
        if (!existingProfile) {
            return NextResponse.redirect(`${origin}/profile/setup`)
        }

        return NextResponse.redirect(`${origin}/dashboard`)
    }

    return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_error`)
}
