import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role to bypass RLS

const supabase = createClient(supabaseUrl, supabaseKey)

async function testDatabase() {
  console.log("Testing Supabase connection...")
  
  // 1. Check if 'profiles' table exists and is accessible
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)

  if (profileError) {
    console.error("❌ Error accessing 'profiles' table. Schema might not be applied!", profileError)
  } else {
    console.log("✅ 'profiles' table is accessible!")
  }

  // 2. Try creating a demo user directly
  const testEmail = `demo@amourconnect.com`
  console.log(`\nCreating demo user: ${testEmail}`)
  
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: testEmail,
    password: 'Password123!',
    email_confirm: true // bypass email confirmation
  })

  if (authError) {
    console.error("❌ Failed to create user:", authError)
    return
  }
  
  console.log("✅ User created in auth.users! ID:", authData.user.id)
  
  // 3. Wait a second to allow trigger to run, then check if profile was created
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const { data: userProfile, error: userProfileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', authData.user.id)
    .single()
    
  if (userProfileError) {
    console.error("❌ Failed to fetch the created profile. The trigger 'handle_new_user' might be failing or missing!", userProfileError)
  } else if (!userProfile) {
     console.error("❌ Profile was not created! Check your handle_new_user trigger in Supabase Dashboard.")
  } else {
    console.log("✅ Profile successfully auto-created by database trigger!", userProfile)
    console.log("🎉 SUCCESS! The user demo@amourconnect.com with password 'Password123!' is ready to use.")
  }
}

testDatabase()
