import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import process from 'node:process'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
)

async function createTestUser() {
  try {
    // Create or get test user
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: 'test@example.com',
      password: 'testpassword123',
      email_confirm: true
    })

    if (userError && userError.code !== 'email_exists') throw userError
    
    const userId = userError ? 
      (await supabase.auth.admin.getUserById(
        (await supabase.auth.admin.listUsers()).data.users.find(u => u.email === 'test@example.com').id
      )).data.user.id : 
      userData.user.id

    console.log('Using test user:', userId)

    // Ensure user exists in public.users table
    const { error: userProfileError } = await supabase
      .from('users')
      .upsert({
        id: userId,
        email: 'test@example.com',
        display_name: 'Test User'
      }, {
        onConflict: 'id'
      })

    if (userProfileError) throw userProfileError
    console.log('Created/updated user profile')

    // Delete existing test logs
    const { error: deleteError } = await supabase
      .from('water_logs')
      .delete()
      .eq('user_id', userId)

    if (deleteError) throw deleteError
    console.log('Deleted existing test logs')

    // Add test water logs
    const testLogs = [
      { amount_ml: 250, drink_type: 'water', logged_at: new Date().toISOString() },
      { amount_ml: 300, drink_type: 'coffee', logged_at: new Date(Date.now() - 3600000).toISOString() },
      { amount_ml: 500, drink_type: 'water', logged_at: new Date(Date.now() - 7200000).toISOString() }
    ]

    const { data: logsData, error: logsError } = await supabase
      .from('water_logs')
      .insert(testLogs.map(log => ({ ...log, user_id: userId })))
      .select()

    if (logsError) throw logsError

    console.log('Added test water logs:')
    console.table(logsData)

  } catch (error) {
    console.error('Error:', error)
  }
}

createTestUser()
