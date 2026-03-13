const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
})

async function deleteIncompleteProfiles() {
    console.log('🗑️  Finding incomplete profiles (no name)...\n')

    // Find all profiles where full_name is null, empty string, or just whitespace
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('user_id, full_name, created_at')

    if (error) {
        console.error("Error fetching profiles:", error)
        return
    }

    const incompleteProfiles = profiles.filter(p => !p.full_name || p.full_name.trim() === '')

    console.log(`Total profiles checked: ${profiles.length}`)
    console.log(`Found ${incompleteProfiles.length} incomplete profiles to delete.`)

    if (incompleteProfiles.length === 0) return

    let deleted = 0
    let errors = 0

    // Delete each user from Auth (this cascades to profiles)
    for (const profile of incompleteProfiles) {
        if (!profile.user_id) continue

        console.log(`Attempting to delete user ID ${profile.user_id} created at ${profile.created_at}`)

        const { error: deleteError } = await supabase.auth.admin.deleteUser(profile.user_id)

        if (deleteError) {
            console.error(`Failed to delete user ID ${profile.user_id}:`, deleteError.message)
            errors++
        } else {
            console.log(`✅ Deleted incomplete user: ${profile.user_id}`)
            deleted++
        }

        await new Promise((r) => setTimeout(r, 100))
    }

    console.log(`\n✨ Cleanup complete!`)
    console.log(`   ✅ ${deleted} accounts deleted`)
    if (errors > 0) console.log(`   ⚠️ ${errors} errors occurred`)
}

deleteIncompleteProfiles()
