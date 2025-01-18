import { createClient } from '@supabase/supabase-js'

const create_execute_sql_function = `
CREATE OR REPLACE FUNCTION execute_sql(query text) 
RETURNS void AS $$
BEGIN
  EXECUTE query;
END;
$$ LANGUAGE plpgsql;
`
import dotenv from 'dotenv'
import process from 'node:process'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
)

async function setupDatabase() {
  try {
    // Create execute_sql function
    const { error: functionError } = await supabase
      .from('sql')
      .insert({
        sql: create_execute_sql_function
      })
    
    if (functionError) throw functionError
    console.log('execute_sql function created successfully')

    // Create water_intake table
    const { error: waterError } = await supabase.rpc('execute_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS water_intake (
          id SERIAL PRIMARY KEY,
          user_id UUID REFERENCES auth.users NOT NULL,
          date DATE NOT NULL,
          amount_ml INTEGER NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
          UNIQUE(user_id, date)
        );
      `
    })

    if (waterError) throw waterError
    console.log('water_intake table created successfully')

    // Create profiles table
    const { error: profileError } = await supabase.rpc('execute_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS profiles (
          id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          avatar_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
        );
      `
    })

    if (profileError) throw profileError
    console.log('profiles table created successfully')

  } catch (error) {
    console.error('Database setup error:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      details: error.details,
      originalError: error,
      response: error?.response,
      status: error?.status,
      statusText: error?.statusText
    })
    console.log('Full error object:', error)
    console.log('Supabase client config:', {
      url: process.env.VITE_SUPABASE_URL,
      key: process.env.VITE_SUPABASE_SERVICE_KEY
    })
  }
}

setupDatabase()
