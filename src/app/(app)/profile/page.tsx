import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function MyProfileRedirectPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

    if (profile) {
        redirect(`/profile/${profile.id}`)
    } else {
        redirect('/profile/setup')
    }
}
