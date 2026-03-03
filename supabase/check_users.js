const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
})

async function checkUsers() {
    const { data: profiles, error: profileError } = await supabase.from('profiles').select('*').limit(5)
    console.log("Profiles example:", profiles)

    const { data: { users }, error } = await supabase.auth.admin.listUsers()
    console.log("Users count:", users.length)
    if (users.length > 0) {
        console.log("Sample user emails:", users.slice(0, 5).map(u => u.email))
    }
}

checkUsers()
