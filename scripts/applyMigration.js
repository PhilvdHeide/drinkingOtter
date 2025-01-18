import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { readFileSync } from 'fs'
import { join } from 'path'
import process from 'node:process'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
)

async function applyMigration() {
  try {
    const migrationPath = join(process.cwd(), 'supabase', 'migrations', '20240119170000_update_schema.sql')
    const migrationSQL = readFileSync(migrationPath, 'utf8')

    const { error } = await supabase.rpc('execute_sql', {
      query: migrationSQL
    })

    if (error) throw error
    console.log('Migration applied successfully')

  } catch (error) {
    console.error('Migration error:', {
      message: error.message,
      details: error.details,
      hint: error.hint
    })
  }
}

applyMigration()
