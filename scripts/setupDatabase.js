import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_KEY
)

async function setupDatabase() {
  const { error } = await supabase
    .query(`
      CREATE TABLE IF NOT EXISTS water_intake (
        id SERIAL PRIMARY KEY,
        user_id UUID REFERENCES auth.users NOT NULL,
        date DATE NOT NULL,
        amount_ml INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
        UNIQUE(user_id, date)
      );
    `)

  if (error) {
    console.error('Error creating table:', error)
    return
  }

  console.log('Table created successfully')
}

setupDatabase()
