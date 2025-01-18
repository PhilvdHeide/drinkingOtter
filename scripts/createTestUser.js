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
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'test@example.com',
      password: 'testpassword123',
      email_confirm: true
    })

    if (error) throw error
    console.log('Test user created successfully:', data)

  } catch (error) {
    console.error('Error creating test user:', error)
  }
}

createTestUser()
